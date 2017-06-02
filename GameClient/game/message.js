/**
 * Created by Jack on 2017/3/15.
 */

var PROTOCAL_MSG =
{
    "MSG_C2S_HEART":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_HEART,
        "data":
        {
            "flag":getRandValue(),
            "time":getTimeMSecond()
        }
    },
    "MSG_C2S_LOGIN":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_LOGIN,
        "data":
        {
            "player_key":"",
            "player_img":"",
            "player_nickname":""
        }
    },
    "MSG_C2S_GETPLAYERDATA":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_GETPLAYERDATA,
        "data":
        {

        }
    },
    "MSG_C2S_CREATE_ROOM":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_CREATE_ROOM,
        "data":
        {
            "room_type":0,
            "password":"0",
            "room_max_around":0,
            "basescore":0
        }
    },
    "MSG_C2S_DISBAND_ROOM_BY_OWNER":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_DISBAND_ROOM_BY_OWNER,
        "data":
        {
            "room_id":0
        }
    },
    "MSG_C2S_REQUEST_ROOMLIST":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_REQUEST_ROOMLIST,
        "data":{}
    },
    "MSG_C2S_ENTER_ROOM":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_ENTER_ROOM,
        "data":
        {
            "room_rand_key":"0",
            "password":"0"
        }
    },
    "MSG_C2S_LEAVE_ROOM":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_LEAVE_ROOM,
        "data":{}
    },
    "MSG_C2S_PAY_VIP":
    {
        "protocal":ENUM_MSG_PROTOCAL.EGP_C2S_PAY_VIP,
        "data":
        {
            "vip":0
        }
    },

    ////////

};


var PROTOCAL_GAME_MSG =
{
    "MSG_C2S_READYGAME": {
        "protocal": ENUM_MSG_GAME_PROTOCAL.EGP_C2S_READYGAME,
        "data": {}
    },
    "MSG_C2S_CANCELREADY": {
        "protocal": ENUM_MSG_GAME_PROTOCAL.EGP_C2S_CANCELREADY,
        "data": {}
    },
    "MSG_C2S_FIGHT_ZHUANG": {
        "protocal": ENUM_MSG_GAME_PROTOCAL.EGP_C2S_FIGHT_ZHUANG,
        "data": {
            "zhuang_value": 0
        }
    },
    "MSG_C2S_ADD_DOUBLE": {
        "protocal":ENUM_MSG_GAME_PROTOCAL.EGP_C2S_ADD_DOUBLE,
        "data":{
            "double":0
        }
    },
    "MSG_C2S_NEXT_AROUND":{
        "protocal":ENUM_MSG_GAME_PROTOCAL.EGP_C2S_NEXT_AROUND,
        "data":{}
    },
    "MSG_C2S_APPLICATE_LEAVE":{
        "protocal":ENUM_MSG_GAME_PROTOCAL.EGP_C2S_APPLICATE_LEAVE,
        "data":{
            "flag":0
        }
    },
    "MSG_C2S_GET_LASTRESULT":
    {
        "protocal":ENUM_MSG_GAME_PROTOCAL.EGP_C2S_GET_LASTRESULT,
        "data":{}
    },

};

