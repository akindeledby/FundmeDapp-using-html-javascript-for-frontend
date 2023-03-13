import { ethers, Signer } from "./ethers-5.7.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getWalletBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Not Connected! Please install Metamask";
  }
}

async function fund(ethAmount) {
  console.log(`You are about to fund with ${ethAmount}`);
  ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    /* To create a fund function/transact, we need the following:
    1. Provider to connect to the blockchain using web3.js and ethers package
    2. Signer which is an account available in Metamask 
    3. Address of the deployer contract
    4. ABI of the deployer contract
    */
    const provider = new ethers.providers.Web3Provider(window.ethereum); // provider is connected to our metamask
    const signer = provider.getSigner(); // this will return whatever wallet is connected to the provider(which is now the metamask)
    // the signer is now the account itself that is connected that will sign the transaction
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // here, we will create an await statement to wait for the fuunction "listenForTransactionMine" to
      // run completely
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

// the code/function below allows the user to get a notification that the transaction is completed and it is mined
// so we will create a function and not an async function
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining... ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (TransactionReceipt) => {
      console.log(
        `Completed with ${TransactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getWalletBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // this will return whatever wallet is connected to the provider(which is now the metamask)
    // the signer is now the account itself that is connected that will sign the transaction
    const contract = new ethers.Contract(contractAddress, abi, signer);
  }
}
