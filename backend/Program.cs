var builder = WebApplication.CreateBuilder(args);

// 1. Agregar soporte para Controladores (Controllers)
builder.Services.AddControllers();

// 2. Configurar OpenAPI/Swagger (Mantenemos lo que ya tenías)
builder.Services.AddOpenApi();

// 3. Configurar CORS para permitir que tu React (puerto 5173) se conecte sin bloqueos
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // El puerto por defecto de Vite
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configurar el pipeline de almacenamiento HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 4. Activar la política de CORS (DEBE ir antes de MapControllers)
app.UseCors("PermitirReact");

app.UseAuthorization();

// 5. Mapear los controladores automáticos
app.MapControllers();

app.Run();