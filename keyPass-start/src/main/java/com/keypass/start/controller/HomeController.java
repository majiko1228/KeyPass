package com.keypass.start.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 将首页目录 URL 路由到对应的静态首页文件。
 */
@Controller
public class HomeController {

    /**
     * 将常见的两种首页 URL 形式转发到打包后的静态页面。
     *
     * @return 静态首页路径
     */
    @GetMapping({"/home", "/home/"})
    public String home() {
        return "forward:/home/index.html";
    }
}
