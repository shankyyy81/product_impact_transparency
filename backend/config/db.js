const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shashank2310219:bDBqTFWNlPP67rXL@cluster0.hulovs6.mongodb.net/rewear?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Continuing without database connection...');
    // Don't exit the process, let the app continue with in-memory data
  }
};

module.exports = connectDB; 