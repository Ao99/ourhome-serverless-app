import { get, post } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/setting/workTypes';

export function getAllWorkTypes() {
  return get(apiName, path)
    .then(res => {
      try {
        return res.Items[0].allUsers;
      } catch(err) {
        return [];
      }
    });
}

export function updateWorkTypes(workTypes) {
  return post(apiName, path, {
      settingValue: workTypes,
      isForAllUsers: true
    });
}
