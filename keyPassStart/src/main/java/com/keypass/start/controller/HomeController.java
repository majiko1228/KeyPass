package com.keypass.start.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Routes the home directory URL to its static index page.
 */
@Controller
public class HomeController {

    /**
     * Forwards both common home URL forms to the packaged static page.
     *
     * @return static home page path
     */
    @GetMapping({"/home", "/home/"})
    public String home() {
        return "forward:/home/index.html";
    }
}
