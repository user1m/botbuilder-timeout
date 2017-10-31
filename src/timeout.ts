import * as builder from "botbuilder";

export interface TimeoutOptions {
    PROMPT_IF_USER_IS_ACTIVE_MSG?: string;
    PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT?: string;
    PROMPT_IF_USER_IS_ACTIVE_TIMEOUT?: number;
    END_CONVERSATION_MSG?: string;
    END_CONVERSATION_TIMEOUT?: number;
}

// internal interface
interface TimeoutProps {
    session: builder.Session;
    promptHandler: any;
    endConvoHandler: any;
}

export class Timeout {
    private bot: builder.UniversalBot;
    private timeoutStore = new Map<string, TimeoutProps>();
    private options: TimeoutOptions = {
        PROMPT_IF_USER_IS_ACTIVE_MSG: 'Are you there?',
        PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: 'Yes',
        PROMPT_IF_USER_IS_ACTIVE_TIMEOUT: 30000,
        END_CONVERSATION_MSG: "Ending conversation since you've been inactive too long. Hope to see you soon.",
        END_CONVERSATION_TIMEOUT: 15000
    };

    constructor(bot: builder.UniversalBot, options: TimeoutOptions) {
        this.bot = bot;
        this.options = Object.assign(this.options, options);
    }

    public init() {
        const _this = this;

        this.bot.use({
            botbuilder: function (session: builder.Session, next: Function) {
                //get an alias to session so we can use it for our timeout functions
                _this.timeoutStore.set(session.message.address.conversation.id, { session: session, promptHandler: null, endConvoHandler: null });
                next();
            },
            receive: function (event: builder.IEvent, next: Function) {
                //clear timeout handlers when we receive message from user
                if (_this.timeoutStore.get(event.address.conversation.id).promptHandler !== null) {
                    //if the function has not already been executed, stop the execution by calling the clearTimeout() method.
                    clearTimeout(_this.timeoutStore.get(event.address.conversation.id).promptHandler);
                }
                if (_this.timeoutStore.get(event.address.conversation.id).endConvoHandler !== null) {
                    //if the function has not already been executed, stop the execution by calling the clearTimeout() method.
                    clearTimeout(_this.timeoutStore.get(event.address.conversation.id).endConvoHandler);
                }
                //reset handlers
                _this.timeoutStore.get(event.address.conversation.id).promptHandler = null;
                _this.timeoutStore.get(event.address.conversation.id).endConvoHandler = null;
                next();
            },
            send: function (event: builder.IEvent, next: Function) {
                if (_this.timeoutStore.get(event.address.conversation.id).promptHandler === null) {
                    //start timer when we send message to user
                    _this.promptUserIsActive(_this.timeoutStore.get(event.address.conversation.id).session);
                }
                next();
            }
        });
    }

    private endConversation(session: builder.Session) {
        const _this = this;
        _this.timeoutStore.get(session.message.address.conversation.id).endConvoHandler = setTimeout(() => {
            //message user that conversation is ended
            session.endConversation(_this.options.END_CONVERSATION_MSG);

            //remove conversation from timeout store
            _this.timeoutStore.delete(session.message.address.conversation.id);

        }, _this.options.END_CONVERSATION_TIMEOUT);
    }

    public promptUserIsActive(session: builder.Session) {
        const _this = this;
        _this.timeoutStore.get(session.message.address.conversation.id).promptHandler = setTimeout(() => {
            //prompt to check if user is still active
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG, _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });

            //start end conversation timer
            _this.endConversation(session);

        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT);
    }
}

export function setConversationTimeout(bot: builder.UniversalBot, options: TimeoutOptions) {
    new Timeout(bot, options).init();
}