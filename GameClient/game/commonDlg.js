/**
 * Created by Jack on 2017/3/25.
 */

var commonDlg =
    cc.Layer.extend(
    {
        ////
        ctor: function (_callback) {
            ////
            this._super();

            this.BACK_GROUND = new uiTouchSprite(
                function(touch, event)
                {
                    if(_callback)
                    {
                        _callback();
                    }

                    UI_TOUCH_END_SWITCH = true;
                }
            );

            this.size = cc.director.getWinSize();
            this.BACK_GROUND.initWithFile(res_common.COMMON_DIALOG);
            this.BACK_GROUND.setPosition(this.size.width / 2, this.size.height / 2);

            this.addChild(this.BACK_GROUND);

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

var waitDlg = cc.Sprite.extend(
    {
        size:cc.director.getWinSize(),
        ctor:function()
        {
            this._super();
            this.initWithFile(res_common.COMMON_BACK);
            this.setPosition(this.size.width/2, this.size.height/2);

            var _label = cc.LabelTTF.create("Wait...", FONT_NAME.FONT_HEITI, 32);
            _label.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
            this.addChild(_label);

            this.setVisible(false);
        },
        show:function()
        {
            UI_TOUCH_END_SWITCH = false;
            this.setVisible(true);
        },
        close:function()
        {
            this.setVisible(false);
            UI_TOUCH_END_SWITCH = true;
        }
    }
);