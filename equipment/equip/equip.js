/** item manager */
Ext.Loader.setConfig({
		 enabled: true
		 ,paths: {
			 'Ext.ux.DataView':'js/ext/examples/ux/DataView/'
		 }
});
var componentTypes = {
		netpage : '6'
	};
/**
 * 树菜单
 */
var treePanel,terminalGroupstore,delaySearchTerminalFn;
var dataStoreProxy,termiStoreProxy;
var  showTerminalDetail,removeTerminal,openScreenImg,sendOrder,showScreenWin,shutdownFn,showMoreFn,viewTimerWinow,isFreshing = true,freshPlanTimeout,isPlanfresh=false,moreMenuCmp;
var goodsCmpSuf = "_goodsSuf" , goodsFarmeN = "_goods_frame", nowCompId,goodChoPanel = "netpage_area_commId", curGoods, manaGoods, addGoodsWin, showGoodsInfo,newGoodsInfo,newGoodsKhInfo, riceGoodsInfo,iframeImg = '120';
var cardPanelMap = new Ext.util.HashMap(), cardMapKeys, terminalGrid, tabCtr = 1;
var rowEditing;
var terUserName=null;//单个终端分配前的用户名字GZE
var terShareName=null;//单个终端共享时名字
var preUserId;//前一个选择的用户Id
var shareData;//单个终端共享时纪录的数据
var reSeUserFn;
var showVideo;
var changeVideoShow;//视频画面的切换
var moniaddgoods=false;
var ttshow;
var mp;//地图模式中用到的地图
var cuMaps=[];//当前查询到的终端的地理位置和终端Id
var refresh1=false;//窗口模式是否刷新标志
var refresh2=false;//表格模式是否刷新标志
var refresh3=false;//地图模式是否刷新标志
var tidOrder='';
var tnameOrder='';
var ctrlTrUl="ctrlTrUl_prefix_orders",editOrderRowFn,orderGrid;
/**
 * 显示ajax处理结果 终端独有
 * */
function showResult(success, res){
	   var result;
	   if(res['timedout'] == true){ //超时
		   Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout')+"<br/><font color='red'>("+getIi18NText("dealTimeoutTip01")+")</font>");
		   return false;
	   }
	   if( success == false){
		   console.info("response error!－－"+res.status);
	  		if(res.status !="200"&&res.status!="0"){
	  			Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("dataError")+"<br/><font color='red'>("+getIi18NText("dataErrorTip")+")</font>");
	  			return false;
	 		}
	   }
	   var result;
	   try{
		   result = Ext.decode(res['responseText']);
	   }catch(e){
		   Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("loginTimeoutTip01"),function(){
			   window.location.replace("auth!logOffUser.action");
		   });
		   return false;
	   }
	   if(result['code'] != 0){
		   Ext.Msg.alert(getIi18NText('systemMessage'), result['msg']);
		   return false;
	   }
	   return result;
}
Ext.onReady(function() {
	 // 1.start
	Ext.getBody().mask(getIi18NText('loadingInfo'));
	Ext.QuickTips.init();
	//vtype
	var terName = /^[a-zA-Z0-9-_\u4e00-\u9fa5\\s]{1,16}$/;
	//variable
	var viewport,timeId,oldSortId = 'sort_0_name_ASC'
		,viewTable_prefix="view_ul",planWinow,ajaxProxy,planStore,datastore, goodsStore, goodsWinow, tgProxy, tgHisProxy
		,globalTid,webpath=getWebPath(),diskinfoChangeFn,diskinfoMap = new Ext.util.HashMap(), marginVal = (getIi18NText('confirm') == 'OK') ? 0 : 45
	    ,terAview="terA_view";
	var filterObj = {name: '', sortKey: 'name', sortVal: 'ASC'};
	var commonTimeoutId, autoFresh=true, tplItem, tplshutItem, goodsGrid, btnPanel, multiOptBtn;
    var  AUTH = Ext.merge({video:false, audio:false, screen: false, off: false, "delete": false, play: false, pub: false, restart: false,distribution:false,share:false,
    	filein:false,fileout:false,mapmode:false,morebtn:true,showgood:false,singleauth:false,viewSwitch:true,remotedo:false,httpsbtn:false,"self":true}, Ext.decode(decode(AUTH_TBAR))); //GZE 加上终端分配权限distribution	
    if(parent.parent.isweiline){
		parent.tabPanel.setActiveTab("terminalActive");
	}
	Ext.define('Record', {
	    extend: 'Ext.data.Model',
	    fields: [
	        {name: 'gid',  type: 'int'},
	        {name: 'name',  type: 'string'},
	        {name: 'code',   type: 'string'},
	        {name: 'price',   type: 'string'},
	        {name: 'num', type: 'int'},
	        {name: 'aisle', type: 'int'}
	    ],
	    changeName: function() {
	        var oldName = this.get('name'),
	            newName = oldName + " The Barbarian";
	        this.set('name', newName);
	    }
	});
	
	var wdata = [
          {week: getIi18NText('Monday'), weekval: 1,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Tuesday'), weekval: 2,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Wednesday'), weekval: 3,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Thursday'), weekval: 4,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Friday'), weekval: 5,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Saturday'), weekval: 6,  btime: '08:30:00', etime: '17:30:00', isopen: false}
         ,{week: getIi18NText('Sunday'), weekval: 0,  btime: '08:30:00', etime: '17:30:00', isopen: false}
			         
	];
	//终端组下拉列表的store
	var groupStore = Ext.create('Ext.data.Store', {
	    fields: ['gid', 'gname']
	   ,autoLoad: true
       ,proxy: {
    	      type: 'ajax'
    	     ,url: 'terminal!selTerminalGroupList.action'
    	     ,reader: {
    	    	    type: 'json',
                    root: 'data',
                    tiemout: 20000,
                    totalProperty: 'totalCount'
             }
       }
	   ,listeners: {
		    load: function(){
		    	this.loadData([{'gid':-1, 'gname':''+getIi18NText('allTerminalTeams')+''}],true);
		    }
	   }
	});
	//店铺下拉列表的store
	var stoStore = Ext.create('Ext.data.Store', {
		fields: ['sid', 'storeName']
	,autoLoad: true
	,proxy: {
		type: 'ajax'
			,url: 'terminal!selStoreList.action'
				,reader: {
					type: 'json',
					root: 'data',
					tiemout: 20000,
					totalProperty: 'totalCount'
				}
	}
	,listeners: {
		load: function(){
//			this.loadData([{'sid':-1, 'storeName':''+'所有店铺'+''}],true); //allstore
			this.loadData([{'sid':-1, 'storeName':''+getIi18NText('allstore')+''}],true); //
		}
	}
	});
	//用户下拉列表的store
	var allUserStore = Ext.create('Ext.data.Store', {
	      fields:['uid','chname']
		  ,autoLoad: true
	      ,proxy: {
    	     type: 'ajax'
    	     ,url:'terminal!chUser.action'
    	     ,reader: {
    	    	    type: 'json',
                    root: 'data',
                    tiemout: 20000,
                    totalProperty: 'totalCount'
             }
	      }
          ,listeners: {
        	  load:function(){
        		  this.loadData([{'uid':-1, 'chname':'- -'+getIi18NText('username')+'- -'}],true);
			    }
		}
 });
	
	var msgStore = Ext.create('Ext.data.Store', {
	    autoLoad: true,
	    fields: [
	             {name: 'id', type: 'string'},
	             {name: 'content', type:'string'},
	             {name: 'beginTime', type:'string'},
	             {name: 'endTime', type:'string'}
	         ],
	    proxy: {
	        type: 'ajax',
	        url : 'terminal!getCutInMessage.action',
	        reader: {
	            type: 'json',
	            totalProperty:'total',
	            root: 'data'
	        }
	    }
	});
//	dataStoreProxy =  getAjaxProxy({url: 'terminal!monitorTerminal.action'});
	dataStoreProxy =  getAjaxProxy({url: 'terminal!monitorEquip.action'});
	var dataStore = Ext.create('Ext.data.Store', {
		fields:[{name: 'terId', type: 'int'},
		        'name',
		        'ip',
		        'screen',
		        'groupName',
		        //'company',
		        'stateValue',
		        'imgsrc',
		        'stateText',
		        'authType',
		        'terNum',
		        'owner',
		        'width',
		        'height',
		        'content',
		        'authIds',
		        'mac',
		        'isShare',
		        'version'
		        ,'storeName'
		        ,'storeId'
		        ,'qudian']
	// data: data
	,buffered: false
	,pageSize: 10
	,leadingBufferZone: 20
    ,sorters: [{
        property: 'stateValue', 
        direction: 'ASC'
    },{
        property: 'stateText',
        direction: 'ASC'
    }]
	,proxy: dataStoreProxy
	
	//,autoLoad: true
	,listeners: {
		load:function($this){
			$this.sort('stateText', 'ASC');
			Ext.getCmp('imgTotalfield').setValue($this.getTotalCount());
            var arry = [];  
            $this.each(function(record) {  
	              if(recordIds.containsKey(record.data.terId))  
	                  arry.push(record);  
	              checkboxModel.select(arry, true);
            });
            checkboxModel.addListener('deselect', deselect);
		},            
		beforeload : function($this) {  
            checkboxModel.removeListener('deselect', deselect);  
        }
	}
	});

	cardPanelMap.add('leadHead1','imgCenterArea');
	cardPanelMap.add('leadHead2','leadContent02');
	cardPanelMap.add('leadHead3','mapView'); //地图模式
	cardMapKeys=cardPanelMap.getKeys();
	//终端资源的表格视图操作的菜单
	 multiOptBtn = Ext.create('Ext.menu.Menu', {
          minHeight: 30,
		   items: [{
		    	text:getIi18NText('jsp_checkVersion')
		        ,iconCls: 'detailInfoIconCss'
		        ,name: 'multiUpdate'
			    ,handler: function(){
			    	var tids = [];
			    	createUpdateTip(tids,10);
			    }
		    },{
		        text: getIi18NText('monitor_message_17')
		        ,iconCls: 'clearmaterial'
		        ,name: 'multiDelSource'
		        ,hidden:false
			    ,handler: function(){
			    	if(checkShareAuth("pub","403")){//检查选择的终端是否共享并且共享的是否有此权限
			    		var view = {itemId:'delSourceBtn'};
			    		removePlan(view, 0, true);
			    	}
			    }
		        
		    },{
		        text: getIi18NText('monitor_message_15')
		        ,iconCls: 'delIconCss'
		        ,name: 'multiDelPlan'
		        ,hidden: false
			    ,handler: function(){
			    	if(checkShareAuth("pub","403")){
				    	var view = {itemId:'delSource'};
				    	removePlan(view, 0, true);
			    	}
			    }
		    },{
		        text: getIi18NText('restartPlayer')
		        ,iconCls: 'startTerIconCss1'
		        ,name: 'multiRebootApk'
			    ,handler: function(){
			    	if(checkShareAuth("play","404")){
			    		var tids = [];
			    		sendOrder(tids, 2, getIi18NText('restartPlayer'));
			    	}
			    }
		    },{
		        text: getIi18NText('restartTerminal')
		        ,iconCls: 'startIconCss1'
		        ,name: 'multiRebootTer'
		        ,handler: function(){
		        	if(checkShareAuth("restart","405")){
		        		var tids = [];
		        		sendOrder(tids, 1, getIi18NText('restartTerminal'));
		        	}
			    }
		    }
		    ,{
		        text: getIi18NText('timePlan')
		        ,iconCls: 'menuPowerIconCss'
		        ,name: 'multiTimerShutdown'
		        ,handler: function(){
		        	if(checkShareAuth("off","407")){
		        		if(recordIds.getCount() == 0){
		        			Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_tip'));
		        			return;
		        		}
		        		var tids = [];
		        		shutdownFn(tids);
		        	}
		        }
		    },{
		        text: getIi18NText('js_message_cutinmsg')
		        ,iconCls: 'menuMsgIconCss'
		        ,name: 'multiCutMsg'
	            ,hidden:false
			    ,handler: function(){
			    	var tids = [];
			    	cutInMsgFn(tids);
			    }
		    },{
		        text: getIi18NText('removeTerminal')
		        ,iconCls: 'removeIconCss'
		        ,name: 'multiRmove'
	            ,hidden:true
			    ,handler: function(){
			    	if(checkShareAuth("delete","402")){
			    		var tids = [];
			    		recordIds.each(function(val, idx, len){
			    			tids.push(val.get("terId"));
			    		});
			    		removeTerminal(tids);
			    	}
			    }
		    }
		 ]
	 });
	    var recordIds = new Ext.util.MixedCollection();

/*			multiOptBtn.add({// 添加共享终端选项 GZE
				text: '配置打印机'
				,iconCls: 'shareCss'
				,name: 'share'
				,hidden:false
				,handler: function(){
		//			terShareName=new Array();
					if(checkShareAuth("share","416")){
						var tids = new Array();
						terShareSelected1.getStore().removeAll();
						recordIds.each(function(val, idx, len){
							terShareName.push(val.get("owner"));
							tids.push(val.get("terId"));
							val.set("uname",val.get("owner"));
							terShareSelected1.getStore().add(val);//修改弹出面板中选择终端的表格信息
						});
						var data;
						if(tids.length==0){
								Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_tip'));
						}else{
								showShare1(tids.join(","),data);
						}
					}
				}
			});*/

	
    var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {  
        listeners : {  
            'select' : select,  
            'deselect' : deselect,
            'selectionchange' : rawSelect
        }  
    });
    //检查选择的终端是否共享并且共享的是否有此权限auth:权限码如403，GZE 2016-10
    function checkShareAuth(auname,authid){
    	var shareauth=new Array();
    	var myauth=new Array();
    	recordIds.each(function(val, idx, len){
    		if(val.get("isShare")==1){
    			var ter=val.get("authIds");
    			if(ter[auname]!=authid){
    				shareauth.push(val.get("name"));
    			}
    		}else if(val.get("isShare")==0){
    			if(!AUTH[auname]){
    				myauth.push(val.get("name"));
    			}
    		}
	});
    	if(myauth.length>0&&shareauth.length>0){
    		Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('ter_names')+'<font color="red" >'+myauth.join(',')+'</font>'+','+'<font color="red" >'+shareauth.join(',')+'</font>'+getIi18NText('no_auth_msg4'));
    		return false;
    	}else if(myauth.length>0){
    		  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('ter_names')+'<font color="red" >'+myauth.join(',')+'</font>'+getIi18NText('no_auth_msg4'));
    		  return false;
    	}else if(shareauth.length>0){
    		Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('ter_names')+'<font color="red" >'+shareauth.join(',')+'</font>'+getIi18NText('no_auth_msg4'));
    		return false;
    	}
    	return true;
    }
    function deselect(me, record) {  
        if (recordIds.containsKey(record.get('terId'))) {  
            recordIds.removeAtKey(record.get('terId'));
        }  
    }  
    function select(me, record) {  
        if (!recordIds.contains(record.get('terId'))) {  
            recordIds.add(record.get('terId'),record);  
        }  
    }  
    
    function rawSelect($this, selected, eOpts){
 	   var length = recordIds.getCount();
 	   Ext.getCmp('totalSelPanel').setValue(length); //(length == 0);
    }
    
	function stateRenderFn(value){
        return  value==2?"<font color=\"green\">●&nbsp;"+getIi18NText("online")+"</font>":"<font color=\"gray\">●&nbsp;"+getIi18NText("offLine")+"</font>";
	}
	
	
	terminalGrid = Ext.create('Ext.grid.Panel', {
	    title: getIi18NText("terminalSource"),
	    iconCls: 'tabIconCss',
	    frame: false,
	    shadow:false,
	    store: dataStore,
	    selType: 'checkboxmodel',
	    selModel :checkboxModel, 
	    columns: [
            { text: getIi18NText("No"), width: 50 , xtype: 'rownumberer', sortable:false, menuDisabled:true, renderer:function(value,metadata,record,rowIndex){
            	var finalRow = 0;
            	var c = Ext.getCmp("pageOfNext").getValue();
            	if(c <= 1){
            		return rowIndex + 1;
            	}else{
            		if((rowIndex + 1) == 10){
            			return c  *  (rowIndex+1);
            		}else{
            			return (c - 1) + "" + (rowIndex+1);
            		}
            	}
        	}},
	        { text: getIi18NText("deviceName"),  dataIndex: 'name', flex: 1, minWidth: 90, sortable:true, menuDisabled:true},  //deviceName
	        { text: getIi18NText("quipmentNo"),  dataIndex: 'terNum', minWidth: 40, sortable:true, menuDisabled:true}, //quipmentNo
	        { text: getIi18NText("ownedShop"), dataIndex: 'storeName', minWidth: 80 , flex: 1, sortable:false, menuDisabled:true},  //ownedShop
	        { text: getIi18NText("status"), dataIndex: 'stateValue', minWidth: 40, renderer:stateRenderFn, sortable:false, menuDisabled:true},
	        { text: getIi18NText("screen"), dataIndex: 'screen', minWidth: 90 , sortable:false, menuDisabled:true},
	      //  { text: getIi18NText("authType"), dataIndex: 'authType', minWidth: 80 , sortable:false, menuDisabled:true},
	        { text: getIi18NText("creator"), dataIndex: 'owner', minWidth:60, sortable:false, menuDisabled:true},
	        { text: getIi18NText("IP"), dataIndex: 'ip', minWidth: 70, sortable:false, menuDisabled:true},
	        { text: getIi18NText('MACAbbr'), dataIndex: 'mac', minWidth: 70, sortable:false, menuDisabled:true},
	        { text: getIi18NText("recentOnline"), dataIndex: 'content', minWidth: 140, sortable:false, menuDisabled:true, renderer: consRenderFn},
	        { text: getIi18NText("recentOffline"), dataIndex: 'content', minWidth: 140, sortable:false, menuDisabled:true, renderer: coneRenderFn},
	        { text: getIi18NText("ownedShop"), dataIndex: 'version', minWidth: 150, sortable:false, menuDisabled:true, renderer: conVerRenderFn}   //ownedShop
	    ],
	    tools:[
			{
			    xtype:'button',
			    id:'multiOptr',
	            text: getIi18NText("upload_operate"),
	            iconCls: 'multipleOptr_icon_css',
	            hidden:false,
			    handler: function(btn, e){
			    	multiOptBtn.showBy(btn, null, [20, 10]);
			    }
		    }
	    ],
	    viewConfig: {
             trackOver: false
            ,disableSelection: false
	   }
	  ,listeners: {
          //添加排序改变事件
          sortchange: function (ct, column, direction, eOpts) {
			if(tabCtr==0){//仅在表格模式中对全部排序
				var title = column.textEl.getHTML();//获取列表头的文本
				var sortType = Ext.util.Format.uppercase(direction);//获取排序方式“DESC”或“ASC”
				if(title==getIi18NText("terNum")){
					tidOrder=sortType;
					tnameOrder='';
				}else if(title==getIi18NText("terminalName")){
					tnameOrder=sortType;
					tidOrder='';
				}
				setInitPage();
				recordIds.removeAll();
				refreshMonitarData();
			}
              }
	  }
	});
	if(!AUTH["self"]){
		// 2.create
		viewport = Ext.create("Ext.container.Viewport", {
			layout : {
				type : 'fit'
			},
			renderTo : document.body,
			defaults : {},
			border : false,
			style : 'background: white',
			height : '100%',
			width : '100%',
			items : [{
					html:"<div style='width: 100%;height: 100%;display:table;text-align:center !important'><span style='height: 100%;display:table-cell;vertical-align:middle;'>"
						+"<img style='vertical-align: middle;' src='"+BASEPATH+"images/"+getIi18NText('noauth')+"'></span></div>"
			}]
		});
		Ext.getBody().unmask();
	}else{
		//2.create
		viewport = Ext.create("Ext.container.Viewport",{
					layout: 'border',
				    renderTo: document.body,
				    border: false,
				    style: 'background: white',
				    items: [{ 
				    	    region: 'north',
				    	    height: 40
				    	    ,width: 400
				    	    ,id: 'northContanier'
				    	    ,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
				            ,bodyCls: 'x_panel_backDD'
				    	    ,items: [ {
				    	            	xtype: 'image',
				    	            	src: '',
				    	            	width: 40,
				    	            	height: 24,
				    	            	imgCls: 'searchIconCss'
				    	              },
				    	              {
				    	                 xtype: 'combo'
				    	                ,fieldLabel: getIi18NText('onTerms')
				    	                ,labelWidth: 40
				    	                ,width: 133
				    	                ,editable: false
				    	                ,id: 'switchCombo' 
				    	                ,store: [[5,getIi18NText('store')],[1,getIi18NText('terminalTeam')],[3, getIi18NText('deviceName')],[4,getIi18NText('quipmentNo')]]    
									    ,queryMode: 'local'
									    ,displayField: 'name'
									    ,valueField: 'value'
									    ,value: 5
									    ,listeners: {
									        change:  function($this, newValue, oldValue, eOpts){
									        	condEvent($this, newValue, oldValue, eOpts);
									        	setInitPage();
									        	recordIds.removeAll();
									        	refreshMonitarData();
									        }
									    }
				    	              },
				    	              {
				    	                 xtype: 'combo'
				    	                ,labelWidth: 40
				    	                ,id: 'allGroup_combo'
				    	                ,width: 90
				    	                ,hidden: true
				    	                ,editable: false
				    	                ,store: groupStore
									    ,queryMode: 'local'
									    ,displayField: 'gname'
									    ,valueField: 'gid'
									    ,value: -1
									    ,listeners: {
									        change:  function($this, newValue , oldValue , op){
									        	setInitPage();
									        	recordIds.removeAll();
									        	refreshMonitarData();
									        }
									    }
				    	              },
				    	              {
		            		            fieldLabel: getIi18NText('name')
		            		            ,id: 'searchTextId'
									    ,xtype: 'textfield'
									    ,hidden: true
									    ,maxLength: 50
									    ,width: 130
									    ,labelWidth: 30
									    ,emptyText: getIi18NText('keyword')
									    ,enforceMaxLength: true
									    ,listeners: {
									    	change: delaySearch
									    }
				            	      },
				            	      {
			            		        //    fieldLabel: '编号'
			            		            fieldLabel: getIi18NText('serNu')
			            		            ,id: 'searchBianTextId'
										    ,xtype: 'textfield'
										    ,hidden: true
										    ,maxLength: 50
										    ,width: 130
										    ,labelWidth: 30
//										    ,emptyText: '编号检索' 
										    ,emptyText: getIi18NText('serTre')
										    ,enforceMaxLength: true
										    ,listeners: {
										    	change: delaySearch
										    }
					            	      },
/*					            	      {
					            	    	      fieldLabel: '店铺'
					           // 	    	  fieldLabel: getIi18NText('serNu')
					            	    	      ,id: 'searchStoreTextId'
					            	    		  ,xtype: 'textfield'
				            	    			 
				            	    			  ,maxLength: 50
				            	    			  ,width: 130
				            	    			  ,labelWidth: 30
				            	    			  ,emptyText: '店铺检索' 
//				            	    			  ,emptyText: getIi18NText('serTre')
				            	    			  ,enforceMaxLength: true
				            	    			  ,listeners: {
				            	    				//  change: delaySearch
					            	    			  }
					            	      },*/
					            	      {
						    	                 xtype: 'combo'
						    	                ,labelWidth: 30
						    	                ,id: 'searchStoreTextId'
						    	                ,width: 130
						    	                ,editable: false
						    	                ,store: stoStore
											    ,queryMode: 'local'
											    ,displayField: 'storeName'
											    ,valueField: 'sid'
											    ,value: -1
											    ,listeners: {
											        change:  function($this, newValue , oldValue , op){
											        	setInitPage();
											        	recordIds.removeAll();
											        	refreshMonitarData();
											        }
											    }
						    	              },
				            	      {
				    	                 xtype: 'combo'
				    	                ,width: 135
				    	                ,fieldLabel: getIi18NText('status')
				    	                ,labelWidth: 38
				    	                ,editable: false
				    	                ,id: 'stateCombo'
//				    	                ,store: [[-1,'- -'+getIi18NText('allStatus')+'- -'],[2,getIi18NText('online')],[3, getIi18NText('offLine')]]
					            	      ,store: [[-1,getIi18NText('allStatus')],[2,getIi18NText('online')],[3, getIi18NText('offLine')]]
									    ,queryMode: 'local'
									    ,displayField: 'name'
									    ,valueField: 'value'
									    ,value: -1
									    ,listeners: {
									        change:  function(){
									        	setInitPage();
									        	recordIds.removeAll();
									        	refreshMonitarData();
									        }
									    }
				    	              }
					            	  ,{
					            		    xtype: 'label'
							                ,html: '&nbsp;&nbsp;'+getIi18NText('sort')+':&nbsp;'
							         },{
							            	  xtype: 'splitbutton'
							            	 ,iconCls: 'sortBut_ASC'
						    			     ,text: getIi18NText('name')
						    			     ,menu:[{id:'sort_0_name_ASC',text:getIi18NText('sequence'), handler: sortFilter},{id:'sort_0_name_DESC',text:getIi18NText('reverse'), handler: sortFilter}]
								      }
								      ,{
						            	     xtype: 'button'
								             ,iconCls: 'refreshIconCss'
							    			 ,text: getIi18NText('refresh')
							    			 ,handler: function(){
							    				 recordIds.removeAll();
							    				 refreshMonitarData();}
									   }
									   ,{
						            	       xtype: 'checkbox'
								    		  ,boxLabel: getIi18NText('autoRefresh')
								    		  ,checked: false
								    		  ,inputValue: 1
								    		  ,id: 'autoFreshCheckbox'
								    			  
									  }
									   //*************************************************************
									   ,{
					            	       xtype: 'button'
					            	       ,hidden: !AUTH.filein
				            	    	   ,text: getIi18NText('terout')
							    		   ,handler: exportStatistics
										}
									   ,{
										   xtype: 'button'
										   ,hidden: !AUTH.fileout
					            	       ,text: getIi18NText('terin')
							    		   ,handler: putin
										}
									   //显示https安全环境跳转
									   ,{
										   xtype: 'button'
										   ,hidden: (!AUTH.httpsbtn || showHppts)
										   ,text: getIi18NText('httpsenv')
										   ,handler: toHttps
									   }
									 //*************************************************************
									  ,{
					            	       	xtype: 'panel'
					            	       	,width:'100%'
					            	       	,layout: { type: 'hbox', defaultMargins: {left:marginVal}}
									  		,baseCls:''
									  		,hidden: !AUTH.viewSwitch
					            	       	,items:[
				            	  /*     	       {
			            	       	    	   xtype:'button'
			            	       	    	   ,text:getIi18NText('viewSwitch')
			            	       	    	   ,iconCls: 'refreshIconCss'
				            	       	    	,handler:viewSwitchFn
				            	       	       }*/
				            	       	     {
								            	  xtype: 'splitbutton'
								            	 ,iconCls: 'refreshIconCss'
							    			     ,text: getIi18NText('viewSwitch')
							    			     ,menu:[{id:'se_imgCenterArea',text:getIi18NText('winMode'), handler: viewSwitchFns},{id:'se_leadContent02',text:getIi18NText('tableMode'), handler: viewSwitchFns}
							    			       /*     {id:'se_mapView',text:getIi18NText('mapMode'),
							    			    	 	hidden: !AUTH["mapmode"],
							    			    	// 	hidden: true,
							    			    	 	handler: viewSwitchFns}*/
							    			     ]
				            	       	       }
					            	       	 ]
									  }] 
				             ,listeners: {
				            	  afterrender: function(){
				            		  // Allter = Ext.getCmp("imgTotalfield").getValue();
				            	  }
				             }
					    },{ 
					    	region: 'center'
				    		,border: false
				    		,layout: { type: 'card', defaultMargins:{right: 1, left: 1} }
					    	,items: [{
					    		xtype: 'fieldset'
					    		,title: getIi18NText('equipResource')   
					    		,id: cardPanelMap.get(cardMapKeys[0])
					    		,margin: '0 3 3 1'
					    		,layout: 'fit'
					    		,listeners: {
					    			resize:  resizeStore
					            }
					    	},{
					    		xtype: 'panel'
					    		,id: cardPanelMap.get(cardMapKeys[1])
					    		,border: false
					    		,layout: 'fit'
					    	},{
					    		xtype: 'panel'
						    	,id: cardPanelMap.get(cardMapKeys[2])
						    	,border: false
						    	,layout: 'fit'
						    }]
					    },{ 
					    	region: 'south',
					    	xtype: 'fieldset'
				            ,id: 'sortArea'
				            ,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
				            ,margin:'10 0 0 0'
				            ,height:35
			            	,items: [{
					            	     xtype: 'button'
						    			 ,text:getIi18NText('prePage')
						    			 ,id : 'firstButton'
						    			 ,handler: function(){
						    				 changePage("pre");
						    				 refreshMonitarData();
						    				 checkButton();
						    			 }
									   },
									   {
					            		 xtype: 'numberfield',
					            		 allBank:false,
					            		 allowDecimals: false, 
					            		 allowNegative: false,
					            		 id: 'pageOfNext',
					            		 fieldLabel: getIi18NText('currentPage'),
					            		 margin: '0 0 0 4',
					            		 labelWidth: 40,
					            		 maxWidth:110,
					            		 hideTrigger: true,
					            		 value: '1',
					            		 listeners : {  
					                         specialKey : function(field, e) {  
					                             if (e.getKey() == Ext.EventObject.ENTER) {//响应回车  
					                            	 refreshMonitarData();
					                            	 checkButton();
					                             }  
					                         }  
					                     } 
					            	  },
									  {
						            		 xtype: 'displayfield',
						            		 id:'disTotalPage',
						            		 fieldLabel: getIi18NText('totalPage'),
						            		 labelWidth: 25,
						            		 value:'0' + getIi18NText('defaultPageCount')
							           },
									  {
					            		 xtype: 'displayfield',
					            		 fieldLabel: getIi18NText('currentList'),
					            		 margin: '0 0 0 4',
					            		 labelWidth: 60
						              },
									  {
					            		 xtype: 'displayfield',
					            		 id:'pageInfo',
					            		 fieldLabel: '',
					            		 margin: '0 10 0 4',
					            		 labelWidth: 100,
					            		 value: '0-0' + getIi18NText('list')
						              },
						              {
						            		 xtype: 'displayfield',
						            		 id: 'imgTotalfield',
						            		 fieldLabel: getIi18NText("equipResource"),  
						            		 margin: '0 0 0 4',
						            		 labelStyle: 'color: red',
						            		 labelWidth: 83,
						            		 width: 115,
						            		 value: '0'
						            	},
						              {
					            	     xtype: 'button'
						    			 ,text: getIi18NText("nextPage")
						    			 ,id : 'lastButton'
						    			 ,handler: function(){
						    				 changePage("next");
						    				 refreshMonitarData();
						    				 checkButton();
						    				 }
									   },{
										   xtype:'panel',
										   width:'100%',
										   baseCls:'',
										layout: {type: 'hbox', pack: 'end' },
										   items:[{
									          xtype: 'displayfield',
									          id:'totalSelPanel',
									          fieldLabel: getIi18NText('checked'),
									          hidden: tabCtr == 1,
									          labelWidth: 50,
									          value:'0',
									          margin:'0 550 0 0'
										   }]
									   }]
				            ,listeners: {
				            	afterrender: function(){
				            		if(parent.parent.isonline){//检查是否是从在线终端数点过来的GZE
				            			Ext.getCmp("stateCombo").setValue(2);
				            		
				            		}
				            		if(parent.parent.isoffline){
				            			Ext.getCmp("stateCombo").setValue(3);
				            		}
				            	}
				            }
					    }]
		});
	}
	function consRenderFn(value,metaData,record,rIndex,cIndex){//GZE 2016-9-18 渲染最近在线离线
		if(typeof(value)!="object"){//确保value是个对象
			value=Ext.decode(value);
		}
		if(value.stime=="0"||typeof(value.stime)=="undefined"){
			//	data.stime="没有在线记录";
			return "<font color='green' >"+getIi18NText("noOnrecord")+"</font>";
			}
		return "<font color='green' >"+value.stime+"</font>";
	}
	function coneRenderFn(value,metaData,record,rIndex,cIndex){//GZE 2016-9-18 渲染最近在线离线
		if(typeof(value)!="object"){ //确保value是个对象
			value=Ext.decode(value);
		}
		if(value.etime=="0"||typeof(value.etime)=="undefined"){
			//data.etime="没有离线记录";
			return "<font color='red' >"+getIi18NText("noOffrecord")+"</font>";
		}
		return "<font color='red' >"+value.etime+"</font>";
	}
	function conVerRenderFn(value,metaData,record,rIndex,cIndex){//GZE 2016-1-13 渲染APK版本
		//console.info("等到版厄本"+value);
		if(value==""||typeof(value)=="undefined"||value==null){
			//data.etime="没有离线记录";
			return "<font  >"+getIi18NText("no_version")+"</font>";  
		}
//		return "<font color='red' >"+value.etime+"</font>";
		return "<font  >"+value+"</font>";
	}
	//设置上下翻页禁用事件
	function checkButton(){
		 currentPage = Ext.getCmp("pageOfNext").getValue();
		 var firstButton = Ext.getCmp("firstButton");
		 disTotalPage = Math.ceil(Ext.getCmp("imgTotalfield").getValue()/10);
		 var lastButton = Ext.getCmp("lastButton");
		 if(currentPage==1||currentPage==0){
			 firstButton.setDisabled(true);
		 }else{
			 firstButton.setDisabled(false);
		 }
		 if(currentPage==disTotalPage||disTotalPage==0||disTotalPage==1){
			 lastButton.setDisabled(true);
		 }else{
			 lastButton.setDisabled(false);
		 }
	}
	//上下页
	function changePage(flag){
		currentPage = Ext.getCmp("pageOfNext").getValue();
		if(flag == "next"){
				Ext.getCmp("pageOfNext").setValue(parseInt(currentPage) + 1);
		}else{
				Ext.getCmp("pageOfNext").setValue(currentPage - 1);
		}
	}
	
	//设置为第一页
	function setInitPage(){
		Ext.getCmp("pageOfNext").setValue(1);
	}
	//----------------------------终端树菜单----------------------------------
	//创建树
	terminalGroupstore = Ext.create('Ext.data.TreeStore', {
	autoLoad: false,
    root: {
         expanded: true,
         text: getIi18NText("allTerminalTeams"),
         checked: false,
         nid: 0
    }
	});

	delaySearchTerminalFn = function(){
  	  window.clearTimeout(timeId);
  	  timeId=window.setTimeout(function(){
  		     refreshMonitarData();
  	  }, 800);
    };
