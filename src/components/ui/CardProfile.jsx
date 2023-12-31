import React from "react";
import ethereum from "../../assets/ethereum.svg";

const NFTCard = (props) => {
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
			</div>
		</div>
	);
};

export default NFTCard;
