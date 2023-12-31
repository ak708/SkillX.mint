import React from "react";
import { FaForward } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { FaGetPocket } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import image from "../../iphonex4.png";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const HomeScreen = ({ connectWallet, walletAdd }) => {
  return (
    <div className="bg-[#F8F3E3] h-screen flex">
      <div className="w-[70%] relative">
        <Navbar />
        <div className="max-w-[900px] mx-auto mt-[100px]">
          <div className="">
            <h1 className="text-6xl font-bold tracking-wide mb-5">
              Empower your potential,
            </h1>
            <h1 className="text-6xl font-bold tracking-wide">
              exchange talents effortlessly.
            </h1>
          </div>
          <div className="max-w-md my-5">
            Experience a decentralized skill exchange powered by Hedera,
            enabling seamless swapping of talents and unlocking your full
            potential.
            <br />
            {walletAdd}
          </div>
          <div className="absolute right-0 bottom-[100px]">
            <div className=" flex items-center border-y-2 border-l-2 border-black  font-medium text-lg max-w-[600px] ">
              <div className="border-r-2 border-black px-5 flex flex-col items-center justify-center w-[150px]">
                <FaForward className="w-10 h-7 mt-2" />
                <p>Send</p>
              </div>
              <div className="border-r-2 border-black px-5 flex flex-col items-center justify-center w-[150px]">
                <FaBalanceScale className="w-10 h-7 mt-2" />
                <p>Exchange</p>
              </div>
              <div className="border-r-2 border-black px-5 flex flex-col items-center justify-center w-[150px]">
                <FaBitcoin className="w-10 h-7 mt-2" />
                <p>Earn</p>
              </div>
              <div className=" px-5 flex flex-col items-center justify-center  w-[150px]">
                <FaGetPocket className="w-10 h-7 mt-2" />
                <p>Receive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[30%] border-l-2 border-black relative">
        <img
          src={image}
          className="absolute top-6 w-[450px] right-20 rotate-[-15deg]"
        />
        <button
          className={`absolute bottom-0 h-[100px] w-full ${
            !walletAdd ? "bg-[#3E51C8]" : "bg-[#228B54]"
          } flex justify-center items-center text-xl text-white cursor-pointer hover:tracking-widest transition-all duration-[0.3s]`}
          onClick={connectWallet}
        >
          {!walletAdd ? (
            <>
              Connect Wallet <FaArrowRight className="ml-5" />
            </>
          ) : (
            <>Wallet Connected!</>
          )}
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
