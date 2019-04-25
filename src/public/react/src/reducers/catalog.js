const initialState = {
  images: [],
  image: null,
  tags: [],
  selectedTags: [],
  title: '',
  displayFilters: false,
  hypervisors: [],
  selectedHypervisors: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_IMAGES': {
      return {
        ...state,
        images: action.payload.images
      };
    }
    case 'ADD_HYPERVISORS': {
      return {
        ...state,
        hypervisors: action.payload.hypervisors
      };
    }
    case 'SELECT_HYPERVISORS': {
      return {
        ...state,
        selectedHypervisors: action.payload.selectedHypervisors
      };
    }
    case 'SELECT_TAGS': {
      return {
        ...state,
        selectedTags: action.payload.selectedTags
      };
    }
    case 'DISPLAY_FILTERS': {
      return {
        ...state,
        displayFilters: action.payload.displayFilters
      };
    }
    case 'FILTER_TITLE': {
      return {
        ...state,
        title: action.payload.title
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
