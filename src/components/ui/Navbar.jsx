import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<div>
			<div className="flex justify-between items-center px-6 py-8 border-b-2 border-black">
				<Link to={"/"} className="text-3xl font-bold">
					SkillX.<span className="text-[#228B54] font-extrabold">mint</span>
				</Link>
				<div className="flex items-center">
					<Link
						to={"/profile"}
						className="border-r-2 border-black hover:underline-offset-8 hover:underline  px-5  font-medium"
					>
						Profile
					</Link>
					<Link
						to={"/Marketplace"}
						className="border-r-2 border-black hover:underline-offset-8 hover:underline px-5  font-medium"
					>
						MarketPlace
					</Link>
					<Link
						to={"/createNFT"}
						className="border-r-2 border-black hover:underline-offset-8 hover:underline  px-5  font-medium"
					>
						Create NFT
					</Link>
					<Link className="border-r px-5 hover:underline-offset-8 hover:underline font-medium">
						Transactions
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
