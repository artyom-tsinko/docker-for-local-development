using DotNet.Testcontainers;
using DotNet.Testcontainers.Builders;
using Microsoft.Extensions.Logging;
using Testcontainers.Redis;

namespace Hbm.DotNet.App.IntegrationTests;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task Test1()
    {
        ConsoleLogger.Instance.DebugLogLevelEnabled = true;

        // Assert.Pass();

        Console.WriteLine("Test1!");

        var logger = LoggerFactory
                .Create(builder => builder.AddConsole())
                .CreateLogger<ContainerBuilder>();
        
        // Console.WriteLine("Creating Redis container");

        logger.LogInformation("Creating container");

        // new GenericContainer(DockerImageName.Parse("jboss/wildfly:9.0.1.Final")).Start();
        

        // Create a new instance of a container.
        var container = new ContainerBuilder()
        // Set the image for the container to "testcontainers/helloworld:1.1.0".
        .WithImage("testcontainers/helloworld:1.1.0")
        // Bind port 8080 of the container to a random port on the host.
        .WithPortBinding(8080, true)
        // Wait until the HTTP endpoint of the container is available.
        .WithWaitStrategy(Wait.ForUnixContainer().UntilHttpRequestIsSucceeded(r => r.ForPort(8080)))
        // Build the container configuration.
        .Build();

        logger.LogInformation("Starting container");

        // Start the container.
        await 
        container.StartAsync()
        .ConfigureAwait(false);

        logger.LogInformation("Container started");

        // Create a new instance of HttpClient to send HTTP requests.
        var httpClient = new HttpClient();

        // Construct the request URI by specifying the scheme, hostname, assigned random host port, and the endpoint "uuid".
        var requestUri = new UriBuilder(Uri.UriSchemeHttp, container.Hostname, container.GetMappedPublicPort(8080), "uuid").Uri;

        // Send an HTTP GET request to the specified URI and retrieve the response as a string.
        var guid = await httpClient.GetStringAsync(requestUri)
        .ConfigureAwait(false);

        logger.LogInformation($"Container started: {guid}");

        // await Task.Delay(TimeSpan.FromSeconds(180));

        await container.DisposeAsync();

    }
}