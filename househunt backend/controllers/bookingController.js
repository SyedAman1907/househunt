const Booking = require('../Models/Booking');
const Property = require('../Models/Property');
const User = require('../Models/User');

// Create Booking
exports.createBooking = async (req, res) => {
    try {
        const { propertyId, message } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        if (property.status !== 'available') {
            return res.status(400).json({ msg: 'Property is not available' });
        }

        const newBooking = new Booking({
            renter: req.user.id, // From auth middleware
            property: propertyId,
            message
        });

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get My Bookings (for Renter)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ renter: req.user.id }).populate('property');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Bookings for Owner's Properties
exports.getOwnerBookings = async (req, res) => {
    try {
        // Find properties owned by user
        const properties = await Property.find({ owner: req.user.id });
        const propertyIds = properties.map(p => p._id);

        const bookings = await Booking.find({ property: { $in: propertyIds } })
            .populate('renter', 'name email')
            .populate('property', 'title');

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Booking Status and Property Status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'confirmed', 'rejected'
        let booking = await Booking.findById(req.params.id).populate('property');
        
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Check if user is the owner of the property
        if (booking.property.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        // If confirmed, mark property as occupied? 
        if (status === 'confirmed') {
            await Property.findByIdAndUpdate(booking.property._id, { status: 'occupied' });

            const owner = await User.findById(booking.property.owner);
            const renter = await User.findById(booking.renter);

            const ownerDetails = `
            Name: ${owner.name || 'N/A'}
            Email: ${owner.email}
            Mobile: ${owner.mobile || 'N/A'}
            Address: ${owner.address || 'N/A'}
            `;

            const message = `
            Good news! Your booking for ${booking.property.title} has been confirmed.
            
            Here are the owner details:
            ${ownerDetails}
            
            Please contact the owner to finalize the agreement.
            `;

            console.log(`[EMAIL SIMULATION] To: ${renter.email}, Subject: Booking Confirmed!, Body: 
            Good news! Your booking for ${booking.property.title} has been confirmed.
            Here are the owner details:
            ${ownerDetails}
            `);
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
