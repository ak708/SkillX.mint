import React, { useState } from "react";
import walletConnectFcn from "./components/hedera/walletConnect.js";
import HomeScreen from "../src/components/ui/HomeScreen.jsx";
import "./styles/App.css";
import { useWalletStore } from "./context/wallet.js";

//TODO: Thinking of adding zustand for making the wallet connection global

function App() {
  const {
    walletData,
    account,
    network,
    contractAddress,
    connectTextSt,
    contractTextSt,
    executeTextSt,
    connectLinkSt,
    contractLinkSt,
    executeLinkSt,
    setWalletData,
    setAccount,
    setNetwork,
    setContractAddress,
    setConnectTextSt,
    setContractTextSt,
    setExecuteTextSt,
    setConnectLinkSt,
    setContractLinkSt,
    setExecuteLinkSt,
  } = useWalletStore();

  async function connectWallet() {
    if (account !== undefined) {
      setConnectTextSt(`🔌 Account ${account} already connected ⚡ ✅`);
    } else {
      const wData = await walletConnectFcn();

      let newAccount = wData[0];
      let newNetwork = wData[2];
      if (newAccount !== undefined) {
        setConnectTextSt(`🔌 Account ${newAccount} connected ⚡ ✅`);
        setConnectLinkSt(
          `https://hashscan.io/${newNetwork}/account/${newAccount}`
        );

        setWalletData(wData);
        setAccount(newAccount);
        setNetwork(newNetwork);
        setContractTextSt();
      }
    }
  }

  return <HomeScreen connectWallet={connectWallet} walletAdd={connectTextSt} />;
}
export default App;
