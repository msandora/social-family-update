import React from 'react';
// import { Link } from 'react-router-dom';
import {
  Segment,
  //Button
} from 'semantic-ui-react';
import ScreamCarousel from './../screamComponents/ScreamCarousel';
import LikeScream from './../screamComponents/LikeScream';
import MyButton from '../../../app/common/MyButton';
import { deleteScreamInFirestore } from '../../../app/firestore/firestoreServices/firestoreScreamsHandler';

export default function ScreamDetailedInfo({ scream, isHost }) {
  return (
    <>
      <Segment style={{ padding: 0 }}>
        <ScreamCarousel scream={scream} />
      </Segment>
      <Segment>
        <p>{scream.description}</p>
      </Segment>
      <Segment attached='bottom' clearing>
        <LikeScream />
        {isHost && (
          <>
            <MyButton
              onClick={() => deleteScreamInFirestore(scream.id)}
              // content='Delete'
              tip='Delete Post'
              color='red'
              icon='trash'
            />
            <MyButton
              onClick={() => console.log('fix this', scream.id)}
              tip='Manage Post'
              color='orange'
              icon='edit'
              linkRef={`/manageScream/${scream.id}`}
            />
          </>
        )}
      </Segment>
    </>
  );
}
