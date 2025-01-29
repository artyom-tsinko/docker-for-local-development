using Newtonsoft.Json;
using Npgsql;
using RabbitMQ.Client;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to use host and port from configuration
builder.WebHost.ConfigureKestrel((context, options) =>
{
    var config = context.Configuration;
    var host = config["Application:Host"] ?? throw new InvalidOperationException("Application:Host is not configured");
    var port = config["Application:Port"] ?? throw new InvalidOperationException("Application:Port is not configured");
    options.Listen(System.Net.IPAddress.Parse(host), int.Parse(port));
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use CORS middleware
app.UseCors();

app.MapGet("/", async (IConfiguration config, HttpRequest req) => {
  Console.WriteLine("Serving /");
  await Task.Yield();
  return $"Welcome to {config["Application:Name"]}!";
});

app.MapGet("/env", () => {
  Console.WriteLine("Serving /env");
  var envVariables = Environment.GetEnvironmentVariables();
  return Results.Json(envVariables, contentType: "application/json");
});

app.MapPost("/connect", async (HttpRequest req) => {
  Console.WriteLine("Serving /connect");

  using var reader = new StreamReader(req.Body);
  var body = await reader.ReadToEndAsync();
  var input = JsonConvert.DeserializeObject<Dictionary<string, string>>(body);

  if (input == null || !input.ContainsKey("host") || !input.ContainsKey("port"))
  {
      return Results.BadRequest("Invalid input");
  }

  var host = input["host"];
  var port = input["port"];
  var url = $"http://{host}:{port}/env";

  try
  {
    using var httpClient = new HttpClient();
    var response = await httpClient.GetAsync(url);

    if (!response.IsSuccessStatusCode)
    {
      throw new InvalidOperationException($"Failed to connect to the specified host and port, status code: {response.StatusCode}"); 
    }

    return Results.Content(content: await response.Content.ReadAsStringAsync(), contentType: "application/json");
  }
  catch (Exception ex)
  {
    return Results.BadRequest(ex.Message);
  }
  
});

app.MapGet("/health", async (IConfiguration config) => {

  Console.WriteLine("Serving /health");

  var healthStatus = new Dictionary<string, string>();

  // Check Redis connection
  try
  {
    var redisConnectionString = config["Redis:ConnectionString"];
    var redis = await ConnectionMultiplexer.ConnectAsync(redisConnectionString);
    healthStatus["redis"] = redis.IsConnected ? "OK" : "Fail";
  }
  catch (Exception)
  {
    healthStatus["redis"] = "Fail";
  }

  // Check RabbitMQ connection
  try
  {
    var factory = new ConnectionFactory() { Uri = new Uri(config["RabbitMQ:ConnectionString"]) };
    
    using var connection = await factory.CreateConnectionAsync();
    using var channel = await connection.CreateChannelAsync();
    healthStatus["rabbitmq"] = "OK";
  }
  catch (Exception)
  {
    healthStatus["rabbitmq"] = "Fail";
  }

  // Check PostgreSQL connection
  try
  {
    var connectionString = config.GetConnectionString("PostgreSQL");
    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();
    healthStatus["postgres"] = "OK";
  }
  catch (Exception)
  {
    healthStatus["postgres"] = "Fail";
  }

  return Results.Json(healthStatus, contentType: "application/json");
});

app.Run();
