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
export function changePage(page) {
  return {
    type: 'CHANGE_PAGE',
    payload: {
      page
    }
  };
}
export function changePaginate(paginate) {
  return {
    type: 'CHANGE_PAGINATE',
    payload: {
      paginate
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
