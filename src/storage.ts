import * as builder from "botbuilder";

export interface TimeoutProps {
    session: builder.Session;
    promptHandler: any;
    endConvoHandler: any;
}

export class TimeoutStore {
    private store = new Map<string, TimeoutProps>();

    public storeConvoIdAndSession(id: string, session: builder.Session) {
        const props = { session: session, promptHandler: null, endConvoHandler: null } as TimeoutProps;
        this.store.set(id, props);
    }

    public setPromptHandlerFor(id: string, value: any): void {
        this.store.get(id).promptHandler = value;
    }

    public setEndConvoHandlerFor(id: string, value: any): void {
        this.store.get(id).endConvoHandler = value;
    }

    public getPromptHandlerFor(id: string): any {
        return this.store.get(id).promptHandler;
    }

    public getEndConvoHandlerFor(id: string): any {
        return this.store.get(id).endConvoHandler;
    }

    public getSessionFor(id: string): builder.Session {
        return this.store.get(id).session;
    }

    public removeConvoFromStore(id: string): boolean {
        return this.store.delete(id);
    }
}
