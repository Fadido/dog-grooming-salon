using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DogGrooming.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQueueViewAndCreateProc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ---- SQL VIEW used for retrieving the grooming queue ----
            migrationBuilder.Sql(@"
CREATE VIEW vw_AppointmentQueue AS
SELECT
    a.Id              AS AppointmentId,
    a.UserId          AS UserId,
    u.FirstName       AS CustomerFirstName,
    u.Username        AS Username,
    h.Name            AS DogType,
    h.DurationMinutes AS DurationMinutes,
    a.ScheduledTime   AS ScheduledTime,
    a.FinalPrice      AS FinalPrice,
    a.DiscountApplied AS DiscountApplied,
    a.CreatedAt       AS CreatedAt
FROM Appointments a
INNER JOIN Users u        ON u.Id = a.UserId
INNER JOIN HaircutTypes h ON h.Id = a.HaircutTypeId;");

            // ---- Stored procedure that creates an appointment, applying the loyalty discount ----
            migrationBuilder.Sql(@"
CREATE PROCEDURE sp_CreateAppointment
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

    -- Loyalty rule: a customer with more than 3 prior appointments gets 10% off future ones.
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

    -- Return the inserted row (columns match the Appointment entity for EF mapping).
    SELECT Id, UserId, HaircutTypeId, ScheduledTime, CreatedAt, FinalPrice, DiscountApplied
    FROM Appointments
    WHERE Id = @NewId;
END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateAppointment;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_AppointmentQueue;");
        }
    }
}
