const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const email = 'syedamanmirzanullah@outlook.com';
        const password = 'aman123';
        const name = 'SYED AMAN';
        
        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`Admin with email ${email} already exists.`);
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new User({
            email,
            password: hashedPassword,
            name,
            role: 'admin',
            isApproved: true,
            approvedAt: new Date()
        });

        await admin.save();
        console.log('-----------------------------------');
        console.log('Admin user created successfully!');
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
