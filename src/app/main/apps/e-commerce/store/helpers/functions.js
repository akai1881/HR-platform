import firebaseService from '../../../../../services/firebaseService/firebaseService';

export const uploadFileToStore = async file => {
  const storageRef = firebaseService.storage.ref();
  const fileRef = storageRef.child(file.name);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
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
    docs.forEach(item => {
      console.log(item);
      userRef
        .collection(collection)
        .doc(item.id)
        .set({
          ...item
        }).then(res => console.log('success'));
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
      }).then(res => console.log('success'));
  });
};

export const getTodayData = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
};

