var winIdPrefix="__Win_";var appSuffix="__temp";var taskPrefix="__taskToolbar_";var subShowStr;var isUpload=false;var mUploader;var searchFn;var openMessageSetting=false,openMessageDetail=0;var PhotoGet;var uploader;var globleWin;var loginInfo;var messageWin;var floderOfUploadId=0;var index,moidfyWin,maxWinFn,frmaeWindowFn,uploadFileWindow,previewWin,getRateFn,layoutWinFn,modifyPasswordFn;var showVideo;var showAudio;var changeVideoShow;var deleteYunRequest;var videoPanel;var audioPanel;var photos=new Array();var namespp=new Array();var photonum=0;var commonSearchArray=[];var isonline=false;var isoffline=false;var isweiline=false;var isactivePro=false;var isnorPro=false;var isweiPro=false;var openSysAuth=0;var openSysAuthLin=0;var staticterid;var islogin=false;var starttime;var endtime;var timestamp;var myVid;var myVideo;var timeshow;var isVideoRun;var intro;var titnum="top01";var infofn=function(){$("#sysInfo").html("<p class='sysInfopp' >"+getIi18NText("terProInfo")+"</p> <a id='daDo' href='javascript:infofn();' onmousedown='dianDown(1)'><em class='pic'></em>"+getIi18NText("refresh")+"</a>");$("#onlineTer").html("<p>"+getIi18NText("onlineTer")+"：</p><span id='sonlineTer'>0</span>");$("#offlineTer").html("<p>"+getIi18NText("offlineTer")+"：</p><span id='sofflineTer'>0</span>");$("#activeNum").html("<p>"+getIi18NText("inactiveTer")+"：</p><span id='sactiveNum'>0</span>");$("#activePro").html("<p>"+getIi18NText("activeProgram")+"：</p><span  id='sactivePro'>0</span>");$("#norPro").html("<p>"+getIi18NText("normalProgram")+"：</p><span id='snorPro'>0</span>");$("#weiPro").html("<p>"+getIi18NText("noAuditpro")+"：</p><span id='sweiPro'>0</span>");$("#lishi").html("<a id='lisss' href='javascript:paiqiFn()' onmousedown='dianDown(2)'  onmouseup='dianUp()' ><em class='pic'></em>"+getIi18NText("schedulingTaskList")+"</a>	<div class='downpartCssr' ><span  class='sysbtnr' id='rigistBu'> <img src='"+BASEPATH+"images/skin/me_w.png' title='"+getIi18NText("registCode")+"' width='25px' height='25px'></span></div>");$("#rigist").html("	<div class='rigistDiv'><ul><li   ><span class='qians' >"+getIi18NText("activeCode")+"</span><input  id='activeCode' value='000-000-000-000' class='tithou'  readOnly   /></li><li  ><span class='qians' >"+getIi18NText("letterCode")+"</span><input  id='simpCode' value='000-000-000-000' class='tithou'  readOnly   /></li><li class='howch'  ><span title='"+getIi18NText("chooseActive")+"&#10;"+getIi18NText("chooseLetter")+"' class='hous'  >"+getIi18NText("howChoose")+"<span  style='font-size:20px;'>？</span></span><span class='switchcode' title='"+getIi18NText("jsp_msg_switchcode")+"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li></ul></div>");if(isInter=="true"){$("#rigist").hide();$("#rigistBu").hide()}$("#norPro").hide();Ext.Ajax.request({url:"auth!terminalInfo.action",method:"post",success:function(c,a){if(c&&!Ext.isEmpty(c.responseText)){var b=Ext.JSON.decode(c.responseText);$("#sonlineTer").html(b.onlineTer);$("#sofflineTer").html(b.offlineTer);$("#sactiveNum").html(b.activeNum);$("#sactivePro").html(b.activePro);$("#snorPro").html(b.norPro);$("#sweiPro").html(b.weiPro);switchcodeFn(b.active,b.simple,1);if($("#activeCode").val()=="000-000-000-000"){reqAuthcodeFn()}}}});$(".sysInfopp").mousedown(function(c){var d=$(".sysInfopp");if(!c){c=window.event}var b=c.layerX?c.layerX:c.offsetX,e=c.layerY?c.layerY:c.offsetY;if(d.setCapture){d.setCapture()}else{if(window.captureEvents){window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP)}}$(".sysInfopp").mousemove(function(h){if(!h){h=window.event}if(!h.pageX){h.pageX=h.clientX}if(!h.pageY){h.pageY=h.clientY}var g=h.pageX-b,f=h.pageY-e;$("#terminalInfo").css("left",g);$("#terminalInfo").css("top",f)});$(".sysInfopp").mouseout(function(){if($(".sysInfopp").releaseCapture){$(".sysInfopp").releaseCapture()}else{if(window.captureEvents){window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP|Event.MOUSEOUT)}}$(".sysInfopp").unbind("mousemove");$(".sysInfopp").unbind("mouseup");$(".sysInfopp").unbind("mouseout")});$(".sysInfopp").mouseup(function(){if($(".sysInfopp").releaseCapture){$(".sysInfopp").releaseCapture()}else{if(window.captureEvents){window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP|Event.MOUSEOUT)}}$(".sysInfopp").unbind("mousemove");$(".sysInfopp").unbind("mouseup");$(".sysInfopp").unbind("mouseout")})});addEvet()};function addEvet(){if(hasAuth){$("#lintime").click(function(){openSysAuthLin=1;openWindow(getIi18NText("systemMaintenance"),"app_4_tid__temp","images/app/set.png","sysIconCss","system!systemTabar.action")})}$("#rigistBu").click(function(){if($(this).children("img").attr("src")==BASEPATH+"images/skin/me_p.png"){$(this).children("img").attr("src",BASEPATH+"images/skin/me_w.png");$("#rigist").fadeIn("normal")}else{$(this).children("img").attr("src",BASEPATH+"images/skin/me_p.png");$("#rigist").fadeOut("normal")}});$("#rigistBu").hover(function(){if($(this).children("img").attr("src")==BASEPATH+"images/skin/me_w.png"){$(this).children("img").attr("src",BASEPATH+"images/skin/me_b.png")}},function(){if($(this).children("img").attr("src")==BASEPATH+"images/skin/me_b.png"){$(this).children("img").attr("src",BASEPATH+"images/skin/me_w.png")}})}function ignoreFn(){Ext.Ajax.request({url:"auth!deleteSession.action",method:"post",params:{n:"isFirst"}})}var startIntro=function(){intro=introJs();intro.setOptions({nextLabel:getIi18NText("intro_msg1"),prevLabel:getIi18NText("intro_msg2"),skipLabel:getIi18NText("intro_msg3"),doneLabel:getIi18NText("intro_msg4"),exitOnEsc:false,tooltipPosition:"auto",positionPrecedence:["left","right","bottom","top"],exitOnOverlayClick:false,showBullets:false,steps:[{intro:"<b >"+getIi18NText("intro_msg_emedia")+welcomeTips+"</b>"},{element:"#bigkuang2",intro:"<b >"+getIi18NText("intro_msg7")+"</b>"},{element:"#bigkuang1",intro:"<b >"+getIi18NText("intro_msg22")+"</b>"},{element:"#userHead_div",intro:"<b >"+getIi18NText("intro_msg9")+"</b>"},{element:".bodyInfo",intro:"<b >"+getIi18NText("intro_msg10")+"</b>",},{element:"#lishi",intro:"<b >"+getIi18NText("intro_msg11")+"</b>"}]});intro.oncomplete(function(){ignoreFn();if(istercode){if(isintro){openSysAuth=2}else{openSysAuth=3}}else{if(isintro){openSysAuth=1}else{openSysAuth=0}}if(openSysAuth!=0){openWindow(getIi18NText("systemMaintenance"),"app_4_tid__temp","images/app/set.png","sysIconCss","system!systemTabar.action")}$(".nameCss").attr("style","color:white;");$(".groupNameCss").attr("style","color:white;");$(".titwhite").attr("style","color:white;");addEvet()});intro.onexit(function(){ignoreFn();openSysAuth=0;$(".nameCss").attr("style","color:white;");$(".groupNameCss").attr("style","color:white;");$(".titwhite").attr("style","color:white;");addEvet()});if(istercode){intro.addStep({element:"#rigist",intro:"<b >"+getIi18NText("intro_msg12")+"</b>",})}else{if(isintro){intro.addStep({element:"#rigist",intro:"<b >"+getIi18NText("intro_msg13")+"</b>",})}else{intro.setOption("doneLabel",getIi18NText("complete"));intro.addStep({element:"#rigist",intro:"<b >"+getIi18NText("intro_msg14")+"</b>",})}}intro.start();$(".nameCss").attr("style","color:#25A2E2;");$(".groupNameCss").attr("style","color:#25A2E2;");$(".titwhite").attr("style","color:#25A2E2;");$("#rigistBu").unbind();$("#lintime").unbind("click");openSysAuthLin=0};var startIntro1=function(){intro=introJs();intro.setOptions({nextLabel:getIi18NText("intro_msg1"),prevLabel:getIi18NText("intro_msg2"),skipLabel:getIi18NText("intro_msg3"),doneLabel:getIi18NText("intro_msg4"),exitOnEsc:false,tooltipPosition:"auto",positionPrecedence:["left","right","bottom","top"],exitOnOverlayClick:false,showBullets:false,steps:[{intro:"<b >"+getIi18NText("intro_msg15")+"</b>"},{element:".bodyInfo",intro:"<b >"+getIi18NText("intro_msg16")+"</b>",}]});intro.oncomplete(function(){openSysAuth=1;openWindow(getIi18NText("systemMaintenance"),"app_4_tid__temp","images/app/set.png","sysIconCss","system!systemTabar.action")});intro.onexit(function(){openSysAuth=0});intro.start()};$(function(){index={doFlag:true,main:function(){index.initPage();index.initEvent();index.autoSize();index.initTerInfo()},initTerInfo:function(){infofn();var a=this;$(".terin").css({cursor:"pointer"});$(".onlineTer").click(function(){isonline=true;openWindow(getIi18NText("terminalMaintenance"),"app_2_tid","images/app/two_terxiu.png","two_terxiuIconCss","terminal!terminalTabar.action","images/app/icon_two_terxiu.png")});$(".offlineTer").click(function(){isoffline=true;openWindow(getIi18NText("terminalMaintenance"),"app_2_tid","images/app/two_terxiu.png","two_terxiuIconCss","terminal!terminalTabar.action","images/app/icon_two_terxiu.png")});$(".activeNum").click(function(){isweiline=true;openWindow(getIi18NText("terminalMaintenance"),"app_2_tid","images/app/two_terxiu.png","two_terxiuIconCss","terminal!terminalTabar.action","images/app/icon_two_terxiu.png")});$(".activePro").click(function(){openWindow(getIi18NText("programEditor"),"app_1_tid","images/app/two_proedite.png","proIconCss","item!proTabar.action","images/app/icon_program.png")});$(".norPro").click(function(){openWindow(getIi18NText("programEditor"),"app_1_tid","images/app/two_proedite.png","proIconCss","item!proTabar.action","images/app/icon_program.png")});$(".weiPro").click(function(){isweiPro=true;openWindow(getIi18NText("programEditor"),"app_1_tid","images/app/two_proedite.png","proIconCss","item!proTabar.action","images/app/icon_program.png")});window.setInterval(function(){infofn()},1000*60*5);if(isFirst){startIntro()}else{if(isintro){startIntro1()}}},initPage:function(){var b=101;var a;if("elevator"==local){a=[[{id:b++,name:getIi18NText("sourceManager"),imgsrc:"two_source.png",tooIconCls:"two_storeIconCss",backColor:"#d7bed9",url:"source!sourceNewTabar.action",topconCls:"icon_store.png",otherColor:"#d7bdda"},{id:b++,name:getIi18NText("programEditor"),imgsrc:"two_proedite.png",tooIconCls:"proIconCss",backColor:"#f5d6e3",url:"item!proTabar.action",topconCls:"icon_program.png",otherColor:"transparent"},{id:b++,name:getIi18NText("terminalMaintenance"),imgsrc:"two_terxiu.png",tooIconCls:"two_terxiuIconCss",backColor:"#d99bbd",url:"terminal!terminalTabarNew.action",topconCls:"icon_two_terxiu.png",otherColor:"transparent"},{id:b++,name:getIi18NText("quickRelease"),imgsrc:"two_quick.png",tooIconCls:"two_quickIconCss",backColor:"#c1e3ec",url:"item!quickRelease.action",topconCls:"icon_two_quick.png",otherColor:"#c1e1ec"},{id:b++,name:getIi18NText("videomonitor"),imgsrc:"videoIcon.png",tooIconCls:"videoIconIconCss",backColor:"#e0d5df",url:"terminal!videoTabar.action",topconCls:"videoIcon_app.png",otherColor:"transparent"},{id:b++,name:getIi18NText("pushSource"),imgsrc:"two_source.png",tooIconCls:"two_storeIconCss",backColor:"#d7bed9",url:"elevator!pushSource.action",topconCls:"icon_store.png",otherColor:"#d7bdda"}],[{id:b++,name:getIi18NText("userset"),imgsrc:"two_user.png",tooIconCls:"two_userIconCss",backColor:"#59c1f5",url:"auth!userTabar.action",topconCls:"icon_user.png",otherColor:"transparent"},{id:b++,name:getIi18NText("systemMaintenance"),imgsrc:"two_set.png",tooIconCls:"two_setIconCss",backColor:"#6eb2f6",url:"system!systemTabar.action",topconCls:"icon_set.png",otherColor:"transparent"},{id:b++,name:getIi18NText("datastatistics"),imgsrc:"operatingStatistics.png",tooIconCls:"operatingStatisticsIconCss",backColor:"#a5ccf0",url:"statistics!statisticsTabarLess.action",topconCls:"icon_operatingStatistics.png",otherColor:"transparent"}]]}else{if("livetoy"==local){a=[[{id:b++,name:getIi18NText("sourceManager"),imgsrc:"two_source.png",tooIconCls:"two_storeIconCss",backColor:"#d7bed9",url:"source!sourceNewTabar.action",topconCls:"icon_store.png",otherColor:"#d7bdda"},{id:b++,name:getIi18NText("programEditor"),imgsrc:"two_proedite.png",tooIconCls:"proIconCss",backColor:"#f5d6e3",url:"item!proTabar.action",topconCls:"icon_program.png",otherColor:"transparent"},{id:b++,name:getIi18NText("terminalMaintenance"),imgsrc:"two_terxiu.png",tooIconCls:"two_terxiuIconCss",backColor:"#d99bbd",url:"terminal!terminalTabarNew.action",topconCls:"icon_two_terxiu.png",otherColor:"transparent"},{id:b++,name:getIi18NText("quickRelease"),imgsrc:"two_quick.png",tooIconCls:"two_quickIconCss",backColor:"#c1e3ec",url:"item!quickRelease.action",topconCls:"icon_two_quick.png",otherColor:"#c1e1ec"},{id:b++,name:getIi18NText("videomonitor"),imgsrc:"videoIcon.png",tooIconCls:"videoIconIconCss",backColor:"#e0d5df",url:"terminal!videoTabar.action",topconCls:"videoIcon_app.png",otherColor:"transparent"},{id:b++,name:getIi18NText("toyManage"),imgsrc:"videoIcon.png",tooIconCls:"videoIconIconCss",backColor:"#e0d5df",url:"livetoy!toyTabar.action",topconCls:"videoIcon_app.png",otherColor:"transparent"}],[{id:b++,name:getIi18NText("userset"),imgsrc:"two_user.png",tooIconCls:"two_userIconCss",backColor:"#59c1f5",url:"auth!userTabar.action",topconCls:"icon_user.png",otherColor:"transparent"},{id:b++,name:getIi18NText("systemMaintenance"),imgsrc:"two_set.png",tooIconCls:"two_setIconCss",backColor:"#6eb2f6",url:"system!systemTabar.action",topconCls:"icon_set.png",otherColor:"transparent"},{id:b++,name:getIi18NText("datastatistics"),imgsrc:"operatingStatistics.png",tooIconCls:"operatingStatisticsIconCss",backColor:"#a5ccf0",url:"statistics!statisticsTabarLess.action",topconCls:"icon_operatingStatistics.png",otherColor:"transparent"}]]}else{if("emedia"==local){a=[[{id:b++,name:getIi18NText("sourceManager"),imgsrc:"two_source.png",tooIconCls:"two_storeIconCss",backColor:"#d7bed9",url:"source!sourceNewTabar.action",topconCls:"icon_store.png",otherColor:"#d7bdda"},{id:b++,name:getIi18NText("programEditor"),imgsrc:"two_proedite.png",tooIconCls:"proIconCss",backColor:"#f5d6e3",url:"item!proTabar.action",topconCls:"icon_program.png",otherColor:"transparent"},{id:b++,name:getIi18NText("terminalMaintenance"),imgsrc:"two_terxiu.png",tooIconCls:"two_terxiuIconCss",backColor:"#d99bbd",url:"terminal!terminalTabarNew.action",topconCls:"icon_two_terxiu.png",otherColor:"transparent"},{id:b++,name:getIi18NText("quickRelease"),imgsrc:"two_quick.png",tooIconCls:"two_quickIconCss",backColor:"#c1e3ec",url:"item!quickRelease.action",topconCls:"icon_two_quick.png",otherColor:"#c1e1ec"}],[{id:b++,name:getIi18NText("userset"),imgsrc:"two_user.png",tooIconCls:"two_userIconCss",backColor:"#59c1f5",url:"auth!userTabar.action",topconCls:"icon_user.png",otherColor:"transparent"},{id:b++,name:getIi18NText("systemMaintenance"),imgsrc:"two_set.png",tooIconCls:"two_setIconCss",backColor:"#6eb2f6",url:"system!systemTabar.action",topconCls:"icon_set.png",otherColor:"transparent"},{id:b++,name:getIi18NText("datastatistics"),imgsrc:"operatingStatistics.png",tooIconCls:"operatingStatisticsIconCss",backColor:"#a5ccf0",url:"statistics!statisticsTabarLess.action",topconCls:"icon_operatingStatistics.png",otherColor:"transparent"}]]}else{a=[[{id:b++,name:getIi18NText("sourceManager"),imgsrc:"two_source.png",tooIconCls:"two_storeIconCss",backColor:"#d7bed9",url:"source!sourceNewTabar.action",topconCls:"icon_store.png",otherColor:"#d7bdda"},{id:b++,name:getIi18NText("programEditor"),imgsrc:"two_proedite.png",tooIconCls:"proIconCss",backColor:"#f5d6e3",url:"item!proTabar.action",topconCls:"icon_program.png",otherColor:"transparent"},{id:b++,name:getIi18NText("terminalMaintenance"),imgsrc:"two_terxiu.png",tooIconCls:"two_terxiuIconCss",backColor:"#d99bbd",url:"terminal!terminalTabarNew.action",topconCls:"icon_two_terxiu.png",otherColor:"transparent"},{id:b++,name:getIi18NText("quickRelease"),imgsrc:"two_quick.png",tooIconCls:"two_quickIconCss",backColor:"#c1e3ec",url:"item!quickRelease.action",topconCls:"icon_two_quick.png",otherColor:"#c1e1ec"},{id:b++,name:getIi18NText("RenewalManage"),imgsrc:"pay.png",tooIconCls:"terminalPayCss",backColor:"#b0c7ed",url:"terminal!renewalManage.action",topconCls:"icon_pay.png",otherColor:"transparent"}],[{id:b++,name:getIi18NText("userset"),imgsrc:"two_user.png",tooIconCls:"two_userIconCss",backColor:"#59c1f5",url:"auth!userTabar.action",topconCls:"icon_user.png",otherColor:"transparent"},{id:b++,name:getIi18NText("systemMaintenance"),imgsrc:"two_set.png",tooIconCls:"two_setIconCss",backColor:"#6eb2f6",url:"system!systemTabar.action",topconCls:"icon_set.png",otherColor:"transparent"},{id:b++,name:getIi18NText("datastatistics"),imgsrc:"operatingStatistics.png",tooIconCls:"operatingStatisticsIconCss",backColor:"#a5ccf0",url:"statistics!statisticsTabarLess.action",topconCls:"icon_operatingStatistics.png",otherColor:"transparent"}]]}}}$(".cTable2").css({top:$(window).height()-50});this.initUser();this.createApp(a);this.versionpagectrl()},versionpagectrl:function(){if(acenter){document.getElementById("azldlogo_title").style.display="block"}},initUser:function(){var e=$("#nowPickName").val();var g=$("#userName").val();var c="default.png";$("#showUserName").attr("title",e).text(this.subShowStr(e,10));$("#showUserGroupName").attr("title",g).text(this.subShowStr(g,7));if(leftTime!="null"){$("#lintime").html(getIi18NText("tempTime")+"：<span id='lefttime' >07:00:00</span>");if(hasAuth){$("#lintime").attr("style","cursor:pointer;");$("#lintime").click(function(){openSysAuthLin=1;openWindow(getIi18NText("systemMaintenance"),"app_4_tid__temp","images/app/set.png","sysIconCss","system!systemTabar.action")})}var a=leftTime.split("#");var d=a[0]>=10?a[0]:("0"+a[0]);var f=a[1]>=10?a[1]:("0"+a[1]);var b=a[2]>=10?a[2]:("0"+a[2]);if(getIi18NText("tian")=="天"){$("#lefttime").text(d+"天"+f+"时"+b+"分")}else{$("#lefttime").text(d+"d"+f+"h"+b+"m")}$("#lintime").show()}else{$("#lintime").hide()}},initEvent:function(){$(document).bind("contextmenu",function(b){window.event.returnValue=false;return false}).bind("selectstart",function(){window.event.returnValue=false;return false}).bind("help",function(){return false}).bind("keydown",function(b){if(b.shiftKey&&b.keyCode==121){b.returnValue=false;return false}});var a=this;window.onresize=function(){a.autoSize()}},createApp:function(d){var f=this;var e="";var b="images/app/";var j="images/skin/";var g=1;var h=0;e+="<div class='contentdiv ovfl'>";for(var c=0;c<2;c++){if(c==1){e+="<div class='bigkuang1 ovfl' id='bigkuang1' ><div id='systemsettop' class='systemsettopCss2'><span class='systitle titwhite' style='color:white'>"+getIi18NText("systemSetting")+"</span></div>"}else{e+="<div class='bigkuang2 ovfl' id='bigkuang2' ><div id='systemsettop' class='systemsettopCss2'><span class='systitle'>"+getIi18NText("ADarea")+"</span></div>"}e+="<div class='botitCss ovfl' id='botittop0"+(g++)+"'>";for(var a=0;a<d[c].length;a++){if(d[c][a]["name"]==getIi18NText("RenewalManage")){if(!acenter||!admin){continue}}e+='<div style="float:left;background: '+d[c][a]["backColor"]+";background-size:100% 100%;width:132px;height:106px;background-repeat:no-repeat;border:2px solid "+d[c][a]["otherColor"]+';float:left;"  urlData="'+d[c][a]["url"]+'" id="app_'+h+'_tid" pname="'+d[c][a]["name"]+'" topconCls="images/app/'+d[c][a]["topconCls"]+'" ticonCls="'+d[c][a]["tooIconCls"]+'">';e+='<span class="appImg appImgs"><img src="'+b+d[c][a]["imgsrc"]+'" width="90px" height="90px"/></span>';e+='<span class="lable" style="color:#955661;">'+d[c][a]["name"]+"</span></div>";h++}e+="</div></div>";g=g++}e+="</div></div>";$("#contentAppAreaDiv").html(e);if("livetoy"==local){$("#bigkuang2").css({width:"870px"})}else{if("emedia"==local){$("#bigkuang2").css({width:"600px"})}else{if("elevator"==local){$("#bigkuang2").css({width:"880px"})}else{if(acenter&&admin){$(".bigkuang2").css("width","735px")}else{$(".bigkuang2").css("width","600px")}}}}$(".botitCss div,#systemmoretop div").each(function(l,k){$(k).click(function(){});$(k,"span","img").click(function(){f.goToAppFrame($(this));$("#systemset").fadeOut("normal");$("#lastbtn").fadeOut("normal");$("#sysbtn1").children("img").attr("src",BASEPATH+"images/skin/sys_w.png")});$(k).hover(function(){$(this).animate({border:"2px solid orange"},500);$(this).children(".lable").animate({"font-size":"17px"},500)},function(){$(this).animate({border:"2px solid transparent"},500);$(this).children(".lable").animate({"font-size":"14px"},500)})});this.enterShow()},goToAppFrame:function(b){var a=this;a.showContentAera($("#"+b.attr("id")))},resetMainCanvas:function(){},showContentAera:function(g){var c=g.attr("pname");var b=g.attr("id");var f=g.find(".appImgs img").attr("src");var e=g.attr("urlData");var a=g.attr("ticonCls");var d=g.attr("topconCls");openWindow(c,b,f,a,e,d)},toggleLeftMenu:function(d,c,a){var b=this;c=b.isNull(c)?200:c;if(b.doFlag==false){return}b.delayCall(1000,function(){return b.doFlag},function(){b.doFlag=false})},enterShow:function(){$("#logoDiv").show().animate({left:"100px"},{duration:300,complete:function(){$("#userHead_div").show().animate({top:"40px"},{duration:300,complete:function(){$("#contentAppAreaDiv").show();$("#contentAppAreaDiv ul li").fadeIn("fast")}})}})},autoSize:function(){var b=$(window,document).height();var a=$(window,document).width();if(a<=700){$("#userHead_div").css({left:"700px"});$(document.body).css({overflowX:"auto"});$("#contentAppAreaDiv").css({width:"700px"})}else{$("#userHead_div").css({left:a-360});$(document.body).css({overflowX:"hidden"});$("#contentAppAreaDiv").css({width:"auto"})}if(b<=500){$(document.body).css({overflowY:"auto"})}else{$(document.body).css({overflowY:"hidden"})}},subShowStr:function(e,c){var f=0,a=e.length,b=-1;for(var d=0;d<a;d++){if(f==c){return e.substring(0,d)+".."}if(f>c&&c!=0){return e.substring(0,d-1)+".."}b=e.charCodeAt(d);if(b>=0&&b<=128){f+=1}else{f+=2}}return e},delayCall:function(d,a,b){var c=this;if(a()){b()}else{window.setTimeout(function(){c.delayCall(d,a,b)},d)}},getStrLength:function(a){return a==null?0:a.replace(/[^\x00-\xff]/g,"aa").length},isNull:function(a){return a==null||/^\s*$/.test(a)},isEmptyArr:function(a){return this.isNull(a)||!(a instanceof Array)||a.length==0}};index.main()});var openWindow;Ext.require(["Ext.window.Window"]);Ext.onReady(function(){var d=$(window).height()-55;var c=Ext.create("Ext.toolbar.Toolbar",{renderTo:Ext.getBody(),style:"background-color: transparent; background-image:url();border:none; border-bottom:1px solid lightblue; position:absolute;left:0px; top: "+(d+8)+"px",width:"0px",padding:"0 0 0 0",margin:"0 0 0 30",autoScroll:true,hidden:true});Ext.get(window).addListener("resize",function(i,h,g){var f=$(window).height();if(f>500){c.setPosition(0,f-70)}});var b;loginInfo=Ext.create("Ext.panel.Panel",{border:false,height:110,width:80,layout:"absolute",bodyStyle:"background: transparent;",items:[{xtype:"image",src:$("#iconSrc").val(),x:0,y:0,width:80,height:80,style:" border-radius:50%; overflow:hidden;-webkit-box-shadow: 0 0 8px rgba(0,0,0,0.2);box-shadow: 0 0 8px rgba(0,0,0,0.2);",listeners:{afterrender:function(){var f=this.nextSibling("button");this.getEl().on("mouseover",function(){window.clearTimeout(b);f.showMenu()});this.getEl().on("mouseout",function(){b=window.setTimeout(function(){f.hideMenu()},500)})}}},{xtype:"button",x:0,y:73,width:80,height:15,frame:false,shadow:false,border:false,arrowAlign:"bottom",style:"background: transparent;",tooltip:getIi18NText("showMore"),tooltipType:"title",menu:{xtype:"menu",plain:true,border:false,style:"background: transparent;",items:[{xtype:"button",id:"totalNumberButton",text:'<font class="linkFontCls">'+getIi18NText("message01")+"</font>",iconCls:"messageIconCss",style:"background: transparent;",textAlign:"left",handler:function(){openWindow(getIi18NText("message16"),"app_99_tid__temp","images/message/message02.png","messageIconCss","message!messageAdvice.action","images/message/message02.png")},border:false},{xtype:"button",text:'<font class="linkFontCls">'+getIi18NText("message02")+"</font>",iconCls:"sysSettingCss",style:"background: transparent;",textAlign:"left",handler:function(){openMessageSetting=true;openWindow(getIi18NText("systemMaintenance"),115,"images/app/set.png","sysIconCss","system!systemTabar.action","images/app/set.png")},border:false},{xtype:"button",text:'<font class="linkFontCls">'+getIi18NText("exit")+"</font>",iconCls:"logOffIconCss",width:117,style:"background: transparent;",textAlign:"left",handler:e,hidden:isWechatBrowser(),border:false}],listeners:{afterrender:function(){var f=this.up("button");this.getEl().on("mouseover",function(){window.clearTimeout(b);f.showMenu()});this.getEl().on("mouseout",function(){b=window.setTimeout(function(){f.hideMenu()},500)})}}}}],renderTo:document.getElementById("userImgLi")});messageWin=Ext.create("Ext.panel.Panel",{border:false,height:60,width:26,layout:"absolute",bodyStyle:"background: transparent;",items:[{xtype:"image",src:$("#messageIconSrc").val(),x:0,y:22,width:26,height:15,listeners:{afterrender:function(){var f=this.nextSibling("button");this.getEl().on("mouseover",function(){window.clearTimeout(b);f.showMenu()});this.getEl().on("mouseout",function(){b=window.setTimeout(function(){f.hideMenu()},500)})}}},{xtype:"button",x:0,y:30,width:26,height:15,margin:"-8px 0 0 0",frame:false,shadow:false,border:false,arrowAlign:"bottom",style:"background: transparent;",tooltip:getIi18NText("message01"),tooltipType:"title",handler:function(){openWindow(getIi18NText("message16"),"app_99_tid__temp","images/message/message02.png","messageIconCss","message!messageAdvice.action","images/message/message02.png")}}],renderTo:document.getElementById("messageIcon")});modifyPasswordFn=function(f){Ext.create("Ext.window.Window",{title:getIi18NText("passwordModification"),iconCls:"editPwdIconCss",width:400,height:230,modal:true,plain:true,frame:false,constrain:true,animateTarget:f,close:function(){var g=this;g.hide(f,function(){g.removeAll(true);g.getEl().remove();g.destroy()})},layout:"fit",items:[{xtype:"form",border:false,layout:{type:"vbox",align:"center",pack:"center"},defaults:{xtype:"textfield",width:260,labelSeparator:"：",labelWidth:90,labelAlign:"right",allowBlank:false,inputType:"password",minLength:6,maxLength:18,blankText:getIi18NText("notNull"),minLengthText:getIi18NText("passwordWarming01"),maxLengthText:getIi18NText("passwordWarming01"),enforceMaxLength:true,regex:new RegExp("^\\w+$"),regexText:getIi18NText("passwordWarming02")},items:[{fieldLabel:getIi18NText("originalPswTitle"),name:"oldPwd"},{fieldLabel:getIi18NText("newPswTitle"),name:"newPwd"},{fieldLabel:getIi18NText("sureNewPswTitle"),name:"reapeatNewPwd",validator:function(h){var g=this.previousSibling("[name=newPwd]");return(h===g.getValue())?true:getIi18NText("defaultInputPsw")}},{xtype:"label",id:"showErrMsg_label",html:'<font class="tipLabelCls">'+getIi18NText("passwordWarming01")+"</font>"}],buttons:[{text:getIi18NText("sureModify"),iconCls:"finish_IconCls",formBind:true,handler:function(g){g.up("form")["submitForm"]()}},{text:getIi18NText("cancel"),iconCls:"cancel_IconCls",handler:function(g){g.up("window").close()}}],submitForm:function(){var g=this;g.getEl().mask(getIi18NText("sendingData"));g.submit({url:"auth!modifyPwd.action",success:function(j,i){g.getEl().unmask();var k=i.result.msg;var h=i.result.code;if(h==0){g.up("window").hide()}Ext.Msg.show({title:getIi18NText("systemMessage"),msg:k,width:300,buttons:Ext.Msg.OK,buttonText:{ok:window.top.getIi18NText("confirm")},icon:h==0?Ext.window.MessageBox.INFO:Ext.MessageBox.ERROR})}})}}]}).show()};function e(f){Ext.Msg.show({icon:Ext.MessageBox.QUESTION,title:getIi18NText("systemMessage"),msg:"<font color='red'>"+getIi18NText("sureExit")+"</font><br/><font color='gray'>("+getIi18NText("cancelLoginTip01")+")</font>",animateTarget:f.id,plain:true,buttons:Ext.MessageBox.OKCANCEL,buttonText:{ok:getIi18NText("exit"),cancel:getIi18NText("cancel")},fn:function(g,i,h){if(g=="ok"){window.location.replace("auth!logOffUser.action")}}})}var a=true;openWindow=function(m,k,p,g,o,r){var q=winIdPrefix+k;var j=Ext.WindowManager.get(q);if(j!=null){j.show();return}var l=Ext.getBody().getHeight();var n=Ext.getBody().getWidth();if(!l||l<200){l=300}var i={id:q,height:560,width:990,title:m,closable:true,plain:true,frame:false,animateTarget:k,maximizable:true,minimizable:true,minHeight:200,minWidth:300,maxHeight:l-100,constrain:true,shadow:"frame",shadowOffset:5,icon:r,minimize:function(){this.hide(taskPrefix+k)},close:function(){if(taskPrefix+k=="__taskToolbar_app_2_tid__temp"){var t=this;if(isUpload){var s={icon:Ext.MessageBox.QUESTION,title:getIi18NText("systemMessage"),cls:"msgCls",msg:getIi18NText("uploadWarming"),animateTarget:t,plain:true,buttons:Ext.MessageBox.OKCANCEL,buttonText:{ok:getIi18NText("yes"),cancel:getIi18NText("no")},fn:function(v,z,x){if(v=="ok"){if(mUploader){var u=mUploader.getFiles().length;var y=mUploader.getFiles();for(var w=0;w<u;w++){mUploader.cancelFile(y[w]);mUploader.removeFile(y[w],true)}}t.destroy();c.remove(taskPrefix+k);if(c.items.length<7){c.setWidth(c.getWidth()-108)}if(c.query().length<1){c.hide();index.resetMainCanvas()}syncSource()}}};Ext.MessageBox.show(s)}else{t.destroy();c.remove(taskPrefix+k);if(c.items.length<7){c.setWidth(c.getWidth()-108)}if(c.query().length<1){c.hide();index.resetMainCanvas()}syncSource()}}else{this.destroy();c.remove(taskPrefix+k);if(c.items.length<7){c.setWidth(c.getWidth()-108)}if(c.query().length<1){c.hide();index.resetMainCanvas()}}openMessageSetting=false;isonline=false;isoffline=false;isweiline=false;isactivePro=false;isnorPro=false;isweiPro=false;openSysAuth=0;openSysAuthLin=0},tools:[{type:"refresh",tooltip:getIi18NText("refreshWindow"),tooltipType:"title",callback:function(s,t,u){s.stopAnimation();s.removeAll();s.update(s.proHtml);t.hide();window.setTimeout(function(){t.show()},2000)}}],listeners:{restore:function(s){var t=Ext.getBody().getHeight();s.maxHeight=t-50},afterrender:function(s){var t=Ext.getBody().getHeight();s.maxHeight=t-50}}};if(!isNull(o)){i.html='<iframe frameborder="0" width="100%" height="100%" src="'+o+'" name="'+q+'"></iframe>';i.proHtml='<iframe frameborder="0" width="100%" height="100%" src="'+o+'" name="'+q+'"></iframe>'}Ext.create("widget.window",i).show();var f=Ext.create("Ext.Button",{text:m,id:taskPrefix+k,iconCls:g,style:"font-size: 14px; border: none; background-image: url(); background: transparent; ",scale:"medium",width:100,maxWidth:120,closable:true,handler:function(t,v){var u=Ext.WindowManager.get(q);var s=Ext.WindowManager.getActive().id;if(u.isHidden()==true||s!=q){u.show(taskPrefix+k)}else{u.hide(taskPrefix+k)}},listeners:{render:h}});c.show();c.add(f);if(c.getWidth()<700){c.setWidth(c.getWidth()+108)}function h(){$("#"+taskPrefix+k+"-btnInnerEl").css({"font-size":"13px",color:"#NaNNaNNaN"});$("#"+taskPrefix+k).attr("title",m).css({"background-color":"rgba(255,255,255,0.3)"});$("#"+taskPrefix+k).hover(function(){$(this).css({"background-color":"rgba(255,255,255,0.5)"});$("#"+taskPrefix+k+"-btnInnerEl").css({color:"#ff9b1a",fontSize:"15px"})},function(){$(this).css({"background-color":"rgba(255,255,255,0.3)"});$("#"+taskPrefix+k+"-btnInnerEl").css({color:"#NaNNaNNaN",fontSize:"13px"})})}};layoutWinFn=function(f){var g=Ext.WindowManager.get(f);if(g){g.doLayout()}};maxWinFn=function(f){var g=Ext.WindowManager.get(f);if(g&&g.isWindow){g.maximize(false)}}});