import React, { useState, useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import ScreamList from './ScreamList';
import { useSelector, useDispatch } from 'react-redux';
import ScreamListItemPlaceholder from './ScreamListItemPlaceholder';
import { fetchScreams } from '../screamActions';
import { RETAIN_SCREAM_STATE } from '../screamConstants';
import CreateScream from './CreateScream';
import { useMediaQuery } from 'react-responsive';

export default function ScreamDashboard() {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const limit = 2;
  const dispatch = useDispatch();
  const { screams, moreScreams, lastVisible, retainState } = useSelector(
    (state) => state.scream
  );
  const { loading } = useSelector((state) => state.async);
  const [loadingInitial, setLoadingInitial] = useState(false);

  useEffect(() => {
    // console.log('ScreamDashboard', screams);
    if (retainState) return;
    setLoadingInitial(true);
    dispatch(fetchScreams(limit, lastVisible)).then(() => {
      setLoadingInitial(false);
    });
    return () => {
      dispatch({ type: RETAIN_SCREAM_STATE });
    };
  }, [dispatch, retainState, lastVisible, screams]);

  function handleFetchNextScreams() {
    dispatch(fetchScreams(limit, lastVisible));
  }

  return (
    <>
      <CreateScream />
      <Grid>
        {isPortrait ? null : <Grid.Column width={6}></Grid.Column>}

        <Grid.Column width={isPortrait ? 16 : 10}>
          {loadingInitial && (
            <>
              <ScreamListItemPlaceholder />
              <ScreamListItemPlaceholder />
            </>
          )}
          {!loadingInitial && (
            <ScreamList
              screams={screams}
              getNextScreams={handleFetchNextScreams}
              loading={loading}
              moreScreams={moreScreams}
            />
          )}
        </Grid.Column>
        {isPortrait ? null : <Grid.Column width={6}></Grid.Column>}
        <Grid.Column width={isPortrait ? 16 : 10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    </>
  );
}
