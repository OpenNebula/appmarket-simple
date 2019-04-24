export function addImages(images) {
  return {
    type: 'ADD_IMAGES',
    payload: {
      images
    }
  };
}
export function selectImage(image) {
  return {
    type: 'SELECT_IMAGE',
    payload: {
      image
    }
  };
}
export function selectTags(selectedTags) {
  return {
    type: 'SELECT_TAGS',
    payload: {
      selectedTags
    }
  };
}

export function displayFilters(display) {
  return {
    type: 'DISPLAY_FILTERS',
    payload: {
      displayFilters: display
    }
  };
}

export function filterTitle(title) {
  return {
    type: 'FILTER_TITLE',
    payload: {
      title
    }
  };
}

export function addTags(tags) {
  return {
    type: 'ADD_TAGS',
    payload: {
      tags
    }
  };
}
