import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Rationale: <valid-url-path-chars> minus <invalid-file-system-chars>
// [1] valid url path chars: https://tools.ietf.org/html/rfc3986
// [2] invalid file system chars: https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
const invalidChars = /[^a-zA-Z0-9\-._~!$&'()+,;=@]/g;

/**
 * A file store to be used with https://npmjs.com/danieldietrich/async-memoize
 *
 * @param dir the cache directory name, default: `path.join(process.cwd(), '.file-store'`. the parent dir must exist.
 * @returns a new file store factory that takes a unique `id` and returns a new file store.
 *          Valid id characters are `a-z A-Z 0-9 - . _ ~ ! $ & ' ( ) + , ; = @`.
 *          Invalid characters will be replaced with dash `-`.
 */
function fileStore(dir: string = path.join(process.cwd(), '.file-store')): fileStore.FileStoreFactory {
    return (id) => {
        // feasible compromise: trading possible exception with possible name collision
        const prefix = id.replace(invalidChars, '-');
        return {
            get: (key) => new Promise((resolve, reject) => {
                const file = path.join(dir, key);
                fs.readFile(file, (err, data) => {
                    (err === null) ? resolve(JSON.parse(data.toString('utf8'))) : reject();
                });
            }),
            set: (key, value) => new Promise((resolve, reject) => {
                ensureExists(dir, (dirErr) => {
                    if (dirErr !== null) {
                        reject(dirErr);
                    } else {
                        const file = path.join(dir, key);
                        const data = Buffer.from(JSON.stringify(value), 'utf8');
                        fs.writeFile(file, data, (fileErr) => {
                            (fileErr === null) ? resolve() : reject(fileErr);
                        });
                    }
                });
            }),
            toKey: (args) => new Promise((resolve) => {
                resolve(prefix + '.' + hash(JSON.stringify(args)));
            }),
        };
    };
}

function ensureExists(dir: string, cb: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(dir, (accessErr) => {
        if (accessErr !== null) {
            fs.mkdir(dir, { recursive: true }, cb);
        } else {
            cb(null);
        }
    });
}

function hash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

// needed to allow importing '.' in unit test
namespace fileStore {

    export type Store<K, V> = {
        get(key: K): Promise<V>;
        set(key: K, value: V): Promise<void>;
        toKey(...args: unknown[]): Promise<K>;
    };

    export type FileStoreFactory = <V>(id: string) => Store<string, V>;
}

export = fileStore;
