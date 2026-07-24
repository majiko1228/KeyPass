package com.keypass.business.account.service.impl;

import com.keypass.base.model.AccountEntry;
import com.keypass.business.account.service.AccountService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * 项目初始阶段使用的内存版账号领域实现。
 */
public class InMemoryAccountService implements AccountService {

    private final List<AccountEntry> entries = Arrays.asList(
            new AccountEntry("github", "GitHub", "majiko1228", "https://github.com", Arrays.asList("work", "dev")),
            new AccountEntry("mail", "Google Mail", "chen@example.com", "https://mail.google.com", Arrays.asList("personal"))
    );

    /**
     * 返回当前内存密码库中的账号条目。
     *
     * @return 有效账号条目列表
     */
    @Override
    public List<AccountEntry> listEntries() {
        return entries;
    }

    /**
     * 查询账号条目，对调用方隐藏具体存储实现。
     *
     * @param id 账号条目标识
     * @return 匹配的账号条目，不存在时为空
     */
    @Override
    public Optional<AccountEntry> findById(String id) {
        return entries.stream().filter(entry -> entry.getId().equals(id)).findFirst();
    }
}
