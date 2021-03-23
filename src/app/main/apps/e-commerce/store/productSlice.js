import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import firebaseService from 'app/services/firebaseService/firebaseService';
import { saveToUserCollections, updateUserCollections, uploadFileToStore } from './helpers/functions';
import config from 'app/services/firebaseService/firebaseServiceConfig';
import firebase from 'firebase/app';
import { createBrowserHistory } from 'history';
import { getData } from 'app/main/apps/contacts/store/contactsSlice';

const history = createBrowserHistory();

export const getProduct = createAsyncThunk('eCommerceApp/product/getProduct', async params => {
	const response = await axios.get('/api/e-commerce-app/product', { params });
	const data = await response.data;

	return data;
});

export const getUserData = createAsyncThunk('eCommerceApp/product/getUserData', async (userId, { dispatch }) => {
	const userRef = firebaseService.database.collection('users').doc(userId);
	const projectsRef = await userRef.collection('projects').get();
	const careerRef = await userRef.collection('career').orderBy('status', 'desc').get();

	const careerData = careerRef.docs.map(doc => {
		return {
			...doc.data()
		};
	});
	const projectsData = projectsRef.docs.map(doc => {
		return {
			...doc.data()
		};
	});
	const userData = await userRef.get().then(doc => doc.data());
	const id = await userRef.get().then(doc => doc.id);

	const user = {
		...userData,
		id,
		projects: projectsData,
		career: careerData
	};

	return user;
});

export const saveProduct = createAsyncThunk('eCommerceApp/product/saveProduct', async product => {
	// const response = await axios.post('/api/e-commerce-app/product/save', product);
	// const data = await response.data;
	// return data;
});

export const registerUser = createAsyncThunk('eCommerceApp/product/registerUser', async (userData, { dispatch }) => {
	const { email, password, projects, career, ...rest } = userData;

	let secondaryApp = firebase.initializeApp(config, 'SECOND');

	await secondaryApp
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then(async function (firebaseUser) {
			const user = firebaseUser.user;
			await firebaseService.database
				.collection('users')
				.doc(user.uid)
				.set({
					email,
					id: user.uid,
					uid: user.uid,
					...rest
				});
			await saveToUserCollections(projects, 'projects', user.uid);
			await saveToUserCollections(career, 'career', user.uid);
			secondaryApp.auth().signOut();
			await dispatch(getData({ id: 'all' }));
		});
	await secondaryApp.delete();
});

// export const addNewUser = createAsyncThunk(
// 	'eCommerceApp/product/addNewUser',
// 	async ({ projects, career, id, avatarFile, ...userData }) => {
// 		registerUser()
// 		// await firebaseService.database
// 		// 	.collection('users')
// 		// 	.doc(id)
// 		// 	.set({
// 		// 		...userData,
// 		// 		id,
// 		// 		avatarFile
// 		// 	});
// 		// await saveToUserCollections(projects, 'projects', id);
// 		// await saveToUserCollections(career, 'career', id);
// 	}
// );

export const addNewUser = createAsyncThunk(
	'eCommerceApp/product/addNewUser',
	async ({ uid, projects, career, avatarFile, ...data }) => {
		await firebaseService.database
			.collection('users')
			.doc(uid)
			.set({
				...data,
				uid,
				avatarFile
			});
		await saveToUserCollections(projects, 'projects', uid);
		await saveToUserCollections(career, 'career', uid);
	}
);

export const editUserData = createAsyncThunk(
	'eCommerceApp/product/editUserData',
	async ({ projects, career, id, avatarFile, ...data }, { dispatch }) => {
		await firebaseService.database
			.collection('users')
			.doc(id)
			.update({
				...data,
				avatarFile
			})
			.then(() => console.log('UPDATED AND FULLFILLED'));
		updateUserCollections(projects, 'projects', id);
		updateUserCollections(career, 'career', id);
		await dispatch(getData({ id: 'all' }));
	}
);

const productSlice = createSlice({
	name: 'eCommerceApp/product',
	initialState: {
		newUser: null,
		transfer: false,
		loading: false,
		user: null,
		projectDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		},
		careerDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	},
	reducers: {
		newUser: {
			reducer: (state, action) => {
				state.user = action.payload;
			},
			prepare: event => ({
				payload: {
					id: '',
					firstName: '',
					lastName: '',
					patronymic: '',
					phone1: '',
					phone2: '',
					phone3: '',
					email: '',
					birthday: '',
					adress: '',
					avatarFile: '',
					department: '',
					team: '',
					teamLead: '',
					passportId: '',
					firstDayAtJob: '',
					role: '',
					maritalStatus: '',
					rank: '',
					bank: '',
					creditCardNumber: '',
					accountNumber: '',
					projects: [],
					career: []
				}
			})
		},
		setTransfer: (state, action) => {
			state.transfer = action.payload;
		},
		getProjects: (state, action) => {
			state.projectDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: action.payload
			};
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		editProject: (state, action) => {
			state.projectDialog = {
				type: 'edit'
			};
		},
		// getCareer: (state, action) => {
		// 	state.newProduct.career = action.payload;
		// },
		openNewProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openNewCareerDialog: (state, action) => {
			state.careerDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewCareerDialog: (state, action) => {
			state.careerDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditCareerDialog: (state, action) => {
			state.careerDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditCareerDialog: (state, action) => {
			state.careerDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		setToNull: (state, action) => {
			state.user = null;
		}
	},
	extraReducers: {
		[getUserData.pending]: (state, action) => {
			state.loading = true;
		},
		[getUserData.rejected]: (state, action) => {
			state.user = null;
			state.loading = true;
		},
		[getUserData.fulfilled]: (state, action) => {
			state.user = action.payload;
			state.loading = false;
		}
	}
});

export const {
	newUser,
	openNewProjectDialog,
	openEditProjectDialog,
	openNewCareerDialog,
	openEditCareerDialog,
	setToNull,
	setLoading,
	closeNewCareerDialog,
	closeEditCareerDialog,
	closeNewProjectDialog,
	closeEditProjectDialog
} = productSlice.actions;

export default productSlice.reducer;
