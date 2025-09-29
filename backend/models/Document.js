// backend/models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);