/**
 * Created by Jack on 2017/4/28.
 */

var UI_CHECK_BOX =
    cc.Node.extend(
        {
            TARGET:null,
            CALLBACK:null,
            CHECKBOXLIST:true,
            CALLBACK_SINGLE:null,
            ctor:function(title, tag, obj, callback)
            {
                this._super();
                this.setTag(tag);

                this.TARGET   = obj;
                this.CALLBACK = callback;

                var _label = cc.LabelTTF.create(title, FONT_NAME.FONT_HEITI, 56);
                _label.setAnchorPoint(0.0, 0.0);
                _label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                this.addChild(_label);

                var _checkBox = ccui.CheckBox.create();
                _checkBox.loadTextures(
                    SOURCE_PATH + "res/common/checkbox_blank.png",
                    SOURCE_PATH + "res/common/checkbox_blank.png",
                    SOURCE_PATH + "res/common/checkbox_check.png");

                _checkBox.setScale(0.5);
                _checkBox.setAnchorPoint(0.0, 0.0);
                _checkBox.setPosition(_label.getContentSize().width + 4.0, 0);
                this.addChild(_checkBox);

                _checkBox.addEventListenerCheckBox(this.eventCheckbox, this);
                this.CHECK_BOX = _checkBox;

                ////
                this.width = _label.getContentSize().width + 4.0 + _checkBox.getContentSize.width;

                ////
                this.MUTEX_LIST = [];
            },
            setTag:function(tag)
            {
                ////
                this.TAG_VALUE = tag;
            },
            eventCheckbox:function(ref, type)
            {
                optionSys.getInstance().playSound(res_sound.touch);

                if( this.MUTEX_LIST.length > 0 )
                {
                    cc.log("******select tag:" + this.TAG_VALUE.toString() + "******");

                    if( this.TARGET && this.CALLBACK )
                    {
                        this.CALLBACK(this.TARGET, this.TAG_VALUE);
                    }

                    if( type == ccui.CheckBox.EVENT_SELECTED )
                    {
                        for( var i in this.MUTEX_LIST )
                        {
                            this.MUTEX_LIST[i].CHECK_BOX.setSelected(false);
                        }
                    }
                    else
                    {
                        this.CHECK_BOX.setSelected(true);
                    }
                }
                else
                {
                    if( this.CHECKBOXLIST )
                    {
                        this.CHECK_BOX.setSelected(true);
                    }
                    else
                    {
                        /*
                        if( type == ccui.CheckBox.EVENT_SELECTED )
                        {

                        }
                        else
                        {

                        }
                        */

                        if( this.CALLBACK_SINGLE != null )
                        {
                            this.CALLBACK_SINGLE(type);
                        }

                    }
                }
            },
            setMutex:function(mutex_list)
            {
                for( var i in  mutex_list )
                {
                    var _MUTEX = mutex_list[i];

                    if( _MUTEX != this )
                    {
                        this.MUTEX_LIST.push(_MUTEX);
                    }
                }
            }
        }
    );