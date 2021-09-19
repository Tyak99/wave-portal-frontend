import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { ethers } from "ethers";
import "./App.css";
import ABI from "./utils/WavePortal.json";

const formatWei = (wei) => {
  const amount = ethers.utils.formatEther(wei);
  return amount;
};
console.log(process.env.REACT_APP_CONTRACT_ADDRESS);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
export default function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [mining, setMining] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const contractABI = ABI.abi;

  const getTotalWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const waves = await waveportalContract.getWaves();

    const reformedWaves = waves.map((wave) => {
      return {
        address: wave.waver,
        message: wave.message,
        timestamp: new Date(wave.timestamp * 1000),
        amountEarned: formatWei(wave.amountEarned),
      };
    });
    setAllWaves(reformedWaves);

    waveportalContract.on(
      "newWave",
      (from, timestamp, amountEarned, message) => {
        setAllWaves([
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
            amountEarned: formatWei(amountEarned),
          },
          ...waves,
        ]);
      }
    );
  };

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

  useEffect(() => {
    if (!currentAccount) return;
    getTotalWaves();
  }, [currentAccount]);

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
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const waveportalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const waveTxn = await waveportalContract.wave(message, {
        gasLimit: 300000,
      });
      setMining(true);
      console.log("Mmining", waveTxn.hash);
      await waveTxn.wait();
      setMining(false);

      setMessage("");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="container">
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">👋 Hey there!</div>
          <div className="intro">My name is Babatunde</div>
          <div className="bio">
            I am a Software Engineer, and a Crypto Enthusiast. With the help of
            <span>
              <a
                href="https://twitter.com/_buildspace"
                target="_blank"
                rel="noreferrer"
                style={{ color: "aqua" }}
              >
                _buildspace,
              </a>
            </span>{" "}
            I developed this Web3 app with Solidity and Ethereum smart
            contracts. Do you want to see your messages live on the blockchain?
            Eazzzy. Connect your Ethereum wallet, type your message, and wave at
            me!
          </div>
          {currentAccount && (
            <>
              <textarea
                type="text"
                style={{ maxWidth: "100%", marginTop: "16px", padding: "10px" }}
                placeholder="Your Message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              {mining ? (
                <>
                  <button className="waveButton ld-ext-right running">
                    Mining...
                    <div
                      class="ld ld-ring ld-coin-h"
                      style={{ background: "black" }}
                    ></div>
                  </button>
                  <p
                    style={{
                      color: "#00ffa2",
                      marginTop: "10px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    Lesgoo!! Your message is currently being sent to the
                    blockchain.
                  </p>
                </>
              ) : (
                <>
                  <button className="waveButton" onClick={wave}>
                    Wave
                  </button>
                  <p
                    style={{
                      color: "white",
                      marginTop: "10px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    There is also a 50% chance you earn 0.0001 ETH every time
                    you wave :)
                  </p>
                </>
              )}

              <div style={{ marginTop: "2rem" }}>
                <h2
                  style={{
                    color: "white",
                    textAlign: "center",
                    borderBottom: "1px solid",
                  }}
                >
                  Check out the waves!!🏄🏻
                </h2>
                <div>
                  <p className="waveTime">Waves Count: {allWaves.length}</p>
                </div>

                {allWaves.map((wave) => {
                  return (
                    <div
                      key={wave.timestamp.toString()}
                      style={{
                        backgroundColor: "#f1bfca",
                        marginTop: "1rem",
                        padding: "0.5rem",
                      }}
                    >
                      <p>Address: {wave.address}</p>
                      <p>Message: {wave.message}</p>
                      <p>Time: {wave.timestamp.toString()}</p>
                      <p>
                        Amount Earned:{" "}
                        {wave.amountEarned > 0
                          ? `${wave.amountEarned} ETH`
                          : "Sorry, try again :("}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!currentAccount && (
            <div>
              <button onClick={connectAccount} className="waveButton">
                Connect Wallet
              </button>
              <p>
                You need to connect your wallet before you can wave at me :)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
