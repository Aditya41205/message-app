import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const contractAddress = "0x2f64c4fc49d61fca17c9c9c35501624d506dc4bd";
const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
    "name": "retrieve",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
];

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is required to connect a wallet.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred while connecting the wallet.");
    }
  };

  const storeMessage = async () => {
    if (!message) {
      setError("Please enter a message.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.store(message);
      await tx.wait();
      setMessage("");
      alert("Message stored successfully!");
    } catch (err) {
      setError(err.message || "An error occurred while storing the message.");
    }
  };

  const retrieveMessage = async () => {
    if (!senderAddress) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const result = await contract.retrieve(senderAddress);
      setRetrievedMessage(result || "No message found for this address.");
    } catch (err) {
      setError(err.message || "An error occurred while retrieving the message.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Message DApp</h1>
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Store Message</h2>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={storeMessage}>Store</button>
      </div>
      <div>
        <h2>Retrieve Message</h2>
        <input
          type="text"
          placeholder="Enter sender address"
          value={senderAddress}
          onChange={(e) => setSenderAddress(e.target.value)}
        />
        <button onClick={retrieveMessage}>Retrieve</button>
        {retrievedMessage && <p>Message: {retrievedMessage}</p>}
      </div>
    </div>
  );
}

export default App;
