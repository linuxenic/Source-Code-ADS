
var operationFn;
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var viewport,gridPanel,dataStore,ajaxProxy,addInfoWin;

	// 权限
//	var  AUTH = Ext.merge({"delete": false , add : false , update : false ,"self":true,admin:false}, Ext.decode(decode(AUTH_TBAR)));
	var  AUTH = {"delete": true , add : true , update : true ,"self":true,admin:true};
	// 是否是英文
	var isEng = window.top.getIi18NText('confirm') == 'OK' ? true:false;

	// 默认起始时间
    var date = new Date();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    if ((date.getMonth() + 1) < 10) {
        month = "0" + (date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
        day = "0" + date.getDate();
    }
    //结束时间值
    var current = date.getFullYear() + "/" + month + "/" + day;
    //开始时间值
    var currentBegin = date.getFullYear() + "/" + month + "/01";
    
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
 	 /**
 	  * 显示上方提示
 	  */
	 function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
	
	viewport=Ext.create("Ext.container.Viewport",{
		layout:'border',
		renderTo:Ext.getBody(),
		border:false,
		style:'background:white',
		items:[{
		    region: 'north',
		    height: 40
		    ,width: 400
		    ,id: 'northContanier'
		    ,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
		    ,bodyCls: 'x_panel_backDD'
	    	,border:false
	    	,style:'border-width: 0px;'
		    ,items: [{
		            	xtype: 'image',
		            	src: '',
		            	width: 40,
		            	height: 24,
		            	imgCls: 'searchIconCss'			    	           
		            },{
    	            	 fieldLabel: window.top.getIi18NText('status')
					    ,labelAlign: 'right'
					    ,xtype: 'combobox'
					    ,store: [[-1,getIi18NText('allType')],
					             [1,getIi18NText('waiting')],
					             [2,getIi18NText('executing')],
					             [3,getIi18NText('ending')],
					             [4,getIi18NText('paused')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 130
		                ,editable: false
					    ,queryMode: 'local'
					    ,name: 'status'
					    ,maxLength: 50
					    ,id: 'searchStatus'
					    ,value:2
	            	},{
    	            	 fieldLabel: window.top.getIi18NText('type')
					    ,labelAlign: 'right'
					    ,xtype: 'combobox'
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('devices')],
					             [2,getIi18NText('single')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 160
		                ,editable: false
					    ,queryMode: 'local'
					    ,name: 'way'
					    ,maxLength: 50
					    ,id: 'searchWay'
	            	},{
			            fieldLabel: window.top.getIi18NText('name')
			            ,id: 'searchText'
			            ,labelAlign: 'right'
					    ,xtype: 'textfield'
					    ,maxLength: 60
					    ,width: 200
					    ,labelWidth: 40
					    ,emptyText: getIi18NText('priceStrategy')+' '+getIi18NText('name')
					    ,enforceMaxLength: true
		    	      },{
						    xtype: 'datefield',
						    fieldLabel: getIi18NText("companyInfo10"),
						    margin:'8 0 5 8',
						    name: 'btime'
						    ,labelWidth: isEng == true?66:40
						    ,editable: false
						    ,format: 'Y/m/d'
						    ,width: isEng == true?175:150
						   ,id: 'btime'
						   ,emptyText: getIi18NText("startTime")
						   ,value:currentBegin
						},{
						    xtype: 'datefield',
						    name: 'etime'
						    ,labelWidth: 50
						    ,margin:'0 7 0 2'
						    ,id: 'etime'
						    ,width: 110
						    ,editable: false
						    ,format: 'Y/m/d'
						    ,emptyText: getIi18NText("endTime")
						    ,value:current
						},{
	        	        xtype: 'button'
	        	       ,id: 'queryBut'
	        	       ,iconCls: 'queryIconCss'
		    		   ,text:  window.top.getIi18NText('select')
		    		   ,handler: queryFun
		    		  }]
				    },{ 
					    region: 'center'
					    ,border: false
					    ,layout: 'fit'
					    ,listeners: {
		            	   render: renderTable
		            	}
				    }]		
	});

	/**
	 * 获取价格策略列表
	 */
	function renderTable($this, eopt){
		ajaxProxy =  getAjaxProxy({url: 'activity!getTerminalPriceStrategy.action',
			extraParams:{tid:tid,b:currentBegin+' 00:00:00',e:current+' 23:59:59',status:2}});
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","name","status","way","timeScope","dctType","dctValue","startTime",
						"endTime","goodsIds","createTime","creator","timeScopeValue"
						,"satStatus"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy :ajaxProxy
		});
		    
	    gridPanel=Ext.create("Ext.grid.Panel",{
		    frame: false,
		    store: dataStore,
	    	frame : false,
			border:false,
			forceFit : true,
			autoScroll:true,
		    columns: {
				items :[{text :getIi18NText('Noo'),width : 60,xtype : 'rownumberer',align : 'center'},
				        {text :'id',dataIndex :'id',minWidth:80,hidden:true},
				        {text :getIi18NText('name'),dataIndex : 'name',minWidth:80},
				        {text :getIi18NText('status'),dataIndex : 'status',minWidth:70,renderer:statusRender},
				        {text :getIi18NText('preferentialWay'),dataIndex : 'way',minWidth:120,renderer:wayRender},
						{text :getIi18NText('timeIntervals'),dataIndex : 'timeScope',minWidth:80,renderer:timeScopeRender},
						{text :getIi18NText('dstType'),dataIndex : 'dctType',minWidth:120,renderer:dctTypeRender},
						{text :getIi18NText('companyInfo10'),dataIndex : 'timeType',minWidth:140,renderer:timeRender},
						{text :getIi18NText('createTime'),dataIndex : 'createTime',minWidth:60,renderer:datefmtRender},
//						{text :getIi18NText('changedTime'),dataIndex :'lastTime',minWidth:60,renderer:datefmtRender},
						{text :getIi18NText('operation'),dataIndex :'',minWidth: 110, maxWidth: 130,renderer:adviceTimeRenderFn},
					],
				defaults : {
					menuDisabled : true,
					sortable :false,
					draggable: false,
					align : 'center'
				}
		    },
            bbar: [{
            	id:'padingBar',
                xtype: 'pagingtoolbar',
                store: dataStore,
                border:false,
                displayInfo: true                 
            }],
		    margin: 1
		   ,viewConfig: {
			   trackOver: false
			   ,disableSelection: false
			   ,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
		   }
		});
			
		$this.add(gridPanel);
	}
	/**
	 * 查询价格策略
	 */
	function queryFun(but){
    	   var btime = Ext.getCmp('btime');
    	   if(!btime.isValid()){
    		   showTip(but, window.top.getIi18NText('startTimeErr'));
    		   return;
    	   }
    	   var etime = Ext.getCmp('etime');
    	   if(!etime.isValid()){
    		   showTip(but, window.top.getIi18NText('endTimeErr'));
    		   return;
    	   }
    	   if(!Ext.isEmpty(etime.getValue()) && !Ext.isEmpty(btime.getValue())){
    		      if(btime.getValue() > etime.getValue()){
    		    	   showTip(but, window.top.getIi18NText('timesErrWarming'));    		    	  
    		    	   return;
    		      }
    	   }
    	  
    	   ajaxProxy.setExtraParam("status", Ext.getCmp('searchStatus').getValue());
    	   ajaxProxy.setExtraParam("way", Ext.getCmp('searchWay').getValue());
	       ajaxProxy.setExtraParam("n", encode(Ext.getCmp('searchText').getValue()));
		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),'Y/m/d 23:59:59'));
		   dataStore.loadPage(1);   	   
     } 

	// TODO 可点击菜单		renderer: adviceTimeRenderFn
	function adviceTimeRenderFn(value,metaData,record,rIndex,cIndex){
		var ctrlHtml = '<ul class="ctrlULCls">';
	 	// 暂停
//	 	if(AUTH["pause"]){
 		var status = record.get("satStatus");
 		var activityStatus = record.get("status");
	 	if(status == 1 && activityStatus == 2){
	 		ctrlHtml += '<li class="maginTop"><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+')" title="'+getIi18NText('paused')+'">'+getIi18NText('paused')+'</a></li>';
	 	}
	 	if(status == 4){
	 		ctrlHtml += '<li class="maginTop"><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+')" title="'+getIi18NText('monitor_message_51')+'">'+getIi18NText('monitor_message_51')+'</a></li>';
	 	}
