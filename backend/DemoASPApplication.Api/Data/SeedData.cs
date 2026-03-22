using DemoASPApplication.Api.Entities;
using DemoASPApplication.Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace DemoASPApplication.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (!context.Categories.Any())
        {
            Category bugCategory = new Category
            {
                Name = "Bugs",
                Description = "Hibajegyek a rendszer mukodesevel kapcsolatban"
            };
            Category featureCategory = new Category
            {
                Name = "Feature Request",
                Description = "Uj funkciora vonatkozo igenyek"
            };

            Category supportCategory = new Category
            {
                Name = "Support",
                Description = "Altalanos tamogatasi es hasznalati kerdesek"
            };

            context.Categories.AddRange(bugCategory, featureCategory, supportCategory);
            context.SaveChanges();
        }

        if (!context.Tickets.Any())
        {
            int bugCategoryId = context.Categories.First(c => c.Name == "Bugs").Id;
            int featureCategoryId = context.Categories.First(c => c.Name == "Feature Request").Id;
            int supportCategoryId = context.Categories.First(c => c.Name == "Support").Id;

            context.Tickets.AddRange(
                new Ticket
                {
                    Title = "Nem tud bejelentkezni a felhasznalo",
                    Description = "A felhasznalo a helyes jelszoval sem tud bejelentkezni",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.High,
                    CategoryId = bugCategoryId,
                    CreatedAt = DateTime.UtcNow.AddHours(-5),
                },
                new Ticket
                {
                    Title = "Dark mode igenylese",
                    Description = "A felhasznalo dark modot szeretne az alkalmazasba",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Medium,
                    CategoryId = featureCategoryId,
                    CreatedAt = DateTime.UtcNow.AddHours(-3),
                },
                new Ticket
                {
                    Title = "Exportalas funkcio magyarazata",
                    Description = "A felhasznalo segitseget ker, mert nem erti mi az az exportalas",
                    Status = TicketStatus.InProgress,
                    Priority = TicketPriority.Low,
                    CategoryId = supportCategoryId,
                    CreatedAt = DateTime.UtcNow.AddHours(-1),
                }
            );
            context.SaveChanges();
        }
    }
     public static async Task InitializeAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        if (!await context.Categories.AnyAsync(cancellationToken))
        {
            Category bugCategory = new Category
            {
                Name = "Bugs",
                Description = "Hibajegyek a rendszer mukodesevel kapcsolatban"
            };
            Category featureCategory = new Category
            {
                Name = "Feature Request",
                Description = "Uj funkciora vonatkozo igenyek"
            };

            Category supportCategory = new Category
            {
                Name = "Support",
                Description = "Altalanos tamogatasi es hasznalati kerdesek"
            };

            context.Categories.AddRange(bugCategory, featureCategory, supportCategory);
            await context.SaveChangesAsync(cancellationToken);
        }

        if (!await context.Tickets.AnyAsync(cancellationToken))
        {
            int bugCategoryId = context.Categories.First(c => c.Name == "Bugs").Id;
            int featureCategoryId = context.Categories.First(c => c.Name == "Feature Request").Id;
            int supportCategoryId = context.Categories.First(c => c.Name == "Support").Id;

            context.Tickets.AddRange(
                new Ticket
                {
                    Title = "Nem tud bejelentkezni a felhasznalo",
                    Description = "A felhasznalo a helyes jelszoval sem tud bejelentkezni",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.High,
                    CategoryId = bugCategoryId,
                    CreatedAt = DateTime.Now.AddHours(-5),
                },
                new Ticket
                {
                    Title = "Dark mode igenylese",
                    Description = "A felhasznalo dark modot szeretne az alkalmazasba",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Medium,
                    CategoryId = featureCategoryId,
                    CreatedAt = DateTime.Now.AddHours(-3),
                },
                new Ticket
                {
                    Title = "Exportalas funkcio magyarazata",
                    Description = "A felhasznalo segitseget ker, mert nem erti mi az az exportalas",
                    Status = TicketStatus.InProgress,
                    Priority = TicketPriority.Low,
                    CategoryId = supportCategoryId,
                    CreatedAt = DateTime.Now.AddHours(-1),
                }
            );
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}