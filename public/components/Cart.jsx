import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Button } from "@material-ui/core";
import axios from "./utils/axiosConfig";

import { CartContext, SettingsContext } from "../App";
import RecieptModal from "./RecieptModal";
const useStyles = makeStyles({
	table: {},
});

function Cart(props) {
	const classes = useStyles();
	const [modal_Open, set_Modal_Open] = useState(false);
	const store_Settings = useContext(SettingsContext);
	const cart_Details = useContext(CartContext);
	const sub_Total = cart_Details.cartItems.length
		? cart_Details.cartItems.reduce(
				(sum, item) => sum + item.price * item.qty,
				0,
		  )
		: 0;
	const _discount = store_Settings
		? (+store_Settings._discount / 100) * sub_Total
		: 0;
	const { cart_Items } = cart_Details;
	const tax = store_Settings ? (+store_Settings.tax / 100) * sub_Total : 0;
	const grand_Total = store_Settings ? sub_Total + tax - _discount : 0;
	const [transaction_Data, set_TransactionData] = useState(null);
	const handleSubmit = async () => {
		let result =
			cart_Items.length !== 0
				? await axios.post("transaction", {
						items: cart_Items,
						_discount,
						grandtotal: grand_Total,
						subtotal: sub_Total,
				  })
				: false;
		if (result && result.data.status === "success") {
			cart_Details.removeAllCartItems();
			set_TransactionData(result.data.data);
			set_Modal_Open(true);
		}
	};

	const handleClickOpen = () => {
		set_Modal_Open(true);
	};

	const handleClose = () => {
		set_Modal_Open(false);
	};

	return (
		<div>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Product</TableCell>
						<TableCell align="center">Quantity</TableCell>

						<TableCell align="right">Total</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{cart_Details.cart_Items.length &&
						cart_Details.cart_Items.map((item) => (
							<TableRow key={item._id}>
								<TableCell align="left">
									<DeleteIcon
										onClick={() => cart_Details.handleCartDelete(item._id)}
									/>
									{item.name} {item.price}
								</TableCell>
								<TableCell align="right">
									<RemoveCircleOutlineIcon
										onClick={() =>
											cart_Details.handleQtyChange(item._id, "decrement")
										}
									/>
									{item.qty}{" "}
									<AddCircleOutlineIcon
										onClick={() =>
											cart_Details.handleQtyChange(item._id, "increment")
										}
									/>
								</TableCell>

								<TableCell align="right">
									{(item.price * item.qty).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell align="left">SubTotal</TableCell>
						<TableCell align="right">{sub_Total.toFixed(2)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">Discount</TableCell>
						<TableCell align="right">{_discount.toFixed(2)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">Tax</TableCell>
						<TableCell align="right">{tax.toFixed(2)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">Grand Total</TableCell>
						<TableCell align="right">{grand_Total.toFixed(2)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">
							<Button variant="contained" color="dark" size="large">
								Cancel
							</Button>
						</TableCell>
						<TableCell align="right">
							<Button
								variant="contained"
								onClick={handleSubmit}
								className="c-btn"
								disabled={cart_Items.length === 0}
								size="large">
								Pay
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<RecieptModal
				isOpen={modal_Open}
				onOpen={handleClickOpen}
				onClose={handleClose}
				transactionData={transaction_Data}
			/>
		</div>
	);
}

export default Cart;
