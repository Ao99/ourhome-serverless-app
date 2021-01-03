import { get, post } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/work';

export function getWorksByMonth(month) {
    return get(apiName, `${path}/${month}`);
}

export function updateOneWork(month, day, workType) {
    return post(apiName, `${path}/${month}`, {
            day: day,
            workType: workType
        });
}
