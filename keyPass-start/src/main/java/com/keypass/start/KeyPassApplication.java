package com.keypass.start;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

/**
 * Spring Boot 启动入口。
 */
@Log4j2
@SpringBootApplication
public class KeyPassApplication {

    /**
     * 启动 KeyPass 服务并输出本次监听配置，便于本地和部署环境确认实例状态。
     *
     * @param args 命令行启动参数
     */
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(KeyPassApplication.class, args);
        Environment environment = context.getEnvironment();
        log.info("{} started on port {} with context path {}",
                environment.getRequiredProperty("spring.application.name"),
                environment.getRequiredProperty("server.port"),
                environment.getRequiredProperty("server.servlet.context-path"));
        log.info("Service Application Started ! ");
    }
}
