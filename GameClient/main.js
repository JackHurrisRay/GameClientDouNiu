/**
 * Created by Jack on 2017/3/25.
 */
function game_init()
{
    cc._commonDialog = new commonDlg(function(){cc._commonDialog.close();});
    cc._NoticeficationNode.addChild(cc._commonDialog);

    cc._commonDialogConfirm = new commonDlgConfirm();
    cc._NoticeficationNode.addChild(cc._commonDialogConfirm);

    cc._optionDialog = new optionDialog();
    cc._NoticeficationNode.addChild(cc._optionDialog);

    cc._waitDialog = new waitDlg();
    cc._NoticeficationNode.addChild(cc._waitDialog);

    ////////
    var _labelPing = cc.LabelTTF.create("PIN:0", FONT_NAME.FONT_ARIAL, 24);
    _labelPing.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
    _labelPing.setAnchorPoint(0.0, 0.0);
    cc._NoticeficationNode.addChild(_labelPing);
    cc._LabelPing = _labelPing;
    cc._LabelPing.setVisible(false);
};

function setPing(ping)
{
    var _value = ping;

    if( ping < 100 )
    {
        cc._LabelPing.setColor(cc.color(100,255,100));
    }
    else if( ping < 256 )
    {
        cc._LabelPing.setColor(cc.color(255,200,100));
    }
    else
    {
        cc._LabelPing.setColor(cc.color(255,100,100));

        if( _value > 456 )
        {
            _value = 456;
        }
    }

    cc._LabelPing.setString("PIN:" + _value.toString());
    if( _value == 0 )
    {
        cc._LabelPing.setVisible(false);
    }
    else if( !cc._LabelPing.isVisible() )
    {
        cc._LabelPing.setVisible(true);
        cc._LabelPing.runAction(cc.FadeIn.create(3, 255));
    }
}

function show_common_dialog(title, info)
{
    cc._commonDialog.setInfo(title, info);
    cc._commonDialog.show();
};

function show_confirm_dialog(title, info, callback)
{
    cc._commonDialogConfirm.setInfo(title, info);
    cc._commonDialogConfirm.setEvent(callback);
    cc._commonDialogConfirm.show();
}

function show_option_dialog()
{
    cc._optionDialog.show();
}

function showWaitDialog(show)
{
    if( show )
    {
        cc._waitDialog.show();
    }
    else
    {
        cc._waitDialog.close();
    }
}


////////
window.onload = function(){


    cc.game.onStart = function(){

        //
        cc.view.enableRetina(true);
        cc.view.setDesignResolutionSize(SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT,
            //cc.ResolutionPolicy.FIXED_WIDTH
            //cc.ResolutionPolicy.EXACT_FIT
            //cc.ResolutionPolicy.FIXED_HEIGHT
            cc.ResolutionPolicy.SHOW_ALL
        );

        cc.screen.requestFullScreen();

        cc._NoticeficationNode = cc.Node.create();
        cc.director.setNotificationNode(cc._NoticeficationNode);

        //
        cc._loaderImage = _LOADING_IMG;

        //load resources
        cc.LoaderScene.preload(gResource, function () {

            //game init
            game_init();

            //game start
            cc.director.runScene(new sceneLogin());
        }, this);
    };

    const bodyW = document.body.clientWidth;
    const bodyH = document.body.clientHeight;

    if( bodyW > bodyH )
    {
        document.getElementById('switchCcreen').style.display = 'none';
        runGameInstance();
    }
    else
    {
        document.getElementById('switchCcreen').style.display = 'block';
    }
};