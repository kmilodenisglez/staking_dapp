#!/bin/bash

echo "🚀 Starting Certificate Registry DApp - Local Development"
echo "========================================================"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$HARDHAT_PID" ]; then
        kill $HARDHAT_PID 2>/dev/null
        echo "✅ Hardhat node stopped"
    fi
    if [ ! -z "$METADATA_PID" ]; then
        kill $METADATA_PID 2>/dev/null
        echo "✅ Metadata server stopped"
    fi
    if [ ! -z "$UI_PID" ]; then
        kill $UI_PID 2>/dev/null
        echo "✅ UI server stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Starting Hardhat node..."
npm run node &
HARDHAT_PID=$!

# Wait for Hardhat node to start
echo "⏳ Waiting for Hardhat node to start..."
sleep 5

# Check if Hardhat node is running
if ! curl -s http://127.0.0.1:8545 > /dev/null; then
    echo "❌ Failed to start Hardhat node"
    cleanup
    exit 1
fi

echo "✅ Hardhat node started successfully"

echo "📦 Deploying smart contract..."
npm run deploy:local

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy contract"
    cleanup
    exit 1
fi

echo "✅ Smart contract deployed successfully"

echo "📦 Starting UI server..."
cd ui
npm run start &
UI_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📱 Services running:"
echo "   - Hardhat Node: http://127.0.0.1:8545"
echo "   - Metadata Server: http://localhost:3000"
echo "   - UI Application: http://localhost:5173"
echo ""
echo "🔗 Useful endpoints:"
echo "   - API Health: http://localhost:3000/api/health"
echo "   - Upload Certificate: POST http://localhost:3000/api/upload-certificate"
echo ""
echo "⚠️  Important:"
echo "   - Install MetaMask browser extension"
echo "   - Add Hardhat Local network to MetaMask:"
echo "     - Network Name: Hardhat Local"
echo "     - RPC URL: http://127.0.0.1:8545"
echo "     - Chain ID: 31337"
echo "     - Currency Symbol: ETH"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
