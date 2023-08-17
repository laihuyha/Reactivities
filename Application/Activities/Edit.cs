using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper = null)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var activity = await _context.Activities.FindAsync(new object[] { request.Activity.Id }, cancellationToken: cancellationToken); // Find activity by ID
                    if (activity != null)
                    {
                        _mapper.Map(request.Activity, activity); // Map request.Activity to activity

                        await _context.SaveChangesAsync(cancellationToken); // Save changes to DB
                        return Result<Unit>.Success(Unit.Value);
                    }
                    return Result<Unit>.Failure("Activity not found");
                }
                catch (Exception ex)
                {
                    return Result<Unit>.Failure(ex.Message ?? ex.InnerException.Message);
                }
            }
        }
    }
}