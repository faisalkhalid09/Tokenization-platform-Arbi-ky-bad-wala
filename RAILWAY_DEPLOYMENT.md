# Railway Deployment Guide

This guide explains how to deploy the Blockchain Tokenization Platform to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [Railway.app](https://railway.app)
2. **GitHub Repository**: Fork this repository to your GitHub account
3. **Environment Variables**: Prepare the required environment variables

## Deployment Steps

### Step 1: Connect Repository to Railway

1. **Login to Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "Deploy from GitHub repo"
   - Select your forked repository
   - Railway will automatically detect the configuration

### Step 2: Configure Environment Variables

In the Railway dashboard, add the following environment variables:

#### Required Variables
```env
# Network Configuration
NEXT_PUBLIC_DEFAULT_NETWORK=mumbai
NEXT_PUBLIC_DEFAULT_CHAIN_ID=80001

# RPC Endpoints
NEXT_PUBLIC_INFRA_RPC_MUMBAI=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_INFRA_RPC_BNBTEST=https://data-seed-prebsc-1-s1.binance.org:8545

# Deployment Contract (optional, can be set after contract deployment)
NEXT_PUBLIC_DEPLOYED_TOKEN_ADDRESS=
```

#### Optional Variables for Enhanced Features
```env
# Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### Step 3: Deploy

1. **Automatic Deployment**
   - Railway will automatically start building your application
   - The build process uses the configuration in `railway.json`
   - Build logs will be visible in the Railway dashboard

2. **Monitor Build Progress**
   - Watch the build logs for any errors
   - The build process includes:
     - Installing dependencies
     - Building the Next.js application
     - Creating optimized production bundle

3. **Access Your Application**
   - Once deployed, Railway will provide a public URL
   - The application will be accessible at: `https://your-app-name.up.railway.app`

## Deployment Configuration

### Files Used by Railway

- **`railway.json`**: Main Railway configuration
- **`nixpacks.toml`**: Build configuration for Nixpacks
- **`Dockerfile`**: Alternative Docker build configuration
- **`package.json`**: Root package with workspace configuration

### Build Process

The deployment follows this process:

1. **Setup Phase**: Install Node.js 18 and npm
2. **Install Phase**: Install only the frontend dependencies (`npm ci --workspace app`)
3. **Build Phase**: Build the Next.js application (`cd app && npm run build`)
4. **Start Phase**: Start the production server (`cd app && npm start`)

## Environment-Specific Configuration

### Development vs Production

The application automatically detects the environment:

- **Development**: Full error messages, debug logs, development tools
- **Production**: Optimized bundle, error boundaries, production logging

### Network Configuration

The app supports multiple networks:

- **Mumbai Testnet** (Chain ID: 80001) - Default
- **BSC Testnet** (Chain ID: 97) - Alternative

## Post-Deployment Steps

### Step 1: Verify Deployment

1. **Check Application Health**
   - Visit your Railway URL
   - Verify the application loads correctly
   - Test wallet connection functionality

2. **Test Core Features**
   - Connect MetaMask wallet
   - Switch to supported testnet
   - Test token creation interface
   - Verify marketplace functionality

### Step 2: Deploy Smart Contract (Optional)

1. **Set up Local Environment**
   ```bash
   git clone your-forked-repo
   cd tokenization-platform
   npm run bootstrap
   cp .env.example .env
   ```

2. **Configure Private Key**
   ```env
   PRIVATE_KEY=your-deployment-wallet-private-key
   POLYGON_MUMBAI_RPC_URL=your-rpc-url
   ```

3. **Deploy Contract**
   ```bash
   npm run deploy:mumbai
   ```

4. **Update Railway Environment**
   - Copy the deployed contract address
   - Add to Railway as `NEXT_PUBLIC_DEPLOYED_TOKEN_ADDRESS`
   - Trigger a new deployment

### Step 3: Update Documentation

1. **Update README**
   - Replace placeholder URLs with actual Railway URL
   - Add deployed contract address if applicable

2. **Test End-to-End**
   - Full user journey from wallet connection to token interactions
   - Marketplace simulation functionality
   - Admin dashboard features

## Troubleshooting

### Common Build Issues

**Build Fails with "Module not found"**
- Ensure all dependencies are listed in `app/package.json`
- Check for case-sensitive import paths

**Build Timeout**
- Optimize build process
- Consider using Dockerfile for more control

### Runtime Issues

**Application Won't Start**
- Check Railway logs for errors
- Verify environment variables are set correctly
- Ensure port configuration is correct (Railway assigns PORT automatically)

**Wallet Connection Issues**
- Verify RPC URLs are accessible
- Check network configuration in environment variables
- Test with different wallet providers

### Performance Issues

**Slow Loading Times**
- Enable compression in Next.js config
- Optimize images and assets
- Consider implementing CDN

**High Memory Usage**
- Monitor Railway metrics
- Optimize React components
- Consider upgrading Railway plan

## Railway-Specific Features

### Auto-Deploy

- **GitHub Integration**: Automatic deployments on git push
- **Branch Deployments**: Deploy specific branches
- **PR Deployments**: Preview deployments for pull requests

### Scaling

- **Horizontal Scaling**: Increase replica count
- **Vertical Scaling**: Upgrade memory/CPU
- **Auto-scaling**: Based on traffic patterns

### Monitoring

- **Application Metrics**: CPU, memory, network usage
- **Application Logs**: Real-time log streaming
- **Health Checks**: Automatic health monitoring

## Security Considerations

### Environment Variables

- **Never commit secrets**: Use Railway environment variables
- **Separate environments**: Different variables for staging/production
- **Access control**: Limit who can view/modify environment variables

### Network Security

- **HTTPS Only**: Railway provides SSL certificates automatically
- **CORS Configuration**: Configure allowed origins appropriately
- **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Cost Optimization

### Railway Pricing

- **Hobby Plan**: Free tier with limitations
- **Pro Plan**: Better performance and features
- **Usage-Based**: Pay for what you use

### Optimization Tips

- **Efficient Builds**: Minimize build time and resource usage
- **Sleep Configuration**: Let inactive apps sleep to save costs
- **Resource Monitoring**: Monitor and optimize resource usage

## Support

### Railway Resources

- **Documentation**: [Railway Docs](https://docs.railway.app/)
- **Community**: [Railway Discord](https://discord.gg/railway)
- **Support**: Railway support team

### Project Resources

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides in `/docs`
- **Demo**: Live demo at your Railway URL

---

This deployment guide ensures your Blockchain Tokenization Platform runs smoothly on Railway with optimal performance and security.
