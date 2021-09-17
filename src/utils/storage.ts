import Cookies from 'js-cookie';
import md5 from 'crypto-js/md5';
import config from '../config';

interface IStorageData {
    privateKey: string;
    publicKey: string;
}

function getKey(address: string) {
    return 'RSS3' + md5(address);
}

function set(address: string, value: IStorageData) {
    Cookies.set(getKey(address), window.btoa(JSON.stringify(value)), {
        domain: window.location.hostname,
        secure: true,
        sameSite: 'strict',
        expires: config.storageExpires,
    });
}

export default {
    get: (address: string) => {
        try {
            const data = Cookies.get(getKey(address));
            if (data) {
                const result = <IStorageData>JSON.parse(window.atob(data));
                set(address, result);
                return result;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    },
    set,
    remove: (address: string) => {
        Cookies.remove(getKey(address));
    },
};
