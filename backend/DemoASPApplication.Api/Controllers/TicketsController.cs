using DemoASPApplication.Api.Data;
using DemoASPApplication.Api.Dtos.Tickets;
using DemoASPApplication.Api.Entities;
using DemoASPApplication.Api.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoASPApplication.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TicketsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetAll()
    {
        List<TicketDto> tickets = await _dbContext.Tickets
            .Include(t => t.Category)
            .OrderByDescending(t => t.Id)
            .Select(t => new TicketDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                CreatedAt = t.CreatedAt
            }).ToListAsync();

        return Ok(tickets);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TicketDto>> GetById(int id)
    {
        TicketDto? ticket = await _dbContext.Tickets.Include(t => t.Category).Where(t => t.Id == id).Select(t =>
            new TicketDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                CreatedAt = t.CreatedAt
            }).FirstOrDefaultAsync();

        if (ticket is null)
        {
            return NotFound(new
            {
                message = $"A(z) {id} azonositoju ticket nem talalhato."
            });
        }

        return Ok(ticket);
    }

    [HttpPost]
    public async Task<ActionResult<TicketDto>> Create([FromBody] CreateTicketDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest(new
            {
                message = "A cim megadasa kotelezo"
            });
        }

        bool categotyExists = await _dbContext.Categories.AnyAsync(c => c.Id == dto.CategoryId);

        if (!categotyExists)
        {
            return BadRequest(new
            {
                message = "A megadott kategoria nem letezik."
            });
        }

        Ticket newTicket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = TicketStatus.Open,
            Priority = dto.Priority,
            CreatedAt = DateTime.UtcNow,
            CategoryId = dto.CategoryId
        };
        _dbContext.Tickets.Add(newTicket);
        await _dbContext.SaveChangesAsync();

        TicketDto createdTicket = await _dbContext.Tickets
            .Include(t => t.Category)
            .Where(t => t.Id == newTicket.Id)
            .Select(t => new TicketDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                CreatedAt = t.CreatedAt
            }).FirstAsync();

        return CreatedAtAction(nameof(GetById), new { id = createdTicket.Id }, createdTicket);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        Ticket? ticket = await _dbContext.Tickets.FirstOrDefaultAsync(t => t.Id == id);

        if (ticket is null)
        {
            return NotFound(new
            {
                message = $"A(z) {id} azonositoju ticket nem talalhato."
            });
        }

        _dbContext.Tickets.Remove(ticket);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<TicketDto>> UpdateStatus(int id)
    {
        Ticket? ticket = await _dbContext.Tickets
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket is null)
        {
            return NotFound(new
            {
                message = $"A(z) {id} azonositoju ticket nem talalhato."
            });
        }

        if (ticket.Status == TicketStatus.Open)
        {
            ticket.Status = TicketStatus.InProgress;
        }
        else if (ticket.Status == TicketStatus.InProgress)
        {
            ticket.Status = TicketStatus.Resolved;
        }
        else if (ticket.Status == TicketStatus.Resolved)
        {
            ticket.Status = TicketStatus.Closed;
        }

        await _dbContext.SaveChangesAsync();

        TicketDto updatedTicket = new TicketDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CategoryId = ticket.CategoryId,
            CategoryName = ticket.Category.Name,
            CreatedAt = ticket.CreatedAt
        };

        return Ok(updatedTicket);
    }
}