/*    
    delaySearchTerminalFns = function(){
    	window.clearTimeout(timeId);
    	timeId=window.setTimeout(function(){
    		refreshMonitarData();
    	}, 3000);
    };*/

  //通用勾选函数
	function checkChangeFn(node, checked){
		var checkChild = function(nodes, checked){
			 for(var i=0; i<nodes.length; i++){
				  nodes[i].set("checked",checked);
	          	  if(nodes[i].hasChildNodes()){
	        	  	 checkChild(nodes[i].childNodes, checked);
	          	  }
		     }   
		  };
		  var checkParent = function(node, checked){
			    if(node == null || node.parentNode == null) return;
			    var allSlibing = node.parentNode.childNodes;
			    for(var j=0; j<allSlibing.length; j++){
					 if(allSlibing[j].data.checked != checked){
						    node.parentNode.set("checked", false);
						    checkParent(node.parentNode, false);
					    	return;
					 }
			    }
			    node.parentNode.set("checked", checked);
			    checkParent(node.parentNode, checked);
		  };
		  
		  if(node.hasChildNodes()){
			   checkChild(node.childNodes, checked);
		  }
		  if(!node.isRoot()){
			   checkParent(node, checked);
		  }
	}

	
    //获取最新终端组
    function queryTerminalGroupFn(){
    	//saveStatus = saveStatus.split(",") ;
    	initTerminalPlan();
    }
    function initTerminalPlan(){
        //tree & data
//      	Ext.getCmp('terminalGroup').getEl().mask();
    	terminalGroupstore.setProxy({
    	      type: 'ajax'
    	     ,url: 'terminal!groupTree.action'
             ,reader: {
      	         type: 'json',
      	         timeout: 120000
             }
    	});
    	terminalGroupstore.load({
    		callback: function(){
    			Ext.getCmp('terminalGroup').getEl().unmask();
    			delaySearchTerminalFn();
    		}
    	});
    }
/*   termiStoreProxy =  getAjaxProxy({url: 'terminal!getTreeTerminal.action'});
	//终端数据
	termiStore = Ext.create('Ext.data.Store', {
	    fields: ['terId', 'name', 'groupName', 'stateValue', 'ip', 'screen', 'authType']
		,pageSize:20
		,proxy: termiStoreProxy
	   ,autoLoad: false
	   ,listeners: {
    	    load:function($this){
                    var arr = [];  
                    $this.each(function(record) {  
                        if (recordTerIds.containsKey(record.data.terId))  
                        	arr.push(record);  
                        checkboxModelTer.select(arr, true);
                    });  
                    checkboxModelTer.addListener('deselect', deselectTer);
            },  
            beforeload : function() {
            	checkboxModelTer.removeListener('deselect', deselectTer);  
            } 
       }
	});	*/
    
    //选择终端用
    var checkboxModelTer = Ext.create('Ext.selection.CheckboxModel', {  
    	listeners : {  
    		'select' : selectTer,  
    		'deselect' : deselectTer,
    		'selectionchange' : rawSelectTer
    	}  
    });  
    function deselectTer(me, record) {  
    	if (recordTerIds.containsKey(record.get('terId'))) {  
    		recordTerIds.removeAtKey(record.get('terId'));
    	}  
    }  
    function selectTer(me, record) {
    	if (!recordTerIds.contains(record.get('terId'))) {
//    		recordTerIds.add( record.get('terId'),{name: record.get("name"), screen: record.get("screen"), terId: record.get("terId")});  
    		recordTerIds.add(record.get('terId'),record);
    	}  
    }
    function rawSelectTer($this, selected, eOpts){
 	   var length = recordTerIds.getCount();
	   Ext.getCmp('executePubBtn').setDisabled( length == 0);
	   Ext.getCmp('seledTer').setValue(length);
    }
    //切换视图模式
    function refreshMonitarData(){
  	    isFreshing = false;
	    var way = Ext.getCmp('switchCombo').getValue();
	    var group=new Array() ;
	    //判断是那个界面的终端组
	    var contentId = cardPanelMap.get(cardMapKeys[tabCtr]);
		var contentPanel = Ext.getCmp(contentId);
		var contentLayout = contentPanel.up('container').getLayout();
		var nowCmp = contentLayout.getActiveItem();
		var values = cardPanelMap.getValues();
//		if(values.indexOf(contentId) > values.indexOf(nowCmp.id)){
//		console.info("dan的"+values.indexOf(contentId));
			if(values.indexOf(contentId) ==1||values.indexOf(contentId) ==2){
			//图形界面，只能查询一个组
			var groupName= Ext.getCmp('allGroup_combo').getValue();
			group.push(groupName);
		}else{
			//条形界面。 允许多个终端组
			var treePanel = Ext.getCmp("terminalGroup");
			var nodeInterfaces = treePanel.getChecked();
			for(var i =0; i<nodeInterfaces.length; i++){
				if(nodeInterfaces[i].raw['nid']==0){ //如果是全部分组，group就设定为-1，查包括共享的所有 
					group=new Array() ;
					group.push(-1);
					break;
				}
				group.push(nodeInterfaces[i].raw['nid']);
			}
			group = group.join(',');
		}
	    var state = Ext.getCmp('stateCombo').getValue();
	    var name = Ext.getCmp("searchTextId").getValue();
	    var teridB = Ext.getCmp("searchBianTextId").getValue();  //终端	    
	    var storeN = Ext.getCmp("searchStoreTextId").getValue();  //店铺
	    var authType =0;
	    var pageNext = Ext.getCmp("pageOfNext").getValue();
	    if(!isNaN(pageNext)){//输入的页数检查
   	    if(pageNext > totalPage){
   	    	Ext.getCmp("pageOfNext").setValue(totalPage);
   	    	pageNext = totalPage;
   	    	if(pageNext <= 0){
   	    		setInitPage();
   	    		pageNext = 1;
	    		}
   	    }
   	    else if(pageNext <= 0) {
   	    	Ext.getCmp("pageOfNext").setValue(1);
   	    	pageNext = 1;
   	    }
	    }else{
	    	Ext.Msg.show({ 
		           title : getIi18NText("upload_tip_tip"),  
		           msg : getIi18NText("pageError"),  
		           width : 250,  
		           icon : Ext.Msg.ERROR,  
		           buttons :Ext.Msg.OK,
		           buttonText : {
						ok : getIi18NText("confirm")
		           }
		       }); 
	    	return;
	    }
	    
   	dataStore.load({
	    	  params: {w: way, g: group, n: encode(name),tb:encode(teridB),tidO: encode(tidOrder),tnameO: encode(tnameOrder),sid:encode(storeN), t: state, a:authType, p:pageNext}	//, a:authType
             ,callback: function(records, operation, success){
           	   if(success == false){
           		   isFreshing = false;
           		   Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_error_01"));
           		   return;
           	   }
           	  if(tabCtr == 1||tabCtr==2)
           		  isFreshing = true;
       		  AllTer = dataStore.getTotalCount();
       		  totalPage = (AllTer % 10) != 0? parseInt(AllTer / 10) + 1: AllTer / 10;
       		  Ext.getCmp("disTotalPage").setValue(totalPage + getIi18NText("page") +"  ");
         	      var lastRec = pageNext * 10, startRec = (10 * (pageNext - 1) + 1);
       	      if(lastRec > AllTer)
       	    	  lastRec = AllTer;
       	      if(lastRec == 0)
       	    	  startRec = 0;
       	      //GZE面板添加空数据显示
       	      if(totalPage == 0){
       	    	  tpl2=Ext.create('Ext.XTemplate',
	                '<tpl for=".">',
	                '<br/>',
	                    '<h1 style="color:#808080">{info}</h1>',
	                '</tpl>'
	            );
       	    	var data={info:getIi18NText("roleTip05")};
       	    	if(Ext.get("terminalId")!=null){  //GZE  判断面板是否为空
       	    		tpl2.overwrite(Ext.get("terminalId"),data);
       	    		Ext.getCmp("pageOfNext").setValue(0);
       	    	}
       	      }
       	      
           	  Ext.getCmp("pageInfo").setValue(startRec + "-" + lastRec + getIi18NText("list"));
           	  cuMaps=[];
           	  if(tabCtr==2&&typeof(mp)!="undefined"){
           		  //刷新地图图标
           		  var iIndex=0;
           		  mp.clearOverlays();
           		  dataStore.each(function(r){
           			  iIndex++;
           			 var contents;
           		//	 console.info("看那"+r.get("content"));
           			  if(typeof(r.get("content"))=="object"){
           				contents =  Ext.JSON.decode("{}");
           			  }else{
           				  contents =  Ext.JSON.decode(r.get("content"));
           			  }
           			  if(typeof(contents.adress)!="undefined"){
          				 var adres =contents.adress;
          				  var poi=new BMap.Point(adres.lng,adres.lat);
          				  cuMaps.push({lng:adres.lng, lat:adres.lat,tid:r.get("terId")});//记录终端的地理位置信息
          				  createMarker(mp,poi,r.get("name"),iIndex,r.get("terId"),r.get("stateValue"),r);
           			  }else{
           			  var poi=new BMap.Point(114.107435, 22.568307);// 地址：深圳市福田区八卦岭八卦三路88号荣生大厦  的经纬度(默认)
           			  cuMaps.push({lng:114.107435, lat:22.568307,tid:r.get("terId")});//记录终端的地理位置信息
           			  createMarker(mp,poi,r.get("name"),iIndex,r.get("terId"),r.get("stateValue"),r);
           			  }
           		  });
           	  }
           	  //初始化按钮
           	  checkButton();
             }
    	});
        isFreshing = true;//不加切换终端视图的时候刷新不了
        imgToGray();
   }

	//创建树 。
	//添加组件到map
	Ext.getCmp(cardPanelMap.get(cardMapKeys[1])).add([{
			xtype:'panel',
		   layout: 'border'
	       ,border: false
	       ,bodyStyle: 'background: white'
		   ,items: [{
			         region: 'center'
			        ,layout: 'border'
			        ,bodyStyle: 'background: white;'
			        ,border: false
			        ,items: [{
			        	        xtype: 'treepanel'
				               ,region: 'west'
                               ,title: getIi18NText("terminalTeam")
                               ,tools:[{
                				    xtype:'button',
                				    tooltip: getIi18NText("getNewTerminalTeam"),
                		            text: getIi18NText("refresh"),
                		            border: false,
                		            iconCls: 'refreshIconCss',
                				    handler: queryTerminalGroupFn
                               }]
                               ,margin: '3 1 0 1'
                               ,id: 'terminalGroup'
                               ,width: 200
							   ,store: terminalGroupstore
							   ,listeners: {
						        	checkchange: function(n,c){
						        		 checkChangeFn(n,c);
						        		 refreshMonitarData();
						        	}
			                        ,load: function($this, node, records, successful, eOpts){
			                        	 node.set("checked",true);
			                        	 checkChangeFn(node, true);
			                        	 Ext.getCmp('terminalGroup').collapseAll(function(){
			                        		 Ext.getCmp('terminalGroup').expandAll();
			                        	 });
			                        }
						       }
				        },{
			        	        
			        	        xtype: 'fieldset'
			        	       ,region: 'center'
					           ,title: '<font class="boldLabelCls">'+getIi18NText("chooseTerminal")+'</font>'
					           ,margin: '0 1 0 1'
					           ,layout: 'fit'
						       ,items: 
						                [{
						                	region: 'center'
						                    ,border: false
						                    ,layout: 'fit'
						                	,items: [terminalGrid]
						                }]
			            }]
		      }]
	}]);
	var baiduHtml=[];
	baiduHtml.push('<div id="map_container">'+getIi18NText("serverNetError")+'</div>');
	//创建地图模式的界面
	Ext.getCmp(cardPanelMap.get(cardMapKeys[2])).add([{
		xtype:'panel',
		layout: 'border'
		,border: false
		,bodyStyle: 'background: white'
		,items: [{
				region: 'center'
				,layout: 'border'
				,bodyStyle: 'background: white;'
				,border: false
				,items: [{
//					xtype: 'treepanel'
					xtype: 'panel'
					,region: 'west'
					,title: getIi18NText("terminalSource")
					//,border:false
					,margin: '3 1 0 1'
			//		,id: 'terminalGroup'
					,width: 250
					 ,layout: 'fit'
					,items: [{
						xtype:'grid',
					    title: getIi18NText("terminalSource"),
					    iconCls: 'tabIconCss',
					    frame: false,
					    header:false,
					    border:false,
					    shadow:false,
					    store: dataStore,
					    columns: [
				            { text: getIi18NText("No"), width: 30 , xtype: 'rownumberer', sortable:false,align: 'center',flex: 0.5, menuDisabled:true, renderer:function(value,metadata,record,rowIndex){
				            	var finalRow = 0;
				            	var c = Ext.getCmp("pageOfNext").getValue();
				            	if(c <= 1){
				            		return rowIndex + 1;
				            	}else{
				            		if((rowIndex + 1) == 10){
				            			return c  *  (rowIndex+1);
				            		}else{
				            			return (c - 1) + "" + (rowIndex+1);
				            		}
				            	}
				        	}},
					        { text: getIi18NText("terminalName"),  dataIndex: 'name', flex: 1, minWidth: 70, sortable:false,align: 'center', menuDisabled:true},
					//        { text: getIi18NText("status"), dataIndex: 'stateValue', minWidth: 40,flex: 1, renderer:stateRenderFn, sortable:false,align: 'center', menuDisabled:true},
					        { text: getIi18NText("screen"), dataIndex: 'screen', minWidth: 90 ,flex: 1, sortable:false,align: 'center', menuDisabled:true}
					    ],
					    viewConfig: {
				             trackOver: false
				            ,disableSelection: false
					   }
						,listeners: {
							select:function($this, record,  index, eOpts ){
								var temtid="&nbsp;&nbsp;"+record.get("name")+"&nbsp;&nbsp;";
								var allOverlay = mp.getOverlays();
								for (var i = 0; i < allOverlay.length; i++){
									allOverlay[i].setAnimation(null);
									if(allOverlay[i].getLabel().content ==temtid){
										allOverlay[i].setAnimation(BMAP_ANIMATION_DROP); 
										mp.centerAndZoom(allOverlay[i].getPosition(),15);
									}
								}
							}
						}
					}]
				},{
						xtype: 'panel'
						,region: 'center'
						,margin: '3 1 0 1'
						,layout: 'fit'
						,html:baiduHtml.join('')
						,listeners: {
							afterrender: function($this){
								// 创建地图对象并初始化
							//	console.info(typeof(BMap));
								if(typeof(BMap)=="undefined"){
									return;
								}
								mp = new BMap.Map("map_container",{
									enableHighResolution: true //是否开启高清
								});
								mp.enableInertialDragging(); //开启关系拖拽
								mp.enableScrollWheelZoom();  //开启鼠标滚动缩放
								//创建鱼骨控件
								var navCtrl = new BMap.NavigationControl({
									anchor: BMAP_ANCHOR_TOP_LEFT //设置鱼骨控件的位置
								});
								// 将鱼骨添加到地图当中
								mp.addControl(navCtrl);
								
								 //创建logo自定义控件面板
								function logoPanel(){
									this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
									this.defaultOffset = new BMap.Size(0, 0);
								}
								logoPanel.prototype = new BMap.Control();
								logoPanel.prototype.initialize = function(map){
									var div = document.createElement("div");
									div.style.cursor = "pointer";
									div.style.width = "90px";
									div.style.height = "30px";
									var img = document.createElement("img");
									img.style.cursor = "pointer";
									img.style.width = "90px";
									img.style.height = "30px";
									img.src="images/other/loginLogo_azld.png";
									div.appendChild(img);
									map.getContainer().appendChild(div);
									return div;
								}
								var loPanel = new logoPanel();
								mp.addControl(loPanel);
								
								
								// //创建自定义控件面板
								function ZoomPanel(){
									this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
									this.defaultOffset = new BMap.Size(1, 1);
								}
								ZoomPanel.prototype = new BMap.Control();
								ZoomPanel.prototype.initialize = function(map){
									var div = document.createElement("div");
									div.style.cursor = "pointer";
									div.style.width = "110px";
									div.style.height = "40px";
									div.style.borderRadius = "4px";
									div.style.backgroundColor = "white";
								//	div.style.opacity = "0.8";
									map.getContainer().appendChild(div);
									return div;
								}
								var oomPan = new ZoomPanel();
								mp.addControl(oomPan);
								
								// //创建重置自定义控件
								function ZoomControl(){
								  // 默认停靠位置和偏移量
								  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
								  this.defaultOffset = new BMap.Size(60, 10);
								}
								// 通过JavaScript的prototype属性继承于BMap.Control
								ZoomControl.prototype = new BMap.Control();

								// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
								// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中 
								ZoomControl.prototype.initialize = function(map){
								  // 创建一个DOM元素
								  var div = document.createElement("div");
								  // 添加文字说明
								  div.appendChild(document.createTextNode(getIi18NText("reset")));
								  // 设置样式
								  div.style.cursor = "pointer";
								  div.style.width = "40px";
								  div.style.height = "20px";
								  div.style.color = "white";
								  div.style.lineHeight = "20px";
								  div.style.textAlign = "center"; 	
								  div.style.borderRadius = "2px";
								  div.style.backgroundColor = "#4490C7";
								  // 绑定事件,点击一次放大两级
								  div.onclick = function(e){
									  refreshMonitarData();
									//map.setZoom(map.getZoom() + 2);
								  };
								  // 添加DOM元素到地图中
								  map.getContainer().appendChild(div);
								  // 将DOM元素返回
								  return div;
								}
								// 创建控件
								var myZoomCtrl = new ZoomControl();
								// 添加到地图当中
								mp.addControl(myZoomCtrl);
								
								//创建保存自定义控件
								function ZoomControls(){
									this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
									this.defaultOffset = new BMap.Size(10, 10);
								}
								ZoomControls.prototype = new BMap.Control();
								ZoomControls.prototype.initialize = function(map){
									// 创建一个DOM元素  
									var div = document.createElement("div");
									// 添加文字说明
									div.appendChild(document.createTextNode(getIi18NText("save")));
									// 设置样式
									  div.style.cursor = "pointer";
									  div.style.width = "40px";
									  div.style.height = "20px";
									  div.style.color = "white";
									  div.style.lineHeight = "20px";
									  div.style.textAlign = "center"; 	
									  div.style.borderRadius = "2px";
									  div.style.backgroundColor = "#4490C7";
									div.onclick = function(e){
										if(dataStore.count()==0){
											return;
										}
								    	 Ext.getBody().mask(getIi18NText("monitor_message_37"));
								    	 Ext.Ajax.request({
								    	    	   url: 'terminal!saveAdress.action'
								    	    	  ,method: 'post' 
								    	    	  ,params: {mapInfo:Ext.JSON.encode(cuMaps)}
								        		  ,timedout:120000
								        		  ,failure: function(response, opts) {
								        			  Ext.getBody().unmask();
								        			  isFreshing = true;
								        			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
								        		    }
								    	    	  ,success: function(response){
								    	    		  Ext.getBody().unmask();
								    	    		  isFreshing = true;
								    	    		  var result =eval('(' + response.responseText + ')');
								    	        	  if(result.code==0){
								    	       // 		  marker.disableDragging(); //图标不可拖动
								    	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
								    	        		  recordIds.removeAll();
								    	        		  refreshMonitarData();
								    	        	  }else{
								    	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
								    	        	  }
								    	    	  }
								     	});
									};
									map.getContainer().appendChild(div);
									return div;
								}
								// 创建控件
								var myZoomCtrls = new ZoomControls();
								// 添加到地图当中
								mp.addControl(myZoomCtrls);
							} 
						}
					}]
				}]
	}]);
	//在地图上添加终端的坐标toMap：地图对象，toAdress:终端地址  toTname：终端名字 ZIndex:图标的层叠顺序,tid:终端Id,isOnline:终端是否在线
	function createMarker(toMap,toAdress,toTname,ZIndex,tid,isOnline,record){
			//点击移动终端地址触发的函数
			var pp=toAdress;
			var moveMarker = function(e,ee,marker){
				sendOrder(tid,3,getIi18NText('screenshotOnTerminal'));
			}
			var removeMarker=function(e,ee,marker){
				removeTerminal(tid);
			}
			var restartMarker=function(e,ee,marker){
				sendOrder(tid,2,getIi18NText('restartPlayer'));
			}
			var tartTMarker=function(e,ee,marker){
				sendOrder(tid,1,getIi18NText('restartTerminal'));
			}
			var pubMarker=function(e,ee,marker){
				sendOrder(tid,7,"");
			}
			var distrMarker=function(e,ee,marker){
				 distributionFn(tid);  
			}
			var timeMarker=function(e,ee,marker){
				shutdownFn(tid);
			}
			var detailMarker=function(e,ee,marker){
				showTerInfoFn(tid);
			}
			var cutMarker=function(e,ee,marker){
				cutInMsgFn(tid);
			}
			var chelMarker=function(e,ee,marker){
				updateVersion(tid);
			}
			var gooMarker=function(e,ee,marker){
				 manaGoods(tid);
			}
			var shareMarker=function(e,ee,marker){
				 shareFn(globalTid);
			}
			//创建右键菜单
			var markerMenu=new BMap.ContextMenu();
			markerMenu.addItem(new BMap.MenuItem(getIi18NText('jsp_detailInfo'),detailMarker.bind(marker)));//详细信息
			markerMenu.addItem(new BMap.MenuItem(getIi18NText('js_message_cutinmsg'),cutMarker.bind(marker)));//插播消息
			markerMenu.addItem(new BMap.MenuItem(getIi18NText('jsp_checkVersion'),chelMarker.bind(marker)));//检查版本
			markerMenu.addItem(new BMap.MenuItem(getIi18NText('goods_mana'),gooMarker.bind(marker)));//商品管理 
	    	   //需要权限管理的选项
	    	   if(record.get("isShare")==1){
	    		 var ter=record.get("authIds");
	    		 if(ter.screen!=undefined){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('screenshotOnTerminal'),moveMarker.bind(marker)));
	    		 }
	    		 if(ter.delete!=undefined){
	    			 markerMenu.addItem(new BMap.MenuItem(getIi18NText('removeTerminal'),removeMarker.bind(marker)));
	    		 }
	    		 if(ter.play!=undefined){
	    			 markerMenu.addItem(new BMap.MenuItem(getIi18NText('restartPlayer'),restartMarker.bind(marker)));
	    		 }
	    		 if(ter.restart!=undefined){
	    			 markerMenu.addItem(new BMap.MenuItem(getIi18NText('restartTerminal'),tartTMarker.bind(marker)));
	    		 }
	    		 if(ter.pub!=undefined){
	    			 markerMenu.addItem(new BMap.MenuItem(getIi18NText('listingManager'),pubMarker.bind(marker)));
	    		 }
	    		 if(ter.off!=undefined){
	    			 markerMenu.addItem(new BMap.MenuItem(getIi18NText('timePlan'),timeMarker.bind(marker)));
	    		 }
	    	   }else if(record.get("isShare")==0){
	    		   if(AUTH["screen"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('screenshotOnTerminal'),moveMarker.bind(marker)));
	    		   }
	    		   if(AUTH["delete"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('removeTerminal'),removeMarker.bind(marker)));
	    		   }
	    		   if(AUTH["play"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('restartPlayer'),restartMarker.bind(marker)));
	    		   }
	    		   if(AUTH["restart"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('restartTerminal'),tartTMarker.bind(marker)));
	    		   }
	    		   if(AUTH["pub"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('listingManager'),pubMarker.bind(marker)));
	    		   }
	    		   if(AUTH["off"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('timePlan'),timeMarker.bind(marker)));
	    		   }
