using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", (Func<HttpRequest, Task<string>>)((req) => {

  Console.WriteLine("Handling index request");

  return Task.FromResult("Hello DotNet World!");
  
}));

app.MapGet("/env", () => {

  Console.WriteLine("Handling /env request");

  return JsonConvert.SerializeObject(Environment.GetEnvironmentVariables(), new JsonSerializerSettings
  {
    Formatting = Formatting.Indented
  });

});

app.Run();
