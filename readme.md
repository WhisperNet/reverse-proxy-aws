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

1. **Create Nginx Configuration**

   ```bash
   sudo nano /etc/nginx/sites-available/reverse-proxy
   ```

2. **Add Configuration**

   ```nginx
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

**Server IP**: 65.0.87.188  
**Live URLs**:

- Goal Tracker: http://goaltracker.ridowansikder.me
- Online Quiz: http://onlinequiz.ridowansikder.me
