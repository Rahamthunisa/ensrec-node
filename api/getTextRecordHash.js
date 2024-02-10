// const express = require('express');
// const { ethers } = require('ethers'); // Import ethers to use its utilities
// const dotenv = require('dotenv');
// const router = express.Router();
// const { ENSHasher } = require('../src/utils/ensHasher');

// router.post('/getTextRecordHash', async (req, res) => {
//     console.log('Request received:', req.body);
//     if (!req.body) return res.status(400).json({ error: 'Request body is missing' });

//     const { node, key, val, owner, expiry } = req.body;

//     // Check if the owner address is valid
//     if (!ethers.utils.isAddress(owner)) {
//         return res.status(400).json({ error: 'Invalid Ethereum address' });
//     }

//     const ensHasher = new ENSHasher();

//     try {
//         const signature = await ensHasher.getTextRecordHash(node, key, val, owner, expiry);
//         res.status(200).json({ signature });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;

// Import dependencies
const { ethers } = require('ethers');
const { ENSHasher } = require('../src/utils/ensHasher'); // Adjusted path

// Serverless function for handling POST requests to /api/getTextRecordHash
module.exports = async (req, res) => {
    // Log the incoming request body
    console.log('Request received:', req.body);

    // Ensure there is a request body
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }

    // Extract data from request body
    const { node, key, val, owner, expiry } = req.body;

    // Validate the Ethereum address
    if (!ethers.utils.isAddress(owner)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Initialize ENSHasher
    const ensHasher = new ENSHasher();

    try {
        // Attempt to generate the text record hash
        const signature = await ensHasher.getTextRecordHash(node, key, val, owner, expiry);
        res.status(200).json({ signature });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
