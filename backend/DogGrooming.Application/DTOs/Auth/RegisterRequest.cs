using System.ComponentModel.DataAnnotations;

namespace DogGrooming.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "יש להזין שם משתמש")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "שם המשתמש חייב להכיל בין 3 ל-50 תווים")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "יש להזין סיסמה")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "הסיסמה חייבת להכיל לפחות 6 תווים")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "יש להזין שם פרטי")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "שם פרטי ארוך מדי")]
    public string FirstName { get; set; } = string.Empty;
}
