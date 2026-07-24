package com.keypass.start.config;

import com.keypass.base.common.BaseConstants;
import com.keypass.business.account.service.AccountService;
import com.keypass.business.account.service.impl.InMemoryAccountService;
import com.keypass.business.login.service.LoginService;
import com.keypass.business.login.service.impl.InMemoryLoginService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 初始内存实现的应用配置。
 */
@Configuration
public class AppConfig {

    /**
     * 在接入持久化存储前提供账号领域服务。
     *
     * @return 内存版账号服务
     */
    @Bean
    public AccountService accountService() {
        return new InMemoryAccountService();
    }

    /**
     * 在安全持久化认证数据前提供登录领域服务。
     *
     * @return 内存版登录服务
     */
    @Bean
    public LoginService loginService() {
        return new InMemoryLoginService();
    }

    /**
     * 返回用于展示和诊断的应用名称。
     *
     * @return 应用名称
     */
    public String appName() {
        return BaseConstants.APP_NAME;
    }

    /**
     * 返回初始本地环境使用的默认配置标识。
     *
     * @return 默认配置标识
     */
    public String profile() {
        return BaseConstants.DEFAULT_PROFILE;
    }

    /**
     * 构建命令行诊断使用的启动横幅文本。
     *
     * @return 启动横幅文本
     */
    public String banner() {
        return appName() + " booting with profile " + profile();
    }
}
