"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeoutStore {
    constructor() {
        this.store = new Map();
    }
    storeConvoIdAndSession(id, session) {
        const props = { session: session, promptHandler: null, endConvoHandler: null };
        this.store.set(id, props);
    }
    setPromptHandlerFor(id, value) {
        this.store.get(id).promptHandler = value;
    }
    setEndConvoHandlerFor(id, value) {
        this.store.get(id).endConvoHandler = value;
    }
    getPromptHandlerFor(id) {
        return this.store.get(id).promptHandler;
    }
    getEndConvoHandlerFor(id) {
        return this.store.get(id).endConvoHandler;
    }
    getSessionFor(id) {
        return this.store.get(id).session;
    }
    removeConvoFromStore(id) {
        return this.store.delete(id);
    }
}
exports.TimeoutStore = TimeoutStore;
//# sourceMappingURL=storage.js.map