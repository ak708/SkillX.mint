import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CreateNFT from "./components/ui/CreateNFT";
import Marketplace from "./components/ui/Marketplace";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/ui/Profile";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/createNFT",
		element: <CreateNFT />,
	},
	{
		path: "/Marketplace",
		element: <Marketplace />,
	},
	{
		path: "/profile",
		element: <Profile />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
