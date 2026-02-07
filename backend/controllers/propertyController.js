const Property = require('../Models/Property');

// Create Property
exports.createProperty = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ msg: 'Only owners can add properties' });
        }

        const { title, location, rentAmount, bedrooms, description } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

        const newProperty = new Property({
            title, location, rentAmount, bedrooms, description,
            images: [image], // Store as array
            owner: req.user.id
        });

        const property = await newProperty.save();
        
        // Notify Owner via Email (Simulation)
        console.log(`[EMAIL SIMULATION] To: ${req.user.email} (Owner), Subject: Property Listed Successfully, Body: Your property "${property.title}" has been successfully listed!`);

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Properties (with filters)
exports.getProperties = async (req, res) => {
    try {
        const { location, maxPrice, bedrooms, owner } = req.query;
        let query = {};

        if (location) query.location = { $regex: location, $options: 'i' };
        if (maxPrice) query.rentAmount = { $lte: maxPrice };
        if (bedrooms) query.bedrooms = bedrooms;
        if (owner) query.owner = owner; // Allow filtering by owner
        
        // query.status = 'available'; // Default availability filter if needed

        const properties = await Property.find(query).populate('owner', 'name email');
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Property By ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) return res.status(404).json({ msg: 'Property not found' });
        res.json(property);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Property not found' });
        res.status(500).send('Server Error');
    }
};

// Update Property
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        // Make sure user owns property
        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        property = await Property.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        // Make sure user owns property
        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
