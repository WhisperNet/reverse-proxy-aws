# AWS EC2 Nginx Reverse Proxy Project

This project demonstrates setting up an **Nginx reverse proxy** on AWS EC2 to serve multiple Node.js applications through different subdomains.

## 🏗️ Architecture Overview

```
                    Internet
                       |
                       |
            ┌──────────▼──────────┐
            │  DNS (Route 53)     │
            │                     │
            │  goaltracker.       │
            │  ridowansikder.me   │◄─── A Record ───► 65.0.87.188
            │                     │
            │  onlinequiz.        │
            │  ridowansikder.me   │◄─── A Record ───► 65.0.87.188
            └──────────┬──────────┘
                       │
                       │
            ┌──────────▼──────────┐
            │   AWS EC2 Instance  │
            │   (65.0.87.188)     │
            │                     │
            │  ┌───────────────┐  │
            │  │     Nginx     │  │
            │  │ Reverse Proxy │  │
            │  │   (Port 80)   │  │
            │  └───────┬───────┘  │
            │          │          │
            │    ┌─────┴─────┐    │
            │    │           │    │
            │    ▼           ▼    │
            │ Port 3000  Port 3001│
            │    │           │    │
            │ ┌──▼──┐    ┌──▼──┐  │
            │ │Goal │    │Quiz │  │
            │ │Track│    │ App │  │
            │ └─────┘    └─────┘  │
            └─────────────────────┘
```

## 🔧 Setup Instructions

### 1. AWS EC2 Instance Setup

**Configure Security Groups**

- Allow HTTP (Port 80)
- Allow SSH (Port 22)
- Allow custom ports 3000 and 3001 (for testing)

### Application Deployment

1. **Clone and Setup Applications**

   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd reverse-proxy-aws

   # Setup GoalTracker
   cd GoalTracker
   npm install

   # Setup OnlineQuiz
   cd ../OnlineQuiz
   npm install
   ```

### Nginx Configuration

**Add Nginx Configuration**

```nginx
# /etc/nginx/nginx.conf
server {
    listen 80;
    server_name goaltracker.ridowansikder.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name onlinequiz.ridowansikder.me;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Add HAPROXY Configuration**

```TOML
# /etc/haproxy/haproxy.cfg

# Global settings (minimal)
global
    daemon

# Default settings (minimal)
defaults
    mode http
    # Required for proper HTTP/1.1 and WebSockets
    option httplog
    option http-server-close
    option forwardfor
    timeout client 10s
    timeout server 10s
    timeout connect 5s
    timeout tunnel 1h # for WebSockets

# Frontend to handle incoming HTTP requests
frontend http_in
    bind *:80
    mode http

    # ACLs to identify which domain is being requested
    acl is_goaltracker hdr(host) -i goaltracker.ridowansikder.me
    acl is_onlinequiz hdr(host) -i onlinequiz.ridowansikder.me

    # Use the appropriate backend based on the ACL match
    use_backend goaltracker_backend if is_goaltracker
    use_backend onlinequiz_backend if is_onlinequiz


# Backend for goaltracker.ridowansikder.me
backend goaltracker_backend
    mode http
    server goaltracker_app 127.0.0.1:3000

# Backend for onlinequiz.ridowansikder.me
backend onlinequiz_backend
    mode http
    server onlinequiz_app 127.0.0.1:3001
```

**Server IP**: 65.0.87.188  
**Live URLs**:

- Goal Tracker: http://goaltracker.ridowansikder.me
- Online Quiz: http://onlinequiz.ridowansikder.me
