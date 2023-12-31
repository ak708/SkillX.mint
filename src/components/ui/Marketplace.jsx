import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import Navbar from "./Navbar";
import { getDatabase, ref, onValue } from "firebase/database";
import { useWalletStore } from "../../context/wallet";

const Marketplace = () => {
  const [data, setData] = useState();
  const db = getDatabase();
  const listOfNfts = ref(db, "marketPlace/nfts/");

  // onValue(listOfNfts, (snapshot) => {
  //   const nfts = snapshot.val();
  //   setData(nfts);
  // });

  useEffect(() => {
    const fetchData = () => {
      onValue(listOfNfts, (snapshot) => {
        const nfts = snapshot.val();
        setData(nfts || []);
        console.log(data);
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
    <div>
      <Navbar />
      <div className="border-b-2 border-black flex items-center justify-between px-16">
        <h3 className="text-lg font-medium">{data?.length} NFTs</h3>
        <h1 className="text-4xl  text-center py-5 marketplace">Marketplace</h1>
        <button className="bg-black text-white px-2 py-1 rounded-sm border-black border-2 hover:text-black hover:bg-transparent transition-all duration-[0.3s]">
          SEE ALL
        </button>
      </div>
      <div className="w-fit mx-auto grid grid-cols-4 mt-3 p-6 gap-x-12 gap-y-12">
        {/* <NFTCard
          image={nftimage}
          name={"Korangu"}
          price={"12"}
          catagory={"fantasy"}
          uid={10}
        /> */}
        {data?.map((nft, key) => (
          <NFTCard
            key={key}
            image={nft.artwork}
            name={nft.artworkName}
            price={nft.price}
            description={nft.description}
            allData={nft}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
