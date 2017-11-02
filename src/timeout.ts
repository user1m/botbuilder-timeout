import * as builder from "botbuilder";
import { TimeoutStore } from "./storage";

export interface TimeoutOptions {
    PROMPT_IF_USER_IS_ACTIVE_MSG?: string;
    PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT?: string;
    PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS?: number;
    END_CONVERSATION_MSG?: string;
    END_CONVERSATION_TIMEOUT_IN_MS?: number;
}

const endOfConversation = "endOfConversation";

export class Timeout {
    private bot: builder.UniversalBot;
    private timeoutStore: TimeoutStore = null;
    private options: TimeoutOptions = {
        PROMPT_IF_USER_IS_ACTIVE_MSG: 'Are you there?',
        PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: 'Yes',
        PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS: 30000,
        END_CONVERSATION_MSG: "Ending conversation since you've been inactive too long. Hope to see you soon.",
        END_CONVERSATION_TIMEOUT_IN_MS: 15000
    };

    constructor(bot: builder.UniversalBot, options: TimeoutOptions) {
        this.bot = bot;
        this.options = Object.assign(this.options, options);
        this.timeoutStore = new TimeoutStore();
    }

    public init() {
        const _this = this;

        this.bot.use({
            botbuilder: function (session: builder.Session, next: Function) {
                const convoId = session.message.address.conversation.id;
                _this.timeoutStore.storeConvoIdAndSession(convoId, session);
                // console.log("ACTIVE CONVERSATIONS:", _this.timeoutStore.size);
                next();
            },
            receive: function (event: builder.IEvent, next: Function) {
                const convoId = event.address.conversation.id;
                //clear timeout handlers when we receive message from user
                _this.clearTimeoutHandlers(convoId);
                _this.resetHandlers(convoId);
                next();
            },
            send: function (event: any, next: Function) {
                const convoId = event.address.conversation.id;
                if (event.type === endOfConversation) {
                    _this.clearTimeoutHandlers(event);
                    _this.timeoutStore.removeConvoFromStore(convoId);
                }
                if (event.type !== endOfConversation && _this.timeoutStore.getPromptHandlerFor(convoId) === null) {
                    //start timer when we send message to user
                    _this.startPromptTimer(_this.timeoutStore.getSessionFor(convoId));
                }
                next();
            }
        });
    }

    private startEndConversationTimer(session: builder.Session) {
        const _this = this;
        const convoId = session.message.address.conversation.id;
        const handler = setTimeout(() => {
            //message user that conversation is ended
            session.endConversation(_this.options.END_CONVERSATION_MSG);
            // console.log("ACTIVE CONVERSATIONS:", _this.timeoutStore.size);
        }, _this.options.END_CONVERSATION_TIMEOUT_IN_MS);

        _this.timeoutStore.setEndConvoHandlerFor(convoId, handler);
    }

    private startPromptTimer(session: builder.Session) {
        const _this = this;
        const convoId = session.message.address.conversation.id;
        const handler = setTimeout(() => {
            //prompt to check if user is still active
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG,
                _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });
            _this.startEndConversationTimer(session);
        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS);

        _this.timeoutStore.setPromptHandlerFor(convoId, handler);
    }

    private clearTimeoutHandlers(convoId: string) {
        if (this.timeoutStore.getPromptHandlerFor(convoId) !== null) {
            //if the function has not already been executed,
            //stop the execution by calling the clearTimeout() method.
            clearTimeout(this.timeoutStore.getPromptHandlerFor(convoId));
        }
        if (this.timeoutStore.getEndConvoHandlerFor(convoId) !== null) {
            clearTimeout(this.timeoutStore.getEndConvoHandlerFor(convoId));
        }
    }

    private resetHandlers(convoId: string) {
        this.timeoutStore.setPromptHandlerFor(convoId, null);
        this.timeoutStore.setEndConvoHandlerFor(convoId, null);
    }
}

export function setConversationTimeout(bot: builder.UniversalBot, options: TimeoutOptions) {
    new Timeout(bot, options).init();
}