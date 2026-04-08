const mongoose = require('mongoose');


const RequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    type: {
        type: String,
        enum: [ 'AC', 'heating', 'refrigeration', 'ventilation', 'appliance', 'other'],
         required: true,
    },
    urgency: {
        type: String,
        enum: ['normal', 'urgent', 'critical'],
        default: 'normal',
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
    payment: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid',
        },
    notes: [
            {
                text: { type: String },
                creatAt: { type: Date, default: Date.now},
                }
            ],
                }, {timestamps: true});

                module.exports = mongoose.model('Request', RequestSchema);
