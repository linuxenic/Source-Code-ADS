var showTerminal,showTerminalDetail,isFreshing=true,freshPlanTimeout,isPlanfresh=false;Ext.onReady(function(){Ext.QuickTips.init();var i,k=getWebPath();var f={name:"",sortKey:"name",sortVal:"ASC"};var e,h=true,d,c;if(showType=="P"){tabStore=Ext.create("Ext.data.Store",{fields:["tGroup","flowNum","uploadTime","status"],buffered:false,pageSize:20,proxy:{type:"ajax",url:"passengerflow!terminalPassengerflowList.action?tid="+tid,reader:{type:"json",root:"data",tiemout:20000,totalProperty:"totalCount"}},autoLoad:false,listeners:{load:function(l){Ext.getBody().unmask()}}});i=Ext.create("Ext.container.Viewport",{layout:"border",renderTo:document.body,border:false,items:[{region:"north",height:40,width:400,id:"northContanier",layout:{type:"hbox",align:"middle",defaultMargins:{right:3}},bodyCls:"x_panel_backDD",items:[{xtype:"image",src:"",width:40,height:24,imgCls:"searchIconCss",},{fieldLabel:getIi18NText("terminalName"),labelWidth:50,xtype:"textfield",width:190,id:"pname",emptyText:window.top.getIi18NText("keyword"),hidden:true},{xtype:"datefield",fieldLabel:getIi18NText("beCreatedTimne"),hidden:false,format:dateFormat,labelWidth:80,width:270,id:"btime",name:"btime",emptyText:getIi18NText("startTime")},{xtype:"datefield",id:"etime",hidden:false,format:dateFormat,width:180,emptyText:getIi18NText("endTime"),listeners:{select:function(m){var l=m.getValue();l.setHours(23,59,59);m.setValue(l)}}},{xtype:"button",id:"queryBut",iconCls:"queryIconCss",text:getIi18NText("select"),handler:function(){g("true")}}]},{region:"center",border:false,layout:"fit",listeners:{resize:j,afterRender:g}}]})}else{tabStore=Ext.create("Ext.data.Store",{fields:["proid","proname","pageid","pagename","mname","clickTime","stayTime","status"],buffered:false,pageSize:10,proxy:{type:"ajax",url:"statistics!terminalStatisticsList.action?tid="+tid,reader:{type:"json",root:"data",tiemout:20000,totalProperty:"totalCount"}},autoLoad:false,listeners:{load:function(l){Ext.getBody().unmask()}}});i=Ext.create("Ext.container.Viewport",{layout:"border",renderTo:document.body,border:false,items:[{region:"north",height:40,width:400,id:"northContanier",layout:{type:"hbox",align:"middle",defaultMargins:{right:3}},bodyCls:"x_panel_backDD",items:[{xtype:"image",src:"",width:40,height:24,imgCls:"searchIconCss",},{fieldLabel:getIi18NText("programName"),labelWidth:50,xtype:"textfield",width:190,id:"pname",emptyText:window.top.getIi18NText("inputProgramName")},{xtype:"datefield",fieldLabel:getIi18NText("beCreatedTimne"),hidden:false,format:dateFormat,labelWidth:80,width:270,id:"btime",name:"btime",emptyText:getIi18NText("startTime")},{xtype:"datefield",id:"etime",hidden:false,format:dateFormat,width:180,emptyText:getIi18NText("endTime"),listeners:{select:function(m){var l=m.getValue();l.setHours(23,59,59);m.setValue(l)}}},{xtype:"button",id:"queryBut",iconCls:"queryIconCss",text:getIi18NText("select"),handler:function(){g("true")}}]},{region:"center",border:false,layout:"fit",listeners:{resize:j,afterRender:g}}]})}function g(l){isFreshing=false;if(l!="true"){if(btime){Ext.getCmp("btime").setValue(btime)}if(etime){Ext.getCmp("etime").setValue(etime)}}var n=Ext.getCmp("pname").getValue();if(Ext.getCmp("btime").getValue()){btime=Ext.getCmp("btime").getValue()}if(Ext.getCmp("etime").getValue()){etime=Ext.getCmp("etime").getValue()}if(btime>etime&&etime){Ext.example.msg(window.top.getIi18NText("operationTips"),'<font color="red">'+window.top.getIi18NText("programTip04")+"</font>");return}var m=(etime-btime)/(1000*60*60*24);if(m>360){Ext.example.msg(getIi18NText("operationTips"),'<font color="red">'+getIi18NText("operationRangeTips")+"</font>");return}tabStore.on("beforeload",function(p,q){var o={n:n,b:Ext.Date.format(btime,dateFormat),e:Ext.Date.format(etime,dateFormat)};Ext.apply(p.proxy.extraParams,o)});tabStore.loadPage(1,{callback:function(p,o,q){if(q==false){isFreshing=false;alert(getIi18NText("monitor_error_01"));return}isFreshing=true}})}function a(l){if(l===1){return getIi18NText("jsp_success")}return"<span style='color:red;'>"+getIi18NText("jsp_fail")+"</span>"}function b(l){if(l===1){return getIi18NText("normal")}}function j(l,m){if(showType=="P"){gridPanel=Ext.create("Ext.grid.Panel",{frame:false,store:tabStore,columns:{items:[{text:getIi18NText("No"),width:50,xtype:"rownumberer",align:"center"},{text:getIi18NText("belongTeam"),dataIndex:"tGroup",flex:2,align:"center"},{text:getIi18NText("passengerFlowNum"),dataIndex:"flowNum",flex:2,align:"center"},{text:getIi18NText("recordingTime"),dataIndex:"uploadTime",minWidth:200,flex:2,align:"center"}],defaults:{menuDisabled:true,sortable:false}},bbar:Ext.create("Ext.PagingToolbar",{store:tabStore,displayInfo:true,displayMsg:getIi18NText("jsp_paging"),emptyMsg:getIi18NText("jsp_nodata")}),margin:1})}else{gridPanel=Ext.create("Ext.grid.Panel",{frame:false,store:tabStore,columns:{items:[{text:getIi18NText("No"),width:50,xtype:"rownumberer",align:"center"},{text:getIi18NText("programName"),dataIndex:"proname",flex:2,align:"center"},{text:getIi18NText("jsp_page"),dataIndex:"pagename",minWidth:200,flex:2,align:"center"},{text:getIi18NText("jsp_materialName"),dataIndex:"mname",minWidth:200,flex:2,align:"center"},{text:getIi18NText("jsp_browsingtime"),dataIndex:"clickTime",flex:3,align:"center"},{text:getIi18NText("jsp_staylong")+"(s)",dataIndex:"stayTime",flex:5,align:"center",editor:{xtype:"textfield",readOnly:true}},{text:getIi18NText("jsp_playingStatus"),dataIndex:"status",flex:2,align:"center",renderer:a}],defaults:{menuDisabled:true,sortable:false}},bbar:Ext.create("Ext.PagingToolbar",{store:tabStore,displayInfo:true,displayMsg:getIi18NText("jsp_paging"),emptyMsg:getIi18NText("jsp_nodata")}),margin:1})}l.add(gridPanel)}});