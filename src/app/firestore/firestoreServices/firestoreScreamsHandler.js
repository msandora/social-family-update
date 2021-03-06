import firebase from '../../config/firebase';

const db = firebase.firestore();

export function fetchScreamsFromFirestore(limit, lastVisible = null) {
  if (lastVisible == null) {
    let screamsRef = db
      .collection('screams')
      .orderBy('createdAt', 'desc')
      .limit(limit);
    return screamsRef;
  } else {
    let screamsRef = db
      .collection('screams')
      .orderBy('createdAt', 'desc')
      .startAfter(lastVisible)
      .limit(limit);
    return screamsRef;
  }
}

export function listenToScreamFromFirestore(screamId) {
  return db.collection('screams').doc(screamId);
}

export function addScreamToFirestore(scream, imgUrlList) {
  const user = firebase.auth().currentUser;
  return db.collection('screams').add({
    ...scream,
    createdAt: new Date(),
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    screamImages: [...imgUrlList],
  });
}

export function updateScreamInFirestore(scream, imgUrlList) {
  // console.log(scream);
  scream = { ...scream, screamImages: [...scream.screamImages, ...imgUrlList] };
  return db.collection('screams').doc(scream.id).update(scream);
}

export function deleteScreamInFirestore(screamId) {
  return db.collection('screams').doc(screamId).delete();
}

export async function updateScreamPhoto(
  downloadURL,
  filename,
  screamId,
  screamImages
) {
  try {
    console.log({ screamImages });
    let scream = await (
      await db.collection('screams').doc(screamId).get()
    ).data();
    // console.log({ scream });
    // addScreamToFirestore(scream, downloadURL)
    let screamData = db
      .collection('screams')
      .doc(screamId)
      // .collection('photos')
      .update({
        screamImages:
          scream.screamImages && scream.screamImages.length > 0
            ? [...scream.screamImages, downloadURL]
            : [downloadURL],
        //  screamImages: [...screamImages]
      });
    screamData = await screamData.get().data();
    console.log({ screamData });
    return screamData;
  } catch (error) {
    throw error;
  }
}

export function getScreamPhotos(screamId) {
  return db.collection('screams').doc(screamId).collection('photos');
}

// Like scream
export const likeScreamService = async (scream) => {
  const user = firebase.auth().currentUser;
  console.log({ user });
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', user.uid)
    .where('screamId', '==', scream.id)
    .limit(1);

  const screamDocument = db.doc(`/screams/${scream.id}`);
  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        // screamData.screamId = doc.id;
        screamData.likeCount = screamData.likeCount ? screamData.likeCount : 0;
        console.log('likeDocument', likeDocument.get());
        return likeDocument.get();
      } else {
        return { error: 'Scream not found' };
      }
    })
    .then((data) => {
      console.log({ data });
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screamId: scream.id,
            userHandle: user.uid,
          })
          .then(() => {
            screamData.likeCount++;
            console.log({ screamData });
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            console.log('screamDoc', screamData);
            return screamData;
          });
      } else {
        console.log({ error: 'Scream already liked' });
        return { error: 'Scream already liked' };
      }
    })
    .catch((err) => {
      console.error(err);
      return { error: err.code };
    });
};

// Unlike Scream
export function unLikeScreamService(scream) {
  const user = firebase.auth().currentUser;

  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', user.uid)
    .where('screamId', '==', scream.id)
    .limit(1);

  const screamDocument = db.doc(`/screams/${scream.id}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        // screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return { error: 'Scream not found' };
      }
    })
    .then((data) => {
      if (data.empty) {
        return { error: 'Scream not liked' };
      } else {
        console.log('unlikeData', data);
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            console.log({ screamData });
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            console.log('screamDoc', screamData);
            return screamData;
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return { err };
    });
}

// export function fetchAllLikes () {
//   let likesRef = db
//     .collection('likes')
//     return likesRef
// }
// export async function fetchLikes (screamsIds) {

//   let screamsRef = db.collection('screams').get().then(doc => {
// console.log(doc.docs.map(doc => doc.data()))
//   })
//   let screamsData =  screamsRef.map(scream => scream.docs.map(doc => doc.data()))
//   console.log({screamsRef})
//   console.log({screamsData})
// }

export async function fetchLikes(screamsIds) {
  let likes = [];
  let likesDocs = [];
  // let scream = await (await db.collection('screams').doc(screamsIds[0]).get()).data();
  let likesData = screamsIds.map(async (id) => {
    //  return  (await db.collection('screams').doc(id).get()).data();
    let like = await db.collection('likes').where('screamId', '==', id).get();
    like.docs.map((doc) => likesDocs.push(doc.data()));
    //  console.log("likeDoc",like.docs[0].data())
    //  console.log({like})
    likes.push(like);
    //  const pushLikes =  like => like.docs.map(doc => likesDocs.push(doc.data()) )
  });
  // likes.map(like => like.docs.map(doc =>{ likesDocs.push(doc.data())
  // // console.log("doc.data",doc.data)
  // } ))
  // console.log({likesData})
  // console.log({scream})
  // console.log({likes})
  // console.log("1st like",likes[0].docs[0].data())
  // console.log({likesDocs})
  return likesDocs;
}
