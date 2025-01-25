using Testcontainers.Redis;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Networks;
using Testcontainers.MsSql;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using DotNet.Testcontainers;

namespace Hbm.DotNet.App.IntegrationTests;

// [SetUpFixture]
public static class IntegrationTestSetUpFixture
{

    public sealed record DockerContainers : IAsyncDisposable
    {
        public required INetwork Network { get; init; }

        // public required MsSqlContainer MsSql { get; init; }
        // public required RedisContainer Redis { get; init; }

        public async ValueTask DisposeAsync()
        {
            await Network.DeleteAsync();
            // await MsSql.DisposeAsync();
            // await Redis.DisposeAsync();
            await Network.DisposeAsync();
        }
    }

    private static DockerContainers? _infra = default;

    public static DockerContainers Containers { get => _infra ?? throw new InvalidOperationException("Docker infrastructure not initialized"); }


    // [OneTimeSetUp]
    public static async Task IntegrationTestSessionStart()
    {
        _infra = await CreateAndStartDockerContainers();
    }
    
    // [OneTimeTearDown]
    public static async Task IntegrationTestSessionComplete()
    {
        await _infra!.DisposeAsync();
        _infra = default;
    }

    private static async Task<DockerContainers> CreateAndStartDockerContainers()
    {
        var network = new NetworkBuilder()
            .WithName("test-network")
            .Build();

        // var msSqlContainer = new MsSqlBuilder()
        //     .WithName("mssql-server")
        //     .WithPassword("Qwerty_123")
        //     .WithPortBinding(hostPort: "21433", containerPort: "1433")
        //     .WithNetwork(network)
        //     .Build();
        
        
        // ILogger logger = loggerFactory.CreateLogger<IntegrationTestSetUpFixture>();

        // var redisContainer = new RedisBuilder()
        //     .WithImage("redis:latest")
        //     .WithName("redis")
        //     .WithPortBinding(hostPort: "6379", containerPort: "6379")
        //     .WithCommand("--maxmemory 10000000", "--maxmemory-policy volatile-lru")
        //     .WithNetwork(network)
        //     .WithLogger(logger)
        //     .Build();

        await network.CreateAsync();

        // start containers

        await Task.WhenAll(
            // msSqlContainer.StartAsync(),
            // redisContainer.StartAsync()
        );

        return new DockerContainers
        {
            // MsSql = msSqlContainer,
            // Redis = redisContainer,
            Network = network
        };
    }

}
