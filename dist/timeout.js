"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const storage_1 = require("./storage");
const endOfConversation = "endOfConversation";
class Timeout {
    constructor(bot, options) {
        this.timeoutStore = null;
        this.options = {
            PROMPT_IF_USER_IS_ACTIVE_MSG: 'Are you there?',
            PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: 'Yes',
            PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS: 30000,
            END_CONVERSATION_MSG: "Ending conversation since you've been inactive too long. Hope to see you soon.",
            END_CONVERSATION_TIMEOUT_IN_MS: 15000
        };
        this.bot = bot;
        this.options = Object.assign(this.options, options);
        this.timeoutStore = new storage_1.TimeoutStore();
    }
    init() {
        const _this = this;
        this.bot.use({
            botbuilder: function (session, next) {
                const convoId = session.message.address.conversation.id;
                _this.timeoutStore.storeConvoIdAndSession(convoId, session);
                next();
            },
            receive: function (event, next) {
                const convoId = event.address.conversation.id;
                _this.clearTimeoutHandlers(convoId);
                _this.resetHandlers(convoId);
                next();
            },
            send: function (event, next) {
                const convoId = event.address.conversation.id;
                if (event.type === endOfConversation) {
                    _this.clearTimeoutHandlers(event);
                    _this.timeoutStore.removeConvoFromStore(convoId);
                }
                if (event.type !== endOfConversation && _this.timeoutStore.getPromptHandlerFor(convoId) === null) {
                    _this.startPromptTimer(_this.timeoutStore.getSessionFor(convoId));
                }
                next();
            }
        });
    }
    startEndConversationTimer(session) {
        const _this = this;
        const convoId = session.message.address.conversation.id;
        const handler = setTimeout(() => {
            session.endConversation(_this.options.END_CONVERSATION_MSG);
        }, _this.options.END_CONVERSATION_TIMEOUT_IN_MS);
        _this.timeoutStore.setEndConvoHandlerFor(convoId, handler);
    }
    startPromptTimer(session) {
        const _this = this;
        const convoId = session.message.address.conversation.id;
        const handler = setTimeout(() => {
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG, _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });
            _this.startEndConversationTimer(session);
        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS);
        _this.timeoutStore.setPromptHandlerFor(convoId, handler);
    }
    clearTimeoutHandlers(convoId) {
        if (this.timeoutStore.getPromptHandlerFor(convoId) !== null) {
            clearTimeout(this.timeoutStore.getPromptHandlerFor(convoId));
        }
        if (this.timeoutStore.getEndConvoHandlerFor(convoId) !== null) {
            clearTimeout(this.timeoutStore.getEndConvoHandlerFor(convoId));
        }
    }
    resetHandlers(convoId) {
        this.timeoutStore.setPromptHandlerFor(convoId, null);
        this.timeoutStore.setEndConvoHandlerFor(convoId, null);
    }
}
exports.Timeout = Timeout;
function setConversationTimeout(bot, options) {
    new Timeout(bot, options).init();
}
exports.setConversationTimeout = setConversationTimeout;
//# sourceMappingURL=timeout.js.map