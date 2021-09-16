import Cookies from 'js-cookie';
import md5 from 'crypto-js/md5';

interface IStorageData {
    privateKey: string;
    publicKey: string;
}

function getKey(address: string) {
    return 'RSS3' + md5(address);
}

export default {
    get: (address: string) => {
        try {
            const data = Cookies.get(getKey(address));
            return data ? <IStorageData>JSON.parse(window.atob(data)) : null;
        } catch (e) {
            return null;
        }
    },
    set: (address: string, value: IStorageData) => {
        Cookies.set(getKey(address), window.btoa(JSON.stringify(value)), {
            domain: window.location.hostname,
            secure: true,
            sameSite: 'strict',
        });
    },
    remove: (address: string) => {
        Cookies.remove(getKey(address));
    },
};
