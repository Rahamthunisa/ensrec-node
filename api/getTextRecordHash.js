

// // Import dependencies
// const { ethers } = require('ethers');
// const { ENSHasher } = require('../src/utils/ensHasher'); // Adjusted path

// // Serverless function for handling POST requests to /api/getTextRecordHash
// module.exports = async (req, res) => {
//     // Log the incoming request body
//     console.log('Request received:', req.body);

//     // Ensure there is a request body
//     if (!req.body) {
//         return res.status(400).json({ error: 'Request body is missing' });
//     }

//     // Extract data from request body
//     const { node, key, val, owner, expiry } = req.body;

//     // Validate the Ethereum address
//     if (!ethers.utils.isAddress(owner)) {
//         return res.status(400).json({ error: 'Invalid Ethereum address' });
//     }

//     // Initialize ENSHasher
//     const ensHasher = new ENSHasher();

//     try {
//         // Attempt to generate the text record hash
//         const signature = await ensHasher.getTextRecordHash(node, key, val, owner, expiry);
//         res.status(200).json({ signature });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Import dependencies
const { ethers } = require('ethers');
const { ENSHasher } = require('../src/utils/ensHasher'); // Adjusted path

// Helper function to add CORS headers
const addCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust accordingly
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Serverless function for handling POST requests to /api/getTextRecordHash
module.exports = async (req, res) => {
    // Add CORS headers to the response
    addCorsHeaders(res);

    // Immediately return 200 for OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Log the incoming request body
    console.log('Request received:', req.body);

    // Ensure there is a request body for POST requests
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
