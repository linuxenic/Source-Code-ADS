Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var viewport,gridPanel,dataStore,ctrColumn,ajaxProxy,addInfoWin,id,handleId;
	var selectTer = [],selectUserArr = [],selectGoodsArr = [],selectCGoodsArr = [];
	var selectTerWin,selectUserWin,selectGoodsWin,selectCGoodsWin,nowChoose;
	var  AUTH = Ext.merge({"delete": false , add : false , update : false ,"self":true,admin:false}, Ext.decode(decode(AUTH_TBAR)));
	var isEng = window.top.getIi18NText('confirm') == 'OK' ? true:false;
	//console.log("isEng",isEng);
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	
	 //创建对象
 	 Ext.define('terObject', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'terId', type: 'int'},
	         {name: 'name',  type: 'String'},
	         {name: 'terNum',  type: 'String'}
	     ]
	 });
 	 Ext.define('userObject', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'id', type: 'int'},
	         {name: 'nickname',  type: 'String'},
	         {name: 'userCode',  type: 'String'}
	     ]
	 });
 	 Ext.define('goodsObject', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'id', type: 'int'},
	         {name: 'name',  type: 'String'},
	         {name: 'code',  type: 'String'}
	     ]
	 });
	
	 function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
	
	ctrColumn =  { text: window.top.getIi18NText('operation'),  minWidth: 110, maxWidth: 130, menuText: window.top.getIi18NText('operation'), menuDisabled: true, 
					   hidden: true,  sortable: false,draggable: false, resizable: false,xtype: 'actioncolumn', items:[]};
	if(AUTH["update"]){
		 ctrColumn.items.push({
		 	        iconCls: 'editIconCss'
		    	   ,tooltip : window.top.getIi18NText('modify')
		    	   ,handler:  editInfoFu
		 });
		 ctrColumn.hidden = false;
	}
	if(AUTH["delete"]){
		ctrColumn.items.push({
	    	       iconCls: 'removeIconCss'
	        	   ,tooltip: window.top.getIi18NText('delete')
	        	   ,handler:  removeInfoFu
	    });
		ctrColumn.hidden = false;
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
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('monitor_message_51')],[2,getIi18NText('paused')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 130
		                ,editable: false
					    ,queryMode: 'local'
					    ,name: 'pstate'
					    ,maxLength: 50
					    ,id: 'searchstate'
	            	},{
    	            	 fieldLabel: window.top.getIi18NText('type')
					    ,labelAlign: 'right'
					    ,xtype: 'combobox'
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('bindPhone')],
					             [2,getIi18NText('buyLunch')],[3,getIi18NText('buyBreakfast')],
					             [4,getIi18NText('signContract')],[5,getIi18NText('discountActivity')],
					    			[6,getIi18NText('cutActivity')],[7,getIi18NText('combinedActivity')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 160
		                ,editable: false
					    ,queryMode: 'local'
					    ,name: 'pstate'
					    ,maxLength: 50
					    ,id: 'searchType'
	            	},{
    	            	 fieldLabel: window.top.getIi18NText('terScope')
					    ,labelAlign: 'right'
					    ,xtype: 'combobox'
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('allTer')],[2,getIi18NText('someTer')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 140
		                ,hidden:true
		                ,editable: false
					    ,queryMode: 'local'
					    ,name: 'pstate'
					    ,maxLength: 50
					    ,id: 'searchScope'
	            	},{
			            fieldLabel: window.top.getIi18NText('name')
			            ,id: 'searchTextId'
			            ,labelAlign: 'right'
					    ,xtype: 'textfield'
					    ,maxLength: 60
					    ,width: 200
					    ,labelWidth: 40
					    ,emptyText: getIi18NText('name')+","+getIi18NText('couponName')
					    ,enforceMaxLength: true
		    	      },{//add by kevin 根据时间查询优惠券信息 2018/9/6
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
		
	function renderTable($this, eopt){
		ajaxProxy =  getAjaxProxy({url: 'shared!getAllActivityList.action'});
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","name","used","type","abatement","discount","scope","status","stime","etime","mtime","cid","cname","code",
			          "total","frequency","userScope","goodsScope","cutTime","maxCutMoneyEach","useValidDate"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy :ajaxProxy
			,listeners: {}
		});
		    
	    gridPanel=Ext.create("Ext.grid.Panel",{
		    title:window.top.getIi18NText('activityList'),
		    iconCls: 'tabIconCss',
		    frame: false,
		    store: dataStore,
	    	frame : false,
			border:false,
			forceFit : true,
			autoScroll:true,
		    columns: {
				items :[{
						text : window.top.getIi18NText('Noo'),
						width : 60,
						xtype : 'rownumberer'
						,align : 'center'
					}, {
						text :getIi18NText('name'),
						dataIndex : 'name'
						,minWidth:80
					}, {
						text :window.top.getIi18NText('status'),
						dataIndex : 'status'
						,minWidth:70
						,renderer:statusRender
					}, {
						text :window.top.getIi18NText('type'),
						dataIndex : 'type'
						,minWidth:120
						,renderer:typeRender
					}, {
						text :window.top.getIi18NText('terScope'),
						dataIndex : 'scope'
						,minWidth:80
						,renderer:scopeRender
					}, {
						text :window.top.getIi18NText('couponName'),
						dataIndex : 'cname'
						,minWidth:120
					}, {
						text :window.top.getIi18NText('combine'),
						dataIndex : 'abatement'
						,minWidth:60
					},{
						text :window.top.getIi18NText('discount'),
						dataIndex : 'discount'
						,minWidth:60
					}, {
						text :window.top.getIi18NText('maxStock'),
						dataIndex : 'total'
						,minWidth:80
					}, {
						text :window.top.getIi18NText('used'),
						dataIndex : 'used'
						,minWidth:80
					},ctrColumn, {
						text :window.top.getIi18NText('companyInfo10'),
						dataIndex : 'timeType',
						minWidth:140,
						renderer:timeRender
					}, {
						text :window.top.getIi18NText('lastUpdateTime'),
						dataIndex : 'mtime',
						minWidth:140,
						renderer:datefmtRender
					}
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
		   ,tools:[{
					    xtype:'button',
					    tooltip: window.top.getIi18NText('addCoupons'),
					    tooltipType: 'title',
			            text: window.top.getIi18NText('add'),
			            border: false,
			            hidden: !AUTH["add"],
			            iconCls: 'addIconCss',
			            margin: '0 5 0 0',
			            handler:openInfoWin //打开添加窗口
		      		},{
					    xtype:'button',
					    tooltipType: 'title',
			            text: window.top.getIi18NText('refresh'),
			            border: false,
			            iconCls: 'refreshIconCss',
					    handler: queryFun
				    }
		   ]
		   ,viewConfig: {
			   trackOver: false
			   ,disableSelection: false
			   ,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
		   }
		});
			
		$this.add(gridPanel);
	}
	
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
    	  
    	   ajaxProxy.setExtraParam("type", Ext.getCmp('searchType').getValue());
//    	   ajaxProxy.setExtraParam("scope", Ext.getCmp('searchScope').getValue());
    	   ajaxProxy.setExtraParam("status", Ext.getCmp('searchstate').getValue());
	       ajaxProxy.setExtraParam("n", encode(Ext.getCmp('searchTextId').getValue()));
		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),'Y/m/d 23:59:59'));
		   dataStore.loadPage(1);   	   
     } 
	
     //修改信息 
    function editInfoFu(v,r,c,i,e,record,row){
    	 openInfoWin(row,record.get("id"),record);
    }
     //添加窗口
    function openInfoWin(btn,tid,record){
    	id = tid;
    	selectTer = new Array();
    	selectCTer = new Array();
    	selectUserArr = new Array();
    	selectGoodsArr = new Array();
    	selectCGoodsArr = new Array();
    	var beforecloseFn = function(){
    		selCGoodsGrid.getStore().removeAll();//关闭窗口时清空选择副商品表格的所有数据
    		selGoodsGrid.getStore().removeAll();//关闭窗口时清空选择商品表格的所有数据
    		selectTer = [];
        	selectCTer = [];
        	selectUserArr = [];
        	selectGoodsArr = [];
        	selectCGoodsArr = [];
	    	Ext.getCmp("activityType").setDisabled(false);
	    	Ext.getCmp("activityName").setValue(null);
	    	Ext.getCmp("activityStatus").setValue(1);
	    	Ext.getCmp("activityType").setValue(1);
	    	Ext.getCmp("terScope").setValue(1);
	    	Ext.getCmp("activityCoupon").setValue(null);
	    	Ext.getCmp("activityBtime").setValue(null);
	    	Ext.getCmp("activityEtime").setValue(null);
			Ext.getCmp('userScope').setValue(1);
			Ext.getCmp('goodsScope').setValue(1);
			Ext.getCmp('fgoodsScope').setValue(2);
			Ext.getCmp('sgoodsScope').setValue(2);
			Ext.getCmp('abatement').setValue(null);
			Ext.getCmp('discount').setValue(null);
			Ext.getCmp('discountStock').setValue(null);
			Ext.getCmp("discountStock").setMinValue(0);
			// 活动人数
    		Ext.getCmp("activityNumEachFood").setValue(null);
    		Ext.getCmp("activityNumEachFood").setDisabled(false);
	    	// 砍价限时
	    	Ext.getCmp('cutTime').setValue(null);
	    	Ext.getCmp("cutTime").setDisabled(false);
	    	// 每个用户单次最大砍价金额
    		Ext.getCmp('eachUserMaxCutMoney').setValue(null);
    		// 砍价活动完成后 使用的有效期
    		Ext.getCmp('useValidDate').setValue(null);
    		Ext.getCmp("useValidDate").setDisabled(false);
    		addInfoWin.hide(btn);
    	};
    	var showFn = function(){
			if(/^\d+$/.test(tid)){//修改娃娃机
				addInfoWin.setTitle(getIi18NText('updateActivity'));
				editCallback(record);
			} else {
	    		rightStore.getProxy().setExtraParam("id", id);
	        	rightStore.load();
	    		selUserStore.getProxy().setExtraParam("id", id);
	        	selUserStore.load();
	    		selGoodsStore.getProxy().setExtraParam("id", id);
	        	selGoodsStore.load();
	        	couponStore.load();
				addInfoWin.setTitle(getIi18NText('addActivity'));
			}
		};
		
		if(addInfoWin && addInfoWin.isWindow){
			addInfoWin.clearListeners( );
			addInfoWin.addListener("beforeclose", beforecloseFn);
			addInfoWin.addListener("show", showFn);
			addInfoWin.show(btn);
			return;
		}
    	addInfoWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('addActivity')
				  ,plain: true
				  ,width: 580
				  ,minWidth: 200
				  ,minHeight: 180
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
                  ,layout: 'fit'
                  ,bodyCls: 'x_panel_backDD'
                  ,items:[{
                  	xtype: 'form'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,defaults:{margin:'20 0 0 20'}
				   	,border: false
				   	,items:[{                 	
							xtype : 'panel',
							layout:'column',
							border : false,
							defaults:{labelAlign:'right'},
							items : [{
										xtype : 'textfield',
										id : 'activityName',
										fieldLabel :'<font color="red"> * </font>'+getIi18NText('name'),
										editable : false,
										labelWidth :60,
										width : 220,
										maxlength:50,
										emptyText:getIi18NText('enterName'),
										allowBlank : false
								},{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('type'),
									editable : false,
									id : 'activityType',
									labelWidth :60,
									margin:'0 0 0 40',
									width : 220,
									value:1,
									store : [[1,getIi18NText('bindPhone')],[2,getIi18NText('buyLunch')],[3,getIi18NText('buyBreakfast')],[4,getIi18NText('signContract')],[5,getIi18NText('discountActivity')]
										,[6,getIi18NText('cutActivity')],[7,getIi18NText('combinedActivity')]],
									allowBlank : false
									,listeners:{
										change : function ($this,newValue,oldValue,e) {
											Ext.getCmp('terScope').show();
											Ext.getCmp('cutUseValidDatePanel').hide();
											if (newValue == 1) {
												Ext.getCmp('terScope').setValue(1);
												Ext.getCmp('terScope').setDisabled(true);
											} else {
												Ext.getCmp('terScope').setDisabled(false);
											}
											if (newValue == 5) {
												Ext.getCmp('discountPanel1').show();
												Ext.getCmp('discountPanel2').show();
												Ext.getCmp('discountPanel3').show();
												Ext.getCmp('discountPanel4').hide();
												Ext.getCmp('discountPanel5').hide();
												Ext.getCmp('abatement').hide();
												Ext.getCmp('activityCoupon').hide();
												Ext.getCmp('activityNumEachFood').hide();
												Ext.getCmp('discount').show();
												Ext.getCmp('cutMoneyPanel').hide();
											} 
											// 砍价活动 add by	ZL 2018.07.10
											else if (newValue == 6) {
												Ext.getCmp('discountPanel1').hide();
												Ext.getCmp('discountPanel2').hide();
												Ext.getCmp('discountPanel3').show();
												Ext.getCmp('discountPanel4').hide();
												Ext.getCmp('discountPanel5').hide();
												Ext.getCmp('activityCoupon').hide();
												Ext.getCmp('discount').hide();
												Ext.getCmp('abatement').hide();
//												Ext.getCmp('terScope').show();
												Ext.getCmp('activityNumEachFood').show();
												Ext.getCmp('cutMoneyPanel').show();
												Ext.getCmp('cutUseValidDatePanel').show();
											}else if (newValue == 7) {
												//TODO
												Ext.getCmp('discountPanel1').show();
												Ext.getCmp('discountPanel2').show();
												Ext.getCmp('discountPanel3').hide();
												Ext.getCmp('discountPanel4').show();
												Ext.getCmp('discountPanel5').show();
												Ext.getCmp('abatement').show();
												Ext.getCmp('discount').hide();
												Ext.getCmp('activityCoupon').hide();
												Ext.getCmp('activityNumEachFood').hide();
												Ext.getCmp('cutMoneyPanel').hide();
											}else {
												Ext.getCmp('discountPanel1').hide();
												Ext.getCmp('discountPanel2').hide();
												Ext.getCmp('discountPanel3').hide();
												Ext.getCmp('discountPanel4').hide();
												Ext.getCmp('discountPanel5').hide();
												Ext.getCmp('abatement').hide();
												Ext.getCmp('activityCoupon').show();
												Ext.getCmp('activityNumEachFood').hide();
												Ext.getCmp('discount').hide();
												Ext.getCmp('cutMoneyPanel').hide();
											}
										}
									}
								}]						
              		},{                 	
						xtype : 'panel',
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									id : 'activityStatus',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('status'),
									editable : false,
									labelWidth :60,
									width : 220,
									value:1,
									store : [[1,getIi18NText('monitor_message_51')],[2,getIi18NText('paused')]],
									allowBlank : false
							},{
								xtype : 'combo',
								fieldLabel : '<font color="red"> * </font>'+getIi18NText('coupon'),
								editable : false,
								id : 'activityCoupon',
								labelWidth :60,
								margin:'0 0 0 40',
								width : 220,
								queryMode:'remote',
								value : '',
								store : couponStore,
								displayField :'cname',
								emptyText:getIi18NText('chooseCoupon'),
								valueField:'id',
								typeAhead : true,//允许自动选择匹配项  经过延时typeAheadDelay后
								allowBlank : true
								,listConfig: {
							        loadingText: getIi18NText("weather03")
							        ,emptyText: '<font style="line-height: 22px; margin-left: 3px;font-size:12px;">'+getIi18NText("coupon_search_null")+'</font>'
							    }
						
							},{
								xtype:'numberfield',
								id:'discount',
								fieldLabel:'<font color="red"> * </font>'+getIi18NText('discount'),
								width:220,
								hidden:true,
								labelWidth:60,
							    margin:'0 0 0 40',
								minValue:0,
								maxValue:10,
								labelAlign:'right',
								decimalPrecision: 1,
								allowBlank:true,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:window.top.getIi18NText('discount')
							},{
								xtype:'numberfield',
								id:'abatement',
								fieldLabel:'<font color="red"> * </font>'+getIi18NText('abatement'),
								width:220,
								hidden:true,
								labelWidth:60,
							    margin:'0 0 0 40',
								minValue:0,
								//maxValue:10,
								labelAlign:'right',
								decimalPrecision: 1,
								allowBlank:true,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:window.top.getIi18NText('abatement')
							},{
								xtype:'numberfield',
								id:'activityNumEachFood',
								fieldLabel:'<font color="red"> * </font>'+getIi18NText('personLimit'),
								width:220,
								hidden:true,
								labelWidth:isEng == true?80:60,
							    margin:'0 0 0 40',
								minValue:1,
								maxValue:10000,
								labelAlign:'right',
								decimalPrecision: 1,
								allowBlank:true,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:getIi18NText('personLimit')
							}]						
              		},{           	
						xtype : 'panel',
						id:'cutMoneyPanel',
						hidden:true,
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
						        xtype: 'numberfield',
						        fieldLabel:'<font color="red">*</font>'+getIi18NText('cutTime')
						       ,labelWidth: isEng == true?100:95
						       ,width: 220
						       ,allowBlank:true
						   	   ,editable:true
//						   	   ,hidden:true
						       ,id: 'cutTime'
					    	   ,minValue:1
					    	   ,maxValue:10000
					    	   ,decimalPrecision: 1
						       ,emptyText: getIi18NText('cutTime')
						    },{
							     xtype: 'numberfield'
							    ,fieldLabel:'<font color="red">*</font>'+getIi18NText('maxCutPerson')
							    ,id: 'eachUserMaxCutMoney'
						    	,minValue:0
						    	,maxValue:10000
							    ,labelWidth: isEng == true?100:85
							    ,allowBlank:true
							    ,editable:true
							    ,margin:'0 0 0 40'
						       	,width: 220
							    ,emptyText: getIi18NText('maxCutPerson')
						 }]
              		},
              		{           	
						xtype : 'panel',
						id:'cutUseValidDatePanel',
						hidden:true,
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
						        xtype: 'numberfield',
						        fieldLabel:'<font color="red">*</font>'+getIi18NText('useVaidDate')
						       ,labelWidth: isEng == true?120:95
						       ,width: isEng == true?280:250
						       ,allowBlank:true
						   	   ,editable:true
//						   	   ,hidden:true
						       ,id: 'useValidDate'
					    	   ,minValue:1
					    	   ,maxValue:10000
					    	   ,decimalPrecision: 1
						       ,emptyText: getIi18NText('useVaidDate')
						    }
