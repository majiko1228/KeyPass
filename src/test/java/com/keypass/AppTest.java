package com.keypass;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppTest {

    /**
     * Verifies the default application greeting.
     */
    @Test
    void greetingReturnsProjectName() {
        assertEquals("Hello, KeyPass!", App.greeting());
    }
}
