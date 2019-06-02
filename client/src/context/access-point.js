export const publicFetcher = request => {
  return fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      'Content-type': 'application/json'
    }
  });
};

export const authenticationFetcher = (request, token) => {
  return fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};
