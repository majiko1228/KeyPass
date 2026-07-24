package com.keypass.start.controller;

import com.keypass.business.service.AccountService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Exposes minimal service status for local startup verification.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final AccountService accountService;

    public HealthController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * Reports that the HTTP service is available and includes the demo entry count.
     *
     * @return service health response
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("entryCount", accountService.listEntries().size());
        return response;
    }
}
