/**
 * Created by Jack on 2017/3/22.
 */
//"use strict";
function TDRecord(data)
{
    TDGA.onItemPurchase({
        item :data.item,
        itemNumber : 1,
        priceInVirtualCurrency : data.priceInVirtualCurrency
    });

    TDGA.onItemUse({
        item : data.item,
        itemNumber : 1
    });
};

const MISSION_NAME = "进入房间";
function TDMissionBegin()
{
    TDGA.onMissionBegin(MISSION_NAME);
}

function TDMissionResult(success, cause)
{
    if( success )
    {
        TDGA.onMissionCompleted(MISSION_NAME);
    }
    else
    {
        TDGA.onMissionFailed(MISSION_NAME, cause?cause.toString():"unknown");
    }
}

////////
const TEST_DATA =
    [
        {
            ID:123456,
            IMG:"http://wx.qlogo.cn/mmopen/pF515v7Hcicao5rTCyzbrPN9NibxjkuCPoLubjKvMXibNHU0v48hJIehA5bqlsEwWVMGukVrGRJ1g2elNXRaLFFJg/0",
            NICKNAME:"Jack"
        },
        {
            ID:24680,
            IMG:"http://wx.qlogo.cn/mmopen/PFPUMLY8F768KJLHTWsAZicibzsxva3CFxQzSffEDHkVMDtEWdXKJXfURHndRjZMNdPny9vtO0fg5WA7wq5BzLicQ/0",
            NICKNAME:"tom"
        },
        {
            ID:135790,
            IMG:"http://wx.qlogo.cn/mmopen/deSkYvMWWCicGdNoG1aHjxaickShBlAPu1BvND8kZibWp0moL5TcyElsrVoLHgeB13hrPADR8FnHdTlvR5NRSERMQ2BnNEib6z8a/0",
            NICKNAME:"henny"
        },
        {
            ID:111111,
            IMG:"http://wx.qlogo.cn/mmopen/deSkYvMWWCicGdNoG1aHjxaickShBlAPu1BvND8kZibWp0moL5TcyElsrVoLHgeB13hrPADR8FnHdTlvR5NRSERMQ2BnNEib6z8a/0",
            NICKNAME:"jerry"
        }
    ];

var _requestDataInfo = getUrlParam("base64");
var _userData = null;

if( _requestDataInfo != null )
{
    var _base64DataInfo1  = BASE64.decoder(_requestDataInfo);
    var _base64DataInfo2 = transAscToStringArray(_base64DataInfo1);

    _userData = JSON.parse(_base64DataInfo2);
}

var _checkUserData = null;
if( _userData != null && _userData.ID != null && _userData.IMG != null && _userData.NICKNAME != null && _userData.OPENID != null )
{
    _checkUserData = extendDeep(_userData);
}

if( !_checkUserData )
{
    _checkUserData = wx_data;
    //alert(JSON.stringify(wx_data));
}

const _testSelected =
    _checkUserData;
    //TEST_DATA[2];

const _loginKey             = _testSelected.ID;
const _testPlayerImg       = _testSelected.IMG;
const _testPlayerNickName = _testSelected.NICKNAME;

var _player_img64 = "";

////////
var GameTimer =
    function()
    {
        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        var _startTime = window.mozAnimationStartTime || Date.now();
        var _lastTime = 0;
        var _CALLBACK = null;

        var _update =
            function(timestamp)
            {
                var _checktime = (new Date()).getTime();

                if( _checktime - _startTime > _lastTime )
                {
                    if( _CALLBACK )
                    {
                        _CALLBACK();
                    }

                    _startTime = _checktime;
                }

                requestAnimationFrame(_update);
            };

        var _object =
        {
            ANIMATION_ID:0,
            init:function(msecond, callback)
            {
                _lastTime  = msecond;
                _CALLBACK  = callback;
                _startTime = (new Date()).getTime();

                this.ANIMATION_ID = requestAnimationFrame(_update);
            },
            setTime:function(time)
            {
                _lastTime = time;
            }
        };

        return _object;
    };

var gameTimer = new GameTimer();

////////
function checkPokecardData(pokecarddata)
{
    var _check = true;

    if( pokecarddata == null || pokecarddata == 0 || pokecarddata.length == 0 || pokecarddata.length > 5 )
    {
        _check = false;
    }
    else
    {
        for( var i in pokecarddata )
        {
            const _id = pokecarddata[i];

            if( _id >= 0 && _id < 52 )
            {

            }
            else
            {
                _check = false;
            }
        }
    }

    if( !_check && pokecarddata != null )
    {
        cc.log("error data:" + pokecarddata.toString());
    }

    return _check;
};

