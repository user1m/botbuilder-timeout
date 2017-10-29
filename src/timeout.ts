import * as builder from "botbuilder";

export class Timeout {

    private bot;
    public promptHandler = null;
    public endConvoHandler = null;
    private sessionAlias;
    private options = {
        PROMPT_IF_USER_IS_ACTIVE_MSG: 'Are you there?',
        PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: 'Yes',
        PROMPT_IF_USER_IS_ACTIVE_TIMEOUT: 30000,
        END_CONVERSATION_MSG: 'Ending conversation since you\'ve been inactive too long. Hope to see you soon.'
        END_CONVERSATION_TIMEOUT: 15000
    };

    constructor(bot: builder.UniversalBot) {
        this.bot = bot;
    }

    public init() {
        const _this = this;
        this.bot.use({
            botbuilder: function (session: builder.Session, next: Function) {
                //get an alias to session so we can use it for our timeout functions
                _this.sessionAlias = session;
                next();
            },
            receive: function (event: any, next: any) {
                //clear timeout handlers when we receive message from user
                clearTimeout(_this.promptHandler);
                clearTimeout(_this.endConvoHandler);
                _this.promptHandler = null;
                next();
            },
            send: function (event: any, next: any) {
                if (_this.promptHandler === null) {
                    //start timer when we send message to user
                    _this.promptUserIsActive(_this.sessionAlias);
                }
                next();
            }
        });
    }

    private endConversation(session: builder.Session) {
        const _this = this;
        _this.endConvoHandler = setTimeout(function () {
            session.endConversation(_this.options.END_CONVERSATION_MSG);
            clearTimeout(_this.endConvoHandler);
        }, _this.options.END_CONVERSATION_TIMEOUT);
    }

    public promptUserIsActive(session: builder.Session) {
        const _this = this;
        _this.promptHandler = setTimeout(function () {
            builder.Prompts.choice(session, _this.options.PROMPT_IF_USER_IS_ACTIVE_MSG, _this.options.PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT, { listStyle: 3 });
            //start end conversation timer after you prompt user
            _this.endConversation(session);
            clearTimeout(_this.promptHandler);
        }, _this.options.PROMPT_IF_USER_IS_ACTIVE_TIMEOUT);
    }