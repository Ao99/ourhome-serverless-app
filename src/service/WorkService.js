import { get, post, del } from '../api/REST.js';

const apiName = 'ourhomeApi';
const path = '/work';

export function getAllWorks() {
    return get(apiName, `${path}/all`);
}

export function getWorksByDate(month) {
    return get(apiName, `${path}/${month}`);
}

export function updateOneWork(month, day, workType) {
    return post(apiName, `${path}/${month}`, {
            day: day,
            workType: workType
        });
}

export function deleteOneWork(month, day, workType) {
    return del(apiName, `${path}/${month}`, {
            day: day,
            workType: workType
        });
}
