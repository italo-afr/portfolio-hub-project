using System.Text.Json;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Backend.Data;

public class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
    : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();

    public DbSet<TodoItem> Todos => Set<TodoItem>();

    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // SQLite não tem tipo array: as listas de strings viram JSON em uma coluna TEXT.
        var listComparer = new ValueComparer<List<string>>(
            (a, b) => a!.SequenceEqual(b!),
            v => v.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
            v => v.ToList());

        var project = modelBuilder.Entity<Project>();

        project.HasIndex(p => p.Slug).IsUnique();
        project.Property(p => p.Slug).HasMaxLength(120).IsRequired();
        project.Property(p => p.Title).HasMaxLength(160).IsRequired();
        project.Property(p => p.Tag).HasMaxLength(60);
        project.Property(p => p.Summary).HasMaxLength(600).IsRequired();
        project.Property(p => p.Type).HasMaxLength(20).IsRequired();

        project.Property(p => p.Tech)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
            .Metadata.SetValueComparer(listComparer);

        project.Property(p => p.Highlights)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
            .Metadata.SetValueComparer(listComparer);

        var todo = modelBuilder.Entity<TodoItem>();

        todo.Property(t => t.Title).HasMaxLength(200).IsRequired();
        todo.Property(t => t.Notes).HasMaxLength(1000);
        // Prioridade fica como int (Low=0, Normal=1, High=2) de propósito: assim o
        // ORDER BY do banco ordena por severidade. Gravada como texto, o SQLite
        // ordenaria alfabeticamente e "Normal" viria antes de "High".
        // Na API ela continua saindo como texto — ver JsonStringEnumConverter em Program.cs.
        todo.Property(t => t.Priority).HasConversion<int>();
        todo.HasIndex(t => t.IsDone);

        var transaction = modelBuilder.Entity<Transaction>();

        transaction.Property(t => t.Title).HasMaxLength(120).IsRequired();
        transaction.Property(t => t.Type).HasMaxLength(10).IsRequired();
        transaction.Property(t => t.Category).HasMaxLength(60).IsRequired();
        // Consultas do app sempre filtram/agrupam por data e por tipo.
        transaction.HasIndex(t => t.Date);
        transaction.HasIndex(t => t.Type);

        var chat = modelBuilder.Entity<ChatMessage>();

        chat.Property(m => m.Room).HasMaxLength(40).IsRequired();
        chat.Property(m => m.User).HasMaxLength(ChatLimits.MaxUserLength).IsRequired();
        chat.Property(m => m.Text).HasMaxLength(ChatLimits.MaxTextLength).IsRequired();
        // O histórico é sempre "as N últimas de uma sala".
        chat.HasIndex(m => new { m.Room, m.Id });
    }
}
