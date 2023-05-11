using System.Collections.Generic;
using System.Threading.Tasks;
using API.Base;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public Task<ActionResult<Activity>> GetActivityById(string id)
        {
            return Task.FromResult<ActionResult<Activity>>(Ok());
        }
    }
}