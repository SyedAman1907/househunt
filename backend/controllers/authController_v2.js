const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// helper to build base URL
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// Register User
exports.register = async (req, res) => {
    try {
        const { email, password, role, name, mobile, address } = req.body;
        console.log("Registration attempt with data:", { email, role, name });

        // Basic validation
        if (!email || !password || !role || !name) {
            return res.status(400).json({ msg: 'Email, password, role and name are required' });
        }

        // normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            console.log("Match found in database for:", normalizedEmail);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role, 
            mobile,
            address,
            // store filename only; route will build URL when serving
            image: req.file ? req.file.filename : null,
            isApproved: role === 'owner' ? false : true // Owners need approval
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET not defined in environment');
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        let token;
        try {
            token = jwt.sign(payload, secret, { expiresIn: '1d' });
        } catch (tokErr) {
            console.error('Error signing JWT:', tokErr);
            return res.status(500).json({ msg: 'Token generation failed' });
        }

        // build image URL for client
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const userRes = {
            id: user._id,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved
        };
        if (user.image) userRes.image = `${baseUrl}/uploads/${user.image}`;

        res.status(201).json({ token, user: userRes });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ msg: `Server error: ${err.message}` });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        // Check User
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Approval (for owners)
        if (user.role === 'owner' && !user.isApproved) {
            return res.status(403).json({ msg: 'Account pending approval from admin' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET not defined in environment');
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        let token;
        try {
            token = jwt.sign(payload, secret, { expiresIn: '1d' });
        } catch (tokErr) {
            console.error('Error signing JWT:', tokErr);
            return res.status(500).json({ msg: 'Token generation failed' });
        }

        // build response the same way as register
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const userRes = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        if (user.image) userRes.image = `${baseUrl}/uploads/${user.image}`;
        res.json({ token, user: userRes });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: `Server error: ${err.message}` });
    }
};

// Forgot Password with OTP
exports.forgotPassword = async (req, res) => {
    console.log("Forgot Password Request Received for:", req.body.email); // DEBUG LOG
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'Email is required' });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save();

        const message = `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });

            res.status(200).json({ success: true, data: 'OTP sent to email.' });
        } catch (err) {
            console.error("Email send error:", err);
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();
            return res.status(500).json({ msg: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Reset Password with OTP
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            return res.status(400).json({ msg: 'Email, OTP and new password are required' });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            otp,
            otpExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or Expired OTP' });

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password Updated Success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
