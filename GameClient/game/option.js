/**
 * Created by Jack on 2017/4/28.
 */
const SWITCH_MUSIC = "SOUND_MUSIC";
const SWITCH_SOUND_EFFECT = "SOUND_EFFECT";

var optionSys =
    (
        function () {
            var instance = null;
            function Instance()
            {
                var _instance =
                {
                    CURRENT_MUSIC:null,
                    SWITCH_MUSIC:true,
                    SWITCH_SOUNDEFFECT:true,
                    setMusicForBackground:function(music)
                    {
                        if( this.CURRENT_MUSIC != music )
                        {
                            this.CURRENT_MUSIC = music;

                            if( this.SWITCH_MUSIC )
                            {
                                cc.audioEngine.playMusic(music, true);
                            }
                        }
                    },
                    playSound:function(sound)
                    {
                        if( this.SWITCH_SOUNDEFFECT )
                        {
                            cc.audioEngine.playEffect(sound);
                        }
                    },
                    switchMusic:function(_switch)
                    {
                        if( _switch != true && _switch != false )
                        {
                            return;
                        }

                        request_Option(SWITCH_MUSIC,_switch,
                            function(res)
                            {
                                return;
                            }
                        );

                        _instance._switchMusic(_switch);
                    },
                    switchSound: function (_switch)
                    {
                        if( _switch != true && _switch != false )
                        {
                            return;
                        }

                        request_Option(SWITCH_SOUND_EFFECT,_switch,
                            function(res)
                            {
                                return;
                            }
                        );

                        _instance._switchSound(_switch);
                    },
                    _switchMusic:function(_switch)
                    {
                        this.SWITCH_MUSIC = _switch;

                        ////
                        if( _switch && this.CURRENT_MUSIC != null )
                        {
                            cc.audioEngine.playMusic(this.CURRENT_MUSIC, true);
                        }
                        else if( !_switch && this.CURRENT_MUSIC != null )
                        {
                            cc.audioEngine.stopMusic(this.CURRENT_MUSIC);
                        }
                    },
                    _switchSound: function (_switch)
                    {
                        this.SWITCH_SOUNDEFFECT = _switch;
                    },
                };

                if( OPTIONS )
                {
                    if( OPTIONS.SOUND_MUSIC == true || OPTIONS.SOUND_MUSIC == false )
                    {
                        _instance._switchMusic(OPTIONS.SOUND_MUSIC);
                    }

                    if( OPTIONS.SOUND_EFFECT == true || OPTIONS.SOUND_EFFECT == false )
                    {
                        _instance._switchSound(OPTIONS.SOUND_EFFECT);
                    }
                }

                return _instance;
            };

            return {
                getInstance:function(){
                    if(instance == null){
                        instance = Instance();
                    }
                    return instance;
                }
            };
        }
    )();