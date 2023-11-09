using System.Threading.Tasks;
using API.Base;
using Application.Photos.Handler;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotoController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPost("setmain/{id}")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command { PhotoPublicId = id }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}