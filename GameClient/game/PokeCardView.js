/**
 * Created by Jack on 2017/3/30.
 */

var PokeCardView = cc.Layer.extend(
    {
        ROOT:null,
        POKECARD_ROOT:null,
        POKE_NAME_ARRAY:null,
        size:cc.director.getWinSize(),
        ANIM_REF_COUNT:0,
        init:function()
        {
            this._super();

            ////
            this.ROOT = cc.Node.create();
            this.addChild(this.ROOT);

            ////
            cc.textureCache.addImage(res_room.POKECARD_PNG);
            var _texPoke = cc.textureCache.getTextureForKey(res_room.POKECARD_PNG);
            this.POKECARD_ROOT = cc.SpriteBatchNode.createWithTexture(_texPoke);
            this.POKECARD_ROOT.setPosition(0.0,0.0);
            this.ROOT.addChild( this.POKECARD_ROOT );

            cc.spriteFrameCache.addSpriteFrames(res_room.POKECARD_PLIST, _texPoke);

            ////
            var _poke_names =[];
            for( var i=0; i<54; i++ )
            {
                var _poke_name = "poke_" + i.toString() + ".png";
                _poke_names.push( _poke_name );
            }

            this.POKE_NAME_ARRAY = [];
            for( var i in _poke_names )
            {
                var _framePoke = cc.spriteFrameCache.getSpriteFrame(_poke_names[i]);
                this.POKE_NAME_ARRAY.push( _framePoke );
            }

            this.POKE_FRAME_BACK       = cc.spriteFrameCache.getSpriteFrame("poke_back.png");
            this.POKE_FRAME_CARDFRAME = cc.spriteFrameCache.getSpriteFrame("poke_frame.png");

            return true;
        },
        createPoke:function(PokeUID, attachBatchNode)
        {
            const _POKE_FRAME = this.POKE_NAME_ARRAY;
            const _frameBack = this.POKE_FRAME_BACK;

            var _pokeFrame = null;
            if( PokeUID >= 0 && PokeUID < 52 )
            {
                _pokeFrame = _POKE_FRAME[PokeUID];
            }
            else
            {
                _pokeFrame = _frameBack;
            }

            var sptPoke = cc.Sprite.createWithSpriteFrame(_pokeFrame);
            sptPoke.BACK_POKE = _frameBack;

            ////
            var sptFrame = cc.Sprite.createWithSpriteFrame(this.POKE_FRAME_CARDFRAME);
            sptFrame.setAnchorPoint(0.0,0.0);
            sptPoke.addChild(sptFrame);

            ////
            sptPoke.resetPoke = function()
            {
                this.initWithSpriteFrame(this.BACK_POKE);
                this.CURRENT_FRAME = this.BACK_POKE;
                this.NEXT_FRAME    = null;
            };

            ////
            var SELF = this;

            ////
            sptPoke.changeCard = function(_cardUID)
            {
                if( _cardUID >= 0 && _cardUID < 52 )
                {
                    this.NEXT_FRAME = _POKE_FRAME[_cardUID];
                }
                else
                {
                    this.NEXT_FRAME = this.BACK_POKE;
                }

                SELF.ANIM_REF_COUNT += 1;
            };

            ////
            sptPoke.setShow = function(lasttime)
            {
                if( this.CURRENT_FRAME == this.NEXT_FRAME )
                {
                    SELF.ANIM_REF_COUNT -= 1;
                    return;
                }

                const _lasttime = (lasttime==null?0:lasttime);

                var actions =
                    [
                        cc.FadeIn.create(0.0, 255),
                        cc.FadeIn.create(_lasttime, 255),
                        cc.FadeOut.create(0.2, 0),
                        cc.CallFunc.create(
                            function(target, data)
                            {
                                setTimeout(
                                    function()
                                    {
                                        target.initWithSpriteFrame(data);
                                        target.CURRENT_FRAME = data;
                                        target.NEXT_FRAME = null;



                                        SELF.ANIM_REF_COUNT -= 1;

                                        if( SELF.ANIM_REF_COUNT == 0 )
                                        {
                                            var _action = cc.Sequence.create(
                                                cc.FadeIn.create(0.25, 255),
                                                cc.CallFunc.create(
                                                    function(_target, _data)
                                                    {
                                                        cc.log("****** poke anim completed! ******");

                                                        if( SELF.CALLBACK_FUNCAFTERANIMCOMPLETED )
                                                        {
                                                            var _callback =  SELF.CALLBACK_FUNCAFTERANIMCOMPLETED;
                                                            _callback();
                                                            SELF.CALLBACK_FUNCAFTERANIMCOMPLETED = null;
                                                        }
                                                    },
                                                    null,null
                                                )
                                            );

                                            target.runAction(_action);
                                        }
                                        else
                                        {
                                            target.runAction(cc.FadeIn.create(0.25, 255));
                                        }
                                    },
                                    10
                                );
                            },
                            this,
                            this.NEXT_FRAME
                        )
                    ];

                var action = cc.Sequence.create(actions[0], actions[1], actions[2], actions[3]);
                this.runAction(action);
            };

            ////
            var action =
                [
                    cc.FadeTo.create(0.6, 255),
                    cc.FadeTo.create(0.8, 80)
                ];

            var _action = cc.Sequence.create(action[0], action[1]);
            var frameAction = cc.RepeatForever.create(_action);
            sptFrame.runAction(frameAction);
            sptFrame.setVisible(false);

            sptPoke.setSelected = function(select)
            {
                sptFrame.setVisible(select);
            };

            if( attachBatchNode )
            {
                this.POKECARD_ROOT.addChild(sptPoke);
            }

            return sptPoke;
        },
        setCallbackAfterAnimCompleted:function(callback)
        {
            if( this.ANIM_REF_COUNT == 0 )
            {
                callback();
            }
            else
            {
                this.CALLBACK_FUNCAFTERANIMCOMPLETED = callback;
            }
        },
        onEnter:function()
        {
            this.ROOT.onEnter();
        },
        onExit:function()
        {
            this.ROOT.onExit();
        },
        createSelfList:function(PokeUIDArray, attachBatchNode)
        {
            var _root = null;
            for( var i in PokeUIDArray )
            {
                if( i == 0 )
                {
                    _root = this.createPoke(PokeUIDArray[i], attachBatchNode);
                    _root.POKECARD = {};
                    _root.POKECARD[i] = _root;

                    ////////
                    _root.getWorldPosition =
                        function()
                        {
                            return this.getPosition;
                        };
                }
                else
                {
                    var Poke = this.createPoke(PokeUIDArray[i], false);
                    Poke.setAnchorPoint(0.0, 0.0);
                    Poke.setPosition(i * 320.0, 0.0);
                    _root.addChild(Poke);

                    _root.POKECARD[i] = Poke;

                    ////////
                    Poke.getWorldPosition =
                        function()
                        {
                            return _root.convertToWorldSpace(this.getPosition());
                        };
                }
            }

            return _root;
        },
        createPokeListForRect:function(PokeUIDArray, attachBatchNode)
        {
            var _root = null;
            for( var i in PokeUIDArray )
            {
                if( i == 0 )
                {
                    _root = this.createPoke(PokeUIDArray[i], attachBatchNode);
                    _root.POKECARD = {};
                    _root.POKECARD[i] = _root;

                    ////////
                    _root.getWorldPosition =
                        function()
                        {
                            return this.getPosition;
                        };
                }
                else
                {
                    var Poke = this.createPoke(PokeUIDArray[i], false);
                    Poke.setAnchorPoint(0.0, 0.0);
                    Poke.setPosition(i * 112.0, 0.0);
                    _root.addChild(Poke);

                    _root.POKECARD[i] = Poke;

                    ////////
                    Poke.getWorldPosition =
                        function()
                        {
                            return _root.convertToWorldSpace(this.getPosition());
                        };
                }
            }

            return _root;
        },
        createPokeListForFan:function(PokeUIDArray, attachBatchNode)
        {
            var _root = null;
            const _count = PokeUIDArray.length;
            const _angleFlag = 12;
            const _angleStart = -_angleFlag * _count / 2;

            for( var i in PokeUIDArray )
            {
                if( i == 0 )
                {
                    _root = this.createPoke(PokeUIDArray[i], attachBatchNode);
                    _root.setRotation(_angleStart - _angleFlag / 2);

                    _root.POKECARD = {};
                    _root.POKECARD[i] = _root;
                }
                else
                {
                    var Poke = this.createPoke(PokeUIDArray[i], false);
                    Poke.setAnchorPoint(0.0, 0.0);
                    Poke.setRotation(i * _angleFlag);
                    _root.addChild(Poke);

                    _root.POKECARD[i] = Poke;
                }
            }

            return _root;
        }
    }
);

