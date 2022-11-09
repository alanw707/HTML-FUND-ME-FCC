import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")
const getOwnerButton = document.getElementById("getOwnerButton")
const getBalanceButton = document.getElementById("getBalanceButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
getOwnerButton.onclick = getOwner
getBalanceButton.onclick = getBalance

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            //const contract = new ethers.Contract(contractAddress, abi, signer)
            const balanceInWei = await provider.getBalance(contractAddress)
            document.getElementById("balanceLabel").innerHTML =
                ethers.utils.formatEther(balanceInWei)
        } catch (err) {
            console.log(err)
        }
    } else {
        console.log("please install Meta Mask")
    }
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmountTxt").value
    if (typeof window.ethereum !== "undefined") {
        //provider / connetion to the blockchain - in this case is meta mask
        //signer / wallet / gas
        //contract to interacting with ^ABI
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner() //get account
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransationMine(transactionResponse, provider)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
}

function listenForTransationMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (tx) => {
            //callback once transaction has received
            console.log(`Completed with ${tx.confirmations} confirmations`)
            resolve() //await will wait for the promise here
        })
    })
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing ...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //get account
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transResponse = await contract.withdraw()
            await listenForTransationMine(transResponse, provider)
        } catch (err) {
            console.log(err)
        }
        console.log("Done!")
    }
}

async function getOwner() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //get account
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const transResponse = await contract.getOwner()
        console.log(transResponse)
    }
}