//						    ,{
//							     xtype: 'numberfield'
//							    ,fieldLabel:'<font color="red">*</font>'+getIi18NText('maxCutPerson')
//							    ,id: 'eachUserMaxCutMoney'
//						    	,minValue:0
//						    	,maxValue:10000
//							    ,labelWidth: isEng == true?100:85
//							    ,allowBlank:true
//							    ,editable:true
//							    ,margin:'0 0 0 40'
//						       	,width: 220
//							    ,emptyText: getIi18NText('maxCutPerson')
//						    }
						    ]
              		},{           	
						xtype : 'panel',
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
						        xtype: 'datefield',
						        fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('startTime')
						       ,labelWidth: 60
						       ,width: 220
						       ,allowBlank:false
						   	   ,editable:true
						       ,id: 'activityBtime'
						       ,emptyText: window.top.getIi18NText('startTime')
						       ,format:dateFormat
						    },{
							     xtype: 'datefield'
							    ,fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('endTime')
							    ,id: 'activityEtime'
							    ,labelWidth: 60
							    ,allowBlank:false
							    ,editable:true
							    ,margin:'0 0 0 40'
						       	,width: 220
							    ,emptyText: window.top.getIi18NText('endTime')
							    ,format: dateFormat
//							    ,listeners: {
//							    	select: function($this){
//							    		var temdate = $this.getValue();
//							    		temdate.setHours(23, 59, 59);
//							    		$this.setValue(temdate);
//							    	}
//					            }
						 }]
              		},{     	
						xtype : 'panel',
						id:'discountPanel1',
						hidden:true,
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('frequency'),
									editable : false,
									id : 'discountFrequency',
									labelWidth :60,
									width : 220,
									value:1,
									store : [[1,getIi18NText('frequency1')],[2,getIi18NText('frequency2')]],
									allowBlank : false
							},{
								xtype:'numberfield',
								id:'discountStock',
								fieldLabel:window.top.getIi18NText('maxStock'),
								width:220,
								labelWidth:60,
							    margin:'0 0 0 40',
								minValue:0,
								labelAlign:'right',
								allowDecimals: false,
								allowBlank:true,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:window.top.getIi18NText('count')
							}]						
              	
              		},{
						xtype : 'panel',
						id:'discountPanel2',
						hidden:true,
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('userScope'),
									editable : false,
									id : 'userScope',
									labelWidth :60,
									width : 220,
									value:1,
									store : [[1,getIi18NText('allUser')],[2,getIi18NText('someUser')]],
									allowBlank : false
									,listeners:{
										change : function ($this,newValue,oldValue,e) {
											if (newValue == 1) {
												Ext.getCmp('chooseUser').hide();
											} else {
												Ext.getCmp('chooseUser').show();
											}
										}
									}
							},{
								xtype : 'button',
								text : getIi18NText('chooseUser'),
								id:'chooseUser',
								margin:'0 0 0 40',
								hidden:true,
								border : true,
								handler:openSelectUserWin
							}]		
              		},{
						xtype : 'panel',
						id:'discountPanel3',
						layout:'column',
						hidden:true,
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('goodsScope'),
									editable : false,
									id : 'goodsScope',
									labelWidth :isEng == true?90:60,
									width : 220,
									value:1,
									store : [[1,getIi18NText('allGoods')],[2,getIi18NText('someGoods')]],
									allowBlank : false
									,listeners:{
										change : function ($this,newValue,oldValue,e) {
											if (newValue == 1) {
												Ext.getCmp('chooseGoods').hide();
											} else {
												Ext.getCmp('chooseGoods').show();
											}
										}
									}
							},{
								xtype : 'button',
								text : getIi18NText('chooseGoods'),
								id:'chooseGoods',
								margin:'0 0 0 40',
								hidden:true,
								border : true,
								handler:openSelectGoodsWin
							}]		
              		},{
						xtype : 'panel',
						id:'discountPanel4',
						layout:'column',
						hidden:true,
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('fgoodsScope'),
									editable : false,
									id : 'fgoodsScope',
									labelWidth :isEng == true?90:60,
									width : 220,
									value:2,
									store : [[2,getIi18NText('someGoods')]],
									allowBlank : false
									/*,listeners:{
										change : function ($this,newValue,oldValue,e) {
											if (newValue == 1) {
												Ext.getCmp('fchooseGoods').hide();
											} else {
												Ext.getCmp('fchooseGoods').show();
											}
										}
									}*/
							},{
								xtype : 'button',
								text : getIi18NText('chooseGoods'),
								id:'fchooseGoods',
								margin:'0 0 0 40',
								hidden:false,
								border : true,
								handler:openSelectGoodsWin
							}]		
              		},{
						xtype : 'panel',
						id:'discountPanel5',
						layout:'column',
						hidden:true,
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype : 'combo',
									fieldLabel : '<font color="red"> * </font>'+getIi18NText('sgoodsScope'),
									editable : false,
									id : 'sgoodsScope',
									labelWidth :isEng == true?90:60,
									width : 220,
									value:2,
									store : [[2,getIi18NText('someGoods')]],
									allowBlank : false
									/*,listeners:{
										change : function ($this,newValue,oldValue,e) {
											if (newValue == 1) {
												Ext.getCmp('schooseGoods').hide();
											} else {
												Ext.getCmp('schooseGoods').show();
											}
										}
									}*/
							},{
								xtype : 'button',
								text : getIi18NText('chooseGoods'),
								id:'schooseGoods',
								margin:'0 0 0 40',
								hidden:false,
								border : true,
								handler:openSelectGoodsWin
							}]		
              		},{
                  		xtype : 'panel',
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
								xtype : 'combo',
								fieldLabel : '<font color="red"> * </font>'+getIi18NText('terScope'),
								editable : false,
								id : 'terScope',
								disabled:true,
								labelWidth :60,
								width : 220,
								value : 1,
								store : [[1,getIi18NText('allTer')],[2,getIi18NText('someTer')]],
								allowBlank : false,
								listeners:{
									change : function ($this,newValue,oldValue,e) {
										if (newValue == 1) {
											Ext.getCmp('chooseTer').hide();
										} else {
											Ext.getCmp('chooseTer').show();
										}
									}
								}
						},{
							xtype : 'button',
							text : getIi18NText('chooseTer'),
							id:'chooseTer',
							hidden:true,
							margin:'0 0 0 40',
							border : true,
							handler:openSelectTerWin
						}]
                  	}]
       			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'20 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						id:'savebt',
						formBind:true,
						border : true,
						iconCls:'pback_finish_IconCls',
						handler:saveInfo
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
							addInfoWin.close();
							queryFun;
						}
					}]
				}]
                 }]
               ,listeners:{
               		beforeclose: beforecloseFn,
					show:showFn
               }
        }).show(btn);
    }
    
    //修改回显
    function editCallback(r){
    	console.log("r---->",r)
    	//"id","name","type","scope","status","stime","etime","mtime","cid","cname","code","frequency","userScope","goodsScope","abatement","fgoodsScope","sgoodsScope"
    	id = r.get("id");//当前微信id 
    	var terScope = r.get("scope");
    	var type = r.get("type");
    	//console.log(type,r);
    	Ext.getCmp("activityName").setValue(r.get("name"));
    	Ext.getCmp("activityType").setValue(type);
    	if (terScope == 2) {//部分终端
    		rightStore.getProxy().setExtraParam("id", id);
        	rightStore.load();
    	}
    	if (type == 5) {
    		Ext.getCmp("discountFrequency").setValue(r.get("frequency"));
	    	Ext.getCmp("discountStock").setValue(r.get("total"));
	    	Ext.getCmp("discountStock").setMinValue(r.get("used"));
	    	Ext.getCmp("discount").setValue(r.get("discount"));
	    	var userScope = r.get("userScope");
	    	var goodsScope = r.get("goodsScope");
	    	Ext.getCmp("userScope").setValue(userScope);
	    	Ext.getCmp("goodsScope").setValue(goodsScope);
	    	if (userScope == 2) {//部分用户
	    		selUserStore.getProxy().setExtraParam("id", id);
            	selUserStore.load();
	    	}
	    	if (goodsScope == 2) {//部分商品
	    		selGoodsStore.getProxy().setExtraParam("id", id);
            	selGoodsStore.load();
	    	}
    	} 
    	// 砍价活动回显
    	else if (type == 6) {
    		// 活动人数
    		Ext.getCmp("activityNumEachFood").setValue(r.get("total"));
    		// 不能修改 砍价限时
	    	Ext.getCmp("activityNumEachFood").setDisabled(true);
    		// 商品
	    	var goodsScope = r.get("goodsScope");
	    	Ext.getCmp("goodsScope").setValue(goodsScope);
	    	if (goodsScope == 2) {//部分商品
	    		selGoodsStore.getProxy().setExtraParam("id", id);
            	selGoodsStore.load();
	    	}
	    	// 砍价限时
	    	Ext.getCmp('cutTime').setValue(r.get("cutTime"));
	    	// 不能修改 砍价限时
	    	Ext.getCmp("cutTime").setDisabled(true);
	    	// 每个用户单次最大砍价金额
    		Ext.getCmp('eachUserMaxCutMoney').setValue(r.get("maxCutMoneyEach"));
    		
    		// 砍价活动完成后 使用的有效期
    		Ext.getCmp('useValidDate').setValue(r.get("useValidDate"));
	    	// 不能修改 砍价限时
	    	Ext.getCmp("useValidDate").setDisabled(true);
    	}
    	//套餐活动回显
    	else if (type == 7) {
    		//TODO
    		Ext.getCmp("discountFrequency").setValue(r.get("frequency"));
    		Ext.getCmp("discountStock").setValue(r.get("total"));
    		Ext.getCmp("discountStock").setMinValue(r.get("used"));
    		Ext.getCmp("abatement").setValue(r.get("abatement"));
    		var userScope = r.get("userScope");
    		var fgoodsScope = r.get("goodsScope");
    		var sgoodsScope = r.get("goodsScope");
    		Ext.getCmp("userScope").setValue(userScope);
	    	Ext.getCmp("fgoodsScope").setValue(fgoodsScope);
	    	Ext.getCmp("sgoodsScope").setValue(sgoodsScope);
	    	
    		if (userScope == 2) {//部分用户
	    		selUserStore.getProxy().setExtraParam("id", id);
            	selUserStore.load();
	    	}
	    	if (fgoodsScope == 2) {//部分商品
	    		selGoodsStore.getProxy().setExtraParam("id", id);
            	selGoodsStore.load();
	    	}
	    	if (sgoodsScope == 2) {//部分商品
	    		selCGoodsStore.getProxy().setExtraParam("id", id);
            	selCGoodsStore.load();
	    	}
		}
    	else {
    		Ext.getCmp("activityCoupon").setValue(r.get("cid"));
    	}
    	Ext.getCmp("activityStatus").setValue(r.get("status"));
    	Ext.getCmp("terScope").setValue(terScope);
    	Ext.getCmp("activityBtime").setValue(new Date(r.get("stime")));
    	Ext.getCmp("activityEtime").setValue(new Date(r.get("etime")));
    	Ext.getCmp("activityType").setDisabled(true);
    }
    
