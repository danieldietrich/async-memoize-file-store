import * as fileStore from '.';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { promisify } from 'util';

const tmp = path.join(__dirname, '.file-store');
const access = promisify(fs.access);
const exists = (target: string) => access(target).then(() => true).catch(() => false); // fs.exists has been deprecated
const rmdir = promisify(rimraf);

afterEach(() => clear());

describe('fileStore creation', () => {

    test('Should create fileStore', async () => {
        const factory = fileStore();
        const store = factory('test');
        expect(store).toBeDefined();
        await rmdir(tmp);
    });

    test('Should re-create fileStore on set if not present', async () => {
        const store = fileStore()('test');
        await store.set('key', 'val1');
        expect(await store.get('key')).toBe('val1');
        await rmdir(tmp);
        await expect(store.get('key')).rejects.toBe(undefined);
        await store.set('key', 'val2');
        expect(await store.get('key')).toBe('val2');
    });

    test('Should not create fileStore with invalid dir name', async () => {
        const store = fileStore('/?')('test');
        await expect(store.set('key', 'val')).rejects.toThrow();
    });

    test('Should not write cache when having insufficient permissions', async () => {
        const store = fileStore('/')('?');
        await expect(store.set('key', 'val')).rejects.toThrow();
    });

    /* TODO: fs.mkdir(path, { recursive: true }) should work with node 10.15.1+ but it doesn't
    test('Should recursively create directories', async () => {
        const deepDir = path.join(tmp, 'subdir1', 'subdir2', 'subdir3');
        const store = fileStore(deepDir)('test');
        await rmdir(tmp); // rm -fr base dir of file store, incl all sub dirs
        await store.set('key', 'val'); // should recursively re-create subdirs
        expect(await store.get('key')).toBe('val');
    });
    */
});

describe('fileStore.toKey', () => {

    test('Should serialize empty argument list', async () => {
        const store = await cache();
        const args: [] = [];
        expect(await store.toKey(args)).toBe('test.4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945');
    });

    test('Should serialize non-empty argument list', async () => {
        const store = await cache();
        const args = ['Hi', true];
        expect(await store.toKey(args)).toBe('test.326cc56343929403a6a5028a580ed94fdda9cd4039a645eca7beb7933b0bb49d');
    });

    test('Should generate different keys from different arguments', async () => {
        const store = await cache();
        expect(await store.toKey(['a'])).not.toBe(await store.toKey(['b']));
    });
});

describe('fileStore.set', () => {

    test('Should receive value when storing value', async () => {
        const store = await cache();
        await expect(store.set('key', 'value')).resolves.toBe(undefined);
    });

    test('Should store (key, value) two times', async () => {
        const store = await cache();
        const key = 'key';
        const value = 'value';
        expect(await store.set(key, value)).toBe(await store.set(key, value));
    });

    test('Should store two different values', async () => {
        const store = await cache();
        await store.set('a', 1);
        await store.set('b', 2);
        expect(await store.get('a')).toBe(1);
        expect(await store.get('b')).toBe(2);
    });
});

describe('fileStore.get', () => {

    test('Should get existing value', async () => {
        const store = await cache();
        const key = 'key';
        const value = 'value';
        await store.set(key, value);
        expect(await store.get(key)).toBe(value);
    });

    test('Should error when getting non-existing value', async () => {
        const store = await cache();
        try {
            const value = await store.get('key');
            throw Error('Did not expect a value: ' + value);
        } catch (err) {
            // ok!
        }
    });
});

async function cache() {
    return fileStore(tmp)('test');
}

async function clear() {
    if (await exists(tmp)) {
        await rmdir(tmp);
    }
}