/*	    		   if(AUTH["distribution"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText('ter_distribution'),distrMarker.bind(marker)));
	    		   }*/
	    	/*	   if(AUTH["share"]){
	    			   markerMenu.addItem(new BMap.MenuItem(getIi18NText("ter_share"),shareMarker.bind(marker)));
	    		   }*/
	    	   }
			if(isOnline==3){
				var myIcon = new BMap.Icon("images/map/lac_gray.png", new BMap.Size(34,44),{
					anchor: new BMap.Size(17, 38)
				});
			}else{
				var myIcon = new BMap.Icon("images/map/lac_color.png", new BMap.Size(34,44),{
					anchor: new BMap.Size(17, 38)
				});
			}
			var marker = new BMap.Marker(pp,{icon:myIcon});  // 创建标注
			marker.enableDragging();
			//创建文字标注
			var label = new BMap.Label("&nbsp;&nbsp;"+toTname+"&nbsp;&nbsp;",{offset:new BMap.Size(28,-10)});
			if(isOnline==3){
				label.setStyle({ color : "black", fontSize : "14px" ,backgroundColor: "#BDBDBD",border:"none" ,borderRadius:"6px" ,height:"25px",lineHeight:"25px"});
			}else{
			//	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				label.setStyle({ color : "black", fontSize : "14px" ,backgroundColor: "#F5ACA7",border:"none" ,borderRadius:"6px" ,height:"25px",lineHeight:"25px"});
			}
			marker.setLabel(label);
			var sContent =[];
			sContent.push('				  <div style="width:330px;height:auto;">');
			sContent.push('		       <table  id="'+viewTable_prefix+record.get("terId")+'" style=" float:left; display:block;width:160px;height:auto;">');
			sContent.push('			      <tbody style="display:block;width:100%;height:auto;">');
			sContent.push('			      <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('terminalType')+':</td><td>'+record.get("authType")+'</td>');
			sContent.push('				  </tr>');
			sContent.push('			      <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('terminalName')+':</td><td><input value="'+record.get("name")+'" class="titl" readOnly style="border:none;" /></td>');
			sContent.push('				  </tr>');
			sContent.push('			      <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('IP')+':</td><td>'+record.get("ip")+'</td>');
			sContent.push('				  </tr>');
			sContent.push('			      <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('screen')+':</td><td>'+record.get("screen")+'</td>');
			sContent.push('				  </tr>');
			sContent.push('	  <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('terminalTeam')+':</td><td><input value="'+record.get("groupName")+'" class="titl"  readOnly style="border:none;" /></td>');
			sContent.push('				  </tr>');
			sContent.push('	  <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('status')+':</td>');
			if(record.get("stateValue")==2){
				sContent.push('				    <td><font color="green">'+record.get("stateText")+'</font></td>');
			}else{
				sContent.push('				    <td><font color="red">'+record.get("stateText")+'</font></td>');
			}
/*			sContent.push('  <tpl if="stateValue == 2">');
			sContent.push('  </tpl>');
			sContent.push('  <tpl if="stateValue == 3">');
			sContent.push('  </tpl>');*/
			
			sContent.push('				  </tr>');
			sContent.push('			      <tr style=" margin-top:5px; display:block;width:100%;height:auto;">');
			sContent.push('				    <td align="right">'+getIi18NText('terNum')+':</td><td>'+record.get("terNum")+'</td>');
			sContent.push('				  </tr>');
			sContent.push('				  </tbody>');
			sContent.push('			  </table>');
			sContent.push('		 <img style="float:right;margin:8px;border:1px solid #157FCC;" id="imgDemo'+record.get("terId")+'" src="'+record.get("imgsrc")+'" width="139" height="150" title="'+record.get("name")+'"/>');
			
			sContent.push('				  </div>');
			
			// 百度地图API功能
/*			var sContent =
			"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" + 
			"<img style='float:right;margin:4px' id='imgDemo' src='http://app.baidu.com/map/images/tiananmen.jpg' width='139' height='104' title='天安门'/>" + 
			"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" + 
			"</div>";*/
			var infoWindow = new BMap.InfoWindow(sContent.join(""));  // 创建信息窗口对象
			marker.addEventListener("click", function(){          
			   this.openInfoWindow(infoWindow);
			   //图片加载完毕重绘infowindow
			   document.getElementById('imgDemo'+record.get("terId")).onload = function (){
				   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
			   }
			});
			
			marker.addContextMenu(markerMenu);
			marker.setZIndex(10+ZIndex);//设置层叠顺序 以10开始
			toMap.addOverlay(marker);	
			//拖拽后的事件
			marker.addEventListener("dragend", function(e){
				var point= e.point;
				for(var k=0;k<cuMaps.length;k++){
					if(cuMaps[k].tid==tid){
						cuMaps[k].lng=e.point.lng;
						cuMaps[k].lat=e.point.lat;
					}
				}
			});
			if(ZIndex==1){
				toMap.centerAndZoom(pp,15);
			}
	}
	//--------------------终端树end---------------------------

	function viewSwitchFns(item){
		 var iteArr = item.id.split("_");
		var contentId = iteArr[1];
		var contentPanel = Ext.getCmp(contentId);  //目标面板
		var contentLayout = contentPanel.up('container').getLayout();
		var nowCmp = contentLayout.getActiveItem();  //当前面板
		var values = cardPanelMap.getValues();
		var conIndex=values.indexOf(contentId);  
		var nowIndex=values.indexOf(nowCmp.id);
		if(conIndex!=nowIndex){
			nowCmp.getEl().slideOut('l',{duration: 300});
			contentPanel.getEl().slideIn('r',{duration: 300});
			if(nowIndex==0){
				refresh1=Ext.getCmp('autoFreshCheckbox').getValue();
			}else if(nowIndex==1){
				refresh2=Ext.getCmp('autoFreshCheckbox').getValue();
			}else if(nowIndex==2){
				refresh3=Ext.getCmp('autoFreshCheckbox').getValue();
			}
			if(conIndex==1){
			//切换条形界面
			tabCtr = 0;
			Ext.getCmp('autoFreshCheckbox').setValue(refresh2);
			isFreshing = true;
			Ext.getCmp('totalSelPanel').setVisible(true);
			Ext.getCmp('allGroup_combo').hide();
			Ext.getCmp('searchTextId').show();
			Ext.getCmp('searchTextId').setValue('');//更换图形界面时清空名称
			Ext.getCmp('searchStoreTextId').hide();
			Ext.getCmp('searchStoreTextId').setValue('');
			Ext.getCmp('searchBianTextId').hide();
			Ext.getCmp('searchBianTextId').setValue('');//更换图形界面时清空名称   [5,'店铺'],[1,'终端组'],[3, '设备名称'],[4,'设备编号']
			Ext.getCmp('switchCombo').getStore().loadData([  [5,getIi18NText('store')],[3, getIi18NText('deviceName')],[4,getIi18NText('quipmentNo')]]);
			Ext.getCmp('switchCombo').show();
			Ext.getCmp('switchCombo').setValue(3);
			initTerminalPlan();
			}else if(conIndex==0){
			//切换图形界面
			tidOrder='';
           	tnameOrder='';
			Ext.getCmp('allGroup_combo').show();
		//	console.info(Ext.getCmp('switchCombo').getStore().getCount()+"啊看是的得开")
			if(Ext.getCmp('switchCombo').getStore().getCount()==3){
				Ext.getCmp('switchCombo').getStore().loadData( [ [5,getIi18NText('store')],[1,getIi18NText('terminalTeam')],[3, getIi18NText('deviceName')],[4,getIi18NText('quipmentNo')]]);
			}
			Ext.getCmp('switchCombo').show();
			Ext.getCmp('switchCombo').setValue(1);
			Ext.getCmp('searchTextId').hide();
			Ext.getCmp('searchTextId').setValue('');//更换图形界面时清空名称
			Ext.getCmp('searchBianTextId').hide();
			Ext.getCmp('searchBianTextId').setValue('');//更换图形界面时清空名称
			Ext.getCmp('searchStoreTextId').hide();
			Ext.getCmp('searchStoreTextId').setValue('');
			tabCtr = 1;
	//		isFreshing = true;
			Ext.getCmp('autoFreshCheckbox').setValue(refresh1);
			Ext.getCmp('totalSelPanel').setVisible(false);
			recordIds.removeAll();
			if(terminalGrid.getSelectionModel().getSelection().length!=0){
				terminalGrid.getSelectionModel().deselectAll();
			}
			refreshMonitarData();
			}else if(conIndex==2){
				//切换地图模式
				tabCtr = 2;
		//		Ext.getCmp('autoFreshCheckbox').setValue(true);
				Ext.getCmp('autoFreshCheckbox').setValue(refresh3);
				isFreshing = true;
				Ext.getCmp('totalSelPanel').setVisible(false);
				Ext.getCmp('allGroup_combo').show();
				Ext.getCmp('searchTextId').hide();
				Ext.getCmp('searchTextId').setValue('');//更换图形界面时清空名称
				Ext.getCmp('searchBianTextId').hide();
				Ext.getCmp('searchBianTextId').setValue('');//更换图形界面时清空名称
				Ext.getCmp('searchStoreTextId').hide();
				Ext.getCmp('searchStoreTextId').setValue('');
				tidOrder='';
           	  	tnameOrder='';
			//	console.info(Ext.getCmp('switchCombo').getStore().getCount()+"啊看得开")
				if(Ext.getCmp('switchCombo').getStore().getCount()==3){
					Ext.getCmp('switchCombo').getStore().loadData( [ [5,getIi18NText('store')],[1,getIi18NText('terminalTeam')],[3, getIi18NText('deviceName')],[4,getIi18NText('quipmentNo')]]);
				}
				Ext.getCmp('switchCombo').show();
				Ext.getCmp('switchCombo').setValue(1);
				recordIds.removeAll();
				if(terminalGrid.getSelectionModel().getSelection().length!=0){
					terminalGrid.getSelectionModel().deselectAll();
				}
				delaySearchTerminalFn();
			}
			contentLayout.setActiveItem(contentPanel);
		}
	}
	//4.create tools
	//*.event
	/**fun methods*/
    /* listeners event      -------start **/
    showTerminalDetail = function(T,e,N){
           var hv = (N==1)?$(T).find(".hoverDiv"):$(T).parent().find(".hoverDiv");
           hv.data('type',e.type);
           if(hv.data('nowRun') == 1){
               return;
           }
           hv.data('nowRun',1); //isRun
           //log("触发:"+(indedd++)+"; type="+e.type+"; N="+N);
           if( hv.data('type') == "mouseover" ){
		                window.clearTimeout(hv.data('timeId'));
		                hv.slideDown(300,function(){
		                      hv.data('nowRun',2);
		                      window.setTimeout(function(){
		                              if(hv.data('type') == "mouseout" ){
		                                  hv.slideUp(300); 
		                              } 
		                      }, 100);
		                });
		               
		    } else if( hv.data('type') == "mouseout" ){
	                    hv.data('nowRun',2);
		                hv.data('timeId',window.setTimeout(function(){
							 hv.slideUp('300');
			            },100));
		    }
    };
    
	function condEvent($this, newValue, oldValue, eOpts ){
		//Ext.getCmp('searchTextId').hide().getEl().fadeOut();
         if(oldValue == 1){
               Ext.getCmp('allGroup_combo').hide();
         }else if(oldValue == 2){
               Ext.getCmp('allCompany_combo').hide();
         }else if(oldValue == 3){
               Ext.getCmp('searchTextId').hide();
         }else if(oldValue == 4){
               Ext.getCmp('searchBianTextId').hide();
         }else if(oldValue == 5){
        	   Ext.getCmp('searchStoreTextId').hide();
         }
         if(newValue == 1){
         	   Ext.getCmp('searchTextId').setValue("");
         	  Ext.getCmp('searchBianTextId').setValue("");
         	  Ext.getCmp('searchStoreTextId').setValue("");
               Ext.getCmp('allGroup_combo').show();
         }else if(newValue == 2){
               Ext.getCmp('allCompany_combo').show();
         }else if(newValue == 3){
         	   Ext.getCmp('allGroup_combo').setValue(-1);
         	  Ext.getCmp('searchBianTextId').setValue("");
         	  Ext.getCmp('searchStoreTextId').setValue("");
               Ext.getCmp('searchTextId').show();
         }else if(newValue == 4){
       	   Ext.getCmp('allGroup_combo').setValue(-1);
           Ext.getCmp('searchTextId').setValue("");
           Ext.getCmp('searchStoreTextId').setValue("");
           Ext.getCmp('searchBianTextId').show();
         }else if(newValue == 5){
      	   Ext.getCmp('allGroup_combo').setValue(-1);
      	  Ext.getCmp('searchBianTextId').setValue("");
      	 Ext.getCmp('searchTextId').setValue("");
      	  Ext.getCmp('searchStoreTextId').show();
         }
	}
    /* listeners event       -------end **/
	/**add by area fun*/
        var viewHtml = [];
        viewHtml.push('<ul class="itemUl dropShadowCss ext_panel_backDD_ul">');
        
		viewHtml.push('  <tpl if="stateValue == 2">');
		viewHtml.push('   <li class="li_01 ext_panel_backConn">');
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="stateValue == 3">');
		viewHtml.push('   <li class="li_01 ext_panel_backDisconn">');
		viewHtml.push('  </tpl>');
		
//		viewHtml.push('	 <span class="span_chk">');
//		viewHtml.push('  <tpl if="stateValue == 2">');
//		viewHtml.push('	 <input type="checkbox" value="0" name="itemChk"/>');
//		viewHtml.push('  </tpl>');
//		viewHtml.push('[{#}]');
//		
//		viewHtml.push('  <tpl if="stateValue == 3">');
//		viewHtml.push('	 <font size=4 title="终端未连接，不能选择">⊙</font>');
//		viewHtml.push('  </tpl>');
//		viewHtml.push('  </span>');
		
		viewHtml.push('	 <span class="span_name"><input value="{[values.name]}" class="tit" readOnly title="{[values.name]}"/></span>');
		/*viewHtml.push('  <tpl switch="authIds">');
		viewHtml.push('  <tpl case="" >');
		viewHtml.push('	 <span class="span_del removeIconCss" title="'+getIi18NText('removeTerminal')+'"  onclick="removeTerminal({[values.terId]})">&nbsp;</span>');
		viewHtml.push('  <tpl default">');
		viewHtml.push('  </tpl>');
		viewHtml.push('  </tpl>');*/
		viewHtml.push('  <tpl if="isShare==1">');
		
	/*	viewHtml.push('  <tpl if="authIds.delete!=null">');
		viewHtml.push('	 <span class="span_del removeIconCss" title="'+getIi18NText('removeTerminal')+'"  onclick="removeTerminal({[values.terId]})">&nbsp;</span>');
		viewHtml.push('  </tpl>');*/
		
		viewHtml.push('  <tpl if="authIds.screen!=null">');
		viewHtml.push('	 <span class="span_del detailIconCss" title="'+getIi18NText('ViewLarger')+'"  onclick="openScreenImg({[values.terId]},{[values.stateValue]})">&nbsp;</span>');
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="isShare==0">');
/*		if(AUTH["delete"]){
			viewHtml.push('	 <span class="span_del removeIconCss" title="'+getIi18NText('removeTerminal')+'"  onclick="removeTerminal({[values.terId]})">&nbsp;</span>');
		}*/
		if(AUTH["screen"]){
			viewHtml.push('	 <span class="span_del detailIconCss" title="'+getIi18NText('ViewLarger')+'"  onclick="openScreenImg({[values.terId]},{[values.stateValue]})">&nbsp;</span>');
		}
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  </li>');
		viewHtml.push('  <li class="li_02" > ');
		viewHtml.push('	    <table class="tab" onmouseover="showTerminalDetail(this,event,2)">');
		viewHtml.push('		    <tr>');
		viewHtml.push('			  <td style="overflow:hidden;text-align:center; vertical-align:middle; width:68px; height:120px; " >');
		viewHtml.push('			   <img src="{[values.imgsrc]}" name="imgToGary{[values.stateValue]}"  class="imgToGary{[values.stateValue]}"  width="{[values.width]}"  height="{[values.height]}"  />');
		viewHtml.push('		      </td>');
		viewHtml.push('		   </tr>');
		viewHtml.push('		</table>');
		viewHtml.push('		<div class="hoverDiv_cover" onmouseover="showTerminalDetail(this,event,2)" onmouseout="showTerminalDetail(this,event,2)">&nbsp;</div>');
		viewHtml.push('		<div class="hoverDiv" onmouseover="showTerminalDetail(this,event,3)" onmouseout="showTerminalDetail(this,event,3)">');
		viewHtml.push('		       <table  id="'+viewTable_prefix+'{[values.terId]}">');
		viewHtml.push('			      <tr>');
//		viewHtml.push('				    <td align="right">'+getIi18NText('terminalType')+':</td><td>{[values.authType]}</td>');
		viewHtml.push('				    <td align="right">'+getIi18NText('ownedShop')+':</td><td>{[values.storeName]}</td>');  //ownedShop
		viewHtml.push('				  </tr>');
		viewHtml.push('			      <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('deviceName')+':</td><td><input value="{[values.name]}" class="titl" readOnly /></td>');
		viewHtml.push('				  </tr>');
		viewHtml.push('			      <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('IP')+':</td><td>{[values.ip]}</td>');
		viewHtml.push('				  </tr>');
		viewHtml.push('			      <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('screen')+':</td><td>{[values.screen]}</td>');
		viewHtml.push('				  </tr>');
		viewHtml.push('	  <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('belongGroup')+':</td><td><input value="{[values.groupName]}" class="titl"  readOnly /></td>'); //
		viewHtml.push('				  </tr>');
//		viewHtml.push('	  <tr>');
//		viewHtml.push('				    <td align="right">公司:</td><td><input value="{[values.company]}"  class="titl" readOnly /></td>');
//		viewHtml.push('				  </tr>');
		viewHtml.push('	  <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('status')+':</td>');
		viewHtml.push('  <tpl if="stateValue == 2">');
		viewHtml.push('				    <td><font color="orange">{[values.stateText]}</font></td>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="stateValue == 3">');
		viewHtml.push('				    <td><font color="red">{[values.stateText]}</font></td>');
		viewHtml.push('  </tpl>');
		viewHtml.push('				  </tr>');
		viewHtml.push('			      <tr>');
		viewHtml.push('				    <td align="right">'+getIi18NText('quipmentNo')+':</td><td>{[values.terNum]}</td>');
		viewHtml.push('				  </tr>');
		viewHtml.push('			  </table>');
		viewHtml.push('		</div>');
		viewHtml.push('  </li>');
		viewHtml.push('  <li class="li_03">');
		viewHtml.push('       <ul class="ulBut">');
		viewHtml.push('  <tpl if="stateValue == 2">');
		
		viewHtml.push('  <tpl if="isShare==1">');
		viewHtml.push('  <tpl if="authIds.play!=null">');
		viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},2,\''+getIi18NText('restartPlayer')+'\');" class="ctrl_but startIconCss" title="'+getIi18NText('restartPlayer')+'"></a></li>');
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  <tpl if="authIds.restart!=null">');
		viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},1,\''+getIi18NText('restartTerminal')+'\');" class="ctrl_but startTerIconCss" title="'+getIi18NText('restartTerminal')+'"></a></li>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="isShare==0">');
		if(AUTH["play"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},2,\''+getIi18NText('restartPlayer')+'\');" class="ctrl_but startIconCss" title="'+getIi18NText('restartPlayer')+'"></a></li>');
		}
		
		if(AUTH["restart"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},1,\''+getIi18NText('restartTerminal')+'\');" class="ctrl_but startTerIconCss" title="'+getIi18NText('restartTerminal')+'"></a></li>');
		}
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  </tpl>');
		
		//viewHtml.push('	       <li ><a href="javascript:;" class="ctrl_but terIconCss" title="终端详情"></a></li>');
		viewHtml.push('  <tpl if="isShare==1">');
		viewHtml.push('  <tpl if="authIds.pub!=null">');
		viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},7,{#});" class="ctrl_but planIconCss" title="'+getIi18NText('listingManager')+'"></a></li>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="isShare==0">');
		//test
		if(AUTH["pub"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},7,{#});" class="ctrl_but planIconCss" title="'+getIi18NText('listingManager')+'"></a></li>');
		}
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  <tpl if="stateValue == 2">');
		viewHtml.push('  <tpl if="isShare==1">');
		viewHtml.push('  <tpl if="authIds.screen!=null">');
		viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},3,\''+getIi18NText('screenshotOnTerminal')+'\');" class="ctrl_but cutScreenIconCss" title="'+getIi18NText('screenshotOnTerminal')+'"></a></li>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  </tpl>');
		viewHtml.push('  <tpl if="isShare==0">');
		if(AUTH["screen"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},3,\''+getIi18NText('screenshotOnTerminal')+'\');" class="ctrl_but cutScreenIconCss" title="'+getIi18NText('screenshotOnTerminal')+'"></a></li>');
		}
		viewHtml.push('  </tpl>');
		
		viewHtml.push('  </tpl>');
		
		//more
		//if(AUTH["off"]){
		//	viewHtml.push('	       <li ><a href="javascript: shutdownFn({[values.terId]});" class="ctrl_but startingIconCss" title="'+getIi18NText('remoteShutdownTerminal')+'"></a></li>');
		//}
		
		if(AUTH["showgood"] && AUTH["singleauth"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},8,\''+getIi18NText('goods_mana')+'\');" style="width:19px;" class="ctrl_but goodsManaIconCss" title="'+getIi18NText('goods_mana')+'"></a></li>');
		}
		if(AUTH["video"] && AUTH["singleauth"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},10,\''+getIi18NText('singleshowvidel')+'\');" style="height:22px;" class="ctrl_but videoIconCss" title="'+getIi18NText('singleshowvidel')+'"></a></li>');
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},11,\''+getIi18NText('videonow')+'\');" style="height:22px;" class="ctrl_but videosIconCss" title="'+getIi18NText('videonow')+'"></a></li>');
		}
		if(AUTH["audio"] && AUTH["singleauth"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},9,\''+getIi18NText('audiocall')+'\');" style="height:22px;" class="ctrl_but audioIconCss" title="'+getIi18NText('audiocall')+'"></a></li>');
		}
		if(AUTH["off"] && AUTH["singleauth"]){
			viewHtml.push('	       <li ><a href="javascript: sendOrder({[values.terId]},12,\''+getIi18NText('timePlan')+'\');" style="height:22px;" class="ctrl_but menuPowerIconCss" title="'+getIi18NText('timePlan')+'"></a></li>');
		}
		if(AUTH["morebtn"]){
			viewHtml.push('	       <li ><a id="'+terAview+'{[values.terId]}" href="javascript: showMoreFn({[values.terId]});" class="ctrl_but moreIconCss" title="'+getIi18NText('js_message_moremenu')+'"></a></li>');
		}
		viewHtml.push('	   </ul>');
		viewHtml.push('  </li>');
		viewHtml.push('</ul>');

     var dataview = Ext.create('Ext.view.View', {
	            //deferInitialRefresh: false,
	            store: dataStore,
	            tpl  : Ext.create('Ext.XTemplate',
	                '<tpl for=".">',
	                    viewHtml.join(''),
	                '</tpl>'
	            ),
	            plugins : [
	                Ext.create('Ext.ux.DataView.Animated', {
	                     duration  : 500
	                    ,idProperty: 'animatId'
	                })
	            ],
	            id: 'terminalId',
	            itemSelector: 'ul.itemUl',
	            multiSelect : true,
	            autoScroll  : true,
	            listeners: {
	            	afterrender: function($this){
	            		$this.refresh();
	            	//	createMoreBtns($this);
	            	} 
	            }
	 });
     
     function moreMenuHandler(item){
    	 if(item.name == "power"){
    		 shutdownFn(globalTid);
    	 }else if(item.name == "msg"){
    		 cutInMsgFn(globalTid);
    	 }else if(item.name=="update"){
    		 updateVersion(globalTid);
    	 }
    	 else if(item.name == 'goods'){
    		 manaGoods(globalTid);
    	 }else if(item.name == 'detailInfo'){
    		 showTerInfoFn(globalTid);
    	 }else if(item.name == 'distribution'){//GZE 2016/8/16 判断是否点击终端分配
    		 distributionFn(globalTid);  
    	 }else if(item.name == 'share'){//GZE 2016/8/16 判断是否点击终端分配
    		 shareFn(globalTid);  
    	 }else if(item.name == 'showVideo'){//双向视频
    		 Ext.getBody().mask(getIi18NText("connetVideo"));
    		 Ext.Ajax.request({
  	    	     url: 'terminal!sendYunid.action'
  	    	    ,method: 'post' 
  	    	    ,params: {tid:globalTid,nn:2}
      		    ,timedout:120000
      		    ,callback:function(opt, success,response){
    	        	Ext.getBody().unmask();
    	        	var result = showResult(success,response);
    	        	if(result == false) return;
    	        	var yuid = result.msg;
    	        	dataStore.each(function(r){
       					if(r.get("terId")==globalTid){
       						parent.parent.showVideo(false,yuid,globalTid,true,r.get("name"));
       						parent.parent.deleteYunRequest(globalTid);
       						return;
       					}
    			 	});
    	        }
      		 })
    		 //调用ifram的主页面的js方法
    	 }else if(item.name == 'singleshowVideo'){//单向视频
    		 Ext.getBody().mask(getIi18NText("connetVideo"));
    		 Ext.Ajax.request({
  	    	     url: 'terminal!sendYunid.action'
  	    	    ,method: 'post' 
  	    	    ,params: {tid:globalTid,nn:1}
      		    ,timedout:120000
      		    ,callback:function(opt, success,response){
    	        	Ext.getBody().unmask();
    	        	var result = showResult(success,response);
    	        	if(result == false) return;
    	        	var yuid = result.msg;
    	        	dataStore.each(function(r){
       					if(r.get("terId")==globalTid){
       						parent.parent.showVideo(false,yuid,globalTid,false,r.get("name"));
       						parent.parent.deleteYunRequest(globalTid);
       						return;
       					}
    			 	});
    	        }
      		 })
    	 }else if(item.name == 'showAudio'){//音频
    		 Ext.getBody().mask(getIi18NText("connetVideo"));
    		 Ext.Ajax.request({
    			 url: 'terminal!sendYunid.action'
				 ,method: 'post' 
				 ,params: {tid:globalTid,nn:0}
    		 	 ,timedout:120000
    		 	 ,callback:function(opt, success,response){
    			 Ext.getBody().unmask();
    			 var result = showResult(success,response);
    			 if(result == false) return;
    			 var yuid = result.msg;
    			 dataStore.each(function(r){
   					if(r.get("terId")==globalTid){
   						parent.parent.showAudio(yuid,globalTid,r.get("name"));
   						parent.parent.deleteYunRequest(globalTid);
   						return;
   					}
			 	 });
    		 }
    		 })
    	 }
     }
     //在共享终端中已选终端名字的表格GZE
     terShareSelected1=Ext.create('Ext.grid.Panel', {
		    store: Ext.create('Ext.data.Store', {
					    fields:['tid','name','uname'],
					    data: []
		    }),
		    columns: [
		     //   { text: getIi18NText('No'), minWidth: 60 , xtype: 'rownumberer', align: 'center' },
		        { text: getIi18NText('terminalName'),  dataIndex: 'name', flex: 1, menuDisabled: true,sortable:false, draggable: false },
		        { text: getIi18NText("jsp_terOwner"),  dataIndex: 'uname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
		    ],
		    height: 100,
		    minWidth: 200,
		    width: '100%',
		    listeners: {
		    	/*afterrender:  loadChoiceData*/
		    }
});
     //在共享终端中可共享的权限的表格GZE
     terShareAuth1=Ext.create('Ext.grid.Panel', {
    	 store: Ext.create('Ext.data.Store', {
    		 fields:['auid','authname'],
    		 pageSize: Number("0x7fffffff"),//未分页，防止显示不全
        	 autoLoad: true,
    		 data: []
    	 }),
    	 selType: 'checkboxmodel',
	     selModel :{ 
	    	      mode: 'MULTI'
	    	    	  , allowDeselect: false
			    		, showHeaderCheckbox : true
			    		, enableKeyNav: false
			    		, ignoreRightMouseSelection:true
	      },
    	 columns: [
    	        //   { text: getIi18NText('No'), minWidth: 60 , xtype: 'rownumberer', align: 'center' }, 
    	           { text: getIi18NText('auth_name'),  dataIndex: 'authname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
    	           ],
    	           height: 100,
    	           minWidth: 100,
    	           width: '60%',
    	           viewConfig: {
		            	 trackOver: false
					     ,emptyText: '<h1 style="margin:10px">'+getIi18NText("monitor_message_23")+'</h1>'
    	           },
    	           listeners: {
    	        	   /*afterrender:  loadChoiceData*/
    	           }
     });
     //在共享终端中已选终端名字的表格GZE
     terShareSelected=Ext.create('Ext.grid.Panel', {
    	 store: Ext.create('Ext.data.Store', {
    		 fields:['tid','name','uname'],
    		 data: []
    	 }),
    	 columns: [
    	           //   { text: getIi18NText('No'), minWidth: 60 , xtype: 'rownumberer', align: 'center' },
    	           { text: getIi18NText('terminalName'),  dataIndex: 'name', flex: 1, menuDisabled: true,sortable:false, draggable: false },
    	           { text: getIi18NText("jsp_terOwner"),  dataIndex: 'uname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
    	           ],
    	           height: 100,
    	           minWidth: 200,
    	           width: '100%',
    	           listeners: {
    	        	   /*afterrender:  loadChoiceData*/
    	           }
     });
     //在共享终端中可共享的权限的表格GZE
     terShareAuth=Ext.create('Ext.grid.Panel', {
    	 store: Ext.create('Ext.data.Store', {
    		 fields:['auid','authname'],
    		 pageSize: Number("0x7fffffff"),//未分页，防止显示不全
    		 autoLoad: true,
    		 data: []
    	 }),
    	 selType: 'checkboxmodel',
    	 selModel :{ 
    		 mode: 'MULTI'
    			 , allowDeselect: false
    			 , showHeaderCheckbox : true
    			 , enableKeyNav: false
    			 , ignoreRightMouseSelection:true
    	 },
    	 columns: [
    	           //   { text: getIi18NText('No'), minWidth: 60 , xtype: 'rownumberer', align: 'center' }, 
    	           { text: getIi18NText('auth_name'),  dataIndex: 'authname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
    	           ],
    	           height: 100,
    	           minWidth: 100,
    	           width: '60%',
    	           viewConfig: {
    	        	   trackOver: false
    	        	   ,emptyText: '<h1 style="margin:10px">'+getIi18NText("monitor_message_23")+'</h1>'
    	           },
    	           listeners: {
    	        	   /*afterrender:  loadChoiceData*/
    	           }
     });
     //GZE 2016/8/15  显示共享终端面板前加载数据
     function shareFn(tid){
    	  terShareName=new Array();
    	  preUserId=null;
   	  	  shareData=new Array();
	   	  isFreshing = false;
	   	  globalTid = tid;
	   	  Ext.getBody().mask(getIi18NText("monitor_message_37"));
	   	  Ext.Ajax.request({
	   		  url: 'terminal!getTerminalInfos.action'
	   		  ,method: 'post' 
	   		  ,params: {id: globalTid}
	   	      ,timedout:120000
	   	      ,failure: function(response, opts) {
	   	    	  Ext.getBody().unmask();
	   	    	  isFreshing = true;
	   	    	  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
	   	      }
	   	      ,success: function(response){
	   	    	  Ext.getBody().unmask();
	   	    	  isFreshing = true;
	   	    	  var result =eval('(' + response.responseText + ')');
	   	    	  if(result.code==0){
	   	    		  var data =eval('(' + result.msg + ')');
	   			//  var names=data.name;
	   	    		  terShareSelected.getStore().removeAll();
	   	    		  terShareSelected.getStore().add(data);
	   	    		  terShareName.push(data.uname);//记录终端用户名称
	   	    		  showShare(globalTid,data);
	   	    	  }
	   	      }
	   	  });
     }
     //GZE 2016/8/15 显示共享终端面板  type:区分几个终端需要共享：1：单个终端，2：多个终端
     function showShare1(tid,data){
    	 //往terShareAuth添加可共享的权限
    	 terShareAuth1.getStore().removeAll();
    	 if(AUTH["screen"]){
    		 terShareAuth1.getStore().loadData([{'auid':"screen_406", 'authname':getIi18NText('screenshotOnTerminal')}],true);
    	 }
    	 if(AUTH["delete"]){
    		 terShareAuth1.getStore().loadData([{'auid':"delete_402", 'authname':getIi18NText('deleteTerminal')}],true);
    	 }
    	 if(AUTH["play"]){
    		 terShareAuth1.getStore().loadData([{'auid':"play_404", 'authname':getIi18NText('restartPlayer')}],true);
    	 }
    	 if(AUTH["restart"]){
    		 terShareAuth1.getStore().loadData([{'auid':"restart_405", 'authname':getIi18NText('restartTerminal')}],true);
    	 }
    	 if(AUTH["pub"]){
    		 terShareAuth1.getStore().loadData([{'auid':"pub_403", 'authname':getIi18NText('listingManager')}],true);
    	 }
    	 /*	if(AUTH["distribution"]){
				terShareAuth.getStore().loadData([{'auid':"distribution_415", 'authname':getIi18NText('ter_distribution')}],true);
			}*/
    	 if(AUTH["off"]){
    	//	 terShareAuth1.getStore().loadData([{'auid':"off_407", 'authname':getIi18NText('remoteShutdownTerminal')}],true);
    		 terShareAuth1.getStore().loadData([{'auid':"off_407", 'authname':getIi18NText('timePlan')}],true);
    	 }
    	 globalTid = tid;
    	 sharePanel1=Ext.getCmp('sharePanel1');
    	 if(sharePanel1 && sharePanel1.isWindow){
    		 shareUser1.getStore().load() ;
    		 sharePanel1.show();
    		 return;
    	 }else{
    			 shareUserProxy1 = getAjaxProxy({url:'terminal!chUser.action'});
    			 shareUser1=Ext.create('Ext.grid.Panel', { //共享到那个用户的表格
    				 store: Ext.create('Ext.data.Store', {
    					 fields:['uid','chname'],
    					 pageSize: Number("0x7fffffff"),//未分页，防止显示不全
    					 proxy: shareUserProxy1
    					 ,autoLoad: true
    					 ,listeners: {
    						 load:function($this){
    							 if(terShareName.length!=0){
    								 var selection = shareUser1.getSelectionModel();
    								 var records=[];
    								 for(var k =0; k < shareUser1.getStore().count(); k++){
    									 var record =shareUser1.getStore().getAt(k);
    									 for(var l =0; l < terShareName.length; l++){
    										 if(terShareName[l]==record.get('chname')){
    											 shareUser1.getStore().remove(record);
    										 }
    									 }
    								 }
    							 }
    						 }
    					 }
    				 }),
    				 selType: 'checkboxmodel',
    				 selModel :{ 
    					 mode: 'MULTI'
    						 , allowDeselect: false
    						 , showHeaderCheckbox : true
    						 , enableKeyNav: false
    						 , ignoreRightMouseSelection:true
    				 },
    				 columns: [
    				           { text: getIi18NText("sahreUsers"),  dataIndex: 'chname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
    				           //    { text: getIi18NText('knownTerminals'),  dataIndex: 'chnum', flex: 1, menuDisabled: true, draggable: false ,renderer: ternumRenderFn}
    				           ],
    				           height: 100,
    				           minWidth: 200,
    				           width: '100%'
    				        	   /*,viewConfig: {
    				        		   trackOver: false
    				        		   ,emptyText: '<h1 style="margin:10px">'+getIi18NText("monitor_message_23")+'</h1>'
    				        	   }*/
    			 });
    		 sharePanel1=Ext.create('Ext.window.Window',{
    			 title: getIi18NText("ter_share")
    			 ,id:"sharePanel1"
    				 ,plain: true
    				 ,width: 850
    				 ,height: 230
    				 ,minWidth: 300
    				 ,minHeight: 200
    				 ,maximizable: true
    				 ,border: false
    				 ,modal: true
    				 ,constrain: true
    				 ,closeAction: 'hide'
    				 ,listeners: {
    						 /*beforeclose: function(){
								     this.hide(btn);
							   }*/
    				}
    		 ,layout: 'fit'
    			 ,items:[{
    				 xtype: 'panel'
    					 ,layout: {type:'hbox', align: 'middle',pack:'center'}
    			 ,width: '100%', height: '100%'
    				 ,border: false
    				 ,defaults: { margin: '2 2 5 2', xtype: 'fieldset',minWidth:230,layout: 'fit'}
    			 ,items: [{
    				 width: '14%', 
    				 height: '100%', 
    				 title: '<strong>'+getIi18NText('checkedTerminals')+'</strong>'
    				 ,items: [terShareSelected1]
    			 },{
    				 width: '30%', height: '100%', 
    				 // 		title: '<strong>'+getIi18NText("sahreUsers")+' &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" onclick="refreshShareUser();">'+getIi18NText('refresh')+'</a></strong>'
    				 title: '<strong>'+getIi18NText("sahreUsers")+'</strong>'
    				 ,items: [shareUser1]
    			 },{
    				 width: '5%', height: '100%', 
    				 title: '<strong>'+getIi18NText("shareAuth")+'</strong>'
    				 ,items: [terShareAuth1]
    			 },{
    				 xtype: 'panel'
    					 ,width: 100
    					 ,minWidth: 80
    					 ,border: false
    					 ,layout: {type: 'vbox', align:'center',pack:'center'}
    			 ,items: [ {
    				 xtype: 'radiogroup',
//				                	          fieldLabel: 'Two Columns', chanelShare
    				 columns: 1,
    				 hidden:true,
    				 vertical: true,
    				 items: [ { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
    				          { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true}
    				 ]
    			 },{ 
    				 xtype: 'button'
    					 ,width:100
    					 ,height:30
    					 ,text: getIi18NText('chanelShare')
    				//	 ,id:'actBtn'
    						 ,handler: function(){
    							 cancelShare(1); 
    						 }
    			 },{ 
    				 xtype: 'button'
    					 ,width:100
    					 ,height:30
    					 ,text: getIi18NText('save')
    				//	 ,id:'activesBtn'
    						 ,margin:'20 0 0 0'
    							 ,handler: saveShare1
    			 },{ 
    				 xtype: 'button'
    					 ,width:100
    					 ,height:30
    					 ,margin:'20 0 0 0'
    					//	 ,id:'simplesBtn' 
    							 ,text: getIi18NText('jsp_close')
    							 ,handler: function(){
    								 sharePanel1.hide();
    								 recordIds.removeAll();
    								 refreshMonitarData();
    							 }
    			 }]
    			 }]	
    			 }]
    		 });
    		 sharePanel1.show();
    	 }
     }
     //GZE 2016/8/15 显示共享终端面板  type:区分几个终端需要共享：1：单个终端，2：多个终端
     function showShare(tid,data){
    	 //往terShareAuth添加可共享的权限
			terShareAuth.getStore().removeAll();
			if(AUTH["screen"]){
				terShareAuth.getStore().loadData([{'auid':"screen_406", 'authname':getIi18NText('screenshotOnTerminal')}],true);
			}
			if(AUTH["delete"]){
				terShareAuth.getStore().loadData([{'auid':"delete_402", 'authname':getIi18NText('deleteTerminal')}],true);
			}
			if(AUTH["play"]){
				terShareAuth.getStore().loadData([{'auid':"play_404", 'authname':getIi18NText('restartPlayer')}],true);
			}
			if(AUTH["restart"]){
				terShareAuth.getStore().loadData([{'auid':"restart_405", 'authname':getIi18NText('restartTerminal')}],true);
			}
			if(AUTH["pub"]){
				terShareAuth.getStore().loadData([{'auid':"pub_403", 'authname':getIi18NText('listingManager')}],true);
			}
			if(AUTH["off"]){
				terShareAuth.getStore().loadData([{'auid':"off_407", 'authname':getIi18NText('remoteShutdownTerminal')}],true);
			}
    	 	globalTid = tid;
    		 sharePanel=Ext.getCmp('sharePanel');
    		if(sharePanel && sharePanel.isWindow){
    			allUserStore.load();
    			shareUser.getStore().removeAll();
    			sharePanel.show();
				  return;
			 }else{
					 shareUser=Ext.create('Ext.grid.Panel', { //共享到那个用户的表格
						 store: Ext.create('Ext.data.Store', {
							    		fields:['tid','name'],
							    		data: [],
							    		listeners: {
							    			add:function(store,records,index,eOpts){
							    			//	console.info("添加");
							    				var len=records.length;
							    				var userselection = shareUser.getSelectionModel();
							    		//		console.info("添加"+records[len-1]);
							    				userselection.select(records[len-1]);
							    			}
							    		}
						 			}),
						 columns: [
						           { text: getIi18NText('sel_user'),  dataIndex: 'chname', flex: 1, menuDisabled: true,sortable:false, draggable: false }
						           //    { text: getIi18NText('knownTerminals'),  dataIndex: 'chnum', flex: 1, menuDisabled: true, draggable: false ,renderer: ternumRenderFn}
						           ],
						  height: 100,
						           minWidth: 200,
						           width: '100%'
						           ,dockedItems: [{
						        	   xtype: 'toolbar',
						        	   dock: 'top',
						        	   items: [{
						        		   xtype: 'combo'
						        		   ,fieldLabel: getIi18NText('sel')
						        		   ,labelWidth: 30
						        		   ,width:140
						        		   ,editable: false
										   ,id: 'swUserCombo'
										   ,store: allUserStore
										   ,queryMode: 'local'
										   ,displayField: 'chname'
										   ,valueField: 'uid'
										   ,value: -1
									/*	   ,listeners: {
											    change:  function($this, newValue, oldValue, eOpts){
											condEvent($this, newValue, oldValue, eOpts);
											setInitPage();
											recordIds.removeAll();
											refreshMonitarData();
										}
										   }*/
						        	   },{
						        			   xtype:'button',
						        			   tooltip: getIi18NText('selToUser'),
						        			   text: getIi18NText('add2'),
						        			   border: false,
						        			   iconCls: 'sortBut_ASC',
						        			   handler: function(){
						        				   var swuser = Ext.getCmp('swUserCombo').getValue();
						        				   if(swuser!=-1){
						        					   var record;
						        					   allUserStore.each(function(r){
						        						   if(r.get("uid")==swuser){
						        							   record=r;
						        						   }
						        					   });
						        					  // console.info("看到"+record.get("uid")+record.get("chname"));
						        					   shareUser.getStore().add(record);
						        					   allUserStore.remove(record);
						        					   Ext.getCmp('swUserCombo').setValue(-1);
						        				/*	   if(preUserId==null){
						        						   terShareAuth.getSelectionModel().deselectAll();
						        					   }*/
						        				   }
						        			   }
						        		   }]
						        	   },{
						        		   xtype: 'toolbar',
							        	   dock: 'bottom',
							        	   height:28,
							        	   items: [{
							        			   xtype:'button',
							        			   tooltip: getIi18NText('delSelUser'),
							        			   text: getIi18NText('delete'),
							        			   margin: '0 0 0 0',
							        			   border: false,
							        			   iconCls: 'removeIconCss',
							        			   handler: function(){
							        				   //删除已选择用户表的数据
							        				   var shareauth=shareUser.getSelectionModel().getSelection();
							        				   if(shareauth.length>0){
							        					   var delId=shareauth[0].get("uid");
							        					   var stor=[];
							        					   var model ;
							        					   for(var i=0;i<shareUser.getStore().count();i++){
							        						   if(shareUser.getStore().getAt(i).get("uid")!=delId){
							        							   stor.push(shareUser.getStore().getAt(i));
							        						   }else{
							        							   model=shareUser.getStore().getAt(i);
							        						   }
							        					   }
							        					   preUserId=null;
							        					   shareUser.getStore().removeAll();
							        					   shareUser.getStore().add(stor);
							        					   var selRe=shareUser.getStore().getAt(0);
							        					   //删除分项数据shareData数组中数据
							        					   var temp=new Array();
							        					   var selection = terShareAuth.getSelectionModel();
							        					   for(var j=0;j<shareData.length;j++){
							        						   var len=shareData[j].length-1;
							        						   if(shareData[j][len]!=model.get("uid")){
							        							   temp.push(shareData[j]);
							        						   }
							        					   }
							        					   shareData=new Array();
							        					   shareData=temp;
							        					   if(shareData.length==0){
							        						   selection.deselectAll();
							        					   }
							        					   //修改用户名下拉列表的数据
							        					   allUserStore.removeAt(allUserStore.count()-1);
							        					   allUserStore.add(model);
							        					   allUserStore.loadData([{'uid':-1, 'chname':'- -'+getIi18NText("username")+'- -'}],true);
							        				   }
							        			   }
							        		   }]
						        	   }]
					/* ,viewConfig: {
						 trackOver: false
						 ,emptyText: '<h1 style="margin:10px">'+getIi18NText("monitor_message_23")+'</h1>'
					 }*/
					 ,listeners:{
			    			select:function($this, record,  index, eOpts ){
			    				//console.info("选着");
			    				if(preUserId==null){
			    					preUserId=record.get("uid");
			    					//选择权限
			    					var isde=true;
			    					for(var j=0;j<shareData.length;j++){
			    						var len=shareData[j].length-1;
			    						if(shareData[j][len]==record.get("uid")){
			    							isde=false;
			    							var selection = terShareAuth.getSelectionModel();
			    							var records=[];
								    		 for(var s=0;s<shareData[j].length-1;s++){
								    			 for(var k =0; k < terShareAuth.getStore().count(); k++){
								    				 var record =terShareAuth.getStore().getAt(k); 
								    				 if(shareData[j][s]==record.get('auid')){
								    					 records.push(record);            
								    				 }
								    			 }
								    		 }
								    		 selection.select(records);
			    						}
			    					}
			    					if(isde){
			    						terShareAuth.getSelectionModel().deselectAll();
			    					}
			    				}else{
			    					//纪录上一次的共享数据
			    					var shareauth=terShareAuth.getSelectionModel().getSelection();
			    					var teAr=new Array();
			    					for(var i=0;i<shareauth.length;i++){
			    						teAr.push(shareauth[i].get("auid"));
			    					}
			    					teAr.push(preUserId);
			    					var iscu=true;
			    					for(var j=0;j<shareData.length;j++){
			    						var len=shareData[j].length-1;
			    						if(shareData[j][len]==preUserId){
			    							shareData[j]=teAr;
			    							iscu=false;
			    						}
			    					}
			    					//console.info(iscu);
			    					if(iscu){
			    							shareData.push(teAr);
			    					}
			    					preUserId=record.get("uid");
			    					//选择权限
			    					var isde=true;
			    					for(var j=0;j<shareData.length;j++){
			    						var len=shareData[j].length-1;
			    						if(shareData[j][len]==record.get("uid")){
			    							isde=false;
			    							var selection = terShareAuth.getSelectionModel();
			    							var records=[];
								    		 for(var s=0;s<shareData[j].length-1;s++){
								    			 for(var k =0; k < terShareAuth.getStore().count(); k++){
								    				 var record =terShareAuth.getStore().getAt(k); 
								    				 if(shareData[j][s]==record.get('auid')){
								    					 records.push(record);            
								    				 }
								    			 }
								    		 }
								    		 selection.select(records);
			    						}
			    					}
			    					if(isde){
			    						terShareAuth.getSelectionModel().deselectAll();
			    					}
			    				}//前一个选择的用户Id
			    			}
					 }
					 });
				 
				  sharePanel=Ext.create('Ext.window.Window',{
					  		title: getIi18NText("ter_share")
					  		,id:"sharePanel"
							 ,plain: true
							 ,width: 850
							 ,height: 230
							 ,minWidth: 300
							 ,minHeight: 200
							 ,maximizable: true
							 ,border: false
							 ,modal: true
							 ,constrain: true
							 ,closeAction: 'hide'
							 ,listeners: {
									 /*beforeclose: function(){
								     this.hide(btn);
							   }*/
							}
				  			,layout: 'fit'
				  		    ,items:[{
				  		    	xtype: 'panel'
				  		    	,layout: {type:'hbox', align: 'middle',pack:'center'}
				  		    	,width: '100%', height: '100%'
				  		    	,border: false
				  		    	,defaults: { margin: '2 2 5 2', xtype: 'fieldset',minWidth:230,layout: 'fit'}
				  		    	,items: [{
				  		    		width: '14%', 
				  		    		height: '100%', 
				  		    		title: '<strong>'+getIi18NText('checkedTerminals')+'</strong>'
				  		    		,items: [terShareSelected]
				  		    	},{
				  		    		width: '30%', height: '100%', 
				  		   // 		title: '<strong>'+getIi18NText("sahreUsers")+' &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" onclick="refreshShareUser();">'+getIi18NText('refresh')+'</a></strong>'
				  		    		title: '<strong>'+getIi18NText("sahreUsers")+'</strong>'
				  		    		,items: [shareUser]
				  		    	},{
				  		    		width: '5%', height: '100%', 
				  		    		title: '<strong>'+getIi18NText("shareAuth")+'</strong>'
				  		    		,items: [terShareAuth]
				  		    	},{
				  		    		xtype: 'panel'
				  		    		,width: 100
				  		    		,minWidth: 80
				  		    		,border: false
				  		    		,layout: {type: 'vbox', align:'center',pack:'center'}
				  		    		,items: [ {
				  		    			xtype: 'radiogroup',
//				                	          fieldLabel: 'Two Columns', chanelShare
				  		    			columns: 1,
				  		    			hidden:true,
				  		    			vertical: true,
				  		    			items: [ { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
				  		    			         	{ boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true}
				  		    			]
				  		    		},{ 
				  		    			xtype: 'button'
					  		    		,width:100
					  		    		,height:30
					  		    		,text: getIi18NText('chanelShare')
					  		    		,id:'actBtn'
							            ,handler: function(){
			    							 cancelShare(0); 
			    						 }
				  		    		},{ 
				  		    			xtype: 'button'
				  		    			,width:100
				  		    			,height:30
				  		    			,text: getIi18NText('save')
				  		    			,id:'actsBtn'
				  		    			,margin:'20 0 0 0'
				  		    			,handler: saveShare
				  		    		},{ 
				  		    			xtype: 'button'
				  		    			,width:100
				  		    			,height:30
				  		    			,margin:'20 0 0 0'
				  		    			,id:'simplesBtn' 
							            ,text: getIi18NText('jsp_close')
							            ,handler: function(){
							            	sharePanel.hide();
							            	recordIds.removeAll();
							            	refreshMonitarData();
							            }
				  		    		}]
				  		    	}]	
				  		    }]
				  });
				  sharePanel.show();
			 }
     }
     //GZE 刷新子用户数据
     refreshShareUser = function(){
    	 shareUser.getStore().load() ;
	};
	
	//GZE 保存共享终端的信息
	function saveShare1(){
		//纪录上一次的共享数据
		var tousers=shareUser1.getSelectionModel().getSelection();
   	 	var shareauth=terShareAuth1.getSelectionModel().getSelection();
   	 	var toIds=new Array();//共享到用户的字符串
   	 	if(tousers.length== 0){
   	 		showTip(Ext.getCmp("activesBtn"),'<font color="red">'+getIi18NText("selectUser")+'</font>');
   	 		return;
   	 	}

/*   	 for(var i=0;i<shareauth.length;i++){
   		auIds.push(shareauth[i].get('auid'));  
   	 }*/
   	 for(var i=0;i<tousers.length;i++){
    	 	var auIds=new Array();//共享的权限的字符串
    	 	for(var j=0;j<shareauth.length;j++){
    	   		auIds.push(shareauth[j].get('auid'));  
    	   	 }
   		auIds.push(tousers[i].get('uid'));  
   		 toIds.push(auIds.join(","));  
   		// toIds.push(tousers[i].get('uid'));  
   	 }
   	saveShavefn(toIds.join(";"),1);

/*   	 Ext.getBody().mask(getIi18NText("monitor_message_37"));
   	 Ext.Ajax.request({
   		 url: 'terminal!saveShare.action'
   			 ,method: 'post' 
   				 ,params: {toIds: toIds.join(","),tids:globalTid,auIds:auIds.join(",")}
   	 ,timedout:120000
   	 ,failure: function(response, opts) {
   		 Ext.getBody().unmask();
   		 isFreshing = true;
   		 Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
   	 }
   	 ,success: function(response){
   		 Ext.getBody().unmask();
   		 isFreshing = true;
   		 var result =eval('(' + response.responseText + ')');
   		 if(result.code==0){
   			 Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
   			 sharePanel.hide();
   			 recordIds.removeAll();
   			 refreshMonitarData();
   		 }else{
   			 Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
   		 }
   	 }
   	 });*/
	}
    //GZE 保存共享终端的信息
    function saveShare(){
    	//纪录上一次的共享数据
    //	console.info("保存时"+shareData.length);
   	 	if(preUserId==null){
   	 		showTip(Ext.getCmp("actsBtn"),'<font color="red">'+getIi18NText("selectUser")+'</font>');
   	 		return;
   	 	}
    	if(preUserId!=null){
    		var shareauth=terShareAuth.getSelectionModel().getSelection();
    		var teAr=new Array();
    		for(var i=0;i<shareauth.length;i++){
    			teAr.push(shareauth[i].get("auid"));
    		}
    		//teAr.push(record.get("uid"));
    		teAr.push(preUserId);
    		var iscu=true;
			for(var j=0;j<shareData.length;j++){
				var len=shareData[j].length-1;
				if(shareData[j][len]==preUserId){
					iscu=false;
					shareData[j]=teAr;
				}
			}
			if(iscu){
					shareData.push(teAr);
			}
    	}
    	var saveda = [];
    	for(var i=0;i<shareData.length;i++){
    		saveda.push(shareData[i].join(","));
    		//console.info(shareData[i].join(","));
    	}
    //	console.info(saveda.join("."));
    	saveShavefn(saveda.join(";"),0);

    }
    function saveShavefn(savedata,ptype){
   // 	console.info("传输数据"+savedata+"阿道夫"+ptype);
    	 Ext.getBody().mask(getIi18NText("monitor_message_37"));
       	 Ext.Ajax.request({
       	    	   url: 'terminal!saveShare.action'
       	    	  ,method: 'post' 
       	    	  ,params: {savedata: savedata,tids:globalTid}
           		  ,timedout:120000
           		  ,failure: function(response, opts) {
           			  Ext.getBody().unmask();
           			  isFreshing = true;
           			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
           		    }
       	    	  ,success: function(response){
       	    		  Ext.getBody().unmask();
       	    		  isFreshing = true;
       	    		  var result =eval('(' + response.responseText + ')');
       	        	  if(result.code==0){
       	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
       	        		  if(ptype==0){
       	        			  sharePanel.hide();
       	        		  }else{
       	        			  sharePanel1.hide();
       	        		  }
       	        		  recordIds.removeAll();
    		    		  refreshMonitarData();
       	        	  }else{
       	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
       	        	  }
       	    	  }
        	});
    }
    //GZE 保存共享终端的信息
    function cancelShare(chtype){
    	//console.info("取消共享的"+globalTid);
    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	Ext.Ajax.request({
    		url: 'terminal!cancelShare.action'
    		,method: 'post' 
    		,params: {tids:globalTid}
    		,timedout:120000
    		,failure: function(response, opts) {
    			Ext.getBody().unmask();
    			isFreshing = true;
    			Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    		}
    		,success: function(response){
    			Ext.getBody().unmask();
    			isFreshing = true;
    			var result =eval('(' + response.responseText + ')');
    			if(result.code==0){
    			//	  var data =eval('(' + result.msg + ')');
    				Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
    				if(chtype==1){
    					sharePanel1.hide();
    				}else{
    					sharePanel.hide();
    				}
    				recordIds.removeAll();
    				refreshMonitarData();
    				//	  terminalGrid.getStore().load();
    			}else{
    				Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
    			}
    		}
    	});
    }
     //在终端分配中终端名字的表格GZE
      terminalSelected=Ext.create('Ext.grid.Panel', {
		    store: Ext.create('Ext.data.Store', {
					    fields:['tid','name'],
					    data: []
		    }),
		    columns: [
		        { text: getIi18NText('No'), minWidth: 60 , xtype: 'rownumberer', align: 'center' },
		        { text: getIi18NText('terminalName'),  dataIndex: 'name', flex: 1, menuDisabled: true, draggable: false }
		    ],
		    height: 100,
		    minWidth: 200,
		    width: '100%',
		    listeners: {
		    	/*afterrender:  loadChoiceData*/
		    }
});
      //GZE 2016/8/15  显示终端分配面板前加载数据
      function distributionFn(tid){
    	  isFreshing = false;
    	  globalTid = tid;
    	  Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	  Ext.Ajax.request({
    		  url: 'terminal!getTerminalInfos.action'
    			  ,method: 'post' 
    				  ,params: {id: globalTid}
    	  ,timedout:120000
    	  ,failure: function(response, opts) {
    		  Ext.getBody().unmask();
    		  isFreshing = true;
    		  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    	  }
    	  ,success: function(response){
    		  Ext.getBody().unmask();
    		  isFreshing = true;
    		  var result =eval('(' + response.responseText + ')');
    		  if(result.code==0){
    			  var data =eval('(' + result.msg + ')');
    			  var names=data.name;
    			  if(data.time){//检查是否在线 没有在线就不能终端分配GZE
    				  terminalSelected.getStore().removeAll();
    				  terminalSelected.getStore().add(data);
    				  terUserName=data.uname;//记录终端用户名称
    				  showDistribution(globalTid,data);
    			  }else{
    				  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('terminalInvalid'));
    			  }
    		  }
    	  }
    	  });
      }
     //GZE 2016/8/15 显示终端分配面板
     function showDistribution(tid,data){
    	 	globalTid = tid;
    		 distributionPanel=Ext.getCmp('distributionPanel');
    		if(distributionPanel && distributionPanel.isWindow){
    			groupSelected.getStore().load() ;
				 distributionPanel.show();
				  return;
			 }else{
			     groupSelectedProxy = getAjaxProxy({url:'terminal!childUsers.action'});
				  groupSelected=Ext.create('Ext.grid.Panel', {
							 store: Ext.create('Ext.data.Store', {
								      fields:['uid','chname','chnum'],
						              pageSize: Number("0x7fffffff"),//未分页，防止显示不全
									  proxy: groupSelectedProxy
							          ,autoLoad: true
							          ,listeners: {
							        	  load:function($this){
										    	 if(terUserName!=null){
										    		 var selection = groupSelected.getSelectionModel();
										    		 var records=[];
										    		 for(var k =0; k < groupSelected.getStore().count(); k++){
										    			 var record =groupSelected.getStore().getAt(k);  
										    			 if(terUserName==record.get('chname')){
										    				 records.push(record);            
										    			 }
										    		 }
										    		 selection.select(records);
										    		 terUserName=null;
										    	 }
										    }
									}
				             }),
							 selType: 'checkboxmodel',
						     selModel :{ 
						    	      mode: 'SINGLE'
						    	    	  , allowDeselect: false
								    		, showHeaderCheckbox : true
								    		, enableKeyNav: false
								    		, ignoreRightMouseSelection:true
						      },
							  columns: [
							           { text: getIi18NText('distribution_user'),  dataIndex: 'chname', flex: 1, menuDisabled: true, draggable: false },
							           { text: getIi18NText('knownTerminals'),  dataIndex: 'chnum', flex: 1, menuDisabled: true, draggable: false ,renderer: ternumRenderFn}
							  ],
				             height: 100,
				             minWidth: 200,
				             width: '100%'
				         	
				          
				            	
				 });
				  		
				 
				 distributionPanel=Ext.create('Ext.window.Window',{
					 title: getIi18NText('ter_distribution')
						 ,id:"distributionPanel"
							 ,plain: true
							 ,width: 650
							 ,height: 230
							 ,minWidth: 300
							 ,maximizable: true
							 ,minHeight: 200
							 ,border: false
							 ,modal: true
							 ,constrain: true
							 ,closeAction: 'hide'
								 ,listeners: {
									 /*beforeclose: function(){
								     this.hide(btn);
							   }*/
								 }
				 ,layout: 'fit'
					 ,items:[{
						 xtype: 'panel'
							 ,layout: {type:'hbox', align: 'middle',pack:'center'}
					 ,width: '100%', height: '100%'
						 ,border: false
						 ,defaults: { width: '38%', height: '100%', margin: '2 2 5 2', xtype: 'fieldset',minWidth:230,layout: 'fit'}
					 ,items: [{
						 title: '<strong>'+getIi18NText('checkedTerminals')+'</strong>'
						 ,items: [terminalSelected]
					 },{
						 title: '<strong>'+getIi18NText('distributionTouser')+' &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" onclick="refreshTerminalGroup();">'+getIi18NText('refresh')+'</a></strong>'
						 ,items: [groupSelected]
					 },{
						 xtype: 'panel'
							 ,width: 140
							 ,minWidth: 80
							 ,border: false
							 ,layout: {type: 'vbox', align:'center',pack:'center'}
					 ,items: [ {
						 xtype: 'radiogroup',
//				                	          fieldLabel: 'Two Columns',
						 columns: 1,
						 hidden:true,
						 vertical: true,
						 items: [
						         { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
						         { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true}
						         ]
					 },{ 
						 xtype: 'button'
							 ,width:140
							 ,height:30
							 ,text: getIi18NText('save_ter_distribution')
							 ,id:'activeBtn'
						     ,handler: saveDistribution
					 },{ 
						 xtype: 'button'
							 ,width:140
							 ,height:30
							 ,margin:'20 0 0 0'
							 ,id:'simpleBtn' 
							 ,text: getIi18NText('jsp_close')
							 ,handler: function(){
								 distributionPanel.hide();
								 recordIds.removeAll();
			    				 refreshMonitarData();
							 }
					 }]
					 }]	
					 }]
				 });
				 distributionPanel.show();
			 }
     }
     //GZE 刷新子用户数据
 	 refreshTerminalGroup = function(){
		 groupSelected.getStore().load() ;
	};
	
    //GZE 保存分配的信息
     function saveDistribution(){
    	 var rows=groupSelected.getSelectionModel().getSelection();
    	 var toId="";
    	 for(var i=0;i<rows.length;i++){
    			 toId=rows[i].get('uid');
    	 }
    	 Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	 Ext.Ajax.request({
    	    	   url: 'terminal!saveDistribution.action'
    	    	  ,method: 'post' 
    	    	  ,params: {toid: toId,tids:globalTid}
        		  ,timedout:120000
        		  ,failure: function(response, opts) {
        			  Ext.getBody().unmask();
        			  isFreshing = true;
        			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
        		    }
    	    	  ,success: function(response){
    	    		  Ext.getBody().unmask();
    	    		  isFreshing = true;
    	    		  var result =eval('(' + response.responseText + ')');
    	        	  if(result.code==0){
    	        	//	  var data =eval('(' + result.msg + ')');
    	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
    	        		  distributionPanel.hide();
    	        		  recordIds.removeAll();
		    				 refreshMonitarData();
    	        	//	  terminalGrid.getStore().load();
    	        	  }else{
    	        		  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
    	        	  }
    	    	  }
     	});
     }
     function ternumRenderFn(value,metaData,record,rIndex,cIndex){
	      return Ext.isNumber(value) && value*1 > 0?value:0;
	 }
     function createMoreBtns(tid){
    	if(typeof(moreMenuCmp)!="undefined"){
    		moreMenuCmp.destroy(); 
    	}
    	var record;
    //	console.info("权限"+dataStore.getCount());
    	dataStore.each(function(r){
    		 if(r.get("terId")==tid){
    			 record=r;
    		 }
    	 });
    	/*console.info("记录"+record.get("terId"));
    	 console.info("权限"+record.get("authIds")+"很多很多");
    	 if(record.get("authIds")!=''){
    		 var ter=record.get("authIds");
    		 console.info("截屏"+ter.screen)
    		 console.info("其他"+ter.pub+"阿")
    	 }*/
    	   moreMenuCmp = Ext.create('Ext.menu.Menu', {
    		                    minHeight: 30,
	    		    		    items: [{//音频
	    		    		    	text:getIi18NText("audiocall")
	    		    		        ,iconCls: 'audioIconCss'
	    		    		        ,name: 'showAudio'
	    		    		        ,hidden: !AUTH["audio"]
	    		    		        ,handler: moreMenuHandler
	    		    		    },{//单向视频
	    		    		    	text:getIi18NText("singleshowvidel")
	    		    		        ,iconCls: 'videoIconCss'
	    		    		        ,name: 'singleshowVideo'
	    		    		        ,hidden: !AUTH["video"]
	    		    		        ,handler: moreMenuHandler
	    		    		    },{//双向视频
	    		    		    	text:getIi18NText("videonow")
	    		    		        ,iconCls: 'videosIconCss'
	    		    		        ,name: 'showVideo'
	    		    		        ,hidden: !AUTH["video"]
	    		    		        ,handler: moreMenuHandler
	    		    		    },{
	    		    		    	text:getIi18NText('jsp_detailInfo')
	    		    		        ,iconCls: 'detailInfoIconCss'
	    		    		        ,name: 'detailInfo'
	    		    		        ,hidden: false
	    		    		        ,handler: moreMenuHandler
	    		    		    },{
	    		    		        text: getIi18NText('js_message_cutinmsg')
	    		    		        ,iconCls: 'menuMsgIconCss'
	    		    		        ,name: 'msg'
	    		    		        ,hidden: false
	    		    		        ,handler: moreMenuHandler
	    		    		    },{
	    		    		        text: getIi18NText('jsp_checkVersion')
	    		    		        ,iconCls: 'menuUpdateIconCss'
	    		    		        ,name: 'update'
	    		    		        ,hidden: false//没有加权限
	    		    		        ,handler: moreMenuHandler
	    		    		    	
	    		    		    }
	    		    		    ,{
	    		    		        text: getIi18NText('saleRecord')
	    		    		        ,iconCls: 'goodsManaIconCss'
	    		    		        ,name: 'goods'
	    		    		        ,handler: moreMenuHandler
	    		    		    }
	    		    		 ]
    	   });
    	   //需要权限管理的选项
    	   if(record.get("isShare")==1){
    		 var ter=record.get("authIds");
			 moreMenuCmp.add({
			        text: getIi18NText('timePlan')
			        ,iconCls: 'menuPowerIconCss'
			        ,name: 'power'
			        ,hidden: ter.off==undefined
			        ,handler: moreMenuHandler
			    });
    	   }else if(record.get("isShare")==0){
    		   moreMenuCmp.add({
			        text: getIi18NText('timePlan')
			        ,iconCls: 'menuPowerIconCss'
			        ,name: 'power'
			        ,hidden: !AUTH["off"]
			        ,handler: moreMenuHandler
			    }
/*    		   ,{
			   		text: getIi18NText('ter_distribution')
   		    	,iconCls: 'distributionIconCss'
   		    	,name: 'distribution'
   		    	,hidden: !AUTH["distribution"]
   		    	,handler: moreMenuHandler
			    }*/
			   /* ,{//GZE 添加共享终端，要有权限才会显示
	    			   text: '配置打印机'
	    			   ,iconCls: 'shareCss'
	    			   ,name: 'share'
	    			   //,hidden: !AUTH["share"]
	    			   //,handler: moreMenuHandler
	    		   }*/
			    );
    	   }
     }
     function showMoreBtns(tid){
    	 globalTid = tid;
    	 moreMenuCmp.showBy(Ext.get(terAview+tid), null, [20, -10]);
     }
     //event start
    //event end
     function filterData() {
         //TODO: the suspend/resume hack can be removed once Filtering has been updated
    	 dataStore.suspendEvents();
    	 dataStore.clearFilter();
    	 dataStore.resumeEvents();
    	 dataStore.filter([{
             fn: function(record) {
                 return record.get('name').toLowerCase().indexOf( Ext.String.trim(filterObj.name).toLowerCase() ) != -1;
             }
         }]);
         
    	 dataStore.sort(filterObj.sortKey, filterObj.sortVal);
         Ext.getCmp('imgTotalfield').setValue(dataStore.getTotalCount());
         selectEvent({type:'no'});
         
     }
     
     function sortFilter(item){
    	 if(oldSortId == item.id)  return;
    	 Ext.getCmp(oldSortId).findParentByType('splitbutton').setIconCls('aaa');
    	 var pmenu = item.findParentByType('splitbutton');
    	 oldSortId = item.id;
    	 
    	 item = item.id.split("_");
    	 filterObj.sortKey = item[2];
    	 filterObj.sortVal = item[3];
    	 pmenu.setIconCls('sortBut_'+item[3]);
    	
    	 filterData();
    	 dataStore.sort('stateText', 'ASC');
     }
     
     function delaySearch(){
    	  window.clearTimeout(timeId);
    	  timeId=window.setTimeout(function(){
    		  recordIds.removeAll();
    		  refreshMonitarData();
    	  }, 800);
     }
     
     function resizeStore(){
    	  if(Ext.getCmp('imgDataViewPanel')){
  //  		   filterData();
    		  dataStore.sort('stateText', 'ASC');
    	  }
     }
     
     Ext.getCmp('imgCenterArea').add({
	 	     xtype: 'panel',
	 	     id: 'imgDataViewPanel',
	         header: false,
	         border: false,
	         layout: 'fit',
	         hidden: true,
	         listeners:{
	         	  afterrender: function(){ 
	         		     this.add(dataview);
	         			if(!parent.parent.isonline&&!parent.parent.isoffline){//检查是否是从在线终端数点过来的GZE
	            		   recordIds.removeAll();
	         		     refreshMonitarData();
	            		}
	         		     this.show(null,function(){
	         		    	     Ext.getBody().unmask(); 
	         		    	//     filterData();
	         		    		 dataStore.sort('stateText', 'ASC');
	         		     });
	         		     
	         		     if(autoFresh==true){
	         		    	window.setInterval(function(){
	         		    		  if( theTabIsShow() == true && Ext.getCmp("autoFreshCheckbox").getValue() == true){
	         		    			  recordIds.removeAll();
	         		    			  refreshMonitarData();
	         		    		  }
	         		    	},120000); //GZE 自动刷新时间改为30秒
	         		     }
	         	  }
	         }
    });

    function selectEvent(menu, item, e, eOpts ){
            var store = dataview.getStore();
            if(store.getCount() == 0) return;
            var nodes = dataview.getNodes();
            for(var i=0; i<nodes.length; i++){
                   var chk = nodes[i].querySelector('input[name="itemChk"]');
                   if(!chk) continue;
                   if(menu['type']=='all'){
                       chk.checked=true;
                       continue;
                   }
                   if(menu['type']=='no'){
                       chk.checked=false;
                       continue;
                   }
                   if(menu['type']=='else'){
                       chk.checked=!chk.checked;
                   }
            }
            
    }
    
    var AllTer;
    var totalPage;

    
    function  createPlanWindow(modal){
//    	var winW = Ext.getBody().getWidth()-230; //1266
    	var winW = Ext.getBody().getWidth()-60; //1266
    	var winH = Ext.getBody().getHeight()-200; //622
    	winW = winW<700?700:winW;
    	winH = winH<300?300:winH;
    	//var modal = dataStore.getAt(index-1);//.get("name"));
    	var state = modal.get("stateValue");
    	var title = modal.get("name")+"("+modal.get("screen")+")"+getIi18NText("monitor_message_02");
    	tplItem = Ext.get(viewTable_prefix+modal.get("terId")).parent('ul');
    	
    	isPlanfresh = true;
    	if(planWinow && planWinow.isPanel){
    		
    		//data
    		ajaxProxy.setExtraParam("tid", modal.get("terId"));
    		ajaxProxy.modal = modal;
    		planStore.load();
   	        
   	        //show
    		planWinow.setTitle(title);
//    		planWinow.setHeight(winH).center().show(tplItem);
    		planWinow.setWidth(winW).setHeight(winH).center().show(tplItem);
    		
    		var diskvalue = diskinfoMap.get(globalTid);
    		Ext.getCmp("diskinfofield").setValue(diskvalue?diskvalue:"");
    		
    		return;
    	}
    	
       ajaxProxy = getAjaxProxy({url: 'terminal!planInfo.action',extraParams: {tid: modal.get("terId")}});
       ajaxProxy.modal = modal;
       planStore = Ext.create('Ext.data.Store', {
				 fields: ["pid","pubName","type","startRange","endRange","userName","pubtime","status","percents"]
				,buffered: false
				,pageSize: 20
				,leadingBufferZone: 50
				,proxy: ajaxProxy
				,autoLoad: true
				,listeners: {
					    load:function($this){
					    	 var totalCount = $this.getTotalCount();
					    	 Ext.getCmp('totalTabRows').setValue(totalCount);
 					    	 //visible
					    	 if(planWinow){
					    		 var state = ajaxProxy.modal.get("stateValue");
					    		 var isVisible = totalCount>0 && state == 2;
					    		 planWinow.down("#delActionColumn").setVisible(isVisible);
//					    		 planWinow.down("#delActionBtn").setVisible(isVisible);
					    	 }
					    	 
					    	 refreshPlanDownloadStatus(ajaxProxy.modal.get("terId"));
					    }
				}
		});
        planWinow = Ext.create('Ext.panel.Panel',{
					  title: title
					 ,modal: true
					 ,floating: true
					 ,draggable :true
					 ,closable: true
					 ,border: false
					 ,shadowOffset : 10
					 ,shadow: 'drop'
					 ,renderTo: document.body
					 ,width: winW
					 ,height: winH
					 ,closeAction: 'hide'
					 ,layout: 'fit'
					 ,items: [{
					     xtype: 'grid'
					    ,id:'schedGrid'
						,columns: [
                               {text: getIi18NText("monitor_message_03"), width: 50 ,xtype: 'rownumberer',align: 'center',flex: 0.5}//width: 50
						      ,{text: getIi18NText("monitor_message_04"), dataIndex: 'pubName', minWidth: 120,align: 'center',flex: 1}
						      ,{text: getIi18NText("monitor_message_05"), dataIndex: 'type', width: 50, align: 'center',flex: 0.5}
							  ,{text: getIi18NText("monitor_message_06"), dataIndex: 'startRange',width: 135,align: 'center',flex: 1.5}
							  ,{text: getIi18NText("monitor_message_07"), dataIndex: 'endRange',width: 135,align: 'center',flex: 1.5}
							  ,{text: getIi18NText("monitor_message_08"), dataIndex: 'status',width: 80,renderer: statusRenderFn,align: 'center',flex: 1}
							  ,{text: getIi18NText("monitor_message_09"), dataIndex: 'percents',width: 80,align: 'center',flex: 0.8}
							  ,{
								  xtype:'actioncolumn',
								  text: getIi18NText("monitor_message_10"),
								  hidden: state!=2,
								  itemId: 'delActionColumn',
								  width: 60,
								  flex: 0.5,
								  align: 'center',
								  items: [{
									  iconCls: 'republishIcon',
									  tooltip: getIi18NText("jsp_republishTip4"),
									  tooltipType: 'title',
									  handler: republishPlan
								  },{
									  iconCls: 'removeIconCss',
									  tooltip: getIi18NText("monitor_message_11"),
									  tooltipType: 'title',
									  handler: removePlan
								  }]
							  }
							  ,{text: getIi18NText("monitor_message_12"), dataIndex: 'userName',minwidth: 120, align: 'center',flex: 1}
							  ,{text: getIi18NText("monitor_message_13"), dataIndex: 'pubtime',minwidth: 140, align: 'center',flex: 1.5}
						]
						,store: planStore
						,bbar: [{
								    xtype:'button',
								    tooltip: getIi18NText("monitor_message_14"),
						            text: getIi18NText("monitor_message_15"),
						            border: false,
						            iconCls: 'delIconCss',
						            hidden: false, //state!=2,
						            itemId: 'delActionBtn',
								    handler: removePlan
						   	   },{
								    xtype:'button',
								    tooltip: getIi18NText("monitor_message_16"),
						            text: getIi18NText("monitor_message_17"),
						            border: false,
						            iconCls: 'clearmaterial',
						            itemId: 'delSourceBtn',
								    handler: removePlan
				   	          },{
							        xtype:'button',
							        tooltip: getIi18NText("monitor_message_18"),
					                text: getIi18NText("monitor_message_19"),
					                border: false,
					                iconCls: 'refreshIconCss',
							        handler: searchFn
							   },{
                                    xtype: 'displayfield'
								    ,id: 'totalTabRows'
								    ,baseCls: 'totalCountCls'
							        ,fieldLabel: getIi18NText("monitor_message_20")
							        ,labelWidth: 70
							        ,width: 100
							        ,value: '-'
						        },{
								    xtype:'button',
								    tooltip: getIi18NText("monitor_message_21"),
						            text: getIi18NText("monitor_message_22"),
						            border: false,
						            id: 'diskinfobtn',
						            iconCls: 'diskIconCss',
						            handler: checkTheCapacity

				   	            },{
					        	    xtype: 'displayfield'
					        	    ,baseCls: 'totalCountCls'
					        	    ,id: 'diskinfofield'
							        ,fieldLabel: ''
							        ,labelWidth: 60
							        ,width: 210
							        ,listeners:{
							        	change: diskinfoChangeFn
							        }
						        }]
						 ,viewConfig: {
					            trackOver: false
					           ,emptyText: '<h1 style="margin:10px">'+getIi18NText("monitor_message_23")+'</h1>'
					    }
					 }]
					 ,listeners: {
					      beforeclose: function(){
						       this.hide(tplItem);
						       Ext.getCmp('totalTabRows').setValue(0);
						       planStore.removeAll();
						       isFreshing = true;
						       isPlanfresh = false;
						       window.clearTimeout(freshPlanTimeout);
						  }
                          ,afterrender: function(){
                        	   this.show(tplItem);
                          }
					 }
				     
		});
    }
    
    /**
     * 刷新排期素材下载
     */
    var percentsCheck = true;
    
    function refreshPlanDownloadStatus(tid){
    	    window.clearTimeout(freshPlanTimeout);
    	    freshPlanTimeout = window.setTimeout(function(){
		    	    	   if( thePlanTabShow() != true ){
		    	    		   if(percentsCheck == true){
		    	    			   percentsCheck = false;
		    	    			   refreshPlanDownloadStatus(tid);
		    	    		   }
		    	    		   return;
		    	    	   }
		    	    	   refreshPlanGridProcess(tid);
            }, 3000);
    }
    function refreshPlanGridProcess(tid){
	    	 Ext.Ajax.request({
			     url: 'terminal!getScheduleDownloadInfo.action'
			    ,params: {tid: tid, rand: new Date().getTime()}
		        ,method: 'post'
		        ,callback: function(opt, success, res){
		        	  
		        	  var result = Ext.decode(res['responseText']);
		        	  if(result.length > 0){
		        		  for(var j=0; j<planStore.count(); j++){
		        			  var r = planStore.getAt(j);
		        			  for(var i=0; i<result.length; i++){
		        				  
		        				  if(r.get("id") ==result[i]["sid"]){
		        					  r.set("percents", result[i]["percents"]);
		        					  //r.set("status", result[i]["status"]);
		        					 //r.set("status", 6);
		        					 // r.commit();
		        				  }   
		        			  } 
		        		  }
		        	  }
		        	 percentsCheck = true;
		        	 refreshPlanDownloadStatus(tid);
		        }
		   });
    }
    
    function statusRenderFn(val){
    	var s=[];
    	if(val==9||val==6||val == 3||val == 0||val == 1|| val==7){
    		s[0] = 'green';
    		s[1] = getIi18NText("monitor_message_24");
    		
    	}
//    	else if(val==){
//    		s[0] = 'gray';
//    		s[1] = getIi18NText("monitor_message_25");
//    		
//    	}
    	else if(val == 2||val==8){
    		s[0] = 'red';
    		s[1] = getIi18NText("monitor_message_26");
    		
    	}else{
    		s[0] = 'red';
    		s[1] = getIi18NText("monitor_message_26");
    		
    	}
    	return Ext.String.format('<font color="{0}">{1}</font>',s[0],s[1]);
    }
	//状态渲染 
	function staRenderFn(value,metaData,record,rIndex,cIndex){
		switch(value){
		case 1:
			return '<font color="green">' + getIi18NText("orders20") + '</font>';
		case 2:
			return '<font color="green">' +getIi18NText("orders21")+ '</font>';
		case 3:
			return '<font color="red">' + getIi18NText("orders18") + '</font>'; 
		case -1:
			return  '<font color="red">' + getIi18NText("null") + '</font>'; 
		case -3:
			return '<font color="gray">' + getIi18NText("orders23")+ '</font>';
		case -2:
			return '<font color="gray">' + getIi18NText("orders24")+ '</font>';
		case -4 :
			return '<font color="gray">' + getIi18NText("orders25") + '</font>';
		case -5:
			return  '<font color="gray">' + getIi18NText("orders26")+ '</font>';

		default:
			return '--';
			break;
		}
	}
	function typeRenderFn(value,metaData,record,rIndex,cIndex){
		switch(value){
		case 2:
			return getIi18NText('pay_wechat');
		case 3:
			return getIi18NText('pay_alipay');
		default:
			return '--';
			break;
		}
	}
	editOrderRowFn = function(r,t){
		var model = orderGrid.getStore().getAt(r);
	//	console.log("model",model);
		if(model){
			//1. 删除订单
			if(t=="D"){
				var oid = model.get('id');
				executeDel(oid) ;
				return;
			}
			
			//查看退款信息
			if(t == "Q"){
				var oid = model.get("id");
				queryRefund(oid);
				return;
			}
			//直接退款
			if(t == "T"){
				var oid = model.get("id");
							Ext.Msg.show({
					title : getIi18NText("orders33"),
					msg : getIi18NText("orders39"),
					buttons : Ext.MessageBox.YESNO,
					icon : Ext.MessageBox.WARNING,
					width : 320,
					buttonText : {
						yes : getIi18NText("orders38"),
						no :  getIi18NText('cancel')
					},
					fn:function callback(btn,text){
	                    switch (btn) {
						case "yes":
							retryRufund(oid);
							break;
						case "no":
							break;
						default:
							break;
						}
	                },
					icon : Ext.window.MessageBox.INFO
				});
				return;
			}
//			
			//2. detail
			var ctrTr = Ext.get(ctrlTrUl+r).parent("tr");//viewIconACss
			var divId = ctrlTrUl+r+'_div';
			var panelId = ctrlTrUl+r+'_panel';
			var detailPanel=Ext.getCmp(panelId);
			zxLog("detailPanel",detailPanel);
			var showTxtA  = Ext.get(ctrlTrUl+r).query('.viewIconACss')[0];
			showTxtA.innerHTML = getIi18NText("item_up");
			if(detailPanel != null){
				zxLog("detailPanel",detailPanel);
				zxLog("detailPanel isV",detailPanel.isVisible());
				detailPanel.setVisible(!detailPanel.isVisible());
				if(detailPanel.isVisible()){
//					detailPanel.show();	hidden
				}
				if(!detailPanel.isVisible()){
					showTxtA.innerHTML = getIi18NText("item_detail");
				}
				detailPanel.doLayout();
				orderGrid.doLayout();
				return;
			}
			ctrTr.insertSibling('<tr><td colspan=9 id="'+divId+'" ></td></tr>','after');
			detailPanel=Ext.create('Ext.panel.Panel',{
				      id: panelId
				     ,height: 240
				     ,border: false
				     ,header: false
				     ,renderTo: Ext.get(divId)
				     ,layout: 'hbox'
				     ,baseCls: 'childContentCls'
				     ,items: [{  
					    	   flex: 1
					    	  ,itemId: 'terminal'
					    	  ,height: '100%'
					          ,layout:'fit'
					          ,padding: 1
					          ,border: false
					     }]
				     ,listeners:{ 
				    	 afterrender: function(t){
				    		 reqInnerContent(t,model);
				    		  //layout
				    		 orderGrid.doLayout();
				    	 }
				     }
			});
		
		}
	};
	//展开操作. model 选中的这行数据
	function reqInnerContent(panel,model){
	   var ordersDetailStore = Ext.create('Ext.data.Store', {
		   data: model.raw['ordersDetail'],
		   fields: ['id','name','goodsCode',  'price', 'count', 'type', 'status','remark'],
		   pageSize:20
	   });
	   //terminal	
	   var terminal = Ext.create('Ext.grid.Panel', {
		   title: getIi18NText("orders12"),
		   disableSelection: true,
		   store: ordersDetailStore
		   ,columns: {
		   		items:[
		              {text: getIi18NText("Noo"), width: 50 ,xtype: 'rownumberer',align: 'center'}//width: 50
		              ,{text: getIi18NText("goods_nm"), dataIndex: 'name', minWidth: 60, width:100,align: 'center', flex:0.5}
		              ,{text: getIi18NText("goods_num"), dataIndex: 'goodsCode', width: 100, align: 'center'}
		              ,{text: getIi18NText("goods_pric"), dataIndex: 'price',width: 100,align: 'center'}
		              ,{text: getIi18NText("numCopies"), dataIndex: 'count',width: 100,align: 'center'}//
		              ,{text: getIi18NText("subtotal"), dataIndex: 'count',width: 100,align: 'center' , renderer:subtotal } 
		              ]
		        ,defaults: {
		 	 	  menuDisabled: true, sortable: true
		 	    }
		   }
		   ,bbar: [{
			   xtype: 'pagingtoolbar',
			   store: ordersDetailStore,
			   border:false,
			   displayInfo: true
		   }]
		   ,viewConfig: {
			   trackOver: false
			   ,emptyText: '<h1 style="margin:10px">'+getIi18NText("jsp_nodata")+'</h1>'
		   }
	   });
	   panel.queryById('terminal').add(terminal);
	}
	function subtotal(value,metadata,record,rowIndex){
	     try{
	    	 return value * record.raw["price"];
	     }catch(e){
	    	 return "--";
	     }
	}
	//删除交易记录
	function executeDel(ids,terId,btn){
		   if(Ext.isEmpty(ids)) return;
		   ids =  ids instanceof Array ? ids.join(','):ids;
		   Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText("upload_tip_systip"), cls:'msgCls', msg:getIi18NText("jsp_confirmDelete"), plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("confirm"), cancel: getIi18NText("cancel")}, fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   orderGrid.getEl().mask(getIi18NText("item_deleting"));
				   Ext.Ajax.request({
					     url: 'restaurant!deleteOrders.action'
					    ,params: {oids: ids}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  if(btn != null && btn.isComponent){
						    	  btn.enable();
						      }
				        	  orderGrid.getEl().unmask();
				        	  var result = showResult(success,response);
				        	  if(result == false) return;
				        	  Ext.example.msg(getIi18NText("item_result"), getIi18NText("monitor_message_35"));
				        	  searchOrFn();
				        }
				   });
			   }
		 }});
	   }
	/**
	 * 查询真实退款明细
	 */
	function queryRefund(oid,btn){
		Ext.getBody().mask("loading");
		if(Ext.isEmpty(oid)) return;
		Ext.Ajax.request({
			url: 'restaurant!queryRefund.action'
			,params: {id: oid}
			,method: 'post'
			,callback: function(opt, success, response){
				Ext.getBody().unmask();
				if(response['responseText'] == null || response['responseText'].length <= 0) return ;
				var result = Ext.decode(response['responseText']);
				zxLog("result",result);
				var msg = "";
				var refundAble = false;
				if(parseInt(result.queryResult) == 0){
					msg = getIi18NText("orders27") + ' ：' + result.tradeNo + "<br />";
					msg += getIi18NText("orders28")+ ' ：' + result.tradeStatus + "<br />";
					msg +=  getIi18NText("orders29")+ ' ：' + result.totalAmount + ' ' + getIi18NText("rmb")+ "<br />";
					msg += getIi18NText("orders30") + ' ：' + result.relPay + ' ' +  getIi18NText("rmb") + "<br />";
					msg += getIi18NText("orders31")+ ' ：' + result.relAmount + ' ' +  getIi18NText("rmb") ;
				}else{
					msg = getIi18NText("orders32") ;
				}

				//总金额等于实际支付金额的时候可以重新发起退款
				if(parseInt(result.queryResult) == 0 &&parseFloat(result.totalAmount) == parseFloat(result.relAmount)){
					refundAble = true;
				}
				Ext.Msg.show({
					title : getIi18NText("orders33"),
					msg :msg,
					buttons : Ext.MessageBox.YESNO,
					icon : Ext.MessageBox.WARNING,
					width : 320,
					buttonText : {
						yes : refundAble ? getIi18NText("orders34") : getIi18NText('confirm'),
						no :  getIi18NText('cancel')
					},
					fn:function callback(btn,text){
	                    switch (btn) {
						case "yes":
							if(refundAble)
								retryRufund(oid);
							break;
						case "no":
							break;
						default:
							break;
						}
	                },
					icon : Ext.window.MessageBox.INFO
				});
			}
		});
	}
	/**
	 * 重试退款
	 */
	function retryRufund(oid){
		Ext.Ajax.request({
			url: 'restaurant!retryRefund.action'
			,params: {id: oid}
			,method: 'post'
			,callback: function(opt, success, response){
				var result = showResult(success, response);
				if(result == false){ return; };
				Ext.example.msg(getIi18NText("item_result"), result.msg);
			}
		});
	}
	function searchOrFn(btn){
		tabStore.loadPage(1);
	}
	function ctrlRenderFn(value,metaData,record,rIndex,cIndex){
		 var ctrlHtml = ['<ul class="ctrlULCls" id="'+ctrlTrUl+rIndex+'">'];
		 ctrlHtml.push('<li><span class="viewIconCss">&nbsp;</span><a  href="javascript: editOrderRowFn('+rIndex+',\'V\');" title='+getIi18NText("item_detail_info")+' class="viewIconACss">'+getIi18NText("item_detail")+'</a></li>');
		 //此处的订单删除权限没有加
		 //if(AUTH['delete']){
			 ctrlHtml.push('<li><span class="removeIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'D\');" title='+getIi18NText("item_delete")+'>'+getIi18NText("delete")+'</a></li>');
		 //}
		 	ctrlHtml.push('<li><span class="auditIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'Q\');" title='+getIi18NText("orders35")+'>'+getIi18NText("orders36")+'</a></li>');
		 	ctrlHtml.push('<li><span class="editIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'T\');" title='+getIi18NText("orders37")+'>'+getIi18NText("orders38")+'</a></li>');
		 ctrlHtml.push('</ul>');
		 return ctrlHtml.join('');
	}
	function clearUnuseCmp(){
    	Ext.each(Ext.ComponentQuery.query('panel[id^='+ctrlTrUl+']'), function(item){
    		    item.removeAll();
    		    item.getEl().remove();
    		    Ext.ComponentManager.unregister(item);
    	});
    }
	function resizeChildContent(){
		Ext.each(Ext.ComponentQuery.query('panel[id^='+ctrlTrUl+']'), function(item){
		      if(item.isVisible()){
		    	  item.doLayout();
		      }
       });
	}
    function searchFn(){
    	if(planStore){
    		planWinow.down("grid").getSelectionModel().deselectAll();//此操作相当重要
    		planStore.load();
    	}
    }
    
    function removePlan(view, rowIndex, colIndex){
        //btn,e
    	var modal, msg;
    	
    	var p = {tid:0,id: -1,type: 1};
    	var tid = [];
    	//var nums=0;
    	recordIds.each(function(val, idx, len){
    	//	nums++;
    		if(val.get("stateValue") == 2)
    			tid.push(val.get("terId"));
    	});
    	 if(tid.length == 0 && colIndex == true){
     		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_selTip'));
     		return;
     	}else if(tid.length!=recordIds.length&& colIndex == true){
 			Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('se_online_ter'));
 			return;
 		}else if(tid.length > 0){
    		terIds = tid.join(',');
    		p.tid = terIds;
    		if(view.itemId == "delSourceBtn"){
    			msg = getIi18NText("monitor_message_28",getIi18NText('checked'));
    			p.type = 2;
    		}else
    			msg = getIi18NText("monitor_message_27",getIi18NText('checked'));
    	}else{
    		modal = ajaxProxy.modal;
    		p.tid = modal.get("terId");
    		if(view.itemId == "delSourceBtn"){
    			msg = getIi18NText("monitor_message_28","<font color='red'>【"+modal.get("name")+"】</font>");
    			p.type = 2;
    		}else
    			msg = getIi18NText("monitor_message_27","<font color='red'>【"+modal.get("name")+"】</font>");
    	}
    	
		if(view.xtype=="gridview"){
			msg = getIi18NText("monitor_message_29","<font color='red'>【"+modal.get("name")+"】</font>");
			
			modal = planStore.getAt(rowIndex);
			msg += getIi18NText("monitor_message_30","<font color='red'>【"+modal.get("pubName")+"】</font>");
			p.id=modal.get("pid");
			p.type=3;
		}
    	Ext.Msg.show({ icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', msg: msg,
 		              plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("monitor_message_31"), cancel: getIi18NText("monitor_message_32")},
 		              fn:function(bid, text, opt){
 		            	 if(bid == 'ok'){
 		            		 if(planWinow)
 		            			 planWinow.getEl().mask(getIi18NText("monitor_message_33"));
 		            		    //checkDelable();	
 		            		    //if(!delAble){planWinow.getEl().unmask();Ext.example.msg(getIi18NText("monitor_message_34"), getIi18NText("pub_inv_delete02")); delAble = false; return;};
 		            		    Ext.Ajax.request({
	 							     url: 'terminal!removePlanInfo.action'
	 							    ,params: p
	 						        ,method: 'post'
	 						        ,callback: function(opt, success, response){
	 						        	if(planWinow)
	 						        		planWinow.getEl().unmask();
	 						        	  var result = showResult(success,response);
	 						        	  if(result == false){
	 						        		 searchFn();
	 						        		 return;
	 						        	  }
	 						        	  Ext.example.msg(getIi18NText("monitor_message_34"), getIi18NText("monitor_message_35"));
	 						        	  searchFn();
	 						        }
	 						   });
 		            	 }
 		}});
    	
    }
    /**
     * 检查当前排期是否可以删除
     */
    var delAble = false;
    function checkDelable(){
    	for(var t = Date.now();Date.now() - t <= 1500;);	//暂停1.5秒，等待进度更新
    	var schedStore = Ext.getCmp("schedGrid").getStore();//.getAt("percents");
    	for(var i = 0 ; i < schedStore.getTotalCount(); i++){
    		if(!/^100(.)*%$/.test(schedStore.getAt(i).get("percents")))
    				return;
    	}
    	delAble = true;
    }
    function republishPlan(view,rowIndex,colIndex){
    	var modal = ajaxProxy.modal;
    	var tid = modal.get("terId");
    	if(view.xtype=="gridview"){
    		msg = getIi18NText("jsp_monitor_message_29","<font color='red'>【"+modal.get("name")+"】</font>");
    		modal = planStore.getAt(rowIndex);
    		var pname = modal.get("pubName");
    		var btime = modal.get("startRange");
    		var etime = modal.get("endRange");
    		var type = modal.get("type");
    		msg += getIi18NText("monitor_message_30","<font color='red'>【"+pname+"】</font>");
    		if(Ext.getCmp("pubTimeForm")){
    			Ext.getCmp("pubTimeForm").show();
    		}else{
	    		var pubTimeWindow = Ext.create('Ext.window.Window', { 
	    				title:getIi18NText('jsp_republishTip1')+pname+getIi18NText('jsp_republishTip2')
	    		        ,id:'pubTimeForm'
	    				,height:120
	    				,width: 600
	    				,items : [
	    				         {
	    			    	     layout: 'hbox'
	    			    	     ,border: false
	    			    	     ,margin: '2 3 6 0'
	    		                 ,items:[ 
	    	                           {
	    					            xtype: 'datefield'
	    					            ,width: 255
	    					            ,labelSeparator: '' 
	    					            ,fieldLabel: '<font class="boldLabelCls">'+getIi18NText("playingStartTime")+'</font>'
	    					            ,labelWidth: 90
	    					            ,editable: false
	    	                            ,format: 'Y/m/d H:i:s'
	    	                            ,id: 'pub_startDate'
	    	                            ,value:btime
	    					            }
	    					             ,{
	    					            	  xtype: 'datefield'
	    					            	 ,width: 175
	    					            	 ,labelSeparator: ''
	    					            	 ,fieldLabel: '<font class="boldLabelCls">'+getIi18NText("to")+'</font>'
	    					                 ,labelWidth: 10
	    					                 ,id: 'pub_endDate'
	    					                 ,editable: false
	    					                 ,format: 'Y/m/d H:i:s'
	    					                 ,value:etime
	    							     }]
	    				         }]
	    	   	,buttons : [{
	    				xtype : 'button',
	    				margin : '0 0 0 10',
	    				iconCls : 'pback_finish_IconCls',
	    				text : getIi18NText('confirm'),
	    				handler : function(){
	    					var begintime=Ext.getCmp('pub_startDate').getValue();
	    					var endtime=Ext.getCmp('pub_endDate').getValue();
	    					if(begintime>= endtime){
	    						   showTip(this,getIi18NText("playTimeErrWarming01"));
	    						   Ext.getCmp('pub_startDate').getEl().frame();
	    						   return;
	    					}
	    					var nowTime = new Date();
	    					if(endtime<nowTime){
	    						showTip(this,getIi18NText('jsp_republishTip3'));
	    						Ext.getCmp('pub_startDate').getEl().frame();
	    						return;
	    					}
	    					btime = Ext.Date.format(begintime,dateFormat);
	    					etime = Ext.Date.format(endtime,dateFormat);
	    					pubTimeWindow.close();
	    					Ext.Msg.show({ icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', msg: msg,
	    			             plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("monitor_message_31"), cancel: getIi18NText("monitor_message_32")},
	    			             fn:function(bid, text, opt){
	    			           	 if(bid == 'ok'){
	    			           		 planWinow.getEl().mask(getIi18NText("monitor_message_33"));
	    			           		 Ext.Ajax.request({
	    			        		     url: 'terminal!republishItem.action'
	    			        		    ,params: {tid:tid,pname:pname,b:btime,e:etime }
	    			        	        ,method: 'post'
	    			        	        ,callback: function(opt, success, response){
	    			        	              planWinow.getEl().unmask();
	    			        	        	  var result = showResult(success,response);
	    			        	        	  if(result == false) return;
	    			        	        	  var mess = result['msg'];
	    			        	        	  Ext.example.msg(getIi18NText("monitor_message_34"), mess);
	    			        	        	  searchFn();
	    			        	        }
	    			        	  });
	    			           	 }
	    			        }});
	    				}
	    		   	}]
	    			          
	    	    }).show();
    		}
	    	
    	}

    }
    
    sendOrder = function(tid, seq, msg){
    	    if(Ext.isNumber(tid) && Ext.isNumber(seq) || Ext.isArray(tid)){
    	    	isFreshing = false;
    	    	var terIds;
    	    	if(Ext.isNumber(tid)){
    	    		globalTid = tid;
    	    		terIds = tid;
    	    		tplItem = Ext.get(viewTable_prefix+globalTid).parent('ul');
    	    	}else{
        	    	recordIds.each(function(val, idx, len){
        	    		if(val.get("stateValue") == 2)
        	    			tid.push(val.get("terId"));
        	    	});
        	    	if(tid.length == 0){
        	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_selTip'));
        	    		return;
        	    	}else if(tid.length!=recordIds.length){
        				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('se_online_ter'));
        				return;
        			}
    	    		terIds = tid.join(',');
    	    		tid.splice(0,tid.length);
    	    	}
    	    	//1. plan manager
    	    	if( seq == 7 ){
    	    		var modal ;
    	    		dataStore.each(function(r){
	   					if(r.get("terId")==tid){
	   						modal=r;
	   					}
   				 	});
    	    		tplItem = Ext.get(viewTable_prefix+tid).parent('ul');
    	    		createPlanWindow(modal);
    	    		return;
    	    	}
    	    	if( seq == 8 ){
    	    		manaGoods(tid);
    	    		return;
    	    	}
    	    	if( seq == 9 ){
    	    		Ext.getBody().mask(getIi18NText("connetVideo"));
	    	    		 Ext.Ajax.request({
	    	    			 url: 'terminal!sendYunid.action'
    	    				 ,method: 'post' 
	    					 ,params: {tid:tid,nn:0}
		    	    		 ,timedout:120000
		    	    		 ,callback:function(opt, success,response){
		    	    			 Ext.getBody().unmask();
		    	    			 var result = showResult(success,response);
		    	    			 if(result == false) return;
		    	    			 var yuid = result.msg;
		    	    			 dataStore.each(function(r){
		    	   					if(r.get("terId")==tid){
		    	   						parent.parent.showAudio(yuid,tid,r.get("name"));
		    	   						parent.parent.deleteYunRequest(tid);
		    	   						return;
		    	   					}
		    				 	 });
		    	    		 }
	    	    		 })
	    	    	return;
    	    	}
    	    	if( seq == 10 ){
    	    		Ext.getBody().mask(getIi18NText("connetVideo"));
    	    		 Ext.Ajax.request({
    	  	    	     url: 'terminal!sendYunid.action'
    	  	    	    ,method: 'post' 
    	  	    	    ,params: {tid:tid,nn:1}
    	      		    ,timedout:120000
    	      		    ,callback:function(opt, success,response){
    	    	        	Ext.getBody().unmask();
    	    	        	var result = showResult(success,response);
    	    	        	if(result == false) return;
    	    	        	var yuid = result.msg;
    	    	        	dataStore.each(function(r){
    	       					if(r.get("terId")==tid){
    	       						parent.parent.showVideo(false,yuid,tid,false,r.get("name"));
    	       						parent.parent.deleteYunRequest(tid);
    	       						return;
    	       					}
    	    			 	});
    	    	        }
    	      		 })
    	    		return;
    	    	}
    	    	//双向视频
    	    	if( seq == 11 ){
    	    		 Ext.getBody().mask(getIi18NText("connetVideo"));
    	    		 Ext.Ajax.request({
    	  	    	     url: 'terminal!sendYunid.action'
    	  	    	    ,method: 'post' 
    	  	    	    ,params: {tid:tid,nn:2}
    	      		    ,timedout:120000
    	      		    ,callback:function(opt, success,response){
    	    	        	Ext.getBody().unmask();
    	    	        	var result = showResult(success,response);
    	    	        	if(result == false) return;
    	    	        	var yuid = result.msg;
    	    	        	dataStore.each(function(r){
    	       					if(r.get("terId")==tid){
    	       						parent.parent.showVideo(false,yuid,tid,true,r.get("name"));
    	       						parent.parent.deleteYunRequest(tid);
    	       						return;
    	       					}
    	    			 	});
    	    	        }
    	      		 })
    	    		return;
    	    	}
    	    	//定时计划
    	    	if( seq == 12 ){
    	    		shutdownFn(tid);
    	    		return;
    	    	}
    	    	
    	        //2. orderc
    	    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', msg: getIi18NText("monitor_message_36","【"+msg+"】"),
    	    		   plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("monitor_message_31"), cancel: getIi18NText("monitor_message_32")},
    	    		   animateTarget : tplItem,
    	    		fn:function(bid, text, opt){
	    	    		if(bid == 'ok'){
	    	    			   Ext.getBody().mask(getIi18NText("monitor_message_37"));
							   Ext.Ajax.request({
						    	   url: 'terminal!sendOrder.action'
						    	  ,method: 'post'
						    	  ,params: {id: terIds, t: seq}
						    	  ,callback: function(opt, success, res){
						    		  Ext.getBody().unmask();
						    		  isFreshing = true;
						    		  var result = showResult(success,res);
						        	  if(result == false) {
						        		  return;
						        	  }; 
						        	  if(seq == 3){
						        	  
						        	  		 	var img_url = webpath+"/"+result["msg"]+'?'+new Date().getTime();
												var img = new Image();
												img.src = img_url;
										//		console.info("图片路径 "+img_url);
												img.onload = function(){
													showScreenImg(globalTid, img_url, img.width, img.height);
												};
												img.onerror=function(){
													 Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_61")); //加载截图失败！
												};
												recordIds.removeAll();
								        		refreshMonitarData();
						        	  }
						        	  else{
						        		  Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_38"));
						        		  recordIds.removeAll();
						        		  refreshMonitarData();
						        	  }
						    	  }
						       });
					   }else{
						   isFreshing = true;
					   }             	    		
    	    	}});
    	    }
    };
    
    diskinfoChangeFn =function(T,newval,oldval){
    	 if(newval != oldval){
    	      diskinfoMap.add(globalTid, newval);
    	 }
    };
    function checkTheCapacity(){
    	   Ext.getCmp("diskinfobtn").enable(false);
    	   Ext.getCmp("diskinfofield").setValue(getIi18NText("monitor_message_39"));
		   Ext.Ajax.request({
	    	   url: 'terminal!sendOrder.action'
	    	  ,method: 'post'
	    	  ,params: {id: globalTid, t:  7}
	    	  ,callback: function(opt, success, res){
	    		  Ext.getCmp("diskinfobtn").enable(true);
	    		  Ext.getBody().unmask();
	    		  var result = showResult(success,res);
	    		  Ext.getCmp("diskinfofield").setValue("");
	        	  if(result == false) return; 
	        	  Ext.getCmp("diskinfofield").setValue(result['msg']);
	    	  }
	       });
    }

	var everyTimerWinow;
    //每天设置 GZE 2016-9-2
    function defaultMenuItem(index){
 	   //1. base comp
  		everyTimerWinow = Ext.create('Ext.panel.Panel',{
//			  title: "统一设置"
  			 title: getIi18NText("everySet")
			 ,modal: true
			 ,floating: true
			 ,draggable :true
			 ,closable: true
			 ,border: true
			 ,shadowOffset : 10
			 ,shadow: 'drop'
			 ,renderTo: document.body
			 ,height: 130
			 ,width: 400
			 ,closeAction: 'hide'
			 ,layout: {type: 'vbox'}
			 ,items: [ {
                  xtype: 'panel'
		                 ,id: 'timesMenu_id'
					     ,layout: 'border'
						 ,width:  400
						 ,height: 92
						 ,baseCls: 'timesMenu'
						 ,bodyCls: 'timePieceBackCls'
						 ,items: [{
								       xtype: 'panel'
									  ,layout: 'vbox'
									//  ,border: false
									  ,bodyStyle: 'border:1px  solid #fff;border-right:1px  solid #C0C0C0;'
									  ,region: 'center'
									  ,items: [{
									   xtype: 'fieldcontainer' 
									  ,layout: {type: 'hbox', align: 'middle'}
									  ,items: [
									           {     xtype: 'timefield'
									        	  ,allowBlank: false
									        	  ,width: 175
									        	 ,labelWidth:70
									        	,id:'everyStime'
												  ,labelAlign:'right'
									        	  ,value:'08:30:00'
									        	   ,fieldLabel:getIi18NText("monitor_message_48")
							                      ,invalidText:getIi18NText("time_input_error") //GZE 2016/8/11 时间输入值无效时的提示信息
							                      ,format: 'H:i:s'
							                      ,format: 'H:i:s'
												  ,submitFormat : 'H:i:s'}
									       ]
						     },{
									   xtype: 'fieldcontainer'
									  ,layout: {type: 'hbox', align: 'middle'}
									  ,items: [
												{     xtype: 'timefield'
													  ,width: 175
													  ,labelWidth:70
													  ,labelAlign:'right'
														  ,id:'everyDtime'
													  ,value:'17:30:00'
													   ,fieldLabel:getIi18NText("monitor_message_49")
												    ,invalidText:getIi18NText("time_input_error") //GZE 2016/8/11 时间输入值无效时的提示信息
												    ,format: 'H:i:s'
												    ,format: 'H:i:s'
													  ,submitFormat : 'H:i:s'
												}]

						           },{
						        	   xtype: 'fieldcontainer'
											  ,layout: {type: 'hbox', align: 'middle', pack: 'right'}
											  ,items: [
														{     xtype: "button"
												    	     ,margin: '0 0 0 70'
													    	     ,width: 40
													     //	     ,text: "设置"
													     	    	 ,text: getIi18NText("setting")
													     	      ,listeners: {
													     	    	  click:function($this){
													     	    		  changeData(1);
													     	    	  }
													     	      }
														}]
						           }]
					     },{
		                       xtype: 'panel'
							  ,region: 'east'
							  ,border: false
							  ,width: 205
							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
							  ,items: [
										{
											 allowBlank: false
											 ,margin: '0 0 0 10'
											 ,width: 130
						                      ,xtype: 'combo'
						                     ,id:'everyCom'
						                    	 ,labelWidth:60
												  ,labelAlign:'right'
													  ,fieldLabel:getIi18NText("monitor_message_50") 
						                    ,value:false
						                      ,editable: false
						                      ,store: [[true,getIi18NText("monitor_message_51")],[false, getIi18NText("monitor_message_52")]]
										},
							           	{
							    	      xtype: "button"
							    	     ,margin: '3'
							    	     ,width: 40
							     	  //   ,text: "设置"
							     	    	 ,text: getIi18NText("setting")
							     	       ,listeners: {
								     	    	  click:function($this){
								     	    		  changeData(2);
								     	    	  }
								     	      }
							     	    	
									   }
							     ]
						 }]
		}]
});
    }
    function changeData(stype){
    	var store = [];
  	    var iso=Ext.getCmp("everyCom").getValue();
  	    var Ebtime=Ext.getCmp("everyStime").getValue();
  	    var Eetime=Ext.getCmp("everyDtime").getValue();
  	    var berror=Ext.getCmp("everyStime").getErrors();
  	    var eerror=Ext.getCmp("everyDtime").getErrors();
  	    if((berror==null||berror=='')&&(eerror==null||eerror=='')){ //检查输入框是否有问题
  	    	if(stype==1){//只设置时间stype为1，只设置禁用stype为2
  	    		datastore.each(function(r){
  	    			r.set("btime",  timeRenderFn(Ebtime));
  	    			r.set("etime",  timeRenderFn(Eetime));
  	    			r.set("isopen",  true);
  	    		});
  	    	}else if(stype==2){
  	    		datastore.each(function(r){
  	    			r.set("isopen", (iso== true));
  	    		});
  	    	}
  	    }
  	  everyTimerWinow.close();
    }

    shutdownFn = function(tid){
    	    isFreshing = false;
    	    if(typeof(tid) != "object"){
    	    	globalTid = tid;
	    	    var title = getIi18NText("monitor_message_40");
	    	    tplshutItem = Ext.get(viewTable_prefix+globalTid).parent('ul');
	    	    if(viewTimerWinow && viewTimerWinow.isPanel){
		   	        //show
		    		//viewTimerWinow.setTitle(title);
	    		    viewTimerWinow.show(tplshutItem);
		    		return;
		    	}
    	    }else if(viewTimerWinow && viewTimerWinow.isPanel){
    		    viewTimerWinow.show();
	    		return;
	    	}
	    	 
    	    var timergrid = timerGrid();
    	    viewTimerWinow = Ext.create('Ext.window.Window',{
				  title: getIi18NText('timePlan')
				  ,plain: true
				  ,width: 500
				  ,height: 330
				  ,border: false
				  ,closable: true
				  ,resizable:false
               ,margin: 0
               ,padding: 0
				  ,border: false
				  ,modal: true
				  ,closeAction: 'hide'
				  ,constrain: true
				  ,items: [
				           {
			        	    xtype:'tabpanel',
			        	    id : 'tabpanel1',
		        		    width: '100%',
		        		    margin :'0 0 0 0',
		        		    height: '100%',
		        		    border:false,
		        		 //   renderTo: document.body,
		        		    items: [{
		        		        title: getIi18NText('remoteShutdownTerminal'),
		        		        id : 'panelday',
		        		        width: '100%',
			        		    margin :'0 0 0 0',
			        		    height: '100%',
			        		    border:false,
		        		        items: [{
								    xtype: 'panel'
									    ,width: '100%'
									    ,height: 220
									    ,border: 0
									    ,items: [timergrid]
								 },{
									     xtype: 'panel'
									    ,width: '100%'
									    ,border: 0
									    ,layout: 'hbox'
									    	
								        ,items:[{
								        	 xtype: 'panel'
								        	,width: '15%'
								        	,border: 0
								        	,items: [{
								        	        anchor: '0 0',
								    	            xtype: "button"
								    	            ,margin: '0 0 0 3px'
										    	    ,text: getIi18NText("monitor_message_41")
										    	    ,id: 'nowcloseBtn'
										    	    ,handler: function(){
										    	    	if(recordIds.getCount() == 0){
										    	    		sendOrder(globalTid,4, getIi18NText("monitor_message_41"));
										    	    	}else{
										    	    		var tides = [];
										    	    		sendOrder(tides,4, getIi18NText("monitor_message_41"));
										    	    	}
										    	    }
										      }]
								        },{//GZE
						            	       xtype: 'button'
						            	       ,width: '15%'
						            	    	,text:getIi18NText("everySet")
										       ,checked: false
										       ,inputValue: 1
										       ,id: 'everyCheckbox'
								        	   ,listeners: {
								        		   click:function($this){
								        			   if(everyTimerWinow && everyTimerWinow.isPanel){
								        				   everyTimerWinow.destroy();
								        			   }
								        			   defaultMenuItem();
								        			   //验证是否
								        			   var yan=datastore.getAt(0).get("btime");
								        			   var yflag=true;
											        	var ynum=datastore.getCount();
											        	for(var i=0;i<ynum;i++){
											        		if(yan != datastore.getAt(i).get("btime")){
											        			yflag=false;
											        			break;
											        		}
											        	}
											        	 var yean=datastore.getAt(0).get("etime");
									        			   var yeflag=true;
												        	for(var i=0;i<ynum;i++){
												        		if(yean != datastore.getAt(i).get("etime")){
												        			yeflag=false;
												        			break;
												        		}
												        	}
								        			   if(yflag&&yeflag){
								        				  Ext.getCmp("everyCom").setValue(datastore.getAt(0).get("isopen"));
								        			  	    Ext.getCmp("everyStime").setValue(datastore.getAt(0).get("btime"));
								        			  	    Ext.getCmp("everyDtime").setValue(datastore.getAt(0).get("etime"));
								        			   }
								        			   rowEditing.cancelEdit();//关掉正在编辑的行
								        			   everyTimerWinow.show();
								        		   }
								        	   }
								        },{
								        	 xtype: 'panel'
								        	,border: 0
								        	,width: '70%'
								        	,layout: {type: 'hbox', pack:'end'}
								        	,items: [{
								        		   xtype: 'displayfield'
								        		   ,id: 'displayTextField'
								        		  ,value:'<font color="gray" size="2px">('+getIi18NText("monitor_message_42")+')&nbsp;</font>'
								        	},
								        		 {
										    	     anchor: '0 100',
										    	      xtype: "button"
										    	     ,margin: '3'
										    	     ,width: 75
										    	     ,id: 'nowFinshedBtn'
										    	     ,iconCls: 'pback_finish_IconCls'
										     	     ,text: getIi18NText("monitor_message_31")
										     	     ,handler: timerCompleteFn
										        }/*,{
										    	     anchor: '0 300',
										    	     xtype: "button"
										    	     ,width: 70
										    	     ,id: 'nowCancelBtn'
										    	     ,margin: '3'
										    	     ,iconCls: 'pback_reset_IconCls'
											         ,text: getIi18NText("monitor_message_32")
											         ,handler: timerHideWinFn
											     }*/
								        	]
								        }]
								 }]
		        		    	},{
		        		    		title: getIi18NText('volPlan'),
			        		    //    id : 'plday',
			        		        width: '100%',
				        		    margin :'0 0 0 0',
				        		    height: '100%',
				        		    border : false,
			        		        items: [{
			        					xtype:'panel',
			        					height:30,
			        					width:'100%',
			        					margin : '5 0 0 10',
			        					border : false,
			        					layout:'hbox',
			        					items :[{
			        						xtype : 'slider',
			        						fieldLabel : getIi18NText('defVol'),
			        						width : 200,
			        						labelWidth : 60,
			        						id : 'ra_slider',
			        						margin : '2 0 0 0',
			        						value : 0,
			        						// 增减幅度
			        						increment : 25,
			        						minValue : 0,
			        						maxValue : 100,
			        						plugins:new Ext.slider.Tip({
			        							getText:function(thumb){
			        								if(thumb.value=="0"){
			        									return getIi18NText('wu')
			        								}
			        								if(thumb.value=="25"){
			        									return getIi18NText('weak')
			        								}
			        								if(thumb.value=="50"){
			        									return getIi18NText('middle')
			        								}
			        								if(thumb.value=="75"){
			        									return getIi18NText('higher')
			        								}
			        								if(thumb.value=="100"){
			        									return getIi18NText('highest')
			        								}
			        							}
			        						})
			        					}]
			        				},{
			  		                  xtype: 'panel'
			  		             //    ,id: panelId
			  					     ,layout: 'border'
			  						 ,margin: 1 
			  						 ,width:  '100%'
			  						 ,height: 60
			  						 ,border:false
			  						 ,baseCls: 'timeBorderCls'
			  						 ,items: [{
			  		                               width: 70
			  									  ,region: 'west'
			  									  ,border: false
			  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
			  									  ,items: [{
			  										  xtype: 'checkbox'
			  										  ,boxLabel: getIi18NText("time1")
			  										  ,id: 'yinshi1'
			  									  }]
			  						         },{
			  								       xtype: 'panel'
			  									  ,layout: 'vbox'
			  									  ,border: false
			  									  ,region: 'center'
			  									  ,items: [{
				  									   xtype: 'fieldcontainer' 
				  									  ,layout: {type: 'hbox', align: 'middle'}
				  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
				  									  ,items: [{
				  											  xtype:'label'
				  											 ,text: getIi18NText("item_start")
				  											 ,margin: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 23
				  											 ,id:'yin_s1h'
				  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  											 ,text: getIi18NText("hour")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 59
				  											  ,id:'yin_s1m'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  										 	 ,text: getIi18NText("minute")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 30
				  									   }]
			  									  },{
				  									   xtype: 'fieldcontainer'
				  									  ,layout: {type: 'hbox', align: 'middle'}
				  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
				  									  ,items: [{
				  											  xtype:'label'
				  											 ,text: getIi18NText("item_end")
				  											 ,margin: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 23
				  											  ,value: 23
				  											  ,id:'yin_e1h'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  											 ,text: getIi18NText("hour")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 59
				  											  ,value: 59
				  											  ,id:'yin_e1m'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  										 	 ,text: getIi18NText("minute")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 30
				  									   }]
			  						           }]
			  					     },{
			  		                       xtype: 'panel'
			  							  ,region: 'east'
			  							  ,border: false
			  							  ,width: 190
			  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
			  							  ,items: [{
														xtype : 'slider',
														width : 170,
														id : 'ra_slder1',
														margin : '2 0 0 0',
														value : 0,
														// 增减幅度
														increment : 25,
														minValue : 0,
														maxValue : 100,
														plugins:new Ext.slider.Tip({
						        							getText:function(thumb){
						        								if(thumb.value=="0"){
						        									return getIi18NText('wu')
						        								}
						        								if(thumb.value=="25"){
						        									return getIi18NText('weak')
						        								}
						        								if(thumb.value=="50"){
						        									return getIi18NText('middle')
						        								}
						        								if(thumb.value=="75"){
						        									return getIi18NText('higher')
						        								}
						        								if(thumb.value=="100"){
						        									return getIi18NText('highest')
						        								}
						        							}
						        						})
													}]
			  						 	}]
			        				},{
				  		                  xtype: 'panel'
							  		             //    ,id: panelId
							  					     ,layout: 'border'
							  						 ,margin: 1 
							  						 ,width:  '100%'
							  						 ,height: 60
							  						 ,border:false
							  						,baseCls: 'timeBorderCls'
							  						 ,items: [{
							  		                               width: 70
							  									  ,region: 'west'
							  									  ,border: false
							  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
							  									  ,items: [{
							  										  xtype: 'checkbox'
							  										  ,boxLabel: getIi18NText("time2")
							  										   ,id: 'yinshi2'
							  									  }]
							  						         },{
							  								       xtype: 'panel'
							  									  ,layout: 'vbox'
							  									  ,border: false
							  									  ,region: 'center'
							  									  ,items: [{
								  									   xtype: 'fieldcontainer' 
								  									  ,layout: {type: 'hbox', align: 'middle'}
								  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
								  									  ,items: [{
								  											  xtype:'label'
								  											 ,text: getIi18NText("item_start")
								  											 ,margin: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 23
								  											 //,itemId: 'begin_H'
								  											  ,id:'yin_s2h'
								  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  											 ,text: getIi18NText("hour")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 59
								  											  //,itemId: 'begin_M'
								  											  ,id:'yin_s2m'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  										 	 ,text: getIi18NText("minute")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 30
								  									   }]
							  									  },{
								  									   xtype: 'fieldcontainer'
								  									  ,layout: {type: 'hbox', align: 'middle'}
								  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
								  									  ,items: [{
								  											  xtype:'label'
								  											 ,text: getIi18NText("item_end")
								  											 ,margin: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 23
								  											  ,value: 23
								  											  //,itemId: 'end_H'
								  											  ,id:'yin_e2h'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  											 ,text: getIi18NText("hour")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 59
								  											  ,value: 59
								  											  //,itemId: 'end_M'
								  											  ,id:'yin_e2m'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  										 	 ,text: getIi18NText("minute")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 30
								  									   }]
							  						           }]
							  					     },{
							  		                       xtype: 'panel'
							  							  ,region: 'east'
							  							  ,border: false
							  							  ,width: 190
							  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
							  							  ,items: [{
																		xtype : 'slider',
																		width : 170,
																		id : 'ra_slder2',
																		margin : '2 0 0 0',
																		value : 0,
																		// 增减幅度
																		increment : 25,
																		minValue : 0,
																		maxValue : 100,
																		plugins:new Ext.slider.Tip({
										        							getText:function(thumb){
										        								if(thumb.value=="0"){
										        									return getIi18NText('wu')
										        								}
										        								if(thumb.value=="25"){
										        									return getIi18NText('weak')
										        								}
										        								if(thumb.value=="50"){
										        									return getIi18NText('middle')
										        								}
										        								if(thumb.value=="75"){
										        									return getIi18NText('higher')
										        								}
										        								if(thumb.value=="100"){
										        									return getIi18NText('highest')
										        								}
										        							}
										        						})
																	}]
							  						 	}]
							        				},{
								  		                  xtype: 'panel'
											  		             //    ,id: panelId
											  					     ,layout: 'border'
											  						 ,margin: 1 
											  						 ,width:  '100%'
											  						 ,height: 60
											  						 ,border:false
											  						 ,items: [{
											  		                               width: 70
											  									  ,region: 'west'
											  									  ,border: false
											  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
											  									  ,items: [{
											  										  xtype: 'checkbox'
											  										  ,boxLabel: getIi18NText("time3")
											  											,id: 'yinshi3'
											  									  }]
											  						         },{
											  								       xtype: 'panel'
											  									  ,layout: 'vbox'
											  									  ,border: false
											  									  ,region: 'center'
											  									  ,items: [{
												  									   xtype: 'fieldcontainer' 
												  									  ,layout: {type: 'hbox', align: 'middle'}
												  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
												  									  ,items: [{
												  											  xtype:'label'
												  											 ,text: getIi18NText("item_start")
												  											 ,margin: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 23
												  											 //,itemId: 'begin_H'
												  											  ,id:'yin_s3h'
												  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  											 ,text: getIi18NText("hour")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 59
												  											  //,itemId: 'begin_M'
												  											  ,id:'yin_s3m'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  										 	 ,text: getIi18NText("minute")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 30
												  									   }]
											  									  },{
												  									   xtype: 'fieldcontainer'
												  									  ,layout: {type: 'hbox', align: 'middle'}
												  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
												  									  ,items: [{
												  											  xtype:'label'
												  											 ,text: getIi18NText("item_end")
												  											 ,margin: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 23
												  											  ,value: 23
												  											  //,itemId: 'end_H'
												  											  ,id:'yin_e3h'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  											 ,text: getIi18NText("hour")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 59
												  											  ,value: 59
												  											  //,itemId: 'end_M'
												  											  ,id:'yin_e3m'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  										 	 ,text: getIi18NText("minute")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 30
												  									   }]
											  						           }]
											  					     },{
											  		                       xtype: 'panel'
											  							  ,region: 'east'
											  							  ,border: false
											  							  ,width: 190
											  						//	  ,margin : '0 20 0 0'
											  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
											  							  ,items: [{
																						xtype : 'slider',
																			//			fieldLabel : getIi18NText("modulation"),
																						width : 170,
																					//	labelWidth : 60,
																						id : 'ra_slder3',
																						margin : '2 0 0 0',
																						value : 0,
																						// 增减幅度
																						increment : 25,
																						minValue : 0,
																						maxValue : 100,
																						plugins:new Ext.slider.Tip({
														        							getText:function(thumb){
														        								if(thumb.value=="0"){
														        									return getIi18NText('wu')
														        								}
														        								if(thumb.value=="25"){
														        									return getIi18NText('weak')
														        								}
														        								if(thumb.value=="50"){
														        									return getIi18NText('middle')
														        								}
														        								if(thumb.value=="75"){
														        									return getIi18NText('higher')
														        								}
														        								if(thumb.value=="100"){
														        									return getIi18NText('highest')
														        								}
														        							}
														        						})
																			/*			listeners : {
																							changecomplete : function(
																									$this, newvalue) {
																								Ext.getCmp('rate_nuer3').setValue(newvalue);
																							}
																						}*/
																					}
											  			/*				  ,{
																						xtype : 'numberfield',
																						maxValue : 100,
																						minValue : 0,
																						negativeText:getIi18NText('number_input_error'),//GZE 2016/8/11  输入值为负数时的提示消息
																						value : 0,
																						// 是否允许输入数值
																						editable : true,
																						margin : '0 10 0 3',
																						// 增减幅度
																						step : 1,
																						id : 'rate_nuer3',
																						allowBlank : false,
																						blankText : getIi18NText('chooseProportionTip'),
																						// 是否允许输入小数
																						allowDecimals : false,
																						width : 60,
																						listeners : {
																							change : function($this,newValue, oldValue,eOpts) {
																								if (newValue>100||newValue<0) {
																							//		Ext.getCmp('confirmButton').setDisabled(true);
																								}
																								else if ($this.isValid()) {
																							//		Ext.getCmp('confirmButton').setDisabled(false);
																									Ext.getCmp('ra_slder3').setValue(newValue);
																								}
																							}
																						}
																					}*/
											  							  ]
											  						 	}]
											        				},{
															        	 xtype: 'panel'
															        	 ,border: 0
															        	 ,width: '100%'
															        	 ,height:30
															        	 ,layout: {type: 'hbox', pack:'end'}
															        	,items: [{
															        		xtype: 'displayfield'
															        	    ,id: 'volTextField'
															        	    ,value:'<font color="gray" size="2px">('+getIi18NText("chooseTime")+')&nbsp;</font>'
															        	},{
																	    	     anchor: '0 100',
																	    	      xtype: "button"
																	    	     ,margin: '3'
																	    	     ,width: 75
																	    	     ,id: 'yinBtn'
																	    	     ,iconCls: 'pback_finish_IconCls'
																	     	     ,text: getIi18NText("monitor_message_31")
																	     	     ,handler: function(){
																	     	    	var initDate = new Date(1970,1,1);
																	     	    	var timesArray = [];  //存储各个时段的时间以便比较
																	     	    	var btns=Ext.getCmp("yinBtn");
																	     	    	
																	     	    	var store = [];
//																	     	    	store.push({moy: Ext.getCmp('rate_nuber').getValue()});//设置默认音量
																	     	    	store.push({moy: Ext.getCmp('ra_slider').getValue()});//设置默认音量
																	     	    	initDate.setHours(Ext.getCmp('yin_s1h').getValue(), Ext.getCmp('yin_s1m').getValue(), 1);
																	     	    	var s1=Ext.Date.format(initDate,"H:i:s");
																	     	    	var be = {b: 0, e: 0}; 
																	     	    	be.b=initDate.getTime();
																	     	    	initDate.setHours(Ext.getCmp('yin_e1h').getValue(), Ext.getCmp('yin_e1m').getValue(), 0);
																	     	    	var e1=Ext.Date.format(initDate,"H:i:s");
																	     	    	be.e=initDate.getTime();
																	     	    	if(Ext.getCmp('yinshi1').getValue()){
																	     	    		timesArray.push(be);
																	     	    	}
																	     	    	initDate.setHours(Ext.getCmp('yin_s2h').getValue(), Ext.getCmp('yin_s2m').getValue(), 1);
																	     	    	var s2=Ext.Date.format(initDate,"H:i:s");
																	     	    	var be = {b: 0, e: 0}; 
																	     	    	be.b=initDate.getTime();
																	     	    	initDate.setHours(Ext.getCmp('yin_e2h').getValue(), Ext.getCmp('yin_e2m').getValue(), 0);
																	     	    	var e2=Ext.Date.format(initDate,"H:i:s");
																	     	    	be.e=initDate.getTime();
																	     	    	if(Ext.getCmp('yinshi2').getValue()){
																	     	    		timesArray.push(be);
																	     	    	}
																	     	    	initDate.setHours(Ext.getCmp('yin_s3h').getValue(), Ext.getCmp('yin_s3m').getValue(), 1);
																	     	    	var s3=Ext.Date.format(initDate,"H:i:s");
																	     	    	var be = {b: 0, e: 0}; 
																	     	    	be.b=initDate.getTime();
																	     	    	initDate.setHours(Ext.getCmp('yin_e3h').getValue(), Ext.getCmp('yin_e3m').getValue(), 0);
																	     	    	var e3=Ext.Date.format(initDate,"H:i:s");
																	     	    	be.e=initDate.getTime();
																	     	    	if(Ext.getCmp('yinshi3').getValue()){
																		     	    	timesArray.push(be);
																	     	    	}
																	     	//    	console.info("时段"+timesArray.length)
																	     	    	  for ( var i = 0; i < timesArray.length; i++ ) {
																	     				    var iBe = timesArray[i];
																	     				   if(iBe.b >= iBe.e){
																			     	    		 showTip(btns, getIi18NText("playTimeErrWarming02"));
																			 			    	 return false;
																			 			     }
																	     				    for ( var k = 0; k < timesArray.length; k++) {
																	     				    	if(i!=k){
																	     				    		var kBe = timesArray[k];
																	     				    		if(   !(iBe.e <= kBe.b || kBe.e <= iBe.b) ){
																	     				    			showTip(btns, getIi18NText("playTimeErrWarming02"));
																	     				    			return false;
																	     				    		}
																	     				    	}
																	     					}
																	     			  }
																	     	    	store.push({yin: Ext.getCmp('ra_slder1').getValue(), 
																	     	    		b:s1,
																	     	    		e:e1,
																	     	    		o: Ext.getCmp('yinshi1').getValue()});
																	     	    	store.push({yin: Ext.getCmp('ra_slder2').getValue(), 
																	     	    		b:s2,
																	     	    		e:e2,
																	     	    		o: Ext.getCmp('yinshi2').getValue()});
																	     	    	store.push({yin: Ext.getCmp('ra_slder3').getValue(), 
																	     	    		b:s3,
																	     	    		e:e3,
																	     	    		o: Ext.getCmp('yinshi3').getValue()});
																	   //  			console.info("数据是"+Ext.JSON.encode(store));
																	     			if(!typeof(globalTid) == "number" || datastore == null){
																	        	    	return;
																	        	    }
																	               	var terminalIds = globalTid;
																	               	if(recordIds.getCount() > 0){
																	               		var tmpId = [];
																	    				recordIds.each(function(val, idx, len){
																	    					tmpId.push(val.get("terId"));
																	    				});
																	    				terminalIds = tmpId.join(',');
																	        		}
																	               	enableVolBtn(false);
																	               	if(terminalIds == null) return;
																	     	    	Ext.Ajax.request({
																	     	    		url: 'terminal!saveTerminalVol.action'
																	     	    		,method: 'post'
																	     	    		,timeout:'120000'//增加超时时间GZE
																	     	    		,params: {id: terminalIds, yt: Ext.JSON.encode(store)}
																           				,callback: function(opt, success, res){
																	           				var result = showResult(success,res);
																	           				enableVolBtn(true);
																	           				if(result == false) return; 
																           					Ext.example.msg(getIi18NText('operationResultTip'),getIi18NText('volSuccess'),function(){
																           						viewTimerWinow.close();
																           					});
																	           				}
																	     	    	});
																	     	     }
																	        }]
															        }]
		        		    	},{
		        		    		title: getIi18NText('ligAdjust'),
			        		//        id : 'paneldy',
			        		        width: '100%',
				        		    margin :'0 0 0 0',
				        		    height: '100%',
				        		    border:false,
			        		        items: [{
			        					xtype:'panel',
			        					height:30,
			        					width:'100%',
//			        					margin : (getIi18NText('confirm') == "OK") ? '0 0 0 32':'0 0 0 45',
			        					margin : '5 0 0 10',
			        					border : false,
			        					layout:'hbox',
			        					items :[{
			        						xtype : 'slider',
			        						fieldLabel : getIi18NText('deflig'),
			        						width : 200,
			        						labelWidth : 60,
			        						id : '2ra_slider',
			        						margin : '2 0 0 0',
			        						value : 0,
			        						// 增减幅度
			        						increment : 25,
			        						minValue : 0,
			        						maxValue : 100,
			        						plugins:new Ext.slider.Tip({
			        							getText:function(thumb){
			        								if(thumb.value=="0"){
			        									return getIi18NText('wu')
			        								}
			        								if(thumb.value=="25"){
			        									return getIi18NText('weak')
			        								}
			        								if(thumb.value=="50"){
			        									return getIi18NText('middle')
			        								}
			        								if(thumb.value=="75"){
			        									return getIi18NText('higher')
			        								}
			        								if(thumb.value=="100"){
			        									return getIi18NText('highest')
			        								}
			        							}
			        						})
			        					}]
			        				},{
			  		                  xtype: 'panel'
			  		             //    ,id: panelId
			  					     ,layout: 'border'
			  						 ,margin: 1 
			  						 ,width:  '100%'
			  						 ,height: 60
			  						 ,border:false
			  						 ,baseCls: 'timeBorderCls'
			  					//	 ,bodyCls: 'timeBorderCls'
			  						 ,items: [{
			  		                               width: 70
			  									  ,region: 'west'
			  									  ,border: false
			  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
			  									  ,items: [{
			  										  xtype: 'checkbox'
			  										  ,boxLabel: getIi18NText("time1")
							    	//	  ,checked: true
			  									//	  ,inputValue: 1
			  										   ,id: 'yinshi4'
							    		//  ,id: 'autoFreshCheckbox'
			  									  }]
			  						         },{
			  								       xtype: 'panel'
			  									  ,layout: 'vbox'
			  									  ,border: false
			  									  ,region: 'center'
			  									  ,items: [{
				  									   xtype: 'fieldcontainer' 
				  									  ,layout: {type: 'hbox', align: 'middle'}
				  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
				  									  ,items: [{
				  											  xtype:'label'
				  											 ,text: getIi18NText("item_start")
				  											 ,margin: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 23
				  											 //,itemId: 'begin_H'
				  											  ,id:'liang_s1h'
				  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  											 ,text: getIi18NText("hour")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 59
				  											  //,itemId: 'begin_M'
				  											  ,id:'liang_s1m'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  										 	 ,text: getIi18NText("minute")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 30
				  									   }]
			  									  },{
				  									   xtype: 'fieldcontainer'
				  									  ,layout: {type: 'hbox', align: 'middle'}
				  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
				  									  ,items: [{
				  											  xtype:'label'
				  											 ,text: getIi18NText("item_end")
				  											 ,margin: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 23
				  											  ,value: 23
				  											  //,itemId: 'end_H'
				  											  ,id:'liang_e1h'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  											 ,text: getIi18NText("hour")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 40
				  									   },{
				  											  maxValue: 59
				  											  ,value: 59
				  											  //,itemId: 'end_M'
				  											  ,id:'liang_e1m'
				  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
				  									   },{
				  											  xtype:'label'
				  										 	 ,text: getIi18NText("minute")
				  											 ,padding: '0 2 0 3'
				  											 ,width: 30
				  									   }]
			  						           }]
			  					     },{
			  		                       xtype: 'panel'
			  							  ,region: 'east'
			  							  ,border: false
			  							  ,width: 190
			  						//	  ,margin : '0 20 0 0'
			  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
			  							  ,items: [{
														xtype : 'slider',
											//			fieldLabel : getIi18NText("modulation"),
														width : 170,
													//	labelWidth : 60,
														id : 'ra_slder4',
														margin : '2 0 0 0',
														value : 0,
														// 增减幅度
														increment : 25,
														minValue : 0,
														maxValue : 100,
														plugins:new Ext.slider.Tip({
						        							getText:function(thumb){
						        								if(thumb.value=="0"){
						        									return getIi18NText('wu')
						        								}
						        								if(thumb.value=="25"){
						        									return getIi18NText('weak')
						        								}
						        								if(thumb.value=="50"){
						        									return getIi18NText('middle')
						        								}
						        								if(thumb.value=="75"){
						        									return getIi18NText('higher')
						        								}
						        								if(thumb.value=="100"){
						        									return getIi18NText('highest')
						        								}
						        							}
						        						})
													}]
			  						 	}]
			        				},{
				  		                  xtype: 'panel'
							  		             //    ,id: panelId
							  					     ,layout: 'border'
							  						 ,margin: 1 
							  						 ,width:  '100%'
							  						 ,height: 60
							  						 ,border:false
							  						,baseCls: 'timeBorderCls'
							  					//	 ,baseCls: 'timesMenu'
							  					//	 ,bodyCls: 'timePieceBackCls'
							  						 ,items: [{
							  		                               width: 70
							  									  ,region: 'west'
							  									  ,border: false
							  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
							  									  ,items: [{
							  										  xtype: 'checkbox'
							  										  ,boxLabel: getIi18NText("time2")
											    	//	  ,checked: true
							  										  //,inputValue: 1
							  										  ,id: 'yinshi5'
											    		//  ,id: 'autoFreshCheckbox'
							  									  }]
							  						         },{
							  								       xtype: 'panel'
							  									  ,layout: 'vbox'
							  									  ,border: false
							  									  ,region: 'center'
							  									  ,items: [{
								  									   xtype: 'fieldcontainer' 
								  									  ,layout: {type: 'hbox', align: 'middle'}
								  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
								  									  ,items: [{
								  											  xtype:'label'
								  											 ,text: getIi18NText("item_start")
								  											 ,margin: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 23
								  											 //,itemId: 'begin_H'
								  											  ,id:'liang_s2h'
								  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  											 ,text: getIi18NText("hour")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 59
								  											  //,itemId: 'begin_M'
								  											  ,id:'liang_s2m'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  										 	 ,text: getIi18NText("minute")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 30
								  									   }]
							  									  },{
								  									   xtype: 'fieldcontainer'
								  									  ,layout: {type: 'hbox', align: 'middle'}
								  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
								  									  ,items: [{
								  											  xtype:'label'
								  											 ,text: getIi18NText("item_end")
								  											 ,margin: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 23
								  											  ,value: 23
								  											  //,itemId: 'end_H'
								  											  ,id:'liang_e2h'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  											 ,text: getIi18NText("hour")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 40
								  									   },{
								  											  maxValue: 59
								  											  ,value: 59
								  											  //,itemId: 'end_M'
								  											  ,id:'liang_e2m'
								  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
								  									   },{
								  											  xtype:'label'
								  										 	 ,text: getIi18NText("minute")
								  											 ,padding: '0 2 0 3'
								  											 ,width: 30
								  									   }]
							  						           }]
							  					     },{
							  		                       xtype: 'panel'
							  							  ,region: 'east'
							  							  ,border: false
							  							  ,width: 190
							  						//	  ,margin : '0 20 0 0'
							  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
							  							  ,items: [{
																		xtype : 'slider',
															//			fieldLabel : getIi18NText("modulation"),
																		width : 170,
																	//	labelWidth : 60,
																		id : 'ra_slder5',
																		margin : '2 0 0 0',
																		value : 0,
																		// 增减幅度
																		increment : 25,
																		minValue : 0,
																		maxValue : 100,
																		plugins:new Ext.slider.Tip({
										        							getText:function(thumb){
										        								if(thumb.value=="0"){
										        									return getIi18NText('wu')
										        								}
										        								if(thumb.value=="25"){
										        									return getIi18NText('weak')
										        								}
										        								if(thumb.value=="50"){
										        									return getIi18NText('middle')
										        								}
										        								if(thumb.value=="75"){
										        									return getIi18NText('higher')
										        								}
										        								if(thumb.value=="100"){
										        									return getIi18NText('highest')
										        								}
										        							}
										        						})
																	}]
							  						 	}]
							        				},{
								  		                  xtype: 'panel'
											  		             //    ,id: panelId
											  					     ,layout: 'border'
											  						 ,margin: 1 
											  						 ,width:  '100%'
											  						 ,height: 60
											  						 ,border:false
											  					//	 ,baseCls: 'timesMenu'
											  					//	 ,bodyCls: 'timePieceBackCls'
											  						 ,items: [{
											  		                               width: 70
											  									  ,region: 'west'
											  									  ,border: false
											  									  ,layout: {type: 'hbox', align: 'middle', pack: 'center'}
											  									  ,items: [{
											  										  xtype: 'checkbox'
											  										  ,boxLabel: getIi18NText("time3")
															    	//	  ,checked: true
											  										//  ,inputValue: 1
											  											,id: 'yinshi6'
															    		//  ,id: 'autoFreshCheckbox'
											  									  }]
											  						         },{
											  								       xtype: 'panel'
											  									  ,layout: 'vbox'
											  									  ,border: false
											  									  ,region: 'center'
											  									  ,items: [{
												  									   xtype: 'fieldcontainer' 
												  									  ,layout: {type: 'hbox', align: 'middle'}
												  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
												  									  ,items: [{
												  											  xtype:'label'
												  											 ,text: getIi18NText("item_start")
												  											 ,margin: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 23
												  											 //,itemId: 'begin_H'
												  											  ,id:'liang_s3h'
												  										     ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  											 ,text: getIi18NText("hour")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 59
												  											  //,itemId: 'begin_M'
												  											  ,id:'liang_s3m'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  										 	 ,text: getIi18NText("minute")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 30
												  									   }]
											  									  },{
												  									   xtype: 'fieldcontainer'
												  									  ,layout: {type: 'hbox', align: 'middle'}
												  									  ,defaults: {xtype: 'numberfield', width: 55,maxLength:2,minValue: 0,enforceMaxLength: true,allowBlank: false,value: 0,selectOnFocus: true}
												  									  ,items: [{
												  											  xtype:'label'
												  											 ,text: getIi18NText("item_end")
												  											 ,margin: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 23
												  											  ,value: 23
												  											  //,itemId: 'end_H'
												  											  ,id:'liang_e3h'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  											 ,text: getIi18NText("hour")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 40
												  									   },{
												  											  maxValue: 59
												  											  ,value: 59
												  											  //,itemId: 'end_M'
												  											  ,id:'liang_e3m'
												  											  ,negativeText:getIi18NText('number_input_error01')//GZE 2016/8/11  输入值为负数时的提示消息
												  									   },{
												  											  xtype:'label'
												  										 	 ,text: getIi18NText("minute")
												  											 ,padding: '0 2 0 3'
												  											 ,width: 30
												  									   }]
											  						           }]
											  					     },{
											  		                       xtype: 'panel'
											  							  ,region: 'east'
											  							  ,border: false
											  							  ,width: 190
											  						//	  ,margin : '0 20 0 0'
											  							  ,layout: {type: 'hbox', align: 'middle', pack: 'left'}
											  							  ,items: [{
																						xtype : 'slider',
																						width : 170,
																						id : 'ra_slder6',
																						margin : '2 0 0 0',
																						value : 0,
																						// 增减幅度
																						increment : 25,
																						minValue : 0,
																						maxValue : 100,
																						plugins:new Ext.slider.Tip({
														        							getText:function(thumb){
														        								if(thumb.value=="0"){
														        									return getIi18NText('wu')
														        								}
														        								if(thumb.value=="25"){
														        									return getIi18NText('weak')
														        								}
														        								if(thumb.value=="50"){
														        									return getIi18NText('middle')
														        								}
														        								if(thumb.value=="75"){
														        									return getIi18NText('higher')
														        								}
														        								if(thumb.value=="100"){
														        									return getIi18NText('highest')
														        								}
														        							}
														        						})
																					}]
											  						 	}]
											        				},{
															        	 xtype: 'panel'
															        	 ,border: 0
															        	 ,width: '100%'
															        	 ,height:30
															        	 ,layout: {type: 'hbox', pack:'end'}
															        	,items: [{
															        			xtype: 'displayfield'
																        	    ,id: 'liangTextField'
																        	    ,value:'<font color="gray" size="2px">('+getIi18NText("chooseTime")+')&nbsp;</font>'
																        	},{
																	    	     anchor: '0 100',
																	    	      xtype: "button"
																	    	     ,margin: '3'
																	    	     ,width: 75
																	    	     ,id: 'liangBtn'
																	    	     ,iconCls: 'pback_finish_IconCls'
																	     	     ,text: getIi18NText("monitor_message_31")
																	     	     ,handler: function(){
																		     	    	var initDate = new Date(1970,1,1);
																		     	    	var timesArray = [];  //存储各个时段的时间以便比较
																		     	    	var btns=Ext.getCmp("liangBtn");
																		     	    	var store = [];
//																		     	    	store.push({mol: Ext.getCmp('2rate_nuber').getValue()});//设置默认亮度
																		     	    	store.push({mol: Ext.getCmp('2ra_slider').getValue()});//设置默认亮度
																		     	    	initDate.setHours(Ext.getCmp('liang_s1h').getValue(), Ext.getCmp('liang_s1m').getValue(), 1);
																		     	    	var s1=Ext.Date.format(initDate,"H:i:s");
																		     	    	var be = {b: 0, e: 0}; 
																		     	    	be.b=initDate.getTime();
																		     	    	initDate.setHours(Ext.getCmp('liang_e1h').getValue(), Ext.getCmp('liang_e1m').getValue(), 0);
																		     	    	var e1=Ext.Date.format(initDate,"H:i:s");
																		     	    	be.e=initDate.getTime();
																		     	    	if(Ext.getCmp('yinshi4').getValue()){
																		     	    		timesArray.push(be);
																		     	    	}
																		     	    	initDate.setHours(Ext.getCmp('liang_s2h').getValue(), Ext.getCmp('liang_s2m').getValue(), 1);
																		     	    	var s2=Ext.Date.format(initDate,"H:i:s");
																		     	    	var be = {b: 0, e: 0}; 
																		     	    	be.b=initDate.getTime();
																		     	    	initDate.setHours(Ext.getCmp('liang_e2h').getValue(), Ext.getCmp('liang_e2m').getValue(), 0);
																		     	    	var e2=Ext.Date.format(initDate,"H:i:s");
																			     	   	be.e=initDate.getTime();
																		     	    	if(Ext.getCmp('yinshi5').getValue()){
																		     	    		timesArray.push(be);
																		     	    	}
																		     	    	initDate.setHours(Ext.getCmp('liang_s3h').getValue(), Ext.getCmp('liang_s3m').getValue(), 1);
																		     	    	var s3=Ext.Date.format(initDate,"H:i:s");
																		     	    	var be = {b: 0, e: 0}; 
																		     	    	be.b=initDate.getTime();
																		     	    	initDate.setHours(Ext.getCmp('liang_e3h').getValue(), Ext.getCmp('liang_e3m').getValue(), 0);
																		     	    	var e3=Ext.Date.format(initDate,"H:i:s");
																			     	   	be.e=initDate.getTime();
																		     	    	if(Ext.getCmp('yinshi6').getValue()){
																		     	    		timesArray.push(be);
																		     	    	}
																		     	   // 	console.info(timesArray.length)
																		     	    	  for ( var i = 0; i < timesArray.length; i++ ) {
																		     				    var iBe = timesArray[i];
																		     				   if(iBe.b >= iBe.e){
																				     	    		 showTip(btns, getIi18NText("playTimeErrWarming02"));
																				 			    	 return false;
																				 			     }
																		     				    for ( var k = 0; k < timesArray.length; k++) {
																		     				    	if(i!=k){
																		     				    		var kBe = timesArray[k];
																		     				    		if(   !(iBe.e <= kBe.b || kBe.e <= iBe.b) ){
																		     				    			showTip(btns, getIi18NText("playTimeErrWarming02"));
																		     				    			return false;
																		     				    		}
																		     				    	}
																		     					}
																		     			  }
																		     	    	store.push({lig: Ext.getCmp('ra_slder4').getValue(), 
																		     	    		b:s1,
																		     	    		e:e1,
																		     	    		o: Ext.getCmp('yinshi4').getValue()});
																		     	    	store.push({lig: Ext.getCmp('ra_slder5').getValue(), 
																		     	    		b:s2,
																		     	    		e:e2,
																		     	    		o: Ext.getCmp('yinshi5').getValue()});
																		     	    	store.push({lig: Ext.getCmp('ra_slder6').getValue(), 
																		     	    		b:s3,
																		     	    		e:e3,
																		     	    		o: Ext.getCmp('yinshi6').getValue()});
																		     	    	
																		     //			console.info("是的数据是"+Ext.JSON.encode(store));
																		     			if(!typeof(globalTid) == "number" || datastore == null){
																		        	    	return;
																		        	    }
																		               	var terminalIds = globalTid;
																		               	if(recordIds.getCount() > 0){
																		               		var tmpId = [];
																		    				recordIds.each(function(val, idx, len){
																		    					tmpId.push(val.get("terId"));
																		    				});
																		    				terminalIds = tmpId.join(',');
																		        		}
																		               	if(terminalIds == null) return;
																		               	enableLightBtn(false);
																		     	    	Ext.Ajax.request({
																		     	    		url: 'terminal!saveTerLight.action'
																		     	    		,method: 'post'
																		     	    		,timeout:'120000'//增加超时时间GZE
																		     	    		,params: {id: terminalIds, lt: Ext.JSON.encode(store)}
																	           				,callback: function(opt, success, res){
																		           				var result = showResult(success,res);
																		           				enableLightBtn(true);       
																		           				if(result == false) return; 
																	           					Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText('ligSuccess'),function(){
																	           						viewTimerWinow.close();
																	           					});
																		           				}
																		     	    	});
																	     	     }
																	        }]
															        }]
		        		    	}]
				        }]
    	    ,listeners: {
				  show: function(){
					  if(recordIds.getCount() == 0)
						  getTerminalTimer();
					  Ext.getCmp("tabpanel1").setActiveTab("panelday");
				  },
			      beforeclose: function(){
			    	  if(recordIds.getCount() == 0)
			    		  this.hide(tplshutItem);
			    	  else
			    		  this.hide();
				  }
			      ,close: function(){
			    	   isFreshing = true;
			    	   chanelData();
			    	   datastore.loadData(wdata);
			      }
                ,afterrender: function(){
              	  if(recordIds.getCount() == 0){
                  	   this.show(tplshutItem);
                  	   getTerminalTimer();
              	  }else
              		  this.show();
                }	
			 }
    	    }).show();
	};
	
	showMoreFn = function(tid){
		createMoreBtns(tid);
		showMoreBtns(tid);
	};
	function chanelData(){//还原为默认数据
		 Ext.getCmp('ra_slider').setValue(0);
		  Ext.getCmp('ra_slder1').setValue(0);
		  Ext.getCmp('yin_s1h').setValue(0);
		  Ext.getCmp('yin_s1m').setValue(0);
		  Ext.getCmp('yin_e1h').setValue(23);
		  Ext.getCmp('yin_e1m').setValue(59);
		  Ext.getCmp('yinshi1').setValue(false);
		  Ext.getCmp('ra_slder2').setValue(0);
		  Ext.getCmp('yin_s2h').setValue(0);
		  Ext.getCmp('yin_s2m').setValue(0);
		  Ext.getCmp('yin_e2h').setValue(23);
		  Ext.getCmp('yin_e2m').setValue(59);
		  Ext.getCmp('yinshi2').setValue(false);
		  Ext.getCmp('ra_slder3').setValue(0);
		  Ext.getCmp('yin_s3h').setValue(0);
		  Ext.getCmp('yin_s3m').setValue(0);
		  Ext.getCmp('yin_e3h').setValue(23);
		  Ext.getCmp('yin_e3m').setValue(59);
		  Ext.getCmp('yinshi3').setValue(false);
		  
		  Ext.getCmp('2ra_slider').setValue(0);
		  Ext.getCmp('ra_slder4').setValue(0);
		  Ext.getCmp('liang_s1h').setValue(0);
		  Ext.getCmp('liang_s1m').setValue(0);
		  Ext.getCmp('liang_e1h').setValue(23);
		  Ext.getCmp('liang_e1m').setValue(59);
		  Ext.getCmp('yinshi4').setValue(false);
		  Ext.getCmp('ra_slder5').setValue(0);
		  Ext.getCmp('liang_s2h').setValue(0);
		  Ext.getCmp('liang_s2m').setValue(0);
		  Ext.getCmp('liang_e2h').setValue(23);
		  Ext.getCmp('liang_e2m').setValue(59);
		  Ext.getCmp('yinshi5').setValue(false);
		  Ext.getCmp('ra_slder6').setValue(0);
		  Ext.getCmp('liang_s3h').setValue(0);
		  Ext.getCmp('liang_s3m').setValue(0);
		  Ext.getCmp('liang_e3h').setValue(23);
		  Ext.getCmp('liang_e3m').setValue(59);
		  Ext.getCmp('yinshi6').setValue(false);
	}
	function timerGrid(){
		    datastore = Ext.create('Ext.data.Store', {
						 fields: ["week","weekval","btime","etime","isopen"]
						,data: wdata
			});
			
			//plug
			 rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
					   clicksToMoveEditor: 2,
					   clicksToEdit: 1,
					   saveBtnText: getIi18NText("monitor_message_44"),
					   cancelBtnText: getIi18NText("monitor_message_32"),
					   errorsText: getIi18NText("monitor_message_45"),
					   dirtyText: getIi18NText("monitor_message_46") ,
					   autoCancel: false
					   ,listeners: {  
						   edit: rowEditFn  
					   }
			});
			
			var dataview =  Ext.create('Ext.grid.Panel', {
					   frame: false,
					   shadow: false,
					   store: datastore,
					   width: '200',
					   height: '300',
					   columns: {
					             items: [
										{ text: getIi18NText("monitor_message_47"), width: 100 , dataIndex: 'week' , align: 'center'},
										{ text: getIi18NText("monitor_message_48"),  dataIndex: 'btime', minWidth: 130, renderer: timeRenderFn, flex: 1, editor: {
							                       allowBlank: false
							                      ,xtype: 'timefield'
							                      ,invalidText:getIi18NText("time_input_error") //GZE 2016/8/11 时间输入值无效时的提示信息
							                      ,format: 'H:i:s'
							                      ,format: 'H:i:s'
												  ,submitFormat : 'H:i:s'
									     }},
										{ text: getIi18NText("monitor_message_49"), dataIndex: 'etime', minWidth: 130, renderer: timeRenderFn, flex: 1, editor: {
						                          allowBlank: false
							                      ,xtype: 'timefield'
							                      ,invalidText:getIi18NText("time_input_error") //GZE 2016/8/11 时间输入值无效时的提示信息
							                      ,format: 'H:i:s'
							                      ,format: 'H:i:s'
												  ,submitFormat : 'H:i:s'
									     }},
										{ text: getIi18NText("monitor_message_50"),  dataIndex: 'isopen', width: 80, renderer: openRenderFn, editor: {
						                          allowBlank: false
							                      ,xtype: 'combo'
							                      ,editable: false
							                      ,store: [[true,getIi18NText("monitor_message_51")],[false, getIi18NText("monitor_message_52")]]
									     }}
					             ]
						   		 ,defaults: {
						   	 		    menuDisabled: true, sortable: false
						   	 	 }
					   }
					   ,plugins: [rowEditing]
					   ,viewConfig: {
						     getRowClass : function(record, rowIndex, rowParams, store){
						             return record.get("isopen") ? 'enableRow':'disableRow';
						     }
						}
			});
			return dataview;
			
	}
    
    function showScreenImg(tid,res,W,H ,b){
    	// 图片地址 后面加时间戳是为了避免缓存
    	isFreshing = false;
    	
    	var viewCmp = Ext.get(viewTable_prefix+tid);
        var title = getIi18NText("monitor_message_53")+'('+viewCmp.query("input")[0].value+")";
        //var htmlContent = '<img border="0" width="100%" height="100%" src="'+res+'"></img>';
        var windW = Ext.getBody().getWidth();
        var windH = Ext.getBody().getHeight();
        var cW = W; 
        var cH = H;
        //高度缩小
        if(cH > windH){
        	cW = cW/cH*windH;
            cH = windH;
        }
        //宽度缩小
        if(cW > windW){
        	cH = cH*windW/cW;
        	cW = windW;
        }
        var winH = cH,winW=cW;
//        if(showScreenWin && showScreenWin.isWindow){
//       	     showScreenWin.setTitle(title);
//       	     showScreenWin.down('image').setWidth(cW).setHeight(cH).setSrc(res);
//       	     showScreenWin.setWidth(winW).setHeight(winH).center().show();
//       	     showScreenWin.show(viewCmp);
//	         return;
//        }
        showScreenWin = Ext.create('Ext.window.Window',{
					   id: Ext.id()
					  ,title: title
					  ,plain: true
					  ,width: winW
					  ,height: winH
					  ,border: false
					  ,layout: 'fit'
					  //,layout: {type: 'hbox',pack: 'center'}
//                      ,overflowY: "auto"
//                      ,overflowX: "auto"
                      ,margin: 0
                      ,padding: 0
					  ,items: [{
//						    xtype: 'component',
//						    html: '<img border="0" width="100%" height="100%" src="https://www.baidu.com/img/bd_logo1.png"></img>',
					 	    xtype: 'image'
					        ,src: res,
					        margin: 0
					        ,padding: 0
					        ,cls:b
					   }]
                      //,html: '<img border="0" width="100%" height="100%" src="'+res+'"></img>'
					  ,border: false
					  ,modal: true
					  ,constrain: true
//					  ,closeAction: 'hide'
					  ,listeners: {
						  close: function(){
							  isFreshing = true;
						  }
					  }
       }).show(viewCmp);
    }
    
    removeTerminal=function(terId){
    	 if(/^((\d*,)*\d+)|\d+$/.test(terId)){
    		 isFreshing = false;
			 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', msg: getIi18NText("monitor_message_54"), plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("monitor_message_55"), cancel: getIi18NText("monitor_message_32")}, fn:function(bid, text, opt){
				 if(bid == 'ok'){
		    		 var mytids=[];
		    		 var shtids=[];
		    		 if(Ext.isArray(terId)){
		    			 for (var i=0;i<terId.length;i++){
		    				 recordIds.each(function(r){
		    					 if(r.get("terId")==terId[i]){
		    						 if(r.get("isShare")==1){
		    							 shtids.push(terId[i]);
		    						 }else{
		    							 mytids.push(terId[i]);
		    						 }
		    					 }
		    				 });
		    			 }
		    		 }else{
		    			 if(recordIds.length==0){
		    				 dataStore.each(function(r){
		    					 if(r.get("terId")==terId){
		    						 if(r.get("isShare")==1){
		    							 shtids.push(terId);
		    						 }else{
		    							 mytids.push(terId);
		    						 }
		    					 }
		    				 });
		    			 }else{
		    				 recordIds.each(function(r){
		    					 if(r.get("terId")==terId){
		    						 if(r.get("isShare")==1){
		    							 shtids.push(terId);
		    						 }else{
		    							 mytids.push(terId);
		    						 }
		    					 }
		    				 });
		    			 }
		    		 }
		    		 var isShasre=true;
		    		 if(shtids.length>0){
		    	//		 console.info("删除共享"+shtids);
		    			 isShasre=removeShare(shtids.join(','),mytids.join(','));
		    		 }else{
		    			 mytids = Ext.isArray(mytids)?mytids.join(','):mytids;
		    //			 console.info("删除"+mytids);//删除异常
						 Ext.Ajax.request({
							 url: 'terminal!removeTerminal.action'
							 ,method: 'post'
							 ,params: {id: mytids, t: 1}
						     ,callback: function(opt, success, res){
								 isFreshing = true;
								 var result = showResult(success,res);
								 if(result == false) return; 
								 Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_56"));
								 recordIds.removeAll();
								 refreshMonitarData();
						     }
						 });
		    		 }
				 }else{
					 isFreshing = true;
				 }
			 }});
    	 }else{
    		 Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_tip'));
    	 }
    };
    
    var theTabIsShow = function(){
		    return (window.name == parent.nowTabName) && (isFreshing == true); 
	};
	var thePlanTabShow = function(){
		return (window.name == parent.nowTabName) && (isPlanfresh == true); 
	};
	function removeShare(rstids,rmtids){//删除共享终端和自己拥有终端
		Ext.Ajax.request({
    		url: 'terminal!removeShareter.action'
    		,method: 'post' 
    		,params: {shtids:rstids,mytids:rmtids}
    		,timedout:120000
    		,failure: function(response, opts) {
    			Ext.getBody().unmask();
    			isFreshing = true;
    			Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    		}
    		,success: function(response){
    			Ext.getBody().unmask();
    			isFreshing = true;
    			var result =eval('(' + response.responseText + ')');
    			if(result.code==0){
    				Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_56"));
	    			recordIds.removeAll();
	    			refreshMonitarData();
    			}else{
    				Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("delShare"));
    			}
    		}
    	});
	}
	function timerHideWinFn(){
		if( viewTimerWinow ){
			 viewTimerWinow.close();
		}
	}

	function timeRenderFn(value,metaData,record,rIndex,cIndex){
		    return (value instanceof Date)?Ext.Date.format(value,"H:i:s"):value;
	} 
	
    function openRenderFn(value,metaData,record,rIndex,cIndex){
	        return (value == true)?getIi18NText("monitor_message_51"):getIi18NText("monitor_message_52");
    }

    function rowEditFn(editor, e, eOpts){
    	   var newvalue =  e.newValues;
		   var oldvalue =  e.originalValues;
		   
		   var newbtime = timeRenderFn(newvalue.btime);
		   var newetime = timeRenderFn(newvalue.etime);
		   
		   if(newbtime == newetime){
			       e.record.reject();
			       Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText("monitor_message_57"));
			       return false;
		   } 
		   
           if(newbtime == oldvalue.btime 
     		   && newetime == oldvalue.etime 
     		       && newvalue.isopen == oldvalue.isopen ){
        	       e.record.reject();
	               return false;
           }
        
           return true;
    }
    
    function getTerminalTimer(){
    	    //viewTimerWinow.getEl().mask("正在加载数据...");
    	    Ext.getBody().mask(getIi18NText("monitor_message_58"));
		    Ext.Ajax.request({
			    	   url: 'terminal!getTerminalTimer.action'
			    	  ,method: 'post'
			    	  ,params: {id: globalTid}
			    	  ,callback: function(opt, success, res){
			    		      Ext.getBody().unmask();
				    		  var result = showResult(success,res);
				        	  if(result == false) return;
				        	  
				        	  var timeArrs =  Ext.JSON.decode(result["msg"]);
				        	  var timeArr =timeArrs["shutTime"];
				        	  if(timeArr!="0"){
				        		  datastore.each(function(r){  //设置定时开关机的信息
				        			  for(var i=0; i < timeArr.length; i++){
				        				  if(timeArr[i]["w"] == r.get("weekval")){
				        					  r.set("btime",  timeArr[i]["b"]);
				        					  r.set("etime",  timeArr[i]["e"]);
				        					  r.set("isopen", timeArr[i]["p"]);
				        					  r.commit();
				        				  }
				        			  }
				        		  });
				        	  }
				        	  var voltimes =timeArrs["voltime"];
				        	  var ligtimes =timeArrs["ligtime"];
				       // 	  console.info("")
				        	  //设置上一次音量
				        	  if(voltimes!="0"){
				        		  Ext.getCmp('ra_slider').setValue(voltimes[0]["moy"]);
				        		  Ext.getCmp('ra_slder1').setValue(voltimes[1]["yin"]);
				        		  var tim=voltimes[1]["b"].split(":");
				        		  Ext.getCmp('yin_s1h').setValue(tim[0]);
				        		  Ext.getCmp('yin_s1m').setValue(tim[1]);
				        		  var etim=voltimes[1]["e"].split(":");
				        		  Ext.getCmp('yin_e1h').setValue(etim[0]);
				        		  Ext.getCmp('yin_e1m').setValue(etim[1]);
				        		  Ext.getCmp('yinshi1').setValue(voltimes[1]["o"]);
				        		  Ext.getCmp('ra_slder2').setValue(voltimes[2]["yin"]);
				        		  var tim2=voltimes[2]["b"].split(":");
				        		  Ext.getCmp('yin_s2h').setValue(tim2[0]);
				        		  Ext.getCmp('yin_s2m').setValue(tim2[1]);
				        		  var etim2=voltimes[2]["e"].split(":");
				        		  Ext.getCmp('yin_e2h').setValue(etim2[0]);
				        		  Ext.getCmp('yin_e2m').setValue(etim2[1]);
				        		  Ext.getCmp('yinshi2').setValue(voltimes[2]["o"]);
				        		  Ext.getCmp('ra_slder3').setValue(voltimes[3]["yin"]);
				        		  var tim3=voltimes[3]["b"].split(":");
				        		  Ext.getCmp('yin_s3h').setValue(tim3[0]);
				        		  Ext.getCmp('yin_s3m').setValue(tim3[1]);
				        		  var etim3=voltimes[3]["e"].split(":");
				        		  Ext.getCmp('yin_e3h').setValue(etim3[0]);
				        		  Ext.getCmp('yin_e3m').setValue(etim3[1]);
				        		  Ext.getCmp('yinshi3').setValue(voltimes[3]["o"]);
				      			}
				        	  if(ligtimes!="0"){
				        		  Ext.getCmp('2ra_slider').setValue(ligtimes[0]["mol"]);
				        		  Ext.getCmp('ra_slder4').setValue(ligtimes[1]["lig"]);
				        		  var tim=ligtimes[1]["b"].split(":");
				        		  Ext.getCmp('liang_s1h').setValue(tim[0]);
				        		  Ext.getCmp('liang_s1m').setValue(tim[1]);
				        		  var etim=ligtimes[1]["e"].split(":");
				        		  Ext.getCmp('liang_e1h').setValue(etim[0]);
				        		  Ext.getCmp('liang_e1m').setValue(etim[1]);
				        		  Ext.getCmp('yinshi4').setValue(ligtimes[1]["o"]);
				        		  Ext.getCmp('ra_slder5').setValue(ligtimes[2]["lig"]);
				        		  var tim2=ligtimes[2]["b"].split(":");
				        		  Ext.getCmp('liang_s2h').setValue(tim2[0]);
				        		  Ext.getCmp('liang_s2m').setValue(tim2[1]);
				        		  var etim2=ligtimes[2]["e"].split(":");
				        		  Ext.getCmp('liang_e2h').setValue(etim2[0]);
				        		  Ext.getCmp('liang_e2m').setValue(etim2[1]);
				        		  Ext.getCmp('yinshi5').setValue(ligtimes[2]["o"]);
				        		  Ext.getCmp('ra_slder6').setValue(ligtimes[3]["lig"]);
				        		  var tim3=ligtimes[3]["b"].split(":");
				        		  Ext.getCmp('liang_s3h').setValue(tim3[0]);
				        		  Ext.getCmp('liang_s3m').setValue(tim3[1]);
				        		  var etim3=ligtimes[3]["e"].split(":");
				        		  Ext.getCmp('liang_e3h').setValue(etim3[0]);
				        		  Ext.getCmp('liang_e3m').setValue(etim3[1]);
				        		  Ext.getCmp('yinshi6').setValue(ligtimes[3]["o"]);
				        	  }
				        	
				
			    	  }
	       });
    }
    function isChange(){//判断数据是否被修改
    	var nus=datastore.getCount();
    	for(var i=0;i<nus;i++){
    		if(datastore.getAt(i).dirty){
    			return true;
    		}
    	}
    	return false;
    }
    function timerCompleteFn(){
    	    if(!typeof(globalTid) == "number" || datastore == null){
    	    	return;
    	    }
           	var terminalIds = globalTid;
           	if(recordIds.getCount() > 0){
           		var tmpId = [];
				recordIds.each(function(val, idx, len){
					tmpId.push(val.get("terId"));
				});
				terminalIds = tmpId.join(',');
    		}
           	if(terminalIds == null) return;
           	if( isChange()){//判断数据是否被修改
           		enableTimerBtn(false);
           		var store = [];
           		datastore.each(function(r){
           			store.push({w: r.get("weekval"), 
           				b: timeRenderFn(r.get("btime")), 
           				e: timeRenderFn(r.get("etime")),
           				p: (r.get("isopen") == true)});
           		});
           		//    console.info("定时信息为"+store+"和"+terminalIds);
           		Ext.Ajax.request({
           			url: 'terminal!saveTerminalTimer.action'
           			,method: 'post'
           			,timeout:'120000'//增加超时时间GZE
           			,params: {id: terminalIds, t: Ext.JSON.encode(store)}
           			,callback: function(opt, success, res){
           			var result = showResult(success,res);
           			enableTimerBtn(true);         
           			if(result == false) return; 
           			Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_59"),function(){
           				viewTimerWinow.close();
           			});
           		}
           		});
           	}
    }
    
    function enableTimerBtn(F){
    	 Ext.getCmp('nowcloseBtn').setDisabled(!F);
    	 Ext.getCmp('nowFinshedBtn').setDisabled(!F);
    	 Ext.getCmp('everyCheckbox').setDisabled(!F);
    //	 Ext.getCmp('nowCancelBtn').setDisabled(!F);
    	 if(F){
    		 Ext.getCmp('displayTextField').setValue('<font color="gray" size="2px">('+getIi18NText("monitor_message_42")+')&nbsp;</font>');
    	 }else{
    		 Ext.getCmp('displayTextField').setValue('<font color="red" size="2px">'+getIi18NText("monitor_message_60")+'</font>');
    	 }
    }
    function enableVolBtn(F){
    	Ext.getCmp('yinBtn').setDisabled(!F);
    	//	 Ext.getCmp('nowCancelBtn').setDisabled(!F);
    	if(F){
    		Ext.getCmp('volTextField').setValue('<font color="gray" size="2px">('+getIi18NText("chooseTime")+')&nbsp;</font>');
    	}else{
    		Ext.getCmp('volTextField').setValue('<font color="red" size="2px">'+getIi18NText("monitor_message_60")+'</font>');
    	}
    }
    function enableLightBtn(F){
    	Ext.getCmp('liangBtn').setDisabled(!F);
    	//	 Ext.getCmp('nowCancelBtn').setDisabled(!F);
    	if(F){
    		Ext.getCmp('liangTextField').setValue('<font color="gray" size="2px">('+getIi18NText("chooseTime")+')&nbsp;</font>');
    	}else{
    		Ext.getCmp('liangTextField').setValue('<font color="red" size="2px">'+getIi18NText("monitor_message_60")+'</font>');
    	}
    }
    
    //插播消息对话框
    // tid为要插播消息的终端ID
    function cutInMsgFn(tid){
    	if(/^((\d*,)*\d+)|\d+$/.test(tid) || Ext.isArray(tid)){
    		isFreshing = false;
    		var terIds;
    		if(Ext.isNumber(tid)){
    			globalTid = tid;
    			terIds = tid;
    		}else{
    			recordIds.each(function(val, idx, len){
    				if(val.get("stateValue") == 2)
    					tid.push(val.get("terId"));
    			});
    			if(tid.length == 0){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_selTip'));
    				return;
    			}else if(tid.length!=recordIds.length){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('se_online_ter'));
    				return;
    			}
    			terIds = tid.join(',');
    			tid.splice(0,tid.length);
    		}
	    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
	    	Ext.Ajax.request({
		    	   url: 'terminal!sendOrder.action'
		    	  ,method: 'post' 
		    	  ,timeout:600000
		    	  ,params: {id: terIds, t: 9}
		    	  ,callback: function(opt, success, res){
		    		  Ext.getBody().unmask();
		    		  isFreshing = true;
		    		  var result = showResult(success,res);
		        	  if(result == false) {
		        		  return;
		        	  }; 
		        	  showCutInMsgForm(terIds);
		    	  }
	    	});
    	}
