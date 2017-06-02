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
                var SELF = this;

                cc.spriteFrameCache.addSpriteFrames(res_room.ROOM_PLIST, res_room.ROOM_PNG);
                var _frameButton = cc.spriteFrameCache.getSpriteFrame("button_confirm.png");
                var _sptButton =
                    new uiTouchSprite(
                        null,null,
                        function(touch, event) {
                            _sptButton.unlock();
                            cc.log("touch confirm");
                            SELF.close();
                        }
                    );

                _sptButton.initWithSpriteFrame(_frameButton);
                _sptButton.setPosition(SCREEN_SIZE.WIDTH / 2, 240);
                _sptButton.setScale(0.6);

                this.BUTTON_CONFIRM = _sptButton;

                ////////
                this.BACK_GROUND = cc.Sprite.create();

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
                this.BUTTON_CONFIRM.lock();

                ////
                this.setVisible(true);

                ////
                this.CHECKBOX_MUSIC.CHECK_BOX.setSelected(optionSys.getInstance().SWITCH_MUSIC);
                this.CHECKBOX_SOUND.CHECK_BOX.setSelected(optionSys.getInstance().SWITCH_SOUNDEFFECT);

            },
            close: function () {
                this.setVisible(false);
            }
        }
    );

