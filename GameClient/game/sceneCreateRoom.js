/**
 * Created by Jack on 2017/3/25.
 */
var sceneCreateRoom = cc.Scene.extend({
    size:cc.director.getWinSize(),
    CREATE_ROOM_DATA:{_roomtype : 1, _roomaround : 0, _basescore : 1},
    ENTER_ROOM_DATA:{},
    ctor: function (index) {
        this._super();

        ////////
        var sptBackground = cc.Sprite.create(res_background.BG_MAIN_DLG);
        sptBackground.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(sptBackground);

        this.BACKGROUND = sptBackground;

        ////
        ////////
        cc.spriteFrameCache.addSpriteFrames(res_hall.HALL_DLG_PLIST, res_hall.HALL_DLG_PNG);

        ////////
        var _frameBack = cc.spriteFrameCache.getSpriteFrame("bgmaindlg_back.png");
        var _button_Back =
            new uiTouchSprite(
                null, null,
                function (touch, event) {

                    clientSystem.getInstance().get_player_data(
                        function()
                        {
                            var _trans = new cc.TransitionCrossFade(0.2, new sceneHall());
                            cc.director.runScene(_trans);
                        }
                    );
                }
            );

        _button_Back.initWithSpriteFrame(_frameBack);
        _button_Back.setScale(0.5);
        _button_Back.setAnchorPoint(1.0, 1.0);
        _button_Back.setPosition(SCREEN_SIZE.WIDTH - 16.0, SCREEN_SIZE.HEIGHT - 16.0);
        sptBackground.addChild(_button_Back);

        ////////
        this._partNode = cc.Node.create();
        this._partNode.setPosition(0.0, 0.0);
        sptBackground.addChild(this._partNode);

        ////enter room
        switch(index)
        {
            case 0:
            {
                this.room_enter(this._partNode);
                break;
            }
            case 1:
            {
                this.room_create(this._partNode);
                break;
            }
            case 2:
            {
                this.room_manage(this._partNode);
                break;
            }
        }
    },
    room_enter:function(_root)
    {
        ////////
        var _frame_back = cc.spriteFrameCache.getSpriteFrame("enter_room_back.png");
        var _dlg_back = cc.Sprite.createWithSpriteFrame(_frame_back);
        _dlg_back.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
        _root.addChild(_dlg_back);

        ////////
        const _buttonFrame =
            [
                "JACK_01.png","JACK_02.png","JACK_03.png","JACK_04.png","JACK_05.png",
                "JACK_06.png","JACK_07.png","JACK_08.png","JACK_09.png",
                "JACK_11.png","JACK_10.png","JACK_12.png",
            ];
        var _button_Number = {};

        var _numberNode = cc.Node.create();
        _numberNode.setPosition(this.size.width / 2 + 160 * 3 / 2 + 64, 160 * 4 - 160 / 2 + 32);
        _root.addChild( _numberNode );

        this._numberArray = [0,0,0,0,0,0];

        var callback_Number =
            function(touch, event)
            {
                ////
                var target = event.getCurrentTarget();
                var s = target.getTag();

                var SELF = target.ROOT;

                cc.log("******touch number:" + s.toString() + "******");

                switch(s)
                {
                    case 110:
                    {
                        if( SELF.ROOM_NUMBER_INDEX > 0 )
                        {
                            SELF.ROOM_NUMBER_INDEX -= 1;

                            SELF._numberArray[SELF.ROOM_NUMBER_INDEX] = 0;
                            SELF._label_Number[SELF.ROOM_NUMBER_INDEX].setString("");
                        }

                        break;
                    }
                    case 112:
                    {
                        /*
                        if( SELF.ROOM_NUMBER_INDEX == 6 )
                        {
                            clientSystem.getInstance().enter_room(SELF._ROOM_NUMBER_VALUE,
                                function()
                                {
                                    var _trans = new cc.TransitionCrossFade(1.0, new sceneRoom());
                                    cc.director.runScene(_trans);
                                }
                            );
                        }
                        else
                        {
                            show_common_dialog("房间号格式错误","请确保您输入的房间号准确无误");
                        }
                        */

                        for( var i in SELF._numberArray )
                        {
                            SELF._numberArray[i] = 0;
                            var _label = SELF._label_Number[i];
                            _label.setString("");
                        }

                        SELF.ROOM_NUMBER_INDEX = 0;

                        break;
                    }
                    default:
                    {
                        if( SELF.ROOM_NUMBER_INDEX < 6 )
                        {
                            SELF._numberArray[SELF.ROOM_NUMBER_INDEX] = s;
                            SELF._label_Number[SELF.ROOM_NUMBER_INDEX].setString(s.toString());

                            SELF.ROOM_NUMBER_INDEX += 1;
                        }

                        if( SELF.ROOM_NUMBER_INDEX == 6 )
                        {
                            ////
                            var _number =
                                SELF._numberArray[0].toString() +
                                SELF._numberArray[1].toString() +
                                SELF._numberArray[2].toString() +
                                SELF._numberArray[3].toString() +
                                SELF._numberArray[4].toString() +
                                SELF._numberArray[5].toString();

                            SELF._ROOM_NUMBER_VALUE = parseInt(_number);

                            ////
                            clientSystem.getInstance().enter_room(SELF._ROOM_NUMBER_VALUE,
                                function()
                                {
                                    var _trans = new cc.TransitionCrossFade(1.0, new sceneRoom());
                                    cc.director.runScene(_trans);
                                }
                            );

                        }

                        break;
                    }
                }

            };

        for( var i in _buttonFrame )
        {
            _button_Number[i] =
                new uiTouchSprite(
                    null,null,
                    callback_Number
                );

            _button_Number[i].ROOT = this;

            var _tagValue = parseInt( i ) + 1;

            if( _tagValue == 11 )
            {
                _tagValue = 0;
            }
            else if( _tagValue > 9 )
            {
                _tagValue += 100;
            }

            _button_Number[i].setTag(_tagValue);

            const _indexX = i % 3;
            const _indexY = Math.floor(i / 3);

            _button_Number[i].initWithSpriteFrame(_buttonFrame[i]);
            _button_Number[i].setPosition( _indexX * 160 - 160, -_indexY * 160);
            _numberNode.addChild( _button_Number[i] );
        }

        ////
        this._label_Number =
            [
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
                cc.LabelTTF.create("0",FONT_NAME.FONT_ARIAL,48),
            ];

        for( var i in this._label_Number )
        {
            var _label = this._label_Number[i];

            _label.setPosition(240 + 80 * i - 4, SCREEN_SIZE.HEIGHT - 290);
            _root.addChild(_label);

            _label.setString("");
        }

        this.ROOM_NUMBER_INDEX = 0;

    },
    room_create:function(_root)
    {
        ////////
        var _frame_back = cc.spriteFrameCache.getSpriteFrame("create_room_back.png");
        var _dlg_back = cc.Sprite.createWithSpriteFrame(_frame_back);
        _dlg_back.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
        _root.addChild(_dlg_back);

        var _frame_title = cc.spriteFrameCache.getSpriteFrame("create_room_title.png");
        var _spt_title = cc.Sprite.createWithSpriteFrame(_frame_title);
        _spt_title.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT - 112);
        _dlg_back.addChild(_spt_title);

        ////
        var _frameCreateRoom = cc.spriteFrameCache.getSpriteFrame("button_create_room.png");
        var _button_CreateRoom =
            new uiTouchSprite(
                null, null,
                function (touch, event, target) {
                    clientSystem.getInstance().create_room(
                        target.CREATE_ROOM_DATA._roomtype,
                        target.CREATE_ROOM_DATA._roomaround ,
                        target.CREATE_ROOM_DATA._basescore,
                        "0");
                },
                null,
                this
            );

        ////
        _button_CreateRoom.initWithSpriteFrame(_frameCreateRoom);
        _button_CreateRoom.setScale(0.5);
        _button_CreateRoom.setAnchorPoint(0.5, 0.0);
        _button_CreateRoom.setPosition(this.size.width/2, 64);
        _root.addChild(_button_CreateRoom);

        ////
        //轮庄，抢庄
        var callback_roomtype =
            function(TARGET, tag)
            {
                TARGET.CREATE_ROOM_DATA._roomtype = tag;
            };

        var _checkBox_RoomType =
            [
                //new _CHECK_BOX("轮庄", 1, this, callback_roomtype),
                new UI_CHECK_BOX("抢庄", 2, this, callback_roomtype),
                //new _CHECK_BOX("无庄", 3, this, callback_roomtype),
            ];

        for( var i in _checkBox_RoomType )
        {
            _checkBox_RoomType[i].setScale(0.6);
            _checkBox_RoomType[i].setPosition(256.0 + 160.0 * i, SCREEN_SIZE.HEIGHT - 256);
            _root.addChild( _checkBox_RoomType[i] );

            _checkBox_RoomType[i].setMutex(_checkBox_RoomType);
        }

        _checkBox_RoomType[0].CHECK_BOX.setSelected(true);

        //局数选择
        var callback_roomaround =
            function(TARGET, tag)
            {
                TARGET.CREATE_ROOM_DATA._roomaround = tag * 1.0;
            };

        var _GAME_CONFIG = clientSystem.getInstance().GAME_CONFIG.DATA;
        var _checkBox_RoundType = [];

        for( var i in _GAME_CONFIG.MAX_AROUND )
        {
            var _MA_DATA = _GAME_CONFIG.MAX_AROUND[i];
            var _checkBox = new UI_CHECK_BOX(_MA_DATA.COUNT.toString() + "局(" + _MA_DATA.GOLD.toString() + "钻石)", i, this, callback_roomaround);

            _checkBox.setScale(0.6);
            _checkBox.setPosition(256.0 + 256.0 * i, SCREEN_SIZE.HEIGHT - 256 - 96);
            _root.addChild( _checkBox );

            _checkBox_RoundType.push(_checkBox);
        }

        for( var i in _checkBox_RoundType )
        {
            _checkBox_RoundType[i].setMutex(_checkBox_RoundType);
        }

        _checkBox_RoundType[0].CHECK_BOX.setSelected(true);

        ////////
        //底分
        var callback_baseScore =
            function(TARGET, tag)
            {
                TARGET.CREATE_ROOM_DATA._basescore = tag * 1.0;
            };

        var _checkBox_baseScore = [];
        const baseScoreArray = [1,3,5,10,20];

        for( var i in baseScoreArray )
        {
            var _scoreData = baseScoreArray[i];
            var _checkBox = new UI_CHECK_BOX("底分x" + _scoreData.toString(), _scoreData, this, callback_baseScore);

            _checkBox.setScale(0.6);
            _checkBox.setPosition(256.0 + 180.0 * i, SCREEN_SIZE.HEIGHT - 256 - 96 - 96);
            _root.addChild( _checkBox );

            _checkBox_baseScore.push(_checkBox);
        }

        for( var i in _checkBox_baseScore )
        {
            _checkBox_baseScore[i].setMutex(_checkBox_baseScore);
        }

        _checkBox_baseScore[0].CHECK_BOX.setSelected(true);

        ////////
        //vip
        const config_data = clientSystem.getInstance().GAME_CONFIG;
        const config_vip  = config_data.DATA.VIP_TYPE;

        const _VIP_INFO =
            [
                "24小时(" + config_vip[0].GOLD.toString() + "钻石)",
                "周卡(" + config_vip[1].GOLD.toString() + "钻石)",
                "月卡(" + config_vip[2].GOLD.toString() + "钻石)"
            ];

        var CALLBACK_PAYVIP =
            function(touch, event, target)
            {
                const _pay_index = target;
                const PAY_INFO =
                    [
                        {value:ENUM_PLAYER_TYPE.EPT_DAY,   info:"您确定要耗费"+config_vip[0].GOLD.toString()+"钻石成为24小时VIP客户吗？"},
                        {value:ENUM_PLAYER_TYPE.EPT_WEEK,  info:"您确定要耗费"+config_vip[1].GOLD.toString()+"钻石成为包周的VIP客户吗？"},
                        {value:ENUM_PLAYER_TYPE.EPT_MONTH, info:"您确定要耗费"+config_vip[2].GOLD.toString()+"钻石成为包月的VIP客户吗？"},
                    ];

                const _pay_info = PAY_INFO[_pay_index];
                var callback =
                    function()
                    {
                        clientSystem.getInstance().pay_vip(_pay_info.value, null);
                    };

                show_confirm_dialog("购买VIP贵宾卡",_pay_info.info, callback);
            };


        var _frameVIP = cc.spriteFrameCache.getSpriteFrame("VIP_CARD.png");
        var _frameVIPWord = cc.spriteFrameCache.getSpriteFrame("VIP_WORD.png");
        var _button_VIP =
            [
                new uiTouchSprite(
                    null, null,
                    CALLBACK_PAYVIP,null,
                    0//ENUM_PLAYER_TYPE.EPT_DAY
                ),
                new uiTouchSprite(
                    null, null,
                    CALLBACK_PAYVIP,null,
                    1//ENUM_PLAYER_TYPE.EPT_MONTH
                ),
                new uiTouchSprite(
                    null, null,
                    CALLBACK_PAYVIP,null,
                    2//ENUM_PLAYER_TYPE.EPT_WEEK
                )
            ];

        const _VIP_COLOR =
            [
                cc.color(180,225,120),
                cc.color(255,255,120),
                cc.color(255,100,120),
            ];

        for( var i in _button_VIP )
        {
            var _button = _button_VIP[i];

            _button.initWithSpriteFrame(_frameVIP);
            _button.setScale(0.375);
            _button.setPosition(256 * i - 256 + this.size.width/2, 200);
            _root.addChild( _button);

            ////
            var _word = cc.Sprite.createWithSpriteFrame(_frameVIPWord);
            _word.setAnchorPoint(0.0,0.0);
            _button.addChild(_word);

            _button.setColor(_VIP_COLOR[i]);

            ////
            var _label_vipInfo = cc.LabelTTF.create(_VIP_INFO[i], FONT_NAME.FONT_YOUYUAN, 64);
            _label_vipInfo.setPosition(256, -32);
            _button.addChild(_label_vipInfo);
        }






    },
    room_manage:function(_root)
    {
        ////////
        var _frame_back = cc.spriteFrameCache.getSpriteFrame("create_room_back.png");
        var _dlg_back = cc.Sprite.createWithSpriteFrame(_frame_back);
        _dlg_back.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
        _root.addChild(_dlg_back);

        var _frame_title = cc.spriteFrameCache.getSpriteFrame("manage_room_title.png");
        var _spt_title = cc.Sprite.createWithSpriteFrame(_frame_title);
        _spt_title.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT - 112);
        _dlg_back.addChild(_spt_title);

        ////
        var CELL_LIST_MANAGE_ROOM =
            cc.Sprite.extend(
                {
                    ROOM_DATA:null,
                    ctor:function(_room_data)
                    {
                        this.ROOM_DATA = extendDeep( _room_data );
                        this.ROOM_UID    = this.ROOM_DATA.id;
                        this.ROOM_RAND_KEY = this.ROOM_DATA.rand_key;
                        this.ROOM_PLAYER_COUNT = this.ROOM_DATA.player_count;
                        this.ROOM_BASESCORE = this.ROOM_DATA.basescore;
                        this.ROOM_MAX_AROUND = this.ROOM_DATA.room_max_around;

                        ////
                        this._super();

                        ////
                        var _frame_Back = cc.spriteFrameCache.getSpriteFrame("room_manage_cell.png");
                        this.initWithSpriteFrame(_frame_Back);
                        this.setAnchorPoint(0.0, 0.0);

                        var _label_RoomRandID = cc.LabelTTF.create("ID:" + this.ROOM_DATA.rand_key.toString(), FONT_NAME.FONT_ARIAL, 42);
                        _label_RoomRandID.setAnchorPoint(0.0, 1.0);
                        _label_RoomRandID.setPosition(172, 190 - 24);
                        _label_RoomRandID.setColor(cc.color(255, 255, 0));
                        this.addChild( _label_RoomRandID );

                        ////
                        var _label_PlayerCount = cc.LabelTTF.create(this.ROOM_PLAYER_COUNT.toString() + "/8", FONT_NAME.FONT_ARIAL, 42);
                        _label_PlayerCount.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                        _label_PlayerCount.setAnchorPoint(0.0, 0.0);
                        _label_PlayerCount.setPosition(240, 180 - 132);
                        this.addChild(_label_PlayerCount);

                        ////
                        var _label_baseScore = cc.LabelTTF.create(this.ROOM_BASESCORE.toString(), FONT_NAME.FONT_ARIAL, 42);
                        _label_baseScore.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                        _label_baseScore.setAnchorPoint(0.0, 0.0);
                        _label_baseScore.setPosition(240 + 150, 180 - 132);
                        this.addChild(_label_baseScore);

                        ////
                        var _label_maxaround = cc.LabelTTF.create(this.ROOM_MAX_AROUND.toString(), FONT_NAME.FONT_ARIAL, 42);
                        _label_maxaround.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                        _label_maxaround.setAnchorPoint(0.0, 0.0);
                        _label_maxaround.setPosition(240 + 300, 180 - 132);
                        this.addChild(_label_maxaround);

                        ////
                        var _frame_button =
                            [
                                cc.spriteFrameCache.getSpriteFrame("room_manage_cell_button_enter.png"),
                                //cc.spriteFrameCache.getSpriteFrame("room_manage_cell_button_invite.png"),
                                cc.spriteFrameCache.getSpriteFrame("room_manage_cell_button_delete.png")
                            ];

                        var _callback_func =
                            [
                                function (touch, event, target) {
                                    ////
                                    const _room_rand_key = target.ROOM_RAND_KEY;
                                    clientSystem.getInstance().enter_room(_room_rand_key,
                                        function()
                                        {
                                            var _trans = new cc.TransitionCrossFade(1.0, new sceneRoom());
                                            cc.director.runScene(_trans);
                                        }
                                    );
                                },
                                /*
                                function (touch, event, target) {
                                    ////
                                    cc.log('press share app');
                                },
                                */
                                function (touch, event, target) {

                                    ////
                                    const _room_id = target.ROOM_UID;
                                    const _room_randkey = target.ROOM_RAND_KEY;

                                    var CALLBACK_DELETE =
                                        function()
                                        {
                                            clientSystem.getInstance().delete_room_by_owner(_room_id,
                                                function()
                                                {
                                                    var _trans = new cc.TransitionCrossFade(0.2,new sceneCreateRoom(2));
                                                    cc.director.runScene(_trans);
                                                }
                                            );
                                        };

                                    show_confirm_dialog("删除房间","您确认要删除"+_room_randkey.toString()+"号房间吗？",CALLBACK_DELETE);

                                },
                            ];

                        for( var i in _frame_button )
                        {
                            var _button =
                                new uiTouchSprite(
                                    null, null,
                                    _callback_func[i],
                                    null,
                                    this
                                );

                            _button._listener.swallowTouches = false;
                            _button.initWithSpriteFrame(_frame_button[i]);

                            _button.setScale(0.625);
                            _button.setPosition(873 - 112 * (1-i), 90);

                            this.addChild(_button);
                        }


                    }
                }
            );

        var _container = cc.Layer.create();
        var _scrollView = cc.ScrollView.create(cc.size(960,180*3), _container);
        _scrollView.setAnchorPoint(0.5,0.0);
        _scrollView.setPosition((this.size.width - 960)/2, 36.0);
        _scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        _scrollView.setBounceable(true);

        _dlg_back.addChild(_scrollView);

        ////
        this.ROOM_LIST_SCROLLVIEW = _scrollView;

        ////
        clientSystem.getInstance().request_room_list(
            function(target, data)
            {
                const arraycount = data.length;

                var _scrollView = target.ROOM_LIST_SCROLLVIEW;
                _scrollView.setContentSize(960, 180 * arraycount);

                for( var i in data )
                {
                    var _cell = new CELL_LIST_MANAGE_ROOM(data[i]);
                    _cell.setPosition(0,180 * i);
                    _container.addChild(_cell);
                }

                _scrollView.setContentOffset(cc.p(0.0, -180 * (arraycount - 3)),false);
            },
            this
        );

    }

});