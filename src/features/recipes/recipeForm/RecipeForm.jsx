import React, { useEffect } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import {
  listenToSelectedRecipe,
  clearSelectedRecipe,
  updateRecipe,
  clearRecipes,
} from '../recipeActions';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { recipeCategories } from '../../../app/api/recipeCategories';
import {
  listenToRecipeFromFirestore,
  updateRecipeInFirestore,
  addRecipeToFirestore,
} from '../../../app/firestore/firestoreServices/firestoreRecipesHandler';
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default function RecipeForm({ match, history, location }) {
  const dispatch = useDispatch();
  const { selectedRecipe } = useSelector((state) => state.recipe);
  const { loading, error } = useSelector((state) => state.async);

  useEffect(() => {
    if (location.pathname !== '/createRecipe') return;
    dispatch(clearSelectedRecipe());
  }, [dispatch, location.pathname]);

  const initialValues = selectedRecipe ?? {
    title: '',
    category: '',
    steps: '',
    ingredients: '',
    prepTime: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('You must provide a title'),
    category: Yup.string().required('You must provide a category'),
    steps: Yup.string().required(),
  });

  useFirestoreDoc({
    shouldExecute:
      match.params.id !== selectedRecipe?.id &&
      location.pathname !== '/createRecipe',
    query: () => listenToRecipeFromFirestore(match.params.id),
    data: (recipe) => dispatch(listenToSelectedRecipe(recipe)),
    deps: [match.params.id, dispatch],
  });

  if (loading) return <LoadingComponent content='Loading recipe...' />;

  if (error) return <Redirect to='/error' />;

  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            selectedRecipe
              ? await updateRecipeInFirestore(values)
              : await addRecipeToFirestore(values);
            setSubmitting(false);
            dispatch(clearRecipes());
            history.push('/recipes');
          } catch (error) {
            toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid, values }) => (
          <Form className='ui form'>
            <Header sub color='teal' content='Recipe Details' />
            <MyTextInput name='title' placeholder='Recipe title' />
            <MySelectInput
              name='category'
              placeholder='Recipe category'
              options={recipeCategories}
            />
            <MyTextInput name='prepTime' placeholder='Prep Time' />
            <MyTextArea name='ingredients' placeholder='Ingredients' rows={3} />
            <MyTextArea name='steps' placeholder='Instructions' rows={3} />

            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              floated='right'
              positive
              content='Submit'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}
