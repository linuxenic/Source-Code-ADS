var defaultSelect;var getLog;var isShowGetLog=false;Ext.onReady(function(){Ext.getBody().mask(window.top.getIi18NText("loadingSysInfo"));var viewport,running=false,timeOutId;var theTabIsShow=function(){return window.name==parent.nowTabName};var AUTH=Ext.merge({downLog:false},Ext.decode(decode(AUTH_TBAR)));getLog=function(){Ext.Ajax.request({url:"system!getLog.action",timeout:1800000,success:function(response){Ext.getBody().unmask();var text=eval("("+response.responseText+")");if(text.code=="0"){window.location.href=getWebPath()+"/page/terminal/monitor/log/"+text.msg}else{Ext.Msg.alert(window.top.getIi18NText("systemMessage"),text.msg);return}},failure:function(response){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("timeout"));Ext.getBody().unmask()}})};var xNum=60;var data1=[];for(var i=1;i<=xNum;i++){data1.push({point:i,data:0})}var store3=Ext.create("Ext.data.JsonStore",{fields:["point","data"],data:data1});var cpuCharts=Ext.create("Ext.chart.Chart",{width:460,height:200,animate:false,store:store3,axes:[{type:"Numeric",position:"left",fields:["data"],title:window.top.getIi18NText("CPUUtilization"),grid:true,minimum:0,maximum:100}],series:[{type:"line",axis:"left",xField:"point",yField:"data",showMarkers:false,highlight:false,fill:true}]});var memoryNum=60;var data2=[];for(var i=1;i<=memoryNum;i++){data2.push({point:i,data:0})}var store4=Ext.create("Ext.data.JsonStore",{fields:["point","data"],data:data2});var memoryCharts=Ext.create("Ext.chart.Chart",{width:460,height:200,animate:false,store:store4,axes:[{type:"Numeric",position:"left",fields:["data"],title:window.top.getIi18NText("memoryUsage"),grid:true,minimum:0,maximum:100}],series:[{type:"line",axis:"left",xField:"point",yField:"data",showMarkers:false,highlight:false,fill:true}]});viewport=Ext.create("Ext.container.Viewport",{layout:{type:"border"},renderTo:document.body,border:false,style:"background: white",bodyStyle:"background: white",defaults:{xtype:"fieldset",margin:1,layout:"vbox"},items:[{region:"north",xtype:"fieldset",width:"100%",title:window.top.getIi18NText("OSInfo"),height:"60%",items:[{xtype:"panel",border:false,header:false,layout:"hbox",height:30,defaults:{xtype:"displayfield",labelWidth:100,labelAlign:"right",labelStyle:"color: #0E445F;",fieldStyle:"color: #27A4E0;"},items:[{fieldLabel:window.top.getIi18NText("SysName"),id:"fieldOSName"},{fieldLabel:window.top.getIi18NText("systemVersion"),id:"fieldOSVersion"},{fieldLabel:window.top.getIi18NText("RAM"),id:"fieldOSmemory"},{fieldLabel:window.top.getIi18NText("jdkVersion"),id:"fieldJDK"}]},{xtype:"panel",header:false,border:false,width:"100%",layout:{type:"hbox",pack:"center"},items:[cpuCharts,memoryCharts]}]},{region:"west",width:"50%",height:"40%",collapsible:true,title:window.top.getIi18NText("productInfo"),defaults:{xtype:"displayfield",labelWidth:100,labelAlign:"right",labelStyle:"color: #0E445F;",fieldStyle:"color: #27A4E0;"},items:[{fieldLabel:window.top.getIi18NText("productName"),id:"fieldProductName"},{fieldLabel:window.top.getIi18NText("productVersion"),id:"fieldProductVersion"},{xtype:"button",text:window.top.getIi18NText("jsp_msg_patchinfo"),id:"fieldUpdateLog",margin:"3 0 0 40",handler:function(){getpatchinfo()}},{xtype:"button",text:window.top.getIi18NText("getLog"),id:"fieldGetLog",margin:"20 0 0 40",hidden:!AUTH.downLog,handler:function(){getLog()}}]},{region:"east",width:"50%",height:"40%",title:window.top.getIi18NText("netWorkInfo"),collapsible:true,defaults:{xtype:"displayfield",labelWidth:110,labelAlign:"right",labelStyle:"color: #0E445F;",fieldStyle:"color: #27A4E0;"},items:[{fieldLabel:window.top.getIi18NText("intranetIP"),id:"fieldLocalIP"},{fieldLabel:window.top.getIi18NText("extranetAbbr"),id:"fieldInternetIP"},{fieldLabel:window.top.getIi18NText("MACAbbr"),id:"fieldMAC"}]}],listeners:{afterrender:function(){Ext.getBody().unmask();refreshSystemInfo("all");timeoutRefresh()}}});function timeoutRefresh(){window.clearTimeout(timeOutId);timeOutId=window.setTimeout(function(){refreshSystemInfo("monitor");timeoutRefresh()},2000)}function refreshSystemInfo(T){if(running||theTabIsShow()!=true){return}running=true;Ext.Ajax.request({url:"system!getSystemRunningInfo.action",params:{t:T},success:function(data,opt){if(!data||Ext.isEmpty(data.responseText)||theTabIsShow()!=true){running=false;return}var R=Ext.JSON.decode(data.responseText);for(var i=0;i<data2.length;i++){if(i==data2.length-1){data2[i]["data"]=R.memoryPercent;break}data2[i]["data"]=data2[i+1]["data"]}store4.loadData(data2);for(var i=0;i<data1.length;i++){if(i==data1.length-1){data1[i]["data"]=R.cpuPercent;break}data1[i]["data"]=data1[i+1]["data"]}store3.loadData(data1);if(T=="all"){Ext.getCmp("fieldOSName").setValue(R.osname);Ext.getCmp("fieldOSVersion").setValue(R.osversion);Ext.getCmp("fieldOSmemory").setValue(R.memory);Ext.getCmp("fieldJDK").setValue(R.jdk);var product_name=R.productName;if("noads"==localValue){product_name=window.top.getIi18NText(names)}Ext.getCmp("fieldProductName").setValue(product_name);Ext.getCmp("fieldProductVersion").setValue(R.productVersion);Ext.getCmp("fieldLocalIP").setValue(R.ip);Ext.getCmp("fieldInternetIP").setValue(R.internetIP);Ext.getCmp("fieldMAC").setValue(R.mac)}running=false}})}function getpatchinfo(){Ext.Ajax.request({url:"system!getpatchLog.action",timeout:20000,success:function(response){Ext.getBody().unmask();var text=eval("("+response.responseText+")");if(text.code=="0"){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),text.msg.replace(new RegExp("\n","g"),"<br/>"));Ext.Msg.show({title:window.top.getIi18NText("systemMessage"),msg:"<div style='width:500px; height:300px; overflow:auto;'>"+text.msg.replace(new RegExp("\n","g"),"<br/>")+"</div>",textAlign:"left"})}else{Ext.Msg.alert(window.top.getIi18NText("systemMessage"),text.msg)}},failure:function(response){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("timeout"));Ext.getBody().unmask()}})}});