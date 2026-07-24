package com.keypass.start;

import org.junit.jupiter.api.Test;
import com.keypass.business.login.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc
class KeyPassApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LoginService loginService;

    @Test
    void applicationContextLoads() {
    }

    /**
     * 验证目录形式的首页 URL 能正确转发到静态首页。
     *
     * @throws Exception MVC 请求无法完成时抛出
     */
    @Test
    void homeDirectoryRoutesToStaticPage() throws Exception {
        mockMvc.perform(get("/home/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/home/index.html"));
    }

    /**
     * 验证登录领域服务已通过 Spring 配置注册。
     */
    @Test
    void loginServiceVerifiesDemoPassword() {
        assertTrue(loginService.verifyMasterPassword("keyPass-demo"));
        assertFalse(loginService.verifyMasterPassword("invalid-password"));
    }
}
