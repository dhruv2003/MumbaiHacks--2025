# Deployment Guide: anumati.thisisdhruv.in

## 🚀 Production Deployment to Oracle VM

### Prerequisites
- Oracle VM with SSH access
- Domain: `thisisdhruv.in` with Cloudflare DNS management
- Node.js 18+ installed on the server
- MongoDB Atlas connection (already configured)

## Step 1: Server Preparation

### 1.1 SSH into your Oracle VM
```bash
ssh your-username@your-oracle-vm-ip
```

### 1.2 Update system and install required packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm git
```

### 1.3 Install PM2 for process management
```bash
sudo npm install -g pm2
```

## Step 2: Project Setup on Server

### 2.1 Clone and setup project
```bash
cd /var/www/
sudo mkdir anumati-api
sudo chown $USER:$USER anumati-api
cd anumati-api

# Clone your project (replace with your repo URL)
git clone <your-repo-url> .
# OR upload files directly via scp/rsync
```

### 2.2 Install dependencies
```bash
npm install
npm run build  # If you have a build script
```

## Step 3: Environment Configuration

### 3.1 Create production .env file
```bash
nano .env
```

Use the production environment variables (see `.env.production` example below).

## Step 4: Nginx Configuration

### 4.1 Create Nginx server block
```bash
sudo nano /etc/nginx/sites-available/anumati.thisisdhruv.in
```

```nginx
server {
    listen 80;
    server_name anumati.thisisdhruv.in;

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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 4.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/anumati.thisisdhruv.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: SSL Certificate with Let's Encrypt

```bash
sudo certbot --nginx -d anumati.thisisdhruv.in
```

## Step 6: DNS Configuration (Cloudflare)

1. Login to Cloudflare dashboard
2. Select your `thisisdhruv.in` domain
3. Go to DNS settings
4. Add a new A record:
   - **Name**: `anumati`
   - **IPv4 address**: Your Oracle VM's public IP
   - **Proxy status**: Proxied (orange cloud)
   - **TTL**: Auto

## Step 7: Start the Application

### 7.1 Start with PM2
```bash
pm2 start src/app.ts --name anumati-api --interpreter ts-node
pm2 save
pm2 startup
```

### 7.2 Configure PM2 startup (follow the command output from above)

## Step 8: Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Step 9: Monitoring and Logs

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs anumati-api

# Restart application
pm2 restart anumati-api

# Monitor resources
pm2 monit
```

## Step 10: Testing

Once deployed, test these endpoints:
- `https://anumati.thisisdhruv.in/api/v1/auth/users`
- `https://anumati.thisisdhruv.in/api/v1/auth/login` (POST)

## 🔧 Maintenance Commands

```bash
# Update code
cd /var/www/anumati-api
git pull origin main
npm install
pm2 restart anumati-api

# View server status
sudo systemctl status nginx
pm2 status

# SSL certificate renewal (automatic, but manual command)
sudo certbot renew
```

## 🚨 Security Notes

1. **Change JWT secret** in production
2. **Enable trust proxy** for rate limiting behind reverse proxy
3. **Configure CORS** for specific domains only
4. **Monitor logs** regularly
5. **Keep dependencies updated**

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs anumati-api`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify DNS propagation: `dig anumati.thisisdhruv.in`
4. Test SSL: `curl -I https://anumati.thisisdhruv.in`