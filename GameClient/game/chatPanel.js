/**
 * Created by Jack.L on 2017/5/11.
 */

var chatPanel = cc.Sprite.extend(
    {
        size:cc.director.getWinSize(),
        isShow:false,
        isAnimation:false,
        callback_close:null,
        chatList:[],
        ctor:function()
        {
            this._super();

            var SELF = this;

            cc.spriteFrameCache.addSpriteFrames(res_room.ROOM_PLIST, res_room.ROOM_PNG);
            var _frameBack = cc.spriteFrameCache.getSpriteFrame("chat_back.png");

            this.initWithSpriteFrame(_frameBack);
            this.setAnchorPoint(0.5, 0.0);
            this.setPosition(this.size.width/2, -this.size.height);

            const _contentSize = this.getContentSize();

            this._listener = cc.EventListener.create(
                {
                    event:cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches:true,

                    ////////
                    onTouchBegan: function (touch, event) {

                        var target = event.getCurrentTarget();

                        if( !CHECK_VISIBLE(target) || !SELF.isShow )
                        {
                            return false;
                        }

                        ////
                        var touchPos = touch.getLocation();
                        var locationInNode = target.convertToNodeSpace(touchPos);

                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, locationInNode))
                        {
                            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                            return false;
                        }
                        else
                        {
                            if( SELF.isShow )
                            {
                                SELF.close();
                            }
                        }

                        return false;

                        ////
                    }
                }
            );

            ////////
            var textFieldEvent = function (textField, type) {
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        break;
                    case ccui.TextField.EVENT_INSERT_TEXT:
                    {
                        ////////
                        function chkstrlen(str, lengthcheck)
                        {
                            var strlen = 0;
                            var index  = 0;

                            for(var i = 0;i < str.length; i++)
                            {
                                if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
                                    strlen += 2;
                                else
                                    strlen++;

                                if(strlen > lengthcheck && index == 0)
                                {
                                    index = i;
                                }
                            }
                            return   {length:strlen, cut:index};
                        }

                        var _result = textField.string;
                        var _cutCheck    = chkstrlen(_result, 42);

                        if( _cutCheck.cut != 0 )
                        {
                            _result = _result.substr(0, _cutCheck.cut);
                            _result += "...";
                        }

                        textField.string = _result;

                        break;
                    }
                    case ccui.TextField.EVENT_DELETE_BACKWARD:
                        break;
                    default:
                        break;
                }
            };

            var textField = new ccui.TextField("请输入聊天", FONT_NAME.FONT_HEITI, 48);
            this.textField = textField;

            textField.setTextColor(cc.color(20,40,80));
            textField.setAnchorPoint(0.0, 1.0);
            textField.setPosition(90.0, _contentSize.height - 60);
            textField.addEventListener( textFieldEvent, null );

            this.addChild(textField);

            var button_send_chat = new uiTouchSprite(
                null,null,
                function(touch, event)
                {
                    ////////
                    const _info = textField.getString();



                    ////////
                    NetWorkForChat.chat(_info);
                }
            );

            var frame_button_send = cc.spriteFrameCache.getSpriteFrame("send_chat.png");
            button_send_chat.initWithSpriteFrame(frame_button_send);

            button_send_chat.setPosition(1256, _contentSize.height - 86);
            button_send_chat.setScale(0.618);
            this.addChild(button_send_chat);

            ////////
            var _frame_fastChat = cc.spriteFrameCache.getSpriteFrame('button_fastchat.png');

            const fast_info =
                [
                    "快一点啊，我等到花儿也谢了，婆婆妈妈搞毛线啊",
                    "不要跑，不要跑! 我们决战到地老天荒",
                    "敢不敢再来一局，老子就算输了裤子也要奉陪到底",
                    "兄弟，你是赌神啊，再和你玩下去，房子车子都要输光了",
                    "输并不可怕，输了不给钱就不好了"
                ];

            for( var i in fast_info )
            {
                var _info = fast_info[i];

                var _sptFastChat = new uiTouchSprite(
                    null,null,
                    function(touch, event, target)
                    {
                        const _send_info = target;
                        NetWorkForChat.chat(_send_info);
                    },null,_info
                );

                _sptFastChat.initWithSpriteFrame(_frame_fastChat);
                _sptFastChat.setScale(0.75);
                _sptFastChat.setAnchorPoint(0.5, 0.0);
                _sptFastChat.setPosition(SCREEN_SIZE.WIDTH/2, 16 + 80 * i);

                var _labelFastChat = cc.LabelTTF.create(_info, FONT_NAME.FONT_HEITI, 42);
                _labelFastChat.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                _labelFastChat.setAnchorPoint(0.0, 0.5);
                _labelFastChat.setPosition(24.0, 45.0);
                _sptFastChat.addChild(_labelFastChat);

                this.addChild(_sptFastChat);

            }

        },
        show:function()
        {
            if( this.isAnimation )
            {
                return;
            }

            var SELF = this;

            var action = cc.Sequence.create(
                cc.MoveTo.create(0.4, cc.p(this.size.width/2, 0.0)),
                cc.CallFunc.create(
                    function()
                    {
                        SELF.isAnimation = false;
                    },null,null
                )
            );

            this.runAction(action);
            this.isShow = true;
            this.isAnimation = true;
        },
        close:function()
        {
            if( this.isAnimation )
            {
                return;
            }

            var SELF = this;

            var action = cc.Sequence.create(
                cc.MoveTo.create(0.2, cc.p(this.size.width/2, -this.size.height)),
                cc.CallFunc.create(
                    function()
                    {
                        SELF.isAnimation = false;

                        if( SELF.callback_close )
                        {
                            SELF.callback_close();
                        }

                    },null,null
                )
            );

            this.isShow = false;
            this.isAnimation = true;
            this.runAction(action);
        },
        onEnter:function()
        {
            this._super();
            cc.eventManager.addListener(this._listener, this);
        },
        onExit:function()
        {
            cc.eventManager.removeListener(this._listener);
        },
        clearChatList:function()
        {

        },
        pushChat:function()
        {

        }
    }
);