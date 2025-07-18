#!/bin/bash

echo "🚀 Setting up DailyWageConnect..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

cd ..

echo "🔧 Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    cp backend/.env backend/.env.example
    echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/dailywageconnect
JWT_SECRET=dailywageconnect_jwt_secret_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000" > backend/.env
    echo "✅ Created backend/.env file"
else
    echo "⚠️  backend/.env already exists"
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start MongoDB: sudo systemctl start mongod"
echo "2. Run the application: npm run dev"
echo "3. Access the app at: http://localhost:3000"
echo ""
echo "🔗 Useful commands:"
echo "   npm run dev        - Start both frontend and backend"
echo "   npm run backend    - Start backend only"
echo "   npm run frontend   - Start frontend only"
echo ""
echo "📚 Read the README.md for more information!"