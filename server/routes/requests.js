const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/Request');

router.get('/', auth(['administrator']), async (req, res) => {
    try {

        const requests = await Request.find()
          .populate('client', 'name email phone')
          .populate('technician', 'name email')
          .sort ({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/my', auth(['client']), async (req, res) => {
    try {
        const requests = await Request.find({ client: req.user.id })
            .populate('technician', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});
 router.get('/assigned', auth(['technician']), async (req, res) => {
    try {
        const requests = await Request.find({ technician: req.user.id })
            .populate('client', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});
router.post('/', auth(['client']), async (req, res) => {
    try {
        const { type, urgency, description, address, phone, date } = req.body;
        const request = new Request({
            client: req.user.id,
            type,
            urgency,
            description,
            address,
            phone,
            date,
        });
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});
router.put('/:id/status', auth(['administrator', 'technician']), async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findByIdAndUpdate(req.params.id,
            { status },
            { new: true }
        );
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

    router.put('/:id/assign', auth(['administrator']), async (req, res) => {
        try {
            const { technicianId } = req.body;
            const request = await Request.findByIdAndUpdate(req.params.id,
            { technician: technicianId },
            { new: true }
            );
            res.json(request);
        } catch (error) {
            res.status(500).json({ message: 'Server error.', error: error.message });
        }
    });
    router.put('/:id/payment', auth(['administrator']), async (req, res) => {
        try {
            const { payment } = req.body;
            const request = await Request.findByIdAndUpdate(req.params.id,
                { payment },
                { new: true }
            );
            res.json(request);
        } catch (error) {
            res.status(500).json({ message: 'Server error.', error: error.message });
        }
    });
    router.put('/:id/notes', auth(['administrator', 'technician']), async (req, res) => {
        try {
            const { text } = req.body;
            const request = await Request.findByIdAndUpdate(req.params.id,
                { $push: { notes: { text } } },
                { new: true }
            );
            res.json(request);
        } catch (error) {
            res.status(500).json({ message: 'Server error.', error: error.message });
        }
    });

module.exports = router;
