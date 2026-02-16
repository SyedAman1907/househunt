const User = require('../Models/User');
const Property = require('../Models/Property');
const bcrypt = require('bcryptjs');

const isAuthorized = (req) => {
    return req.user.role === 'admin' || req.user.role === 'subadmin';
};

exports.getAllProperties = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const properties = await Property.find().populate('owner', 'name email');
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only main admin can delete properties' });
        await Property.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only main admin can remove users' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.approveOwner = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true, approvedAt: new Date() }, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingOwners = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const owners = await User.find({ role: 'owner', isApproved: false });
        res.json(owners);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingProperties = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const properties = await Property.find({ isApproved: false }).populate('owner', 'name email');
        res.json(properties);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.approveProperty = async (req, res) => {
    try {
        if (!isAuthorized(req)) return res.status(403).json({ msg: 'Access denied' });
        const property = await Property.findByIdAndUpdate(
            req.params.id, 
            { isApproved: true, approvedAt: new Date(), verificationNotes: req.body.notes },
            { new: true }
        );
        res.json(property);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createSubadmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Only main admin can authorize sub-admins' });
        }
        const { email, password, name } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Account identity already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            name,
            role: 'subadmin',
            isApproved: true
        });

        await user.save();
        res.json({ msg: 'Sub-admin identity authorized and provisioned' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getActivityLogs = async (req, res) => {
    res.json({ logs: [], totalLogs: 0 });
};
