/**
 * Created by Jack on 2017/3/15.
 */

////
const ENUM_GAME_PLAYER_STATUS =
{
    "EPS_NONE":0,
    "EPS_READY":1,                                                              //玩家准备好了，等待全体到达这个状态， 游戏自动开始然后可以开始抢庄
    "EPS_FIGHT_FOR_ZHUANG":2,                                                 //玩家抢完庄，等待全体到达这个状态, 然后可以开始发牌
    "EPS_DEALER":3,                                                             //发完牌了，玩家可以加倍
    "EPS_END":4,                                                                //加倍完了，则玩家等待游戏结果，游戏结果发还以后，状态重置为EPS_NONE
    "EPS_MAX":5,                                                                //标识符，没有任何意义
};

const ENUM_PLAYER_TYPE =
{
    "EPT_NONE":0,
    "EPT_DAY":1,                                                                //包日用户
    "EPT_WEEK":2,                                                               //包周用户
    "EPT_MONTH":3,                                                              //包月用户
};

const ENUM_ERROR_PLAYER_TYPE =
{
    "EEPT_OK":0,
    "EEPT_ALREADYVIP":1,
    "EEPT_FEWGOLD":2,
};

const INFO_ERROR_PLAYER_TYPE =
{
    "1":"您已经是VIP了",
    "2":"您的金币不足，无法购买VIP卡"
}

const ENUM_LEAVE_RESULT =
{
    "ELR_NONE":0,                                                           //正常申请退出返回
    "ELR_APPLICATE":1,                                                          //退出标识
    "ELR_ALL_AGREE":2,                                                          //
    "ELR_NOTPASS":3,                                                            //
    "ELR_TIMEOUT":4,                                                            //
};


////
const ENUM_MSG_ERROR =
{
    "PROTOCAL_OK":                       0,
    "PROTOCAL_ERROR_UNKNOW":            1,
    "PROTOCAL_ERROR_FORMAT":          101,       //协议格式错误
    "PROTOCAL_ERROR_MSG_FORMAT":     102,       //协议内容格式错误
    "PROTOCAL_ERROR_MISSPROTOCAL":   103,       //协议不存在
    "PROTOCAL_ERROR_WRONGDATA":      104,       //错误数据

    //////////////////////////////////////////////////////////////////////////
    "PROTOCAL_ERROR_LOGINFAILED":    201,       //登录失败
    "PROTOCAL_ERROR_NONELOGIN":      202,       //没有登录，协议无法通讯

    "PROTOCAL_ERROR_ROOM":            301,       //房间相关协议

    "PROTOCAL_ERROR_GAME":            401,       //游戏过程中状态错误
    "PROTOCAL_ERROR_PLAYER":          501,       //玩家相关错误

};

const  ENUM_WIN_CARD_TYPE =
{
    "EWCT_NONE":0,

    "EWCT_NIU1":1,
    "EWCT_NIU2":2,
    "EWCT_NIU3":3,
    "EWCT_NIU4":4,
    "EWCT_NIU5":5,
    "EWCT_NIU6":6,
    "EWCT_NIU7":7,
    "EWCT_NIU8":8,
    "EWCT_NIU9":9,

    "EWCT_NIUNIU":10,

    "EWCT_SIHUANIU":11,
    "EWCT_WUHUANIU":12,
    "EWCT_WUXIAONIU":13,
    "EWCT_ZHADAN":14,
    "EWCT_ZHANDANWUXIAO":15,

    "EWCT_COUNT":16
};

const INFO_MSG_ERROR =
{
    "1":"未知错误",
    "101":"协议格式错误",
    "102":"协议内容格式错误",
    "103":"协议不存在",
    "104":"协议中发现数据错误",
    "201":"登录失败",
    "202":"还没有登录，无法进行通讯",
    "301":"房间错误",
    "401":"游戏错误",
    "501":"玩家账号错误",
};

const ENUM_ROOM_ERROR =
{
    "ERE_ROOM_OK":0,
    "ERE_ROOM_UNKNOWN":100,
    "ERE_ROOM_CAN_NOT_CREATED":101,                   //无法创建房间
    "ERE_ROOM_CAN_NOT_CREATED_WITHOUTPAY":102,      //由于金币不足无法创建房间
    "ERE_ROOM_IS_NOT_EXIS":103,                       //房间不存在
    "ERE_ROOM_PLAYER_OUT_ROOM":104,                  //玩家不在任何房间内
    "ERE_ROOM_PLAYER_IN_HERE":105,                   //玩家本来就存在于该房间内
    "ERE_ROOM_PLAYER_IN_OTHER_ROOM":106,            //玩家在其他房间内
    "ERE_ROOM_IN_GAME":107,                           //房间当前状态为游戏中状态
    "ERE_ROOM_IS_FULL":108,                           //房间已满
    "ERE_ROOM_SOMEPLAYERINHERE":109,                //房间中有人
    "ERE_ROOM_PASSWORD_TYPE":110,                   //密码格式
    "ERE_ROOM_WRONG_PASSWORD":111,                  //密码错误
    "ERE_ROOM_LIMITRIGHT":112,                      //房间权限问题
    "ERE_ROOM_WRONG_STATUS":113,                    //房间错误的状态
    "ERE_ROOM_MAX_COUNT_LIMITED":114,              //开房数目收到限制
    "ERE_ROOM_UNKNOWN_THROW":9999                   //不处理，直接忽略掉的消息
};