//    	showCutInMsgForm(globalTid);
    }
    
	// *.final
	// Ext.getBody().unmask();


function showCutInMsgForm(tid){
	isFreshing = false;
	msgStore.reload();
	var cutInMsgForm=Ext.getCmp('cutInMsgForm');
	if(cutInMsgForm){
		cutInMsgForm.show(tid,function(){
			Ext.getCmp('plan_startDate').setValue(new Date());
			Ext.getCmp('cutInMsgContent').setValue();
			
		});
	}else{
	var msgForm = Ext.create('Ext.form.Panel', { 
        title:getIi18NText('jsp_editMessage')
        ,id:'cutInMsgForm'
        ,modal: true
		 ,floating: true
		 ,draggable :true
		 ,closable: true
		 ,border: true
		 ,shadowOffset : 10
		 ,shadow: 'drop'
		 ,renderTo: document.body
		 ,height: 430
		 ,width: 600
		 ,closeAction: 'hide'
		 ,items : [
			{
	    	     layout: 'hbox'
	    	     ,border: false
	    	     ,margin: '2 3 6 0'
                ,items:[ 
                        {
			            	  xtype: 'datefield'
			            	 ,width: 255
			            	 ,fieldLabel: '<font class="boldLabelCls">'+getIi18NText("playingStartTime")+'</font>'
			   	    	     ,labelWidth: 110
				    	     ,labelAlign: 'right'
				    	     ,labelStyle: 'font-weight: bold'
			            	 ,editable: false
                            ,format: dateFormat
                            ,submitFormat:'Y-m-d H:i:s'
                            ,miniValue: new Date() 
                            ,id: 'plan_startDate'
                       	    ,extraH: 0
                            ,extraM: 0
                            ,extraS: 0
			            	 ,listeners: {
			            		    afterrender: defaultDatetime
							        ,expand : function(){
							        	 this.setValue(new Date());
							        	  if( typeof(this.setTimeFn) != 'function') addTimeToDatePicker(this);
							        	  else{
							        		  var date=this.getValue();
									    	  Ext.getCmp(this.id+"_seconds").setValue(date.getSeconds());
							        		  Ext.getCmp(this.id+"_minutes").setValue(date.getMinutes());
							 				  Ext.getCmp(this.id+"_hours").setValue(date.getHours());
									      }
							        }
							        ,select: function( field, value, eOpts ){
									      if( typeof(field.setTimeFn) == 'function') field.setTimeFn(value);
									    
									},change:function(){
										var da=this.getValue();
				            	    	  da.setMinutes( da.getMinutes()+10);
				            	    	  Ext.getCmp('plan_endDate').setValue(da);
									}
			            	 }      	
			              }
			             ,{
			            	  xtype: 'datefield'
			            	 ,width: 175
			            	 ,labelSeparator: ''
			            	 ,fieldLabel: '<font class="boldLabelCls">'+getIi18NText("to")+'</font>'
			            	 ,labelStyle: 'font-weight: bold'
			                 ,labelWidth: 10
			                 ,id: 'plan_endDate'
			                 ,editable: false
			                 ,format: dateFormat
			                 ,submitFormat:'Y-m-d H:i:s'
			                 ,miniValue: new Date() 
				             ,extraH: 23
                            ,extraM: 59
                            ,extraS: 59
				             ,listeners: {
				            	    afterrender: function($this){
				            	    	  defaultDatetime($this);
				            	    	  var da=Ext.getCmp('plan_startDate').getValue();
				            	    	  da.setMinutes( da.getMinutes()+10);
				            	    	  this.setValue(da);
				            	    }
							        ,expand : function($this){
							        	var da=Ext.getCmp('plan_startDate').getValue();
				            	    	  da.setMinutes( da.getMinutes()+10);
				            	    	  this.setValue(da);
							        	  if( typeof($this.setTimeFn) != 'function') addTimeToDatePicker(this);
							        	  else{
							        		  var date=this.getValue();
									    	  Ext.getCmp(this.id+"_seconds").setValue(date.getSeconds());
							        		  Ext.getCmp(this.id+"_minutes").setValue(date.getMinutes());
							 				  Ext.getCmp(this.id+"_hours").setValue(date.getHours());
									      }
							        }
							        ,select: function( field, value, eOpts ){
									      if( typeof(field.setTimeFn) == 'function') field.setTimeFn(value);
									}
				             }  
					     }]
	      },
	      {
				xtype : "tinymce",
				name : "html",
				width : '100%',
				height :200,
				mode : 'textareas',
				id:'cutInMsgContent',
				tinyMCEConfig : editorConfig
			},{layout: 'hbox'
    	     ,border: false
	    	 ,id:'lastMsgField'
	    	 ,hidden:recordIds.getCount() > 0
    	     ,items:[
                     {
                      xtype: 'displayfield',
           	    	  fieldLabel:getIi18NText('jsp_lastMsgTime')
        	    	  ,labelWidth: 140
        	    	  ,labelAlign: 'right'
        	    	  ,labelStyle: 'font-weight: bold'
           	    	  ,id:'lastBeginTime',
           	    	  fieldStyle:{
           	    		  "text-align": 'center'
           	    	  },
                     },{
           	    	  xtype: 'displayfield',
           	    	  labelWidth:8,
        	    	  fieldLabel:getIi18NText('to'),
        	    	  labelStyle: 'font-weight: bold',
        	    	  labelSeparator:'',
        	    	  id:'lastEndTime',
        	    	  fieldStyle:{
        	    	        "text-align": 'left'
        	    	 },
        	      }]
	      },
	      {
	    	  xtype: 'displayfield',
	    	  id:'lastMessage',
	    	  hidden:recordIds.getCount() > 0,
	    	  fieldLabel:getIi18NText('jsp_lastMsgText'),
	    	  fieldCls:'messagetext'
	    	  ,labelWidth: 140
	    	  ,labelAlign: 'right'
	    	  ,labelStyle: 'font-weight: bold'
	    	  ,readOnly: true,
	    	  fieldStyle:{
	    	        "margin-top":'5px'
         	  },
	      }
	      ]
		 ,listeners: {
				  show: function(){
					  if(recordIds.getCount() == 0){
						  var lastMessage=msgStore.data.getByKey(globalTid);
						  if(lastMessage){
							  var data=lastMessage.data;
							  setlastMsg(data);
						  }else{
							  Ext.getCmp('lastMessage').setValue('');
							  Ext.getCmp('lastBeginTime').setValue('');
							  Ext.getCmp('lastEndTime').setValue('');
						  }
					  }
				  },
			      beforeclose: function(){
					  Ext.getCmp('lastMsgField').setVisible(true);
					  Ext.getCmp('lastMessage').setVisible(true);
				  },
				  beforehide: function(){
					  Ext.getCmp('lastMsgField').setVisible(true);
					  Ext.getCmp('lastMessage').setVisible(true);
				  },
				  beforeshow:function(){
					  if(tabCtr == 0){
						  Ext.getCmp('lastMsgField').setVisible(false);
						  Ext.getCmp('lastMessage').setVisible(false);
					  }
					  msgStore.reload();
				  },
				  close:function(){
					  isFreshing = true;
				  },
				  afterrender:function(){
					  if(recordIds.getCount() == 0){
						  var lastMessage=msgStore.data.getByKey(tid);
						  if(lastMessage){
						  var data=lastMessage.data;
						  setlastMsg(data);
						  }else{
							  Ext.getCmp('lastMessage').setValue('');
							  Ext.getCmp('lastBeginTime').setValue('');
							  Ext.getCmp('lastEndTime').setValue('');
						  }
					  }
				  }
		}
   	,buttons : [{
			xtype : 'button',
			text : getIi18NText('cancel'),
			iconCls : 'pback_reset_IconCls',
			handler:function(){
				msgForm.hide();
			}
	   } , {
			xtype : 'button',
			margin : '0 0 0 10',
			iconCls : 'pback_finish_IconCls',
			text : getIi18NText('confirm'),
			handler : function(){
				var beginTime=Ext.getCmp('plan_startDate').getValue();
				var endTime=Ext.getCmp('plan_endDate').getValue();
				if(Ext.getCmp('plan_startDate').getValue() >= Ext.getCmp('plan_endDate').getValue()){
					   showTip(this,getIi18NText("playTimeErrWarming01"));
					   Ext.getCmp('plan_startDate').getEl().frame();
					   return;
				   }
				
			   var form = this.up('form').getForm();
               if (form.isValid()) { 
               	var msgContent=Ext.getCmp('cutInMsgContent').getValue();
               	var terminalIds = globalTid;
               	
               	if(recordIds.getCount() > 0){
	               	var tmpTid = [];
	    			recordIds.each(function(val, idx, len){
	    				if(val.get("stateValue") == 2)
	    					tmpTid.push(val.get("terId"));
	    			});
	    			if(tmpTid.length == 0){
	    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_selTip'));
	    				return;
	    			}
	    			terminalIds = tmpTid.join(',');
               	}
               	
                form.submit({  
                    url : 'terminal!cutInMessage.action',  
                    method : 'POST',
                    timeout: 600,
                    waitTitle : getIi18NText("systemMessage"),  
                    waitMsg : getIi18NText("monitor_message_58"),  
                    params: {
                    	beginTime:  Ext.Date.format(beginTime,'Y-m-d H:i:s'),
                    	endTime: Ext.Date.format(endTime,'Y-m-d H:i:s'),
                    	tid:terminalIds,
                    	msgContent:checkAndRemoveHtmlCmps(msgContent)
                     },
                    success : function(form, action) { 
                    	msgStore.reload();
                    	Ext.Msg.alert( getIi18NText("systemMessage"),action.result.msg);
                    },  
                    failure : function(form, action) {  
                    	Ext.Msg.alert( getIi18NText("systemMessage"),action.result.msg);
                    }  
                }); 
               	msgForm.hide();
               }
			}
	   	}]
		          
	});
	msgForm.show();
	}
}


