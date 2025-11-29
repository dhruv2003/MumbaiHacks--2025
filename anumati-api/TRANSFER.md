# Quick Transfer Script for Oracle VM

## Option 1: Using rsync (Recommended)

```bash
# From your local machine, run:
rsync -avz --exclude node_modules --exclude .git --exclude logs \
  /Users/dhruv/Documents/Dev/MumbaiHacks--2025/mock-anumati-api/ \
  your-username@your-oracle-vm-ip:/var/www/anumati-api/
```

## Option 2: Using scp

```bash
# Create a tarball locally (excluding unnecessary files)
cd /Users/dhruv/Documents/Dev/MumbaiHacks--2025/mock-anumati-api
tar --exclude=node_modules --exclude=.git --exclude=logs \
    -czf anumati-api.tar.gz .

# Transfer to server
scp anumati-api.tar.gz your-username@your-oracle-vm-ip:/tmp/

# On server: extract files
ssh your-username@your-oracle-vm-ip
cd /var/www/anumati-api
sudo tar -xzf /tmp/anumati-api.tar.gz
sudo chown -R $USER:$USER /var/www/anumati-api
rm /tmp/anumati-api.tar.gz
```

## Option 3: Git Clone (If you have a repository)

```bash
# On server
cd /var/www/anumati-api
git clone https://github.com/your-username/your-repo.git .
```

## After File Transfer - Server Setup Commands

```bash
# On your Oracle VM server
cd /var/www/anumati-api

# Copy production environment
cp .env.production .env

# Edit the JWT secret (IMPORTANT!)
nano .env
# Change: JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production_2024

# Install dependencies
npm install

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.json

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the command output

# Check status
pm2 status
pm2 logs anumati-api
```

## Test Your Deployment

```bash
# Test API endpoints
curl https://anumati.thisisdhruv.in/api/v1/auth/users
curl -X POST https://anumati.thisisdhruv.in/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"aaHandle":"9999999999@anumati","pin":"9999"}'
```

## Useful Commands for Managing Deployment

```bash
# View logs
pm2 logs anumati-api

# Restart application
pm2 restart anumati-api

# Stop application
pm2 stop anumati-api

# Monitor resources
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates

# Renew SSL certificate (if needed)
sudo certbot renew
```