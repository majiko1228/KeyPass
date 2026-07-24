package com.keypass.business.account.service;

import com.keypass.base.model.AccountEntry;

import java.util.List;
import java.util.Optional;

/**
 * 账号领域服务定义。
 */
public interface AccountService {

    /**
     * 查询密码库中的全部有效账号条目。
     *
     * @return 有效账号条目列表
     */
    List<AccountEntry> listEntries();

    /**
     * 按唯一标识查询有效账号条目。
     *
     * @param id 账号条目标识
     * @return 匹配的账号条目，不存在时为空
     */
    Optional<AccountEntry> findById(String id);
}