////////
var clientSystem =
    (
        function () {
            var instance = null;
            function Instance()
            {
                var _instance =
                {
                    ISCONN:false,
                    GAME_CONFIG:null,
                    WECHAT_ID:null,
                    SELF_PLAYER:null,
                    OTHER_PLAYERS:{},
                    ZHUANG_PLAYER:null,
                    GAME_ROOM:null,
                    CURRENT_ROOM_OBJECT:null,
                    HEART_DATA:{flag:0,time:0, ping:0},
                    setRoom:function(room_object)
                    {
                        this.CURRENT_ROOM_OBJECT = room_object;
                    },
                    setWeChatID:function(wechat_id)
                    {
                        this.WECHAT_ID = wechat_id;
                    },
                    ////
                    isConn:function()
                    {
                        return this.ISCONN;
                    },
                    conn:function()
                    {
                        NetWorkSystem.initNetwork(IP_ADDRESS);
                    },
                    heart:function()
                    {
                        var _msg = PROTOCAL_MSG.MSG_C2S_HEART;
                        _msg.data.flag = getRandValue();
                        _msg.data.time = getTimeMSecond();

                        this.HEART_DATA.flag = _msg.data.flag;
                        this.HEART_DATA.time = _msg.data.time;

                        SEND_MSG(_msg, true);
                    },
                    login:function()
                    {
                        var _msg = PROTOCAL_MSG.MSG_C2S_LOGIN;
                        _msg.data.player_key = _loginKey;
                        _msg.data.player_img = _testPlayerImg;
                        _msg.data.player_nickname = _testPlayerNickName;
                        SEND_MSG(_msg);
                    },
                    get_player_data:function(callback_func)
                    {
                        this.CALLBACK_GET_PLAYER_DATA = callback_func;
                        var _msg = PROTOCAL_MSG.MSG_C2S_GETPLAYERDATA;
                        SEND_MSG(_msg);
                    },
                    create_room:function( _room_type, _max_round, _basescore, _pwd )
                    {
                        var _msg = PROTOCAL_MSG.MSG_C2S_CREATE_ROOM;

                        _msg.data.room_type = _room_type;
                        _msg.data.room_max_around = _max_round;
                        _msg.data.basescore = _basescore;

                        if( _pwd != null )
                        {
                            _msg.data.password = _pwd;
                        }

                        var _configData = this.GAME_CONFIG["DATA"];

                        ////////
                        this.CALLBACK_CREATE_ROOM_FUNC = null;
                        const _cellData = _configData.MAX_AROUND;
                        const _cost     = _cellData[_max_round].GOLD;
                        const _round    = _cellData[_max_round].COUNT;

                        ////////
                        if( !this.SELF_PLAYER.IS_VIP )
                        {
                            this.CALLBACK_CREATE_ROOM_FUNC =
                                function()
                                {
                                    TDRecord(
                                        {
                                            item:'房间(局:' + _round.toString() + ",底:" + _basescore.toString() + ")",
                                            priceInVirtualCurrency:_cost
                                        }
                                    );
                                };
                        }
                        else
                        {
                            this.CALLBACK_CREATE_ROOM_FUNC =
                                function()
                                {
                                    TDRecord(
                                        {
                                            item:'VIP 房间(局:' + _round.toString() + ",底:" + _basescore.toString() + ")",
                                            priceInVirtualCurrency:0
                                        }
                                    );
                                };
                        }

                        SEND_MSG(_msg);
                    },
                    delete_room_by_owner:function( _room_uid, callback )
                    {
                        this.CALLBACK_DELETE_ROOM_BY_OWNER = callback;
                        var _msg = PROTOCAL_MSG.MSG_C2S_DISBAND_ROOM_BY_OWNER;
                        _msg.data.room_id = _room_uid;
                        SEND_MSG(_msg);
                    },
                    enter_room:function( _room_number, callback )
                    {
                        this.SELF_PLAYER.game_room_status   = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                        this.SELF_PLAYER.game_player_status = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                        this.OTHER_PLAYERS = {};

                        this.CALLBACK_ENTER_ROOM = callback;

                        var _msg = PROTOCAL_MSG.MSG_C2S_ENTER_ROOM;
                        _msg.data.room_rand_key = _room_number.toString();

                        SEND_MSG(_msg);
                    },
                    leave_room:function( callback )
                    {
                        this.CALLBACK_LEAVE_ROOM = callback;

                        var _msg = PROTOCAL_MSG.MSG_C2S_LEAVE_ROOM;
                        SEND_MSG(_msg);
                    },
                    request_room_list:function(callback, target)
                    {
                        this.CALLBACK_REQUEST_ROOM_LIST = callback;
                        this.TARGET_REQUEST_ROOM_LIST = target;

                        var _msg = PROTOCAL_MSG.MSG_C2S_REQUEST_ROOMLIST;
                        SEND_MSG(_msg);
                    },
                    visit_inviter:function(callback)
                    {
                        if( wx_data && wx_data.inviter )
                        {
                            this.SELF_PLAYER.game_room_status   = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                            this.SELF_PLAYER.game_player_status = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                            this.OTHER_PLAYERS = {};

                            this.CALLBACK_ENTER_ROOM = callback;

                            var _msg = PROTOCAL_MSG.MSG_C2S_FINDINVITER_INROOM;
                            _msg.data.player_key = wx_data.inviter;

                            SEND_MSG(_msg);
                        }
                    },
                    pay_vip:function(vipLevel, callback)
                    {
                        this.CALLBACK_PAYVIP = callback;
                        var _msg = PROTOCAL_MSG.MSG_C2S_PAY_VIP;
                        _msg.data.vip = vipLevel;
                        SEND_MSG(_msg);
                    },
                    game_ready:function(ready, callback)
                    {
                        ////
                        if( ready )
                        {
                            this.CALLBACK_GAMEREADY = callback;
                            var _msg = PROTOCAL_GAME_MSG.MSG_C2S_READYGAME;
                            SEND_MSG(_msg);
                        }
                        else
                        {
                            this.CALLBACK_CANCELREADY = callback;
                            var _msg = PROTOCAL_GAME_MSG.MSG_C2S_CANCELREADY;
                            SEND_MSG(_msg);
                        }
                    },
                    fight_zhuang:function(zhuangValue, callback)
                    {
                        if( zhuangValue > 0 && zhuangValue < 255 )
                        {
                            this.CALLBACK_FIGHT_ZHUANG = callback;
                            var _msg = PROTOCAL_GAME_MSG.MSG_C2S_FIGHT_ZHUANG;
                            _msg.data.zhuang_value = zhuangValue;
                            SEND_MSG(_msg);
                        }
                    },
                    add_double:function(doubleValue, callback)
                    {
                        if( doubleValue >= 0  && doubleValue < 255 )
                        {
                            this.CALLBACK_ADD_DOUBLE = callback;
                            var _msg = PROTOCAL_GAME_MSG.MSG_C2S_ADD_DOUBLE;
                            _msg.data.double = doubleValue;
                            SEND_MSG(_msg);
                        }
                    },
                    next_around: function ()
                    {
                        var _msg = PROTOCAL_GAME_MSG.MSG_C2S_NEXT_AROUND;
                        SEND_MSG(_msg);
                    },
                    applicate_leave:function(_flag, _callback_func)
                    {
                        this.CALLBACK_APPLICATE_LEAVE = _callback_func;

                        var _msg = PROTOCAL_GAME_MSG.MSG_C2S_APPLICATE_LEAVE;
                        _msg.data.flag = _flag;
                        SEND_MSG(_msg);
                    },
                    getLastResult:function(_callback)
                    {
                        this.CALLBACK_GETLASTRESULT = _callback;

                        var _msg = PROTOCAL_GAME_MSG.MSG_C2S_GET_LASTRESULT;
                        SEND_MSG(_msg);
                    },
                    recv:function(data)
                    {
                        if( data.error != 0 )
                        {
                            this.processErrorInGame(data.error, data.error_ex);
                        }
                        else if(data.error != null && data.error == 0 && data.protocal != null)
                        {
                            var _msgData = data.data;
                            switch(data.protocal)
                            {
                                case ENUM_MSG_PROTOCAL.EGP_S2C_HEART:
                                {
                                    ////心跳包处理
                                    const flag = _msgData.flag;
                                    const time = _msgData.time;

                                    if( this.HEART_DATA.flag == flag )
                                    {
                                        this.HEART_DATA.ping = getTimeMSecond() - time;
                                        setPing(this.HEART_DATA.ping);
                                    }

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_LOGIN:
                                {
                                    //_player_img64 = "game_source/"+_msgData["player_key"]+"/img_account";

                                    this.SELF_PLAYER = {};
                                    var SELF_PLAYER = this.SELF_PLAYER;
                                    SELF_PLAYER.player_key = _msgData["player_key"];
                                    SELF_PLAYER.id          = _msgData["player_id"];
                                    SELF_PLAYER.nickname    = _msgData["player_nickname"];
                                    SELF_PLAYER.gold        = _msgData["player_diamond"];
                                    SELF_PLAYER.room_id     = _msgData["room_id"];
                                    SELF_PLAYER.room_rand_key = _msgData["room_rand_key"];
                                    SELF_PLAYER.room_basescore = _msgData["basescore"];

                                    SELF_PLAYER.game_room_status = _msgData["room_game_status"];
                                    SELF_PLAYER.game_player_status = _msgData["player_game_status"];

                                    SELF_PLAYER.index_in_room   = _msgData["player_index_in_room"];
                                    SELF_PLAYER.img_url = WX_IMG_PATH + _msgData["player_key"];//"game_source/"+_msgData["player_key"]+"/img_account";

                                    ////////
                                    TDGA.Account(
                                        {
                                            accountId:SELF_PLAYER.player_key,
                                            accountType:1,
                                            accountName:SELF_PLAYER.nickname
                                        }
                                    );

                                    if( wx_data )
                                    {
                                        TDGA.Account.setGender(wx_data.sex);
                                    }

                                    ////////
                                    const viplevel     = _msgData.vip;
                                    const vipstarttime = _msgData.vip_start;
                                    const isVIP        = _msgData.is_vip;

                                    if( isVIP == 1 )
                                    {
                                        this.SELF_PLAYER.IS_VIP     = true;
                                        this.SELF_PLAYER.VIP        = viplevel;
                                        this.SELF_PLAYER.VIP_START = vipstarttime;
                                    }

                                    ////////
                                    var _configData    = _msgData["extern_data"];
                                    this.GAME_CONFIG = JSON.parse(_configData);

                                    cc.log('******success login******');

                                    ////////
                                    if( SELF_PLAYER.room_rand_key > 0 )
                                    {
                                        ////
                                        var _room_players_info = _msgData["room_players_info"];
                                        var _players_Array = JSON.parse(_room_players_info);

                                        this.refresh_other_players(_players_Array);

                                        ////
                                        var _room = new sceneRoom();
                                        var _trans = new cc.TransitionCrossFade(1, _room);
                                        cc.director.runScene(_trans);

                                        ////
                                        if(this.CURRENT_ROOM_OBJECT != null)
                                        {
                                            ////
                                            const _applicateLeaveData = _players_Array["room_applicate_leave"];
                                            if( _applicateLeaveData )
                                            {
                                                this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.show(true);

                                                for( var i in _applicateLeaveData )
                                                {
                                                    const _id = _applicateLeaveData[i].player_id;
                                                    const _status = _applicateLeaveData[i].leave_status;

                                                    var _player = this.OTHER_PLAYERS[_id];
                                                    this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.setLeaveStatus(_id, _status);

                                                    if( _id == SELF_PLAYER.id )
                                                    {
                                                        this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.NODE_BUTTON.setVisible(_status==0);
                                                    }
                                                }
                                            }

                                            this.CURRENT_ROOM_OBJECT.refreshPlayers();
                                        }
                                    }
                                    else
                                    {
                                        var _trans = new cc.TransitionCrossFade(1,new sceneHall());
                                        cc.director.runScene(_trans);

                                        setTimeout(
                                            function()
                                            {
                                                if( wx_data )
                                                {
                                                    clientSystem.getInstance().visit_inviter(
                                                        function()
                                                        {
                                                            var _trans = new cc.TransitionCrossFade(1.0, new sceneRoom());
                                                            cc.director.runScene(_trans);
                                                        }
                                                    );
                                                }
                                            },
                                            3000
                                        );
                                    }

                                    this.ISCONN = true;

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_GETPLAYERDATA:
                                {
                                    this.SELF_PLAYER.gold        = _msgData["player_diamond"];

                                    if( this.CALLBACK_GET_PLAYER_DATA )
                                    {
                                        this.CALLBACK_GET_PLAYER_DATA(_msgData);
                                        this.CALLBACK_GET_PLAYER_DATA = null;
                                    }

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_CREATE_ROOM:
                                {
                                    if( this.CALLBACK_CREATE_ROOM_FUNC )
                                    {
                                        this.CALLBACK_CREATE_ROOM_FUNC();
                                        this.CALLBACK_CREATE_ROOM_FUNC = null;
                                    }

                                    //跳转到列表
                                    var _trans = new cc.TransitionCrossFade(0.2,new sceneCreateRoom(2));
                                    cc.director.runScene(_trans);

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_DISBAND_ROOM_BY_OWNER:
                                {
                                    if( this.CALLBACK_DELETE_ROOM_BY_OWNER )
                                    {
                                        this.CALLBACK_DELETE_ROOM_BY_OWNER();
                                        this.CALLBACK_DELETE_ROOM_BY_OWNER = null;
                                    }

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_REQUEST_ROOMLIST:
                                {
                                    if( !_msgData || !_msgData.extern_data || _msgData.extern_data == "0" )
                                    {
                                        break;
                                    }

                                    const extern_data = _msgData.extern_data;

                                    if( !extern_data instanceof Array )
                                    {
                                        break;
                                    }

                                    this.GAME_ROOM = [];

                                    for( var i in extern_data )
                                    {
                                        var _roomData = {};
                                        const extern_parse_data = JSON.parse(extern_data[i]);

                                        _roomData.id = extern_parse_data.room_id;
                                        _roomData.player_count = extern_parse_data.room_player_count;
                                        _roomData.rand_key = extern_parse_data.room_rand_key;
                                        _roomData.basescore = extern_parse_data.basescore;
                                        _roomData.room_max_around = extern_parse_data.room_max_around;

                                        this.GAME_ROOM.push(_roomData);
                                    }

                                    ////
                                    if( this.CALLBACK_REQUEST_ROOM_LIST )
                                    {
                                        this.CALLBACK_REQUEST_ROOM_LIST(this.TARGET_REQUEST_ROOM_LIST, this.GAME_ROOM);
                                        this.CALLBACK_REQUEST_ROOM_LIST = null;
                                        this.TARGET_REQUEST_ROOM_LIST  = null;
                                    }

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_ALL_ENTER_ROOM:
                                {
                                    if (_msgData == null)
                                    {
                                        break;
                                    }

                                    if( this.CALLBACK_ENTER_ROOM )
                                    {
                                        this.CALLBACK_ENTER_ROOM();
                                        this.CALLBACK_ENTER_ROOM = null;
                                    }

                                    var _player_id = _msgData.player_id;
                                    var _player = null;

                                    if( _player_id != this.SELF_PLAYER.id )
                                    {
                                        if( !this.OTHER_PLAYERS[_player_id] )
                                        {
                                            this.OTHER_PLAYERS[_player_id] = {};
                                        }

                                        _player = this.OTHER_PLAYERS[_player_id];
                                    }
                                    else
                                    {
                                        ////////
                                        _player = this.SELF_PLAYER;

                                        _player.room_id     = _msgData["room_id"];
                                        _player.room_rand_key = _msgData["room_rand_key"];
                                        _player.room_basescore = _msgData["basescore"];

                                        var _room_players_info = _msgData["room_players_info"];
                                        var _players_Array = JSON.parse(_room_players_info);

                                        this.refresh_other_players(_players_Array);

                                        ////////
                                        TDMissionBegin();
                                    }

                                    if( _player != null )
                                    {
                                        _player.id             = _player_id;
                                        _player.index_in_room = _msgData.player_index_in_room;
                                        _player.key = _msgData.player_key;
                                        _player.nickname = _msgData.player_nickname;
                                        _player.img_url  = WX_IMG_PATH + _msgData["player_key"];//"game_source/"+_player.key+"/img_account";

                                        _player.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];

                                        if(this.CURRENT_ROOM_OBJECT != null)
                                        {
                                            this.CURRENT_ROOM_OBJECT.refreshPlayers();
                                        }
                                    }

                                    this.ZHUANG_PLAYER = null;

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_ALL_LEAVE_ROOM:
                                {
                                    const _player_id = _msgData.player_id;

                                    if( _player_id != this.SELF_PLAYER.id )
                                    {
                                        var player = this.OTHER_PLAYERS[_player_id];

                                        if( player != null )
                                        {
                                            const _posindex = (player.index_in_room - this.SELF_PLAYER.index_in_room + 8) % 8;
                                            this.CURRENT_ROOM_OBJECT.setPlayer(null, _posindex);
                                        }
                                    }
                                    else
                                    {
                                        this.SELF_PLAYER.gold               = _msgData["player_diamond"];
                                        this.SELF_PLAYER.game_room_status = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                                        this.SELF_PLAYER.game_player_status = ENUM_GAME_PLAYER_STATUS.EPS_NONE;

                                        TDMissionResult(false, "游戏未开始就退出房间");
                                    }

                                    if( this.CALLBACK_LEAVE_ROOM )
                                    {
                                        this.CALLBACK_LEAVE_ROOM();
                                        this.CALLBACK_LEAVE_ROOM = null;
                                    }

                                    break;
                                }
                                case ENUM_MSG_PROTOCAL.EGP_S2C_PAY_VIP:
                                {
                                    const viplevel     = _msgData.vip;
                                    const vipstarttime = _msgData.vip_start;
                                    const isVIP        = _msgData.is_vip;

                                    if( isVIP == 1 )
                                    {
                                        this.SELF_PLAYER.IS_VIP     = true;
                                        this.SELF_PLAYER.VIP        = viplevel;
                                        this.SELF_PLAYER.VIP_START = vipstarttime;

                                        var _info = null;
                                        const _configData = this.GAME_CONFIG["DATA"];

                                        switch(viplevel)
                                        {
                                            case ENUM_PLAYER_TYPE.EPT_DAY:
                                            {
                                                TDRecord(
                                                    {
                                                        item :'VIP包天',
                                                        priceInVirtualCurrency : _configData.VIP_TYPE[0].GOLD
                                                    }
                                                );

                                                _info = "您已经成为24小时VIP，24小时内可免钻石消费";
                                                break;
                                            }
                                            case ENUM_PLAYER_TYPE.EPT_WEEK:
                                            {
                                                TDRecord(
                                                    {
                                                        item :'VIP包周',
                                                        priceInVirtualCurrency : _configData.VIP_TYPE[1].GOLD
                                                    }
                                                );

                                                _info = "您已经成为周卡VIP，一周内可免钻石消费";
                                                break;
                                            }
                                            case ENUM_PLAYER_TYPE.EPT_MONTH:
                                            {
                                                TDRecord(
                                                    {
                                                        item :'VIP包月',
                                                        priceInVirtualCurrency : _configData.VIP_TYPE[2].GOLD
                                                    }
                                                );

                                                _info = "您已经成为月卡VIP，一个月内可免钻石消费"
                                                break;
                                            }
                                        }

                                        show_common_dialog("恭喜您，您已经成为了VIP", _info);
                                    }

                                    if( this.CALLBACK_PAYVIP )
                                    {
                                        this.CALLBACK_PAYVIP();
                                        this.CALLBACK_PAYVIP = null;
                                    }

                                    break;
                                }
                                ////////GAME协议部分
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_ALL_READYGAME:
                                {
                                    ////////
                                    this.CURRENT_AROUND = _msgData.room_current_around;
                                    this.MAX_AROUND      = _msgData.room_max_around;

                                    ////////
                                    const player_id = _msgData.player_id;
                                    var _player;

                                    if (player_id == this.SELF_PLAYER.id)
                                    {
                                        if (this.CALLBACK_GAMEREADY)
                                        {
                                            this.CALLBACK_GAMEREADY(_msgData);
                                            this.CALLBACK_GAMEREADY = null;
                                        }

                                        _player = this.SELF_PLAYER;
                                    }
                                    else
                                    {
                                        _player = this.OTHER_PLAYERS[player_id];
                                    }

                                    if (_player != null)
                                    {
                                        this.SELF_PLAYER.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];

                                        this.CURRENT_ROOM_OBJECT.refreshPlayers();
                                        this.CURRENT_ROOM_OBJECT.refreshUI();
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_ALL_CANCELREADY:
                                {
                                    const player_id = _msgData.player_id;
                                    var _player;

                                    if( player_id == this.SELF_PLAYER.id )
                                    {
                                        if( this.CALLBACK_CANCELREADY )
                                        {
                                            this.CALLBACK_CANCELREADY(_msgData);
                                            this.CALLBACK_CANCELREADY = null;
                                        }

                                        _player = this.SELF_PLAYER;
                                    }
                                    else
                                    {
                                        _player = this.OTHER_PLAYERS[player_id];
                                    }

                                    if (_player != null)
                                    {
                                        _player.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];

                                        const _posindex = (_player.index_in_room - this.SELF_PLAYER.index_in_room + 8) % 8;
                                        this.CURRENT_ROOM_OBJECT.setPlayerStatus(_posindex,_player.game_player_status, _player.game_room_status);
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_ALL_FIGHT_ZHUANG:
                                {
                                    ////
                                    const _player_id = _msgData.player_id;

                                    ////
                                    const _pokecard_data = _msgData.pokecard;

                                    if( _player_id == this.SELF_PLAYER.id &&  checkPokecardData(_pokecard_data) )
                                    {
                                        this.SELF_PLAYER.POKECARD_DATA = extendDeep( _pokecard_data );
                                    }

                                    ////
                                    var ex_datainfo = _msgData["extern_data"];
                                    if( ex_datainfo != null )
                                    {
                                        var ex_data = JSON.parse(ex_datainfo);

                                        ////
                                        const _zhuangValue  = ex_data.zhuang_value;
                                        const _zhuangID     = ex_data.player_id;

                                        if( _zhuangID == this.SELF_PLAYER.id )
                                        {
                                            this.ZHUANG_PLAYER = this.SELF_PLAYER;
                                        }
                                        else
                                        {
                                            this.ZHUANG_PLAYER = this.OTHER_PLAYERS[_zhuangID];
                                        }

                                        this.ZHUANG_VALUE = _zhuangValue;

                                        ////
                                        var _players_info = ex_data.player;

                                        for( var i in _players_info )
                                        {

                                        }
                                    }

                                    ////
                                    const _zhuang_value = _msgData["zhuang_value"];

                                    var _player = null;

                                    if( _player_id == this.SELF_PLAYER.id )
                                    {
                                        _player = this.SELF_PLAYER;

                                        if( this.CALLBACK_FIGHT_ZHUANG != null )
                                        {
                                            this.CALLBACK_FIGHT_ZHUANG(_msgData);
                                            this.CALLBACK_FIGHT_ZHUANG = null;
                                        }
                                    }
                                    else
                                    {
                                        _player = this.OTHER_PLAYERS[_player_id];
                                    }

                                    if( _player != null )
                                    {
                                        this.SELF_PLAYER.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];
                                        _player.zhuang_value        = _zhuang_value;

                                        this.CURRENT_ROOM_OBJECT.refreshPlayers();

                                        if( _player != this.SELF_PLAYER && this.SELF_PLAYER.game_room_status == ENUM_GAME_PLAYER_STATUS.EPS_READY )
                                        {

                                        }
                                        else
                                        {
                                            this.CURRENT_ROOM_OBJECT.refreshUI();
                                        }
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_ALL_ADD_DOUBLE:
                                {
                                    ////
                                    var ex_datainfo = _msgData["extern_data"];
                                    if( ex_datainfo != null )
                                    {
                                        var ex_data = JSON.parse(ex_datainfo);

                                        ////
                                        var _players_info = ex_data.player;

                                        for( var i in _players_info )
                                        {
                                            const _player_data = _players_info[i];

                                            const _player_id     = _player_data.player_id;
                                            const _current_score = _player_data.current_score;
                                            const _total_score   = _player_data.total_score;
                                            const _wintype       = _player_data.pokecard_wintype;

                                            var PLAYER = this.OTHER_PLAYERS[_player_id];

                                            PLAYER.score = _total_score;
                                            PLAYER.add_score = _current_score;
                                            PLAYER.win_type = _wintype;

                                            PLAYER.double_value = _player_data.double;

                                            if( checkPokecardData(_player_data.pokecard) )
                                            {
                                                PLAYER.POKECARD_DATA = extendDeep(_player_data.pokecard);
                                            }
                                        }
                                    }

                                    ////
                                    const _player_id = _msgData["player_id"];
                                    const _double_value = _msgData["double"];

                                    var _player = null;

                                    if( _player_id == this.SELF_PLAYER.id )
                                    {
                                        _player = this.SELF_PLAYER;

                                        if( this.CALLBACK_ADD_DOUBLE != null )
                                        {
                                            this.CALLBACK_ADD_DOUBLE(_msgData);
                                            this.CALLBACK_ADD_DOUBLE = null;
                                        }
                                    }
                                    else
                                    {
                                        _player = this.OTHER_PLAYERS[_player_id];
                                    }

                                    if( _player != null )
                                    {
                                        this.SELF_PLAYER.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];
                                        _player.double_value        = _double_value;

                                        this.CURRENT_ROOM_OBJECT.refreshPlayers();
                                        this.CURRENT_ROOM_OBJECT.refreshUI();
                                    }

                                    ////////
                                    const _FLAG = _msgData["flag"];
                                    if( _FLAG == 1 )
                                    {
                                        //弹出总结算界面，并且返回大厅
                                        this.CURRENT_ROOM_OBJECT.BUTTON_LEAVE.setVisible(false);
                                        this.CURRENT_ROOM_OBJECT.GAME_END_NODE.setVisible(false);
                                        this.CURRENT_ROOM_OBJECT.setUIHide();

                                        var _endButton = this.CURRENT_ROOM_OBJECT.BUTTON_END;
                                        var _room      = this.CURRENT_ROOM_OBJECT;

                                        this.CURRENT_ROOM_OBJECT.POKECARD.setCallbackAfterAnimCompleted(
                                            function()
                                            {
                                                _endButton.setVisible(true);
                                                _room.showPlayerResult();
                                            }
                                        );
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_NEXT_AROUND:
                                {
                                    ////////
                                    const _player_id = _msgData["player_id"];
                                    const _flag      = _msgData["flag"];

                                    var _player = this.OTHER_PLAYERS[_player_id];

                                    if( _player != null )
                                    {
                                        this.SELF_PLAYER.game_room_status = _msgData["room_game_status"];
                                        _player.game_player_status = _msgData["player_game_status"];

                                        if( _flag == ENUM_GAME_PLAYER_STATUS.EPS_NONE )
                                        {
                                            this.SELF_PLAYER.game_player_status = ENUM_GAME_PLAYER_STATUS.EPS_NONE;
                                        }

                                        ////
                                        var _room_players_info = _msgData["room_players_info"];
                                        var _players_Array = JSON.parse(_room_players_info);

                                        if( _players_Array != 0 )
                                        {
                                            this.refresh_other_players(_players_Array);
                                            this.ZHUANG_PLAYER = null;
                                        }

                                        ////
                                        this.CURRENT_ROOM_OBJECT.refreshPlayers();
                                        this.CURRENT_ROOM_OBJECT.refreshUI();
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_ALL_APPLICATE_LEAVE:
                                {
                                    const _player_id      = _msgData.player_id;
                                    const _leaveStatus    = _msgData.flag;
                                    const _externDataInfo = _msgData["room_applicate_leave"];
                                    const _externData     = JSON.parse(_externDataInfo);

                                    var CLIENT_SYS = this;

                                    switch( _leaveStatus )
                                    {
                                        case ENUM_LEAVE_RESULT.ELR_NONE:
                                        {
                                            //show

                                            break;
                                        }
                                        case ENUM_LEAVE_RESULT.ELR_APPLICATE:
                                        {
                                            //show
                                            this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.show(true);

                                            break;
                                        }
                                        case ENUM_LEAVE_RESULT.ELR_ALL_AGREE:
                                        {
                                            //全部同意
                                            if( this.CURRENT_AROUND )
                                            {
                                                if( this.CURRENT_AROUND < 2 )
                                                {
                                                    TDMissionResult(false, "未打完一盘就退出房间");
                                                }
                                                else
                                                {
                                                    TDMissionResult(true);
                                                }
                                            }

                                            setTimeout(
                                                function()
                                                {
                                                    CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.show(false);
                                                    CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_TOTAL_RESULT.show(true);
                                                },
                                                3000);

                                            break;
                                        }
                                        case ENUM_LEAVE_RESULT.ELR_NOTPASS:
                                        {
                                            CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.NODE_BUTTON.setVisible(false);

                                            //有人拒绝，不可退出
                                            setTimeout(
                                                function()
                                                {
                                                    CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.show(false);
                                                },
                                                3000);

                                            break;
                                        }
                                        case ENUM_LEAVE_RESULT.ELR_TIMEOUT:
                                        {
                                            //超时直接退出
                                            if( this.CURRENT_AROUND )
                                            {
                                                if( this.CURRENT_AROUND < 2 )
                                                {
                                                    TDMissionResult(false, "未打完一盘就退出房间");
                                                }
                                                else
                                                {
                                                    TDMissionResult(true);
                                                }
                                            }

                                            setTimeout(
                                                function()
                                                {
                                                    CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.show(false);
                                                    CLIENT_SYS.CURRENT_ROOM_OBJECT.DIALOG_TOTAL_RESULT.show(true);
                                                },
                                                3000);

                                            break;
                                        }
                                    }

                                    if(
                                        _leaveStatus == ENUM_LEAVE_RESULT.ELR_NONE ||
                                        _leaveStatus == ENUM_LEAVE_RESULT.ELR_APPLICATE ||
                                        _leaveStatus == ENUM_LEAVE_RESULT.ELR_ALL_AGREE
                                    )
                                    {
                                        for( var i in _externData )
                                        {
                                            const _id = _externData[i].player_id;
                                            const _status = _externData[i].leave_status;

                                            var _player = this.OTHER_PLAYERS[_id];
                                            this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.setLeaveStatus(_id, _status);
                                        }
                                    }
                                    else if(
                                        _leaveStatus == ENUM_LEAVE_RESULT.ELR_NOTPASS
                                    )
                                    {
                                        const _id = _externData.player_id;
                                        const _status = _externData.leave_status;

                                        for( var i in this.OTHER_PLAYERS )
                                        {
                                            var _player = this.OTHER_PLAYERS[i];

                                            if( _player.id == _id )
                                            {
                                                this.CURRENT_ROOM_OBJECT.DIALOG_APPLICATE_LEAVE.setLeaveStatus(_id, _status);
                                                break;
                                            }
                                        }
                                    }

                                    if( _player_id == this.SELF_PLAYER.id && this.CALLBACK_APPLICATE_LEAVE != null )
                                    {
                                        this.CALLBACK_APPLICATE_LEAVE();
                                        this.CALLBACK_APPLICATE_LEAVE = null;
                                    }

                                    break;
                                }
                                case ENUM_MSG_GAME_PROTOCAL.EGP_S2C_GET_LASTRESULT:
                                {
                                    const _exdata = _msgData["extern_data"];

                                    cc.log("LAST RESULT:" + _exdata);

                                    if( this.CALLBACK_GETLASTRESULT )
                                    {
                                        var _obj = null;
                                        var _recvData = null;

                                        try{
                                            _obj = JSON.parse(_exdata);
                                        }
                                        catch (e)
                                        {

                                        }

                                        if( _obj && _obj.player )
                                        {
                                            _recvData = _obj;
                                        }

                                        this.CALLBACK_GETLASTRESULT(_recvData);
                                        this.CALLBACK_GETLASTRESULT = null;
                                    }

                                    break;
                                }

                                ////////
                            }
                        }
                    },
                    refresh_other_players:function(_exData)
                    {
                        this.OTHER_PLAYERS = {};

                        var _players_Array = _exData.player;

                        if( !_players_Array )
                        {
                            return;
                        }

                        for( var i in _players_Array )
                        {
                            var _tPlayer = _players_Array[i];
                            const player_id = _tPlayer.player_id;

                            if( player_id == this.SELF_PLAYER.id )
                            {
                                this.OTHER_PLAYERS[player_id] = this.SELF_PLAYER;
                            }
                            else
                            {
                                this.OTHER_PLAYERS[player_id] = {};
                            }

                            var _player = this.OTHER_PLAYERS[player_id];

                            _player.id              = player_id;
                            _player.index_in_room = _tPlayer.player_index_in_room;
                            _player.key             = _tPlayer.player_key;
                            _player.nickname       = _tPlayer.player_nickname;
                            _player.img_url        = WX_IMG_PATH + _tPlayer["player_key"];//"game_source/"+_tPlayer.player_key+"/img_account";

                            _player.game_player_status = _tPlayer.player_game_status;

                            _player.zhuang_value        = _tPlayer.zhuang_value;
                            _player.double_value        = _tPlayer.double;

                            _player.score                = _tPlayer.total_score;
                            _player.add_score           = _tPlayer.current_score;
                            _player.win_type             = _tPlayer.pokecard_wintype;

                            if( _player.key == this.SELF_PLAYER.key )
                            {
                                this.SELF_PLAYER.index_in_room = _player.index_in_room;
                            }

                            if( _tPlayer.zhuang == 1 )
                            {
                                this.ZHUANG_PLAYER = _player;
                            }

                            const _pokecard_data = _tPlayer.pokecard;
                            if( checkPokecardData(_pokecard_data) )
                            {
                                _player.POKECARD_DATA = extendDeep( _pokecard_data );
                            }
                        }

                        if( this.ZHUANG_PLAYER != null )
                        {
                            var _zhuangValue = _exData.zhuang_value;
                            if( _zhuangValue != null )
                            {
                                this.ZHUANG_VALUE = _zhuangValue;
                            }
                        }

                        this.CURRENT_AROUND = _exData.room_current_around;
                        this.MAX_AROUND      = _exData.room_max_around;

                    },
                    processErrorInGame:function(error, ex)
                    {
                        var _error_info = INFO_MSG_ERROR[error.toString()];

                        if( _error_info == null )
                        {
                            show_common_dialog("游戏错误","发现未知错误");
                            return;
                        }

                        switch (error)
                        {
                            case 301:
                            {
                                if( ex != "9999")
                                {
                                    var _error_room = INFO_ROOM_ERROR[ex];

                                    if( _error_room == null )
                                    {
                                        _error_room = "房间未知错误";
                                    }

                                    show_common_dialog(_error_info, _error_room);
                                }

                                break;
                            }
                            case 501:
                            {
                                var _error_player_type = INFO_ERROR_PLAYER_TYPE[ex];

                                if( _error_player_type == null )
                                {
                                    _error_player_type = "玩家未知错误";
                                }

                                show_common_dialog(_error_info, _error_player_type);
                                break;
                            }
                            default:
                            {
                                show_common_dialog("游戏错误", _error_info);
                                break;
                            }
                        }
                    },
                    onError:function(error)
                    {
                        show_common_dialog("网络错误","网络目前不可用，请检查您的网络环境。");
                    }
                };

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

////
clientSystem.getInstance().setWeChatID(_loginKey);

gameTimer.init(3000,
function()
{
    if( clientSystem.getInstance().isConn() && NetWorkSystem.msgCountInQuere() == 0 )
    {
        clientSystem.getInstance().heart();
    }
});