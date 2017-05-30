/**
 * Created by Jack.L on 2017/5/11.
 */

const MSG_GAMEROOM_CONN =
{
    "type":"CONN",
    "game_id":GAME_CONTENT_ID,
    "room_id":0,
    "player_id":0,
    "exten":{}
};

const MSG_GAMEROOM_CHAT =
{
    "type":"CHAT",
    "info":""
};

var NetWorkForChat =
    (
        function()
        {
            var instance =
            {
                WebSocket:WebSocket | window.WebSocket | window.MozWebSocket,
                socket:null,
                isInit:false,
                room_id:0,
                player_id:0,
                callback_chat:null,
                start:function(_room_id, _player_id, _callback)
                {
                    this.room_id = _room_id;
                    this.player_id = _player_id;
                    this.callback_chat = _callback;

                    this.connect(IP_ADDRESS_CHAT);
                },
                connect:function(host)
                {
                    var SELF = this;

                    this.host = host;
                    this.socket = new WebSocket(this.host);

                    this.socket.onopen =
                        function(evt)
                        {
                            SELF.isInit = true;

                            ////////
                            //chat client is conn
                            var msg1 = extendDeep( MSG_GAMEROOM_CONN );
                            msg1.room_id = SELF.room_id;
                            msg1.player_id = SELF.player_id;

                            var msg2 = JSON.stringify(msg1);
                            var msg3 = BASE64.encoder(msg2);

                            SELF.send(msg3);

                        };

                    this.socket.onmessage =
                        function(evt)
                        {
                            try
                            {
                                var strData = BASE64.decoder(evt.data);
                                strData = transAscToStringArray(strData);
                                var data = JSON.parse(strData);

                                if( data )
                                {
                                    if( data.type == "CHAT" )
                                    {
                                        SELF.callback_chat(data.player_id, data.info);
                                    }
                                }
                            }
                            catch (e)
                            {

                            }
                        };

                    this.socket.onerror =
                        function(evt)
                        {

                        };

                    this.socket.onclose =
                        function(evt)
                        {

                        };
                },
                send:function(msg)
                {
                    if(this.isInit && this.socket.readyState == WebSocket.OPEN)
                    {
                        this.socket.send(msg);
                    }
                    else
                    {
                        cc.log('Chat Network Error on State:'+this.socket.readyState);
                    }
                },
                close:function()
                {
                    this.socket.close();
                    this.socket = null;
                },
                chat:function(info)
                {
                    if( !info )
                    {
                        return;
                    }

                    var msg1 = extendDeep( MSG_GAMEROOM_CHAT );
                    msg1.info = info;

                    var msg2 = JSON.stringify(msg1);
                    const msg3 = BASE64.encoder(msg2);

                    this.send(msg3);
                }
            };

            return instance;
        }
    )();