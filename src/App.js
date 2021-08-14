import logo from "./logo.svg";
import "./App.css";
import Person from "./components/Person";
import Title from "./components/Title";
import Users from "./components/Users";
import UserForm from "./components/UserForm";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import User from "./components/User";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/LoginPanel";
import LoginPanel from "./screens/LoginPanel";
import React, { useState, useEffect } from "react";
import axios from "./components/utils/axiosConfig";

export const CartContext = React.createContext();
export const SettingsContext = React.createContext();

function App() {
	const [cart_Items, set_Cart_Items] = useState([]);
	const [all_Products, set_All_Products] = useState(null);
	const [store_Settings, set_Store_Settings] = useState(null);
	const handleQtyChange = (id, type) => {
		let index = cart_Items.findIndex((item) => item._id === id);
		if (index !== -1) {
			let new_Cart_Items = [...cart_Items];
			if (new_Cart_Items[index]["qty"] === 1 && type === "decrement") return;
			type === "increment"
				? new_Cart_Items[index]["qty"]++
				: new_Cart_Items[index]["qty"]--;

			set_Cart_Items(new_Cart_Items);
		}
	};

	const handleCartDelete = (id) => {
		let index = cart_Items.findIndex((item) => item._id === id);
		let new_Cart_Items = [...cart_Items];
		new_Cart_Items.splice(index, 1);
		set_Cart_Items(new_Cart_Items);
	};
	const removeAllCartItems = () => {
		set_Cart_Items([]);
	};

	const handleSelection = (id) => {
		let index = cart_Items.findIndex((item) => item._id == id);
		if (index === -1) {
			let product = all_Products.find((product) => product._id === id);
			product.qty = 1;
			product.price = +product.price;
			set_Cart_Items([...cart_Items, product]);
		} else {
			let new_Cart_Items = [...cart_Items];
			new_Cart_Items.splice(index, 1);
			set_Cart_Items(new_Cart_Items);
		}
	};
	useEffect(() => {
		axios("product?limit=100000").then((result) =>
			set_All_Products(result.data.data.products),
		);
		axios("setting").then((result) => set_Store_Settings(result.data.data));
	}, []);

	return (
		<div>
			<CartContext.Provider
				value={{
					cart_Items,
					handleQtyChange,
					handleSelection,
					handleCartDelete,
					removeAllCartItems,
				}}>
				<SettingsContext.Provider value={store_Settings}>
					<Switch>
						<Route path="/login" component={LoginPanel} />
						<Route
							path="/dashboard"
							render={(props) => {
								if (localStorage.getItem("token"))
									return <Dashboard {...props} />;
								return <Redirect to="/login" />;
							}}
						/>

						<Route path="/404" component={NotFound} />
						<Redirect from="/" to="/404" />
					</Switch>
				</SettingsContext.Provider>
			</CartContext.Provider>
		</div>
	);
}

export default App;
