var defaultSelect,extFileRegistId;Ext.onReady(function(){var K,L,I,t,z,o,C,d,X,e=false,l,V=true,A;var G=Ext.merge({add:false,update:false,"delete":false,dfset:false,self:true},Ext.decode(decode(AUTH_TBAR)));var v=window.top.getIi18NText("confirm")=="OK"?true:false;var b=Ext.create("Ext.tip.ToolTip",{title:window.top.getIi18NText("systemMessage"),minWidth:100,html:""});var y=new Ext.util.MixedCollection();Ext.define("goodsRd",{extend:"Ext.data.Model",fields:[{name:"id",type:"int"},{name:"price",type:"string"},{name:"code",type:"string"},{name:"name",type:"String"}]});var M=Ext.create("Ext.data.Store",{fields:["id","code","aisle","name","price","url","cargoRoad","stock","remark","latest","content"],buffered:false,pageSize:10,leadingBufferZone:50,proxy:{type:"ajax",url:"source!getAllGoodsInfo.action",reader:{type:"json",root:"data",totalProperty:"totalCount"}},autoLoad:true,listeners:{load:function(Y){var aa=[];var Z=y;Y.each(function(ab){if(y.containsKey(ab.data.id)){aa.push(ab)}p.select(aa,true)});p.addListener("deselect",U)},beforeload:function(){p.removeListener("deselect",U)}}});var g=Ext.create("Ext.data.Store",{fields:["id","name"],data:[{id:"1",name:window.top.getIi18NText("wp_svc")},{id:"2",name:window.top.getIi18NText("wp_sub")}]});var h=Ext.create("Ext.data.Store",{fields:["id","name"],data:[{id:"1",name:window.top.getIi18NText("wp_genLink")},{id:"2",name:window.top.getIi18NText("wp_showLink")},{id:"3",name:window.top.getIi18NText("wp_adsLink")}]});var p=Ext.create("Ext.selection.CheckboxModel",{listeners:{select:O,deselect:U}});function U(Z,Y){if(y.containsKey(Y.get("id"))){y.removeAtKey(Y.get("id"))}}function O(Z,Y){if(!y.contains(Y.get("id"))){y.add(Y.get("id"),Y)}}function r(ad,aa,Z,ae,ac,ab,Y){return Ext.String.format('<img src="{0}" width="64px" height="64px"/>',ad)}function c(ad,aa,Z,ae,ac,ab,Y){return"null"==ad?"":ad}function R(){Ext.getCmp("btime02").setValue(null);Ext.getCmp("etime02").setValue(null);Ext.getCmp("searchTextId02").setValue(null);S()}function S(Y){var aa=M.getProxy();var Z=Ext.getCmp("btime02");if(!Z.isValid()){i(Y,window.top.getIi18NText("startTimeErr"));return}var ab=Ext.getCmp("etime02");if(!ab.isValid()){i(Y,window.top.getIi18NText("endTimeErr"));return}if(!Ext.isEmpty(ab.getValue())&&!Ext.isEmpty(Z.getValue())){if(Z.getValue()>ab.getValue()){i(Y,window.top.getIi18NText("timesErrWarming"));return}}aa.setExtraParam("n",encode(Ext.getCmp("searchTextId02").getValue()));aa.setExtraParam("b",Ext.Date.format(Z.getValue(),dateFormat));aa.setExtraParam("e",Ext.Date.format(ab.getValue(),dateFormat));E.getSelectionModel().deselectAll();M.loadPage(1)}var u={no:getIi18NText("No"),image:window.top.getIi18NText("picture"),name:window.top.getIi18NText("goods_nm"),price:window.top.getIi18NText("goods_pric"),remark:window.top.getIi18NText("goods_rmk"),code:getIi18NText("goods_num"),aisle:getIi18NText("jsp_goodsRoad")};var E=Ext.create("Ext.grid.Panel",{region:"center",width:890,height:500,frame:false,selType:"checkboxmodel",selModel:p,store:M,columns:[{text:u.no,width:60,xtype:"rownumberer",align:"center"},{text:"id",dataIndex:"id",align:"center",hidden:true},{text:u.image,dataIndex:"url",minWidth:64,renderer:r},{text:u.code,dataIndex:"code",align:"center",minWidth:64},{text:u.name,dataIndex:"name",align:"center",minWidth:120},{text:u.price,dataIndex:"price",align:"center",minWidth:60},{text:u.aisle,value:"1",hidden:true},{text:"content",dataIndex:"content",hidden:true},{text:window.top.getIi18NText("lastUpdateTime"),dataIndex:"latest",width:155},{text:u.remark,dataIndex:"remark",align:"center",width:320,renderer:c}],bbar:[{xtype:"pagingtoolbar",store:M,border:false,displayInfo:true},{xtype:"tbfill"},{xtype:"button",margin:"0 20 0 10",text:getIi18NText("confirm"),align:"right",border:false,handler:T}],listeners:{itemdblclick:function(aa,Y,ab,Z,ac){T()}}});Ext.QuickTips.init();var N={text:window.top.getIi18NText("operation"),minWidth:100,maxWidth:60,menuText:window.top.getIi18NText("operation"),menuDisabled:true,hidden:true,sortable:false,draggable:false,resizable:false,xtype:"actioncolumn",items:[]};if(G.update){N.items.push({iconCls:"editIconCss",tooltip:window.top.getIi18NText("modify"),handler:B});N.hidden=false}if(G["delete"]){N.items.push({iconCls:"removeIconCss",tooltip:window.top.getIi18NText("delete"),handler:W});N.hidden=false}N.items.push({iconCls:"detailIconCss",tooltip:window.top.getIi18NText("item_detail"),handler:Q});N.hidden=false;if(!G.self){K=Ext.create("Ext.container.Viewport",{layout:{type:"fit"},renderTo:document.body,defaults:{},border:false,style:"background: white",height:"100%",width:"100%",items:[{html:"<div style='width: 100%;height: 100%;display:table;text-align:center !important'><span style='height: 100%;display:table-cell;vertical-align:middle;'><img style='vertical-align: middle;' src='"+BASEPATH+"images/"+getIi18NText("noauth")+"'></span></div>"}]})}else{K=Ext.create("Ext.container.Viewport",{layout:{type:"border"},renderTo:document.body,defaults:{},border:false,style:"background: white",items:[{region:"north",height:40,width:400,id:"northContanier",layout:{type:"hbox",align:"middle",defaultMargins:{right:3}},bodyCls:"x_panel_backDD",items:[{xtype:"image",src:"",width:40,height:24,imgCls:"searchIconCss"},{fieldLabel:window.top.getIi18NText("name"),id:"searchTextId",xtype:"textfield",maxLength:50,width:180,labelWidth:30,emptyText:window.top.getIi18NText("wechatPublicNameSearch")},{xtype:"datefield",fieldLabel:window.top.getIi18NText("beCreatedTimne"),name:"btime",labelWidth:80,width:260,id:"btime",name:"btime",emptyText:window.top.getIi18NText("startTime"),format:dateFormat},{xtype:"datefield",name:"etime",id:"etime",width:180,emptyText:window.top.getIi18NText("endTime"),format:dateFormat},{xtype:"button",id:"queryBut",iconCls:"queryIconCss",text:window.top.getIi18NText("select"),handler:k}]},{region:"center",border:false,layout:"fit",listeners:{render:J}}]})}function J(Y,Z){t=getAjaxProxy({url:"auth!allWepublic.action"});I=Ext.create("Ext.data.Store",{fields:["id","name","payTitle","connector","tel","state","latest","username","partner","partnerkey","status","subMch"],buffered:false,pageSize:20,leadingBufferZone:50,proxy:t,listeners:{load:function(aa){Ext.getCmp("totalGoodsRows").setValue(aa.getTotalCount());Ext.getBody().unmask()}}});I.loadPage(1);L=Ext.create("Ext.grid.Panel",{title:window.top.getIi18NText("wp_List"),iconCls:"tabIconCss",frame:false,store:I,columns:[{text:window.top.getIi18NText("No"),width:80,xtype:"rownumberer",align:"center"},{text:window.top.getIi18NText("name"),dataIndex:"name",minWidth:100,flex:1,renderer:q},{text:window.top.getIi18NText("subMch"),dataIndex:"subMch",minWidth:100,align:"center",renderer:j},{text:window.top.getIi18NText("payTitle"),dataIndex:"payTitle",minWidth:100},{text:window.top.getIi18NText("wp_connector"),dataIndex:"connector",minWidth:100},{text:window.top.getIi18NText("Tel"),dataIndex:"tel",minWidth:100},{text:window.top.getIi18NText("creator"),dataIndex:"username",minWidth:70},{text:window.top.getIi18NText("lastUpdateTime"),dataIndex:"latest",width:100,flex:1,renderer:n},N],bbar:[{id:"padingBar",xtype:"pagingtoolbar",store:I,border:false,displayInfo:true}],margin:1,tools:[{xtype:"displayfield",id:"totalGoodsRows",fieldLabel:window.top.getIi18NText("wp_total"),labelWidth:50,minWidth:90,value:"-"},{xtype:"button",tooltip:window.top.getIi18NText("wp_add"),tooltipType:"title",text:window.top.getIi18NText("wp_add"),border:false,iconCls:"addIconCss",margin:"0 5 0 0",hidden:!G.add,handler:P},{xtype:"button",tooltipType:"title",text:window.top.getIi18NText("refresh"),border:false,iconCls:"refreshIconCss",handler:k}],viewConfig:{trackOver:false,disableSelection:false,emptyText:'<h1 style="margin:10px">'+window.top.getIi18NText("roleTip05")+"</h1>"}});Y.add(L)}function n(ad,aa,Z,ae,ac,ab,Y){return Ext.Date.format(new Date(ad),dateFormat)}function q(ae,aa,Z,af,ac,ab,Y){var ad="";if(parseInt(Z.data.status)==10){ad=" [ "+getIi18NText("defaultWepub")+" ]";ae='<font color = "green">'+ae+ad+"</font>"}return ae}function j(ad,aa,Z,ae,ac,ab,Y){if(ad==1){return getIi18NText("yes")}else{return getIi18NText("no")}}function k(Y){var Z=Ext.getCmp("btime");if(!Z.isValid()){i(Y,window.top.getIi18NText("startTimeErr"));return}var aa=Ext.getCmp("etime");if(!aa.isValid()){i(Y,window.top.getIi18NText("endTimeErr"));return}if(!Ext.isEmpty(aa.getValue())&&!Ext.isEmpty(Z.getValue())){if(Z.getValue()>aa.getValue()){i(Y,window.top.getIi18NText("timesErrWarming"));return}}t.setExtraParam("n",encode(Ext.getCmp("searchTextId").getValue()));t.setExtraParam("b",Ext.Date.format(Z.getValue(),dateFormat));t.setExtraParam("e",Ext.Date.format(aa.getValue(),dateFormat));L.getSelectionModel().deselectAll();I.loadPage(1)}function P(aa,ab,Z){if(Z==3){}A=ab;var Y=function(){z.hide(aa);var ad=z.down("form");ad.down('field[name="originalid"]').setReadOnly(false);ad.down('field[name="appsecret"]').setReadOnly(false);ad.down('field[name="name"]').setReadOnly(false);ad.down('field[name="appid"]').setReadOnly(false);ad.down('field[name="tel"]').setReadOnly(false);ad.down('field[name="partnerkey"]').setReadOnly(false);ad.down('field[name="partner"]').setReadOnly(false);ad.down('field[name="messageid"]').setReadOnly(false);ad.down('field[name="payTitle"]').setReadOnly(false);Ext.getCmp("subMchSelect").setReadOnly(false);Ext.getCmp("savePubBtn").setVisible(true);Ext.getCmp("addGoodsBtn").setVisible(true);if(G.dfset){Ext.getCmp("setDefaultBtn").setVisible(false)}d.getSelectionModel().deselectAll();ad.getForm().reset();ad.getForm().clearInvalid()};var ac=function(){e=false;m(ab);z.setTitle(window.top.getIi18NText("wp_add"));var af=z.down("form");var ad=af.down('field[name="link"]');var ae=af.down('field[name="wepublicLink"]');if(Z!=3){ad.getEl().setVisible(false);ae.getEl().setVisible(false)}else{af.down('field[name="originalid"]').setReadOnly(true);af.down('field[name="appsecret"]').setReadOnly(true);af.down('field[name="name"]').setReadOnly(true);af.down('field[name="appid"]').setReadOnly(true);af.down('field[name="tel"]').setReadOnly(true);af.down('field[name="partner"]').setReadOnly(true);af.down('field[name="partnerkey"]').setReadOnly(true);af.down('field[name="messageid"]').setReadOnly(true);af.down('field[name="payTitle"]').setReadOnly(true);Ext.getCmp("subMchSelect").setReadOnly(true);Ext.getCmp("savePubBtn").setVisible(false);if(G.dfset){Ext.getCmp("setDefaultBtn").setVisible(true)}Ext.getCmp("addGoodsBtn").setVisible(false);ad.getEl().setVisible(true);ae.getEl().setVisible(true)}if(/^\d+$/.test(ab)){z.setTitle(window.top.getIi18NText("wp_upd"));Ext.Ajax.request({url:"auth!getSingleWepub.action",params:{i:ab},callback:a})}};if(z&&z.isWindow){z.clearListeners();z.addListener("beforeclose",Y);z.addListener("show",ac);z.show(aa);return}w(ab);z=Ext.create("Ext.window.Window",{title:window.top.getIi18NText("wp_add"),plain:true,width:740,height:470,minWidth:200,minHeight:200,border:false,frame:false,modal:true,constrain:true,closeAction:"hide",listeners:{beforeclose:Y,show:ac},layout:"fit",bodyCls:"x_panel_backDD",items:[{xtype:"form",layout:{type:"hbox",align:"center",pack:"center"},width:"100%",height:"100%",border:false,autoScroll:true,items:[{xtype:"panel",flex:1,border:false,height:"100%",width:"100%",layout:{type:"vbox",align:"center",pack:"center"},defaults:{labelAlign:"right",width:260,labelWidth:60,xtype:"textfield",labelCls:"labelCls",fieldBodyCls:"fieldBodyCls",baseCls:"baseBodyCls",enforceMaxLength:true,allowBlank:false,validateOnChange:false},items:[{id:"uid",name:"userId",allowBlank:true,inputType:"hidden"},{id:"wid",name:"wid",allowBlank:true,inputType:"hidden"},{fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText("name"),xtype:"textfield",name:"name",regex:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,regexText:window.top.getIi18NText("noParticularCharacter2"),maxLength:100},{fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText("wp_appid"),xtype:"textfield",regex:/^[A-Za-z0-9=]+$/,name:"appid",maxLength:150},{fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText("wp_appsec"),name:"appsecret",id:"appsecret",xtype:"textfield",regex:/^[A-Za-z0-9=]+$/,allowBlank:false,emptyText:window.top.getIi18NText("wp_epsectip"),maxLength:200},{fieldLabel:'<font color="red"> * </font>partner',name:"partner",id:"partner",regex:/^[A-Za-z0-9=]+$/,xtype:"textfield",allowBlank:false,emptyText:window.top.getIi18NText("wp_ptTip"),maxLength:200},{fieldLabel:'<font color="red"> * </font>partnerkey',name:"partnerkey",id:"partnerkey",xtype:"textfield",regex:/^[A-Za-z0-9=]+$/,minLength:32,maxLength:32,allowBlank:false,emptyText:window.top.getIi18NText("wp_ptkeyTip")},{fieldLabel:window.top.getIi18NText("wp_id"),xtype:"textfield",id:"originalid",name:"originalid",allowBlank:true,maxLength:20,enforceMaxLength:true},{fieldLabel:window.top.getIi18NText("payTitle"),id:"payTitle",xtype:"textfield",name:"payTitle",allowBlank:true,maxLength:20,regex:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,regexText:window.top.getIi18NText("noParticularCharacter2"),emptyText:window.top.getIi18NText("payTitleExplain")},{fieldLabel:window.top.getIi18NText("payMessageId"),xtype:"textfield",id:"messageid",name:"messageid",allowBlank:true,maxLength:1500,emptyText:window.top.getIi18NText("wechatPublicTip")},{xtype:"radiogroup",fieldLabel:window.top.getIi18NText("subMch"),labelWidth:v==true?85:65,id:"subMchSelect",defaults:{margin:"0 2 0 10",name:"subMch"},columns:2,vertical:true,items:[{boxLabel:window.top.getIi18NText("yes"),inputValue:"1"},{boxLabel:window.top.getIi18NText("no"),margin:"0 2 0 20",inputValue:"0",checked:true}]},{fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText("wp_connector"),name:"connector",maxLength:50,regex:/^[^\s]{1,50}$/,regexText:window.top.getIi18NText("noblank"),allowBlank:false},{fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText("Tel"),name:"tel",maxLength:25,allowBlank:false,regex:/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/},{fieldLabel:window.top.getIi18NText("wp_link"),id:"wepublicLink",xtype:"combobox",name:"wepublicLink",store:h,queryMode:"local",displayField:"name",valueField:"id",forceSelection:true,value:"1",hidden:false,listeners:{select:function(af,ad,ae){o(ad[0].get("id"))}}},{xtype:"textarea",height:80,name:"link",id:"link",allowBlank:true,maxLength:1000,hidden:false,readOnly:true}]},{xtype:"panel",flex:1,height:"100%",layout:{type:"vbox",align:"center"},border:false,items:[d,{xtype:"panel",height:30,border:false,width:"100%",layout:{type:"hbox",pack:"end"},items:[{xtype:"button",text:window.top.getIi18NText("setToDefault"),width:80,id:"setDefaultBtn",iconCls:"pback_finish_IconCls",margin:"0 5 0 5",hidden:true,handler:function(ad){f()}},{xtype:"button",text:window.top.getIi18NText("save"),width:80,id:"savePubBtn",iconCls:"pback_finish_IconCls",formBind:true,handler:function(ad){F(ad,ab)}},{xtype:"button",text:window.top.getIi18NText("cancel"),width:80,iconCls:"pback_reset_IconCls",handler:x,margin:"0 2 0 5"}]}]}]}]}).show(aa)}function w(Y){C=getAjaxProxy({url:"auth!getRelativeGoods.action"});d=Ext.create("Ext.grid.Panel",{xtype:"grid",autoRender:true,width:"100%",flex:1,title:window.top.getIi18NText("goods_li"),iconCls:"tabIconCss",frame:false,selType:"checkboxmodel",cls:"childContentCls",scrollDelta:50,selModel:{mode:"MULTI",allowDeselect:false,showHeaderCheckbox:true,enableKeyNav:false,ignoreRightMouseSelection:true},store:Ext.create("Ext.data.Store",{fields:["id","code","name","price"],buffered:false,pageSize:20,leadingBufferZone:50,proxy:C,autoLoad:true,listeners:{load:function(Z){e=true;this.sort("updateDate","DESC")}}}),columns:[{text:window.top.getIi18NText("Noo"),width:60,xtype:"rownumberer",align:"center"},{text:window.top.getIi18NText("goods_num"),dataIndex:"code",minWidth:80},{text:window.top.getIi18NText("goods_nm"),dataIndex:"name",minWidth:80},{text:window.top.getIi18NText("goods_pric"),dataIndex:"price",minWidth:80,flex:1}],margin:1,tools:[{xtype:"button",tooltipType:"title",text:window.top.getIi18NText("goods_ad"),border:false,iconCls:"addIconCss",margin:"0 5 0 0",hidden:orVersion,handler:s,id:"addGoodsBtn"},{xtype:"button",tooltipType:"title",text:window.top.getIi18NText("refresh"),border:false,hidden:true,iconCls:"refreshIconCss",handler:m}],listeners:{beforedeselect:function(Z,aa){if(!V&&A&&parseInt(A)>0){return false}else{if(!V&&!(A&&parseInt(A)>0)){return true}else{return V}}},beforeselect:function(Z,aa){if(!V&&A&&parseInt(A)>0){return false}else{if(!V&&!(A&&parseInt(A)>0)){return true}else{return V}}}}})}function a(Z,aa,Y){l=showResult(aa,Y);if(l==false){return}delayCall(100,function(){return e},function(){var ag=z.down("form");ag.down('field[name="userId"]').setValue(l.uid);ag.down('field[name="appid"]').setValue(l.appid);ag.down('field[name="wid"]').setValue(l.id);ag.down('field[name="appsecret"]').setValue(l.appsecret);ag.down('field[name="originalid"]').setValue(l.originalid);ag.down('field[name="name"]').setValue(l.name);ag.down('field[name="tel"]').setValue(l.tel);ag.down('field[name="connector"]').setValue(l.connector);ag.down('field[name="partner"]').setValue(l.partner);ag.down('field[name="partnerkey"]').setValue(l.partnerkey);ag.down('field[name="messageid"]').setValue(l.messageid);ag.down('field[name="payTitle"]').setValue(l.payTitle);Ext.getCmp("subMchSelect").setValue({subMch:l.subMch});o(1,l.id);ag.down('field[name="link"]').setValue(l.mark);var ae=d.getSelectionModel();V=true;var ac=d.getStore();for(var ab=0;ab<ac.getCount();ab++){var ad=ac.getAt(ab);ae.select(ab,true)}var af=l.uid;ag.getForm().checkValidity()})}function F(ab,ad){var Z=Ext.getCmp("subMchSelect").getValue().subMch;var Y=encode(Ext.getCmp("payTitle").getValue().trim());var ae=ab.up("form");if(!d||!ae||!ae.isValid()){return}var af=d.getSelectionModel().getSelection();var ac=[];for(var aa=0;aa<af.length;aa++){ac.push(af[aa].get("id"))}ae.getEl().mask(window.top.getIi18NText("sendingData"));ab.disable();ae.submit({url:"auth!savWepub.action",params:{gids:ac.join(","),ptitle:Y,subMch:Z},submitEmptyText:false,success:function(ah,ag){ae.getEl().unmask();var ai=ag.result.msg;if(ag.result.code==0){Ext.example.msg(window.top.getIi18NText("systemMessage"),ai,function(){ab.enable();z.close();k()});return}else{Ext.Msg.alert(window.top.getIi18NText("systemMessage"),ag.result.msg)}ab.enable()},failure:function(ag,ah){Ext.Msg.alert(getIi18NText("systemMessage"),getIi18NText("loginTimeoutTip01"),function(){window.location.replace("auth!logOffUser.action")})}})}function f(){var Z=z.down("form");var aa=Z.down('field[name="wid"]').getValue();var Y=Z.down('field[name="userId"]').getValue();if(isNaN(Y)||parseInt(Y)!=1){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),getIi18NText("perm_refuse"));return}if(isNaN(aa)){return}Ext.Ajax.request({url:"auth!modifyWechatConfig.action",params:{id:aa},method:"post",success:function(ab,ac){var ad=Ext.decode(ab.responseText);if(ad&&ad.code!=0){Ext.Msg.alert(getIi18NText("systemMessage"),ad.msg);return}Ext.example.msg(window.top.getIi18NText("operationTips"),window.top.getIi18NText("success"));z.close();k()},failure:function(ab){Ext.Msg.alert(getIi18NText("systemMessage"),getIi18NText("timeout"))}})}function W(Z,ab,ae,aa,ac,Y,ad){if(Y.get("status")&&Y.get("status")==10){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("dfWepublicDelTip"));return}Ext.Msg.show({icon:Ext.MessageBox.QUESTION,title:window.top.getIi18NText("systemMessage"),cls:"msgCls",msg:window.top.getIi18NText("wp_delwarm","<font color=red>"+Y.get("name")+"</font>"),animateTarget:ad,plain:true,buttons:Ext.MessageBox.OKCANCEL,buttonText:{ok:getIi18NText("delete"),cancel:getIi18NText("cancel")},fn:function(af,ah,ag){if(af=="ok"){L.getEl().mask(window.top.getIi18NText("deling"));Ext.Ajax.request({url:"auth!delWepublic.action",params:{i:Y.get("id")},method:"post",callback:function(ak,al,aj){L.getEl().unmask();var ai=showResult(al,aj);if(ai==false){return}Ext.example.msg(window.top.getIi18NText("operationTips"),window.top.getIi18NText("success"));k()}})}}})}function B(Z,ab,ae,aa,ac,Y,ad){P(ad,Y.get("id"))}function Q(Z,ab,ae,aa,ac,Y,ad){P(ad,Y.get("id"),3)}function x(){z.close()}function m(Y){if(C&&d){d.getSelectionModel().deselectAll();d.getStore().load({params:{state:A}})}}function i(Y,Z){b.update(Z);b.showBy(Y,null,[50,-60]);Y.addListener("mouseout",function(){b.hide()})}function o(Y){var Z=Ext.getCmp("wid").getValue();Ext.Ajax.request({url:"auth!genBtnLink.action",params:{lnkType:Y,wid:Z},method:"post",callback:function(ab,ac,aa){Ext.getCmp("link").setValue(aa.responseText)}})}function D(){var Y=Ext.getCmp("queryGoodsWin");if(Y){Y.close();y.clear()}}showGoodsInfo=function(Z,Y){if(Z){y.clear();Ext.each(Z.items,function(aa,ab,ac){if(!y.contains(aa.get("id"))){y.add(aa.get("id"),aa)}})}};function T(){Ext.each(y.items,function(Z,aa,ab){H(Z)});var Y=Ext.getCmp("queryGoodsWin");if(Y){Y.close();y.clear()}}function H(ac){var ab=ac.data?ac.data:ac;var af={id:ab.id,name:ab.name,price:ab.price,url:ab.url,code:ab.code,aisle:ab.aisle?ab.aisle:1,remark:ab.remark,content:ab.content};var ah=d.getStore();var ag=d.getSelectionModel();var Y=af.name;var ae=af.price;var aa=af.code;var ad=af.id;var Z=new goodsRd({id:ad,code:aa,name:Y,price:ae});ah.insert(0,Z);ag.select(0,true);ah.sort("id","DESC")}function s(ab,ad,aa,Y,ae){iframeImg=120;var ac={frame:false,modal:true,constrain:true,border:false,maximizable:true,width:980,height:550,minWidth:480,minHeight:300,autoScroll:true};var Z=Ext.getCmp("queryGoodsWin");if(Z){Z.show(function(){})}else{Ext.merge(ac,{id:"queryGoodsWin",xtype:"panel",layout:"border",title:window.top.getIi18NText("goods_li"),iconCls:"pback_write_IconCls",width:900,height:400,maximizable:true,selType:"checkboxmodel",selModel:p,html:'<iframe frameborder="0" width="100%" height="100%" src="source!goodsManage.action" ></iframe>',bbar:["->",{xtype:"button",text:getIi18NText("cancel"),margin:"0 5 0 0",iconCls:"pback_reset_IconCls",handler:D},{xtype:"button",iconCls:"pback_finish_IconCls",text:getIi18NText("confirm"),handler:T}],listeners:{beforeShow:function(){},beforeClose:function(){y.clear()}}});Z=Ext.create("Ext.window.Window",ac).show()}}});