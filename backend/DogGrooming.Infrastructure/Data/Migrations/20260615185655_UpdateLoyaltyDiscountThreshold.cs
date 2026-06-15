using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DogGrooming.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLoyaltyDiscountThreshold : Migration
    {
        // Loyalty discount now kicks in from the 4th booking: a customer with 3 or more
        // existing appointments (>= 3) gets 10% off the new one (previously required > 3).
        private const string ProcBody = @"
CREATE OR ALTER PROCEDURE sp_CreateAppointment
    @UserId         INT,
    @HaircutTypeId  INT,
    @ScheduledTime  DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BasePrice       DECIMAL(10,2);
    DECLARE @PastCount       INT;
    DECLARE @DiscountApplied BIT = 0;
    DECLARE @FinalPrice      DECIMAL(10,2);

    SELECT @BasePrice = Price FROM HaircutTypes WHERE Id = @HaircutTypeId;

    IF @BasePrice IS NULL
        THROW 51000, 'Invalid haircut type.', 1;

    -- Loyalty rule: from the 4th booking onward (3+ existing appointments) -> 10% off.
    SELECT @PastCount = COUNT(*) FROM Appointments WHERE UserId = @UserId;

    IF @PastCount >= 3
    BEGIN
        SET @DiscountApplied = 1;
        SET @FinalPrice = @BasePrice * 0.90;
    END
    ELSE
        SET @FinalPrice = @BasePrice;

    INSERT INTO Appointments (UserId, HaircutTypeId, ScheduledTime, CreatedAt, FinalPrice, DiscountApplied)
    VALUES (@UserId, @HaircutTypeId, @ScheduledTime, SYSUTCDATETIME(), @FinalPrice, @DiscountApplied);

    DECLARE @NewId INT = CAST(SCOPE_IDENTITY() AS INT);

    SELECT Id, UserId, HaircutTypeId, ScheduledTime, CreatedAt, FinalPrice, DiscountApplied
    FROM Appointments
    WHERE Id = @NewId;
END;";

        private const string PreviousProcBody = @"
CREATE OR ALTER PROCEDURE sp_CreateAppointment
    @UserId         INT,
    @HaircutTypeId  INT,
    @ScheduledTime  DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BasePrice       DECIMAL(10,2);
    DECLARE @PastCount       INT;
    DECLARE @DiscountApplied BIT = 0;
    DECLARE @FinalPrice      DECIMAL(10,2);

    SELECT @BasePrice = Price FROM HaircutTypes WHERE Id = @HaircutTypeId;

    IF @BasePrice IS NULL
        THROW 51000, 'Invalid haircut type.', 1;

    SELECT @PastCount = COUNT(*) FROM Appointments WHERE UserId = @UserId;

    IF @PastCount > 3
    BEGIN
        SET @DiscountApplied = 1;
        SET @FinalPrice = @BasePrice * 0.90;
    END
    ELSE
        SET @FinalPrice = @BasePrice;

    INSERT INTO Appointments (UserId, HaircutTypeId, ScheduledTime, CreatedAt, FinalPrice, DiscountApplied)
    VALUES (@UserId, @HaircutTypeId, @ScheduledTime, SYSUTCDATETIME(), @FinalPrice, @DiscountApplied);

    DECLARE @NewId INT = CAST(SCOPE_IDENTITY() AS INT);

    SELECT Id, UserId, HaircutTypeId, ScheduledTime, CreatedAt, FinalPrice, DiscountApplied
    FROM Appointments
    WHERE Id = @NewId;
END;";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(ProcBody);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(PreviousProcBody);
        }
    }
}
