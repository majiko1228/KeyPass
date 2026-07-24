package com.keypass.business.login.service.impl;

import com.keypass.business.login.service.LoginService;

/**
 * 基于演示主密码的临时登录领域实现。
 */
public class InMemoryLoginService implements LoginService {

    private static final String DEMO_MASTER_PASSWORD = "keyPass-demo";

    /**
     * 使用初始内存值校验输入的主密码。
     *
     * @param masterPassword 用户输入的主密码
     * @return 与演示主密码一致时返回 true
     */
    @Override
    public boolean verifyMasterPassword(String masterPassword) {
        return DEMO_MASTER_PASSWORD.equals(masterPassword);
    }
}
