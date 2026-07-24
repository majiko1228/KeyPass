package com.keypass.start.controller;

import com.keypass.business.account.service.AccountService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 提供用于本地启动验证的基础服务状态接口。
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final AccountService accountService;

    public HealthController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * 返回 HTTP 服务可用状态及演示账号数量。
     *
     * @return 服务健康状态响应
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("entryCount", accountService.listEntries().size());
        return response;
    }
}
