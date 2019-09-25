import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * A file store to be used with https://npmjs.com/danieldietrich/async-memoize
 *
 * @param dir the cache directory name, default: `path.join(process.cwd(), '.file-store'`. the parent dir must exist.
 * @returns a new file store factory that takes a unique id and returns a file store.
 */
function fileStore(dir: string = path.join(process.cwd(), '.file-store')): fileStore.FileStoreFactory {
    return (id) => {
        return {
            get: (key) => new Promise((resolve, reject) => {
                const file = path.join(dir, key);
                fs.readFile(file, (err, data) => {
                    (err !== null) ? reject() : resolve(JSON.parse(data.toString('utf8')));
                });
            }),
            set: (key, value) => new Promise((resolve) => {
                ensureExists(dir); // re-creates dir if not exists
                const file = path.join(dir, key);
                const data = Buffer.from(JSON.stringify(value), 'utf8');
                fs.writeFile(file, data, () => resolve(value));
            }),
            toKey: (args) => Promise.resolve(id + '.' + hash(JSON.stringify(args))),
        };
    };
}

function ensureExists(dir: string) {
    console.log(dir);
    try { fs.accessSync(dir); } catch (err) { fs.mkdirSync(dir); }
}

function hash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('base64'); // .substr(0, 13);
}

// assumed to be present at runtime by importing 'async-memoize'
declare namespace memoize {
    type Store<K, V> = {
        get(key: K): Promise<V>;
        set(key: K, value: V): Promise<V>;
        toKey(...args: unknown[]): Promise<K>;
    };
}

// needed to allow importing '.' in unit test
namespace fileStore {
    export type FileStoreFactory = <V>(id: string) => memoize.Store<string, V>;
}

export = fileStore;
