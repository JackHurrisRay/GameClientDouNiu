/**
 * Created by Administrator on 2017/3/2 0002.
 */
var NetWorkSystem =
    (
        function()
        {
            var instance = {
                WebSocket: WebSocket || window.WebSocket || window.MozWebSocket,
                socket:null,
                isinit:false,
                _MSG_COUNT:0,
                initNetwork:function(_host){
                    cc.log('Network initSocket...');
                    var SELF = this;

                    this.host   = _host;
                    this.socket = new WebSocket(this.host);

                    this.socket.onopen = function(evt){
                        cc.log('Network onopen...');
                        SELF.isinit = true;

                        clientSystem.getInstance().login();
                    };

                    this.socket.onmessage = function(evt){
                        ////
                        var data = evt.data;

                        ////
                        var _dataObj = JSON.parse(data);
                        clientSystem.getInstance().recv(_dataObj);

                        SELF._MSG_COUNT -= 1;

                        ////
                        //cc.log('Network onmessage...' + data + '******MSG COUNT:' + SELF._MSG_COUNT.toString() + "******");
                        showWaitDialog(false);

                    };

                    this.socket.onerror = function(evt){
                        cc.log('Network onerror...');
                        clientSystem.getInstance().onError(evt);

                        showWaitDialog(false);
                        TDGA.onPageLeave();
                    };

                    this.socket.onclose = function(evt){
                        cc.log('Network onclose...');
                        SELF.isinit = false;

                        showWaitDialog(false);
                        TDGA.onPageLeave();

                        ////
                        //reconnect
                        //clientSystem.getInstance().conn();
                    };
                },
                send:function(data){
                    if(!this.isinit)
                    {
                        cc.log('Network is not inited...');
                    }
                    else if(this.socket.readyState == WebSocket.OPEN)
                    {
                        //cc.log('Network send:'+data);
                        this.socket.send(data);
                        this._MSG_COUNT += 1;
                    }
                    else
                    {
                        cc.log('Network WebSocket readState:'+this.socket.readyState);
                    }
                },
                isInit:function()
                {
                    return this.socket && this.isinit;
                },
                msgCountInQuere:function()
                {
                    return this._MSG_COUNT;
                },
                close:function(){
                    if (this.socket){
                        cc.log("Network close...");
                        this.socket.close();
                        this.socket = null;

                        TDGA.onPageLeave();
                    }
                }
            };

            return instance;
        }
    )();

function SEND_MSG(msg, nowait)
{
    if( !NetWorkSystem.isInit() )
    {
        clientSystem.getInstance().onError(null);
        return;
    }

    var _strMessage = JSON.stringify(msg);
    var _len = _strMessage.length;

    if( !nowait )
    {
        showWaitDialog(true);
    }

    NetWorkSystem.send(_strMessage);
};