function defaultDatetime($this){
	  var date = new Date();
	  $this.setValue(date);
}
function addTimeToDatePicker(picker){
		//1.create
	    var footer = picker.getPicker().el.down('.x-datepicker-footer');
	    var date=picker.getValue();
	    Ext.create('Ext.panel.Panel',{
		        layout: 'hbox'
			   ,border: false
			   ,margin: '0 0 3 0'
			   ,bodyStyle: 'background: transparent'
			   ,defaults:{
			         xtype: 'numberfield'
					 ,labelWidth: 15
					 ,width: 70
					 ,minValue: 0
					 ,maxLength: 2
					 ,enforceMaxLength: true
					 ,listeners: {
							change: function(field, newValue, oldValue, eOpts ){
								  if(field.isValid()) picker.setTimeFn();
							}
					 }
			   }
			   ,items: [{
					 fieldLabel: getIi18NText("hour")
					,id: picker.id+"_hours"
//					,value: Ext.Number.from(picker.getValue().getHour, 0)
					,value: date.getHours()
					,maxValue: 23
			   },{
			         fieldLabel: getIi18NText("minute")
					,id: picker.id+"_minutes"
					,value: date.getMinutes()
					,maxValue: 59
			   },{
			         fieldLabel: getIi18NText("second")
					,id: picker.id+"_seconds"
					,value:date.getSeconds()
					,maxValue: 59
			   }]
			   ,renderTo: footer.insertHtml('afterBegin', '<div></div>') 
	     });

		 //2.regist fn
		 picker.setTimeFn=function(value){
				 value = !value?picker.getValue():value;
				 if(!value) return;
                 
				 var h = Ext.getCmp(picker.id+"_hours").getValue();
				 var m = Ext.getCmp(picker.id+"_minutes").getValue();
				 var s = Ext.getCmp(picker.id+"_seconds").getValue();
				 
				 value.setHours(h);
				 value.setMinutes(m);
				 value.setSeconds(s);
				 picker.setValue(value);
				 
		 };
}
var commonTip = Ext.create('Ext.tip.ToolTip',{
	   title: getIi18NText("systemMessage")
	  ,minWidth: 100
   ,html: ''
});
function showTip(comp, msg){
  	commonTip.update(msg);
  	commonTip.showBy(comp,null,[50,-60]);
  	comp.addListener('mouseout',function(){
  		  commonTip.hide();
  	});
}
function setlastMsg(data){
	  Ext.getCmp('lastMessage').setValue('<div style="width: 450px; height: 90px; overflow: auto">'+data.content+'</div>');
	  Ext.getCmp('lastBeginTime').setValue(data.beginTime);
	  Ext.getCmp('lastEndTime').setValue(data.endTime);
}

