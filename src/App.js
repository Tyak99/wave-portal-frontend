import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { ethers } from "ethers";
import "./App.css";
import ABI from "./utils/WavePortal.json";

const contractAddress = "0x9E2E4d673e479CFC3425bA704C0c564307e2313C";
export default function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const contractABI = ABI.abi;

  const checkIfWalletConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Wallet is not connected");
      return;
    } else {
      console.log("Wallet is connected", ethereum);
    }

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("Found an authorized account", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    });
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const connectAccount = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask");
    }

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log("connected account", accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: App.js ~ line 43 ~ ethereum.request ~ error",
          error
        );
      });
  };

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    let count = await waveportalContract.getTotalWaves();

    console.log("Get total wave count", Number(count));
  };

  return (
    <div className="container">
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">👋 Hey there!</div>
          <div className="intro">My name is Tunde</div>
          <div className="bio">
            I am a Software Engineer, and a Crypto Enthusiast. Connect your
            Ethereum wallet and wave at me!
          </div>
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>

          {!currentAccount && (
            <button onClick={connectAccount} className="waveButton">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
