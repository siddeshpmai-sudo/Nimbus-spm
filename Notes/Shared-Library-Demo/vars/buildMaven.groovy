// vars/buildMaven.groovy
def call(String goals = 'clean install', boolean skipTests = true) {
    echo "Starting Maven Build Process..."
    
    // Construct the maven command based on arguments
    String mvnCommand = "mvn ${goals}"
    if (skipTests) {
        mvnCommand += " -DskipTests"
    }
    
    // Execute the command
    sh mvnCommand
    
    echo "Maven build completed successfully with goals: ${goals}"
}
