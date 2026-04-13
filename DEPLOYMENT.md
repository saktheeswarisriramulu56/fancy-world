# Deployment Guide - Fancy World E-Commerce

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Set `SECRET_KEY` to a strong random string
- [ ] Set `MONGODB_URI` with your MongoDB Atlas connection string
- [ ] Set `DATABASE_NAME` to your database name
- [ ] Set `DEBUG=False` for production

### 2. Dependencies Installation
```bash
pip install -r requirements.txt
```

### 3. MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (Free tier available)
3. Create database user
4. Whitelist your server IP (or use 0.0.0.0/0 for development)
5. Get connection string
6. Update `.env` file

### 4. Test Locally
```bash
python app.py
```
- Test admin login (admin/admin123)
- Test customer registration/login
- Test product management
- Test order placement
- Test payment processing

## 🌐 Deployment Platforms

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create fancy-world-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your_secret_key_here
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set DATABASE_NAME=fancyworld
   heroku config:set DEBUG=False
   ```

4. **Create Procfile**
   ```
   web: python app.py
   ```
   Or use gunicorn:
   ```
   web: gunicorn app:app
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

### Option 2: PythonAnywhere

1. **Upload Files**
   - Upload all files via Files tab
   - Ensure `app.py` is in root directory

2. **Set Up Virtual Environment**
   ```bash
   mkvirtualenv fancyworld --python=python3.9
   pip install -r requirements.txt
   ```

3. **Configure Web App**
   - Go to Web tab
   - Set source code path
   - Set WSGI file to point to `app.py`
   - Set environment variables in Web tab

4. **Reload Web App**

### Option 3: AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init -p python-3.9 fancy-world
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv SECRET_KEY=your_key MONGODB_URI=your_uri DATABASE_NAME=fancyworld
   ```

4. **Deploy**
   ```bash
   eb create fancy-world-env
   eb deploy
   ```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong SECRET_KEY (generate with: `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS (SSL certificate)
- [ ] Restrict MongoDB Atlas IP whitelist
- [ ] Use environment variables (never commit .env)
- [ ] Enable MongoDB authentication
- [ ] Regular database backups

## 📊 Post-Deployment

### 1. Verify Deployment
- [ ] Home page loads
- [ ] Login works (admin and customer)
- [ ] Admin dashboard accessible
- [ ] Products display correctly
- [ ] Orders can be placed
- [ ] Payment processing works

### 2. Google Search Indexing
1. **Create Google Search Console Account**
2. **Add Property** (your website URL)
3. **Verify Ownership** (HTML file or meta tag)
4. **Submit Sitemap** (create sitemap.xml)
5. **Request Indexing** for main pages

### 3. Create Sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/home</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/login</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🐛 Troubleshooting

### Admin Dashboard Not Opening
1. Check session is being set: `print(session)` in route
2. Verify MongoDB connection
3. Check admin account exists in database
4. Verify role check: `session.get('role') == 'admin'`

### Products Not Showing
1. Check MongoDB connection
2. Verify products exist: `db.products.find()`
3. Check `is_active: true` filter
4. Verify template receives `all_products` variable

### Payment Not Processing
1. Check payment API endpoint
2. Verify order creation succeeds
3. Check payment model operations
4. Review server logs for errors

## 📝 Production Checklist

- [ ] All environment variables set
- [ ] MongoDB Atlas connected
- [ ] Admin account created
- [ ] SSL certificate installed
- [ ] Error logging configured
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Performance optimized
- [ ] Mobile responsive tested
- [ ] SEO meta tags added

## 🔍 Monitoring

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics
- **Performance**: Google PageSpeed Insights

## 📞 Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test MongoDB connection
4. Review error messages
5. Check Flask debug output (if DEBUG=True temporarily)

---

**Ready for Production!** 🎉
