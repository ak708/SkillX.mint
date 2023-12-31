import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressBar from "@ramonak/react-progress-bar";
import { Link } from "react-router-dom";
import { useWalletStore } from "../../context/wallet";
import { useNavigate } from "react-router-dom";
import { getDatabase, set, child, get } from "firebase/database";
import { ref as fRef } from "firebase/database";
import {
  Client,
  TokenCreateTransaction,
  PrivateKey,
  AccountId,
  AccountCreateTransaction,
  Hbar,
} from "@hashgraph/sdk";

function CreateNFT() {
  const { register, handleSubmit } = useForm();
  const { useState } = React;
  const [files, setFile] = useState([]);
  const [message, setMessage] = useState();
  const [imgUrl, setImageUrl] = useState();
  const [percent, setPercent] = useState(0);
  const { account } = useWalletStore();
  const navigate = useNavigate();
  const operatorKey = PrivateKey.fromStringECDSA(
    process.env.REACT_APP_OPERATOR_KEY
  );
  const operatorId = AccountId.fromString(process.env.REACT_APP_OPERATOR_ID);
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account]);

  async function accountCreator(pvKey, iBal) {
    const response = await new AccountCreateTransaction()
      .setInitialBalance(new Hbar(iBal))
      .setKey(pvKey?.publicKey)
      .execute(client);

    const receipt = await response.getReceipt(client);

    return receipt.accountId;
  }

  const createNFT = async (data) => {
    //Create the NFT
    const treasuryKey = PrivateKey.generateED25519();
    const treasuryId = await accountCreator(treasuryKey, 10);
    const transaction = await new TokenCreateTransaction()
      .setTokenName(data?.artworkName)
      .setTokenSymbol("SkillX")
      .setTreasuryAccountId(operatorId)
      .setInitialSupply(10000)
      .setDecimals(2)
      .setAutoRenewAccountId(operatorId)
      .setAutoRenewPeriod(7000000)
      .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
      .freezeWith(client);

    //Sign the transaction with the treasury key
    const nftCreateTxSign = await transaction.sign(operatorKey);

    //Submit the transaction to a Hedera network
    const nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    const tokenId = nftCreateRx.tokenId;
    console.log(`- Created NFT with Token ID: ${tokenId} \n`);
    return tokenId;
    //Log the token ID
  };

  const getUrl = (img) => {
    const storageRef = ref(storage, `/files/${img.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setImageUrl(url);
        });
      }
    );
  };

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(selectedFile.type)) {
        const img = URL.createObjectURL(selectedFile);
        setFile([img]); // Use an array to store the file URLs
        getUrl(selectedFile);
      } else {
        console.error("Only images are accepted.");
      }
    }
  };

  const removeImage = () => {
    setFile([]);
    console.log("file removed");
  };

  const submitForm = async (data) => {
    // TODO: Taking time to generate token and it is pushing fast to firebase
    toast
      .promise(createNFT(data), {
        loading: "Generating A Token...",
        success: <b>Token Created!</b>,
        error: <b>Could not create Token.</b>,
      })
      .then(async (token) => {
        data = {
          ...data,
          nftTokenId: `${token}`,
          artwork: imgUrl,
          walletAddress: account,
        };
        console.log(data);
        const dbRef = fRef(getDatabase());
        await get(child(dbRef, `marketPlace/nfts/`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log("from nfts", snapshot.val());
            const existingData = snapshot.val();
            const updatedNfts = [...existingData, data];
            set(child(dbRef, `marketPlace/nfts/`), updatedNfts);
          } else {
            const db = getDatabase();
            set(fRef(db, "marketPlace"), {
              nfts: [data],
            });
          }
        });
        await get(child(dbRef, `accounts/${account}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log("from fire", snapshot.val());
              const existingData = snapshot.val();
              const updatedNfts = [...existingData.nfts, data];

              set(child(dbRef, `accounts/${account}/nfts`), updatedNfts).then(
                () => {
                  toast.success("NFT Created!");
                  navigate("/");
                }
              );
            } else {
              const db = getDatabase();
              set(fRef(db, "accounts/" + account), {
                nfts: [data],
              }).then(() => {
                toast.success("NFT Created!");
                navigate("/");
              });
            }
          })
          .catch((error) => {
            console.error(error);
            navigate("/");
          });
      });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <Toaster />
      </div>
      <div className="absolute top-0 left-0"></div>
      <div className="">
        <h1 className="text-center text-3xl font-semibold -mt-28 mb-11">
          Create Your NFT & Stand Out
        </h1>
        <form onSubmit={handleSubmit(submitForm)} className="flex gap-10">
          <div className="">
            {/* Art work upload */}
            <div className="rounded-md shadow-xl bg-gray-50 h-[300px] w-[294px]">
              <div className="p-3">
                <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">
                  {message}
                </span>
                {files.length <= 0 && (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex cursor-pointer flex-col w-full h-[264px] border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
                      <div className="flex flex-col items-center mt-16 justify-center pt-7">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                          Select Artwork
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFile}
                        className="opacity-0"
                        name="files[]"
                        required
                      />
                    </label>
                  </div>
                )}
                {files.length > 0 && (
                  <div className="">
                    <div className="absolute rounded-full -mt-2 -ml-1 cursor-pointer bg-white p-2 hover:shadow-md">
                      <FiX className="h-3 w-3" onClick={removeImage} />
                    </div>
                    <img src={files[0]} className="rounded-md" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                {percent >= 0 && percent <= 100 && (
                  <ProgressBar
                    completed={percent}
                    bgColor="#f58931"
                    borderRadius="3px"
                  />
                )}
                {percent == 100 && (
                  <h1 className="text-black text-center">Upload Complete!</h1>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-[500px]">
            <input
              className="p-3 rounded-md border border-[#da9f3f] hover:shadow-md focus:shadow-md focus:border-2 outline-none w-[500px]"
              {...register("artworkName")}
              type="text"
              placeholder="Enter the name of artwork"
              required
            />
            <input
              className="p-3 rounded-md border border-[#da9f3f] focus:shadow-md hover:shadow-md focus:border-2 outline-none w-[500px]"
              {...register("description")}
              type="text"
              placeholder="Enter the description"
              required
            />
            <input
              className="p-3 rounded-md border border-[#da9f3f] focus:shadow-md hover:shadow-md focus:border-2 outline-none w-[500px]"
              {...register("authorName")}
              type="text"
              placeholder="Enter the name of the author"
              required
            />
            <input
              className="p-3 rounded-md border border-[#da9f3f] focus:shadow-md hover:shadow-md focus:border-2 outline-none w-[500px]"
              {...register("price")}
              type="text"
              placeholder="Enter the price"
              required
            />
            <div className="flex w-full justify-between gap-3">
              <button
                type="submit"
                className="p-3 rounded-md hover:shadow-md w-full border border-green-400 bg-green-400"
              >
                CREATE A NFT
              </button>
              <Link
                type="button"
                to={"/"}
                className="p-3 rounded-md hover:shadow-md text-center w-full border border-red-400 bg-red-400"
              >
                CANCEL
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNFT;
