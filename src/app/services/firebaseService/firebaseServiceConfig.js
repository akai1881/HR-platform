const prodConfig = {
	apiKey: 'AIzaSyBCYXWubK1mfcj1CPkvCUPpCWKE4Ap7C-c',
	authDomain: 'hrplatform.firebaseapp.com',
	// databaseURL: 'https://fuse-firebase-91922-default-rtdb.europe-west1.firebasedatabase.app/',
	projectId: 'hrplatform',
	storageBucket: 'hrplatform.appspot.com',
	messagingSenderId: '677090664924'
};

const devConfig = {
	apiKey: 'AIzaSyBCYXWubK1mfcj1CPkvCUPpCWKE4Ap7C-c',
	authDomain: 'hrplatform.firebaseapp.com',
	// databaseURL: 'https://fuse-firebase-91922-default-rtdb.europe-west1.firebasedatabase.app/',
	projectId: 'hrplatform',
	storageBucket: 'hrplatform.appspot.com',
	messagingSenderId: '677090664924'
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
