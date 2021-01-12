import { get, post } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/work';

export async function getWorksByMonth(month) {
  try {
    return (await get(apiName, `${path}/${month}`)).Items;
  } catch(err) {
    return [];
  }  
}

export function updateOneWork(month, day, workType) {
  return post(apiName, `${path}/${month}`, {
      day: day,
      workType: workType
    });
}
