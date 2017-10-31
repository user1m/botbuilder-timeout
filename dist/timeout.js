"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
class Timeout {
    constructor(bot, options) {
        this.timeoutStore = new Map();
        this.options = {
            PROMPT_IF_USER_IS_ACTIVE_MSG: 'Are you there?',
            PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: 'Yes',
            PROMPT_IF_USER_IS_ACTIVE_TIMEOUT: 30000,
            END_CONVERSATION_MSG: "Ending conversation since you've been inactive too long. Hope to see you soon.",
            END_CONVERSATION_TIMEOUT: 15000
        };
        this.bot = bot;
        this.options = Object.assign(this.options, options);
    }
    init() {
        const _this = this;
        this.bot.use({
            botbuilder: function (session, next) {
                _this.timeoutStore.set(session.message.address.conversation.id, { session: session, promptHandler: null, endConvoHandler: null });
                next();
            },
            receive: function (event, next) {
                if (_this.timeoutStore.get(event.address.conversation.id).promptHandler !== null) {
                    clearTimeout(_this.timeoutStore.get(event.address.conversation.id).promptHandler);
                }
                if (_this.timeoutStore.get(event.address.conversation.id).endConvoHandler !== null) {
                    clearTimeout(_this.timeoutStore.get(event.address.conversation.id).endConvoHandler);
                }
                _this.timeoutStore.get(event.address.conversation.id).promptHandler = null;
                _this.timeoutStore.get(event.address.conversation.id).endConvoHandler = null;
                next();
            },
            send: function (event, next) {
                if (_this.timeoutStore.get(event.address.conversation.id).promptHandler === null) {
                    _this.promptUserIsActive(_this.timeoutStore.get(event.address.conversation.id).session);
                }
                next();
            }
        });
    }
    endConversation(session) {
        const _this = this;
        _this.timeoutStore.get(session.message.address.conversation.id).endConvoHandler = setTimeout(() => {
            session.endConversation(_this.options.END_CONVERSATION_MSG);
            _this.timeoutStore.delete(session.message.address.conversation.id);
        }, _this.options.END_CONVERSATION_TIMEOUT);
    }
    promptUserIsActive(session) {
        const _this = this;
        _this.timeoutStore.get(session.message.address.conversation.id).promptHandler = setTimeout(() => {
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG, _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });
            _this.endConversation(session);
        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT);
    }
}
exports.Timeout = Timeout;
function setConversationTimeout(bot, options) {
    new Timeout(bot, options).init();
}
exports.setConversationTimeout = setConversationTimeout;
//# sourceMappingURL=timeout.js.map