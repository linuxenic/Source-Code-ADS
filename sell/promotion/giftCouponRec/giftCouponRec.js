
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
		    //,id: 'northContanier'
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
					    //,id: 'searchStatus'
					    ,value:2
					    ,hidden:true
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
					   // ,id: 'searchWay'
				    	,hidden:true
	            	},{
			            fieldLabel: window.top.getIi18NText('giftCouponCode')
			            ,id: 'searchCode'
			            ,labelAlign: 'right'
					    ,xtype: 'textfield'
					    ,maxLength: 60
					    ,width: 200
					    ,labelWidth: 40
					    ,emptyText: getIi18NText('giftCouponCode')
					    ,enforceMaxLength: true
		    	      },{
						    xtype: 'datefield',
						    fieldLabel: getIi18NText("useTime"),
						    margin:'8 0 5 8',
						    name: 'btime'
						    ,labelWidth: 55
						    ,editable: false
						    ,format: 'Y/m/d'
						    ,width: 170
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
		ajaxProxy =  getAjaxProxy({url: 'activity!getGiftCouponRec.action',
			extraParams:{b:currentBegin+' 00:00:00',e:current+' 23:59:59',code:''}});
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","coupon","createTime","cost","price","tname","type","tid","status",
						"tcode"],
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
				        {text :getIi18NText('giftCouponCode'),dataIndex : 'coupon',minWidth:120},
				        {text :getIi18NText('type'),dataIndex : 'type',minWidth:80,renderer:typeRender},
						{text :getIi18NText('status'),dataIndex : 'status',minWidth:80,renderer:statusRender},
						{text :getIi18NText('costAmount'),dataIndex : 'cost',minWidth:80},
				        {text :getIi18NText('giftCouponAmount'),dataIndex : 'price',minWidth:80},
				        {text :getIi18NText('useTime'),dataIndex : 'createTime',minWidth:140,renderer:datefmtRender},
				        {text :getIi18NText('deviceNo'),dataIndex : 'tcode',minWidth:100},
				        {text :getIi18NText('deviceName'),dataIndex : 'tname',minWidth:100},
						
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
    	  
	       ajaxProxy.setExtraParam("code", encode(Ext.getCmp('searchCode').getValue()));
		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),'Y/m/d 23:59:59'));
		   dataStore.loadPage(1);   	   
     } 

	// TODO 可点击菜单		renderer: adviceTimeRenderFn
	function adviceTimeRenderFn(value,metaData,record,rIndex,cIndex){
		var ctrlHtml = '<ul class="ctrlULCls">';
		ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+')" title="'+getIi18NText('shipmentDetails')+'">'+getIi18NText('shipmentDetails')+'</a></li>';
	 	ctrlHtml += '</ul>';
	 	return ctrlHtml;
	}
	
	// 查询出货详情数据源设置	TODO
	var detailsProxy =  getAjaxProxy({url: 'activity!getGiftCouponDetails.action',
		extraParams:{id:0}});
	var detailsStore=Ext.create('Ext.data.Store', {
		fields : ["code","gname","gcost","gunit","total","shouldout","relout"],
		buffered : false,
		autoLoad : false,
		pageSize : 10,
		leadingBufferZone : 50,
		proxy :detailsProxy
	});
	var detailsWin = Ext.create('Ext.window.Window', {
        title: getIi18NText("shipmentDetails")
        , id: 'detailsWindow'
        , plain: true
        , hidden: true
        , width: 600
        , height: 300
        , minWidth: 300
        , minHeight: 100
        , style: 'border-width:0px; background:transparent'
        , border: false
        , modal: true
        , constrain: true
        , resizable: false
        , closeAction: 'hide'
        , layout: 'fit'
        , items: [
                  {
                	  xtype:'gridpanel',
            		  frame: false,
            		  store: detailsStore,
            		  frame : false,
            		  border:false,
            		  forceFit : true,
            		  autoScroll:true,
            		  columns: {
            				items :[{text :getIi18NText('Noo'),width : 60,xtype : 'rownumberer',align : 'center'},
            				        {text :getIi18NText('goods_num'),dataIndex : 'code',minWidth:100},
            				        {text :getIi18NText('terGoodsName'),dataIndex : 'gname',minWidth:100},
            						{text :getIi18NText('goodsCosts'),dataIndex : 'gcost',minWidth:80},
            						{text :getIi18NText('goodsUnit'),dataIndex : 'gunit',minWidth:80},
//            				        {text :getIi18NText('giftCouponAmount'),dataIndex : 'total',minWidth:80},s
            				        {text :getIi18NText('shouldOuts'),dataIndex : 'shouldout',minWidth:80},
            				        {text :getIi18NText('relOut'),dataIndex : 'relout',minWidth:80},
            					],
            				defaults : {
            					menuDisabled : true,
            					sortable :false,
            					draggable: false,
            					align : 'center'
            				}
            		    },
            	        bbar: [{
            	            xtype: 'pagingtoolbar',
            	            store: detailsStore,
            	            border:false,
            	            displayInfo: true                 
            	        }],
            		    margin: 1
            		   ,viewConfig: {
            			   trackOver: false
            			   ,disableSelection: false
            			   ,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
            		   }
                  }]
                  
	});
		
	operationFn = function(t,rIndex){
		var record = gridPanel.getStore().getAt(rIndex);
		var status = record.get("satStatus");
		
		var id = record.get("id");
		
		detailsProxy.setExtraParam("id", id);
		detailsStore.loadPage(1);
		Ext.getCmp('detailsWindow').show();
		
	}

    /**
     * 时间格式渲染
     */
	function  datefmtRender(value){
    	   return  Ext.Date.format(new Date(value), dateFormat);
    }
	
	/**
	 * 状态渲染	0：异常，1：已使用
	 */
	function statusRender(value,metaData,record,rIndex,cIndex){
		var str = "";
		switch(value){
			case 0:
				str = '<font color="red">'+getIi18NText('abnormal')+'</font>';
				break;
			case 1:
				str = '<font color="black">'+getIi18NText('used')+'</font>';
				break;
			default :
				break;
		}
		return str;
	}
	 
	/**
	 * 券码类型。1：面包券
	 */
	function typeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 1) {
		  	return '<font color="gray">'+getIi18NText('breadCoupon')+'</font>';
		 } else {
			 return '';
		 }
	}
});
