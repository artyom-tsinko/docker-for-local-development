package hbm.java.app.hbm_java_app;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class IndexController {

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/")
    public String index() {
        System.out.println("Serving /");
        return String.format("Welcome to %s!", appConfig.getName());
    }

    @GetMapping("/env")
    public Map<String, String> getEnv() {
        System.out.println("Serving /env");
        return System.getenv();
    }

    @PostMapping("/connect")
    public Map<String, String> postConnect(@RequestBody ConnectRequest connectRequest) {
        System.out.println("Serving /connect");

        System.out.println("Host: " + connectRequest.getHost());
        System.out.println("Port: " + connectRequest.getPort());

        RestTemplate restTemplate = new RestTemplate();

        String url = String.format("http://%s:%s/env", connectRequest.getHost(), connectRequest.getPort());

        try {
            Map<String, String> remoteEnv = restTemplate.getForObject(url, Map.class);
            return remoteEnv;
        } catch (Exception e) {
            System.out.println("Failed to connect to " + connectRequest.getHost() + ":" + connectRequest.getPort() + " - " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/health")
    public Map<String, String> getHealth() {
        System.out.println("Serving /health");

        Map<String, String> healthStatus = new HashMap<>();

        healthStatus.put("postgres", checkPostgresConnection() ? "OK" : "Fail");
        healthStatus.put("rabbitmq", checkRabbitMQConnection() ? "OK" : "Fail");
        healthStatus.put("redis", checkRedisConnection() ? "OK" : "Fail");

        return healthStatus;
    }

    private boolean checkPostgresConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return true;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }

    private boolean checkRedisConnection() {
        try {
            redisTemplate.opsForValue().get("test");
            return true;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }

    private boolean checkRabbitMQConnection() {
        try {
            rabbitTemplate.execute(channel -> {
                String queueName = channel.queueDeclare().getQueue();
                channel.queueDelete(queueName);
                return true;
            });
            return true;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }
}
