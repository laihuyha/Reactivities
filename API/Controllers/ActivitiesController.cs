using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Base;
using Application.Activities;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityById(string id)
        {
            return await Mediator.Send(new Details.Query { Id = Guid.Parse(id) });
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
            return Ok(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = Guid.Parse(id) }));
        }
    }
}