using DogGrooming.Application.Common;
using DogGrooming.Application.DTOs.Appointments;
using DogGrooming.Application.Interfaces.Repositories;
using DogGrooming.Application.Services;
using DogGrooming.Domain.Entities;
using Moq;
using Xunit;

namespace DogGrooming.UnitTests.Services;

public class AppointmentServiceTests
{
    private readonly Mock<IAppointmentRepository> _appointments = new();
    private readonly Mock<IHaircutTypeRepository> _haircutTypes = new();

    private AppointmentService CreateService() => new(_appointments.Object, _haircutTypes.Object);

    private static Appointment MakeAppointment(
        int id, int userId, DateTime scheduled, bool discount = false, decimal price = 100m, int haircutTypeId = 1)
        => new()
        {
            Id = id,
            UserId = userId,
            ScheduledTime = scheduled,
            CreatedAt = DateTime.UtcNow,
            FinalPrice = price,
            DiscountApplied = discount,
            HaircutTypeId = haircutTypeId,
            User = new User { Id = userId, FirstName = "לקוח", Username = "client" },
            HaircutType = new HaircutType { Id = haircutTypeId, Name = "Small dog", DurationMinutes = 30, Price = price },
        };

    private static HaircutType Haircut(int id, string name, int minutes, decimal price)
        => new() { Id = id, Name = name, DurationMinutes = minutes, Price = price };

    // ---- Create ----

