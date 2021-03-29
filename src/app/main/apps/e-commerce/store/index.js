import { combineReducers } from '@reduxjs/toolkit';
import orders from './ordersSlice';
import product from './productSlice';
import contacts from 'app/main/apps/contacts/store/contactsSlice';
import products from './productsSlice';

const reducer = combineReducers({
	contacts,
	products,
	product,
	orders
});

export default reducer;
