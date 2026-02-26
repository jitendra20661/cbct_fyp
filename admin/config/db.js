const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed`,error.message);
        //   console.error('MongoDB connection error:', err)
        if (!process.env.MONGODB_URI) console.log("Missing MongoURI is : ", process.env.MONGODB_URI)
        process.exit(1); // Stop server    
    }
}

module.exports = connectDB