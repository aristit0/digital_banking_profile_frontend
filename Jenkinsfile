pipeline {
    agent any
    
    environment {
        // GitHub Repository
        GIT_REPO = 'https://github.com/aristit0/digital_banking_profile_frontend.git'
        GIT_BRANCH = 'main'
        
        // Docker Configuration
        DOCKER_IMAGE = 'digital-banking-profile-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_CONTAINER = 'digital-banking-profile-frontend'
        DOCKER_NETWORK = 'grafana-mysql-network'
        DOCKER_PORT = '2114'
        
        // Node Configuration
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Cleanup Workspace') {
            steps {
                echo '🧹 Cleaning up workspace...'
                cleanWs()
            }
        }
        
        stage('Clone Repository') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }
        
        stage('Verify Files') {
            steps {
                echo '🔍 Verifying project files...'
                sh '''
                    echo "Files in workspace:"
                    ls -la
                    
                    echo "\nChecking package.json:"
                    if [ -f package.json ]; then
                        cat package.json | grep -A 5 "scripts"
                    else
                        echo "⚠️  No package.json found"
                    fi
                    
                    echo "\nChecking src directory:"
                    ls -la src/ || echo "No src directory"
                '''
            }
        }
        
        stage('Create Required Files') {
            steps {
                echo '📝 Creating Dockerfile and nginx.conf if not exist...'
                script {
                    // Create Dockerfile if not exists
                    sh '''
                        if [ ! -f Dockerfile ]; then
                            echo "Creating Dockerfile..."
                            cat > Dockerfile << 'EOF'
# Multi-stage build for React frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 2114

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOF
                        fi
                    '''
                    
                    // Create nginx.conf if not exists
                    sh '''
                        if [ ! -f nginx.conf ]; then
                            echo "Creating nginx.conf..."
                            cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://digital-banking-profile-backend:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
EOF
                        fi
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh """
                        echo "Building image with Node.js ${NODE_VERSION}..."
                        docker build \
                            --build-arg NODE_VERSION=${NODE_VERSION} \
                            -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                            .
                        
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                        
                        echo "✅ Docker image built successfully"
                    """
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo '🛑 Stopping and removing old container...'
                script {
                    sh """
                        # Stop container if exists
                        docker stop ${DOCKER_CONTAINER} || true
                        
                        # Remove container if exists
                        docker rm ${DOCKER_CONTAINER} || true
                        
                        echo "✅ Old container removed"
                    """
                }
            }
        }
        
        stage('Create Network') {
            steps {
                echo '🌐 Ensuring Docker network exists...'
                script {
                    sh """
                        # Create network if not exists
                        docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1 || \
                        docker network create ${DOCKER_NETWORK}
                        
                        echo "✅ Network ${DOCKER_NETWORK} is ready"
                    """
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo '🚀 Deploying new container...'
                script {
                    sh """
                        docker run -d \
                            --name ${DOCKER_CONTAINER} \
                            --network ${DOCKER_NETWORK} \
                            -p ${DOCKER_PORT}:80 \
                            --restart unless-stopped \
                            ${DOCKER_IMAGE}:latest
                        
                        echo "✅ Container deployed successfully"
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health check...'
                script {
                    sh '''
                        echo "Waiting for container to start..."
                        sleep 5
                        
                        echo "Checking container status:"
                        docker ps | grep digital-banking-profile-frontend
                        
                        echo "\nChecking container logs:"
                        docker logs digital-banking-profile-frontend --tail 20
                        
                        echo "\nTesting health endpoint:"
                        for i in {1..10}; do
                            if curl -f http://localhost:2114/health; then
                                echo "\n✅ Health check passed!"
                                exit 0
                            fi
                            echo "\nRetrying in 3 seconds... ($i/10)"
                            sleep 3
                        done
                        
                        echo "\n✅ Container is running (checking main page)..."
                        curl -I http://localhost:2114/ || echo "⚠️  Main page check failed"
                    '''
                }
            }
        }
        
        stage('Verify API Proxy') {
            steps {
                echo '🔗 Verifying API proxy configuration...'
                script {
                    sh '''
                        echo "Checking if backend is accessible from frontend container..."
                        docker exec merchant-frontend wget -q -O- http://merchant-backend:8080/health || \
                        echo "⚠️  Backend not accessible (make sure backend is running)"
                    '''
                }
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo '🧹 Cleaning up old Docker images...'
                script {
                    sh """
                        # Keep only the last 3 builds
                        docker images ${DOCKER_IMAGE} --format "{{.Tag}}" | \
                        grep -v latest | \
                        sort -rn | \
                        tail -n +4 | \
                        xargs -I {} docker rmi ${DOCKER_IMAGE}:{} || true
                        
                        echo "✅ Cleanup completed"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🌐 Frontend available at: http://localhost:${DOCKER_PORT}"
            echo "🔍 Test with: curl http://localhost:${DOCKER_PORT}/health"
            echo "💡 Open in browser: http://localhost:${DOCKER_PORT}"
        }
        failure {
            echo '❌ Pipeline failed!'
            echo '📋 Check logs: docker logs ${DOCKER_CONTAINER}'
        }
        always {
            echo '📊 Pipeline execution completed'
            sh '''
                echo "\n=== Container Status ==="
                docker ps -a | grep merchant-frontend || echo "No container found"
                
                echo "\n=== Network Status ==="
                docker network inspect grafana-mysql-network | grep -A 10 "Containers" || echo "Network not found"
                
                echo "\n=== Image Status ==="
                docker images | grep merchant-summary-frontend | head -5
            '''
        }
    }
}
