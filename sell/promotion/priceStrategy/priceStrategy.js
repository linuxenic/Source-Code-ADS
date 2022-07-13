
var operationFn;
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var viewport,gridPanel,dataStore,ajaxProxy,addInfoWin;
	var selectGoodsArr = [];
	var selectGoodsWin,id=0,bindPSToTer='bindPriceStrategyToTerminal_panel';
	
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
	
	var viewInfoFn,operateId,operateName;
	// -----------绑定到终端，数据和窗口
	var terProxy,terStore,terGridPanel,terPanel,timeId;
	// -------------------选择终端
	var recordIds = new Ext.util.MixedCollection();
	var checkboxModelTerminal = Ext.create('Ext.selection.CheckboxModel', {
				listeners : {
					'select' : selectTer,
					'deselect' : deselectTer
				}
			});

	function deselectTer(me, record) {
		if (recordIds.containsKey(record.get('terId'))) {
			recordIds.removeAtKey(record.get('terId'));
		}
	}
	function selectTer(me, record) {
		if (!recordIds.contains(record.get('terId'))) {
			recordIds.add(record.get('terId'), record);
		}
	}
	// 权限
//	var  AUTH = Ext.merge({"delete": false , add : false , update : false ,"self":true,admin:false}, Ext.decode(decode(AUTH_TBAR)));
	var  AUTH = {"delete": true , add : true , update : true ,"self":true,admin:true};
	// 是否是英文
	var isEng = window.top.getIi18NText('confirm') == 'OK' ? true:false;

	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	
	 //创建对象
 	 Ext.define('goodsObject', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'id', type: 'int'},
	         {name: 'name',  type: 'String'},
	         {name: 'code',  type: 'String'}
	     ]
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
		style:'border-width:0px;background:white',
		items:[{
		    region: 'north',
		    height: 40
		    ,width: 400
		    ,id: 'northContanier'
		    ,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
		    ,bodyCls: 'x_panel_backDD'
	    	,style:'border-width:0px;'
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
			            fieldLabel: getIi18NText('name')
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
					    ,style:'border-width:0px;'
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
		ajaxProxy =  getAjaxProxy({url: 'activity!getPriceStrategyList.action',extraParams: {b:currentBegin+' 00:00:00',e: current+' 23:59:59'}});
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","name","status","way","timeScope","dctType","dctValue","startTime",
						"endTime","goodsIds","createTime","lastTime","creator","timeScopeValue"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy :ajaxProxy
			,listeners: {}
		});
		    
	    gridPanel=Ext.create("Ext.grid.Panel",{
		    title:getIi18NText('priceStrategy')+' '+getIi18NText('listing'),
		    iconCls: 'tabIconCss',
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
						{text :getIi18NText('changedTime'),dataIndex :'lastTime',minWidth:60,renderer:datefmtRender},
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
	
    // 添加价格策略窗口
    function openInfoWin(btn,id,record){
    	selectGoodsArr = new Array();
    	var beforecloseFn = function(){
        	// 1. 清空名称
        	Ext.getCmp("strategyName").setValue('');
        	Ext.getCmp("strategyName").enable();
        	// 2.默认优惠方式为 整机优惠
        	Ext.getCmp("strategyWay").setValue(1);
        	Ext.getCmp("strategyWay").enable();
        	// 3.默认折扣类型为 打折
        	Ext.getCmp("strategyDctType").setValue(1);
        	Ext.getCmp("strategyDctType").enable();
        	// 4.默认时段为 整天
        	Ext.getCmp("strategyTimeScope").setValue(1);
        	Ext.getCmp("strategyTimeScope").enable();
        	// 5.清空开始时间和结束时间
        	Ext.getCmp("strategyBtime").setValue('');
        	Ext.getCmp("strategyEtime").setValue('');
        	Ext.getCmp("strategyBtime").enable();
        	Ext.getCmp("strategyEtime").enable();
        	// 6.默认折扣，并清空内容
        	Ext.getCmp("strategyDstValue").setValue('');
        	Ext.getCmp("strategyDstValue").enable();
        	Ext.getCmp("strategyDstValue").show();
        	// 7. 隐藏商品选择panel,并清空选择商品表格的所有数据
        	Ext.getCmp("goodsChoosePanel").hide();
        	selGoodsGrid.getStore().removeAll();
        	selectGoodsArr = [];
        	// 选择商品按钮显示
    		Ext.getCmp('chooseGoodsBtn').show();
    		Ext.getCmp('viewGoodsBtn').hide();
        	// 选择了多少终端提示文字
    		Ext.getCmp('goodsChooseHtml')
    			.update('<span class="middleFontSize">'+getIi18NText('chooseXgoods',0)+'</span>');
        	// 8. 隐藏添加时段按钮
        	Ext.getCmp("addPartTimePanel").hide();
        	// 9. 隐藏时间段panel，并清空所填写的内容
        	Ext.getCmp("partTimePanel").hide();
        	Ext.getCmp("partTimePanel").removeAll();
        	
    		addInfoWin.hide(btn);
    	};
    	var showFn = function(){
			if(/^\d+$/.test(id)){	// 修改价格策略
				id = id;
				// 回显信息
				editCallback(record);
				addInfoWin.setTitle(getIi18NText('item_detail')+' '+getIi18NText('priceStrategy'));
			} else {
				// 显示保存按钮
				Ext.getCmp('savebt').show();
	    		selGoodsStore.getProxy().setExtraParam("id", id);
	        	selGoodsStore.load();
				addInfoWin.setTitle(getIi18NText('add')+' '+getIi18NText('priceStrategy'));
			}
		};
		
		if(addInfoWin && addInfoWin.isWindow){
			addInfoWin.clearListeners();
			addInfoWin.addListener("beforeclose", beforecloseFn);
			addInfoWin.addListener("show", showFn);
			addInfoWin.show(btn);
			return;
		}
    	addInfoWin = Ext.create('Ext.window.Window',{
				  title:getIi18NText('add')+' '+getIi18NText('priceStrategy')
				  ,plain: true
				  ,width: 580
				  ,height:400
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
//				   	,monitorValid:true
				   	,defaults:{margin:'20 0 0 20'}
				   	,border: false
				   	,items:[{                 	
							xtype : 'panel',
							layout:'column',
							border : false,
							defaults:{labelAlign:'right'},
							items : [{
										xtype : 'textfield',
										id : 'strategyName',
										fieldLabel :'<font color="red">* </font>'+getIi18NText('name'),
										editable : false,
										labelWidth :60,
										width : 220,
										maxlength:50,
										emptyText:getIi18NText('enterName'),
//										allowBlank : false
								},{
									xtype : 'combo',
									fieldLabel : '<font color="red">* </font>'+getIi18NText('preferentialWay'),
									editable : false,
									id : 'strategyWay',
									labelWidth :isEng?100:60,
									margin:'0 0 0 40',
									width : 220,
									value:1,
									store : [[1,getIi18NText('devices')],[2,getIi18NText('single')]],
									queryMode: 'local',
									listeners:{
										change : function ($this,newValue,oldValue,e) {
											if(newValue == 2){
												// 显示商品选择
												Ext.getCmp('goodsChoosePanel').show();
												// 重新设置 部分时段的宽高
												Ext.getCmp('partTimePanel').setHeight(93);
											} else {
												Ext.getCmp('goodsChoosePanel').hide();
												Ext.getCmp('partTimePanel').setHeight(130);
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
									id : 'strategyDctType',
									fieldLabel : '<font color="red">* </font>'+getIi18NText('dstType'),
									editable : false,
									labelWidth :isEng?65:60,
									width : 220,
									value:1,
									store : [[1,getIi18NText('discount')],[2,getIi18NText('subtract')]],
									queryMode: 'local',
									listeners:{
										change : function ($this,newValue,oldValue,e) {
											var partTimePanel = Ext.getCmp('partTimePanel');
											if(newValue == 2){
												// 改名字
												Ext.getCmp('strategyDstValue').setFieldLabel('<span title="'+getIi18NText('subtractTips')+'">'+
														'<font color="red">* </font>'+getIi18NText('subtract')+'</span>');
												// 设置最大值
												Ext.getCmp('strategyDstValue').setMaxValue(10000);
												// 改时段的名字,以及对应的最大值
												if(partTimePanel.items.length > 0){
													partTimePanel.items.each(function(item,index,length){
														var itemId = item.id;
														itemId = itemId.replace(/childrenPanel/,"")
														Ext.getCmp('partTimeDstValue'+itemId).setFieldLabel('<span title="'+getIi18NText('subtractTips')+'">'+
																'<font color="red">* </font>'+getIi18NText('subtract')+'</span>');
														Ext.getCmp('partTimeDstValue'+itemId).setMaxValue(10000);
													});
												}
											} else {
												// 改名字
												Ext.getCmp('strategyDstValue').setFieldLabel('<span title="'+getIi18NText('discountTips')+'">'+
														'<font color="red">* </font>'+getIi18NText('discount')+'</span>');
												// 设置最大值
												Ext.getCmp('strategyDstValue').setMaxValue(10);
												// 改时段的名字,以及对应的最大值
												if(partTimePanel.items.length > 0){
													partTimePanel.items.each(function(item,index,length){
														var itemId = item.id;
														itemId = itemId.replace(/childrenPanel/,"")
														Ext.getCmp('partTimeDstValue'+itemId).setFieldLabel('<span title="'+getIi18NText('discountTips')+'">'+
																'<font color="red">* </font>'+getIi18NText('discount')+'</span>');
														Ext.getCmp('partTimeDstValue'+itemId).setMaxValue(10);
													});
												}
											}
										}
									}
							},
							{
								xtype : 'combo',
								id : 'strategyTimeScope',
								fieldLabel : '<font color="red">* </font>'+getIi18NText('timeIntervals'),
								editable : false,
								margin:'0 0 0 40',
								labelWidth :60,
								width : 220,
								value:1,
								store : [[1,getIi18NText('allDay')],[2,getIi18NText('coupon15')]],
								queryMode: 'local',
								listeners:{
									change : function ($this,newValue,oldValue,e) {
										if(newValue == 2){
											// 添加时段按钮
											Ext.getCmp('addPartTimePanel').show();
											// 时段
											Ext.getCmp('partTimePanel').show();
											// 折扣输入框
											Ext.getCmp('discountPanel').hide();
											// 新增第一行
											if(Ext.getCmp("partTimePanel").items.length <= 0){
												var obj = {b:'',e:'',v:''};
												initPartTimeItem(obj,0,false);
											}
										} else {
											Ext.getCmp('addPartTimePanel').hide();
											Ext.getCmp('partTimePanel').hide();
											Ext.getCmp('discountPanel').show();
										}
									}
								}
							}
							]						
              		},
              		{
						xtype : 'panel',
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
						        xtype: 'datefield',
						        fieldLabel:'<font color="red">* </font>'+getIi18NText('startTime')
						       ,labelWidth: isEng?65:60
						       ,width: 220
//						       ,allowBlank:false
						   	   ,editable:false
						       ,id: 'strategyBtime'
						       ,emptyText: getIi18NText('startTime')
						       ,format:'Y/m/d'
						    },{
							     xtype: 'datefield'
							    ,fieldLabel:'<font color="red">* </font>'+getIi18NText('endTime')
							    ,id: 'strategyEtime'
							    ,labelWidth: 60
//							    ,allowBlank:false
							    ,editable:false
							    ,margin:'0 0 0 40'
						       	,width: 220
							    ,emptyText: getIi18NText('endTime')
							    ,format: 'Y/m/d'
						 }]
              		}
              		,{
						xtype : 'panel',
						id:'discountPanel',
						layout:'column',
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
									xtype:'numberfield',
									fieldLabel : '<span title="'+getIi18NText('discountTips')+'">'+
												'<font color="red">* </font>'+getIi18NText('discount')+'</span>',
									id : 'strategyDstValue',
									labelWidth :isEng == true?80:60,
									width : 220,
									maxValue: 10,
							        minValue: 0,
//							        allowBlank:false,
							        allowDecimals: true,
							        decimalPrecision :1,	// 允许一位小数
							        value:'',
							        negativeText:window.top.getIi18NText('negativeTips'),
							        emptyText: getIi18NText('discount')+'/'+getIi18NText('subtract')
							        
							}]		
              		},{
						xtype : 'panel',
						id:'goodsChoosePanel',
						hidden: true,
						border : false,
						defaults:{labelAlign:'right'},
						items : [{
								xtype : 'button',
								id:'chooseGoodsBtn',
								text : getIi18NText('chooseGoods'),
								border : true,
								handler:openSelectGoodsWin
							},{
								xtype : 'button',
								id:'viewGoodsBtn',
								text : getIi18NText('item_detail'),
								border : true,
								hidden:true,
								handler:selectedGoodsWin
							},{
						        xtype: 'label',
						        id:'goodsChooseHtml',
						        margin: '0 0 0 20',
						        html:'<span class="middleFontSize">'+getIi18NText('chooseXgoods',0)+'</span>'
						    }]		
              		},{
						xtype : 'panel',
						id:'addPartTimePanel',
						hidden: true,
						border : false,
						items : [{
							xtype : 'button',
							text : getIi18NText('add2')+' '+getIi18NText('timeIntervals'),
							iconCls : 'pbacks_add_IconCls',
							border : true,
							handler:additem
						}]		
              		},{
						xtype : 'panel',
						id:'partTimePanel',
						width:'100%',
						height:130,
						margin:'5 10 0 20',
						hidden: true,
						border : false,
						style: {
						    borderWidth: '1px',
						    borderStyle: 'dashed'
						},
						autoScroll:true,
						items : []
              		}
              		]
       			,dockedItems : [{
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					margin:'5 0 0 0',
					cls : 'x_panel_backDD',
					items : [{
						xtype:'tbfill'
					},{
						xtype : 'button',
						text : getIi18NText('save'),
						id:'savebt',
//						formBind:true,
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
    	//console.log("editCallback---->",r)
    	// 隐藏保存按钮
		Ext.getCmp('savebt').hide();
    	
    	id = r.get("id");	// 当前策略id 
    	var terScope = r.get("scope");
    	var type = r.get("type");
    	// 1.名称
    	Ext.getCmp("strategyName").setValue(r.get("name"));
    	Ext.getCmp("strategyName").disable();
    	// 2.优惠方式
    	Ext.getCmp("strategyWay").setValue(r.get("way"));
    	Ext.getCmp("strategyWay").disable();
    	// 3.折扣类型
    	
    	Ext.getCmp("strategyDctType").setValue(r.get("dctType"));
    	Ext.getCmp("strategyDctType").disable();
    	// 4.时段
    	Ext.getCmp("strategyTimeScope").setValue(r.get("timeScope"));
    	Ext.getCmp("strategyTimeScope").disable();
    	// 5.开始时间和结束时间
    	Ext.getCmp("strategyBtime").setValue(new Date(r.get("startTime")));
    	Ext.getCmp("strategyEtime").setValue(new Date(r.get("endTime")));
    	Ext.getCmp("strategyBtime").disable();
    	Ext.getCmp("strategyEtime").disable();
    	// 6.折扣
    	Ext.getCmp("strategyDstValue").setValue(r.get("dctValue"));
    	Ext.getCmp("strategyDstValue").disable();
    	Ext.getCmp("strategyDstValue").show();
    	// 7. 隐藏商品选择panel,并清空选择商品表格的所有数据
    	Ext.getCmp("goodsChoosePanel").hide();

    	if(r.get("way") == 2){
    		var goodsIds = r.get('goodsIds');
    		var goodsArr = goodsIds.split(',');
    		//console.log('goodsIds',goodsIds,goodsArr.length,goodsArr);
    		// 选择了多少终端
    		Ext.getCmp('goodsChooseHtml')
    			.update('<span class="middleFontSize">'+getIi18NText('chooseXgoods',goodsArr.length)+'</span>');
    		// 隐藏选择商品按钮
    		Ext.getCmp('chooseGoodsBtn').hide();
    		Ext.getCmp('viewGoodsBtn').show();
    		Ext.getCmp("goodsChoosePanel").show();
    	}
    	// 8. 隐藏添加时段按钮
    	Ext.getCmp("addPartTimePanel").hide();
    	// 9. 隐藏时间段panel，并清空所填写的内容
    	Ext.getCmp("partTimePanel").hide();
    	Ext.getCmp("partTimePanel").removeAll();
    	// 回显部分时段数据
    	if(r.get("timeScope") == 2){
    		showBackPartTime(r.get("timeScopeValue"));
    		Ext.getCmp("partTimePanel").show();
    	}
    }
    /**
     * 回显部分时段
     */
    function showBackPartTime(timeScopeValue){
		var json = JSON.parse(timeScopeValue);
		var arrLen = json.length;
		//console.log('timeScopeValue',timeScopeValue,json,arrLen);
		if(json.length <= 0){
			return;
		}
		for(var i = 0;i < arrLen;i++){
			var obj = json[i];
			if(i == 0){
				initPartTimeItem(obj,0,true);
				continue;
			}
			initPartTimeItem(obj,1,true);
		}
    }
    
//TODO----------已选择商品数据保存模块--------------------------------
    
	//左侧勾选商品
	var checkBoxGoods = Ext.create('Ext.selection.CheckboxModel', {  
     	listeners : {  
        	'select' : selectGoods,  
//       		,'deselect' : deselects
     	}  
	});
	//勾选左侧商品添加到右侧
	function selectGoods(me, record) {
//		console.log("record ->" , record);
		if (record.length <= 0) {
			return
		}
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
//		console.log("selectGoodsArr-->" , selectGoodsArr , "selectGoodsArr.length-->" + selectGoodsArr.length);
		selectGoodsArr.push(ter);
    	selGoodsGrid.getStore().removeAll();
	    selGoodsGrid.getStore().add(selectGoodsArr);
	    var len = selectGoodsArr.length;
		Ext.getCmp('showGoodsSelected').setValue(len);
	}
	
//TODO-------------商品数据模块---------------------------------------------------
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
	
//TODO-------------已选择商品数据模块---------------------------------------------------
		
	// 已选商品数据
	var selGoodsStore = Ext.create('Ext.data.Store', {
		fields : ['id','name', 'code'],
		buffered : false,
		autoLoad : true,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'activity!getBindGoodsByPriceStrategy.action',
			extraParams:{id:id},
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
	// 已选商品表格
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
					}
					allGoodsStore.loadPage(1);
					selGoodsGrid.getStore().removeAll();
					selGoodsGrid.getStore().add(selectGoodsArr);
					var len=selectGoodsArr.length;
					Ext.getCmp('showGoodsSelected').setValue(len);
				}
			 }]
		});

//TODO-------------选择商品窗口模块---------------------------------------------------
		
    //选择商品
	function openSelectGoodsWin(btn) {
//		console.log("btn-->" , btn.id);

		var beforecloseFn = function(){
    		selectGoodsWin.hide(btn);
    		Ext.getCmp('searchTextId2').setValue("");
    		allGoodsStore.proxy.setExtraParam("n", "");
    		// 选择了多少终端
    		Ext.getCmp('goodsChooseHtml')
    			.update('<span class="middleFontSize">'+getIi18NText('chooseXgoods',selectGoodsArr.length)+'</span>');
    	};
    	var showFn = function(){
    		allGoodsStore.loadPage(1);
    	};
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
    }
	/**
	* 查看已选择商品
	**/
	function selectedGoodsWin(btn){
		var selectedGoodsGrid = Ext.create('Ext.grid.Panel', {
		    store:selGoodsStore,
		    width:'100%',
			height:'100%',
		    bodyStyle: 'background: white',
		    forceFit : true,
		    columns: [
		      	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
		        { text: getIi18NText('goods_nm'),dataIndex: 'name', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
		        ,{ text: getIi18NText('goodsCode'),dataIndex: 'code', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false }
		    ]
		});
		selGoodsStore.proxy.setExtraParam("id", id);
		selGoodsStore.load();
		Ext.create('Ext.window.Window',{
			  title:getIi18NText('sel_goods')
			  ,plain: true
			  ,width: 500
			  ,height:300
			  ,minWidth: 200
			  ,minHeight: 300
			  ,border: false
			  ,style:'border-width:0px;'
			  ,frame: false
			  ,resizable:false
			  ,modal: true
			  ,constrain: true
			  ,closeAction: 'hide'
			  ,layout: 'fit'
			  ,bodyCls: 'x_panel_backDD'
			  ,items:[{
		        	xtype: 'panel'
				   	,width:500
					,height:264
				   	,border: false
				   	,items:[
						 {
							xtype : 'panel',
							layout : {type:'hbox', align: 'middle',pack:'center'},
							border : false,
							width:500,
							height:264,
							items : [selectedGoodsGrid]					
		        		}
		        ]
			  }]
		}).show(btn);
	}
	/**
	 * 删除时段
	 */  	
	function deleteItem(btn){
		var index = btn.id;
		// 截取唯一的index
		index = index.replace(/delBtn/,"")
		// 将要移除的 id
		var willRemoveItemId = "childrenPanel"+index;
		
		var partTimePanel = Ext.getCmp('partTimePanel');
		partTimePanel.items.each(function(item,index,length){
//			console.log('delete',item);
			var itemId = item.id;
			// 判断移除的 id 和 当前 id 是否相等，相等则移除
			if(willRemoveItemId == itemId){
				partTimePanel.remove(item);
			}
		});
	}
	
	/**
	 * 初始化部分时段 panel
	 */
	function initPartTimeItem(obj,val,disable){
		// 判断当前选择的是折扣还是立减.1:打折；2：立减
		var dctType = Ext.getCmp('strategyDctType').getValue();
		var title = '<span title="'+getIi18NText('discountTips')+'">'+
				'<font color="red">* </font>'+getIi18NText('discount')+'</span>';
		if(dctType == 2){
			title = '<span title="'+getIi18NText('subtractTips')+'">'+
					'<font color="red">* </font>'+getIi18NText('subtract')+'</span>';
		}
		// 获取新的 panel
		var panelObj = addChildPanel(title,obj,val,disable);
		
		var partTimePanel = Ext.getCmp('partTimePanel');
		// 将新建的panel 填入 partTimePanel 的items 中
		partTimePanel.add(panelObj);
		// 重新布局整理
		partTimePanel.doLayout();
	}
	/**
	 * 添加新的时段
	 */  
	function additem(){
		// 判断当前选择的是折扣还是立减.1:打折；2：立减
		var dctType = Ext.getCmp('strategyDctType').getValue();
		var title = '<span title="'+getIi18NText('discountTips')+'">'+
					'<font color="red">* </font>'+getIi18NText('discount')+'</span>';
		if(dctType == 2){
			title = '<span title="'+getIi18NText('subtractTips')+'">'+
					'<font color="red">* </font>'+getIi18NText('subtract')+'</span>';
		}
		var obj = {b:'',e:'',v:''};
		// 获取新的 panel
		var panelObj = addChildPanel(title,obj,1,false);
		
		var partTimePanel = Ext.getCmp('partTimePanel');
		// 将新建的panel 填入 partTimePanel 的items 中
		partTimePanel.add(panelObj);
		// 重新布局整理
		partTimePanel.doLayout();
	}
	/**
     * 动态添加 子panel
     * title 标题
     * obj	对象值
     * val	0：是第一行，不带删除按钮
     * edit 是否不可点击
     **/
	function addChildPanel(title,obj,val,disabled){
		var nowDctType = Ext.getCmp('strategyDctType').getValue();
		var randomNum = Math.floor(Math.random(10000)*10000);
		// 时间戳+随机数的方式生成唯一的index
		randomNum = Number(Date.now()+''+randomNum);
		var childPanel = {
				xtype : 'panel',
				id:'childrenPanel'+randomNum,
				layout:'column',
				hidden: false,
				border : false,
				margin:'10 0 0 10',
				defaults:{labelSeparator : ''},
				defaultType :'timefield',
				items : [{
							id:'partTimeBegin'+randomNum,
							width:95,
							labelWidth : 0,
						    fieldLabel: '',
						    format:'G:i',  //格式化时间,24小时制
						    minValue: '0:0 AM',
						    maxValue: '23:59 PM',
						    increment: 1,
						    emptyText :getIi18NText('startTime'),
						    value:obj.b,
						    disabled :disabled
						},
						{
							id:'partTimeEnd'+randomNum,
							width:105,
							labelWidth : 5,
							margin:'0 0 0 5',
						    fieldLabel: '-',
						    format:'G:i',  //格式化时间,24小时制
						    minValue: '0:0 AM',
						    maxValue: '23:59 PM',
						    increment: 1,
						    emptyText :getIi18NText('endTime'),
						    value:obj.e,
						    disabled :disabled
						},
						{
							xtype:'numberfield',
							id : 'partTimeDstValue'+randomNum,
							fieldLabel : title,
							labelWidth :isEng?75:35,
							labelSeparator : ':',
							width : 160,
							maxValue: nowDctType==1?10:10000,
					        minValue: 0,
					        margin:'0 0 0 20',
					        decimalPrecision :1,	// 允许一位小数
					        value:obj.v,
					        disabled :disabled
						},
						{
							xtype : 'button',
							id:'delBtn'+randomNum,
							text : getIi18NText('delete')+' '+getIi18NText('timeIntervals'),
							margin:'0 0 0 20',
							iconCls : 'pbacks_det_IconCls',
							border : true,
							hidden:val == 0?true:false,
							disabled : disabled,
							handler:deleteItem
						}]
			};
		return childPanel;
	}
	
    //保存数据
    function saveInfo(v,r,c,i,e,record,row){

    	var name='',way='',dctType='',timeScope='',btime='',etime='',dctValue='',partTime=[];
    	// 1. 名称
    	name = Ext.getCmp("strategyName").getValue();
    	if(Ext.isEmpty(name)){
    		showTip(Ext.getCmp("strategyName"),getIi18NText('notNull'));
    		return false;
    	}
    	// 2.优惠方式
    	way = Ext.getCmp("strategyWay").getValue();
    	// 3.折扣类型
    	dctType = Ext.getCmp("strategyDctType").getValue();

    	var titleTip = getIi18NText('discount');
    	if(dctType == 2){
    		titleTip = getIi18NText('subtract');
    	}
    	
    	// 4.时段
    	timeScope = Ext.getCmp("strategyTimeScope").getValue();
    	if(timeScope == 2){
    		var arr = getPartTimeArr(dctType);
    		//console.log(arr,Array.isArray(arr));
    		if(Array.isArray(arr)){
    			partTime = arr;
    		} else {
    			if(1 == arr){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('coupon25'));
    			} else if (2 == arr){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('playTimeErrWarming02'));
    			} else if (3 == arr) {
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('maxValueTips',titleTip));
    			} else if (4 == arr){
    				Ext.Msg.alert(getIi18NText('systemMessage'), 
    						getIi18NText('emptyTips',getIi18NText('coupon15')+getIi18NText('param')));
    			}
    			return;
    		}
    	}
    	
    	// 5.开始时间和结束时间
    	btime = Ext.getCmp("strategyBtime").getValue();
    	etime = Ext.getCmp("strategyEtime").getValue();
    	if(Ext.isEmpty(btime)){
    		showTip(Ext.getCmp("strategyBtime"),getIi18NText('startTimeErr'));
    		return false;
    	}
    	if(Ext.isEmpty(etime)){
    		showTip(Ext.getCmp("strategyEtime"),getIi18NText('endTimeErr'));
    		return false;
    	}
    	if(btime > etime){
     	   showTip(Ext.getCmp('strategyBtime'), window.top.getIi18NText('timesErrWarming'));    		    	  
     	   return;
        }
    	
        btime = Ext.Date.format(btime,'Y/m/d 0:0:0');
        etime = Ext.Date.format(etime,'Y/m/d 23:59:59');
        // 6.折扣或立减金额
    	dctValue = Ext.getCmp("strategyDstValue").getValue();
    	if(timeScope == 1){
    		if(dctValue == '' || dctValue == null){
        		showTip(Ext.getCmp("strategyDstValue"),getIi18NText('notNull'));
        		return false;
        	}
    		// 4.1 判断折扣或者立减值是否超出最大值
    		if(dctType == 1){
    			if(dctValue > 10){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('maxValueTips',titleTip));
    				return false;
    			}
    		} else if(dctType == 2){
    			if(dctValue > 10000){
    				Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('maxValueTips',titleTip));
    				return false;
    			}
    		}
    	}
    	
    	// 7. 选择商品数据
    	if (way == 2 && selectGoodsArr.length <= 0) {
    		Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'))
    		return;
    	}
    	// 8. 商品
    	var tempGids = new Array();
    	for (var i = 0; i < selectGoodsArr.length; i++) {
    		tempGids.push(selectGoodsArr[i].get("id"));
    	}
    	gids = tempGids.join(",");
    	
    	Ext.getBody().mask(getIi18NText("saving"));
    	var param = {id:id,gids:gids,btime:btime,etime:etime,partTime:JSON.stringify(partTime),
	    		name:name,way:way,dctType:dctType,timeScope:timeScope,dctValue:dctValue};
    	//console.log("param",param);
    	Ext.Ajax.request({
		     url: 'activity!saveOrUpdatePriceStrategy.action'
		    ,params: param
	        ,method: 'post'
	        ,callback: function(opt, success, response){
	        	  var result = showResult(success,response);
	        	  //console.log('result',result);
	        	  Ext.getBody().unmask();
	        	  if(result.code != 0) return;
	        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('saveSuccess'));
	        	  addInfoWin.close();
	        	  queryFun();
	        }
	   });
    }
    //比较函数  顺序排列
    var compare = function (x, y) {
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }
    /**
     * 获取分时段信息，组装成对象数组返回
     */
    function getPartTimeArr(dctType){
    	var objArr = [];
    	var beginArr = [],endArr = [];
    	var flag = 0;	// 1：开始时间大于等于结束时间；2：时间有重叠；3：折扣值或者立减值输入超出；4：有未填写的输入框
    	var itemsArr = Ext.getCmp('partTimePanel').items.items;
    	for(var i = 0;i < itemsArr.length;i++){
    		var itemId = itemsArr[i].id;
			itemId = itemId.replace(/childrenPanel/,"")
			// 开始时段
			var begin = Ext.getCmp('partTimeBegin'+itemId).getValue();
			// 结束时段
			var end = Ext.getCmp('partTimeEnd'+itemId).getValue();
			// 折扣or立减金额
			var val = Ext.getCmp('partTimeDstValue'+itemId).getValue();
			// 1.若其中有一个值没有填写，则不保存
			var isEmpty = begin == null || end == null || val == null || begin == '' || end == '' || val == '';
			if(isEmpty){
				flag = 4;
				break;
			}
			// 1.1 判断折扣或者立减值是否超出最大值
			if(dctType == 1){
				if(val > 10){
					flag = 3;
					break;
				}
			} else if(dctType == 2){
				if(val > 10000){
					flag = 3;
					break;
				}
			}
			
			begin = Ext.Date.format(new Date(begin), 'G:i');
    		end = Ext.Date.format(new Date(end), 'G:i');
    		
    		// 2.将时间转换为数值
    		var beginTemp = begin.replace(/:/,0)*1;
    		var endTemp = end.replace(/:/,0)*1;
    		// 2.1 判断开始时间是否大于等于结束时间
    		if(beginTemp >= endTemp){
    			flag = 1;
    			Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("coupon25"));
    			break;
			}
    		// 2.2 将格式话的时间存入 timeArr,排序后，对比是否
    		beginArr.push(beginTemp);
    		endArr.push(endTemp);
    		var obj = {};
    		obj['b'] = begin;
    		obj['e'] = end;
    		obj['v'] = val;
    		objArr.push(obj);
    	}
    	
    	// 3. 判断时间是否有重叠
    	var beginSortArr = beginArr.sort(compare);
    	var endSortArr = endArr.sort(compare);
    	for(var k=1;k <beginSortArr.length;k++){
    		// 开始时间小于或等于结束时间，说明已经有重叠
    		if(beginSortArr[k] < endSortArr[k-1]){
    			flag = 2;
    			break;
    		}
    	}
    	if(flag != 0){
    		return flag;
    	}
    	//console.log('objArr',objArr);
    	return objArr;
    }
	// TODO 可点击菜单	
	function adviceTimeRenderFn(value,metaData,record,rIndex,cIndex){
//		console.log(record,rIndex);
//		record = JSON.parse(record);
		var bindCls = 1;	// 绑定按钮布局调整标识
		var ctrlHtml = '<ul class="ctrlULCls">';
	 	// 查看
//	 	if(AUTH["update"]){
	 		ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',1)" title="'+getIi18NText('item_detail')+'">'+getIi18NText('item_detail')+'</a></li>';
//	 	}
	 	
	 	// 删除
//	 	if(AUTH["delete"]){
//	 	ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',2)" title="'+getIi18NText('delete')+'">'+getIi18NText('delete')+'</a></li>';
//	 	}
	 	// 暂停
//	 	if(AUTH["pause"]){
	 	var status = record.get("status");
	 	if(status == 2){
	 		ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',3)" title="'+getIi18NText('paused')+'">'+getIi18NText('paused')+'</a></li>';
	 		bindCls ++ ;
	 	}
	 	if(status == 4){
	 		ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',5)" title="'+getIi18NText('monitor_message_51')+'">'+getIi18NText('monitor_message_51')+'</a></li>';
	 		bindCls ++ ;
	 	}
//	 	}
	 	// 绑定
//	 	if(AUTH["bind"]){
		// 待执行和执行中的策略才能绑定
		if(status == 1 || status == 2){
			
			// 布局样式调整
			if(bindCls >= 2){
				ctrlHtml += '<li class="maginTop"><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',4)" title="'+getIi18NText('bind')+'">'+getIi18NText('bind')+'</a></li>';
			} else {
				ctrlHtml += '<li><a href="javascript:void(0)" onclick="operationFn(this,'+rIndex+',4)" title="'+getIi18NText('bind')+'">'+getIi18NText('bind')+'</a></li>';
			}
		}
