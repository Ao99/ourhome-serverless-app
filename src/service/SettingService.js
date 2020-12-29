import { get, post } from '../api/REST.js';

const apiName = 'ourhomeApi';
const path = '/setting';

export function getSettingsByType(type) {
    return get(apiName, `${path}/${type}`);
}

export function updateOneSetting(type, settingValue, isForAllUsers) {
    return post(apiName, `${path}/${type}`, {
            settingValue: settingValue,
            isForAllUsers: isForAllUsers
        });
}
