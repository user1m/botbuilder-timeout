import * as builder from "botbuilder";
export interface TimeoutOptions {
    PROMPT_IF_USER_IS_ACTIVE_MSG?: string;
    PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT?: string;
    PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS?: number;
    END_CONVERSATION_MSG?: string;
    END_CONVERSATION_TIMEOUT_IN_MS?: number;
}
export declare class Timeout {
    private bot;
    private timeoutStore;
    private options;
    constructor(bot: builder.UniversalBot, options: TimeoutOptions);
    init(): void;
    private startEndConversationTimer(session);
    private startPromptTimer(session);
    private clearTimeoutHandlers(convoId);
    private resetHandlers(convoId);
}
export declare function setConversationTimeout(bot: builder.UniversalBot, options: TimeoutOptions): void;