//TODO----------三个已选择数据临时保存模块--------------------------------
//    var selTerIds = new Ext.util.MixedCollection();	
	
	//左侧勾选终端
	var checkBoxTer = Ext.create('Ext.selection.CheckboxModel', {  
     	listeners : {  
        	'select' : selectTers  
//       		,'deselect' : deselects
     	}  
	});
	//勾选左侧终端添加到右侧
	function selectTers(me, record) {
		
//		if (!selTerIds.contains(record.get('terId'))) {
//		     selTerIds.add(record.get('terId'),record);  
//		 }
		
		for(var i=0;i<selectTer.length;i++){			    				   
			 if(selectTer[i].get('terId')==record.get('terId')){
				 return;
			 }
		 }
		var ter = Ext.create('terObject', {
			   terId: record.get("terId"),  
			   name:record.get("name"),
			   terNum:record.get("terNum")
		 });
		selectTer.push(ter);
    	selGrid.getStore().removeAll();
	    selGrid.getStore().add(selectTer);
	    var len=selectTer.length;
		Ext.getCmp('showSelected').setValue(len); 
		
		
	}
    
//    var selUserIds = new Ext.util.MixedCollection();	
	
	//左侧勾选用户
	var checkBoxUser = Ext.create('Ext.selection.CheckboxModel', {  
     	listeners : {  
        	'select' : selectUsers  
//       		,'deselect' : deselects
     	}  
	});
	//勾选左侧用户添加到右侧
	function selectUsers(me, record) {
		
//		if (!selUserIds.contains(record.get('id'))) {
//		     selUserIds.add(record.get('id'),record);  
//		 }
		
		for(var i=0;i<selectUserArr.length;i++){			    				   
			 if(selectUserArr[i].get('id')==record.get('id')){
				 return;
			 }
		 }
	 	var ter = Ext.create('userObject', {
			   id: record.get("id"),  
			   nickname:record.get("nickname"),
			   userCode:record.get("userCode")
		 });
		selectUserArr.push(ter);
    	selUserGrid.getStore().removeAll();
	    selUserGrid.getStore().add(selectUserArr);
	    var len=selectUserArr.length;
		Ext.getCmp('showUserSelected').setValue(len); 
	}
    
