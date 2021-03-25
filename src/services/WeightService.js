import { get } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/setting/weights';

export function getWeights() {
  return get(apiName, path)
    .then(res => {
      try {
        return res.Items[0].allUsers;
      } catch(err) {
        return {};
      }
    });
}
