export const substr = (value = '', limit, ext = '...') => {
  let r = value;
  if (value.length >= limit) {
    r = value.substr(0, limit) + ext;
  }
  return r;
};

export const iff = (condition, then, otherwise) =>
  condition ? then : otherwise;

export const addDataString = (url = '', replace = '', find = '%ID%') =>
  url.replace(find, replace);

export const fetchData = (
  url,
  params = {
    method: 'GET',
    json: false,
    body: {},
    header: {},
    error: e => e
  }
) => {
  const headers = {
    method: params.method,
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  };
  const json = params.json ? params.json : false;
  if (json) {
    headers.headers['Content-Type'] = 'application/json';
  }
  if (params.body && params.method.toUpperCase() !== 'GET') {
    headers.body = params.body;
  }
  if (params.header) {
    headers.headers = Object.assign(headers.headers, params.header);
  }
  return fetch(url, headers)
    .then(response => {
      if (response.ok) {
        return json ? response.json() : response;
      }
      throw Error(response.statusText);
    })
    .then(response => response)
    .catch(e => {
      console.log(`ERROR FECTH ${e}`);
      return params.error;
    });
};
