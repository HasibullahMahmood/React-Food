import CartContext from './cart-context';
import { useReducer } from 'react';

const defaultState = {
	items: [],
	totalPrice: 0,
};

const cartReducer = (prevState, action) => {
	if (action.type === 'ADD') {
		const updatedTotalPrice = prevState.totalPrice + action.item.amount * action.item.price;

		const addedItemIndex = prevState.items.findIndex((item) => item.id === action.item.id);
		const addedItem = prevState.items[addedItemIndex];
		let updatedItems;
		if (addedItem) {
			addedItem.amount = addedItem.amount + action.item.amount;
			updatedItems = [...prevState.items];
			updatedItems[addedItemIndex] = addedItem;
		} else {
			updatedItems = prevState.items.concat(action.item);
		}
		return { items: updatedItems, totalPrice: updatedTotalPrice };
	} else if (action.type === 'REMOVE') {
		const deletedItemIndex = prevState.items.findIndex((item) => item.id === action.id);
		const deletedItem = prevState.items[deletedItemIndex];
		let updatedItems = [...prevState.items];

		if (deletedItem.amount === 1) {
			updatedItems.splice(deletedItemIndex, 1);
		} else {
			updatedItems[deletedItemIndex].amount = deletedItem.amount - 1;
		}
		const updatedTotalPrice = prevState.totalPrice - deletedItem.price;
		return { items: updatedItems, totalPrice: updatedTotalPrice };
	}
	return defaultState;
};

const CartProvider = (props) => {
	const [cartState, dispatchCart] = useReducer(cartReducer, defaultState);

	const addItemToCartHandler = (item) => {
		dispatchCart({ type: 'ADD', item });
	};
	const removeItemFromCartHandler = (id) => {
		dispatchCart({ type: 'REMOVE', id });
	};
	const cartContext = {
		items: cartState.items,
		totalPrice: cartState.totalPrice,
		addItem: addItemToCartHandler,
		remoteItem: removeItemFromCartHandler,
	};
	return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};

export default CartProvider;
