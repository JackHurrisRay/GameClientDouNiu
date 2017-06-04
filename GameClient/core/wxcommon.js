/**
 * Created by Jack.L on 2017/5/31.
 */
var server_content =
{
    'game':1,
    'room':"",
    'inviter':""
};

if(wx_data)
{
    server_content.inviter = wx_data.ID;
}

function resetWxCommon(room_id)
{
    wx.config(wx_ticket);

    wx.ready(function(){

        wx.checkJsApi(
            {
                jsApiList:wx_ticket.jsApiList,
                success:function(res)
                {
                    console.log(JSON.stringify(res));
                }
            }
        );

        wx.hideAllNonBaseMenuItem();

        wx.hideMenuItems({
            menuList:[
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:editTag',
                'menuItem:delete',
                'menuItem:openWithSafari',
                'menuItem:share:email',
                'menuItem:share:brand',
            ]
        });

        wx.showMenuItems({
            menuList: [
                'menuItem:share:appMessage',
                'menuItem:share:timeline', // 分享到朋友圈
                'menuItem:copyUrl' // 复制链接
            ]
        });

        server_content.room = room_id;
        const _strServerContent =
        BASE64.encoder(JSON.stringify(server_content));

        wx.onMenuShareAppMessage(
            {
                title:"极品斗牛",
                desc:"最好玩的桌面扑克游戏，打开即玩!",
                link:"http://huyukongjian.cn/auth?content=" + _strServerContent,
                imgUrl:"http://5941game.oss-cn-qingdao.aliyuncs.com/douniu/JackGame.jpg",
                type:null,
                dataUrl:null,
                success:function()
                {
                    console.log('wx set success for room=' + room_id.toString());
                    return;
                },
                cacel:function()
                {
                    return;
                }
            }
        );

        wx.onMenuShareTimeline(
            {
                title:"极品斗牛--朋友圈里玩疯的桌面扑克，居家旅行必备，勿需下载，打开既玩",
                link:"http://huyukongjian.cn/auth?game=1",
                imgUrl:"http://5941game.oss-cn-qingdao.aliyuncs.com/douniu/JackGame.jpg",
                type:null,
                dataUrl:null,
                success:function()
                {
                    return;
                },
                cacel:function()
                {
                    return;
                }
            }
        );

        wx.error(
            function(res)
            {
                console.log('wx failed:'+res.errMsg);
            }
        );

    });
}

function initWxCommon()
{
    resetWxCommon(null);
}

function wxShareAppMsg()
{
    wx.showMenuItems({
        menuList: [
            'menuItem:share:appMessage',
            'menuItem:share:timeline', // 分享到朋友圈
            'menuItem:copyUrl' // 复制链接
        ],
        success: function (res) {
            //alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
            console.log(JSON.stringify(res));
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
            console.log(JSON.stringify(res));
        }
    });

    //wx.showOptionMenu();

}

if(wx_data && wx_data.ticket)
{
    var wx_ticket = wx_data.ticket;
    initWxCommon();
}

