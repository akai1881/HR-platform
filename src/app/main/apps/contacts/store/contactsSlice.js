import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getData = createAsyncThunk('contacts/getData', async (routeParams, { dispatch }) => {
	// routeParams = routeParams || 'all';
	if (routeParams.id !== 'all') {
		const usersRef = await firebaseService.database
			.collection('users')
			.where('department.id', '==', routeParams.id)
			.where('role', '!=', 'admin')
			.get();
		const usersData = await usersRef.docs.map(user => ({ ...user.data(), id: user.id }));
		return usersData;
	} else {
		const usersRef = await firebaseService.database.collection('users').where('role', '!=', 'admin').get();
		const usersData = await usersRef.docs.map(user => ({ ...user.data(), id: user.id }));
		return usersData;
	}
});

export const getDepartments = createAsyncThunk('contacts/getDepartments', async (_, { getState }) => {
	const departmentsRef = await firebaseService.database.collection('departments').get();
	const departments = await departmentsRef.docs.map(doc => ({ ...doc.data() }));
	return departments;
});

export const addDepartment = createAsyncThunk('contactsApp/addDepartment', async (newDepartment, { dispatch }) => {
	await firebaseService.database
		.collection('departments')
		.doc(newDepartment.id)
		.set(newDepartment)
		.then(() => {
			dispatch(getDepartments());
			console.log('user added successfully');
		});
});

export const deleteUser = createAsyncThunk('contactsApp/contacts/deleteUser', async (data, { dispatch }) => {
	const { id, params } = data;
	await firebaseService.database
		.collection('users')
		.doc(id)
		.delete()
		.then(() => {
			dispatch(getData(params));
		})
		.catch(error => {
			console.error('ERROR', error);
		});
});

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
	name: 'contactsApp/contacts',
	initialState: contactsAdapter.getInitialState({
		users: [],
		departments: [],
		searchText: '',
		routeParams: {},
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewDepartmentDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewDepartmentDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditDepartmentDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditDepartmentDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[getData.fulfilled]: (state, action) => {
			state.users = action.payload;
		},
		[getDepartments.fulfilled]: (state, action) => {
			state.departments = action.payload;
		}
	}
});

export const {
	setContactsSearchText,
	openNewDepartmentDialog,
	closeNewDepartmentDialog,
	openEditDepartmentDialog,
	closeEditDepartmentDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;
