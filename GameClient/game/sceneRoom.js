/**
 * Created by Jack on 2017/3/28.
 */

var sceneRoom = cc.Scene.extend(
    {
        POKECARD:null,
        BACKGROUND:null,
        size:cc.director.getWinSize(),
        GAME_RUNNING:false,
        ctor:function()
        {
            ////
            var SELF = this;

            ////
            gameTimer.setTime(600);

            ////
            clientSystem.getInstance().setRoom(this);

            ////
            this._super();
            cc.spriteFrameCache.addSpriteFrames(res_hall.HALL_PLIST, res_hall.HALL_PNG);
            cc.spriteFrameCache.addSpriteFrames(res_hall.HALL_DLG_PLIST, res_hall.HALL_DLG_PNG);
            cc.spriteFrameCache.addSpriteFrames(res_room.ROOM_PLIST, res_room.ROOM_PNG) ;
            cc.spriteFrameCache.addSpriteFrames(res_room.WINTYPE_PLIST, res_room.WINTYPE_PNG);

            ////
            var sptBackground = cc.Sprite.create(res_background.BG_ROOM);
            sptBackground.setPosition(this.size.width / 2, this.size.height / 2);
            this.addChild(sptBackground, 0);

            this.BACKGROUND = sptBackground;

            ////////
            this.BACKGROUND_GAME = cc.Sprite.create(res_background.BG_GAME);
            this.BACKGROUND_GAME.setAnchorPoint(0.0,0.0);
            this.BACKGROUND.addChild(this.BACKGROUND_GAME);
            this.BACKGROUND_GAME.setOpacity(0);

            ////////
            this.POKECARD = new PokeCardView();
            this.BACKGROUND.addChild(this.POKECARD);

            ////////
            this.UI_NODE = cc.Node.create();
            this.BACKGROUND.addChild( this.UI_NODE );

            ////////////
            var _frame_tip =
                [
                    cc.spriteFrameCache.getSpriteFrame("room_tip.png"),
                    cc.spriteFrameCache.getSpriteFrame("room_tip_1.png")
                ];

            var _sptTip = cc.Sprite.createWithSpriteFrame(_frame_tip[0]);
            _sptTip.setScale(0.5);
            _sptTip.setPosition(this.size.width/2 + 160, this.size.height / 2);
            sptBackground.addChild(_sptTip);

            this.TIP = _sptTip;

            ////
            var _label_around = cc.LabelTTF.create("1/8", FONT_NAME.FONT_SKETCHFLOW_PRINT, 48);
            _label_around.setColor(cc.color(30,15,20));
            _label_around.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            _label_around.setAnchorPoint(0.0, 0.5);
            _label_around.setPosition(256 + 32, 400 - 12.0);
            _sptTip.addChild(_label_around);
            this.LABEL_AROUND = _label_around;

            ////
            var _label_roomkey = cc.LabelTTF.create("123456",FONT_NAME.FONT_SKETCHFLOW_PRINT, 64);
            _label_roomkey.setColor(cc.color(30,15,20));
            _label_roomkey.setPosition(256, 300);
            _sptTip.addChild(_label_roomkey);

            this.LABEL_ROOM_KEY = _label_roomkey;

            ////
            var _label_baseScore = cc.LabelTTF.create("底分+1",FONT_NAME.FONT_YOUYUAN, 72);
            _label_baseScore.setColor(cc.color(30,15,20));
            _label_baseScore.setPosition(256, 180);
            _sptTip.addChild(_label_baseScore);

            this.LABEL_BASESCORE = _label_baseScore;

            this.INFO_NODE = cc.Node.create();
            this.INFO_NODE.setPosition(SCREEN_SIZE.WIDTH / 2 + 16.0, SCREEN_SIZE.HEIGHT / 2 + 128.0);
            this.BACKGROUND.addChild(this.INFO_NODE);

            this.INFO_roomID = cc.LabelTTF.create("房号:000000",FONT_NAME.FONT_HEITI, 24);
            this.INFO_roomID.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.INFO_roomID.setAnchorPoint(0.0, 1.0);
            this.INFO_roomID.setPosition(12, -12);
            this.INFO_NODE.addChild(this.INFO_roomID);

            this.INFO_baseScore = cc.LabelTTF.create("底分:1",FONT_NAME.FONT_HEITI, 24);
            this.INFO_baseScore.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.INFO_baseScore.setAnchorPoint(0.0, 1.0);
            this.INFO_baseScore.setPosition(12, -12 - 32);
            this.INFO_NODE.addChild(this.INFO_baseScore);

            this.INFO_around  = cc.LabelTTF.create("局数:1/8",FONT_NAME.FONT_HEITI, 24);
            this.INFO_around.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.INFO_around.setAnchorPoint(0.0, 1.0);
            this.INFO_around.setPosition(12,  -12 - 32 * 2);
            this.INFO_NODE.addChild(this.INFO_around);

            var _info_around = this.INFO_around;

            this.SET_AROUND = function(_current_around, _max_around)
            {
                ////////
                if( _current_around == 0 || _max_around == 0 )
                {
                    _label_around.setVisible(false);
                }
                else
                {
                    _label_around.setString(_current_around.toString() + "/" + _max_around.toString());
                    _label_around.setVisible(true);
                    _info_around.setString("局数:" + _current_around.toString() + "/" + _max_around.toString());
                }
            };

            this.INFO_NODE.setVisible(false);

            ////
            var _sptTip_1 = cc.Sprite.createWithSpriteFrame(_frame_tip[1]);
            _sptTip_1.setAnchorPoint(0.0, 0.0);
            _sptTip_1.setPosition(64.0,0.0);
            _sptTip.addChild(_sptTip_1);

            ////
            _sptTip.setRotation(-30);

            ////////
            var _frameBack = cc.spriteFrameCache.getSpriteFrame("bgmaindlg_back.png");
            var _button_Back =
                new uiTouchSprite(
                    null, null,
                    function (touch, event) {

                        if( !SELF.GAME_RUNNING )
                        {
                            ////////
                            clientSystem.getInstance().leave_room(
                                function()
                                {
                                    var _trans = new cc.TransitionCrossFade(1.0, new sceneHall());
                                    cc.director.runScene(_trans);
                                }
                            );
                        }
                        else
                        {
                            ////////
                            var _applicateLeaveDlg = SELF.DIALOG_APPLICATE_LEAVE;

                            clientSystem.getInstance().applicate_leave(
                                1,
                                function()
                                {
                                    _applicateLeaveDlg.NODE_BUTTON.setVisible(false);
                                    _applicateLeaveDlg.show(true)
                                }
                            );
                        }
                    }
                );

            _button_Back.TOUCH_SOUND = res_sound.door;


            ////
            _button_Back.initWithSpriteFrame(_frameBack);
            _button_Back.setScale(0.5);
            _button_Back.setAnchorPoint(1.0, 1.0);
            _button_Back.setPosition(SCREEN_SIZE.WIDTH - 8.0, SCREEN_SIZE.HEIGHT - 8.0);
            sptBackground.addChild(_button_Back);
            this.BUTTON_LEAVE = _button_Back;

            ////////
            const _top_player_ui_x_flag = -64.0;
            this.ROOT_PLAYERS = cc.Node.create();
            this.BACKGROUND.addChild(this.ROOT_PLAYERS);
            this.PLAYERS = {};

            const _posArray =
            [
                //逆时针
                {x:SCREEN_SIZE.WIDTH / 4 + 64,y:128},

                ////
                {x:SCREEN_SIZE.WIDTH - 64 - 4.0,y:SCREEN_SIZE.HEIGHT * 0.25 + 64},
                {x:SCREEN_SIZE.WIDTH - 64 - 4.0,y:SCREEN_SIZE.HEIGHT * 0.75 - 48},

                {x:SCREEN_SIZE.WIDTH * 0.75 + _top_player_ui_x_flag,y:SCREEN_SIZE.HEIGHT - 64 - 4},
                {x:SCREEN_SIZE.WIDTH * 0.5 - 64 + _top_player_ui_x_flag,y:SCREEN_SIZE.HEIGHT - 64 - 4},
                {x:SCREEN_SIZE.WIDTH * 0.25 - 128 + _top_player_ui_x_flag,y:SCREEN_SIZE.HEIGHT - 64 - 4},

                {x:64 + 4.0,y:SCREEN_SIZE.HEIGHT * 0.75 - 48 - 96},
                {x:64 + 4.0,y:SCREEN_SIZE.HEIGHT * 0.25 + 64 - 96},
            ];

            for( var i=0; i<8; i++ )
            {
                var _player = new roomPlayer();
                _player.setScale(0.5);
                _player.setPosition(_posArray[i].x, _posArray[i].y);

                this.ROOT_PLAYERS.addChild(_player);
                this.PLAYERS[i] = _player;
            }

            const selfPlayer = clientSystem.getInstance().SELF_PLAYER;

            this.PLAYERS[0].setPlayer(
                {
                    nickname:selfPlayer.nickname,
                    img_url:selfPlayer.img_url,
                    player_key:selfPlayer.player_key
                }
            );

            ////////////////
            const _SCALEFLAG_POKE_CARD_1 = 0.3;
            const _SCALEFLAG_POKE_CARD_2 = 0.25;

            this.POKECARD.init();

            this.SOURCECARD = [];
            for( var i=0; i<52; i++ )
            {
                var _sourceCard = this.POKECARD.createPoke(-1, true);
                _sourceCard.setAnchorPoint(0.0, 0.0);
                _sourceCard.setScale(_SCALEFLAG_POKE_CARD_1);
                _sourceCard.setPosition(SCREEN_SIZE.WIDTH/2 - 80, SCREEN_SIZE.HEIGHT/2 + 0.2 * i);

                _sourceCard.anim_move =
                    function(desCard, timeflag)
                    {
                        var   _desCard = desCard;
                        const _desPos  = desCard.getWorldPosition();
                        const _timeflag = timeflag;

                        var SELF = this;
                        var action = cc.Sequence.create(
                            cc.FadeIn.create(_timeflag, 255),
                            cc.MoveTo.create(0.125, _desPos),
                            cc.CallFunc.create(
                                function(target, data)
                                {
                                    _desCard.setVisible(true);
                                    SELF.setVisible(false);
                                },null,null
                            )
                        );

                        this.runAction(action);
                    };

                this.SOURCECARD.push(_sourceCard);
            }

            this.resetSourceCard =
                function()
                {
                    for( var i in this.SOURCECARD )
                    {
                        var _sourceCard = this.SOURCECARD[i];
                        _sourceCard.setPosition(SCREEN_SIZE.WIDTH/2 - 80, SCREEN_SIZE.HEIGHT/2 + 0.2 * i);
                        _sourceCard.setVisible(true);
                    }
                };

            ////
            var sptPoke = this.POKECARD.createSelfList([-1,-1,-1,-1,-1], true)
            sptPoke.setScale(_SCALEFLAG_POKE_CARD_1);
            sptPoke.setPosition(_posArray[0].x + 180, _posArray[0].y);
            sptPoke.setVisible(false);

            //

            this.SELF_PLAYER_POKECARD = sptPoke;
            const _player_pokecard_y_flag = -24.0;

            const _posArrayForPoke =
                [
                    ////
                    {x:SCREEN_SIZE.WIDTH - 64 - 4.0 - 216,y:SCREEN_SIZE.HEIGHT * 0.25 + 64 + 4.0 + _player_pokecard_y_flag},
                    {x:SCREEN_SIZE.WIDTH - 64 - 4.0 - 216,y:SCREEN_SIZE.HEIGHT * 0.75 - 48 + 4.0 + _player_pokecard_y_flag},

                    {x:SCREEN_SIZE.WIDTH * 0.75 + _top_player_ui_x_flag + 108,y:SCREEN_SIZE.HEIGHT - 64 - 4 + _player_pokecard_y_flag},
                    {x:SCREEN_SIZE.WIDTH * 0.5 - 64  + _top_player_ui_x_flag + 108,y:SCREEN_SIZE.HEIGHT - 64 - 4 + _player_pokecard_y_flag},
                    {x:SCREEN_SIZE.WIDTH * 0.25 - 128 + _top_player_ui_x_flag + 108,y:SCREEN_SIZE.HEIGHT - 64 - 4 + _player_pokecard_y_flag},

                    {x:64 + 4.0 + 108,y:SCREEN_SIZE.HEIGHT * 0.75 - 48 + 4.0 + _player_pokecard_y_flag - 96},
                    {x:64 + 4.0 + 108,y:SCREEN_SIZE.HEIGHT * 0.25 + 64 + 4.0 + _player_pokecard_y_flag - 96},
                ];

            this.PLAYERS_POKECARD = [];
            this.PLAYERS_POKECARD.push(this.SELF_PLAYER_POKECARD);

            for( var i in _posArrayForPoke )
            {
                var _otherPlayerPokecard = this.POKECARD.createPokeListForRect([-1,-1,-1,-1,-1], true);
                _otherPlayerPokecard.setScale(_SCALEFLAG_POKE_CARD_2);
                _otherPlayerPokecard.setPosition(_posArrayForPoke[i].x, _posArrayForPoke[i].y);

                _otherPlayerPokecard.setVisible(false);

                this.PLAYERS_POKECARD.push( _otherPlayerPokecard );
            }

            ////////
            //chat ui
            this.CHAT_UI_ARRAY = [];
            this.CHAT_UI_NODE = cc.Node.create();

            const pos_chat_back =
                [
                    {ax:0, ay:0,x:0,y:0,flipx:false,flipy:false},

                    {ax:1, ay:1,x:0,y:0,flipx:true,flipy:true},
                    {ax:1, ay:1,x:0,y:0,flipx:true,flipy:true},

                    {ax:0, ay:1,x:0,y:0,flipx:false,flipy:true},
                    {ax:0, ay:1,x:0,y:0,flipx:false,flipy:true},
                    {ax:0, ay:1,x:0,y:0,flipx:false,flipy:true},

                    {ax:0, ay:1,x:0,y:0,flipx:false,flipy:true},
                    {ax:0, ay:0,x:0,y:0,flipx:false,flipy:false},
                ];

            for( var i in _posArray )
            {
                const pos_flag = pos_chat_back[i];

                var CHAT_UI = cc.Sprite.create();

                CHAT_UI.setAnchorPoint(pos_flag.ax, pos_flag.ay);

                CHAT_UI.setPosition(cc.p(_posArray[i].x +pos_flag.x, _posArray[i].y + pos_flag.y));
                this.CHAT_UI_NODE.addChild( CHAT_UI );
                this.CHAT_UI_ARRAY.push(CHAT_UI);

                var frame_chat_ui_back = cc.spriteFrameCache.getSpriteFrame('chat_info_back.png');

                CHAT_UI.initWithSpriteFrame(frame_chat_ui_back);

                if( pos_flag.flipx )
                {
                    CHAT_UI.setFlippedX(true);
                }

                if( pos_flag.flipy )
                {
                    CHAT_UI.setFlippedY(true);
                }

                var _chatLabel = cc.LabelTTF.create("", FONT_NAME.FONT_HEITI, 42);
                _chatLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                _chatLabel.setDimensions(cc.size(420, 180));
                _chatLabel.setPosition(256, 128);
                CHAT_UI.addChild(_chatLabel);

                CHAT_UI.setScale(0.5);
                CHAT_UI.chatLabel = _chatLabel;

                CHAT_UI.setOpacity(0);
                _chatLabel.setOpacity(0);

                CHAT_UI.setInfo =
                    function(_info)
                    {
                        this.chatLabel.setString(_info);

                        var action1 =
                            cc.Sequence.create(
                                cc.FadeIn.create(0.3, 255),
                                cc.FadeIn.create(5, 255),
                                cc.FadeOut.create(0.5,0)
                            );

                        var action2 =
                            cc.Sequence.create(
                                cc.FadeIn.create(0.3, 255),
                                cc.FadeIn.create(5, 255),
                                cc.FadeOut.create(0.5,0)
                            );


                        this.runAction(action1);
                        this.chatLabel.runAction(action2);

                    };

            }

            //this.CHAT_UI_ARRAY[1].setInfo("中华人民共和国中华人民共和国中华人民共和国中华人民共和国");

            ////////
            //icon zhuang
            const _posZhuangIcon =
                [
                    {x:256, y:0},
                    {x:128, y:256},
                    {x:128, y:256},

                    {x:-128, y:128},
                    {x:-128, y:128},
                    {x:-128, y:128},

                    {x:0, y:256},
                    {x:0, y:256},
                ];

            for( var i in this.PLAYERS )
            {
                this.PLAYERS[i].ICON_ZHUANG.setPosition(_posZhuangIcon[i].x, _posZhuangIcon[i].y);
            }

            //icon double
            const _posDoubleIcon =
                [
                    {x:256, y:128},
                    {x:0, y:256},
                    {x:0, y:256},

                    {x:-128, y:0},
                    {x:-128, y:0},
                    {x:-128, y:0},

                    {x:128, y:256},
                    {x:128, y:256},
                ];

            for( var i in this.PLAYERS )
            {
                this.PLAYERS[i].ICON_DOUBLE.setPosition(_posDoubleIcon[i].x, _posDoubleIcon[i].y);
            }

            ////////
            var _frame_button =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_room_ready.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_room_cancel.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_room_wechat.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_end.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_chat.png"),
                ];

            ////
            var _BUTTON_READY  = null;
            var _BUTTON_CANCEL = null;

            ////
            this.BUTTON_READY = new uiTouchSprite(
                null,null,
                function(ref,event)
                {
                    clientSystem.getInstance().game_ready(true,
                        function(data)
                        {
                            _BUTTON_READY.setVisible(false);
                            _BUTTON_CANCEL.setVisible(true);
                        }
                    );
                }
            );

            this.BUTTON_READY.initWithSpriteFrame(_frame_button[0]);
            this.BUTTON_READY.setAnchorPoint(0.5, 0.0);
            this.BUTTON_READY.setPosition(SCREEN_SIZE.WIDTH/2, 24.0);
            this.UI_NODE.addChild( this.BUTTON_READY );
            this.BUTTON_READY.setVisible(false);

            ////
            this.BUTTON_CANCEL = new uiTouchSprite(
                null,null,
                function(ref,event)
                {
                    clientSystem.getInstance().game_ready(false,
                        function(data)
                        {
                            _BUTTON_READY.setVisible(true);
                            _BUTTON_CANCEL.setVisible(false);
                        }
                    );
                }
            );

            this.BUTTON_CANCEL.initWithSpriteFrame(_frame_button[1]);
            this.BUTTON_CANCEL.setAnchorPoint(0.5, 0.0);
            this.BUTTON_CANCEL.setPosition(SCREEN_SIZE.WIDTH/2, 24.0);
            this.UI_NODE.addChild( this.BUTTON_CANCEL );
            this.BUTTON_CANCEL.setVisible(false);

            ////
            _BUTTON_READY  = this.BUTTON_READY;
            _BUTTON_CANCEL = this.BUTTON_CANCEL;

            ////
            this.BUTTON_WECHAT = new uiTouchSprite(
                null,null,
                function(ref,event)
                {

                }
            );

            this.BUTTON_WECHAT.initWithSpriteFrame(_frame_button[2]);
            this.BUTTON_WECHAT.setAnchorPoint(1.0, 0.0);
            this.BUTTON_WECHAT.setPosition(SCREEN_SIZE.WIDTH - 24 - 96, 24.0);
            this.UI_NODE.addChild( this.BUTTON_WECHAT );

            this.PANEL_CHAT = new chatPanel();
            this.addChild(this.PANEL_CHAT);

            this.BUTTON_CHAT = new uiTouchSprite(
                null,null,
                function(ref, event)
                {
                    SELF.PANEL_CHAT.show();
                    SELF.UI_NODE.setVisible(false);
                }
            );

            this.PANEL_CHAT.callback_close =
                function()
                {
                    SELF.UI_NODE.setVisible(true);
                };

            this.BUTTON_CHAT.initWithSpriteFrame(_frame_button[4]);
            this.BUTTON_CHAT.setAnchorPoint(1.0, 0.0);
            this.BUTTON_CHAT.setPosition(SCREEN_SIZE.WIDTH * 0.25, 0.0);
            this.UI_NODE.addChild(this.BUTTON_CHAT);

            ////////////////
            this.BUTTON_END = new uiTouchSprite(
                null,null,
                function(ref,event)
                {
                    ////////
                    //游戏结束，弹出总结算
                    SELF.DIALOG_TOTAL_RESULT.show(true);
                    SELF.BUTTON_END.setVisible(false);

                    ////////
                    TDMissionResult(true);
                }
            );

            this.BUTTON_END.initWithSpriteFrame(_frame_button[3]);
            this.BUTTON_END.setAnchorPoint(1.0, 0.0);
            this.BUTTON_END.setPosition(SCREEN_SIZE.WIDTH - 24 - 96, 24.0);
            this.UI_NODE.addChild( this.BUTTON_END );
            this.BUTTON_END.setVisible(false);

            ////////////////
            this.GAME_FIGHT_ZHUANG = cc.Node.create();
            this.GAME_FIGHT_ZHUANG.setPosition(0.0,0.0);
            this.UI_NODE.addChild(this.GAME_FIGHT_ZHUANG);

            var _button_ctrl_frame =
                cc.spriteFrameCache.getSpriteFrame("button_room_chip.png");

            var event_fightZhuang =
                function(ref, event, target)
                {
                    ////
                    clientSystem.getInstance().fight_zhuang(target,
                        null
                    );
                };

            const _zhuang_value =
                [
                    1,2,4,8
                ];

            var _frame_zhuangchip = cc.spriteFrameCache.getSpriteFrame("chip_3.png");
            var _zhuangChip = cc.Sprite.createWithSpriteFrame(_frame_zhuangchip);
            var _zhuangChipLabel = cc.LabelTTF.create("x1", FONT_NAME.FONT_HEITI, 72);
            _zhuangChipLabel.setColor(cc.color(0,0,0));
            _zhuangChipLabel.setPosition(128,128);
            _zhuangChip.addChild(_zhuangChipLabel);
            _zhuangChip.setScale(0.5);

            _zhuangChip.setPosition(SCREEN_SIZE.WIDTH/2 - 160, SCREEN_SIZE.HEIGHT * 0.618);

            this.BACKGROUND.addChild(_zhuangChip);

            this.showZhuangChip =
                function(_show, _value)
                {
                    ////
                    _zhuangChip.setVisible(_show);
                    _zhuangChipLabel.setString("x"+_value.toString());
                };

            this.showZhuangChip(false, 0);

            this.BUTTON_FIGHT_ZHUANG =
                [
                    new uiTouchSprite(
                        null,null,
                        event_fightZhuang,null,
                        _zhuang_value[0]
                    ),
                    new uiTouchSprite(
                        null,null,
                        event_fightZhuang,null,
                        _zhuang_value[1]
                    ),
                    new uiTouchSprite(
                        null,null,
                        event_fightZhuang,null,
                        _zhuang_value[2]
                    ),
                    new uiTouchSprite(
                        null,null,
                        event_fightZhuang,null,
                        _zhuang_value[3]
                    )
                ];

            for( var i in this.BUTTON_FIGHT_ZHUANG )
            {
                var _button = this.BUTTON_FIGHT_ZHUANG[i];
                _button.initWithSpriteFrame(_button_ctrl_frame);

                this.GAME_FIGHT_ZHUANG.addChild(_button);
                _button.setAnchorPoint(0.0, 0.0);
                _button.setScale(0.5);
                _button.setPosition(SCREEN_SIZE.WIDTH / 3 + i * 160, 220.0);

                var _label_zhuang = cc.LabelTTF.create("x" + _zhuang_value[i].toString(), FONT_NAME.FONT_HEITI, 72);
                _label_zhuang.setPosition(128, 128);
                _button.addChild(_label_zhuang);
            }

            this.GAME_FIGHT_ZHUANG.setVisible(false);

            ////////////////
            //加注界面
            ////////////////
            this.GAME_ADD_DOUBLE = cc.Node.create();
            this.GAME_ADD_DOUBLE.setPosition(0.0,0.0);
            this.UI_NODE.addChild(this.GAME_ADD_DOUBLE);

            var event_addDouble =
                function(ref, event, target)
                {
                    ////
                    clientSystem.getInstance().add_double(target,
                        null
                    );
                };

            const _double_value =
                [
                    0,5,10,20,40
                ];

            this.BUTTON_ADD_DOUBLE = [];

            for(var i in _double_value)
            {
                var _sptAddDouble =
                    new uiTouchSprite(
                        null,null,
                        event_addDouble,null,
                        _double_value[i]
                    );

                this.BUTTON_ADD_DOUBLE.push(_sptAddDouble);
            }

            for( var i in this.BUTTON_ADD_DOUBLE )
            {
                var _button = this.BUTTON_ADD_DOUBLE[i];
                _button.initWithSpriteFrame(_button_ctrl_frame);

                this.GAME_ADD_DOUBLE.addChild(_button);
                _button.setAnchorPoint(0.0, 0.0);
                _button.setScale(0.5);
                _button.setPosition(SCREEN_SIZE.WIDTH * 0.25 + i * 160, 220.0);

                var _label_double = cc.LabelTTF.create("x" + _double_value[i].toString(), FONT_NAME.FONT_HEITI, 72);
                _label_double.setPosition(128, 128);
                _button.addChild(_label_double);

                if( _double_value[i] == 0 )
                {
                    _label_double.setString("不加");
                }
            }

            this.GAME_ADD_DOUBLE.setVisible(false);

            ////////////////
            var _frame_banner = cc.spriteFrameCache.getSpriteFrame("game_banner.png");
            this.GAME_BANNER = cc.Sprite.createWithSpriteFrame(_frame_banner);
            this.GAME_BANNER.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT * 0.618);
            this.BACKGROUND.addChild(this.GAME_BANNER);

            this.GAME_BANNER_INFO = cc.LabelTTF.create("信息",FONT_NAME.FONT_HEITI, 48);
            this.GAME_BANNER_INFO.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT * 0.618);
            this.BACKGROUND.addChild(this.GAME_BANNER_INFO);

            const _banner_info_x = this.size.width / 2;
            const _banner_info_y = this.size.height / 2;

            this.GAME_BANNER_INFO.reset =
                function()
                {
                    this.setPosition(_banner_info_x - 5000, _banner_info_y);
                };

            this.GAME_BANNER.reset =
                function()
                {
                    this.runAction(cc.FadeOut.create(0.0,0));
                }

            this.setBanner(null);

            ////////////////
            //next around game & leave room
            this.GAME_END_NODE = cc.Node.create();
            this.BACKGROUND.addChild(this.GAME_END_NODE);

            var _frame_next_button = cc.spriteFrameCache.getSpriteFrame('button_next_round.png');
            var event_NextRound =
                function(ref, event, target)
                {
                    ////
                    clientSystem.getInstance().next_around();
                };

            var _button_NextRound =
                new uiTouchSprite(
                    null,null,
                    event_NextRound
                );

            _button_NextRound.initWithSpriteFrame(_frame_next_button);
            _button_NextRound.setAnchorPoint(1.0, 0.0);
            _button_NextRound.setPosition(SCREEN_SIZE.WIDTH - 24 - 96, 24.0);

            this.GAME_END_NODE.addChild(_button_NextRound);

            //////
            var _buttonOption =
                new uiTouchSprite(
                    null,null,
                    function(touch, event)
                    {
                        show_option_dialog();
                    }
                );

            var _frameOption = cc.spriteFrameCache.getSpriteFrame("icon_option.png");

            _buttonOption.initWithSpriteFrame(_frameOption);
            _buttonOption.setAnchorPoint(1.0, 0.0);
            _buttonOption.setScale(0.5, 0.5);
            _buttonOption.setPosition(SCREEN_SIZE.WIDTH - 24, 24);
            this.BACKGROUND.addChild(_buttonOption);

            ////////
            this.DIALOG_APPLICATE_LEAVE = new dialogApplicateLeave;
            this.BACKGROUND.addChild(this.DIALOG_APPLICATE_LEAVE);

            ////////
            this.DIALOG_TOTAL_RESULT = new dialogTotalResult;
            this.BACKGROUND.addChild(this.DIALOG_TOTAL_RESULT);

            this.BUTTON_WECHAT.setVisible(true);

            ////////
            this.BACKGROUND.addChild(this.CHAT_UI_NODE);

            ////////
            this.refreshUI();

            ////////


        },
        setBanner:function(info)
        {
            var _banner      = this.GAME_BANNER;
            var _banner_info = this.GAME_BANNER_INFO;

            if( info == null )
            {
                _banner.setVisible(false);
                _banner_info.setVisible(false);
            }
            else
            {
                this.GAME_BANNER_INFO.setString(info);

                _banner.setVisible(true);
                _banner_info.setVisible(true);

            }
        },
        onEnter:function()
        {
            var SELF = this;

            this.PANEL_CHAT.onEnter();
            this.ROOT_PLAYERS.onEnter();
            this.BACKGROUND.onEnter();
            this.GAME_FIGHT_ZHUANG.onEnter();
            this.GAME_ADD_DOUBLE.onEnter();
            this.POKECARD.onEnter();
            this.DIALOG_TOTAL_RESULT.onEnter();
            this.DIALOG_APPLICATE_LEAVE.onEnter();

            this.GAME_BANNER.onEnter();
            this.GAME_BANNER_INFO.onEnter();

            ////////
            var _room_key = clientSystem.getInstance().SELF_PLAYER.room_rand_key;
            var _basescore = clientSystem.getInstance().SELF_PLAYER.room_basescore;

            this.LABEL_ROOM_KEY.setString(_room_key.toString());
            this.LABEL_BASESCORE.setString("底分 +" + _basescore.toString());

            this.INFO_roomID.setString("房号:" + _room_key.toString());
            this.INFO_baseScore.setString("底分:" + _basescore.toString());

            optionSys.getInstance().setMusicForBackground(res_backgroundmusic.ingame);

            ////////
            NetWorkForChat.start(_room_key, clientSystem.getInstance().SELF_PLAYER.key,
                function(_player_id, _info)
                {
                    SELF.onChat(_player_id, _info);
                }
            );

        },
        onExit:function()
        {
            ////////
            NetWorkForChat.close();

            ////////
            this.GAME_BANNER.onExit();
            this.GAME_BANNER_INFO.onExit();

            this.DIALOG_APPLICATE_LEAVE.onExit();
            this.DIALOG_TOTAL_RESULT.onExit();
            this.POKECARD.onExit();
            this.GAME_FIGHT_ZHUANG.onExit();
            this.GAME_ADD_DOUBLE.onExit();
            this.BACKGROUND.onExit();
            this.ROOT_PLAYERS.onExit();

            this.PANEL_CHAT.onExit();
        },
        clearPlayersStatus:function()
        {
            for( var i in this.PLAYERS )
            {
                var _player = this.PLAYERS[i];

                _player.setZhuang(false);
                _player.SET_DOUBLE_VALUE(null);
                _player.SHOW_ADD_SCORE(null);
                _player.SET_WIN_TYPE(null);
            }
        },
        refreshPlayers:function()
        {
            const zhuangValue  = clientSystem.getInstance().ZHUANG_VALUE;
            const selfPlayer   = clientSystem.getInstance().SELF_PLAYER;
            const otherPlayers = clientSystem.getInstance().OTHER_PLAYERS;
            const zhuangPlayer = clientSystem.getInstance().ZHUANG_PLAYER;
            const _game_room_status = selfPlayer.game_room_status;

            for( var i in otherPlayers )
            {
                var _player = otherPlayers[i];

                const _posindex = (_player.index_in_room - selfPlayer.index_in_room + 8) % 8;
                const _game_player_status = _player.game_player_status;

                if( _player.id != selfPlayer.id )
                {
                    this.setPlayer(_player, _posindex);
                    this.setPlayerStatus(_posindex, _game_player_status, _game_room_status);
                }

                if( _player == zhuangPlayer )
                {
                    this.PLAYERS[_posindex].setZhuang(true);
                }

                if( _player.double_value != null && _game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER )
                {
                    this.PLAYERS[_posindex].SET_DOUBLE_VALUE(_player.double_value);
                }
            }

            ////////
            //self player
            this.setPlayer(selfPlayer, 0);
            this.setPlayerStatus(0, selfPlayer.game_player_status, _game_room_status);

            if( zhuangPlayer == selfPlayer )
            {
                this.PLAYERS[0].setZhuang(true);
            }

            if( selfPlayer.double_value != null )
            {
                this.PLAYERS[0].SET_DOUBLE_VALUE(selfPlayer.double_value);
            }

            ////////
            const current_around = clientSystem.getInstance().CURRENT_AROUND;
            const max_around = clientSystem.getInstance().MAX_AROUND;

            this.SET_AROUND(current_around, max_around);
        },
        setPlayer:function(player_data, pos)
        {
            if( player_data != null )
            {
                this.PLAYERS[pos].setPlayer(
                    {
                        nickname:player_data.nickname,
                        img_url:player_data.img_url,
                        player_key:player_data.key
                    }
                );

                this.PLAYERS[pos].POKECARD = this.POKECARD[pos];

                const SELF_PLAYER_DATA = clientSystem.getInstance().SELF_PLAYER;

            }
            else
            {
                this.PLAYERS[pos].leave();
            }
        },
        showPlayerResult:function()
        {
            const selfPlayer = clientSystem.getInstance().SELF_PLAYER;
            const Players = clientSystem.getInstance().OTHER_PLAYERS;

            for( var i in Players )
            {
                var player_data = Players[i];

                const pos = (player_data.index_in_room - selfPlayer.index_in_room + 8) % 8;

                this.PLAYERS[pos].SET_SCORE(player_data.score);
                this.PLAYERS[pos].SHOW_ADD_SCORE(player_data.add_score);
                this.PLAYERS[pos].SET_WIN_TYPE(player_data.win_type);
            }
        },
        setPlayerStatus:function(pos, status_player, status_room)
        {
            this.PLAYERS[pos].setPlayerStatus(status_player, status_room);

            if (status_player == ENUM_GAME_PLAYER_STATUS.EPS_NONE && status_room == ENUM_GAME_PLAYER_STATUS.EPS_NONE)
            {
                this.clearPlayersStatus();
                this.PLAYERS_POKECARD[pos].setVisible(false);
            }
            if(status_player == ENUM_GAME_PLAYER_STATUS.EPS_READY && status_room == ENUM_GAME_PLAYER_STATUS.EPS_READY)
            {
                //this.PLAYERS_POKECARD[pos].setVisible(true);
                //ready to send card to everyone
            }
            else if(status_player == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG && status_room == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG)
            {
                this.PLAYERS_POKECARD[pos].setVisible(true);
            }
            else if(status_player == ENUM_GAME_PLAYER_STATUS.EPS_DEALER )
            {
                this.PLAYERS_POKECARD[pos].setVisible(true);
            }
        },
        showPokeCard:function()
        {
            const _pokecard_data = clientSystem.getInstance().SELF_PLAYER.POKECARD_DATA;

            if( _pokecard_data )
            {
                for( var i in _pokecard_data )
                {
                    const _card_guid = _pokecard_data[i];
                    var _thisPoke = this.SELF_PLAYER_POKECARD.POKECARD[i]

                    try
                    {
                        _thisPoke.changeCard(_card_guid);
                        _thisPoke.setShow( i * 0.5);
                    }
                    catch (e)
                    {
                        cc.log("_thisPokeData: index:" + i.toString() + "  cardguid:" + _card_guid.toString() + "cardinfo:" + _thisPoke.toString());
                    }

                }
            }
        },
        initSelfPokeCard:function()
        {
            for( var i in this.SELF_PLAYER_POKECARD.POKECARD )
            {
                var _card = this.SELF_PLAYER_POKECARD.POKECARD[i];
                _card.resetPoke();

                ////////
                this.TEMP_DESCARD.push(_card);
                _card.setVisible(false);
            }
        },
        showOtherPokeCard:function()
        {
            const selfPlayer   = clientSystem.getInstance().SELF_PLAYER;
            const otherPlayers = clientSystem.getInstance().OTHER_PLAYERS;

            var _countIndex = 0.0;

            for( var i in otherPlayers )
            {
                var _player = otherPlayers[i];
                const _posindex = (_player.index_in_room - selfPlayer.index_in_room + 8) % 8;

                if( _posindex == 0 )
                {
                    continue;
                }

                const _pokecard_data = _player.POKECARD_DATA;

                if( _pokecard_data )
                {
                    for( var i in _pokecard_data )
                    {
                        const _card_guid = _pokecard_data[i];
                        var _thisPoke = this.PLAYERS_POKECARD[_posindex].POKECARD[i];

                        _thisPoke.changeCard(_card_guid);
                        _thisPoke.setShow(_countIndex);

                        _countIndex += 0.2;
                    }
                }
            }
        },
        initOtherPokeCard:function()
        {
            const selfPlayer   = clientSystem.getInstance().SELF_PLAYER;
            const otherPlayers = clientSystem.getInstance().OTHER_PLAYERS;

            for( var i in otherPlayers )
            {
                var _player = otherPlayers[i];
                const _posindex = (_player.index_in_room - selfPlayer.index_in_room + 8) % 8;

                if( _posindex == 0 )
                {
                    continue;
                }

                for( var i in this.PLAYERS_POKECARD[_posindex].POKECARD )
                {
                    var _card = this.PLAYERS_POKECARD[_posindex].POKECARD[i];
                    _card.resetPoke();

                    ////////
                    this.TEMP_DESCARD.push(_card);
                    _card.setVisible(false);
                }
            }
        },
        setUIHide:function()
        {
            this.BUTTON_READY.setVisible(false);
            this.BUTTON_CANCEL.setVisible(false);
            this.GAME_FIGHT_ZHUANG.setVisible(false);
            this.GAME_ADD_DOUBLE.setVisible(false);
            this.GAME_END_NODE.setVisible(false);
            this.setBanner(null);
            this.showZhuangChip(false, 0);
        },
        refreshUI:function()
        {
            ////
            this.setUIHide();
            var SELF = this;
            const player_data = clientSystem.getInstance().SELF_PLAYER;

            ////
            if( player_data.game_room_status != ENUM_GAME_PLAYER_STATUS.EPS_NONE )
            {
                this.BUTTON_WECHAT.setVisible(false);
                this.TIP.setVisible(false);
                this.INFO_NODE.setVisible(true);

                this.GAME_RUNNING = true;
            }

            ////
            if( this.GAME_RUNNING )
            {
                this.BACKGROUND_GAME.runAction(cc.FadeIn.create(5.0, 255));
            }

            if( player_data.game_room_status != ENUM_GAME_PLAYER_STATUS.EPS_NONE && player_data.game_room_status != ENUM_GAME_PLAYER_STATUS.EPS_READY )
            {
                const zhuangValue  = clientSystem.getInstance().ZHUANG_VALUE;
                const zhuangPlayer = clientSystem.getInstance().ZHUANG_PLAYER;

                if( zhuangPlayer != null )
                {
                    this.showZhuangChip(true, zhuangValue);
                }
            }

            ////
            if( player_data.game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_NONE )
            {
                switch(player_data.game_player_status)
                {
                    case ENUM_GAME_PLAYER_STATUS.EPS_NONE:
                    {
                        this.BUTTON_READY.setVisible(true);
                        break;
                    }
                    case ENUM_GAME_PLAYER_STATUS.EPS_READY:
                    {
                        if( !this.GAME_RUNNING )
                        {
                            this.BUTTON_CANCEL.setVisible(true);
                        }
                        break;
                    }
                }
            }
            else if(
                player_data.game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_READY &&
                player_data.game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_READY )
            {
                ////////
                this.resetSourceCard();

                this.BUTTON_READY.setVisible(false);
                this.BUTTON_CANCEL.setVisible(false);

                this.TEMP_SOURCECARD = [];
                this.TEMP_DESCARD = [];
                for( var i in this.SOURCECARD )
                {
                    this.TEMP_SOURCECARD.push(this.SOURCECARD[i]);
                }

                this.initSelfPokeCard();
                this.initOtherPokeCard();

                ////////
                const _lastTime = this.TEMP_DESCARD.length * 200 + 1000;
                for( var i in this.TEMP_DESCARD )
                {
                    var _card = this.TEMP_DESCARD[i];
                    var _sourceCard = this.TEMP_SOURCECARD.pop();

                    _sourceCard.anim_move( _card, i * 0.2 );
                }

                ////////
                var SELF = this;

                setTimeout(
                    function()
                    {
                        SELF.GAME_FIGHT_ZHUANG.setVisible(true);
                        SELF.setBanner("请选择抢庄的倍数");
                    },
                    _lastTime
                );
            }
            else if(
                player_data.game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG &&
                player_data.game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG
            )
            {
                this.showPokeCard();
                this.POKECARD.setCallbackAfterAnimCompleted(
                    function()
                    {
                        SELF.setBanner("请加注倍数");
                        SELF.GAME_ADD_DOUBLE.setVisible(true);
                    }
                );
            }
            else if(
                player_data.game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER &&
                player_data.game_player_status != ENUM_GAME_PLAYER_STATUS.EPS_END
            )
            {
                this.showPokeCard();
                this.showOtherPokeCard();

                this.POKECARD.setCallbackAfterAnimCompleted(
                    function()
                    {
                        SELF.GAME_END_NODE.setVisible(true);
                        SELF.showPlayerResult();
                    }
                );

            }
        },
        onChat:function(_player_id, _info)
        {
            console.log("CHAT: " + _player_id.toString() + ":" + _info.toString());

            const selfPlayer = clientSystem.getInstance().SELF_PLAYER;
            const otherPlayers = clientSystem.getInstance().OTHER_PLAYERS;

            if( selfPlayer.key == _player_id )
            {
                this.PANEL_CHAT.close();
                this.PANEL_CHAT.textField.string = "";
                this.CHAT_UI_ARRAY[0].setInfo(_info);
            }
            else
            {
                var player = null;

                for( var i in otherPlayers )
                {
                    if( otherPlayers[i].key == _player_id )
                    {
                        player = otherPlayers[i];
                    }
                }

                if( player )
                {
                    const _posindex = (player.index_in_room - selfPlayer.index_in_room + 8) % 8;
                    this.CHAT_UI_ARRAY[_posindex].setInfo(_info);
                }
            }

            ////////



        }
    }
);