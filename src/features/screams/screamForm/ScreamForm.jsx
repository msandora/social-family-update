import React, { useState } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listenToSelectedScream, clearSelectedScream } from '../screamActions';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import { Link } from 'react-router-dom';
import {
  listenToScreamFromFirestore,
  updateScreamInFirestore,
  addScreamToFirestore,
} from '../../../app/firestore/firestoreServices/firestoreScreamsHandler';
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import ScreamImageUpload from './ScreamImageUpload';
import MyPopup from '../../../utils/MyPopup'

// graphql stuff 
import { useMutation, useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  FETCH_POST_QUERY,
  FETCH_POSTS_QUERY,
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION } from '../../../utils/graqphql'
import firebase from '../../../app/config/firebase';
const user = firebase.auth().currentUser;


const defaultImg = "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"

export default function ScreamForm({ match, history, location }) {
  
  const dispatch = useDispatch();
  const { selectedScream, imgUrlList } = useSelector((state) => state.scream);
  console.log({imgUrlList})
  const { loading, error } = useSelector((state) => state.async);

  const user = firebase.auth().currentUser;
  console.log({user})
  const [createPost,] = useMutation(CREATE_POST_MUTATION);
  const [updatePost,] = useMutation(UPDATE_POST_MUTATION);

  // console.log({selectedScream})
  // console.log({imgUrlList})
  useEffect(() => {
    if (location.pathname !== '/createScream') return;
    dispatch(clearSelectedScream());
  }, [dispatch, location.pathname]);

  const initialValues = selectedScream ?? {
  // const initialValues = valuesState ?? {
    title: '',
    description: '',
    photos: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('You must provide a title'),
    description: Yup.string().required(),
    photos: Yup.array().of(
      Yup.string().required('You must provide a image')
    ),
  });


  if (loading) return <LoadingComponent content='Loading scream...' />;

  if (error) return <Redirect to='/error' />;
  // console.log(selectedScream.id);
  const deleteImg = (imgIndex, images) => {
    return images.splice(imgIndex, 1);
    // imgUrlList.splice(imgIndex, 1)
    console.log('screamImages', imgUrlList);
  };

  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("values",values && values);
          try {
            // !match.params.id
             await createPost(
              { variables: {
              ...values,
              photos:[...imgUrlList] ,hostUid: user?.uid,
                  hostedBy: user?.displayName,
                  hostPhotoURL: user?.photoURL || defaultImg,
              },
            })
            setSubmitting(false);
            window.location.href = 'http://localhost:3000/screams';
          } catch (error) {
            toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid, values }) => (
          <>
            <ScreamImageUpload
              screamId={selectedScream?.id}
              newScream={selectedScream ? false : true}
              dispatch={dispatch}
            />
            {/* image List  */}
            {imgUrlList &&
              imgUrlList.length > 0 &&
              imgUrlList.map((img, index) => (
                // <Link onClick={() => deleteImg(img, imgUrlList, index)}>
                <MyPopup content={'Delete'}>
                  <img
                    src={img}
                    alt='img'
                    style={{
                      minWidth: '6rem',
                      minHeight: '6rem',
                      margin: 5,
                      border: '1px solid lightgrey',
                    }}
                  />
                  <Button
                  disabled={loading}
                  onClick={deleteImg(img, imgUrlList, index)}
                  style={{ width: 20 }}
                  icon='close'
                />
             </MyPopup >
              ))}

            <Form className='ui form'>
              <Header sub color='teal' content='Post Details' />
              <MyTextInput name='title' placeholder='Post title' />
              <MyTextArea
                name='description'
                placeholder='Description'
                rows={3}
              />
              <Button
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                type='submit'
                floated='right'
                positive
                content='Submit'
              />
            </Form>
          </>
        )}
      </Formik>
    </Segment>
  );
}
