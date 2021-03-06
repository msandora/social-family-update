import firebase from '../../config/firebase';

export function addScreamChatComment(screamId, values) {
  const user = firebase.auth().currentUser;
  const newComment = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    text: values.comment,
    date: Date.now(),
    parentId: values.parentId,
  };
  return firebase.database().ref(`scream_chat/${screamId}`).push(newComment);
}

export function getScreamChatRef(screamId) {
  return firebase.database().ref(`scream_chat/${screamId}`).orderByKey();
}

export function uploadScreamImageToFirebaseStorage(file, filename, screamId) {
  const user = firebase.auth().currentUser;
  const storageRef = firebase.storage().ref();
  return storageRef.child(`${user.uid}/scream_images/${filename}`).put(file);
}

export function uploadImage(file, filename) {
  return firebase.storage().ref(`images/${filename}`).put(file);
}

export function deleteScreamImageFromFirebaseStorage(filename, screamId) {
  const userUid = firebase.auth().currentUser.uid;
  const storageRef = firebase.storage().ref();
  const photoRef = storageRef.child(`${userUid}/scream_images/${filename}`);
  return photoRef.delete();
}
