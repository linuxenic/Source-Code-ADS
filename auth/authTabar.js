var resizePWin,switchTabFn;Ext.onReady(function(){window.setTimeout(function(){a()},500);function a(){var b=Ext.create("Ext.tab.Panel",{renderTo:Ext.getBody(),minTabWidth:60,shadow:false,defaults:{border:false,autoRender:true},height:"100%",items:Ext.decode(decode(AUTH_TBAR))});if(Ext.decode(decode(AUTH_TBAR)).length==0){b.add({title:window.top.getIi18NText("systemMessage"),html:"<div style='width: 100%;height: 100%;display:table;text-align:center !important'><span style='height: 100%;display:table-cell;vertical-align:middle;'><img style='vertical-align: middle;' src='"+BASEPATH+"images/"+window.top.getIi18NText("noauth")+"'></span></div>",border:false})}Ext.get(window).addListener("resize",function(f,d,c){b.doLayout()});switchTabFn=function(c){b.setActiveTab(c)}}});