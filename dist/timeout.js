"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
class Timeout {
    constructor(bot, options) {
        this.promptHandler = null;
        this.endConvoHandler = null;
        this.sessionAliasStore = new Map();
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
                _this.sessionAliasStore.set(session.message.address.conversation.id, session);
                next();
            },
            receive: function (event, next) {
                clearTimeout(_this.promptHandler);
                clearTimeout(_this.endConvoHandler);
                _this.promptHandler = null;
                next();
            },
            send: function (event, next) {
                if (_this.promptHandler === null) {
                    _this.promptUserIsActive(_this.sessionAliasStore.get((event.address)).conversation.id);
                }
                next();
            }
        });
    }
    endConversation(session) {
        const _this = this;
        _this.endConvoHandler = setTimeout(() => {
            session.endConversation(_this.options.END_CONVERSATION_MSG);
            clearTimeout(_this.endConvoHandler);
        }, _this.options.END_CONVERSATION_TIMEOUT);
    }
    promptUserIsActive(session) {
        const _this = this;
        _this.promptHandler = setTimeout(() => {
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG, _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });
            _this.endConversation(session);
            clearTimeout(_this.promptHandler);
        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT);
    }
}
exports.Timeout = Timeout;
function setConversationTimeout(bot, options) {
    new Timeout(bot, options).init();
}
exports.setConversationTimeout = setConversationTimeout;
//# sourceMappingURL=timeout.js.map