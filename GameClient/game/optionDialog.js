/**
 * Created by Jack on 2017/4/28.
 */

var optionDialog =
    cc.Layer.extend(
        {
            ////
            ctor: function () {
                ////
                this._super();

                cc.spriteFrameCache.addSpriteFrames(res_room.ROOM_PLIST, res_room.ROOM_PNG);
                var _frameButton = cc.spriteFrameCache.getSpriteFrame("button_confirm.png");
                var _sptButton = cc.Sprite.createWithSpriteFrame(_frameButton);

                _sptButton.setPosition(SCREEN_SIZE.WIDTH / 2, 240);
                _sptButton.setScale(0.6);

                var SELF = this;

                this.BACK_GROUND = new uiTouchSprite(
                    function(touch, event) {
                        const _pos = touch.getLocation();

                        var _locationInConfirm = _sptButton.convertToNodeSpace(_pos);
                        var _s = _sptButton.getContentSize();
                        var _rect = cc.rect(0, 0, _s.width, _s.height);

                        if (cc.rectContainsPoint(_rect, _locationInConfirm))
                        {
                            cc.log("touch confirm");
                            SELF.close();
                        }
                    }
                );

                this.size = cc.director.getWinSize();
                this.BACK_GROUND.initWithFile(res_common.COMMON_DIALOG);
                this.BACK_GROUND.setPosition(this.size.width / 2, this.size.height / 2);

                this.addChild(this.BACK_GROUND);
                this.BACK_GROUND.addChild(_sptButton);

                ////
                this._label_title = cc.LabelTTF.create("设置", FONT_NAME.FONT_HEITI, 32);
                this._label_title.setPosition(666, SCREEN_SIZE.HEIGHT -  208);
                this.BACK_GROUND.addChild(this._label_title);

                ////
                this.CHECKBOX_MUSIC = new UI_CHECK_BOX("背景音乐", 0, this, null);
                this.CHECKBOX_MUSIC.CHECKBOXLIST = false;
                this.CHECKBOX_MUSIC.setScale(0.6);
                this.CHECKBOX_MUSIC.setPosition(390, 750 - 320);
                this.BACK_GROUND.addChild( this.CHECKBOX_MUSIC );

                this.CHECKBOX_MUSIC.CALLBACK_SINGLE =
                    function(_switch)
                    {
                        optionSys.getInstance().switchMusic(!_switch);
                    };

                ////
                this.CHECKBOX_SOUND = new UI_CHECK_BOX("音效", 0, this, null);
                this.CHECKBOX_SOUND.CHECKBOXLIST = false;
                this.CHECKBOX_SOUND.setScale(0.6);
                this.CHECKBOX_SOUND.setPosition(390 + 240, 750 - 320);
                this.BACK_GROUND.addChild( this.CHECKBOX_SOUND );

                this.CHECKBOX_SOUND.CALLBACK_SINGLE =
                    function(_switch)
                    {
                        optionSys.getInstance().switchSound(!_switch);
                    };

                ////
                this.setVisible(false);
            },
            onEnter: function () {
                this.BACK_GROUND.onEnter();
            },
            onExit: function () {
                this.BACK_GROUND.onExit();
            },
            show: function () {

                ////
                UI_TOUCH_END_SWITCH = false;
                this.setVisible(true);

                ////
                this.CHECKBOX_MUSIC.CHECK_BOX.setSelected(optionSys.getInstance().SWITCH_MUSIC);
                this.CHECKBOX_SOUND.CHECK_BOX.setSelected(optionSys.getInstance().SWITCH_SOUNDEFFECT);

            },
            close: function () {
                this.setVisible(false);
                UI_TOUCH_END_SWITCH = true;
            }
        }
    );

