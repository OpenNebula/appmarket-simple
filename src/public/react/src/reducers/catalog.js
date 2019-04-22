import { DEFAULT_LIMIT_PAGINATE } from '../constants/literals';

const initialState = {
  images: [],
  image: null,
  tags: [],
  page: 0,
  paginate: DEFAULT_LIMIT_PAGINATE
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_IMAGES': {
      return {
        ...state,
        images: action.payload.images
      };
    }
    case 'ADD_TAGS': {
      return {
        ...state,
        tags: action.payload.tags
      };
    }
    case 'SELECT_IMAGE': {
      return {
        ...state,
        image: action.payload.image
      };
    }
    case 'CHANGE_PAGE': {
      return {
        ...state,
        page: action.payload.page
      };
    }
    case 'CHANGE_PAGINATE': {
      return {
        ...state,
        paginate: action.payload.paginate
      };
    }
    default:
      return state;
  }
};
