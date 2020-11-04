import {
  CREATE_SCREAM,
  UPDATE_SCREAM,
  DELETE_SCREAM,
  FETCH_SCREAMS,
  LISTEN_TO_SCREAM_CHAT,
  LISTEN_TO_SCREAM_PHOTOS,
  CLEAR_COMMENTS,
  LISTEN_TO_SELECTED_SCREAM,
  CLEAR_SCREAMS,
  RETAIN_SCREAM_STATE,
  CLEAR_SELECTED_SCREAM,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  GET_IMG_URL,
  LISTEN_TO_LIKES,
} from './screamConstants';

const initialState = {
  screams: [],
  comments: [],
  photos: [],
  moreScreams: true,
  selectedScream: null,
  lastVisible: null,
  filter: 'all',
  startDate: new Date(),
  retainState: false,
  likes: [],
};

export default function screamReducer(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_SCREAMS:
      return {
        ...state,
        screams: [...state.screams, ...payload.screams],
        moreScreams: payload.moreScreams,
        lastVisible: payload.lastVisible,
      };
    case CREATE_SCREAM:
      return {
        ...state,
        screams: [...state.screams, payload],
      };
    case UPDATE_SCREAM:
      return {
        ...state,
        screams: [
          ...state.screams.filter((evt) => evt.id !== payload.id),
          payload,
        ],
      };
    case DELETE_SCREAM:
      return {
        ...state,
        screams: [...state.screams.filter((evt) => evt.id !== payload)],
      };
    case LISTEN_TO_SCREAM_PHOTOS:
      return {
        ...state,
        photos: payload,
      };
    case LISTEN_TO_SCREAM_CHAT:
      return {
        ...state,
        comments: payload,
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
      };
    case LISTEN_TO_SELECTED_SCREAM:
      return {
        ...state,
        selectedScream: payload,
      };
    case CLEAR_SELECTED_SCREAM:
      return {
        ...state,
        selectedScream: null,
      };
    case CLEAR_SCREAMS:
      return {
        ...state,
        screams: [],
        moreScreams: true,
        lastVisible: null,
      };
    case RETAIN_SCREAM_STATE:
      return {
        ...state,
        retainState: true,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      return {
        ...state,
        screams: [
          ...state.screams.map((scream) => {
            if (scream.id === payload.id) {
              return payload;
            } else {
              return scream;
            }
          }),
        ],
      };
    case LISTEN_TO_LIKES:
      return {
        ...state,
        likes: payload,
      };
    case GET_IMG_URL:
      return {
        ...state,
        imgUrlList: payload,
      };
    default:
      return state;
  }
}
