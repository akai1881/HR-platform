import firebaseService from '../../../../../services/firebaseService/firebaseService';
import { createBrowserHistory } from 'history';

export const uploadFileToStore = async file => {
	const storageRef = firebaseService.storage.ref();
	const fileRef = storageRef.child(file.name);
	await fileRef.put(file);
	const fileUrl = await fileRef.getDownloadURL();
	return fileUrl;
};

export const saveToUserCollections = async (docs, collection, id) => {
	if (!docs || !collection || typeof collection !== 'string' || !id) {
		return;
	}

	const userRef = firebaseService.database.collection('users').doc(id);

	docs.forEach(item => {
		userRef
			.collection(collection)
			.doc(item.id)
			.set({
				...item
			});
	});
};

export const updateUserCollections = (docs, collection, id) => {
	if (!docs || !collection || typeof collection !== 'string' || !id) {
		return;
	}

	const userRef = firebaseService.database.collection('users').doc(id);

	if (collection === 'projects') {
		docs.forEach(async item => {
			console.log(item);
			userRef
				.collection(collection)
				.doc(item.id)
				.set({
					...item
				});
		});
		return;
	}

	docs.forEach(item => {
		console.log(item);
		userRef
			.collection(collection)
			.doc(item.id)
			.set({
				...item
			});
	});
};
