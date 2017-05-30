/**
 * Created by Jack.L on 2017/2/23 0023.
 */

var sceneLogin = cc.Scene.extend({
    ctor:function () {
        this._super();

        ////
        const size = cc.director.getWinSize();

        var sptBackground = cc.Sprite.create(res_background.BG_LOGIN);
        sptBackground.setPosition(size.width / 2, size.height / 2);
        this.addChild(sptBackground, 0);
        this.BACKGROUND = sptBackground;

        ////
        cc.spriteFrameCache.addSpriteFrames(res_login.LOGIN_PLIST, res_login.LOGIN_PNG) ;
        var _frameButton = cc.spriteFrameCache.getSpriteFrame("button_login.png");

        var _sptButton = new uiTouchSprite(
            null,null,
            function(touch, event)
            {
                //cc.log("fuck you******");
                //var _trans = new cc.TransitionCrossFade(1,new sceneHall());
                //cc.director.runScene(_trans);

                clientSystem.getInstance().conn();
                //wxLogin.login();
            }
        );

        _sptButton.TOUCH_SOUND = res_sound.door;
        _sptButton.initWithSpriteFrame(_frameButton);

        _sptButton.setScale(0.5);
        _sptButton.setAnchorPoint(0.5,0.0);
        _sptButton.setPosition(SCREEN_SIZE.WIDTH/2, 64);
        sptBackground.addChild(_sptButton);


        ////////
        //show_confirm_dialog("测试","测试内容");
        //show_option_dialog();

        /*
        var textField = new ccui.TextField("PlaceHolder", FONT_NAME.FONT_HEITI, 32);

        var textFieldEvent = function (textField, type) {
            switch (type) {
                case ccui.TextField.EVENT_ATTACH_WITH_IME:
                    break;
                case ccui.TextField.EVENT_DETACH_WITH_IME:
                    break;
                case ccui.TextField.EVENT_INSERT_TEXT:
                    break;
                case ccui.TextField.EVENT_DELETE_BACKWARD:
                    break;
                default:
                    break;
            }
        };

        textField.addEventListener(textFieldEvent, textField);
        textField.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
        this.BACKGROUND.addChild(textField);
        */

        /*
        var _editBox = new cc.EditBox(cc.size(1133.00,90.00),new cc.Scale9Sprite(res_room.EDITBOX_BACK_PNG))

        _editBox.setPlaceholderFontSize(72);
        _editBox.setFontSize(72);

        _editBox.setFontColor(cc.color(0,20.80));


        _editBox.setName("zhaoguanghui");
        _editBox.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
        _editBox.setDelegate(this);
        _editBox.setMaxLength(20);
        _editBox.setPlaceHolder("点击输出账号");
        _editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);//修改为不使用密文
        _editBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        this.addChild(_editBox,1,10);
        */

    }
});




