package com.keypass.start;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class KeyPassApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void applicationContextLoads() {
    }

    /**
     * Ensures the directory-style home URL resolves to the static home page.
     *
     * @throws Exception when the MVC request cannot be completed
     */
    @Test
    void homeDirectoryRoutesToStaticPage() throws Exception {
        mockMvc.perform(get("/home/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/home/index.html"));
    }
}
