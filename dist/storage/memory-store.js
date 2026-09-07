/** In-memory AffixDocumentStore for tests and single-process hosts. */
export class MemoryDocumentStore {
    data = new Map();
    get(key) {
        return this.data.has(key) ? this.data.get(key) : null;
    }
    set(key, value) {
        this.data.set(key, value);
    }
    delete(key) {
        this.data.delete(key);
    }
    clear() {
        this.data.clear();
    }
    keys() {
        return [...this.data.keys()];
    }
}
export function createMemoryDocumentStore() {
    return new MemoryDocumentStore();
}