const INFO_ROOM_ERROR =
{
    "100":"未知错误",
    "101":"无法创建房间",
    "102":"金币不足无法创建房间",
    "103":"房间不存在",
    "104":"玩家不在任何房间内",
    "105":"玩家在房间内",
    "106":"玩家在其它房间内",
    "107":"该房间当前正在游戏中",
    "108":"该房间内玩家已满",
    "109":"房间内有玩家存在",
    "110":"密码格式不正确",
    "111":"密码错误",
    "112":"房间权限发生错误",
    "113":"房间状态错误",
    "114":"所开房间数目已经达到上限，无法再创建房间",
    "9999":""
};


////
const  EGP_START__LOGIN = 2000;
const  EGP_START__GAME  = 3000;

const ENUM_MSG_PROTOCAL =
{
    "EGP_C2S_HEART":1000,
    "EGP_S2C_HEART":1001,

    ////////
    "EGP_C2S_LOGIN":EGP_START__LOGIN + 10,
    "EGP_S2C_LOGIN":EGP_START__LOGIN + 11,

    "EGP_S2C_RECONNECT_HALL":EGP_START__LOGIN + 12,
    "EGP_S2C_RECONNECT_READY":EGP_START__LOGIN + 13,
    "EGP_S2C_RECONNECT_ROOM":EGP_START__LOGIN + 14,

    "EGP_C2S_GETPLAYERDATA":EGP_START__LOGIN + 15,
    "EGP_S2C_GETPLAYERDATA":EGP_START__LOGIN + 16,

    ////////
    "EGP_C2S_CREATE_ROOM":EGP_START__LOGIN + 20,
    "EGP_S2C_CREATE_ROOM":EGP_START__LOGIN + 21,

    "EGP_C2S_ENTER_ROOM":EGP_START__LOGIN + 22,
    "EGP_S2C_ALL_ENTER_ROOM":EGP_START__LOGIN + 23,

    "EGP_C2S_LEAVE_ROOM":EGP_START__LOGIN + 24,
    "EGP_S2C_ALL_LEAVE_ROOM":EGP_START__LOGIN + 25,

    ////
    "EGP_C2S_DISBAND_ROOM":EGP_START__LOGIN + 26,         //解散房间请求
    "EPG_S2C_ALL_DISBAND_ROOM":EGP_START__LOGIN + 27,         //

    "EGP_C2S_DISBAND_RESPONSE":EGP_START__LOGIN + 28,         //解散房间响应
    "EGP_S2C_ALL_DISBAND_RESPONSE":EGP_START__LOGIN + 29,

    ////
    "EGP_C2S_DISBAND_ROOM_BY_OWNER":EGP_START__LOGIN + 30,
    "EGP_S2C_DISBAND_ROOM_BY_OWNER":EGP_START__LOGIN + 31,

    ////
    "EGP_C2S_REQUEST_ROOMLIST":EGP_START__LOGIN + 40,         //房主获取所开房间信息
    "EGP_S2C_REQUEST_ROOMLIST":EGP_START__LOGIN + 41,

    ////
    "EGP_C2S_FINDINVITER_INROOM":EGP_START__LOGIN + 52,
    "EGP_S2C_FINDINVITER_INROOM":EGP_START__LOGIN + 53,

    "EGP_C2S_PAY_VIP":EGP_START__LOGIN + 100,
    "EGP_S2C_PAY_VIP":EGP_START__LOGIN + 101,
};

const ENUM_MSG_GAME_PROTOCAL =
{
    ////////
    "EGP_C2S_APPLICATE_LEAVE":EGP_START__GAME + 4,            //申请离开房间
    "EGP_S2C_ALL_APPLICATE_LEAVE":EGP_START__GAME + 5,       //

    ////////
    "EGP_C2S_NEXT_AROUND":EGP_START__GAME + 8,                //开始下一盘游戏
    "EGP_S2C_NEXT_AROUND":EGP_START__GAME + 9,

    ////////
    "EGP_C2S_READYGAME":EGP_START__GAME + 10,                  //准备好了游戏
    "EGP_S2C_ALL_READYGAME":EGP_START__GAME + 11,             //

    "EGP_C2S_CANCELREADY":EGP_START__GAME + 12,                //取消了准备
    "EGP_S2C_ALL_CANCELREADY":EGP_START__GAME + 13,           //

    "EGP_C2S_FIGHT_ZHUANG":EGP_START__GAME + 14,              //抢庄
    "EGP_S2C_ALL_FIGHT_ZHUANG":EGP_START__GAME + 15,

    "EGP_C2S_ADD_DOUBLE":EGP_START__GAME + 16,                //加倍
    "EGP_S2C_ALL_ADD_DOUBLE":EGP_START__GAME + 17,

    "EGP_C2S_GET_LASTRESULT":EGP_START__GAME + 100,          //获取上一局游戏的分数
    "EGP_S2C_GET_LASTRESULT":EGP_START__GAME + 101,
};