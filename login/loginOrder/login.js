var Lnumber=/^[0-9a-zA-Z_]{6,18}$/;Ext.apply(Ext.form.field.VTypes,{Lnumber:function(b,a){return Lnumber.test(b)},LnumberText:window.top.getIi18NText("passwordWarming01")+","+window.top.getIi18NText("passwordWarming02")});var loginPanel;var registerPanel;function adapt(){var c=document.body.clientHeight;var d=(c-472)/2;var b=(d>0?d:0);$("#loginpanel").css("top",b);$("#registerpanel").css("top",b);var a=(document.body.scrollHeight-472)/2;if(a>0){Ext.getBody().setStyle({height:"100%"})}else{Ext.getBody().setStyle({height:"660px"})}}Ext.onReady(function(){var e=Ext.merge({register:false},Ext.decode(decode(AUTH_TBAR)));if(isWechatBrowser()){window.location.replace("weixin!wxLogin.action");return}var f=window.ActiveXObject?true:false;var g='<font color = "red" size = "2">'+getIi18NText("supportTips_par1")+"<br />"+getIi18NText("supportTips_par2")+"</font>";if(window.top!==window.self){Ext.Msg.show({title:getIi18NText("systemMessage"),msg:getIi18NText("longTimesWarming"),icon:Ext.MessageBox.WARNING,buttons:Ext.MessageBox.OK,closable:false,buttonText:{ok:getIi18NText("loginAgain")},fn:function(){window.top.location=window.location}});return}Ext.tip.QuickTipManager.init();var h=(local=="kr");var c=(local=="hgdc");var i=getloginCss(local);window.setTimeout(function(){a()},500);var b=Ext.create("Ext.tip.ToolTip",{title:window.top.getIi18NText("systemMessage"),minWidth:100,html:""});var d=function(o,n,k,l){if(n==k){return}var m=30;var p=new Date();p.setTime(p.getTime()+m*24*60*60*1000);document.cookie="currentMode="+escape("old")+";expires="+p.toGMTString();window.location.replace(window.location.href)};function j(l){var k="EN";if(getIi18NText("login")=="登录"){Ext.getCmp("chLan").addCls("dangCls");Ext.getCmp("rchLan").addCls("dangCls");k="CN"}if(getIi18NText("login")=="로그인"){k="KN"}if(l==k){return}Ext.getBody().mask("正在为您切换语言...");Ext.Ajax.request({url:"auth!changeLang.action",method:"post",params:{lang:l,rand:new Date().getTime()},callback:function(){Ext.getBody().unmask();window.location.replace(window.location.href)}})}function a(){var m=Ext.getBody().getHeight();var t=Ext.getBody().getWidth();Ext.getBody().setStyle({background:"url(images/systemVersion/order/orderModel.jpg) no-repeat",backgroundSize:"100% 100%"});var k=0;var p=0;var w=[(k>0?k:0),(p>0?p:0)];loginPanel=Ext.create("Ext.panel.Panel",{width:388,height:472,hidden:false,style:"margin:0 auto; top:0px;",id:"loginpanel",shadow:false,border:false,layout:"absolute",items:[{xtype:"panel",width:388,height:472,x:w[0],y:w[1],baseCls:"panelBodyCls"},{xtype:"image",imgCls:i,width:87,height:53,x:w[0],y:w[1],style:"margin: 25px 0px 0px 153px"},{xtype:"label",text:welcomelau,width:324,height:44,id:"welImage",x:w[0],y:w[1],style:"margin: 128px 0px 0px 32px;font-size:26px; font-family:STKaiti;"},{xtype:"panel",baseCls:"lansecss",width:318,height:24,x:w[0],y:w[1],margin:"180px 0 0 32px",layout:{type:"hbox",pack:"end",align:"middle"},items:[{xtype:"button",text:"中文",baseCls:"lanCCls",id:"chLan",hidden:h,listeners:{afterrender:function(){if(getIi18NText("login")=="登录"){Ext.getCmp("chLan").addCls("dangCls")}}},handler:function(){j("CN")}},{xtype:"button",text:"English",baseCls:"lanECls",id:"enLan",hidden:h,listeners:{afterrender:function(){if(getIi18NText("login")=="Login"){Ext.getCmp("enLan").addCls("dangCls")}}},handler:function(){j("EN")}},{xtype:"button",text:"한국",baseCls:"lanKCls",id:"knLan",hidden:!c,listeners:{afterrender:function(){if(getIi18NText("login")=="로그인"){Ext.getCmp("knLan").addCls("dangCls")}}},handler:function(){j("KN")}}]},{xtype:"panel",baseCls:"inpuNcss",width:318,height:46,x:w[0],y:w[1],margin:"214px 0 0 32px",layout:{type:"hbox",align:"middle"},items:[{xtype:"image",imgCls:"userCss",width:40,height:40},{xtype:"textfield",id:"userName",emptyText:getIi18NText("enterUsnTips"),width:270,fieldStyle:"border:none;font-weight: bold; font-size: 16px; font-family: -webkit-pictograph;background: transparent; ",height:35,allowBlank:false,blankText:getIi18NText("notNull"),allowOnlyWhitespace:false,maxLength:100,enforceMaxLength:true,initEvents:function(){var x=function(z){var y=" ";var A=z.getCharCode();if(y.indexOf(String.fromCharCode(A))!=-1){z.stopEvent()}};this.el.on("keypress",x,this)}}]},{xtype:"panel",baseCls:"inpuMcss",width:318,height:46,x:w[0],y:w[1],margin:"280px 0 0 32px",layout:{type:"hbox",align:"middle"},items:[{xtype:"image",imgCls:"passCss",width:40,height:40},{xtype:"textfield",id:"userPwd",fieldStyle:"border:none;font-weight: bold; font-size: 16px; font-family: -webkit-pictograph;background: transparent; ",emptyText:getIi18NText("enterPswTips"),inputType:"password",allowBlank:false,blankText:getIi18NText("notNull"),allowOnlyWhitespace:false,fieldCls:"fieldInputCls",width:270,height:35,maxLength:100,enforceMaxLength:true,listeners:{render:function(x){x.getEl().on("keydown",function(z,y){if(z.getKey()==Ext.EventObject.ENTER){l(Ext.getCmp("loginBu"))}})}},initEvents:function(){var x=function(z){var y=" ";var A=z.getCharCode();if(y.indexOf(String.fromCharCode(A))!=-1){z.stopEvent()}};this.el.on("keypress",x,this)}}]},{xtype:"button",id:"loginBu",text:getIi18NText("login"),border:false,baseCls:"newloginIconCss",x:w[0],y:w[1],style:"margin: 356px 0 0 32px;",width:318,height:46,handler:l},{xtype:"button",text:'<span style="text-decoration: underline">'+getIi18NText("regist")+"</span>",title:getIi18NText("message_down_apk"),x:w[0],y:w[1],hidden:!e.register,id:"regist",baseCls:"DownCls",style:"margin: 410px 0 0 320px;",border:false,handler:function(){o()}},{xtype:"panel",width:388,height:40,x:w[0],y:w[1]+432,hidden:!f,baseCls:"",html:g},{xtype:"displayfield",id:"displayTipField",fieldCls:"tipFontCls",hidden:true,value:"",x:w[0],y:w[1],style:"margin: 332px 0 0 33px"}],renderTo:document.body});registerPanel=Ext.create("Ext.panel.Panel",{width:388,height:472,hidden:true,style:"margin:0 auto; top:0px;",id:"registerpanel",shadow:false,border:false,layout:"absolute",items:[{xtype:"panel",width:388,height:472,x:w[0],y:w[1],baseCls:"panelBodyCls"},{xtype:"image",imgCls:i,width:87,height:53,x:w[0],y:w[1],style:"margin: 25px 0px 0px 153px"},{xtype:"panel",baseCls:"lansecss",width:338,border:false,height:24,x:w[0],y:w[1],margin:"120px 0 0 0",layout:{type:"hbox",pack:"end",align:"middle"},items:[{xtype:"button",text:"中文",baseCls:"lanCCls",id:"rchLan",hidden:h,listeners:{afterrender:function(){if(getIi18NText("login")=="登录"){Ext.getCmp("rchLan").addCls("dangCls")}}},handler:function(){j("CN")}},{xtype:"button",text:"English",baseCls:"lanECls",id:"renLan",hidden:h,listeners:{afterrender:function(){if(getIi18NText("login")=="Login"){Ext.getCmp("renLan").addCls("dangCls")}}},handler:function(){j("EN")}},{xtype:"button",text:"한국",baseCls:"lanKCls",id:"cknLan",hidden:!c,listeners:{afterrender:function(){if(getIi18NText("login")=="로그인"){Ext.getCmp("knLan").addCls("dangCls")}}},handler:function(){j("KN")}},{xtype:"button",text:getIi18NText("login"),baseCls:"tlogin",id:"rtologin",margin:"0 0 0 170px",handler:function(){r()}}]},{xtype:"form",layout:{type:"vbox",align:"middle"},width:318,height:290,x:w[0],y:w[1],id:"formMy",margin:"140px 0 0 32px",layout:{type:"vbox",align:"middle"},border:false,fileUpload:true,items:[{xtype:"panel",id:"registerform",border:false,layout:{type:"vbox",align:"middle"},defaults:{labelAlign:"right",width:310,margin:"19px 0 0 0",labelWidth:70,xtype:"textfield",labelCls:"labelCls",fieldBodyCls:"fieldBodyCls",baseCls:"baseBodyCls",enforceMaxLength:true,allowBlank:false,validateOnChange:false},items:[{fieldLabel:window.top.getIi18NText("account"),vtype:"alphanum",name:"userName",id:"account",allowBlank:false,blankText:getIi18NText("notNull"),maxLength:100,emptyText:getIi18NText("userregex")},{fieldLabel:window.top.getIi18NText("nickname"),name:"nickName",id:"nickName",allowBlank:false,blankText:getIi18NText("notNull"),maxLength:100,emptyText:getIi18NText("nickregex")},{fieldLabel:window.top.getIi18NText("keyword2"),vtype:"Lnumber",inputType:"password",name:"userPwd",id:"keyword2",allowBlank:false,blankText:getIi18NText("notNull"),maxLength:100,emptyText:getIi18NText("passwordWarming02")},{fieldLabel:window.top.getIi18NText("tel"),name:"userTel",id:"tel",allowBlank:false,blankText:getIi18NText("notNull"),regex:/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/,regexText:window.top.getIi18NText("TelFormatTip"),emptyText:getIi18NText("telregex")},{fieldLabel:window.top.getIi18NText("justEmail"),vtype:"email",name:"userEmail",id:"userEmail",allowBlank:false,blankText:getIi18NText("notNull"),maxLength:100,emptyText:getIi18NText("emailregex")}]},{xtype:"button",id:"registerBu",text:getIi18NText("regist"),border:false,baseCls:"newregisterIconCss",x:w[0],y:w[1],style:"margin: 20px 0 0 0;",width:318,height:46,handler:function(x){v(x)}},{width:388,height:40,x:w[0],y:w[1],hidden:!f,style:"margin: 20px 0 0 0;",html:g}]},{border:false,width:318,html:'<span class="desizeCls decolorCls">'+getIi18NText("registmessage")+'</span><span class="desizeCls degreycolorCls">'+getIi18NText("registmessage2")+'</span><br/><span class="desizeCls degreycolorCls">'+getIi18NText("registmessage3")+"</span>",margin:"430 0 0 35"}],renderTo:document.body});function u(){var z=document.body.clientHeight;var A=(z-472)/2;var y=(A>0?A:0);$("#loginpanel").css("top",y);$("#registerpanel").css("top",y);var x=(document.body.scrollHeight-472)/2;if(x>0){Ext.getBody().setStyle({height:"100%"})}else{Ext.getBody().setStyle({height:"660px"})}}u();function l(y){var x=Ext.getCmp("userName");var A=Ext.getCmp("userPwd");var z=Ext.getCmp("displayTipField");z.show();z.setValue("");z.getEl().slideIn("t",{duration:400,easing:"backIn"});if(!x.isValid()){x.getEl().frame();z.setValue(getIi18NText("enterUsnTips"));return}if(!A.isValid()){A.getEl().frame();z.setValue(getIi18NText("enterPswTips"));return}z.setValue(getIi18NText("checkLoginInfo"));x.setDisabled(true);A.setDisabled(true);y.setDisabled(true);window.setTimeout(function(){Ext.Ajax.request({url:"auth!loginUser.action",method:"post",params:{n:x.getValue().trim(),p:A.getValue(),mod:"new1"},success:function(D,B){if(D&&!Ext.isEmpty(D.responseText)){var C=Ext.JSON.decode(D.responseText);if(C.code==0){z.setValue(getIi18NText("loginSuccessTips"));window.location.replace("auth!indexPage.action");return}else{if(C.code==1){z.setValue(getIi18NText("loginError02"))}else{if(C.code==2){z.setValue(getIi18NText("loginError01"))}else{if(C.code==3){z.setValue(getIi18NText("loginError03"))}else{if(C.code==4){z.setValue(getIi18NText("loginError06"))}else{if(C.code==5){z.setValue(getIi18NText("loginError07"))}else{z.setValue(getIi18NText("loginError04"))}}}}}}}x.setDisabled(false);A.setDisabled(false);y.setDisabled(false)},failure:function(C,B){z.setValue(getIi18NText("loginError05"));x.setDisabled(false);A.setDisabled(false);y.setDisabled(false)}})},800)}var q;function s(){if(q){q.show("aDownload");return}q=Ext.create("Ext.panel.Panel",{width:300,title:getIi18NText("message_down_apk"),height:220,header:true,modal:true,floating:true,draggable:true,closable:true,border:true,shadowOffset:15,layout:{type:"vbox",align:"center"},items:[{xtype:"button",text:"Professional V4.0",scale:"large",width:180,margin:10,handler:function(){window.location="images/app/player4.4.apk"}},{xtype:"button",text:"General V4.0",scale:"large",width:180,margin:10,hidden:h,handler:function(){window.location="images/app/player.apk"}}],closeAction:"hide"});q.show("aDownload")}function o(){loginPanel.hide();registerPanel.show()}function r(){registerPanel.hide();loginPanel.show()}function v(x){var y=x.up("form");if(!y||!y.isValid()){n(x,window.top.getIi18NText("inputAll"));return}registerPanel.getEl().mask(window.top.getIi18NText("monitor_message_31"));y.submit({url:"auth!saveMyUser.action",params:{userType:5},success:function(A,z){registerPanel.getEl().unmask();var B=z.result.msg;if(z.result.code==0){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("registerSuccess"),function(){Ext.getCmp("formMy").form.reset();r()});return}Ext.Msg.alert(window.top.getIi18NText("systemMessage"),B)},failure:function(z,A){Ext.Msg.alert(getIi18NText("systemMessage"),getIi18NText("loginTimeoutTip01"),function(){window.location.replace("auth!logOffUser.action")})}})}function n(x,y){b.update(y);b.showBy(x,null,[50,-60]);x.addListener("mouseout",function(){b.hide()})}}});