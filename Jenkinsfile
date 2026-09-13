pipeline {

    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = 'devai-chess'
        AWS_ACCOUNT_ID = '988031158209'

        IMAGE_TAG = "${BUILD_NUMBER}"

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_IMAGE = "${ECR_REGISTRY}/${ECR_REPOSITORY}"

        KUBECONFIG = '/var/lib/jenkins/.kube/config'
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

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy image \
                    --exit-code 0 \
                    ${ECR_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Scout Security Scan') {
            steps {
                sh '''
                    docker scout cves \
                    ${ECR_IMAGE}:${IMAGE_TAG} \
                    --only-severity critical,high \
                    --exit-code 0
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

        stage('Deploy to EKS') {
            steps {
                sh '''
                    aws eks update-kubeconfig \
                        --region ${AWS_REGION} \
                        --name devai-chess-eks \
                        --kubeconfig ${KUBECONFIG}

                    kubectl \
                        --kubeconfig ${KUBECONFIG} \
                        apply -f k8s/deployment.yaml \
                        -n devai-chess

                    kubectl \
                        --kubeconfig ${KUBECONFIG} \
                        apply -f k8s/service.yaml \
                        -n devai-chess

                    kubectl \
                        --kubeconfig ${KUBECONFIG} \
                        set image deployment/devai-chess \
                        devai-chess=${ECR_IMAGE}:${IMAGE_TAG} \
                        -n devai-chess

                    kubectl \
                        --kubeconfig ${KUBECONFIG} \
                        rollout status deployment/devai-chess \
                        -n devai-chess \
                        --timeout=180s
                '''
            }
        }
    }

    post {

        success {
            echo 'DevAI Chess CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'DevAI Chess pipeline failed.'
        }

        always {
            echo 'DevAI Chess pipeline execution completed.'
        }
    }

}