/**
 * Created by Jack.L on 2017/5/31.
 */

if(wx_data && wx_data.WX_TICKET)
{
    const wx_ticket = wx_data.WX_TICKET;

    function initWxCommon()
    {
        wx.config(wx_ticket);

        wx.ready(
            function()
            {
                console.log('wx success');
            }
        );

        wx.error(
            function(res)
            {
                console.log('wx failed:'+res.message);
            }
        );
    }

    try
    {
        initWxCommon();
    }
    catch(e)
    {

    }

}