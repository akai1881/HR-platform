import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firebase-firestore';
import 'firebase/firebase-storage';
import config from './firebaseServiceConfig';

class FirebaseService {
	init(success) {
		if (Object.entries(config).length === 0 && config.constructor === Object) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(
					'Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js'
				);
			}
			success(false);
			return;
		}

		if (firebase.apps.length) {
			return;
		}
		firebase.initializeApp(config);

		this.db = firebase.database();
		this.database = firebase.firestore();
		this.auth = firebase.auth();
		this.storage = firebase.storage();
		// if (window.location.hostname === 'localhost') {
		// 	this.database.useEmulator('localhost', 8080);
		// 	this.auth.useEmulator('http://localhost:9099');
		// 	this.firebase.functions().useEmulator('localhost', 5001);
		// }
		success(true);
	}

	getUserData = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			// this.db
			// 	.ref(`users/${userId}`)
			// 	.once('value')
			// 	.then(snapshot => {
			// 		const user = snapshot.val();
			// 		resolve(user);
			// 	});

			this.database
				.collection('users')
				.doc(userId)
				.get()
				.then(doc => {
					if (doc.exists) {
						console.log('Document data:', doc.data());
						const user = doc.data();
						resolve(user);
					} else {
						// doc.data() will be undefined in this case
						console.log('No such document!');
					}
				});
		});
	};

	updateUserData = user => {
		if (!firebase.apps.length) {
			return false;
		}
		console.log('THIS IS USER', user);
		return this.database.doc(`users/${user.uid}`).set(user);
	};

	onAuthStateChanged = callback => {
		if (!this.auth) {
			return;
		}
		this.auth.onAuthStateChanged(callback);
	};

	signOut = () => {
		if (!this.auth) {
			return;
		}
		this.auth.signOut();
	};
}

const instance = new FirebaseService();

export default instance;