//    var selGoodsIds = new Ext.util.MixedCollection();	
	
	//左侧勾选商品
	var checkBoxGoods = Ext.create('Ext.selection.CheckboxModel', {  
     	listeners : {  
        	'select' : selectGoods,  
//       		,'deselect' : deselects
     	}  
	});
	//勾选左侧商品添加到右侧
	function selectGoods(me, record) {
		if (record.length <= 0) {
			return
		}
//		if (!selGoodsIds.contains(record.get('id'))) {
//		     selGoodsIds.add(record.get('id'),record);  
//		 }
		if (handleId == "chooseGoods" || handleId == "fchooseGoods") {
			for(var i=0;i<selectGoodsArr.length;i++){			    				   
				 if(selectGoodsArr[i].get('id')==record.get('id')){
					 return;
				 }
			 }
			var ter = Ext.create('goodsObject', {
				   id: record.get("id"),  
				   name:record.get("name"),
				   code:record.get("code")
			 });
			if (handleId == "fchooseGoods") {
				if (selectGoodsArr.length > 0) {
					selectGoodsArr = [];
				}
			}
			selectGoodsArr.push(ter);
	    	selGoodsGrid.getStore().removeAll();
		    selGoodsGrid.getStore().add(selectGoodsArr);
		    var len = selectGoodsArr.length;
			Ext.getCmp('showGoodsSelected').setValue(len);
		} else if (handleId == "schooseGoods") {
			for(var i=0;i<selectCGoodsArr.length;i++){			    				   
				 if(selectCGoodsArr[i].get('id')==record.get('id')){
					 return;
				 }
			 }
		 	var ter = Ext.create('goodsObject', {
				   id: record.get("id"),  
				   name:record.get("name"),
				   code:record.get("code")
			 });
		 	if (selectCGoodsArr.length > 0) {
				selectCGoodsArr = [];
			}
			selectCGoodsArr.push(ter);
	    	selCGoodsGrid.getStore().removeAll();
		    selCGoodsGrid.getStore().add(selectCGoodsArr);
		    var clen = selectCGoodsArr.length;
			Ext.getCmp('showCGoodsSelected').setValue(clen);
		}
	 	
	}
	
