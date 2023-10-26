using System;
using System.Threading.Tasks;
using API.Base;
using Application.Activities;
using Application.Core.Helpers.DirectoryTree.DirectorySpecification;
using Business.Helpers.DirectoryTree;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivityById(string id)
        {
            var result = await Mediator.Send(new Details.Query { Id = Guid.Parse(id) });
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            activity.Date = DateTime.Now.ToString("yyyyMMdd");
            return Ok(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(string id, Activity activity)
        {
            activity.Id = Guid.Parse(id);
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = Guid.Parse(id) }));
        }
    }
}