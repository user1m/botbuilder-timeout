import * as builder from "botbuilder";
export interface TimeoutProps {
    session: builder.Session;
    promptHandler: any;
    endConvoHandler: any;
}
export declare class TimeoutStore {
    private store;
    storeConvoIdAndSession(id: string, session: builder.Session): void;
    setPromptHandlerFor(id: string, value: any): void;
    setEndConvoHandlerFor(id: string, value: any): void;
    getPromptHandlerFor(id: string): any;
    getEndConvoHandlerFor(id: string): any;
    getSessionFor(id: string): builder.Session;
    removeConvoFromStore(id: string): boolean;
}
