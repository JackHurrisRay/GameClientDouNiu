/**
 * Created by Jack on 2017/4/24.
 */

var commonDlgConfirm =
    cc.Layer.extend(
        {
            ////
            CALLBACK:null,
            ctor: function () {
                ////
                this._super();

                cc.spriteFrameCache.addSpriteFrames(res_room.ROOM_PLIST, res_room.ROOM_PNG);
                var _frameButton =
                    [
                        cc.spriteFrameCache.getSpriteFrame("button_confirm.png"),
                        cc.spriteFrameCache.getSpriteFrame("button_cancel.png")
                    ];

                var _sptButton =
                    [
                        cc.Sprite.createWithSpriteFrame(_frameButton[0]),
                        cc.Sprite.createWithSpriteFrame(_frameButton[1]),
                    ];

                _sptButton[0].setAnchorPoint(1.0, 0.5);
                _sptButton[1].setAnchorPoint(0.0, 0.5);

                _sptButton[0].setPosition(SCREEN_SIZE.WIDTH / 2 - 96, 240);
                _sptButton[1].setPosition(SCREEN_SIZE.WIDTH / 2 + 96, 240);

                _sptButton[0].setScale(0.6);
                _sptButton[1].setScale(0.6);

                var SELF = this;

                this.BACK_GROUND = new uiTouchSprite(
                    function(touch, event) {
                        const _pos = touch.getLocation();

                        var _locationInConfirm = _sptButton[0].convertToNodeSpace(_pos);
                        var _s = _sptButton[0].getContentSize();
                        var _rect = cc.rect(0, 0, _s.width, _s.height);

                        if (cc.rectContainsPoint(_rect, _locationInConfirm))
                        {
                            if( SELF.CALLBACK )
                            {
                                SELF.CALLBACK();
                                SELF.CALLBACK = null;
                            }

                            cc.log("touch confirm");
                            SELF.close();
                        }
                        else
                        {
                            var _locationInCancel = _sptButton[1].convertToNodeSpace(_pos);
                            var _s = _sptButton[1].getContentSize();
                            var _rect = cc.rect(0, 0, _s.width, _s.height);

                            if(cc.rectContainsPoint(_rect, _locationInCancel))
                            {
                                cc.log("touch cancel");
                                SELF.close();
                            }
                        }
                    }
                );

                this.size = cc.director.getWinSize();
                this.BACK_GROUND.initWithFile(res_common.COMMON_DIALOG);
                this.BACK_GROUND.setPosition(this.size.width / 2, this.size.height / 2);

                this.addChild(this.BACK_GROUND);
                this.BACK_GROUND.addChild(_sptButton[0]);
                this.BACK_GROUND.addChild(_sptButton[1]);

                ////
                this._label_title = cc.LabelTTF.create("标题内容", FONT_NAME.FONT_HEITI, 32);
                this._label_title.setPosition(666, SCREEN_SIZE.HEIGHT -  208);
                this.BACK_GROUND.addChild(this._label_title);

                this._label_info = cc.LabelTTF.create("这里为具体通知的内容，测试测试测试测试测试测试，嘿嘿，写长一点测试，再来几个字符串!!!", FONT_NAME.FONT_HEITI, 28);
                this._label_info.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                this._label_info.setDimensions(480, 320);
                this._label_info.setAnchorPoint(0.5, 1.0);
                this._label_info.setPosition(666, SCREEN_SIZE.HEIGHT - 256);
                this.BACK_GROUND.addChild(this._label_info);

                ////
                this.setVisible(false);
            },
            setEvent:function(callback)
            {
                this.CALLBACK = callback;
            },
            onEnter: function () {
                this.BACK_GROUND.onEnter();
            },
            onExit: function () {
                this.BACK_GROUND.onExit();
            },
            show: function () {
                UI_TOUCH_END_SWITCH = false;
                this.setVisible(true);
            },
            close: function () {
                this.setVisible(false);
                UI_TOUCH_END_SWITCH = true;

                if( !NetWorkSystem.isInit() )
                {
                    //跳转到登录页面
                    var _trans = new cc.TransitionCrossFade(0.2, new sceneLogin());
                    cc.director.runScene(_trans);
                }
            },
            setInfo:function(title, info)
            {
                ////
                this._label_title.setString(title);
                this._label_info.setString(info);
            }
        }
    );