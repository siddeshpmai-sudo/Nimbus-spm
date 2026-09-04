package com.nimbus.demo;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Unit tests for GreetingService.
 * These are run during the 'mvn test' phase.
 */
public class GreetingServiceTest {

    @Test
    public void testGetGreeting() {
        GreetingService service = new GreetingService();
        String greeting = service.getGreeting("Siddesh");
        assertNotNull("Greeting should not be null", greeting);
        assertTrue("Greeting should contain the name", greeting.contains("Siddesh"));
    }
}
