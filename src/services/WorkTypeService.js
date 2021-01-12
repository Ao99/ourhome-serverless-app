import { get, post } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/setting/workTypes';

export async function getAllWorkTypes() {
  try {
    return (await get(apiName, path)).Items[0].allUsers;
  } catch(err) {
    return [];
  }
}

export function updateWorkTypes(workTypes) {
  return post(apiName, path, {
      settingValue: workTypes,
      isForAllUsers: true
    });
}