//检查终端Apk版本信息
	updateVersion = function(tid){
    isFreshing = false;
    globalTid = tid;
    sendcheck(globalTid,9);
	};
	sendcheck = function(tid,seq){
		if(Ext.isNumber(tid) && Ext.isNumber(seq)){
    	isFreshing = false;
    	globalTid = tid;
    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	Ext.Ajax.request({
	    	   url: 'terminal!sendOrder.action'
	    	  ,method: 'post' 
	    	  ,params: {id: globalTid, t: seq}
	    	  ,callback: function(opt, success, res){
	    		  Ext.getBody().unmask();
	    		  isFreshing = true;
	    		  var result = showResult(success,res);
	        	  if(result == false) {
	        		  return;
	        	  }; 
	        	  createUpdateTip(globalTid,10,result.msg);
	    	  }
    	});
		}
	};
createUpdateTip = function(tid,seq,version) {
	if(Ext.isNumber(tid) && Ext.isNumber(seq) || Ext.isArray(tid)){
    	isFreshing = false;
    	var terIds, msgText;
    	if(Ext.isNumber(tid)){
    		globalTid = tid;
    		terIds = tid;
    		tplItem = Ext.get(viewTable_prefix+globalTid).parent('ul');
    		msgText = getIi18NText('jsp_currentVersion')+"<b>"+version+"</b> "+getIi18NText('jsp_isupdateVersion');
    	}else{
	    	recordIds.each(function(val, idx, len){
	    		if(val.get("stateValue") == 2)
	    			tid.push(val.get("terId"));
	    	});
	    	if(tid.length == 0){
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_selTip'));
	    		return;
	    	}else if(tid.length!=recordIds.length){
				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('se_online_ter'));
				return;
			}
    		terIds = tid.join(',');
    		tid.splice(0,tid.length);
    		msgText = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getIi18NText('jsp_isupdateVersion') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    	}
    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', msg: msgText,
 		   plain: true, buttons: Ext.MessageBox.YESNOCANCEL, buttonText: {yes: getIi18NText("jsp_officialUpdate"),no:getIi18NText("jsp_localUpdate"),cancle:getIi18NText("monitor_message_32")},
 		   animateTarget : tplItem,
 		fn:function(bid, text, opt){
	    		if(bid == 'yes'){
	    			   Ext.getBody().mask(getIi18NText("monitor_message_37"));
					   Ext.Ajax.request({
				    	   url: 'terminal!sendOrder.action'
				    	  ,method: 'post' 
				    	  ,params: {id: terIds, t: seq}
					   	  ,timedout:60000
				    	  ,callback: function(opt, success, res){
				    		  Ext.getBody().unmask();
				    		  isFreshing = true;
				    		  var result = showResult(success,res);
				        	  if(result == false) {
				        		  return;
				        	  }; 
				        	  Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_38"));
				        	  recordIds.removeAll();
			        		  refreshMonitarData();
				    	  }
			   });
	    }else if(bid == 'no'){
	    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
			   Ext.Ajax.request({
		    	   url: 'terminal!sendOrder.action'
		    	  ,method: 'post' 
		    	  ,params: {id: terIds, t: 16}
		    	  ,callback: function(opt, success, res){
		    		  Ext.getBody().unmask();
		    		  isFreshing = true;
		    		  var result = showResult(success,res);
		        	  if(result == false) {
		        		  return;
		        	  }; 
		        	  Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_38"));
		        	  recordIds.removeAll();
	        		  refreshMonitarData();
		    	  }
	   });
	    }else{
				 isFreshing = true;
			}             	    		
 		}
    	});
	}
};