//	 	}
	 	ctrlHtml += '</ul>';
	 	return ctrlHtml;
	}
	
	operationFn = function(t,rIndex){
		var record = gridPanel.getStore().getAt(rIndex);
		var status = record.get("satStatus");
		var newStatus = 4;
		if(status == 4){
			newStatus = 1;
		}
		var id = record.get("id");
//		console.log(record,tid);
		Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
	           msg:getIi18NText(status == 4?'enableTips':'pauseTips', "<font color=red>" + record.get("name") + "</font>")
			 ,animateTarget: t, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('confirm'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'activity!updateTerminalPriceStrategyStatus.action'
					    ,params: {id: id,status:newStatus}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  var result = showResult(success,response);				        	  
				        	  Ext.getBody().unmask();
				        	  if(result.code != 0) return;
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'),result.msg);
				        	  queryFun();
				        }
				   });
			   }
		}});
	}

    /**
     * 时间格式渲染
     */
	function  datefmtRender(value){
    	   return  Ext.Date.format(new Date(value), dateFormat);
    }
	
	/**
	 * 状态渲染	1:待执行；2:执行中；3：已结束；4：暂停；
	 */
	function statusRender(value,metaData,record,rIndex,cIndex){
		var str = "";
		switch(value){
			case 1:
				str = '<font color="red">'+getIi18NText('waiting')+'</font>';
				break;
			case 2:
				str = '<font color="orange">'+getIi18NText('executing')+'</font>';
				break;
			case 3:
				str = '<font color="gray">'+getIi18NText('ending')+'</font>';
				break;
			case 4:
				str = '<font color="blue">'+getIi18NText('paused')+'</font>';
				break;
			default :
				break;
		}
		return str;
	}
	 
	/**
	 * 优惠方式渲染。1:整机优惠；2:单品优惠
	 */
	function wayRender(value,metaData,record,rIndex,cIndex){
		 if (value == 1) {
			  	return '<font color="green">'+getIi18NText('devices')+'</font>';
			 } else if (value == 2) {
			  	return getIi18NText('single');
			 }
		}
	 
	/**
	 * 时段渲染；1:全部时段；2:部分时段
	 */
	function timeScopeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
	  		 return '<font color="orange">'+getIi18NText('coupon15')+'</font>';
		 } else {
			 return getIi18NText('allDay');
		 }
	}
	/**
	 * 折扣类型渲染；1:打折；2:立减
	 */
	function dctTypeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="blue">'+getIi18NText('subtract')+'</font>';
		 } else {
			 return getIi18NText('discount');
		 }
	}
	/**
	 * 有效期渲染
	 */
	function  timeRender(value,m,r){
    	 return  Ext.Date.format(new Date(r.get('startTime')), dateFormat)+'<br/>'+getIi18NText("to")+'<br/>'+Ext.Date.format(new Date(r.get('endTime')), dateFormat);
	}
});
