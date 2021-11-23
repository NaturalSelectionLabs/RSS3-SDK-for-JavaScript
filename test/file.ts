import axios from 'axios';
import RSS3 from '../src/index';
import MockAdapter from 'axios-mock-adapter';
import config from '../src/config';
import id from '../src/utils/id';

const now = new Date().toISOString();
const mock = new MockAdapter(axios);

afterEach(() => {
    mock.reset();
});

const dateMatcher = expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

it('File.new', () => {
    const rss3 = new RSS3({
        endpoint: '',
    });
    rss3.files.clearCache('', true);

    const newFile = rss3.files.new(rss3.account.address);
    expect(newFile.id).toBe(rss3.account.address);
    expect(newFile.version).toBe(config.version);
    expect(newFile.date_created).toEqual(dateMatcher);
    expect(newFile.date_created).toEqual(dateMatcher);
});

it('File.get and File.clearCache', async () => {
    const rss3 = new RSS3({
        endpoint: 'test',
    });
    const testFile = {
        id: rss3.account.address,
        version: config.version,
        date_created: now,
        date_updated: now,
        signature: '',
    };

    mock.onGet(`test/${rss3.account.address}`).replyOnce(200, testFile);

    // Automatically generated file
    const file = await rss3.files.get();
    expect(file.id).toBe(rss3.account.address);
    expect(file.version).toBe(config.version);
    expect(file.date_created).toEqual(dateMatcher);
    expect(file.date_created).toEqual(dateMatcher);
    expect(mock.history.get.length).toBe(0);

    // Files obtained from the endpoint
    rss3.files.clearCache('', true);
    expect(await rss3.files.get()).toEqual(testFile);
    expect(mock.history.get.length).toBe(1);

    // Files obtained from the cache
    expect(await rss3.files.get()).toEqual(testFile);
    expect(mock.history.get.length).toBe(1);
});

it('File.get - Incorrectly formatted content error', async () => {
    const rss3 = new RSS3({
        endpoint: 'test',
    });
    rss3.files.clearCache('', true);

    mock.onGet(`test/${rss3.account.address}`).replyOnce(200, {
        id: rss3.account.address,
        version: config.version,
        date_created: now,
        date_updated: now,
    });

    try {
        await rss3.files.get();
    } catch (e) {
        expect(e).toBe('Incorrectly formatted content.');
    }
    expect.assertions(1);
});

it('File.get - Not found error', async () => {
    const rss3 = new RSS3({
        endpoint: 'test',
    });
    rss3.files.clearCache('', true);

    mock.onGet(`test/${rss3.account.address}`).replyOnce(400, {
        code: 5001,
        message: 'Persona not found error, Bad Request',
    });

    const file = await rss3.files.get();
    expect(file.id).toBe(rss3.account.address);
    expect(file.version).toBe(config.version);
    expect(file.date_created).toEqual(dateMatcher);
    expect(file.date_created).toEqual(dateMatcher);
});

it('File.getAll', async () => {
    const rss3 = new RSS3({
        endpoint: 'test',
    });
    rss3.files.clearCache('', true);

    mock.onGet(`test/${id.getItems(rss3.account.address, 1)}`).replyOnce(200, {
        id: id.getItems(rss3.account.address, 1),
        version: config.version,
        date_created: now,
        date_updated: now,
        signature: '',

        list: ['1', '2'],
        list_next: id.getItems(rss3.account.address, 0),
    });
    mock.onGet(`test/${id.getItems(rss3.account.address, 0)}`).replyOnce(200, {
        id: id.getItems(rss3.account.address, 0),
        version: config.version,
        date_created: now,
        date_updated: now,
        signature: '',

        list: ['3'],
    });

    expect(await rss3.files.getAll(id.getItems(rss3.account.address, 1))).toEqual(['1', '2', '3']);
});

it('File.set', async () => {
    const rss3 = new RSS3({
        endpoint: '',
    });
    rss3.files.clearCache('', true);

    const testID = '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';
    const testFile: any = {
        id: testID,
        version: config.version,
        date_created: now,
        date_updated: '',
        signature: '',
    };
    rss3.files.set(testFile);

    const file = await rss3.files.get(testID);
    expect(file.id).toBe(testID);
    expect(file.version).toBe(config.version);
    expect(file.date_created).toEqual(dateMatcher);
    expect(file.date_created).toEqual(dateMatcher);

    // File size is too large error
    rss3.files.clearCache('', true);
    testFile.controller = 'r'.repeat(config.fileSizeLimit);

    try {
        rss3.files.set(testFile);
    } catch (e) {
        expect(e.message).toBe('File size is too large.');
    }
    expect.assertions(5);
});

it('File.sync', async () => {
    const rss3 = new RSS3({
        endpoint: 'test',
    });

    mock.onPut('test').replyOnce(200, {
        id: id.getItems(rss3.account.address, 0),
        version: config.version,
        date_created: now,
        date_updated: now,
        signature: '',

        list: ['3'],
    });

    const testID = '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';
    const testFile: any = {
        id: testID,
        version: config.version,
        date_created: now,
        date_updated: '',
        signature: '',
    };
    rss3.files.set(testFile);

    const testID2 = '0x8768515270aA67C624d3EA3B98CA464672C50183';
    const testFile2: any = {
        id: testID2,
        version: config.version,
        date_created: now,
        date_updated: '',
        signature: '',
    };
    rss3.files.set(testFile2);

    rss3.files.clearCache(testID);

    await rss3.files.sync();

    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data).contents).toEqual(
        expect.arrayContaining([
            {
                id: rss3.account.address,
                date_created: dateMatcher,
                date_updated: dateMatcher,
                signature: expect.any(String),
                version: config.version,
            },
            {
                id: testID2,
                date_created: dateMatcher,
                date_updated: dateMatcher,
                signature: expect.any(String),
                version: config.version,
            },
        ]),
    );
});
