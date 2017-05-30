/**
 * Created by Jack on 2017/2/22 0022.
 */
const FONT_NAME =
{
    FONT_ARIAL:"Arial",
    FONT_THONBURI:"Thonburi",
    FONT_APPLEGOTHIC:"AppleGothic",
    FONT_HEITI:"黑体",
    FONT_YOUYUAN:"幼圆",

    FONT_SKETCHFLOW_PRINT:"SketchFlow Print",
    FONT_BRADLEY_HAND_ITC:"Bradley Hand ITC",
};

const SCREEN_SIZE =
{
    WIDTH:1334,
    HEIGHT:750
};

const SOURCE_PATH = "http://app.huyukongjian.cn/douniu/";
const WX_IMG_PATH = "http://app.huyukongjian.cn/account_wx_img/";

const BM_FONT =
{
    "winscore":{
        "FNT":SOURCE_PATH + "res/font/win_scoreempty.fnt",
        "PNG":SOURCE_PATH + "res/font/win_scoreempty.png"
    },
    "failedscore":{
        "FNT":SOURCE_PATH + "res/font/failed_scoreempty.fnt",
        "PNG":SOURCE_PATH + "res/font/failed_scoreempty.png"
    }
};

const res_bmFont =
    [
        BM_FONT.winscore.FNT,
        BM_FONT.winscore.PNG,
        BM_FONT.failedscore.FNT,
        BM_FONT.failedscore.PNG,
    ];

////////
const res_javascript =
    [
        ////
        "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js",
        "http://game.huyukongjian.cn/common/base64.js",
        "http://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js",
        "http://res.wx.qq.com/open/js/jweixin-1.2.0.js",

        ////
        SOURCE_PATH + "core/uiTouchSprite.js",
    ];

const res_jsgame =
    [
        ////
        SOURCE_PATH + "game/network.js",
        SOURCE_PATH + "game/protocal.js",
        SOURCE_PATH + "game/message.js",

        ////
        SOURCE_PATH + "game/option.js",
        SOURCE_PATH + "game/network_chat.js",

        ////
        SOURCE_PATH + "game/checkBox.js",
        SOURCE_PATH + "game/optionDialog.js",
        SOURCE_PATH + "game/chatPanel.js",

        ////
        SOURCE_PATH + "game/commonDlg.js",
        SOURCE_PATH + "game/commonDlgConfirm.js",

        ////
        SOURCE_PATH + "game/sceneHall.js",
        SOURCE_PATH + "game/sceneLogin.js",
        SOURCE_PATH + "game/sceneCreateRoom.js",
        SOURCE_PATH + "game/clientSystem.js",

        ////
        SOURCE_PATH + "game/roomPlayer.js",
        SOURCE_PATH + "game/PokeCardView.js",
        SOURCE_PATH + "game/sceneRoom.js",

        SOURCE_PATH + "game/totalResultDialog.js",
        SOURCE_PATH + "game/applicateLeaveDialog.js",
    ];

const res_particles =
    [
        SOURCE_PATH + "res/particles/BoilingFoam.plist",
        SOURCE_PATH + "res/particles/Comet.plist"
    ];

const res_backgroundmusic =
{
    "inhall":SOURCE_PATH + "res/music/inhall.mp3",
    "ingame":SOURCE_PATH + "res/music/ingame.mp3"
};

const res_sound =
{
    "door":SOURCE_PATH + "res/soundeffect/door.wav",
    "touch":SOURCE_PATH + "res/soundeffect/touch.wav"
};

const res_music =
    [
        res_backgroundmusic.inhall,
        res_backgroundmusic.ingame,

        ////
        res_sound.door,
        res_sound.touch,

    ];


const res_common =
{
    COMMON_DIALOG:SOURCE_PATH + "res/common/common_dialog.png",
    COMMON_BACK:SOURCE_PATH + "res/common/common_back.png"
};

const res_login =
{
    LOGIN_PNG:SOURCE_PATH + "res/login/ui_login.png",
    LOGIN_PLIST:SOURCE_PATH + "res/login/ui_login.plist"
};

const res_hall = {
    HALL_PNG:SOURCE_PATH + "res/hall/ui_hall.png",
    HALL_PLIST:SOURCE_PATH + "res/hall/ui_hall.plist",

    HALL_DLG_PNG:SOURCE_PATH + "res/hall/ui_hall_dlg.png",
    HALL_DLG_PLIST:SOURCE_PATH + "res/hall/ui_hall_dlg.plist",
};

const res_room = {
    ROOM_PNG:SOURCE_PATH + "res/room/ui_room.png",
    ROOM_PLIST:SOURCE_PATH + "res/room/ui_room.plist",

    WINTYPE_PNG:SOURCE_PATH + "res/room/douniu_wintype.png",
    WINTYPE_PLIST:SOURCE_PATH + "res/room/douniu_wintype.plist",

    POKECARD_PNG:SOURCE_PATH + "res/pokecard/pokecard.png",
    POKECARD_PLIST:SOURCE_PATH + "res/pokecard/pokecard.plist",

    EDITBOX_BACK_PNG:SOURCE_PATH + "res/room/editbox_back.png",
};

const res_background =
{
    BG_LOGIN:SOURCE_PATH + "res/login/background_login.jpg",
    BG_MAIN:SOURCE_PATH + "res/hall/background_main.jpg",
    BG_MAIN_DLG:SOURCE_PATH + "res/hall/bg_main_dialog.jpg",
    BG_ROOM:SOURCE_PATH + "res/room/background_room.jpg",
    BG_GAME:SOURCE_PATH + "res/room/background_game.jpg",
};

const res_shader =
{
    ////
    VS_NORMAL:SOURCE_PATH + "res/shader/normal.vsh",

    ////
    PS_AROUND_RECT:SOURCE_PATH + "res/shader/around_rect.fsh"
};

var gResource = [

    ////
    res_shader.VS_NORMAL,
    res_shader.PS_AROUND_RECT,

    ////
    res_common.COMMON_DIALOG,
    res_common.COMMON_BACK,

    ////
    res_background.BG_LOGIN,
    res_background.BG_MAIN,
    res_background.BG_MAIN_DLG,
    res_background.BG_ROOM,
    res_background.BG_GAME,

    ////
    res_login.LOGIN_PLIST,
    res_login.LOGIN_PNG,

    res_hall.HALL_PLIST,
    res_hall.HALL_PNG,
    res_hall.HALL_DLG_PLIST,
    res_hall.HALL_DLG_PNG,

    res_room.ROOM_PLIST,
    res_room.ROOM_PNG,
    res_room.POKECARD_PLIST,
    res_room.POKECARD_PNG,

    res_room.WINTYPE_PLIST,
    res_room.WINTYPE_PNG,
];


var IP_ADDRESS =
    "ws://59.110.30.245:2017";
    //"ws://192.168.3.17:2017";

const IP_ADDRESS_CHAT =
    "ws://47.92.100.9:1949";
    //"ws://47.92.88.155:1949";

const GAME_CONTENT_ID = "1493699600774844";

gResource = gResource.concat(res_javascript);
gResource = gResource.concat(res_particles);
gResource = gResource.concat(res_music);
gResource = gResource.concat(res_bmFont);
gResource = gResource.concat(res_jsgame);