//	 	}
	 	ctrlHtml += '</ul>';
	 	return ctrlHtml;
	}
	
	operationFn = function(t,rIndex,type){
		var record = gridPanel.getStore().getAt(rIndex);
		operateId = record.get("id");
		operateName = record.get("name");
//    	console.log(record,record.get("id"));
    	
		if(1 == type){
			viewInfoFn(t,operateId,record);
		}
		else if (2 == type) {
			removeInfoFn(t,operateId,record);
		}
		else if (3 == type) {
			pauseInfoFn(t,operateId,record,4);
		}
		else if (4 == type) {
			bindTerminalFn(t,operateId,record);
		}
		else if (5 == type) {
			pauseInfoFn(t,operateId,record,2);
		}
	}
	 // 修改数据 
	 function viewInfoFn(t,id,record){
    	openInfoWin(t,id,record);
    }
    // 删除数据
	function removeInfoFn(t,id,record){
    	 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('confirm_del', " <font color=red>" + record.get("name") + "</font> ")
			 ,animateTarget: t, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'activity!deletePriceStrategy.action'
					    ,params: {id: id}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  var result = showResult(success,response);				        	  
				        	  Ext.getBody().unmask();
				        	  if(result.code != 0) return;
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('deleteFileSuccess'));
				        	  queryFun();
				        }
				   });
			   }
		 }});
    }
    // 暂停
	function pauseInfoFn(t,id,record,status){
    	//console.log(record,id);
    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:getIi18NText(status == 4?'pauseTips':'enableTips', "<font color=red>" + record.get("name") + "</font>")
			 ,animateTarget: t, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('confirm'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'activity!updatePriceStrategy.action'
					    ,params: {id: id,status:status}
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
     * 绑定按钮 时间
     */
    function bindTerminalFn(t,id,record){
		var bindWin = Ext.getCmp(bindPSToTer);
		if(bindWin && bindWin.isWindow){
			bindWin.show(t);
			refreshMonitarData();
		}else{
			bindWin = Ext.create('Ext.window.Window',{
				title :getIi18NText('bindTre'),
				id : bindPSToTer,
				height:450,
				width: 600,
				layout:'border',
				border:false,
				plain: true, 
				frame:false,
				closable:true,
				header : true,
				modal:true,
				closeAction : 'hide',
				maximizable:true,
				headerCssClass:"quickReleaseWinCss",
				items:[{
					region : 'east',
					width : '100%',
					border : false,
					layout : 'fit',
					listeners : {
						render : renderTerTable,
						handler : function(e, t, eOpts) {
							viewport.doLayout();
						}
					}
				}]
			}).show(t);
		}
    }
    
    /**
     * 绑定按钮-渲染终端列表
     */
    function renderTerTable($this, eopt) {
		terProxy = getAjaxProxy({
					url : 'terminal!getAllTerminal.action',
					extraParams : {
						t : 2,
						g : -1,
						w : 1,
						a : 0
					}
				});
		terStore = Ext.create('Ext.data.Store', {
					fields : ['terId', 'name', 'groupName', 'stateValue', 'ip',
							'screen', 'authType','owner'],
					pageSize : 10,
					proxy : terProxy,
					autoLoad : true,
					buffered : false,
					leadingBufferZone : 50
				});
		terGridPanel = Ext.create('Ext.grid.Panel', {
					title : '<font class="tipFont">'+selfVersion?getIi18NText('chooseOnlineDevice'):getIi18NText("quickR02")+'</font>',
					iconCls : 'tabIconCss',
					frame : false,
					shadow : false,
					header : false,
					store : terStore,
					selType : 'checkboxmodel',
					selModel : checkboxModelTerminal,
					columns : [
					           	{text : getIi18NText("No"),width : 50,xtype : 'rownumberer'}, 
					           	{text : selfVersion?getIi18NText('deviceNames'):getIi18NText("terminalName"),dataIndex : 'name',flex : 1,minWidth : 90},
								{text : selfVersion?getIi18NText('deviceGroup'):getIi18NText("belongTeam"),dataIndex : 'groupName',flex : 1,minWidth : 90},
								{text : getIi18NText("creator"),dataIndex : 'owner',flex : 1,minWidth : 90},
								{text : getIi18NText("screen"),dataIndex : 'screen',minWidth : 50}, 
								{text : getIi18NText("authType"),dataIndex : 'authType',	minWidth : 50
							}],
					margin : '1',
					tools : [{
								xtype : 'button',
								text : getIi18NText("refresh"),
								border : false,
								iconCls : 'refreshIconCss',
								handler : function(event, toolEl) {
								}
							}],
					viewConfig : { 
						trackOver : false,
						disableSelection : false,
						emptyText : '<h1 style="margin:10px">'
								+ window.top.getIi18NText('roleTip05')
								+ '</h1>'
					},
					bbar : [{
								id : 'TpadingBar',
								xtype : 'pagingtoolbar',
								store : terStore,
								border : false,
								displayInfo : true
							}]
				});
		terPanel = Ext.create('Ext.panel.Panel', {
			xtype : 'panel',
			layout : 'border',
			border : false,
			bodyStyle : 'background: white',
			items : [{
				region : 'center',
				layout : 'border',
				bodyStyle : 'background: white;',
				border : false,
				items : [{
					xtype : 'fieldset',
					region : 'center',
					title : '<font class="tipFont">'+ selfVersion?getIi18NText('chooseOnlineDevice'):getIi18NText("quickR02") + '</font>',
					margin : '0 3 0 3',
					layout : 'border',
					items : [{
						region : 'north',
						id : 'terSearchBar',
						width : '100%',
						height : 60,
						border : false,
						layout : {
							type : 'hbox',
							align : "middle"
						},
						bodyCls : 'x_panel_backDD',
						items : [{
									xtype : 'image',
									src : '',
									width : 40,
									height : 24,
									imgCls : 'searchIconCss'
								},{
									fieldLabel : selfVersion?getIi18NText("deviceNames"):getIi18NText("item_termialN"),
									xtype : 'textfield',
									maxLength : 50,
									id : 'terminalName',
									width : getIi18NText('confirm')=='OK'?250:270,
									labelWidth : 55,
									emptyText : getIi18NText("selectTerminalTip01"),
									enforceMaxLength : true,
									listeners : {
										change : delaySearchTerminalFn
									}
								},{
									xtype : 'button',
									id : 'refreshTerBtn',
									text : getIi18NText("refresh"),
									border : false,
									margin : '0 0 0 10',
									iconCls : 'refreshIconCss',
									handler : refreshMonitarData
								},{
									xtype : 'button',
									text : getIi18NText('bind'),
									margin : '12 0 0 10',
									width : 85,
									height : 40,
									ctype : 'save',
									handler : bindBtnFn
								}]
					}, {
						region : 'center',
						border : false,
						height : 100,
						layout : 'fit',
						items : [terGridPanel]
					}]
				}]
			}
		]
		});
		$this.add(terPanel);
	}
    /**
     * 绑定终端窗口-搜索终端
     */
    function refreshMonitarData() {
		terProxy.setExtraParam("n", encode(Ext.getCmp('terminalName')
						.getValue()));
		terStore.loadPage(1);
		recordIds.clear();
	}
    /**
     * 绑定终端窗口-延迟搜索终端
     */
    function delaySearchTerminalFn() {
		window.clearTimeout(timeId);
		timeId = window.setTimeout(function() {
					refreshMonitarData();
				}, 800);
	};
    
	/**
	 * 绑定按钮事件
	 * @param btn
	 */
	function bindBtnFn(btn) {
		// 是否勾选了终端
		if (recordIds.length < 1) {
			Ext.example.msg(getIi18NText('systemMessage'), getIi18NText('quickR10'));
			return;
		}
		//终端ID
		var tids = [];
		Ext.each(recordIds.items, function(item, index, array) {
			tids.push(item.get('terId'));
		});
		var tidsStr = tids.join(",");
		
		var quickReleaseWin = Ext.getCmp(bindPSToTer);
		if(quickReleaseWin){
			quickReleaseWin.mask();
		}
		Ext.Ajax.request({
			url : 'activity!saveBindTerminal.action',
			params : {
			   sid: operateId,	// 策略id
			   tids: tidsStr	// 终端id
			},
			method : 'post',
			timeout : 240000
			// opt:调用request时的参数;success：请求成功则返回true;res：服务器响应response
			,
			callback : function(opt, success, response) {
				if(quickReleaseWin){
					quickReleaseWin.unmask();
				}
				var result = showResult(success, response);
				if (result.code != 0)
					return;
					
				Ext.MessageBox.alert(getIi18NText('systemMessage'), getIi18NText('priceStrategy')+' '+getIi18NText('sendXToDevice',operateName), function () {
		   			Ext.getCmp(bindPSToTer).close();
	            });
			}
		});
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
    	 return r.get('startTime')+'<br/>'+getIi18NText("to")+'<br/>'+r.get('endTime');
	}
   
	//商品搜索
	function queryFun2($this, eopt){
    	 //console.log("searchTextId2--->",Ext.getCmp('searchTextId2').getValue());
    	 allGoodsStore.proxy.setExtraParam("n", encode(Ext.getCmp('searchTextId2').getValue()));
    	 allGoodsStore.loadPage(1);
	}
});