//-----------------------goods-------------------
	/**
	 * 商品管理, tgProxy, tgHisProxy
	 */
	manaGoods = function(id){	//globalTid
		var idx = dataStore.find('terId', id);
		var modal = dataStore.getAt(idx);//.get("name"));
		tplItem = Ext.get(viewTable_prefix+modal.get("terId")).parent('ul');		//动画目标
		createGoodsWindow(modal);
		return;
	};
	
	/**
	 * 创建商品面板
	 */
    function  createGoodsWindow(modal){
    	isFreshing = false;
    	var winW = Ext.getBody().getWidth()-60; //1266
    	var winH = Ext.getBody().getHeight()-100; //622
    	winW = winW<700?700:winW;
    	winH = winH<300?300:winH;
    	var state = modal.get("stateValue");
//    	var title = modal.get("name")+"("+modal.get("screen")+")"+ getIi18NText("goods_info") + "  " + getIi18NText('clik_up_ct');
    	var title = modal.get("name")+"("+modal.get("screen")+")"+ getIi18NText("saleRecord");
    	tplItem = Ext.get(viewTable_prefix+modal.get("terId")).parent('ul');
    	var ttid=modal.get("terId");
    	var sttid=modal.get("storeId");
    //	console.info("看爱上看"+tplItem);
    	isPlanfresh = true;
    	if(goodsWinow && goodsWinow.isPanel){
    		//当窗口已经创建好了之后，只需刷新数据
//    		tgHisProxy.setExtraParam("tid", modal.get("terId"));
//    		goodsHisStore.load();
    		
    		ajaxOrProxy.setExtraParam("td", ttid);
    		ajaxOrProxy.setExtraParam("st", sttid);
    		tabStore.load();
    		
    		goodsWinow.setTitle(title);
    		goodsWinow.setWidth(winW).setHeight(winH).center().show(tplItem);
    		return;
    	}

  	 //4.grid
	    ajaxOrProxy = getAjaxProxy({url:'restaurant!getTerOrderList.action', extraParams: {n:'',b:null,e:null,st:sttid,td:ttid, state: '1,2,3,-3,-4,-5' }});
	    tabStore = Ext.create('Ext.data.Store', {
				 fields: ['id', 'number', 'state', 'pricesum', 'tradeNo', 'creator','createtime','remark', 'type', 'ordersDetail']
				//,buffered: true
				,pageSize: 20
				//,leadingBufferZone: 50
				,proxy: ajaxOrProxy
				,autoLoad: true
//				,totalProperty:'totalCount'
//	              ,sorters: [{
//	              property: 'createDate',
//	              direction: 'DESC'
//	          }]
				,listeners: {
					    load:function($this, record){
//					    	 Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
					    	 clearUnuseCmp();
					    }
				}
		});
       //订单列表
   	 orderGrid = Ext.create('Ext.grid.Panel', {
	 //   title: getIi18NText("orders08"),
	    //iconCls: 'tabIconCss',
	   shadow:false,
	    store: tabStore,
	    columns: {
	    	 items: [
	    	            { text: getIi18NText("No"), width: 60 , xtype: 'rownumberer', align: 'center'},
	    		        { text: getIi18NText('orders09'),  dataIndex: 'number' , flex: 1, minWidth: 20,menuDisabled: true, sortable: true},
	    		        { text: getIi18NText('orders14'),  dataIndex: 'tradeNo' , flex: 1, minWidth: 130,menuDisabled: true, sortable: true},
	    		        { text: getIi18NText("orders11"), dataIndex: 'pricesum', width: 80,menuDisabled: true, sortable: true},
	    		        { text: getIi18NText("orders10"), dataIndex: 'state', minWidth: 80, renderer: staRenderFn,menuDisabled: true, sortable: false},
	    		        { text: getIi18NText("type"), dataIndex: 'type', minWidth: 70 ,renderer: typeRenderFn,menuDisabled: true, sortable: false},
	    		        { text: getIi18NText("creator"), dataIndex: 'creator', minWidth: 70,menuDisabled: true, sortable: false},
	    		        { text: getIi18NText("create_time"), dataIndex: 'createtime', minWidth: 140,menuDisabled: true, sortable: true},
//	    		        { text: getIi18NText("remark"), dataIndex: 'remark', minWidth: 140 },
	    		        { text: getIi18NText("monitor_message_10"), dataIndex: 'id',  minWidth: 120, menuText: getIi18NText("monitor_message_10"), menuDisabled: true, sortable: false,draggable: false, resizable: false, renderer: ctrlRenderFn}
	    		    ]
	    }, 
	    bbar: [{
	    	id:'padingBar',
            xtype: 'pagingtoolbar',
            store: tabStore,
            border:false,
            displayInfo: true,
            listeners:{
            	beforechange:function(e, n, o){
            	}
            }
        }],
	    margin: '1'
/*	   ,tools:[
	   {
		    xtype:'button',
		    tooltip: getIi18NText("item_refresh_schedule") ,
            text: getIi18NText("refresh"),
            border: false,
            iconCls: 'refreshIconCss',
		    handler: searchFn
		}]*/
	    ,listeners: {
	    	resize: resizeChildContent
	    }
	    ,viewConfig: {
            trackOver: true
           ,disableSelection: true
           ,emptyText: '<h1 style="margin:10px; font-size: 18px;">'+getIi18NText("item_noresult")+'</h1>'
        }
	   
	});

       var ghsRefreshCtr = false;	//goodshistorystore刷新控制
       
       //tab面板
       var tabPanel=Ext.create('Ext.tab.Panel',{
	       layout:'fit',
	       autoScroll:false,
	       height:'100%',
	       padding:0,
	   		shadow : false,
	   		border:false,
	   		defaults:{
	   			layout:'fit',
	   			border: false
	   		},
	        items:[
//	               {title:getIi18NText('goods_rec'),items:[goodsHisGrid], listeners:{activate:function(){if(!ghsRefreshCtr){goodsHisStore.load();ghsRefreshCtr = !ghsRefreshCtr;}}}}
	               {title:getIi18NText('goods_rec'),items:[orderGrid], listeners:{activate:function(){if(!ghsRefreshCtr){tabStore.load();ghsRefreshCtr = !ghsRefreshCtr;}}}}
	       ],
	       activeTab:0
       });
       
       //主窗口
        goodsWinow = Ext.create('Ext.panel.Panel',{
					  title: title
					 ,modal: true
					 ,floating: true
					 ,draggable :true
					 ,closable: true
					 ,border: false
					 ,shadowOffset : 10
					 ,shadow: 'drop'
					 ,renderTo: document.body
					 ,width: winW
					 ,height: winH
					 ,closeAction: 'hide'
					 ,layout: 'fit'
					 ,items: [tabPanel]
					 ,listeners: {
					      beforeclose: function(){
//					    	  if(goodsStore.getModifiedRecords().length > 0 || goodsStore.getRemovedRecords().length > 0){
//					    		  if(confirm(getIi18NText("close_tip"))){
//					    			  updateAllStock();
//					    			  return false;
//					    		  }
//					    	  }
				    		  this.hide(tplItem);
						       isFreshing = true;
						       isPlanfresh = false;
						  }
                          ,afterrender: function(){
                        	   this.show(tplItem);
                        	   this.show();
                          }
					 }
		});
    }
    
    function sumrenderFn(value,metadata,record,rowIndex){
		     if(isNull(value)){
		    	  return "--";
		     } 
		     try{
		    	 var ctx = Ext.decode(value);
		    	 return ctx["sum"];
		     }catch(e){
		    	 return "--";
		     }
   }
    
    //-----------函数带--------
    /**
     * 删除出货历史
     */
