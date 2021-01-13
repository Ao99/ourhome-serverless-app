import { get, post } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/setting/colors';

export function getAllColors() {
  return get(apiName, path)
    .then(res => {
      try {
        return res.Items[0];
      } catch(err) {
        return [];
      }
    });
}

export function updateOneColor(color) {
  return post(apiName, path, {
      settingValue: color,
      isForAllUsers: false
    });
}
