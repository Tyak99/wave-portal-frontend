import * as React from "react";
// import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const wave = () => {};

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
        </div>
      </div>
    </div>
  );
}
