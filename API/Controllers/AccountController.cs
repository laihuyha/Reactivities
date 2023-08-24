using System.Threading.Tasks;
using API.DTO;
using API.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Login login)
        {
            var user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null) return Unauthorized();
            var res = await _userManager.CheckPasswordAsync(user, login.Password);

            return res
                ? Ok(new UserDTO { DisplayName = user.DisplayName, Image = null, UserName = user.UserName, Token = _tokenService.CreateToken(user) })
                : Unauthorized();
        }
    }
}