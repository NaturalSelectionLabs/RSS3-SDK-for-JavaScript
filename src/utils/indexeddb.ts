export default {
    get: (address: string) => {
        return new Promise((resolve, reject) => {
            const dbRequest = window.indexedDB.open('RSS3');
            dbRequest.onupgradeneeded = () => {
                const objectStore = dbRequest.result.createObjectStore('RSS3', {
                    keyPath: 'address',
                });
                objectStore.createIndex('privateKey', 'privateKey', {
                    unique: true,
                });
                objectStore.createIndex('publicKey', 'publicKey', {
                    unique: true,
                });
            };
            dbRequest.onsuccess = () => {
                const db = dbRequest.result;

                if (!db.objectStoreNames.contains('RSS3')) {
                    reject();
                } else {
                    const transaction = db.transaction(['RSS3']);
                    const objectStore = transaction.objectStore('RSS3');
                    const request = objectStore.get(address);

                    request.onerror = () => {
                        reject();
                    };

                    request.onsuccess = () => {
                        if (request.result) {
                            resolve(request.result);
                        } else {
                            reject();
                        }
                    };
                }
            };
            dbRequest.onerror = () => {
                reject();
            };
        });
    },
    set: (address: string, value: Object) => {
        const dbRequest = window.indexedDB.open('RSS3');
        dbRequest.onupgradeneeded = () => {
            const objectStore = dbRequest.result.createObjectStore('RSS3', {
                keyPath: 'address',
            });
            objectStore.createIndex('privateKey', 'privateKey', {
                unique: true,
            });
            objectStore.createIndex('publicKey', 'publicKey', {
                unique: true,
            });
        };
        dbRequest.onsuccess = () => {
            const db = dbRequest.result;

            db.transaction(['RSS3'], 'readwrite').objectStore('RSS3').put(
                Object.assign(
                    {
                        address,
                    },
                    value,
                ),
            );
        };
    },
};
