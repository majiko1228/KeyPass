package com.keypass.start.config;

import com.keypass.base.common.BaseConstants;
import com.keypass.business.service.AccountService;
import com.keypass.business.service.impl.InMemoryAccountService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Application configuration for the initial in-memory implementation.
 */
@Configuration
public class AppConfig {

    /**
     * Provides the account service until persistent storage is introduced.
     *
     * @return in-memory account service
     */
    @Bean
    public AccountService accountService() {
        return new InMemoryAccountService();
    }

    /**
     * Returns the configured application name for display and diagnostics.
     *
     * @return application name
     */
    public String appName() {
        return BaseConstants.APP_NAME;
    }

    /**
     * Returns the active default profile used by the initial local setup.
     *
     * @return default profile name
     */
    public String profile() {
        return BaseConstants.DEFAULT_PROFILE;
    }

    /**
     * Builds the startup banner used by command-line diagnostics.
     *
     * @return startup banner text
     */
    public String banner() {
        return appName() + " booting with profile " + profile();
    }
}
