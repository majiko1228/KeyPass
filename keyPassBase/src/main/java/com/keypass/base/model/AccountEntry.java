package com.keypass.base.model;

import java.util.Collections;
import java.util.List;

/**
 * Minimal account entry shared by the business and start modules.
 */
public class AccountEntry {

    private final String id;
    private final String title;
    private final String username;
    private final String url;
    private final List<String> tags;

    public AccountEntry(String id, String title, String username, String url, List<String> tags) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.url = url;
        this.tags = tags == null ? Collections.emptyList() : Collections.unmodifiableList(tags);
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getUsername() {
        return username;
    }

    public String getUrl() {
        return url;
    }

    public List<String> getTags() {
        return tags;
    }
}
