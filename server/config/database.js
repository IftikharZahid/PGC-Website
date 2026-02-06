import mongoose from 'mongoose';
import dns from 'dns';

// Force usage of Google DNS to fix SRV record resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    // MongoDB connection options to fix timeout issues
    const options = {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Force IPv4 for reliable connection
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    };

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);


    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    // Commented out to reduce console noise during connection issues
    // mongoose.connection.on('disconnected', () => {
    //   console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
    // });

    // mongoose.connection.on('reconnected', () => {
    //   console.log('✅ MongoDB reconnected successfully');
    // });

    // mongoose.connection.on('connecting', () => {
    //   console.log('🔄 MongoDB connecting...');
    // });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify MONGODB_URI in .env file');
    console.error('   3. Ensure IP address is whitelisted in MongoDB Atlas:');
    console.error('      - Go to: https://cloud.mongodb.com');
    console.error('      - Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)');
    console.error('   4. Check if MongoDB Atlas cluster is active');
    console.error('   5. Verify username/password in connection string');

    // Don't exit immediately in development to allow manual retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('\n⚠️  Server will continue running but database features will not work.');
      console.log('💡 Fix the connection and restart the server.\n');
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed due to app termination');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
  process.exit(0);
});

export default connectDB;
