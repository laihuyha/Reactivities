using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Base
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= (IMediator)HttpContext.RequestServices.GetService(typeof(IMediator));

        protected IActionResult HandleResult<T>(Result<T> result)
        {
            return result == null
                ? NotFound()
                : result.IsSuccess && result.Value != null
                ? Ok(result.Value)
                : result.IsSuccess && result.Value == null ? NotFound() : BadRequest(result.Error);
        }
    }
}