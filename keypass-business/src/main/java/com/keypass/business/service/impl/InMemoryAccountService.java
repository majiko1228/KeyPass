package com.keypass.business.service.impl;

import com.keypass.base.model.AccountEntry;
import com.keypass.business.service.AccountService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Temporary in-memory implementation for the initial module scaffold.
 */
public class InMemoryAccountService implements AccountService {

    private final List<AccountEntry> entries = Arrays.asList(
            new AccountEntry("github", "GitHub", "majiko1228", "https://github.com", Arrays.asList("work", "dev")),
            new AccountEntry("mail", "Google Mail", "chen@example.com", "https://mail.google.com", Arrays.asList("personal"))
    );

    @Override
    public List<AccountEntry> listEntries() {
        return entries;
    }

    @Override
    public Optional<AccountEntry> findById(String id) {
        return entries.stream().filter(entry -> entry.getId().equals(id)).findFirst();
    }
}
