package com.keypass.base.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 业务模块和启动模块共用的基础账号条目。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountEntry {

    private String id;
    private String title;
    private String username;
    private String url;
    private List<String> tags;
}
