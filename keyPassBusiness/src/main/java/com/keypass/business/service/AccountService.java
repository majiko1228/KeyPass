package com.keypass.business.service;

import com.keypass.base.model.AccountEntry;

import java.util.List;
import java.util.Optional;

/**
 * Business-facing account management contract.
 */
public interface AccountService {

    List<AccountEntry> listEntries();

    Optional<AccountEntry> findById(String id);
}
