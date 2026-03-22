using DemoASPApplication.Api.Data;
using DemoASPApplication.Api.Dtos.Categories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoASPApplication.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CategoriesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        List<CategoryDto> categories = await _dbContext.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            }).ToListAsync();

        return Ok(categories);
    }
}