    [Fact]
    public async Task CreateAsync_Throws_WhenScheduledTimeInPast()
    {
        var service = CreateService();
        var request = new CreateAppointmentRequest { HaircutTypeId = 1, ScheduledTime = DateTime.UtcNow.AddDays(-1) };

        await Assert.ThrowsAsync<BusinessRuleException>(() => service.CreateAsync(request, currentUserId: 1));
        _appointments.Verify(a => a.CreateViaProcedureAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<DateTime>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_Throws_WhenHaircutTypeDoesNotExist()
    {
        _haircutTypes.Setup(h => h.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((HaircutType?)null);
        var service = CreateService();
        var request = new CreateAppointmentRequest { HaircutTypeId = 99, ScheduledTime = DateTime.UtcNow.AddDays(2) };

        await Assert.ThrowsAsync<BusinessRuleException>(() => service.CreateAsync(request, currentUserId: 1));
    }

    [Fact]
    public async Task CreateAsync_Valid_CallsStoredProcedure_AndReturnsOwnedDetails()
    {
        _haircutTypes.Setup(h => h.GetByIdAsync(1)).ReturnsAsync(Haircut(1, "Small dog", 30, 100m));
        var created = MakeAppointment(5, userId: 1, DateTime.UtcNow.AddDays(2));
        _appointments.Setup(a => a.CreateViaProcedureAsync(1, 1, It.IsAny<DateTime>())).ReturnsAsync(created);
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(created);

        var service = CreateService();
        var dto = await service.CreateAsync(new CreateAppointmentRequest { HaircutTypeId = 1, ScheduledTime = DateTime.UtcNow.AddDays(2) }, currentUserId: 1);

        _appointments.Verify(a => a.CreateViaProcedureAsync(1, 1, It.IsAny<DateTime>()), Times.Once);
        Assert.Equal(5, dto.Id);
        Assert.True(dto.IsMine);
    }

    // ---- Update ----

    [Fact]
    public async Task UpdateAsync_Throws_NotFound_WhenAppointmentMissing()
    {
        _appointments.Setup(a => a.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Appointment?)null);
        var service = CreateService();

        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.UpdateAsync(5, new UpdateAppointmentRequest { HaircutTypeId = 1, ScheduledTime = DateTime.UtcNow.AddDays(2) }, currentUserId: 1));
    }

    [Fact]
    public async Task UpdateAsync_Throws_Forbidden_WhenNotOwner()
    {
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(MakeAppointment(5, userId: 2, DateTime.UtcNow.AddDays(2)));
        var service = CreateService();

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            service.UpdateAsync(5, new UpdateAppointmentRequest { HaircutTypeId = 1, ScheduledTime = DateTime.UtcNow.AddDays(2) }, currentUserId: 1));
        _appointments.Verify(a => a.UpdateAsync(It.IsAny<Appointment>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_RecomputesPrice_KeepingDiscountFlag()
    {
        var appointment = MakeAppointment(5, userId: 1, DateTime.UtcNow.AddDays(2), discount: true, price: 100m);
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(appointment);
        _haircutTypes.Setup(h => h.GetByIdAsync(2)).ReturnsAsync(Haircut(2, "Large dog", 90, 200m));

        var service = CreateService();
        var dto = await service.UpdateAsync(5, new UpdateAppointmentRequest { HaircutTypeId = 2, ScheduledTime = DateTime.UtcNow.AddDays(2) }, currentUserId: 1);

        _appointments.Verify(a => a.UpdateAsync(It.IsAny<Appointment>()), Times.Once);
        Assert.Equal(180m, dto.FinalPrice); // 200 * 0.90 (discount preserved)
        Assert.True(dto.DiscountApplied);
    }

    // ---- Delete ----

    [Fact]
    public async Task DeleteAsync_Throws_Forbidden_WhenNotOwner()
    {
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(MakeAppointment(5, userId: 2, DateTime.UtcNow.AddDays(2)));
        var service = CreateService();

        await Assert.ThrowsAsync<ForbiddenException>(() => service.DeleteAsync(5, currentUserId: 1));
        _appointments.Verify(a => a.DeleteAsync(It.IsAny<Appointment>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_Throws_WhenScheduledForToday()
    {
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(MakeAppointment(5, userId: 1, DateTime.UtcNow));
        var service = CreateService();

        await Assert.ThrowsAsync<BusinessRuleException>(() => service.DeleteAsync(5, currentUserId: 1));
        _appointments.Verify(a => a.DeleteAsync(It.IsAny<Appointment>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_Succeeds_ForOwner_OnFutureDate()
    {
        var appointment = MakeAppointment(5, userId: 1, DateTime.UtcNow.AddDays(2));
        _appointments.Setup(a => a.GetByIdAsync(5)).ReturnsAsync(appointment);
        var service = CreateService();

        await service.DeleteAsync(5, currentUserId: 1);

        _appointments.Verify(a => a.DeleteAsync(appointment), Times.Once);
    }

    // ---- Queue flags ----

    [Fact]
    public async Task GetQueueAsync_SetsOwnershipAndActionFlags()
    {
        var items = new List<AppointmentQueueItem>
        {
            new() { AppointmentId = 1, UserId = 1, ScheduledTime = DateTime.UtcNow.AddDays(2) }, // mine, future
            new() { AppointmentId = 2, UserId = 1, ScheduledTime = DateTime.UtcNow },             // mine, today
            new() { AppointmentId = 3, UserId = 2, ScheduledTime = DateTime.UtcNow.AddDays(2) }, // not mine
        };
        _appointments.Setup(a => a.QueryQueueAsync()).ReturnsAsync(items);
        var service = CreateService();

        var result = await service.GetQueueAsync(currentUserId: 1);

        var mineFuture = result.Single(r => r.Id == 1);
        Assert.True(mineFuture.IsMine);
        Assert.True(mineFuture.CanEdit);
        Assert.True(mineFuture.CanDelete);

        var mineToday = result.Single(r => r.Id == 2);
        Assert.True(mineToday.IsMine);
        Assert.True(mineToday.CanEdit);
        Assert.False(mineToday.CanDelete); // same-day cannot be deleted

        var notMine = result.Single(r => r.Id == 3);
        Assert.False(notMine.IsMine);
        Assert.False(notMine.CanEdit);
        Assert.False(notMine.CanDelete);
    }
}
