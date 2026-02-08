const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.register = async (req, res) => {
    try {
        const { email, password, role, name, mobile, address } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            email,
            password: hashedPassword,
            role, 
            mobile,
            address,
            isApproved: role === 'owner' ? false : true // Owners need approval
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, isApproved: user.isApproved } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Approval (for owners)
        if (user.role === 'owner' && !user.isApproved) {
            return res.status(403).json({ msg: 'Account pending approval from admin' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Forgot Password with OTP
exports.forgotPassword = async (req, res) => {
    console.log("Forgot Password Request Received for:", req.body.email); // DEBUG LOG
    try {
        const user = await User.findOne({ email: req.body.email });
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

        const user = await User.findOne({
            email,
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

