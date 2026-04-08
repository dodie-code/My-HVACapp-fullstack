const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth(['administrator']), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/clients', auth(['administrator']), async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/technicians', auth(['administrator']), async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.post('/technicians', auth(['administrator']), async (req, res) => {
    try {
        const { name, password, phone, email, speciality } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        const technician = new User({
            name, password, phone, email, speciality, role: 'technician'
        });
        await technician.save();
        res.status(201).json({
            id: technician._id,
            name: technician.name,
            phone: technician.phone,
            email: technician.email,
            speciality: technician.speciality,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.delete('/:id', auth(['administrator']), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


module.exports = router;