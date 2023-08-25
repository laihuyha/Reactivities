using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class Register
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(16, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$", ErrorMessage = "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number")]
        public string Password { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}