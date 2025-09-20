import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-verify";

// Etherscan configuration for contract verification
const etherscanConfig = {
    etherscan: {
        apiKey: {
            polygonAmoy: process.env.POLYGONSCAN_API_KEY || ""
        },
        customChains: [
            {
                network: "polygonAmoy",
                chainId: 80002,
                urls: {
                    apiURL: "https://api-amoy.polygonscan.com/api",
                    browserURL: "https://amoy.polygonscan.com"
                }
            }
        ]
    }
} as Partial<HardhatUserConfig>;

export default etherscanConfig;