//TODO-------------三个总数据模块---------------------------------------------------
     //所有终端数据
    var leftStore= Ext.create('Ext.data.Store', {
			fields : ['terId', 'name', 'groupName', "terNum",'stateValue', 'ip',
						'screen', 'authType','owner'],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'activity!getAllTerminal.action',
				extraParams:{t:-1,g:-1,w:1,a:0},
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
			,listeners: {
 	       		load:function($this){
 	    	    	 //翻页多选
		            var arry = [];  
		            $this.each(function(record) {
		            	var dataid=record.data.terId;
						for (var i = 0; i < selectTer.length; i++) {
							if (dataid == selectTer[i].get('terId')) {
								arry.push(record); 
							}
						}
		            });
			        checkBoxTer.select(arry, true);
				}
 	       } 
		});
    //所有终端表格
    var terGrid=Ext.create('Ext.grid.Panel', {
			    store:leftStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    selModel:checkBoxTer,
			    forceFit : true,
			    columns: [
			     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('terminalName'),dataIndex: 'name', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			        ,{ text: getIi18NText('terNum'),dataIndex: 'terNum', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			     ],
//			    border:false,
			    bbar : [{
							xtype : 'pagingtoolbar',
							store : leftStore,
							border : false,
							displayMsg:getIi18NText('confirm')=='OK'?'total:{2}':'共{2}条',
							displayInfo : false
						}],
			    viewConfig : {
					trackOver : false,
					disableSelection : false,
					emptyText : '<h1 style="margin:10px">'
							+ window.top.getIi18NText('roleTip05') + '</h1>'
				}
		});
     //所有用户数据
    var allUserStore= Ext.create('Ext.data.Store', {
			fields : ["id","openid","url","nickname","state","type","latest","isNewApp","userCode","phone"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'activity!getAllWechatUsers.action',
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
			,listeners: {
 	       		load:function($this){
 	       			
 	    	    	 //翻页多选
		            var arry = [];  
		            $this.each(function(record) {
						checkBoxUser.deselect(record,true);
		            	var dataid=record.data.id;
						for (var i = 0; i < selectUserArr.length; i++) {
							if (dataid == selectUserArr[i].get('id')) {
								arry.push(record); 
							}
						}
		            });
			        checkBoxUser.select(arry, true);
				}
 	       } 
		});
    //所有用户表格
    var allUserGrid=Ext.create('Ext.grid.Panel', {
			    store:allUserStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    selModel:checkBoxUser,
			    bodyStyle: 'background: white',
			    forceFit : true,
			    columns: [
			     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' }
			     	,{ text: getIi18NText('wechatName'),dataIndex: 'nickname', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    	,{ text: getIi18NText('userCode'),dataIndex: 'userCode', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			     ],
//			    border:false,
			    bbar : [{
						xtype : 'pagingtoolbar',
						store : allUserStore,
						border : false,
						displayMsg:getIi18NText('confirm')=='OK'?'total:{2}':'共{2}条',
						displayInfo : false
					}],
			    viewConfig : {
					trackOver : false,
					disableSelection : false,
					emptyText : '<h1 style="margin:10px">'
							+ window.top.getIi18NText('roleTip05') + '</h1>'
				}
		});
     //所有商品数据
    var allGoodsStore= Ext.create('Ext.data.Store', {
			fields : ['id','name',"costPrice",'price','url', 'remark', 'latest', 'code', 'creator','content','brandName'
				                 ,'mealType'],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'source!getAllGoodsInfo.action',
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
			,listeners: {
 	       		load:function($this){
 	    	    	 //翻页多选
 	       			if (handleId == "chooseGoods" || handleId == "fchooseGoods") {
	 	       			var arry = [];  
			            $this.each(function(record) {
	 	       				checkBoxGoods.deselect(record,true);
			            	var dataid=record.data.id;
							for (var i = 0; i < selectGoodsArr.length; i++) {
								if (dataid == selectGoodsArr[i].get('id')) {
									arry.push(record); 
								}
							}
			            });
//		            	console.info('已选择商品',arry);
				        checkBoxGoods.select(arry, true);
					}else if (handleId == "schooseGoods") {
						var cArry = [];  
			            $this.each(function(record) {
	 	       				checkBoxGoods.deselect(record,true);
			            	var dataid=record.data.id;
							for (var i = 0; i < selectCGoodsArr.length; i++) {
								if (dataid == selectCGoodsArr[i].get('id')) {
									cArry.push(record); 
								}
							}
			            });
//		            	console.info('已选择商品',arry);
				        checkBoxGoods.select(cArry, true);
					}
		            
				}
 	       } 
		});
    //所有商品表格
    var allGoodsGrid=Ext.create('Ext.grid.Panel', {
			    store:allGoodsStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    selModel:checkBoxGoods,
			    forceFit : true,
			    columns: [
			     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' }
			     	,{ text: getIi18NText('goods_nm'),dataIndex: 'name', width:90, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    	,{ text: getIi18NText('goodsCode'),dataIndex: 'code', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			     ],
//			    border:false,
			    bbar : [{
						xtype : 'pagingtoolbar',
						store : allGoodsStore,
						border : false,
						displayMsg:getIi18NText('confirm')=='OK'?'total:{2}':'共{2}条',
						displayInfo : false
					}],
			    viewConfig : {
					trackOver : false,
					disableSelection : false,
					emptyText : '<h1 style="margin:10px">'
							+ window.top.getIi18NText('roleTip05') + '</h1>'
				}
		});
    //所有副商品表格
    var allCGoodsGrid=Ext.create('Ext.grid.Panel', {
	    store:allGoodsStore,
	    height: 335,
	    width: '100%',
	    selType:'checkboxmodel',
	    bodyStyle: 'background: white',
	    selModel:checkBoxGoods,
	    forceFit : true,
	    columns: [
	     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' }
	     	,{ text: getIi18NText('goods_nm'),dataIndex: 'name', width:90, menuDisabled: true,align : 'center',sortable:false, draggable: false }
	    	,{ text: getIi18NText('goodsCode'),dataIndex: 'code', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
	     ],
//	    border:false,
	    bbar : [{
				xtype : 'pagingtoolbar',
				store : allGoodsStore,
				border : false,
				displayMsg:getIi18NText('confirm')=='OK'?'total:{2}':'共{2}条',
				displayInfo : false
			}],
	    viewConfig : {
			trackOver : false,
			disableSelection : false,
			emptyText : '<h1 style="margin:10px">'
					+ window.top.getIi18NText('roleTip05') + '</h1>'
		}
});
	
//TODO-------------三个已选择数据模块---------------------------------------------------
		
	//已选终端数据
	var rightStore= Ext.create('Ext.data.Store', {
		fields : ['terId','terNum', 'name'],
		buffered : false,
		autoLoad : true,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'shared!getBindTerminalByActivity.action',
			extraParams:{id:id,type:1},
			reader : {
				type : 'json',
				root : 'data',
				tiemout : 30000,
				totalProperty : 'totalCount'
			}
		}
		,listeners: {
			load:function($this){
	            $this.each(function(record) {
		        	var ter = Ext.create('terObject', {
						   terId: record.data.terId,  
						   name:record.data.name,
						   terNum:record.data.terNum
					 });
					 selectTer.push(ter);
	            });	            
			    Ext.getCmp('showSelected').setValue($this.totalCount);
			}
		}
	});	
	//已选设备表格
    var selGrid=Ext.create('Ext.grid.Panel', {
			    store:rightStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    forceFit : true,
			    columns: [
			      	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('terminalName'),dataIndex: 'name', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			        ,{ text: getIi18NText('terNum'),dataIndex: 'terNum', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    ],
			    bbar : [{			    		
						id: 'showSelected',
						xtype:'displayfield',
						fieldLabel:getIi18NText('checked'),
						value: 0,
						labelWidth: 50,
						width: 100					
			    	},{
			    		xtype:'tbfill'
			    	 },{
						xtype : 'button',
						margin : '0 20 0 10',
						text : getIi18NText('delete'),
						align : 'right',
						border : true,
						handler:function(){
							var recs=[];
							var temo=[];
							recs=selGrid.getSelectionModel().getSelection();
							if(recs.length==0){
								return;
							}		
							for(var j=0;j<recs.length;j++){
								for(var m=0;m<selectTer.length;m++){
									if(selectTer[m].get('terId') != recs[j].get('terId')){
										temo.push(selectTer[m]);
									}
								}
								selectTer = new Array();
								selectTer = temo;
								temo = new Array();
								
//								selTerIds.removeAtKey(recs[j].get('terId')); 
							}
							leftStore.loadPage(1);
							selGrid.getStore().removeAll();
							selGrid.getStore().add(selectTer);
							var len=selectTer.length;
							Ext.getCmp('showSelected').setValue(len); 
						}
					 }]
		});
	//已选用户数据
	var selUserStore= Ext.create('Ext.data.Store', {
		fields : ['id','nickname', 'userCode'],
		buffered : false,
		autoLoad : true,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'shared!getBindTerminalByActivity.action',
			extraParams:{id:id,type:3},
			reader : {
				type : 'json',
				root : 'data',
				tiemout : 30000,
				totalProperty : 'totalCount'
			}
		}
		,listeners: {
			load:function($this){
	            $this.each(function(record) {
		        	var user = Ext.create('userObject', {
						   id: record.data.id,  
						   nickname:record.data.nickname,
						   userCode:record.data.userCode
					 });
					 selectUserArr.push(user);
	            });	            
			    Ext.getCmp('showUserSelected').setValue($this.totalCount);
			}
		}
	});	
	//已选用户表格
    var selUserGrid=Ext.create('Ext.grid.Panel', {
			    store:selUserStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    forceFit : true,
			    columns: [
			      	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('wechatName'),dataIndex: 'nickname', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			        ,{ text: getIi18NText('userCode'),dataIndex: 'userCode', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    ],
			    bbar : [{			    		
						id: 'showUserSelected',
						xtype:'displayfield',
						fieldLabel:getIi18NText('checked'),
						value: 0,
						labelWidth: 50,
						width: 100					
			    	},{
			    		xtype:'tbfill'
			    	 },{
						xtype : 'button',
						margin : '0 20 0 10',
						text : getIi18NText('delete'),
						align : 'right',
						border : true,
						handler:function(){
							var recs=[];
							var temo=[];
							recs=selUserGrid.getSelectionModel().getSelection();
							if(recs.length==0){
								return;
							}							
							
							for(var j=0;j<recs.length;j++){
								for(var m=0;m<selectUserArr.length;m++){
									if(selectUserArr[m].get('id') != recs[j].get('id')){
										temo.push(selectUserArr[m]);
									}
								}
								selectUserArr = new Array();
								selectUserArr = temo;
								temo = new Array();
								
//								selUserIds.removeAtKey(recs[j].get('id')); 
							}
//							allUserStore.load();
							allUserStore.loadPage(1);
							selUserGrid.getStore().removeAll();
							selUserGrid.getStore().add(selectUserArr);
							var len=selectUserArr.length;
							Ext.getCmp('showUserSelected').setValue(len); 
						}
					 }]
		});
	//已选商品数据
	var selGoodsStore= Ext.create('Ext.data.Store', {
		fields : ['id','name', 'code'],
		buffered : false,
		autoLoad : true,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'shared!getBindTerminalByActivity.action',
			extraParams:{id:id,type:2},
			reader : {
				type : 'json',
				root : 'data',
				tiemout : 30000,
				totalProperty : 'totalCount'
			}
		}
		,listeners: {
			load:function($this){
	            $this.each(function(record) {
		        	var goods = Ext.create('goodsObject', {
						   id: record.data.id,  
						   name:record.data.name,
						   code:record.data.code
					 });
					 selectGoodsArr.push(goods);
	            });
			    Ext.getCmp('showGoodsSelected').setValue($this.totalCount);
			    
			}
		}
	});	
	//已选套餐商品数据
	var selCGoodsStore= Ext.create('Ext.data.Store', {
		fields : ['id','name', 'code'],
		buffered : false,
		autoLoad : true,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'shared!getBindTerminalByActivity.action',
			extraParams:{id:id,type:2,handler:2},
			reader : {
				type : 'json',
				root : 'data',
				tiemout : 30000,
				totalProperty : 'totalCount'
			}
		}
		,listeners: {
			load:function($this){
	            $this.each(function(record) {
		        	var goods = Ext.create('goodsObject', {
						   id: record.data.id,  
						   name:record.data.name,
						   code:record.data.code
					 });
					 selectCGoodsArr.push(goods);
					 
	            });	
			    Ext.getCmp('showCGoodsSelected').setValue($this.totalCount);
			}
		}
	});	
	
	//已选商品表格
    var selGoodsGrid=Ext.create('Ext.grid.Panel', {
			    store:selGoodsStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    forceFit : true,
			    columns: [
			      	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('goods_nm'),dataIndex: 'name', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			        ,{ text: getIi18NText('goodsCode'),dataIndex: 'code', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    ],
			    bbar : [{			    		
						id: 'showGoodsSelected',
						xtype:'displayfield',
						fieldLabel:getIi18NText('checked'),
						value: 0,
						labelWidth: 50,
						width: 100					
			    	},{
			    		xtype:'tbfill'
			    	 },{
						xtype : 'button',
						margin : '0 20 0 10',
						text : getIi18NText('delete'),
						align : 'right',
						border : true,
						handler:function(){
							var recs=[];
							var temo=[];
							recs = selGoodsGrid.getSelectionModel().getSelection();
							if(recs.length==0){
								return;
							}							
							
							for(var j=0;j<recs.length;j++){
								for(var m=0;m<selectGoodsArr.length;m++){
									if(selectGoodsArr[m].get('id') != recs[j].get('id')){
										temo.push(selectGoodsArr[m]);
									}
								}
								selectGoodsArr = new Array();
								selectGoodsArr = temo;
								temo = new Array();
								
//								selGoodsIds.removeAtKey(recs[j].get('id')); 
							}
							allGoodsStore.loadPage(1);
							selGoodsGrid.getStore().removeAll();
							selGoodsGrid.getStore().add(selectGoodsArr);
							var len=selectGoodsArr.length;
							Ext.getCmp('showGoodsSelected').setValue(len); 
						}
					 }]
		});
  //已选副商品表格
    var selCGoodsGrid=Ext.create('Ext.grid.Panel', {
			    store:selCGoodsStore,
			    height: 335,
			    width: '100%',
			    selType:'checkboxmodel',
			    bodyStyle: 'background: white',
			    forceFit : true,
			    columns: [
			      	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('goods_nm'),dataIndex: 'name', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			        ,{ text: getIi18NText('goodsCode'),dataIndex: 'code', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
			    ],
			    bbar : [{			    		
						id: 'showCGoodsSelected',
						xtype:'displayfield',
						fieldLabel:getIi18NText('checked'),
						value: 0,
						labelWidth: 50,
						width: 100					
			    	},{
			    		xtype:'tbfill'
			    	 },{
						xtype : 'button',
						margin : '0 20 0 10',
						text : getIi18NText('delete'),
						align : 'right',
						border : true,
						handler:function(){
							var recs=[];
							var temo=[];
							recs = selCGoodsGrid.getSelectionModel().getSelection();
							if(recs.length==0){
								return;
							}							
							
							for(var j=0;j<recs.length;j++){
								for(var m=0;m<selectCGoodsArr.length;m++){
									if(selectCGoodsArr[m].get('id') != recs[j].get('id')){
										temo.push(selectCGoodsArr[m]);
									}
								}
//								selectCGoodsArr = [];
								selectCGoodsArr = temo;
								temo = [];
								
//								selGoodsIds.removeAtKey(recs[j].get('id')); 
							}
							allGoodsStore.loadPage(1);
							selCGoodsGrid.getStore().removeAll();
							selCGoodsGrid.getStore().add(selectCGoodsArr);
							var len=selectCGoodsArr.length;
							Ext.getCmp('showCGoodsSelected').setValue(len); 
						}
					 }]
		});
	

//TODO-------------三个窗口模块---------------------------------------------------
		
	//勾选终端窗口
	function openSelectTerWin (btn) {
		nowChoose = 1;
    	var beforecloseFn = function(){
    		selectTerWin.hide(btn);
    		Ext.getCmp('searchTextId3').setValue("");
    		leftStore.proxy.setExtraParam("n", "");
    	};
    	var showFn = function(){
	        leftStore.loadPage(1);
		};
		
		if(selectTerWin && selectTerWin.isWindow){
			selectTerWin.clearListeners( );
			selectTerWin.addListener("beforeclose", beforecloseFn);
			selectTerWin.addListener("show", showFn);
			selectTerWin.show(btn);
			return;
		}
    	selectTerWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseTer')
				  ,plain: true
				  ,width: 750
				  ,minWidth: 200
				  ,minHeight: 300
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
                  ,layout: 'fit'
                  ,bodyCls: 'x_panel_backDD'
                  ,items:[{
                  	xtype: 'form'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,defaults:{margin:'10 0 0 0'}
				   	,border: false
				   	,items:[
						{    
							//add by kevin 活动管理  折扣活动终端搜索
						xtype : 'panel',
						layout : {type:'hbox', align: 'left',pack:'left'},
						id:'selectTer2',
						border : false,
						defaults : {
						margin : '3 0 0 10'
						},
						items: [{
							xtype: 'image',
						src: '',
						width: 40,
						height: 24,
						imgCls: 'searchIconCss'			    	           
						},{
						    fieldLabel: getIi18NText('deviceName')
						,id: 'searchTextId3'
						,labelAlign: 'right'
						,xtype: 'textfield'
						,maxLength: 60
						,width: 200
						,labelWidth: isEng == true?82:52
						,emptyText: getIi18NText('deviceNameOrCode')
						    ,enforceMaxLength: true
						}
						  ,{
						    xtype: 'button'
						   ,id: 'queryBut3'
						   ,iconCls: 'queryIconCss'
						   ,text:  window.top.getIi18NText('select')
						   ,handler: queryFun3
						  }]
						},
										   	        
				   	        {
						xtype : 'panel',
						layout : {type:'hbox', align: 'middle',pack:'center'},
						border : false,
						defaults : {
							margin : '0 0 0 10'
						},
						items : [{
						 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('allTer')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [terGrid]
		    			 },{
		    			 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('checkedTerminals')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [selGrid]
		    			 }]						
                  }]
       			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'6 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						border : true,
						iconCls:'pback_finish_IconCls',
						handler: function(){
							selectTerWin.close();
						}
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
							selectTer = [];
//							selTerIds.clear();
							rightStore.loadPage(1);
							leftStore.loadPage(1);
							selectTerWin.close();
						}
					}]
				}]
                 }]
               ,listeners:{
               		beforeclose: beforecloseFn,
					show:showFn
               }
        }).show(btn);
    }
	
	
    //勾选用户窗口
	function openSelectUserWin (btn) {
		nowChoose = 3;
    	var beforecloseFn = function(){
    		selectUserWin.hide(btn);
    		Ext.getCmp('searchTextId1').setValue("");
    		allUserStore.proxy.setExtraParam("n", "");
    	};
    	var showFn = function(){
    		allUserStore.loadPage(1);
    	};
		
		if(selectUserWin && selectUserWin.isWindow){
			selectUserWin.clearListeners( );
			selectUserWin.addListener("beforeclose", beforecloseFn);
			selectUserWin.addListener("show", showFn);
			selectUserWin.show(btn);
			return;
		}
    	selectUserWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseUser')
				  ,plain: true
				  ,width: 750
				  ,minWidth: 200
				  ,minHeight: 300
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
                  ,layout: 'fit'
                  ,bodyCls: 'x_panel_backDD'
                  ,items:[{
                  	xtype: 'form'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,border: false
					,items:[
						{    
							//add by kevin 活动管理  折扣活动微信用户搜索
							xtype : 'panel',
							layout : {type:'hbox', align: 'left',pack:'left'},
							id:'selectUser1',
							border : false,
							defaults : {
							margin : '5 0 0 10'
							},
							items: [{
				            	xtype: 'image',
				            	src: '',
				            	width: 40,
				            	height: 24,
				            	imgCls: 'searchIconCss'			    	           
				            },{
					            fieldLabel: getIi18NText('wechatName')
					            ,id: 'searchTextId1'
					            ,labelAlign: 'right'
							    ,xtype: 'textfield'
							    ,maxLength: 60
							    ,width: 200
							    ,labelWidth: isEng == true?82:52
							    ,emptyText: getIi18NText('wechatNameOrCode')
							    ,enforceMaxLength: true
				            }
				    	      ,{
			        	        xtype: 'button'
			        	       ,id: 'queryBut1'
			        	       ,iconCls: 'queryIconCss'
				    		   ,text:  window.top.getIi18NText('select')
				    		   ,handler: queryFun1
				    		  }]
						    }
						,{          	
							xtype : 'panel',
							layout : {type:'hbox', align: 'middle',pack:'center'},
							id:'selectUser',
							border : false,
							defaults : {
							margin : '10 0 0 10'
							},
							items : [{
								xtype: 'fieldset',
								title: '<strong>'+getIi18NText('allUser')+'</strong>',
								width:'49%',
								height:360,
								items: [allUserGrid]
								},{
								xtype: 'fieldset',
								title: '<strong>'+getIi18NText('sel_user')+'</strong>',
								width:'49%',
								height:360,
								items: [selUserGrid]
							}]						
				       }]
       			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'6 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						border : true,
						iconCls:'pback_finish_IconCls',
						handler: function(){
							selectUserWin.close();
						}
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
							selectUserArr = [];
//							selUserIds.clear();
							selUserStore.loadPage(1);
							allUserStore.loadPage(1);
							selectUserWin.close();
						}
					}]
				}]
                 }]
               ,listeners:{
               		beforeclose: beforecloseFn,
					show:showFn
               }
        }).show(btn);
    }
    
    //选择商品
	function openSelectGoodsWin (btn) {
		var btnId  = btn.id;
		handleId = btnId;
		nowChoose = 2;
    	
		if (btnId == "chooseGoods" || btnId == "fchooseGoods") {
			if (handleId == "fchooseGoods") {
				checkBoxGoods.setSelectionMode('SINGLE');
			}
			if (handleId == "chooseGoods") {
				checkBoxGoods.setSelectionMode('SIMPLE');
			}
			var beforecloseFn = function(){
				
	    		selectGoodsWin.hide(btn);
	    		Ext.getCmp('searchTextId2').setValue("");
	    		allGoodsStore.proxy.setExtraParam("n", "");
	    	};
	    	var showFn = function(){
	    		allGoodsStore.loadPage(1);
//	    		console.log(allGoodsStore);
	    	};
	    	/*if(Ext.getCmp('searchTextId2').getValue() ==""){
				selectGoodsWin.addListener("show", showFn);
			};*/
			if(selectGoodsWin && selectGoodsWin.isWindow){
				selectGoodsWin.clearListeners( );
				selectGoodsWin.addListener("beforeclose", beforecloseFn);
				selectGoodsWin.addListener("show", showFn);
				selectGoodsWin.show(btn);
				return;
			}
			
			selectGoodsWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseGoods')
				  ,plain: true
				  ,width: 750
				  ,minWidth: 200
				  ,minHeight: 300
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
                ,layout: 'fit'
                ,bodyCls: 'x_panel_backDD'
                ,items:[{
                	xtype: 'form'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,defaults:{margin:'10 0 0 0'}
				   	,border: false
				   	,items:[
				   		{    
							//add by kevin 活动管理  折扣活动商品搜索
							xtype : 'panel',
							layout : {type:'hbox', align: 'left',pack:'left'},
							id:'selectGoods1',
							border : false,
							defaults : {
							margin : '3 0 0 10'
							},
							items: [{
				            	xtype: 'image',
				            	src: '',
				            	width: 40,
				            	height: 24,
				            	imgCls: 'searchIconCss'			    	           
				            },{
					            fieldLabel: getIi18NText('terGoodsName')
					            ,id: 'searchTextId2'
					            ,labelAlign: 'right'
							    ,xtype: 'textfield'
							    ,maxLength: 60
							    ,width: 200
							    ,labelWidth: isEng == true?82:52
							    ,emptyText: getIi18NText('terGoodsNameOrCode')
							    ,enforceMaxLength: true
				            }
				    	      ,{
			        	        xtype: 'button'
			        	       ,id: 'queryBut2'
			        	       ,iconCls: 'queryIconCss'
				    		   ,text:  window.top.getIi18NText('select')
				    		   ,handler: queryFun2
				    		  }]
						    },
						 {
						xtype : 'panel',
						layout : {type:'hbox', align: 'middle',pack:'center'},
						id:'selectGoods',
						border : false,
						defaults : {
							margin : '0 0 0 2'
						},
						items : [{
						 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('allGoods')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [allGoodsGrid]
		    			 },{
		    			 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('sel_goods')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [selGoodsGrid]
		    			 }]						
                }
                ]
     			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'6 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						border : true,
						iconCls:'pback_finish_IconCls',
						handler:function(){
							selectGoodsWin.close();
						}
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
							
							selectGoodsArr = [];
//							selGoodsIds.clear();
							selGoodsStore.loadPage(1);
							allGoodsStore.loadPage(1);
							selectGoodsWin.close();
						}
					}]
				}]
               }]
             ,listeners:{
             		beforeclose: beforecloseFn,
					show:showFn
             }
      }).show(btn);
		}  else if (btnId == "schooseGoods") {
			if (btnId == "schooseGoods") {
				checkBoxGoods.setSelectionMode('SINGLE');
			}
			var beforecloseFn = function(){
	    		selectCGoodsWin.hide(btn);
	    		Ext.getCmp('searchTextId4').setValue("");
	    		allGoodsStore.proxy.setExtraParam("n", "");
	    	};
	    	var showFn = function(){
	    		allGoodsStore.loadPage(1);
//	    		console.log(allGoodsStore);
	    	};
	    	/*if(Ext.getCmp('searchTextId2').getValue() ==""){
				selectGoodsWin.addListener("show", showFn);
			};*/
			if(selectCGoodsWin && selectCGoodsWin.isWindow){
				selectCGoodsWin.clearListeners( );
				selectCGoodsWin.addListener("beforeclose", beforecloseFn);
				selectCGoodsWin.addListener("show", showFn);
				selectCGoodsWin.show(btn);
				return;
			}
			selectCGoodsWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseGoods')
				  ,plain: true
				  ,width: 750
				  ,minWidth: 200
				  ,minHeight: 300
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
              ,layout: 'fit'
              ,bodyCls: 'x_panel_backDD'
              ,items:[{
              	xtype: 'form'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,defaults:{margin:'10 0 0 0'}
				   	,border: false
				   	,items:[
				   		{    
							//add by kevin 活动管理  折扣活动商品搜索
							xtype : 'panel',
							layout : {type:'hbox', align: 'left',pack:'left'},
							id:'selectGoods2',
							border : false,
							defaults : {
							margin : '3 0 0 10'
							},
							items: [{
				            	xtype: 'image',
				            	src: '',
				            	width: 40,
				            	height: 24,
				            	imgCls: 'searchIconCss'			    	           
				            },{
					            fieldLabel: getIi18NText('terGoodsName')
					            ,id: 'searchTextId4'
					            ,labelAlign: 'right'
							    ,xtype: 'textfield'
							    ,maxLength: 60
							    ,width: 200
							    ,labelWidth: isEng == true?82:52
							    ,emptyText: getIi18NText('terGoodsNameOrCode')
							    ,enforceMaxLength: true
				            }
				    	      ,{
			        	        xtype: 'button'
			        	       ,id: 'queryBut4'
			        	       ,iconCls: 'queryIconCss'
				    		   ,text:  window.top.getIi18NText('select')
				    		   ,handler: queryFun4
				    		  }]
						    },
						 {
						xtype : 'panel',
						layout : {type:'hbox', align: 'middle',pack:'center'},
						id:'selectsGoods3',
						border : false,
						defaults : {
							margin : '0 0 0 2'
						},
						items : [{
						 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('allGoods')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [allCGoodsGrid]
		    			 },{
		    			 	 xtype: 'fieldset',
					  		 title: '<strong>'+getIi18NText('sel_goods')+'</strong>',
		    				 width:'49%',
		    				 height:360,
		    				 items: [selCGoodsGrid]
		    			 }]						
              }
              ]
   			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'6 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						border : true,
						iconCls:'pback_finish_IconCls',
						handler:function(){
							selectCGoodsWin.close();
						}
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
							
//							selectCGoodsArr = [];
//							selGoodsIds.clear();
							selCGoodsStore.loadPage(1);
							allGoodsStore.loadPage(1);
							selectCGoodsWin.close();
						}
					}]
				}]
             }]
           ,listeners:{
           		beforeclose: beforecloseFn,
					show:showFn
           }
    }).show(btn);
		}
		
    	
    }
    
	//所有优惠券
	var couponStore = Ext.create('Ext.data.Store', {
			fields : ["id","cname"],
			buffered : false,
			autoLoad : true,
			pageSize : Number("0x7fffffff"),//未分页，防止显示不全
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'shared!getAllCouponList.action',
				extraParams : {status:0,attr:'activity'},
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
			,listeners:{}
		});
		
    //保存数据
    function saveInfo(v,r,c,i,e,record,row){
    	
    	var reg = /^\d+$/; // 非负整数
    	var name = Ext.getCmp("activityName").getValue();
    	var type = Ext.getCmp("activityType").getValue();
    	var status = Ext.getCmp("activityStatus").getValue();
    	var scope = Ext.getCmp("terScope").getValue();
    	var btime = Ext.getCmp("activityBtime").getValue();
    	var etime = Ext.getCmp("activityEtime").getValue();
    	if(btime > etime){
    	   showTip(Ext.getCmp('activityBtime'), window.top.getIi18NText('timesErrWarming'));    		    	  
    	   return;
        }
        btime = btime.getTime();
        etime = etime.getTime();
    	if (scope == 2 && selectTer.length <= 0) {
    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('ter_tip'))
    		return;
    	}
    	var userScope = -1;
    	var goodsScope = -1;
    	var fgoodsScope = -1;
    	var sgoodsScope = -1;
    	var uids,gids,discount,frequency,total,cutTime,maxCutEachOne,useValidDate="",abatement,fgids,sgids;
    	var coupon;
    	if (type == 5) {
	    	userScope = Ext.getCmp("userScope").getValue();
	    	if (userScope == 2 && selectUserArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minUserTip'))
	    		return;
	    	}
	    	goodsScope = Ext.getCmp("goodsScope").getValue();
	    	if (goodsScope == 2 && selectGoodsArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'))
	    		return;
	    	}
	    	discount = Ext.getCmp("discount").getValue();
	    	if (discount == null) {
	    		showTip(Ext.getCmp("discount"),getIi18NText('notNull'));
	    		return;
	    	}
	    	frequency = Ext.getCmp("discountFrequency").getValue();
	    	total = Ext.getCmp("discountStock").getValue();
	    	var tempUids = new Array();
	    	for (var i = 0; i < selectUserArr.length; i++) {
	    		tempUids.push(selectUserArr[i].get("id"));
	    	}
	    	uids = tempUids.join(",");
	    	var tempGids = new Array();
	    	for (var i = 0; i < selectGoodsArr.length; i++) {
	    		tempGids.push(selectGoodsArr[i].get("id"));
	    	}
	    	gids = tempGids.join(",");
    	}
    	// 砍价活动 参数设定
    	else if (type == 6) {
    		// 活动人数
	    	total = Ext.getCmp("activityNumEachFood").getValue();
	    	if (total == null) {
	    		showTip(Ext.getCmp("activityNumEachFood"),getIi18NText('notNull'));
	    		return;
	    	}
    		// 商品选择
    		goodsScope = Ext.getCmp("goodsScope").getValue();
	    	if (goodsScope == 2 && selectGoodsArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'))
	    		return;
	    	}
	    	var tempGids = new Array();
	    	for (var i = 0; i < selectGoodsArr.length; i++) {
	    		tempGids.push(selectGoodsArr[i].get("id"));
	    	}
	    	gids = tempGids.join(",");
	    	
	    	// 砍价限时
	    	cutTime = Ext.getCmp('cutTime').getValue();
	    	if (cutTime == null) {
	    		showTip(Ext.getCmp("cutTime"),getIi18NText('notNull'));
	    		return;
	    	}
	    	// 每个用户单次最大砍价金额
    		maxCutEachOne = Ext.getCmp('eachUserMaxCutMoney').getValue();
    		if (maxCutEachOne == null) {
	    		showTip(Ext.getCmp("eachUserMaxCutMoney"),getIi18NText('notNull'));
	    		return;
	    	}
    		// 活动砍完后，使用优惠券的有效时间
    		useValidDate = Ext.getCmp('useValidDate').getValue();
    		if (useValidDate == null) {
	    		showTip(Ext.getCmp("useValidDate"),getIi18NText('notNull'));
	    		return;
	    	}
    	}
    	else if (type == 7) {
    		frequency = Ext.getCmp("discountFrequency").getValue();
	    	total = Ext.getCmp("discountStock").getValue();
    		//优惠金额
    		abatement = Ext.getCmp("abatement").getValue();
    		//主餐范围
    		goodsScope = Ext.getCmp("fgoodsScope").getValue();
    		fgoodsScope = Ext.getCmp("fgoodsScope").getValue();
    		var lens = selectGoodsArr.length;
    		if (fgoodsScope == 2 && selectGoodsArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'))
	    		return;
	    	}
    		if (fgoodsScope == 1) {
    			Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('fnotNull'))
    			return;
			}
    		if (selectGoodsArr.length >= 2) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('maxGoodsTip'));
	    		return;
			}
    		var tempGids = new Array();
	    	for (var i = 0; i < selectGoodsArr.length; i++) {
	    		tempGids.push(selectGoodsArr[i].get("id"));
	    	}
	    	fgids = tempGids.join(",");
    		//副餐范围
    		sgoodsScope = Ext.getCmp("sgoodsScope").getValue();
    		if (sgoodsScope == 2 && selectCGoodsArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'));
	    		return;
	    	}
    		if (sgoodsScope == 1) {
    			Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('snotNull'));
	    		return;
			}
    		var tempSGids = new Array();
	    	for (var i = 0; i < selectCGoodsArr.length; i++) {
	    		tempSGids.push(selectCGoodsArr[i].get("id"));
	    	}
	    	sgids = tempSGids.join(",");
	    	for (var i = 0; i < tempGids.length; i++) {
				for (var j = 0; j < tempSGids.length; j++) {
					if (tempGids[i] == tempSGids[j] ) {
						Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('fnotSameS'));
			    		return;
					}
				}
			}
	    	
    		//用户范围
    		userScope = Ext.getCmp("userScope").getValue();
	    	if (userScope == 2 && selectUserArr.length <= 0) {
	    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minUserTip'))
	    		return;
	    	}
	    	var tempUids = new Array();
	    	for (var i = 0; i < selectUserArr.length; i++) {
	    		tempUids.push(selectUserArr[i].get("id"));
	    	}
	    	uids = tempUids.join(",");
		}
    	else {
    		coupon = Ext.getCmp("activityCoupon").getValue();
	    	if (coupon == null) {
	    		showTip(Ext.getCmp("activityCoupon"),getIi18NText('notNull'));
	    		return;
	    	}
    	}
    	var tids = new Array();
    	for (var i = 0; i < selectTer.length; i++) {
    		tids.push(selectTer[i].get("terId"));
    	}
    	Ext.getBody().mask(getIi18NText("saving"));
    	var param = {id:id,goodsScope:goodsScope,fgoodsScope:fgoodsScope,sgoodsScope:sgoodsScope,userScope:userScope,gids:gids,fgids:fgids,sgids:sgids,abatement:abatement,uids:uids,total:total,
	    		discount:discount,frequency:frequency,tids:tids.join(","),btime:btime,etime:etime,
	    		name:name,type:type,status:status,scope:scope,coupon:coupon,
	    		cutTime:cutTime,maxCutEach:maxCutEachOne,useValidDate:useValidDate};
    	//console.log("param",param);
    	Ext.Ajax.request({
		     url: 'shared!saveActivity.action'
		    ,params: param
	        ,method: 'post'
	        ,callback: function(opt, success, response){
	        	  var result = showResult(success,response);				        	  
	        	  Ext.getBody().unmask();
	        	  if(result == false) return;
	        	  addInfoWin.close();
	        	  queryFun();
	        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('saveSuccess'));
	        }
	   });
    }
    
    //删除数据
    function removeInfoFu(v,r,c,i,e,record,row){
    	 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('confirm_del', "<font color=red>" + record.get("name") + "</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'shared!deleteActivity.action'
					    ,params: {id: record.get("id")}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  var result = showResult(success,response);				        	  
				        	  Ext.getBody().unmask();
				        	  if(result == false) return;
				        	  queryFun();
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('deleteFileSuccess'));
				        }
				   });
			   }
		 }});
    }
    
	function  datefmtRender(value){
    	   return  Ext.Date.format(new Date(value), dateFormat);
     }
	
     function statusRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="red">'+getIi18NText('paused')+'</font>';
		 } else {
		  	return getIi18NText('monitor_message_51');
		 }
	 }
	 
     function typeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="green">'+getIi18NText('buyLunch')+'</font>';
		 } else if (value == 1) {
		  	return getIi18NText('bindPhone');
		 } else if (value == 3) {
		  	return '<font color="orange">'+getIi18NText('buyBreakfast')+'</font>';
		 } else if (value == 4) {
		  	return '<font color="blue">'+getIi18NText('signContract')+'</font>';
		 } else if (value == 5) {
		  	return '<font color="red">'+getIi18NText('discountActivity')+'</font>';
		 } else if (value == 6) {
		    return '<font color="orange">'+getIi18NText('cutActivity')+'</font>';
		 } else if (value == 7) {
			 return '<font color="purple">'+getIi18NText('combinedActivity')+'</font>';
		}
		 
	 }
	 
     function scopeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="blue">'+getIi18NText('someTer')+'</font>';
		 } else {
		  	return getIi18NText('allTer');
		 }
	 }
	 function  timeRender(value,m,r){
    	 return  Ext.Date.format(new Date(r.get('stime')), dateFormat)+'<br/>'+getIi18NText("to")+'<br/>'+Ext.Date.format(new Date(r.get('etime')), dateFormat);
	 }
     function userScopeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="blue">'+getIi18NText('someUser')+'</font>';
		 } else if (value == 1) {
		  	return getIi18NText('allUser');
		 }
	 }
     function goodsScopeRender(value,metaData,record,rIndex,cIndex){
		 if (value == 2) {
		  	return '<font color="blue">'+getIi18NText('someGoods')+'</font>';
		 } else if (value == 1) {
		  	return getIi18NText('allGoods');
		 }
	 }
   
     //用户搜索
     function queryFun1($this, eopt){
    	 allUserStore.proxy.setExtraParam("n", encode(Ext.getCmp('searchTextId1').getValue()));
 		 allUserStore.loadPage(1);
     }
     
     //商品搜索
     function queryFun2($this, eopt){
    	 allGoodsStore.proxy.setExtraParam("n", encode(Ext.getCmp('searchTextId2').getValue()));
    	 allGoodsStore.loadPage(1);
     }
   //副商品搜索
     function queryFun4($this, eopt){
    	 allGoodsStore.proxy.setExtraParam("n", encode(Ext.getCmp('searchTextId4').getValue()));
    	 allGoodsStore.loadPage(1);
     }
     //设备搜索
     function queryFun3($this, eopt){
    	 leftStore.proxy.setExtraParam("n", encode(Ext.getCmp('searchTextId3').getValue()));
    	 leftStore.loadPage(1);
     }
});
