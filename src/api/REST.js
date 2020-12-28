import { API } from 'aws-amplify';

export function get(apiName, path) {
  var response = API.get(apiName, path, {})
    .catch(err => {
      console.log(err);
    });

  return response;
}

export function post(apiName, path, body) {
  var response = API.post(apiName, path, { body: body })
    .catch(err => {
      console.log(err);
    });

  return response;
}

export function del(apiName, path, body) {
  var response = API.del(apiName, path, { body: body })
    .catch(err => {
      console.log(err);
    });

  return response;
}