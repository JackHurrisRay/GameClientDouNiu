/**
 * Created by Jack.L on 2017/4/13.
 */

var dialogApplicateLeave = cc.Sprite.extend(
    {
        BANNER_ARRAY:null,
        size:{width:SCREEN_SIZE.WIDTH, height:SCREEN_SIZE.HEIGHT},
        ctor:function()
        {
            this._super();
            this.initWithFile(res_common.COMMON_BACK);
            this.setPosition(this.size.width/2, this.size.height/2);

            var _frame_banner = cc.spriteFrameCache.getSpriteFrame("total_result_banner.png");

            var _title = cc.LabelTTF.create("申请退出房间", FONT_NAME.FONT_YOUYUAN, 72);
            _title.setPosition(this.size.width/2, this.size.height - 64);
            this.addChild(_title);

            ////////
            const _heightBase = 200;
            const _heightFlag = 120;

            const _banner_size =
                [
                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag * 2 },
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag * 2},

                    {x:this.size.width * 0.25 + 128, y:this.size.height - _heightBase - _heightFlag * 3},
                    {x:this.size.width * 0.75 - 128, y:this.size.height - _heightBase - _heightFlag * 3},
                ];

            var FRAME_PLAYER_ICON = cc.spriteFrameCache.getSpriteFrame("person_unknown.png");
            this.BANNER_ARRAY = [];

            for( var i in _banner_size )
            {
                const _sizedata = _banner_size[i];

                ////////
                var _sptBanner = cc.Sprite.createWithSpriteFrame(_frame_banner);
                _sptBanner.setScale(0.45);
                _sptBanner.setPosition(_sizedata.x, _sizedata.y);

                this.addChild(_sptBanner);

                ////////
                var PLAYER_ICON = cc.Sprite.createWithSpriteFrame(FRAME_PLAYER_ICON);
                PLAYER_ICON.setPosition(128,128);
                _sptBanner.addChild(PLAYER_ICON);
                _sptBanner.PLAYER_ICON = PLAYER_ICON;

                var PLAYER_NAME = cc.LabelTTF.create("无人",FONT_NAME.FONT_HEITI,64);
                PLAYER_NAME.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                PLAYER_NAME.setAnchorPoint(0.0, 1.0);
                PLAYER_NAME.setPosition(256.0 + 32.0, 256.0 - 32.0);
                PLAYER_NAME.setVisible(false);

                _sptBanner.addChild(PLAYER_NAME);

                var LEAVE_STATUS = cc.LabelTTF.create("等待...",FONT_NAME.FONT_HEITI,72);
                LEAVE_STATUS.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                LEAVE_STATUS.setAnchorPoint(0.0, 0.0);
                LEAVE_STATUS.setPosition(256.0 + 32.0, 32.0);
                LEAVE_STATUS.setVisible(false);

                _sptBanner.addChild(LEAVE_STATUS);

                ////////
                var PLAYER_INFO = {};
                PLAYER_INFO.LEAVE_STATUS = LEAVE_STATUS;
                PLAYER_INFO.PLAYER_NAME  = PLAYER_NAME;
                PLAYER_INFO.PLAYER_ICON  = PLAYER_ICON;
                PLAYER_INFO.ROOT          = _sptBanner;

                this.BANNER_ARRAY.push(PLAYER_INFO);

                ////////
                PLAYER_INFO.SET_LEAVE_STATUS =
                    function(leave_status)
                    {
                        ////////
                        switch(leave_status)
                        {
                            case 0:
                            {
                                //等待
                                this.LEAVE_STATUS.setString("等待...");
                                this.LEAVE_STATUS.setColor(cc.color(255,255,0));

                                break;
                            }
                            case 1:
                            {
                                //拒绝
                                this.LEAVE_STATUS.setString("同意");
                                this.LEAVE_STATUS.setColor(cc.color(0,255,0));

                                break;
                            }
                            case 2:
                            {
                                //同意
                                this.LEAVE_STATUS.setString("拒绝");
                                this.LEAVE_STATUS.setColor(cc.color(255,0,0));

                                break;
                            }
                        }

                    };

                ////////
                PLAYER_INFO.SET_PLAYER_DATA =
                    function(player_data)
                    {
                        ////////
                        this.PLAYER_NAME.setString(player_data.nickname);
                        this.PLAYER_NAME.setVisible(true);

                        ////////
                        this.LEAVE_STATUS.setVisible(true);

                        ////////
                        const _img_url  = player_data.img_url;
                        var   _sptObject = this.PLAYER_ICON;

                        var FUNC_IMG_LOADER =
                            function(err, img){
                                if(err) return;
                                cc.textureCache.addImage(_img_url);

                                var texture2d = new cc.Texture2D();
                                texture2d.initWithElement(img);
                                texture2d.handleLoadedTexture();
                                var sp = _sptObject;
                                sp.initWithTexture(texture2d);

                                const _flag_w = 220 / sp.getContentSize().width;
                                const _flag_h = 220 / sp.getContentSize().height;

                                sp.setScale(_flag_w, _flag_h);

                            };

                        cc.loader.loadImg(_img_url, {isCrossOrigin:true }, FUNC_IMG_LOADER);
                    };
            }

            ////////
            var _frame_button =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_agree.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_refuse.png")
                ];

            var _nodeButton = cc.Node.create();
            this.addChild(_nodeButton);
            this.NODE_BUTTON = _nodeButton;

            var CALLBACK_BUTTON =
                function(touch, event, _flag)
                {
                    ////////
                    clientSystem.getInstance().applicate_leave(_flag,
                        function()
                        {
                            _nodeButton.setVisible(false);
                        }
                    );
                };

            var _buttonAgree =
                new uiTouchSprite(
                    null,null,
                    CALLBACK_BUTTON,
                    null,
                    1
                );

            _buttonAgree.initWithSpriteFrame(_frame_button[0]);
            _buttonAgree.setPosition(this.size.width/2 - 180, 64.0);
            _nodeButton.addChild(_buttonAgree);

            var _buttonRefuse =
                new uiTouchSprite(
                    null,null,
                    CALLBACK_BUTTON,
                    null,
                    0
                );

            _buttonRefuse.initWithSpriteFrame(_frame_button[1]);
            _buttonRefuse.setPosition(this.size.width/2 + 180, 64.0);
            _nodeButton.addChild(_buttonRefuse);

            ////////
            var LEVAE_TIMER = new GameTimer();

            this.TIMER_LEAVE = cc.LabelTTF.create("0", FONT_NAME.FONT_YOUYUAN, 72);
            this.TIMER_LEAVE.setPosition(this.size.width - 64, this.size.height - 64);
            this.addChild(this.TIMER_LEAVE);

            this.TIMER_LEAVE.COUNT = 0;
            var _objTimerLeave = this.TIMER_LEAVE;

            this.TIMER_LEAVE.start =
                function(_value)
                {
                    this.COUNT = _value;
                    this.refresh();
                };

            this.TIMER_LEAVE.tick =
                function()
                {
                    if( this.COUNT > 0 )
                    {
                        this.COUNT -= 1;
                    }
                };

            this.TIMER_LEAVE.refresh =
                function()
                {
                    ////////
                    this.setString(this.COUNT.toString());

                };

            LEVAE_TIMER.init(1000,
                function()
                {
                    _objTimerLeave.tick();
                    _objTimerLeave.refresh();
                }
            );

            ////////
            this.show(false);
        },
        setLeaveStatus:function(player_id, flag)
        {
            for( var i in this.BANNER_ARRAY )
            {
                var _player_data = this.BANNER_ARRAY[i];
                if( _player_data.ID == player_id )
                {
                    _player_data.SET_LEAVE_STATUS(flag);
                    break;
                }
            }
        },
        setPlayerData:function(player_data, pos)
        {
            this.BANNER_ARRAY[pos].SET_PLAYER_DATA(player_data);
            this.BANNER_ARRAY[pos].ID = player_data.id;
        },
        refresh:function()
        {
            ////////
            var PLAYERS = clientSystem.getInstance().OTHER_PLAYERS;

            for( var i in PLAYERS )
            {
                var _player = PLAYERS[i];
                this.setPlayerData(_player, i);
            }
        },
        show:function(_isShow)
        {
            if( _isShow )
            {
                ////////
                this.refresh();

                ////////
                this.TIMER_LEAVE.start(90);
                this.setVisible(true);
            }
            else
            {
                this.close();
            }
        },
        close:function()
        {
            this.setVisible(false);
            this.NODE_BUTTON.setVisible(true);
        }
    }
);



