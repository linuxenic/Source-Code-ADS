/** item manager */
var nowTabName;
var tabPanel 
Ext.onReady(function() {
	// 1.start
	window.setTimeout(function(){
		initPage();
	},500);
	
	// 2.init
	function initPage(){
			var bodyHe = Ext.getBody().getHeight();
			//2.create
			 tabPanel = Ext.create('Ext.tab.Panel', {
				renderTo : Ext.getBody(),
				minTabWidth : 60,
				shadow : false
				,defaults:{
				    border: false
				}
			    ,height: '100%'
			    ,listeners: {
			    	 afterrender: function($t){
			    		 if($t.getActiveTab() != null){
			    			 nowTabName = $t.getActiveTab().name;
			    		 }
			    	 },
			    	 tabchange: function($t,newT){
			    		 nowTabName =newT.name;
			    	 }
			    }
			    ,items: Ext.decode(decode(AUTH_TBAR))
			});
			 
			if(Ext.decode(decode(AUTH_TBAR)).length == 0){
				tabPanel.add({
		    		  title: window.top.getIi18NText('systemMessage')
		    		  ,html: "<div style='width: 100%;height: 100%;display:table;text-align:center !important'><span style='height: 100%;display:table-cell;vertical-align:middle;'>"
						+"<img style='vertical-align: middle;' src='"+BASEPATH+"images/"+window.top.getIi18NText('noauth')+"'></span></div>"
		    		  ,border: false
			    });
			}
			
			
			//3.event
			Ext.get(window).addListener('resize',function(e, t, eOpts){
				  tabPanel.doLayout();
			});
	}
});