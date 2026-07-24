package com.keypass.business.login.service;

/**
 * 用于校验主密码的登录领域服务定义。
 */
public interface LoginService {

    /**
     * 校验输入的主密码能否解锁本地密码库。
     *
     * @param masterPassword 用户输入的主密码
     * @return 密码正确时返回 true
     */
    boolean verifyMasterPassword(String masterPassword);
}
