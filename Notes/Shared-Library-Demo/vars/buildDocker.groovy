// vars/buildDocker.groovy
def call(String imageName, String tag) {
    echo "Starting Docker Build Process..."
    sh "docker build -t ${imageName}:${tag} ."
    echo "Successfully built ${imageName}:${tag}"
}
