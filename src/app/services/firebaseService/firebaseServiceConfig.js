const prodConfig = {
	apiKey: 'AIzaSyBTXNPUb0oCrxT6TNpp-Z0sqhr6k-jDJK8',
	authDomain: 'fuse-firebase-91922.firebaseapp.com',
	databaseURL: 'https://fuse-firebase-91922-default-rtdb.europe-west1.firebasedatabase.app/',
	projectId: 'fuse-firebase-91922',
	storageBucket: 'gs://fuse-firebase-91922.appspot.com',
	messagingSenderId: '833886191203'
};

const devConfig = {
	apiKey: 'AIzaSyBTXNPUb0oCrxT6TNpp-Z0sqhr6k-jDJK8',
	authDomain: 'fuse-firebase-91922.firebaseapp.com',
	databaseURL: 'https://fuse-firebase-91922-default-rtdb.europe-west1.firebasedatabase.app/',
	projectId: 'fuse-firebase-91922',
	storageBucket: 'gs://fuse-firebase-91922.appspot.com',
	messagingSenderId: '833886191203'
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
