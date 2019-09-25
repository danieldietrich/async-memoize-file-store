import * as fileStore from '.';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { promisify } from 'util';

const access = promisify(fs.access);
const exists = (target: string) => access(target).then(() => true).catch(() => false); // fs.exists has been deprecated
const rmdir = promisify(rimraf);

afterEach(() => clear());

describe('fileStore creation', () => {

    test('Should create fileStore', async () => {
        expect(await fileStore()('test')).toBeDefined();
        await rmdir('.file-store');
    });

    test('Should re-create fileStore on set if not present', async () => {
        const store = await fileStore()('test');
        await store.set('a', 'b');
        expect(await store.get('a')).toBe('b');
        await rmdir('.file-store');
        await expect(store.get('a')).rejects.toBe(undefined);
        await store.set('a', 'c');
        expect(await store.get('a')).toBe('c');
        await rmdir('.file-store');
    });
});

describe('fileStore.toKey', () => {

    test('Should serialize empty argument list', async () => {
        const store = await cache();
        const args: [] = [];
        expect(await store.toKey(args)).toBe('test.T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=');
    });

    test('Should serialize non-empty argument list', async () => {
        const store = await cache();
        const args = ['Hi', true];
        expect(await store.toKey(args)).toBe('test.MmzFY0OSlAOmpQKKWA7ZT92pzUA5pkXsp763kzsLtJ0=');
    });
});

describe('fileStore.set', () => {

    test('Should receive value when storing value', async () => {
        const store = await cache();
        const key = await store.toKey(['Hi', true]);
        const value = 'test';
        expect(await store.set(key, value)).toBe(value);
    });

    test('Should store value two times', async () => {
        const store = await cache();
        const key = await store.toKey(['Hi', true]);
        const value = 'test';
        expect(await store.set(key, value)).toBe(await store.set(key, value));
    });
});

describe('fileStore.get', () => {

    test('Should get existing value', async () => {
        const store = await cache();
        const key = await store.toKey(['Hi', true]);
        const value = 'test';
        await store.set(key, value);
        expect(await store.get(key)).toBe(value);
    });

    test('Should error when getting non-existing value', async () => {
        const store = await cache();
        const key = await store.toKey(['Hi', true]);
        try {
            const value = await store.get(key);
            throw Error('Did not expect a value: ' + value);
        } catch (err) {
            // ok!
        }
    });
});

async function clear() {
    const tmp = path.join(__dirname, '.file-store');
    if (await exists(tmp)) {
        await rmdir(tmp);
    }
}

async function cache(): Promise<Store<string, unknown>> {
    const tmp = path.join(__dirname, '.file-store');
    if (await exists(tmp)) {
        await rmdir(tmp);
    }
    return fileStore(tmp)('test');
}

type Store<K, V> = {
    get(key: K): Promise<V>;
    set(key: K, value: V): Promise<V>;
    toKey(...args: unknown[]): Promise<K>;
};
