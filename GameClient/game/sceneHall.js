/**
 * Created by Jack.L on 2017/2/22 0022.
 */

var sceneHall = cc.Scene.extend(
    {
        ////
        ctor: function () {

            gameTimer.setTime(5000);

            ////
            this._super();

            ////
            const size = cc.director.getWinSize();

            var sptBackground = cc.Sprite.create(res_background.BG_MAIN);
            sptBackground.setPosition(size.width / 2, size.height / 2);
            this.addChild(sptBackground);

            this.BACKGROUND = sptBackground;

            ////////
            this.particleSystem = new cc.ParticleSystem(res_particles[0]);
            this.particleSystem.setPosition(SCREEN_SIZE.WIDTH / 2 + 64, SCREEN_SIZE.HEIGHT / 2 + 64);
            this.BACKGROUND.addChild(this.particleSystem);

            ////////
            cc.spriteFrameCache.addSpriteFrames(res_hall.HALL_PLIST, res_hall.HALL_PNG) ;

            ////////
            var _frame_hall_info = cc.spriteFrameCache.getSpriteFrame("hall_info.png");
            var _sptHallInfo = cc.Sprite.createWithSpriteFrame(_frame_hall_info);
            _sptHallInfo.setAnchorPoint(0.0, 0.0);
            _sptHallInfo.setPosition(16, 56);
            sptBackground.addChild(_sptHallInfo);

            var _sptNews = cc.Sprite.create(SOURCE_PATH + "news/hall_info_data.png");

            var _scrollNews = cc.ScrollView.create(cc.size(480, 530), _sptNews);
            _scrollNews.setAnchorPoint(0.0,0.0);
            _scrollNews.setPosition(0.0, 8.0);
            _scrollNews.setBounceable(true);
            _scrollNews.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);

            _scrollNews.setContentOffset(cc.p(0.0, -960 + 530));

            _sptHallInfo.addChild(_scrollNews);

            ////////
            var _framePlayerInfo = cc.spriteFrameCache.getSpriteFrame("main_player_info.png");
            var _sptPlayerInfo = cc.Sprite.createWithSpriteFrame(_framePlayerInfo);

            _sptPlayerInfo.setAnchorPoint(0.0,1.0);
            _sptPlayerInfo.setPosition(16, SCREEN_SIZE.HEIGHT-16);
            _sptPlayerInfo.setScale(0.5,0.5);
            sptBackground.addChild(_sptPlayerInfo);

            ////////////
            var shader = new cc.GLProgram.create(res_shader.VS_NORMAL, res_shader.PS_AROUND_RECT);
            shader.retain();

            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

            shader.link();
            shader.updateUniforms();

            loadImgFromUrl(_sptPlayerInfo, clientSystem.getInstance().SELF_PLAYER.img_url, {x:96,y:96},{w:180,h:180},0, shader);

            ////////
            var _sptDiamondInfo = cc.Sprite.createWithSpriteFrame(_framePlayerInfo);

            _sptDiamondInfo.setAnchorPoint(1.0,1.0);
            _sptDiamondInfo.setPosition(SCREEN_SIZE.WIDTH - 16, SCREEN_SIZE.HEIGHT-16);
            _sptDiamondInfo.setScale(0.5,0.5);
            sptBackground.addChild(_sptDiamondInfo);

            var _frame_icon =
                [
                    cc.spriteFrameCache.getSpriteFrame("icon_diamond.png"),
                    cc.spriteFrameCache.getSpriteFrame("icon_add.png"),
                    cc.spriteFrameCache.getSpriteFrame("icon_option.png")
                ];

            var _sptDiamond = cc.Sprite.createWithSpriteFrame(_frame_icon[0]);
            _sptDiamond.setScale(0.8, 0.8);
            _sptDiamond.setPosition(96, 98);
            _sptDiamondInfo.addChild(_sptDiamond);

            //////
            var _buttonAddDiamond =
                new uiTouchSprite(
                    null,null,
                    function(touch, event)
                    {
                        show_common_dialog("钻石充值","钻石充值请联系运营商，请关注微信公众号");
                    }
                );

            _buttonAddDiamond.initWithSpriteFrame(_frame_icon[1]);
            _buttonAddDiamond.setScale(0.75, 0.75);
            _buttonAddDiamond.setPosition(960 - 96, 98);
            _sptDiamondInfo.addChild(_buttonAddDiamond);

            //////
            var _buttonOption =
                new uiTouchSprite(
                    null,null,
                    function(touch, event)
                    {
                        show_option_dialog();
                    }
                );

            _buttonOption.initWithSpriteFrame(_frame_icon[2]);
            _buttonOption.setScale(0.75, 0.75);
            _buttonOption.setPosition(900 - 42, 98);
            _sptPlayerInfo.addChild(_buttonOption);

            //////
            var _frameVIP = cc.spriteFrameCache.getSpriteFrame("vip.png");
            var _vipLogo = cc.Sprite.createWithSpriteFrame(_frameVIP);
            _vipLogo.setAnchorPoint(0.0,0.0);
            _vipLogo.setPosition(32.0, -48.0);
            _sptPlayerInfo.addChild(_vipLogo);

            var _timeVIP = cc.LabelTTF.create("00:00:00", FONT_NAME.FONT_HEITI, 42);
            _timeVIP.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            _timeVIP.setAnchorPoint(0.0, 0.0);
            _timeVIP.setPosition(90.0,-6.0);
            _vipLogo.addChild(_timeVIP);

            const SELF = clientSystem.getInstance().SELF_PLAYER;
            var _VIP_TIME_FLAG = 0;

            if( SELF.VIP == ENUM_PLAYER_TYPE.EPT_DAY )
            {
                _VIP_TIME_FLAG = 3600 * 24;
            }
            else if( SELF.VIP == ENUM_PLAYER_TYPE.EPT_WEEK )
            {
                _VIP_TIME_FLAG = 3600 * 24 * 7;
            }
            else if( SELF.VIP == ENUM_PLAYER_TYPE.EPT_MONTH )
            {
                _VIP_TIME_FLAG = 3600 * 24 * 30;
            }

            var CALLBACK_VIP_TIMER =
                function()
                {
                    const _currentDate = new Date();
                    const _vipStartTime = new Date(SELF.VIP_START * 1000);
                    const _delayTime = _currentDate.getTime() - _vipStartTime.getTime();
                    const _value = Math.floor( _VIP_TIME_FLAG - _delayTime / 1000 );

                    if( _value <= 0 )
                    {
                        _vipLogo.setVisible(false);
                        return;
                    }

                    if( _value < 3600 * 24 )
                    {
                        const _h = Math.floor( _value / 3600 );
                        const _m = Math.floor( (_value - 3600 * _h) / 60 );
                        const _s = Math.floor( _value - 3600 * _h - 60 * _m );

                        var _mStr = _m<10?("0"+_m.toString()):_m.toString();
                        var _sStr = _s<10?("0"+_s.toString()):_s.toString();

                        _timeVIP.setString( _h.toString() + ":" + _mStr + ":" + _sStr );
                    }
                    else
                    {
                        const _day = Math.floor( _value / (3600 * 24) );

                        _timeVIP.setString(_day.toString() + "天");
                    }

                    setTimeout(CALLBACK_VIP_TIMER,
                    800);
                };

            if( _VIP_TIME_FLAG != 0 )
            {
                CALLBACK_VIP_TIMER();
            }

            if( SELF.IS_VIP )
            {
                _vipLogo.setVisible(true);
            }
            else
            {
                _vipLogo.setVisible(false);
            }

            ////
            this._label_wcid = cc.LabelTTF.create("WeChat", FONT_NAME.FONT_ARIAL, 56);
            this._label_wcid.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._label_wcid.setAnchorPoint(0.0, 0.5)
            this._label_wcid.setPosition( 192.0, 96.0 + 32.0);

            _sptPlayerInfo.addChild(this._label_wcid);

            this._label_gameid = cc.LabelTTF.create("ID:123456", FONT_NAME.FONT_ARIAL, 42);
            this._label_gameid.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._label_gameid.setAnchorPoint(0.0, 0.5)
            this._label_gameid.setPosition( 192.0, 96.0 - 42.0);
            this._label_gameid.setFontFillColor(cc.color.YELLOW);

            _sptPlayerInfo.addChild(this._label_gameid);

            ////
            this._label_diamond = cc.LabelTTF.create("10000", FONT_NAME.FONT_ARIAL, 72);

            this._label_diamond.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._label_diamond.setAnchorPoint(0.0, 0.5)
            this._label_diamond.setPosition( 192.0, 96.0);
            this._label_diamond.setFontFillColor(cc.color.YELLOW);

            _sptDiamondInfo.addChild(this._label_diamond);


            ////////
            //main button
            var _frameButton =
                [
                    cc.spriteFrameCache.getSpriteFrame("ui_main_button_1.png"),
                    cc.spriteFrameCache.getSpriteFrame("ui_main_button_2.png"),
                    cc.spriteFrameCache.getSpriteFrame("ui_main_button_3.png"),
                ];

            var _sptButton =
                [
                    new uiTouchSprite(
                        null,null,
                        function(touch, event)
                        {
                            var _trans = new cc.TransitionCrossFade(0.2,new sceneCreateRoom(0));
                            cc.director.runScene(_trans);
                        }
                    ),
                    new uiTouchSprite(
                        null,null,
                        function(touch, event)
                        {
                            var _trans = new cc.TransitionCrossFade(0.2,new sceneCreateRoom(1));
                            cc.director.runScene(_trans);
                        }
                    ),
                    new uiTouchSprite(
                        null,null,
                        function(touch, event)
                        {
                            var _trans = new cc.TransitionCrossFade(0.2,new sceneCreateRoom(2));
                            cc.director.runScene(_trans);
                        }
                    ),
                ];

            for( var j in  _sptButton )
            {
                i = 2 - j;

                _sptButton[i].initWithSpriteFrame(_frameButton[i]);

                _sptButton[i].setScale(0.5, 0.5);
                _sptButton[i].setAnchorPoint(1.0,0.0);
                _sptButton[i].setPosition(SCREEN_SIZE.WIDTH - 64, 64 + ( 16 + 160) * j);
                sptBackground.addChild(_sptButton[i]);
            }
        },
        onEnter:function()
        {
            var PLAYER_INFO = clientSystem.getInstance().SELF_PLAYER;
            this._label_wcid.setString(PLAYER_INFO.nickname.toString());
            this._label_gameid.setString("ID:" + PLAYER_INFO.player_key.toString())
            this._label_diamond.setString(PLAYER_INFO.gold);

            this.BACKGROUND.onEnter();

            optionSys.getInstance().setMusicForBackground(res_backgroundmusic.inhall);
        },
        onExit:function()
        {
            this.BACKGROUND.onExit();
        }
    }
);
