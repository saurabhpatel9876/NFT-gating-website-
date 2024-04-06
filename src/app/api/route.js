const { Web3 } = require('web3');
import { NextResponse } from "next/server"
import { contractABI } from '@/blockchain/abi';

const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/RGeBryd3ji7leE269e5y6G6LRzdhnU0m")
const contractAddress = "0x2B408772552c602A4F2b55A6b10cb82e929c7DA6"
const contract = new web3.eth.Contract(contractABI, contractAddress)
// console.log("contrta:-----:",contract)

const fetchNFTs = async (account) => {
    try {
        const nftBalance = await contract.methods.balanceOf(account).call();
        return { userNFTs: Number(nftBalance) }
        console.log("nftbalance:---", nftBalance)
    } catch (error) {
        console.log('Error fetching NFTs', error);
    }
}


export async function POST(request) {
    const { from } = await request.json()
    console.log("frommm:", from)
    try {


        const numNFTs = await fetchNFTs(from)

        if (numNFTs.userNFTs > 0) {
            return NextResponse.json(numNFTs, {
                status: 201,
            })
        } else {
            return NextResponse.json({
                message: "failed to 0 nft",
                success: false,
            }, {
                status: 404
            });
        }
    } catch (error) {
        console.log("err in post;;;---", error)
        return NextResponse.json({
            message: "failed to get post nfts",
            success: false,
        }, {
            status: 500
        });
    }
}