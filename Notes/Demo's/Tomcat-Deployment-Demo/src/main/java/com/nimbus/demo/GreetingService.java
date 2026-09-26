package com.nimbus.demo;

/**
 * A simple utility class to demonstrate Java source code in the project.
 * Used by the JSP page to display a greeting message.
 */
public class GreetingService {

    /**
     * Returns a greeting message for the given name.
     * @param name The name to greet.
     * @return A formatted greeting string.
     */
    public String getGreeting(String name) {
        return "Hello, " + name + "! Welcome to Nimbus DevOps Training.";
    }
}
