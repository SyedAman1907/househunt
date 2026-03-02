const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartbridge';
        if (!process.env.MONGO_URI) {
            console.warn('Warning: MONGO_URI not defined; falling back to local mongodb://127.0.0.1:27017/smartbridge');
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
