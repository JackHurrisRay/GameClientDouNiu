/**
 * Created by Jack on 2017/3/28.
 */

var roomPlayer = cc.Sprite.extend(
    {
        ctor:function()
        {
            this._super();
            var _frameBack = cc.spriteFrameCache.getSpriteFrame("player_in_room.png");
            this.retain();
            this.initWithSpriteFrame(_frameBack);
            this.size = this.getContentSize();

            this.FRAME_PLAYER_ICON = cc.spriteFrameCache.getSpriteFrame("person_unknown.png");

            this.PLAYER_ICON = cc.Sprite.createWithSpriteFrame(this.FRAME_PLAYER_ICON);
            this.PLAYER_ICON.setScale(0.8);
            this.PLAYER_ICON.setPosition(128, 128);

            this.addChild(this.PLAYER_ICON);

            ////////
            var _frame_score_back = cc.spriteFrameCache.getSpriteFrame("score_back.png");
            var _sptScoreBack = cc.Sprite.createWithSpriteFrame(_frame_score_back);
            _sptScoreBack.setAnchorPoint(0.0, 1.0);
            _sptScoreBack.setPosition(0.0, 8.0);
            this.addChild(_sptScoreBack);

            var _label_Score = cc.LabelTTF.create("0", FONT_NAME.FONT_HEITI, 48);
            _label_Score.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            _label_Score.setAnchorPoint(0.0, 0.5);
            _label_Score.setPosition(64, 32);
            _sptScoreBack.addChild(_label_Score);

            this.SET_SCORE =
                function(_score)
                {
                    if( _score != null && typeof(_score) == 'number')
                    {
                        if( _score > 0 )
                        {
                            _label_Score.setColor(cc.color(255,255,150));
                        }
                        else if( _score < 0 )
                        {
                            _label_Score.setColor(cc.color(255,120,80));
                        }

                        _label_Score.setString(_score.toString());
                    }
                };

            ////////
            this.PLAYER_NAME = cc.LabelTTF.create("无人",FONT_NAME.FONT_HEITI,48);
            this.PLAYER_NAME.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.PLAYER_NAME.setAnchorPoint(0.0, 1.0);
            this.PLAYER_NAME.setPosition(12.0, -4.0);
            this.PLAYER_NAME.setVisible(false);

            _sptScoreBack.addChild(this.PLAYER_NAME);

            ////////
            this.PLAYER_STATUS = cc.LabelTTF.create("正在准备...", FONT_NAME.FONT_HEITI, 36);
            this.PLAYER_STATUS.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.PLAYER_STATUS.setAnchorPoint(0.5, 0.0);
            this.PLAYER_STATUS.setPosition( this.size.width/2, 36.0 );

            var _frameStatus = cc.spriteFrameCache.getSpriteFrame("status_back.png");
            var _backStatus = cc.Sprite.createWithSpriteFrame(_frameStatus);
            _backStatus.setAnchorPoint(0.5, 0.0);
            _backStatus.setPosition(this.size.width/2, 36.0);
            this.addChild( _backStatus );

            this.addChild(this.PLAYER_STATUS);

            var action =
                [
                    cc.FadeTo.create(0.8, 255),
                    cc.FadeTo.create(1.2, 80)
                ];

            var _action = cc.Sequence.create(action[0], action[1]);
            var frameAction = cc.RepeatForever.create(_action);
            this.PLAYER_STATUS.runAction(frameAction);

            this.setPlayerStatus(-1,-1);

            ////////
            var _frame_zhuang = cc.spriteFrameCache.getSpriteFrame("icon_zhuang.png");
            this.ICON_ZHUANG = cc.Sprite.createWithSpriteFrame(_frame_zhuang);
            this.ICON_ZHUANG.setAnchorPoint(0.0, 0.0);
            this.addChild(this.ICON_ZHUANG);
            this.ICON_ZHUANG.setVisible(false);

            ////////
            var _frame_double = cc.spriteFrameCache.getSpriteFrame("chip_1.png");
            this.ICON_DOUBLE = cc.Sprite.createWithSpriteFrame(_frame_double);
            this.ICON_DOUBLE.setAnchorPoint(0.0, 0.0);
            this.ICON_DOUBLE.setScale(0.5);
            this.addChild(this.ICON_DOUBLE);

            var _label_double = cc.LabelTTF.create("40",FONT_NAME.FONT_THONBURI,72);
            _label_double.setPosition(128,128);
            _label_double.setColor(cc.color(0,0,0));
            this.ICON_DOUBLE.addChild(_label_double);

            this.SET_DOUBLE_VALUE = function(_double_value)
            {
                if( _double_value == null || _double_value < 0 )
                {
                    this.ICON_DOUBLE.setVisible(false);
                }
                else
                {
                    this.ICON_DOUBLE.setVisible(true);

                    var _value = "";

                    if( _double_value == 0 )
                    {
                        _value = "无";
                    }
                    else if( _double_value > 0 )
                    {
                        _value = _double_value.toString();
                    }

                    _label_double.setString(_value);
                }
            };

            this.SET_DOUBLE_VALUE(null);

            ////////
            var _effectWin = new cc.ParticleSystem(res_particles[1]);
            _effectWin.setPosition(128.0, 212.0);
            this.addChild(_effectWin);

            var _frame_wintype = [];

            for( var i=ENUM_WIN_CARD_TYPE.EWCT_NONE; i<ENUM_WIN_CARD_TYPE.EWCT_COUNT; i++ )
            {
                const _file_name = "douniuwintype_" + i.toString() + ".png";
                var _frameTemp = cc.spriteFrameCache.getSpriteFrame(_file_name);

                _frame_wintype.push(_frameTemp);
            }

            var _sptWinType = cc.Sprite.createWithSpriteFrame(_frame_wintype[0]);
            _sptWinType.setAnchorPoint(0.0, 1.0);
            _sptWinType.setPosition(4, 256);
            this.addChild(_sptWinType);

            this.SET_WIN_TYPE =
                function(_wintype)
                {
                    if( _wintype != null && _wintype >= ENUM_WIN_CARD_TYPE.EWCT_NONE && _wintype < ENUM_WIN_CARD_TYPE.EWCT_COUNT )
                    {
                        _sptWinType.initWithSpriteFrame(_frame_wintype[_wintype]);
                        _sptWinType.setAnchorPoint(0.0, 1.0);
                        _sptWinType.setVisible(true);
                    }
                    else
                    {
                        _sptWinType.setVisible(false);
                    }
                };

            this.SET_WIN_TYPE(null);

            ////////
            //var _label_add_score = cc.LabelTTF.create("1000",FONT_NAME.FONT_APPLEGOTHIC, 72);
            var _label_add_score = cc.LabelBMFont.create("+1000", BM_FONT.winscore.FNT);
            var _label_red_score = cc.LabelBMFont.create("-1000", BM_FONT.failedscore.FNT);

            _label_add_score.setAnchorPoint(0.5, 0.0);
            _label_add_score.setPosition(128.0, 64.0);
            this.addChild(_label_add_score);

            _label_red_score.setAnchorPoint(0.5, 0.0);
            _label_red_score.setPosition(128.0, 64.0);
            this.addChild(_label_red_score);

            this.SHOW_ADD_SCORE =
                function(_add_score)
                {
                    var action =
                        [
                            cc.scaleTo(0.6, 1.2, 1.2),
                            cc.scaleTo(0.6, 1.0, 1.0)
                        ];

                    var _action = cc.Sequence.create(action[0], action[1]);
                    var frameAction = cc.RepeatForever.create(_action);

                    ////
                    if( _add_score == null )
                    {
                        _label_add_score.setVisible(false);
                        _label_red_score.setVisible(false);

                        _effectWin.stopSystem();
                    }
                    else
                    {
                        if( _add_score > 0 )
                        {
                            _label_add_score.setString("+" + _add_score.toString());
                            _label_add_score.setVisible(true);

                            _label_add_score.runAction(frameAction);

                            _effectWin.resetSystem();
                        }
                        else if( _add_score == 0 )
                        {
                            _label_red_score.setVisible(true);
                            _label_red_score.setString(_add_score.toString());

                            _label_red_score.runAction(frameAction);
                        }
                        else if( _add_score < 0 )
                        {
                            _label_red_score.setVisible(true);
                            _label_red_score.setString(_add_score.toString());

                            _label_red_score.runAction(frameAction);
                        }
                    }
                };

            this.SHOW_ADD_SCORE(null);

        },
        setPlayer:function(player_data)
        {
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

            var _player_name = player_data.nickname;
            var _cutCheck    = chkstrlen(_player_name, 8);

            if( _cutCheck.cut != 0 )
            {
                _player_name = _player_name.substr(0, _cutCheck.cut);
                _player_name += "...";
            }

            this.PLAYER_NAME.setString(_player_name);
            this.PLAYER_NAME.setVisible(true);

            this.PLAYER_KEY = player_data.player_key;

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
        },
        setPlayerStatus:function(game_player_status, game_room_status)
        {
            const _status_info =
            {
                "nobody":{"text":"目前无人","color":cc.color(255,255,255)},

                "wait_ready":{"text":"正在准备...","color":cc.color(255,255,100)},
                "ready":{"text":"已准备好","color":cc.color(100,255,100)},
                "wait_zhuang":{"text":"正在抢庄...","color":cc.color(255,200,100)},
                "zhuang":{"text":"已抢庄","color":cc.color(100,255,100)},
                "wait_double":{"text":"正在加注...","color":cc.color(255,200,150)},
                "double":{"text":"已加注","color":cc.color(100,255,100)},

                "result":{"text":"开牌","color":cc.color(100,255,100)},
                "wait_end":{"text":"等待其他玩家","color":cc.color(100,255,100)}

            };

            var _current_info = _status_info["nobody"];

            if( game_player_status != -1 && game_room_status != -1 ) {
                if (game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_NONE && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_NONE)
                {
                    _current_info = _status_info.wait_ready;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_READY && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_NONE)
                {
                    _current_info = _status_info.ready;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_READY && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_READY)
                {
                    _current_info = _status_info.wait_zhuang;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_READY)
                {
                    _current_info = _status_info.zhuang;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG)
                {
                    ////
                    _current_info = _status_info.wait_double;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_FIGHT_FOR_ZHUANG )
                {
                    _current_info = _status_info.double;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER )
                {
                    _current_info = _status_info.result;
                }
                else if(game_player_status == ENUM_GAME_PLAYER_STATUS.EPS_END && game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_DEALER)
                {
                    _current_info = _status_info.wait_end;
                }
            }

            this.PLAYER_STATUS.setString(_current_info.text);
            this.PLAYER_STATUS.setColor(_current_info.color);

        },
        leave:function()
        {
            ////
            this.PLAYER_ICON.initWithSpriteFrame(this.FRAME_PLAYER_ICON);
            this.PLAYER_ICON.setScale(0.8);

            this.PLAYER_NAME.setString("无人");
            this.PLAYER_NAME.setVisible(false);

            ////
            this.setPlayerStatus(null, null);

        },
        offline:function()
        {
            ////

        },
        setZhuang:function( _set )
        {
            this.ICON_ZHUANG.setVisible(_set);
        }
    }
);