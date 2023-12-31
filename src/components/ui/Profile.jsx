import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import nftimage from "../../assets/nftimage1.jpg";
import CardProfile from "./CardProfile";
import { useWalletStore } from "../../context/wallet";
import { getDatabase, ref, onValue } from "firebase/database";

const Profile = () => {
  const nftQuotes = [
    "'NFTs are redefining ownership in the digital age.'",
    "'Blockchain technology empowers artists through NFTs, giving them control over their work.'",
    "'NFTs are not just digital assets; they represent a paradigm shift in the art world.'",
    "'Tokenizing real-world assets as NFTs opens up new possibilities for investment and ownership.'",
    "'Smart contracts enable transparent and automatic royalty payments for NFT creators.'",
    "'NFTs are bringing a new level of scarcity and uniqueness to the digital realm.'",
    "'The intersection of art and technology is evident in the rise of NFTs as a form of digital expression.'",
    "'NFTs have the potential to revolutionize how we perceive and trade digital assets.'",
    "'Digital scarcity, powered by blockchain, is the key innovation behind NFTs.'",
    "'The decentralized nature of NFTs is reshaping traditional notions of ownership and authenticity.'",
  ];
  const dayOfWeek = new Date().getDay();
  const { account } = useWalletStore();
  // console.log("ac from profile :", account);
  const selectedQuote = nftQuotes[dayOfWeek % nftQuotes.length];

  const [balance, setBalance] = useState("");
  const [data, setData] = useState();
  const db = getDatabase();
  const listOfNfts = ref(db, "accounts/" + account + "/nfts");

  useEffect(() => {
    if (account) {
      const get = async () => {
        const balan = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const wei = parseInt(balan, 16);
        const eth = wei / Math.pow(10, 18);
        setBalance(eth);
      };
      get();
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      onValue(listOfNfts, (snapshot) => {
        const nfts = snapshot.val();
        setData(nfts || []);
      });
    };

    // Initial data fetch
    fetchData();

    // Realtime updates
    const unsubscribe = onValue(listOfNfts, (snapshot) => {
      const nfts = snapshot.val();
      setData(nfts || []);
    });

    return () => {
      // Cleanup subscription on component unmount
      unsubscribe();
    };
  }, []);

  return (
    <div className="">
      <Navbar />
      <div className="w-fit mx-auto px-14">
        <div className="mt-14 mb-12 text-center">
          {data && data.length > 0 && (
            <img
              src={data[0]?.artwork}
              className="w-[250px] rounded-full mx-auto my-6"
              alt="Profile"
            />
          )}
          <p className="mb-6 text-lg font-bold">{account}</p>
          <p>{selectedQuote}</p>
        </div>
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Account Balance</h2>
          <p className="font-extrabold text-lg tracking-widest">
            {balance}
            ℏℏ
          </p>
        </div>
        <div className="font-bold text-3xl">
          <h2 className="text-center">NFT's Owned</h2>
          <div className="grid grid-cols-4 mt-3 p-6 gap-x-12 gap-y-12">
            {data?.map((nft) => (
              <CardProfile
                key={nft.artworkName}
                image={nft.artwork}
                name={nft.artworkName}
                price={nft.price}
                description={nft.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
