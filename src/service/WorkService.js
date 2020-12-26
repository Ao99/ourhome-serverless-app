import { get, post, del } from '../api/REST.js';

const apiName = 'ourhomeApi';
const path = '/work';

export function getAllWorks() {
    return get(apiName, `${path}/all`);
}

export function getWorksByDate(date) {
    return get(apiName, `${path}/${date}`);
}

export function updateOneWork(date, workType) {
    return post(apiName, `${path}/${date}`, { workType: workType });
}

export function deleteOneWork(date, workType) {
    return del(apiName, `${path}/${date}`, { workType: workType });
}
