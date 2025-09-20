#!/bin/bash

# Certificate Registry DApp - Quick Start Script
# This script helps you quickly set up and run the Certificate Registry DApp

echo "🚀 Certificate Registry DApp - Quick Start"
echo "=========================================="

# Run system check first
echo "Running system check..."
./check-system.sh

echo ""
echo "Continuing with setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   See INSTALLATION.md for detailed instructions."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    echo "   See INSTALLATION.md for detailed instructions."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install UI dependencies
echo "📦 Installing UI dependencies..."
cd ui
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install UI dependencies"
    exit 1
fi

cd ..
echo "✅ UI dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env_local .env
    echo "📝 Please edit .env file with your configuration:"
    echo "   - PRIVATE_KEY: Your MetaMask private key"
    echo "   - POLYGONSCAN_API_KEY: Your PolygonScan API key (optional)"
    echo ""
    echo "Press Enter to continue after editing .env file..."
    read
fi

# Check if UI .env.local file exists
if [ ! -f "ui/.env.local" ]; then
    echo "⚠️  UI .env.local file not found. Creating from template..."
    cp ui-config.env ui/.env.local
    echo "📝 Please edit ui/.env.local file with your contract address after deployment"
fi

echo ""
echo "🎯 Setup complete! Now you can:"
echo ""
echo "1. Deploy the smart contract:"
echo "   npm run deploy:local    # For local development"
echo "   npm run deploy:amoy     # For Polygon Amoy testnet"
echo ""
echo "2. Start the metadata server:"
echo "   npm run metadata-server"
echo ""
echo "3. Start the UI (in another terminal):"
echo "   cd ui && npm run dev"
echo ""
echo "4. Open your browser and go to:"
echo "   http://localhost:5173"
echo ""
echo "📚 For detailed instructions, see README.md and deployment-guide.md"
echo ""
echo "🔗 Useful links:"
echo "   - Polygon Amoy Faucet: https://faucet.polygon.technology/"
echo "   - PolygonScan Amoy: https://amoy.polygonscan.com"
echo "   - MetaMask: https://metamask.io/"
echo ""
echo "Happy coding! 🎉"
