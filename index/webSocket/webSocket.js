function onMessage(event){var message=eval("("+event.data+")");switch(message.code){case 1:conmessage(message);break;case 3:if(message.remark==1){delmess(message)}else{if(message.remark==2){}}break;case 2:messageAdvice(message);break;case 4:delmess(message);break;case 5:disconnect();break;case 6:tempAuthMsg(message);break;case 0:totalNumber(message);break;case 7:Ext.example.msg(window.top.getIi18NText("operationTips"),"<font color='red'>"+window.top.getIi18NText(message.msg)+"</font>",null,3000);break}}function onOpen(a){}function onError(a){Ext.example.msg(window.top.getIi18NText("operationTips"),getIi18NText("errorException"));webSocket.close()}function onClose(a){Ext.example.msg(window.top.getIi18NText("operationTips"),getIi18NText("errorException"));webSocket.close()}function sendMessage(a){webSocket.send(a);return true}var timeout30,closeRightWindow,rightMessageWindow,detailMessageWin,timeoutRemoveRightWindwo;var timeout01,timeout02,timeout03,timeout04,timeout05,timeout06,rightTimeOutIndex=0;var rightMessageWinConfig={width:300,height:200};var rightHeight=50;var showTime=30000;var terIdArr=new Array();function rightWindow(a){var b=Ext.getBody();if(!Ext.getCmp("rightMessageWin")){var d=deviationDivide(b.getHeight(),(rightMessageWinConfig.height),100);var e=deviationDivide(b.getWidth(),rightMessageWinConfig.width,100);rightMessageWindow=Ext.create("Ext.window.Window",{id:"rightMessageWin",title:getIi18NText("message15"),closable:true,closeAction:"hide",resizable:false,draggable:false,shadow:false,bodyCls:"webSocketWinCls",x:e,y:d,width:rightMessageWinConfig.width,height:rightMessageWinConfig.height,layout:"vbox",padding:"0 0 0 0",items:[],bbar:[{xtype:"button",text:getIi18NText("message16"),id:"rightbtn",iconCls:"pback_finish_IconCls",handler:function(){openWindow(getIi18NText("message02"),"app_99_tid__temp","images/message/message02.png","messageIconCss","message!messageAdvice.action")}},{xtype:"textfield",id:"detailId",hidden:true,value:""}],close:function(){openMessageDetail=0;rightMessageWindow.hide();adviceServerCloseWindow()}});Ext.EventManager.onWindowResize(function(){var g=deviationDivide(b.getHeight(),rightMessageWindow.getHeight(),100);var h=deviationDivide(b.getWidth(),rightMessageWindow.getWidth(),100);rightMessageWindow.setX(h);rightMessageWindow.setY(g)});rightMessageWindow.show()}var f=Ext.getCmp("rightMessageWin");if(!f.isVisible()){f.removeAll();repositionRightWindowHeight();f.show()}if(f.items.length>=6){f.items.each(function(i,h,g){f.remove(h);return false})}rightTimeOutIndex++;var c=rightTimeOutIndex%6==0?6:rightTimeOutIndex%6;f.insert({xtype:"textarea",anchor:"100%",width:"100%",height:rightHeight,fieldBodyCls:"rightCss"+c,margin:"0 0 0 0",padding:"0 0 0 0",value:a,listeners:{afterrender:function(){getCurrTimeout(c)}}});f.doLayout();repositionRightWindowHeight()}closeRightWindow=function(){Ext.getCmp("rightMessageWin").hide();window.clearTimeout(timeout30);rightTimeOutIndex=0;terIdArr=[]};function getCurrTimeout(a){switch(a){case 1:if(timeout01){window.clearTimeout(timeout01)}timeout01=setTimeout("removeRightWindwo()",showTime);break;case 2:if(timeout02){window.clearTimeout(timeout02)}timeout02=setTimeout("removeRightWindwo()",showTime);break;case 3:if(timeout03){window.clearTimeout(timeout03)}timeout03=setTimeout("removeRightWindwo()",showTime);break;case 4:if(timeout04){window.clearTimeout(timeout04)}timeout04=setTimeout("removeRightWindwo()",showTime);break;case 5:if(timeout05){window.clearTimeout(timeout05)}timeout05=setTimeout("removeRightWindwo()",showTime);break;case 6:if(timeout06){window.clearTimeout(timeout06)}timeout06=setTimeout("removeRightWindwo()",showTime);break}}function deviationDivide(c,d,b){b=b/100;var a=0;if(c-d>0){a=(c-d)*b}return a}function repositionRightWindowHeight(){var g=Ext.getCmp("rightMessageWin");if(g){var b=Ext.getBody();if(g.items.length>=2){var c=g.items.length;var a=c*rightHeight;var d=rightMessageWinConfig.height-(2*rightHeight);g.setHeight(d+a)}else{g.setHeight(rightMessageWinConfig.height)}var e=deviationDivide(b.getHeight(),(g.getHeight()),100);var f=deviationDivide(b.getWidth(),g.getWidth(),100);g.setX(f);g.setY(e)}}function removeRightWindwo(){var a=Ext.getCmp("rightMessageWin");if(a.isVisible()){if(a.items.length>0){a.items.each(function(d,c,b){a.remove(c);return false})}if(a.items.length==0){closeRightWindow()}else{repositionRightWindowHeight()}}}function adviceServerCloseWindow(){if(terIdArr.length<=0){return}}function totalNumber(a){if(a.msg.number==0){$("#totalNumber2").css("height","0px");$("#totalNumber2").css("width","0px");if(document.getElementById("totalNumber")){$("#totalNumber").text("")}else{setTimeout(function(){$("#totalNumber").text("")},2000)}if(local=="noads_juli"){$("#totalNumber").text(0)}}else{$("#totalNumber2").css("height","20px");$("#totalNumber2").css("width","20px");if(document.getElementById("totalNumber")){$("#totalNumber").text(a.msg.number)}else{setTimeout(function(){$("#totalNumber").text(a.msg.number)},2000)}}var b=Ext.WindowManager.get(winIdPrefix+"app_99_tid__temp");if(b){messageUpdateLeft(a.msg.leftNumber)}}function messageAdvice(a){if(timeout30){window.clearTimeout(timeout30)}var c=a.msg.context;var b="";if(c instanceof Array){b=getMsgIi18NText(c)}if(a.msg.remark!=""){terIdArr.push(a.msg.remark)}rightWindow(b);timeout30=setTimeout("closeRightWindow()",showTime)}function conmessage(b){var c=b.tid;var a=b.tname;console.debug("信息：");console.debug(b);var d=b.remark;$("#messagelist").animate({top:"60px"},{duration:800,complete:function(){var f="";console.debug("名称："+b.tname);if(b.type==0){f='<td id="isvideo">'+getIi18NText("video")+"</td>"}else{f='<td id="isaudio">'+getIi18NText("audio")+"</td>"}var e="<tr>"+f+"<td id='"+c+"'>"+a+"</td><td id='"+d+'\'><button id="accept" onclick="acceptVideo(this)" class="accept btn-1 bubu">'+getIi18NText("yes")+'</button><button onclick="refuseVideo(this)" style="margin-left:13px;" id="refuse" class="refuse btn-1 bubu">'+getIi18NText("no")+"</button></td></tr>";$("#messagelist table tbody").append(e)}})}function acceptVideo(f){var c=$(f).parent().attr("id");staticterid=$(f).parent().prev().attr("id");var e=$(f).parent().prev().prev().attr("id");var b=$(f).parent().prev().text();console.info("tername:"+b+"   tid:"+staticterid);var a="";if(e=="isvideo"){a=showVideo(false,c,staticterid,true,b)}else{a=showAudio(c,staticterid,b)}if(a==0){return}$(f).parent().parent().remove();var d=$(f).parent().prev().attr("id");Ext.Ajax.request({url:"terminal!delTerminalMessage.action",params:{terid:d},method:"post"});check()}function delmess(c){if(c.code==3){c=c.tid;var a=c.split(";");for(var b=0;b<a.length;b++){$("#"+a[b]).parent().remove()}}else{if(c.code==4){$("#"+c.remark).parent().remove()}}check()}function refuseVideo(b){$(b).parent().parent().remove();var a=$(b).parent().prev().attr("id");Ext.Ajax.request({url:"terminal!delTerminalMessage2.action",params:{terid:a},method:"post"});check()}function check(){var a=$("#messagelist table tbody").children().size();if(a==0){$("#messagelist").animate({top:"-300px"},{duration:800})}}function helpaddyunid(){}function disconnect(){console.debug("关闭按钮触发");if(audioPanel&&!audioPanel.isHidden()){var a=document.getElementById("cancelAVoipCall");a.click()}else{if(videoPanel&&!videoPanel.isHidden()){var a=document.getElementById("cancelVoipCall");a.click()}}}function tempAuthMsg(c){if(c.display){var b=c.day>10?c.day:("0"+c.day);var d=c.hour>10?c.hour:("0"+c.hour);var a=c.min>10?c.min:("0"+c.min);if(getIi18NText("tian")=="天"){$("#lefttime").text(b+"天"+d+"时"+a+"分")}else{$("#lefttime").text(b+"d"+d+"h"+a+"m")}}else{$("#lintime").hide()}}var path="";if(serverPort=="8589"){path="wss://"+serverPath+"websocket"}else{path="ws://"+serverPath+"websocket"}var webSocket=new WebSocket(path);webSocket.onerror=function(a){onError(a)};webSocket.onopen=function(a){onOpen(a)};webSocket.onmessage=function(a){onMessage(a)};webSocket.onclose=function(a){onClose(event)};