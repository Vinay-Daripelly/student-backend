pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/Vinay-Daripelly/student-backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Automated API Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Success') {
            steps {
                echo '✅ All API tests passed. Build is successful.'
            }
        }
    }
}
