using System.Security.Claims;
using System.Threading.Tasks;
using API.DTO;
using API.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
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

        [HttpPost("Register")]
        public async Task<IActionResult> Register(Register register)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == register.UserName)) return BadRequest("Username is taken");
            if (await _userManager.Users.AnyAsync(x => x.Email == register.Email)) return BadRequest($"Email is {register.Email} taken");
            var user = new AppUser
            {
                DisplayName = register.DisplayName,
                Email = register.Email,
                UserName = register.UserName
            };

            var result = await _userManager.CreateAsync(user, register.Password);
            return result.Succeeded
                ? Ok(new UserDTO { DisplayName = user.DisplayName, Image = null, UserName = user.UserName, Token = _tokenService.CreateToken(user) })
                : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> CurrentUser()
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            return user == null ? NoContent() : Ok(new UserDTO { DisplayName = user.DisplayName, Image = null, UserName = user.UserName, Token = _tokenService.CreateToken(user) });
        }
    }
}