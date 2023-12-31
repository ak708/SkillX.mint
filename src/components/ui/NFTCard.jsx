import React from "react";
import ethereum from "../../assets/ethereum.svg";

import {
  Client,
  PrivateKey,
  AccountId,
  Hbar,
  TransferTransaction,
  TokenAssociateTransaction,
} from "@hashgraph/sdk";
import { getDatabase, set, child, get } from "firebase/database";
import { ref as fRef } from "firebase/database";
import { useWalletStore } from "../../context/wallet";

const NFTCard = (props) => {
  const { account } = useWalletStore();
  const tempKey = process.env.REACT_APP_OPERATOR_KEY;
  const tempId = process.env.REACT_APP_OPERATOR_ID;
  const tempAKey = process.env.REACT_APP_ALICEID;
  console.log(tempKey, tempId, tempAKey);
  const operatorKey = PrivateKey.fromStringECDSA(tempKey);
  const operatorId = AccountId.fromString(tempId);
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  const aliceId = AccountId.fromString(tempAKey);

  const buy = async () => {
    console.log("hello");
    const price = parseInt(props.price);
    console.log(price);
    console.log(operatorKey);
    console.log(operatorId);
    console.log(aliceId);
    const id = props.allData.nftTokenId;

    console.log(id);

    const sendHbar = await new TransferTransaction()
      .addHbarTransfer(operatorId, Hbar.fromTinybars(-price)) //Sending account
      .addHbarTransfer(aliceId, Hbar.fromTinybars(price)) //Receiving account
      .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log(
      "The transfer transaction from my account to the new account was: " +
        transactionReceipt.status.toString()
    );

    const st = transactionReceipt.status.toString();

    if (st == "SUCCESS") {
      //Create the transfer transaction
      console.log("started");

      let associateAliceTx = await new TokenAssociateTransaction()
        .setAccountId(operatorId)
        .setTokenIds([id])
        .freezeWith(client)
        .sign(operatorKey);
      let associateAliceTxSubmit = await associateAliceTx.execute(client);
      let associateAliceRx = await associateAliceTxSubmit.getReceipt(client);
      console.log(
        `- Token association with Alice's account: ${associateAliceRx.status} \n`
      );
      const s = associateAliceRx.status.toString();
      if (s == "SUCCESS") {
        console.log("transfer started");
        const transactionT = new TransferTransaction()
          .addTokenTransfer(id, aliceId, -1)
          .addTokenTransfer(id, operatorId, 1)
          .freezeWith(client);

        const t = process.env.REACT_APP_ALICEKEY;
        const aliceKey = PrivateKey.fromStringECDSA(t);

        //Sign with the sender account private key
        const signTx = await transactionT.sign(aliceKey);

        //Sign with the client operator private key and submit to a Hedera network
        const txResponse = await signTx.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Obtain the transaction consensus status
        const transactionStatusT = receipt.status;
        console.log(
          "The transaction consensus status " + transactionStatusT.toString()
        );

        const di = transactionStatusT.toString();
        if (di == "SUCCESS") {
          const dbRef = fRef(getDatabase());
          // Update the NFT record in Firebase
          await get(child(dbRef, `accounts/${account}/nfts/`)).then(
            (snapshot) => {
              if (snapshot.exists()) {
                const data = props.allData;
                data.walletAddress = account;
                console.log("from nfts", snapshot.val());
                const existingData = snapshot.val();
                const updatedNfts = [...existingData, data];
                set(child(dbRef, `accounts/${account}/nfts`), updatedNfts);
              } else {
                const data = props.allData;
                data.walletAddress = account;
                const db = getDatabase();
                set(fRef(db, `accounts/${account}/`), {
                  nfts: [data],
                });
              }
            }
          );

          console.log("done writing");
        }
      }

      //v2.0.5
    }
  };

  return (
    <div className="max-w-[300px] rounded-md hover:shadow-xl hover:-translate-y-3 duration-200 ease-in-out cursor-pointer">
      <div className="shadow-custom w-fit p-4">
        <h3 className="text-lg font-medium mb-2">{props.name}</h3>
        <img src={props.image} alt="nft" className="" loading="lazy" />
        <div className="text-gray-700 text-sm my-2">
          {/* <p>
            Catagory <span>.</span> {props.catagory}
          </p> */}
          <div className="text-base font-medium flex justify-between">
            Fixed Price{" "}
            <span className="flex items-center gap-2">
              {" "}
              <img src={ethereum} className="h-5" /> {props.price} ETH
            </span>
          </div>
          <span>{props.description}</span>
        </div>
        <button
          onClick={buy}
          className="bg-black text-white w-full px-2 py-1 rounded-md border-black border-2 hover:text-black hover:bg-transparent transition-all duration-[0.3s]"
        >
          BUY
        </button>
      </div>
    </div>
  );
};

export default NFTCard;
