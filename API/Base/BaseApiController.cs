using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Base
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator mediator;
        protected IMediator _mediator => mediator ??= (IMediator) HttpContext.RequestServices.GetService(typeof(IMediator));
    }
}