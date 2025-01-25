package hbm.java.app.hbm_java_app;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @GetMapping("/")
    public String index() {
        System.out.println("Getting index page");
        return "Welcome to the Hbm Java App!";
    }

    @GetMapping("/env")
    public Map<String, String> getEnv() {
        System.out.println("Getting environment variables");
        return System.getenv();
    }
}