//    function delGoodsHis(v,r,c,i,e,record,row){
//		 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', msg:window.top.getIi18NText('confirm_del',"<font color=red>"+record.get("name")+"</font>")
//			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
//			 fn:function(bid, text, opt){
//			   if(bid == 'ok'){
//				   goodsWinow.getEl().mask(window.top.getIi18NText('deling'));
//				   Ext.Ajax.request({
//					     url: 'terminal!delHistory.action'
//					    ,params: {hid: record.get("id")}
//				        ,method: 'post'
//				        ,callback: function(opt, success, response){
//				        	  goodsWinow.getEl().unmask();
//				        	  var result = showResult(success,response);
//				        	  if(result == false) return;
//				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('deleteFileSuccess'));
//				        	  goodsHisStore.loadPage(1);
//				        }
//				   });
//			   }
//		 }});
//    }
    //获取终端详细信息
    
    function showTerInfoFn(tid){
    	isFreshing = false;
    	globalTid = tid;
    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	Ext.Ajax.request({
	    	   url: 'terminal!getTerminalInfo.action'
	    	  ,method: 'post' 
	    	  ,params: {id: globalTid}
    		  ,timedout:120000
    		  ,failure: function(response, opts) {
    			  Ext.getBody().unmask();
    			  isFreshing = true;
    			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    		    }
	    	  ,success: function(response){
	    		  Ext.getBody().unmask();
	    		  isFreshing = true;
	    		  var result =eval('(' + response.responseText + ')');
	        	  if(result.code==0){
	        		  var data =eval('(' + result.msg + ')');
	        		  showTerInfo(globalTid,data);
	        	  }
	    	  }
 	});
//    	showCutInMsgForm(globalTid);
    }
    function addterInfoPanel(data,dataError){
    		Ext.getCmp('showTerminalName').setValue(data.tname);
			Ext.getCmp('terninalOwner').setValue(data.uname);
//			Ext.getCmp('terminalConnect').setValue("最近在线：【<font color='green' >"+data.stime+"</font>】<br/>最近离线：【<font color='red' >"+data.etime+"</font>】"); //GZE 
			if(data.stime=="0"){
			//	data.stime="没有在线记录";
				data.stime=getIi18NText("noOnrecord");
			}
			if(data.etime=="0"){
				//data.etime="没有离线记录";
				data.etime=getIi18NText("noOffrecord");
			}
			Ext.getCmp('terminalConnect').setValue(getIi18NText("recentOnline")+"：【<font color='green' >"+data.stime+"</font>】<br/>"+getIi18NText("recentOffline")+"：【<font color='red' >"+data.etime+"</font>】"); //GZE 
    		if(data.time){
    			Ext.getCmp('terminalTime').setValue(data.time?data.time.r:dataError);
    			if(typeof(data.time.v)!="undefined"){ //兼容老版本APK
    				Ext.getCmp('terminalMsg').hide();
	    			Ext.getCmp('rate_slider').setDisabled(false);
			  		Ext.getCmp('confirmButton').setDisabled(false);
    				Ext.getCmp('rate_slider').setValue(data.time.v);   //详细音量
    				Ext.getCmp('showTerminalName').setDisabled(false);
    				Ext.getCmp('confirmButton2').setDisabled(false);
    			}else{
    				Ext.getCmp('terminalMsg').show();
    				Ext.getCmp('rate_slider').setValue(0);    //详细音量
	    			Ext.getCmp('rate_slider').setDisabled(true);
			  		Ext.getCmp('confirmButton').setDisabled(true);
//			  		Ext.getCmp('showTerminalName').setDisabled(true);
//			  		Ext.getCmp('confirmButton2').setDisabled(true);
    			}
    			if(typeof(Ext.getCmp("play_iem"))!="undefined"){
    				if(typeof(data.time.s)!="undefined"){ 
    					if(data.time.s=="1"){
    						Ext.getCmp("play_iem").hide();
    						Ext.getCmp("stop_iem").show();
    					}else if(data.time.s=="0"){
    						Ext.getCmp("play_iem").show();
    						Ext.getCmp("stop_iem").hide();
    					}
    					Ext.getCmp('play_iem').setDisabled(false);
    					Ext.getCmp('stop_iem').setDisabled(false);
    				}else{
    					Ext.getCmp('play_iem').setDisabled(true);
    					Ext.getCmp('stop_iem').setDisabled(true);
    				}
    			}
    		}else{
    			Ext.getCmp('showTerminalName').setDisabled(true);
    			Ext.getCmp('confirmButton2').setDisabled(true);
    			Ext.getCmp('terminalTime').setValue(dataError);
    			Ext.getCmp('rate_slider').setValue(0);     //详细音量
			    Ext.getCmp('confirmButton').setDisabled(true);
			    Ext.getCmp('rate_slider').setDisabled(true);
			    Ext.getCmp('terminalMsg').hide();
			    if(typeof(Ext.getCmp("play_iem"))!="undefined"){
			    	Ext.getCmp('play_iem').setDisabled(true);
			    	Ext.getCmp('stop_iem').setDisabled(true);
			    }
    		}
    }
	    //画面切换的事件
    changeVideoShow = function(){
    //	console.info($("#windowShow").css("width")+"  -   "+$("#receivedVideo").css("width"));
    	if($("#localVideo").css("width")==$("#receivedVideo").css("width")){
    		//还原到原来的比例
    		$('#localVideo').css('padding', '');
    		$("#receivedVideo").animate({left:"0",top: "0",width:"100%", height: "100%"},{duration:500}); 
	    	$("#localVideo").animate({left:"76%",top: "0",width:"24%", height: "24%", },{duration:500}); 
    	}else{
    		//切换到相同大小
    		$('#localVideo').css('padding-bottom', '37px');
    		$("#receivedVideo").animate({left:"0",top: "0",width:"50%", height: "100%"},{duration:500}); 
        	$("#localVideo").animate({padding: "0 0 37px 0",left:"50%",top: "0",width:"50%", height: "100%"},{duration:500});
    	}
    }
    function showTerInfo(tid,data){
    	var dataError='<font color="red">'+getIi18NText("terminalInvalid")+'</font>';
    	var terInfoPanel=Ext.getCmp('terInfoPanel');
    	if(terInfoPanel){
    		terInfoPanel.show();
    		isFreshing = false;
    		addterInfoPanel(data,dataError);
    	}else{
  terInfoPanel = Ext.create('Ext.panel.Panel', { 
            title:getIi18NText("jsp_terDetailInfo")
            ,id:'terInfoPanel'
            ,modal: true
    		 ,floating: true
    		 ,draggable :true
    		 ,closable: true
    		 ,border: true
    		 ,shadowOffset : 10
    		 ,shadow: 'drop'
    		 ,renderTo: document.body
    		 ,height: 300
    		 ,width: 600
    		 ,closeAction: 'hide'
    		 ,layout: 'vbox'
    		 ,items : [
    			{
    				xtype:'panel',
    				height:30,
					width:500,
					layout:'hbox',
					border:false,
					margin : (getIi18NText('confirm') == "OK") ? '5 0 0 32':'5 0 0 40',
    				items:[{
    					xtype: 'textfield',
					    fieldLabel: getIi18NText("terminalName"),
					    width : 200,
						labelWidth : 60,
					    labelAlign:'right',
					    id:'showTerminalName',
					    maxLength:16,
					    regex:/^[0-9a-zA-Z-_\u4e00-\u9fa5]*$/,
					    regexText:getIi18NText("name_input_error"),
					    fieldStyle:'border:none;border-bottom: 1px solid gray;', 
					    listeners : {
							change : function($this,newValue, oldValue,eOpts) {
						    	if(!terName.test(newValue)){
						    		Ext.getCmp('confirmButton2').setDisabled(true);
						    		Ext.getCmp('showTerminalName').setFieldStyle("border:none;border-bottom: 1px solid red"); //GZE 2016/8/12	 改变下划线样式
						    	}else{
						    		Ext.getCmp('confirmButton2').setDisabled(false);
						    		Ext.getCmp('showTerminalName').setFieldStyle("border:none;border-bottom: 1px solid gray"); //GZE 2016/8/12	 改变下划线样式
						    	}
							}
					    }
    				},{
    					xtype:'button',
						margin : '0 0 0 10',
						id : 'confirmButton2',
						text:getIi18NText("confirm"),
						hidden : false,
						handler:updateTerName
    				}
    				]
				},
				{
				    xtype: 'displayfield',
				    fieldLabel: getIi18NText("jsp_terTime"),
				    labelAlign:'right',
				    id:'terminalTime'
				},{
						xtype: 'displayfield',
			//			fieldLabel: "连接状态",conStatus
						fieldLabel: getIi18NText("conStatus"),
						labelAlign:'right',
						id:'terminalConnect'
				}, {
				    xtype: 'displayfield',
				    fieldLabel: getIi18NText("jsp_terOwner"),
				    id:'terninalOwner',
				    labelAlign:'right',
				    name: 'visitor_score'
				},{
					xtype:'panel',
					height:35,
					width:500,
					margin : (getIi18NText('confirm') == "OK") ? '0 0 0 32':'0 0 0 45',
					border : false,
					layout:'hbox',
					items :[{
						xtype : 'slider',
						fieldLabel : getIi18NText("modulation"),
						width : 200,
						labelWidth : 60,
						id : 'rate_slider',
						margin : '2 0 0 0',
						value : 80,
						// 增减幅度
						increment : 25,
						minValue : 0,
						maxValue : 100,
						plugins:new Ext.slider.Tip({
							getText:function(thumb){
								if(thumb.value=="0"){
									return getIi18NText('wu')
								}
								if(thumb.value=="25"){
									return getIi18NText('weak')
								}
								if(thumb.value=="50"){
									return getIi18NText('middle')
								}
								if(thumb.value=="75"){
									return getIi18NText('higher')
								}
								if(thumb.value=="100"){
									return getIi18NText('highest')
								}
							}
						})
			/*			listeners : {
							changecomplete : function(
									$this, newvalue) {
								Ext.getCmp('rate_number').setValue(newvalue);
							}
						}*/
					}
/*					,{
						xtype : 'numberfield',
						maxValue : 100,
						minValue : 0,
						negativeText:getIi18NText('number_input_error'),//GZE 2016/8/11  输入值为负数时的提示消息
						value : 80,
						// 是否允许输入数值
						editable : true,
						margin : '0 0 0 3',
						// 增减幅度
						step : 1,
						id : 'rate_number',
						allowBlank : false,
						blankText : getIi18NText('chooseProportionTip'),
						// 是否允许输入小数
						allowDecimals : false,
						width : 60,
						listeners : {
							change : function($this,newValue, oldValue,eOpts) {
								if (newValue>100||newValue<0) {
									Ext.getCmp('confirmButton').setDisabled(true);
								}
								else if ($this.isValid()) {
									Ext.getCmp('confirmButton').setDisabled(false);
									Ext.getCmp('rate_slider').setValue(newValue);
								}
							}
						}
					}*/
					,{
						xtype:'button',
						margin : '0 0 0 10',
						id : 'confirmButton',
						text:getIi18NText("confirm"),
						handler:updateVolume
					},
					{
				    xtype: 'displayfield',
				    margin : '0 0 0 20',
				    id:'terminalMsg',
				    value :'<font style="color:red">'+getIi18NText("updateAPK")+'</font>',
//				    value : getIi18NText("updateAPK"),
				    fieldLabel: ''
					}]
				}
				,{
					xtype:'panel',
					height:35,
					width:500,
					id:'butonArray',
					//margin : (getIi18NText('confirm') == "OK") ? '0 0 0 32':'0 0 0 45',
					margin:'10 0 0 40',
					border : false,
					layout:'hbox',
					items :[{
								xtype:'button',
								text:getIi18NText("jsp_getLogFile"),
								handler:getTerLogData
							}]
				 	,listeners: {
				 		afterrender: function(){
				 			if(AUTH["remotedo"]){ 
				 			Ext.getCmp("butonArray").add(
									{
										xtype:'button',
										id:'play_iem',
//										text:'播放节目',
										text:getIi18NText("play_pro"),
										margin:'0 0 0 10',
										hidden:true,
										handler:function(){
											changeItem("playItem");
										}
									},{
										xtype:'button',
										id:'stop_iem',
//										text:'暂停节目',
										text:getIi18NText("suspend"),
										margin:'0 0 0 10',
										hidden:false,
										handler:function(){
											changeItem("stopItem");
										}
									}
				 					);
				 		    }
	   				  	}
				 	}
				}]
    		 ,listeners: {
    				  show: function(){
    					  isFreshing = false;
    				  },
    			      beforeclose: function(){
    				  },
    				  beforeshow:function(){
    					 
    				  },
    				  close:function(){
    					  isFreshing = true;
    				  },
    				  hide:function(){
    					  isFreshing = true;
    				  },
    				  afterrender:function(){
    					  addterInfoPanel(data,dataError);
    				  }
    		}
       	,buttons : [{
    			xtype : 'button',
    			text : getIi18NText('jsp_close'),
    			handler:function(){
    				terInfoPanel.hide();
    			}
    	   }]
    		          
    	});
	  	terInfoPanel.show();
	  	isFreshing = false;
    	}
    	
    }

    function getTerLogData(){
    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	Ext.Ajax.request({
	    	   url: 'terminal!getTerminalLogFile.action'
	    	  ,method: 'post' 
	    	  ,params: {id: globalTid}
    		  ,timedout:120000
	    	  ,success: function(response){
	    		  Ext.getBody().unmask();
	    		  isFreshing = true;
	    		  var result =eval('(' + response.responseText + ')');
	    		  if(result.code=='0'){
  		        	window.location.href =getWebPath()+ "/page/terminal/monitor/log/"+ result.msg;
  		        }else{
  		        	 Ext.Msg.alert(getIi18NText('systemMessage'), result.msg);
  		    		 return;
  		        }
	    	  },
	    	  failure: function(response, opts) {
    			  Ext.getBody().unmask();
    			  isFreshing = true;
    			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    		    }
 	});
    }
    function changeItem(ctype){
    	var chatype;
    	if(ctype=="playItem"){
    		chatype=1;
    	}else{
    		chatype=0;
    	}
    	Ext.getBody().mask(getIi18NText("monitor_message_37"));
    	Ext.Ajax.request({
    		url: 'terminal!changeItemStatus.action'
    		,method: 'post' 
    		,params: {id: globalTid,t:chatype}
    		,timedout:120000
    		,success: function(response){
    			Ext.getBody().unmask();
    			isFreshing = true;
    			var result =eval('(' + response.responseText + ')');
    			if(result.code=='0'){
    				if(ctype=="playItem"){
    					Ext.getCmp("stop_iem").show();
    					Ext.getCmp("play_iem").hide();
    				}else{
    					Ext.getCmp("play_iem").show();
    					Ext.getCmp("stop_iem").hide();
    				}
    				Ext.Msg.alert(getIi18NText('systemMessage'), result.msg);
    			}else{
    				Ext.Msg.alert(getIi18NText('systemMessage'), result.msg);
    				return;
    			}
    		},
    		failure: function(response, opts) {
    			Ext.getBody().unmask();
    			isFreshing = true;
    			Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
    		}
    	});
    }
    
    function changePanel(){
    	Ext.getCmp("");
    }
    //调整音量
    function updateVolume(){
    	Ext.getBody().unmask(getIi18NText('update_volume'));
    	Ext.getCmp('terInfoPanel').mask(getIi18NText('update_volume'));
    	var volume  = parseInt(Ext.getCmp("rate_slider").getValue());
    	if(volume>100||volume<0){
    		Ext.getCmp('terInfoPanel').unmask();
    		Ext.getBody().unmask();
    		Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('value_is_null'));
    		return ;	
    	}
    	Ext.Ajax.request({
		    	   url: 'terminal!updateVolume.action'
		    	  ,method: 'post' 
		    	  ,timeout:60000
		    	  ,params: {tid: globalTid, volume: volume , t: 17}
		    	  ,callback: function(opt, success, res){
		    		  Ext.getCmp('terInfoPanel').unmask();
		    		  Ext.getBody().unmask();
					  var result =eval('(' + res.responseText + ')');
  		        	  Ext.Msg.alert(getIi18NText('systemMessage'), result.msg);
		    	  }
    	});
    }
    //----------------------渲染图片变灰

    function imgToGray(){
//    	var imgObjs = document.getElementsByName('imgToGary3');   
//    	//alert(imgObj.length);
//    	if(typeof(imgObjs)!="undefined"&&imgObjs.length>0){
//    		for(var i=0;i<imgObjs.length;i++){
//    			var obj = imgObjs[i];
//    			obj.src = gray(obj); 
//    		}
//    	}
    }

	//----------------变灰结束
    
    //预览截屏
   openScreenImg = function(terid ,stateImg){
   	    var imgsrc = null;
      	var values = cardPanelMap.getValues();
      	var store = terminalGrid.getStore();
		for(var i =0;i<store.getCount();i++){
			var ter = store.getAt(i) //遍历每一行
			if(ter.get("terId")==terid){
				imgsrc = ter.get("imgsrc");
				break;
			}
		}
		var img = new Image();
		img.src = imgsrc;
		img.className = "imgToGary"+stateImg;
		if(img.width==72&&img.height==72){
			 Ext.example.msg(getIi18NText('upload_tip_systip'), getIi18NText("noScreen")); //加载截图失败！
			return;
		}
		img.onload = function(){
			showScreenImg(terid, imgsrc , img.width, img.height ,img.className);
		};
		img.onerror=function(){
			 Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("monitor_message_61")); //加载截图失败！
		};
   }
   // 修改终端名称
   function updateTerName(){
   		var terName = Ext.getCmp('showTerminalName').getValue();
   		Ext.getBody().unmask(getIi18NText('update_terName'));
    	Ext.getCmp('terInfoPanel').mask(getIi18NText('update_terName'));
    	if(terName==''||terName==null){
    		Ext.getCmp('terInfoPanel').unmask();
    		Ext.getBody().unmask();
    		Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('terName_is_null'));
    		return ;	
    	}
    	Ext.Ajax.request({
		    	   url: 'terminal!updateTerName.action'
		    	  ,method: 'post' 
		    	  ,timeout:60000
		    	  ,params: {tid: globalTid, terName: terName , t: 18}
		    	  ,callback: function(opt, success, res){
		    		  Ext.getCmp('terInfoPanel').unmask();
		    		  Ext.getBody().unmask();
					  var result =eval('(' + res.responseText + ')');
  		        	  Ext.Msg.alert(getIi18NText('systemMessage'), result.msg);
		    	  }
    	});
   		
   }
   //导出数据到excel
   function exportStatistics(){
  	 if(dataStore.data.length==0){
  		 Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText('jsp_noExportData'));
  		 return;
  	 }
  	 
	  	isFreshing = false;
	    var way = Ext.getCmp('switchCombo').getValue();
	    var group=new Array() ;
	    //判断是那个界面的终端组
	    var contentId = cardPanelMap.get(cardMapKeys[tabCtr]);
		var contentPanel = Ext.getCmp(contentId);
		var contentLayout = contentPanel.up('container').getLayout();
		var nowCmp = contentLayout.getActiveItem();
		var values = cardPanelMap.getValues();
		if(values.indexOf(contentId) > values.indexOf(nowCmp.id)){
			//图形界面，只能查询一个组
			var groupName= Ext.getCmp('allGroup_combo').getValue();
			group.push(groupName);
		}else{
			//条形界面。 允许多个终端组
			var treePanel = Ext.getCmp("terminalGroup");
			var nodeInterfaces = treePanel.getChecked();
			for(var i =0; i<nodeInterfaces.length; i++){
				if(nodeInterfaces[i].raw['nid']==0){ //如果是全部分组，group就设定为-1，查包括共享的所有 
					group=new Array() ;
					group.push(-1);
					break;
				}
				group.push(nodeInterfaces[i].raw['nid']);
			}
			group = group.join(',');
		}
	    var state = Ext.getCmp('stateCombo').getValue();
	    var name = Ext.getCmp("searchTextId").getValue();
//	    var authType = Ext.getCmp("typeCombo").getValue();
	    var authType = 0;
  	 
  	 //Ext.getBody().mask(getIi18NText('monitor_message_58'));
  	 Ext.Ajax.request({
  		    url: 'terminal!exportTerminalData.action',
  		    timeout: 1800000,
  		    params: {w: way, g: group, n: encode(name), t: state, a:authType},
  		    success: function(response){
  		    	Ext.getBody().unmask();
  		        var text =eval('(' + response.responseText + ')'); ;
  		        if(text.code=='0'){
  		        	window.location.href =getWebPath()+ "/page/statistics/statistics/export/"+ text.msg;
  		        }else{
  		        	 Ext.Msg.alert(getIi18NText('systemMessage'), text.msg);
  		    		 return;
  		        }
  		    },
  		    failure: function(response){
  		    	Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText("timeout"));
  		    	Ext.getBody().unmask();
  		    }
  		    
  		});
   }
   //导入excel数据
   function putin(){
	   if(!ttshow){
		   ttshow = Ext.create('Ext.window.Window',{
				  title: getIi18NText("terinput")
				  ,plain: true
				  ,width: 600
				  ,height: 300
				  ,border: false
				  ,frame: false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
				  ,listeners: {
					  hide:function(){
						  $("#showfu").empty();
						  $("#messshow").empty();
					  }
				  }
	           ,layout: 'fit'
	           ,bodyCls: 'x_panel_backDD'
	           ,items:[{
		         	      xtype: 'panel',
		           		  html: '<div id="allmess"><form id="sendexcel" method="post" action="terminal!putinExcel.action">'
		           			  +'<input type="file" id="fileName" name="fileName" />'
		           			  +'</form>'
		           			  +'<table id="showfu" width=500 align=center border=1 bgcolor="#000000" cellspacing=0 cellpadding=0>'
		           			  +'</table>'
		           			  +'<div id="messshow"></div></div>'
	                  }
	           ],
	           buttonAlign:'center',
	           buttons:[
	               {
	                   text:getIi18NText('upsend'),
	                   handler:function(){
	                	   $("#showfu").empty();
						   $("#messshow").empty();
	                	   var val = $("#fileName").val();
	                	   if(val==""){
	                		   Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('filenonull'));
	                		   return;
	                	   }
	                	   var ajax_option={  
	                		        url:"terminal!putinExcel.action",//form 的action  
	                		        type:"post",  //form 的method方法  
	                		        contentType: "application/x-www-form-urlencoded; charset=utf-8",   //设置编码集  
	                		        success:function(response){  //表单提交成功后执行的函数  
	                		        	if(response.code==0){
	                		        			var refuse = response.msg;
	                		        			var splits = refuse.split(";");
	                		        			for(var i=0;i<splits.length-1;i++){
	                		        				if(i==0){
	                		        					$('#showfu').append('<tr bgcolor="#FFFFFF"><td>id</td><td>name</td><td>ip</td><td>MAC</td>'
	                		        							+'<td>screen</td><td>owner</td><td>remark</td></tr>');
	                		        				}
	                		        				var putin = splits[i].split(",");
	                		        				$('#showfu').append('<tr bgcolor="#FFFFFF"><td>'+putin[0]+'</td><td>'+putin[1]+'</td><td>'+putin[2]+'</td><td>'+putin[3]+'</td>'
	            		        							+'<td>'+putin[4]+'</td><td>'+putin[5]+'</td><td>'+putin[6]+'</td></tr>');
	                		        			}
	                		        			if(refuse==""){
	                		        				$('#messshow').append(getIi18NText('upsuccess'));
	                		        			}else{
	                		        				$('#messshow').append(getIi18NText('issave'));
	                		        			}
	                		        			recordIds.removeAll();
	                		        			refreshMonitarData();
	            	    	        	  }else{
	            	    	        		  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("filefail"));
	            	    	        	  }
	                		        },
	                		        failure: function(response){
	                			    	Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText("timeout"));
	                			    }
	                		    }  
	                	   $('#sendexcel').ajaxSubmit(ajax_option); 
	                   }
	               },
	               {
	                   text:getIi18NText('cancel'),
	                   handler:function(){
	                	   ttshow.hide();
	                   }
	               }
	           ]
		   }).show();
	   }else{
		   ttshow.show();
	   }
	}
   //跳转到https环境链接
   function toHttps(){
	   var url = basePath+"auth!indexPage.action";
	   url = url.replace("http","https"); 
	   if(url.indexOf("8586")>-1){
		   url = url.replace("8586","8589"); 
	   }else if(url.indexOf("8080")>-1){
		   url = url.replace("8080","8589"); 
	   }
	   top.location=url;
   }
});
