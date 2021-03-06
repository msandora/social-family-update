import React, { useState, useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useSelector, useDispatch } from 'react-redux';
import RecipeListItemPlaceholder from './RecipeListItemPlaceholder';
import RecipeFilters from './RecipeFilters';
import { fetchRecipes } from '../recipeActions';
import { RETAIN_RECIPE_STATE } from '../recipeConstants';
import CreateRecipe from './CreateRecipe';
import { useMediaQuery } from 'react-responsive';

export default function RecipeDashboard() {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const limit = 2;
  const dispatch = useDispatch();
  const {
    recipes,
    moreRecipes,
    filter,
    startDate,
    lastVisible,
    retainState,
  } = useSelector((state) => state.recipe);
  const { loading } = useSelector((state) => state.async);
  // const { authenticated } = useSelector((state) => state.auth);
  const [loadingInitial, setLoadingInitial] = useState(false);

  useEffect(() => {
    // console.log('RecipeDashboard', retainState);
    if (retainState) return;
    setLoadingInitial(true);
    dispatch(fetchRecipes(filter, startDate, limit)).then(() => {
      setLoadingInitial(false);
    });
    return () => {
      dispatch({ type: RETAIN_RECIPE_STATE });
    };
  }, [dispatch, filter, startDate, retainState]);

  function handleFetchNextRecipes() {
    dispatch(fetchRecipes(filter, startDate, limit, lastVisible));
  }

  return (
    <>
      <CreateRecipe />
      <Grid>
        <Grid.Column width={isPortrait ? 16 : 6}>
          <RecipeFilters loading={loading} />
        </Grid.Column>
        <Grid.Column width={isPortrait ? 16 : 10}>
          {loadingInitial && (
            <>
              <RecipeListItemPlaceholder />
              <RecipeListItemPlaceholder />
            </>
          )}
          {!loadingInitial && (
            <RecipeList
              recipes={recipes}
              getNextRecipes={handleFetchNextRecipes}
              loading={loading}
              moreRecipes={moreRecipes}
            />
          )}
        </Grid.Column>
        <Grid.Column width={isPortrait ? 16 : 10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    </>
  );
}
