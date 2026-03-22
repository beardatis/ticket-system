using DemoASPApplication.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DemoASPApplication.Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Category> Categories => Set<Category>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().Property(c => c.Name).IsRequired().HasMaxLength(100);
        modelBuilder.Entity<Category>().Property(c => c.Description).HasMaxLength(500);

        modelBuilder.Entity<Ticket>().Property(t => t.Title).IsRequired().HasMaxLength(200);
        modelBuilder.Entity<Ticket>().Property(t => t.Description).HasMaxLength(500);
        modelBuilder.Entity<Ticket>().HasOne(t => t.Category).WithMany(c => c.Tickets).HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);


    }
}