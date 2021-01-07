import { get } from '../utils/REST.js';

const apiName = 'ourhomeApi';
const path = '/env';

export function getEnv() {
    return get(apiName, path);
}
