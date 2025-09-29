// backend/routes/documents.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Document');

// Create a new document
router.post('/', auth, async (req, res) => {
    try {
        const { title } = req.body;
        const newDocument = new Document({
            title,
            ownerId: req.user.id,
            collaborators: [req.user.id] // Owner is the first collaborator
        });

        const document = await newDocument.save();
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get all documents owned by or collaborating with the user
router.get('/user', auth, async (req, res) => {
    try {
        // Find documents where the user is either the owner OR a collaborator
        const documents = await Document.find({
            $or: [{ ownerId: req.user.id }, { collaborators: req.user.id }]
        }).sort({ lastUpdated: -1 });

        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get a specific document by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Basic permission check: user must be the owner or a collaborator
        const isCollaborator = document.collaborators.includes(req.user.id);
        const isOwner = document.ownerId.toString() === req.user.id;

        if (!isCollaborator && !isOwner) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json(document);
    } catch (err) {
        console.error(err.message);
        // Handle invalid ID format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
});


//   Add a user as a collaborator to a document (owner only)
router.post('/:id/collaborator', auth, async (req, res) => {
    try {
        const { email } = req.body;
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Role-based permission: Only owner can add collaborators
        if (document.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Permission denied: Only the owner can add collaborators.' });
        }

        // Find the user to add
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ msg: 'User with this email not found.' });
        }

        // Check if already a collaborator
        if (document.collaborators.includes(userToAdd.id)) {
            return res.status(400).json({ msg: 'User is already a collaborator.' });
        }

        // Add the collaborator
        document.collaborators.push(userToAdd.id);
        await document.save();

        res.json({ msg: `${userToAdd.username} added as collaborator.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;