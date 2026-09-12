pipeline {

    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = 'devai-chess'
        AWS_ACCOUNT_ID = '988031158209'
        IMAGE_TAG = "${BUILD_NUMBER}"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_IMAGE = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${ECR_IMAGE}:${IMAGE_TAG} .
                    docker tag ${ECR_IMAGE}:${IMAGE_TAG} ${ECR_IMAGE}:latest
                '''
            }
        }

        stage('Docker Test') {
            steps {
                sh '''
                    docker images ${ECR_IMAGE}
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    docker push ${ECR_IMAGE}:${IMAGE_TAG}
                    docker push ${ECR_IMAGE}:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'DevAI Chess Docker image successfully pushed to ECR.'
        }

        failure {
            echo 'DevAI Chess pipeline failed.'
        }
    }
}