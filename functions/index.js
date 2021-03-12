const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.newUserRegister = functions.https.onCall(data => {
	const { email, password, id, projects, career, ...userData } = data;
	admin
		.auth()
		.createUser({
			uid: id,
			email,
			password
		})
		.then(async userRecord => {
			const userRef = await admin.firestore().collection('users').doc(userRecord.id);
			await userRef.add({ email, uid: userRecord.id, userData });
			await userRef.firestore().collection('projects').add(projects);
			await userRef.firestore().collection('career').add(career);
		})
		.catch(error => {
			console.log('Error creating new user:', error);
		});
});
