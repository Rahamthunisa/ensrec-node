// const { ethers } = require('ethers');

// const BASE_CHAIN_ID = parseInt(process.env.BASE_CHAIN_ID || '0');
// const BASE_CONTRACT_ADDRESS = process.env.BASE_CONTRACT_ADDRESS || '';
// const CCIP_PRIVATE_KEY = process.env.CCIP_PRIVATE_KEY || '';

// class ENSHasher {
//     constructor() {
//         this.l2Resolver = {
//             name: 'L2Resolver',
//             version: '1',
//             chainId: BASE_CHAIN_ID,
//             verifyingContract: BASE_CONTRACT_ADDRESS,
//         };
//     }

//     async _getFullSignature(signature) {
//         const { r, s, v } = signature;
//         return ethers.utils.joinSignature({ r, s, v });
//     }

//     async getDomainSeparator() {
//         const domainTypeHash = ethers.utils.keccak256(
//             ethers.utils.toUtf8Bytes(
//                 'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
//             )
//         );

//         return ethers.utils.keccak256(
//             ethers.utils.defaultAbiCoder.encode(
//                 ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
//                 [
//                     domainTypeHash,
//                     ethers.utils.keccak256(ethers.utils.toUtf8Bytes(this.l2Resolver.name)),
//                     ethers.utils.keccak256(ethers.utils.toUtf8Bytes(this.l2Resolver.version)),
//                     this.l2Resolver.chainId,
//                     this.l2Resolver.verifyingContract,
//                 ]
//             )
//         );
//     }

//     async _hash(dataTypes, dataValues) {
//         const domainSeparator = await this.getDomainSeparator();
//         const dataHash = ethers.utils.keccak256(
//             ethers.utils.defaultAbiCoder.encode(dataTypes, dataValues)
//         );

//         const toSign = ethers.utils.keccak256(
//             ethers.utils.solidityPack(
//                 ['string', 'bytes32', 'bytes32'],
//                 ['\x19\x01', domainSeparator, dataHash]
//             )
//         );

//         const signingKey = new ethers.utils.SigningKey(CCIP_PRIVATE_KEY);
//         const signature = signingKey.signDigest(ethers.utils.arrayify(toSign));

//         return this._getFullSignature(signature);
//     }

//     async getContentHash(node, chash, owner, expiry) {
//         return this._hash(
//             ['bytes32', 'bytes', 'address', 'uint256'],
//             [node, ethers.utils.arrayify(chash), owner, expiry]
//         );
//     }

//     async getTextRecordHash(node, key, val, owner, expiry) {
//         return this._hash(
//             ['bytes32', 'bytes32', 'bytes32', 'address', 'uint256'],
//             [node, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key)), ethers.utils.keccak256(ethers.utils.toUtf8Bytes(val)), owner, expiry]
//         );
//     }

//     async getAddressHash(node, coinType, addr, owner, expiry) {
//         return this._hash(
//             ['bytes32', 'uint256', 'bytes', 'address', 'uint256'],
//             [node, coinType, ethers.utils.arrayify(addr), owner, expiry]
//         );
//     }
// }

// module.exports = { ENSHasher };

const { ethers } = require('ethers');

// Assuming these values are now directly set here for demonstration,
// but in practice, they should be securely stored and accessed via environment variables.
const BASE_CHAIN_ID = 84532;
const BASE_CONTRACT_ADDRESS = "0x14B4ff9964dbb803967Ffd2D24819EA5a8496476";
const CCIP_PRIVATE_KEY = "0xb9107381136de811b8e393a31c99b02382db3d374502c3b0f80f094d343df8d3";

class ENSHasher {
    constructor() {
        this.l2Resolver = {
            name: 'L2Resolver',
            version: '1',
            chainId: BASE_CHAIN_ID,
            verifyingContract: BASE_CONTRACT_ADDRESS,
        };
    }

    async _getFullSignature(signature) {
        const { r, s, v } = signature;

        // Ensure v is correctly calculated for Ethereum (27 or 28)
        const normalizedV = v < 27 ? v + 27 : v;

        // Concatenate r, s, and v to get the full signature
        return r + s.slice(2) + normalizedV.toString(16);
    }

    async getDomainSeparator() {
        const domainTypeHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(
                'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
            )
        );

        return ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
                [
                    domainTypeHash,
                    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(this.l2Resolver.name)),
                    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(this.l2Resolver.version)),
                    this.l2Resolver.chainId,
                    this.l2Resolver.verifyingContract,
                ]
            )
        );
    }

    async _hash(dataTypes, dataValues) {
        const domainSeparator = await this.getDomainSeparator();
        const dataHash = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(dataTypes, dataValues)
        );

        const toSign = ethers.utils.keccak256(
            ethers.utils.solidityPack(
                ['string', 'bytes32', 'bytes32'],
                ['\x19\x01', domainSeparator, dataHash]
            )
        );

        const signingKey = new ethers.utils.SigningKey(ethers.utils.hexlify(ethers.utils.arrayify(CCIP_PRIVATE_KEY)));
        const signature = signingKey.signDigest(toSign);

        return this._getFullSignature(signature);
    }

    async getContentHash(node, chash, owner, expiry) {
        return this._hash(
            ['bytes32', 'bytes', 'address', 'uint256'],
            [node, ethers.utils.arrayify(chash), owner, expiry]
        );
    }

    async getTextRecordHash(node, key, val, owner, expiry) {
        return this._hash(
            ['bytes32', 'bytes32', 'bytes32', 'address', 'uint256'],
            [node, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key)), ethers.utils.keccak256(ethers.utils.toUtf8Bytes(val)), owner, expiry]
        );
    }

    async getAddressHash(node, coinType, addr, owner, expiry) {
        return this._hash(
            ['bytes32', 'uint256', 'bytes', 'address', 'uint256'],
            [node, coinType, ethers.utils.arrayify(addr), owner, expiry]
        );
    }
}

module.exports = { ENSHasher };
