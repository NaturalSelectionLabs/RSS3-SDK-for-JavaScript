import Cookies from 'js-cookie';

const prefix = 'RSS3';

interface IStorageData {
    privateKey: string;
    publicKey: string;
}

export default {
    get: (address: string) => {
        const data = Cookies.get(prefix + address);
        return data ? <IStorageData>JSON.parse(data) : null;
    },
    set: (address: string, value: IStorageData) => {
        Cookies.set(prefix + address, JSON.stringify(value), {
            domain: window.location.hostname,
            secure: true,
            sameSite: 'strict',
        });
    },
    remove: (address: string) => {
        Cookies.remove(prefix + address);
    },
};
