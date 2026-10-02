import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to reliably resolve MongoDB Atlas SRV records on Windows/ISPs
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Srijan';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

export const checkDBConnection = () => {
  return mongoose.connection.readyState === 1;
};
