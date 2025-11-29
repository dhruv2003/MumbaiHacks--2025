#!/bin/bash

# Deployment script for anumati.thisisdhruv.in
# Run this script on your Oracle VM

set -e

echo "🚀 Starting deployment of Anumati API..."

# Variables
PROJECT_DIR="/var/www/anumati-api"
DOMAIN="anumati.thisisdhruv.in"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

echo "Step 1: System Updates"
sudo apt update && sudo apt upgrade -y
print_status "System updated"

echo "Step 2: Install dependencies"
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm git curl
print_status "Dependencies installed"

echo "Step 3: Install PM2"
sudo npm install -g pm2
print_status "PM2 installed globally"

echo "Step 4: Create project directory"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR
print_status "Project directory created: $PROJECT_DIR"

echo "Step 5: Setup firewall"
sudo ufw --force enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
print_status "Firewall configured"

echo "Step 6: Nginx configuration"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
print_status "Nginx configured for $DOMAIN"

echo "Step 7: SSL Certificate"
print_warning "Make sure your DNS is pointing to this server before proceeding!"
read -p "Press Enter to continue with SSL setup, or Ctrl+C to cancel..."

sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email your-email@example.com
print_status "SSL certificate installed"

echo "Step 8: Project setup instructions"
print_warning "Now you need to:"
echo "1. Upload your project files to: $PROJECT_DIR"
echo "2. Copy .env.production to .env in the project directory"
echo "3. Run: cd $PROJECT_DIR && npm install"
echo "4. Create logs directory: mkdir -p $PROJECT_DIR/logs"
echo "5. Start with PM2: pm2 start ecosystem.config.json"
echo "6. Save PM2 process: pm2 save"
echo "7. Setup PM2 startup: pm2 startup"

echo ""
print_status "Server setup complete!"
echo "Your API will be available at: https://$DOMAIN"
echo ""
print_warning "Don't forget to:"
echo "- Update DNS A record: $DOMAIN -> $(curl -s ifconfig.me)"
echo "- Change JWT_SECRET in .env file"
echo "- Test all endpoints after deployment"