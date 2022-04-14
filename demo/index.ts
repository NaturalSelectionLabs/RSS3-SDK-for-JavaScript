import RSS3 from '../src/index';
(<any>window).RSS3 = RSS3;

console.log(RSS3);
(<any>window).rss3 = new RSS3({
    endpoint: 'http://test-pregod.rss3.dev/v0.4.0/',
    appName: 'Demo',
});
