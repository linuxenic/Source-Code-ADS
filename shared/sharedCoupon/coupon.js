Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var viewport,gridPanel,dataStore,ctrColumn,ajaxProxy,addInfoWin,couponId,tids,gids;
     var chooseTerminalWin,selectGoodsWin,selectGoodsArr = [];
	var  AUTH = Ext.merge({"delete": false , add : false , update : false ,"export":false}, Ext.decode(decode(AUTH_TBAR)));
	var nowEndDate = new Date();
	nowEndDate.setHours(23, 59, 59);
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	var isEng = (getIi18NText("confirm") == "OK");
	var nowDate = new Date();
	 //创建对象
 	 Ext.define('record', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'terId', type: 'int'}
	     ]
	 });
	 // 初始商品对象
 	 Ext.define('goodsObject', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'id', type: 'int'}
	     ]
	 });
	 function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
	
	ctrColumn =  { text: window.top.getIi18NText('operation'),  minWidth: 140, maxWidth:180, menuText: window.top.getIi18NText('operation'), menuDisabled: true, 
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
	if(AUTH["export"]){
		ctrColumn.items.push({
	    	       iconCls: 'exportIconCss'
	        	   ,tooltip: window.top.getIi18NText('export')
	        	   ,handler:  exportCoupon
	    });
		ctrColumn.hidden = false;
	}
	
    var checkBoxTer = new Ext.selection.CheckboxModel({
		listeners:{
			'select':chooseTerSelect,
			'deselect':chooseTerDeselect
		}  		
  	});
  		
	var chooseTerIds = new Ext.util.MixedCollection();
	function chooseTerSelect(m,record){
		if(!chooseTerIds.containsKey(record.get('terId'))){
			chooseTerIds.add(record.get('terId'),record);
		}
	}
	function chooseTerDeselect(m,record){
		if(chooseTerIds.containsKey(record.get('terId'))){
			chooseTerIds.removeAtKey(record.get('terId'));
		}
	}
	
	/** -------------------添加商品数据相关数据  start---------------------  **/
    // 已勾选商品
	var checkBoxGoods = new Ext.selection.CheckboxModel({
		listeners:{
			'select':chooseGoodsSelect,
			'deselect':chooseGoodsDeselect
		}  		
  	});
	var chooseGoodsIds = new Ext.util.MixedCollection();
	function chooseGoodsSelect(m,record){
		if(!chooseGoodsIds.containsKey(record.get('id'))){
			chooseGoodsIds.add(record.get('id'),record);
		}
	}
	function chooseGoodsDeselect(m,record){
		if(chooseGoodsIds.containsKey(record.get('id'))){
			chooseGoodsIds.removeAtKey(record.get('id'));
		}
	}
    
	//商品搜索
    function queryGoodsFn($this, eopt){
	   	 allGoodsStore.proxy.setExtraParam("n", encode(Ext.getCmp('goodSearchTextId').getValue()));
	   	 allGoodsStore.loadPage(1);
    }
	
	/** -------------------添加商品数据相关数据  end---------------------  **/
	
	
	viewport=Ext.create("Ext.container.Viewport",{
		layout:'border',
		renderTo:Ext.getBody(),
		border:false,
		style:'background:white'
		,autoScroll: false
		,minWidth: 800
		,minHeight: 350
		,layout: 'border'
		,items:[{
			 region: 'north'
		    ,layout: 'vbox'
		    ,height: 70
		    ,width: 400
		    ,id: 'northContanier'
		    ,bodyCls: 'x_panel_backDD'
    	   ,items : [
    	             {
    	             	xtype:'panel',
    	             	layout:'hbox',
//    	             	width:780, 
    	             	defaults: {margin:'8 2 5 3'},
    	             	id:'panelone',
    	             	border:false,
    	             	items:[
								{
								xtype: 'image',
								src: '',
								width: 40,
								height: 24,
								imgCls: 'searchIconCss'			    	           
								},{
									 fieldLabel: window.top.getIi18NText('status')
								,labelAlign: 'right'
								,xtype: 'combobox'
								,store: [[-1,window.top.getIi18NText('allType')],[0,getIi18NText("monitor_message_51")],[1,getIi18NText("nullify")]]
								,value: -1
								,labelWidth: 40
								,width: window.top.langtype=="CN"?110:130
								,editable: false
								,queryMode: 'local'
								,maxLength: 50
								,id: 'searchstate'
								},{
									 fieldLabel: window.top.getIi18NText('type')
								,labelAlign: 'right'
								,xtype: 'combobox'
								,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('coupon')],[4,getIi18NText('fillCoupon')],[5,getIi18NText('randomCoupon')],[6,getIi18NText('freeCoupon')]]
								,value: -1
								,labelWidth: 40
								,width: window.top.langtype=="CN"?130:180
								,editable: false
								,queryMode: 'local'
								,maxLength: 50
								,id: 'searchType'
								},{
									 fieldLabel: window.top.getIi18NText('useType')
								,labelAlign: 'right'
								,xtype: 'combobox'
								,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('allDay')],[2,getIi18NText('breakfast')],[3,getIi18NText('lunch')],[4,getIi18NText('dinner')]]
								,value: -1
								,labelWidth: 60
								,width:window.top.langtype=="CN"?140:160
								,editable: false
								,queryMode: 'local'
								,maxLength: 50
								,id: 'searchUseType'
								},{
									 fieldLabel: window.top.getIi18NText('terScope')
								,labelAlign: 'right'
								,xtype: 'combobox'
								,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('allTer')],[2,getIi18NText('someTer')]]
								,value: -1
								,labelWidth: 60
								,width:window.top.langtype=="CN"?160:180
								,editable: false
								,queryMode: 'local'
								,maxLength: 50
								,id: 'searchScope'
								},{
									 fieldLabel: window.top.getIi18NText('frequency')
								,labelAlign: 'right'
								,xtype: 'combobox'
								,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('frequency1')],[2,getIi18NText('frequency2')]]
								,value: -1
								,labelWidth: window.top.langtype=="CN"?40:60
								,width: window.top.langtype=="CN"?160:170
								,editable: false
								,queryMode: 'local'
								,maxLength: 50
								,id: 'searchFrequency'
								},									
    	             	      ]},
 	        	             {
  	        	             	xtype:'panel',
	        	             	layout:'hbox',
//	        	             	defaults: {margin:'8 2 5 3'},
	        	             	border:false,
  	        	             	items:[{
								    fieldLabel: window.top.getIi18NText('name')
									,id: 'searchTextId'
									,labelAlign: 'right'
									,xtype: 'textfield'
									,maxLength: 50
									,width: 195
									,labelWidth: 40
									,emptyText: getIi18NText('searchByNameCode')
									    ,enforceMaxLength: true
									  },
									{
									    xtype: 'datefield',
									    fieldLabel: window.top.getIi18NText('companyInfo10')
									    ,margin:'0 3 0 25'
									    ,labelWidth: isEng == true?66:40
									    ,width: isEng == true?175:150
									   ,id: 'btime'
									   ,name: 'btime'
									   ,format: 'Y/m/d'
									   ,hidden:false
									   ,emptyText: window.top.getIi18NText('startTime')
									  },{
									     xtype: 'datefield'
									    ,name: 'etime'
									    ,id: 'etime'
									    ,width: 105
									    ,format: 'Y/m/d'
									    ,margin:'0 20 0 0'
									   ,hidden:false
									    ,emptyText: window.top.getIi18NText('endTime')
									  },{
									    xtype: 'button'
									   ,id: 'queryBut'
									   ,iconCls: 'queryIconCss'
									   ,text:  window.top.getIi18NText('select')
									   ,handler: queryFun
									  }]
									},
  	        	             	      ]}
    	             	      
						,{ 
					    region: 'center'
					    ,border: false
					    ,layout: 'fit'
					    ,listeners: {
		            	   render: renderTable
		            	}
				    }]
				});
			
	function renderTable($this, eopt){
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","cname","frequency","get","used","probability","scope","tids","terType","timeType",
			          "day","minAmount","useType","maxAmount","way","code","price","type","total","count",
			          "status","amount","stime","etime","latest","userName",
			          "goodsScope","gids"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'shared!getAllCouponList.action',
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
		});
		    
	    gridPanel=Ext.create("Ext.grid.Panel",{
		    title:window.top.getIi18NText('couponLists'),
		    iconCls: 'tabIconCss',
		    frame: false,
		    store: dataStore,
//		    selType:'checkboxmodel',
	    	frame : false,
	    	autoScroll: true,
			border:false,
			forceFit:true,
		    columns: {
				items :[{
						text : window.top.getIi18NText('Noo'),
						width : 60,
						xtype : 'rownumberer'
						,align : 'center'
					}, {
						text :getIi18NText('name'),
						dataIndex : 'cname'
						,minWidth:90
					}, {
						text :window.top.getIi18NText('serNu'),
						dataIndex : 'code'
						,minWidth:90
					}, {
						text :window.top.getIi18NText('gd_sum'),
						dataIndex : 'amount'
						,minWidth:120
						,renderer:amountRenderFn
					}, {
						text :window.top.getIi18NText('maxStock'),
						dataIndex : 'total'
						,minWidth:80
					},{
						text :window.top.getIi18NText('receive'),
						dataIndex : 'get'
						,minWidth:60
					},{
						text :window.top.getIi18NText('used'),
						dataIndex : 'used'
						,minWidth:60
					}, {
						text :window.top.getIi18NText('status'),
						dataIndex : 'status'
						,minWidth:60
						,renderer:statusRenderFn
					}, {
						text :window.top.getIi18NText('type'),
						dataIndex : 'type'
						,minWidth:90
						,renderer:typeRenderFn
					}, {
						text :window.top.getIi18NText('useType'),
						dataIndex : 'useType'
						,minWidth:80
						,renderer:useTypeRenderFn
					}, {
						text :window.top.getIi18NText('terScope'),
						dataIndex : 'scope'
						,minWidth:80
						,renderer:scopeRenderFn
					},  {
						text :window.top.getIi18NText('goodsScope'),
						dataIndex : 'goodsScope'
						,minWidth:80
						,renderer:goodsScopeRenderFn
					},{
						text :window.top.getIi18NText('frequency'),
						dataIndex : 'frequency'
						,minWidth:110
						,renderer:frequencyRenderFn
					}, {
						text :window.top.getIi18NText('companyInfo10'),
						dataIndex : 'timeType',
						minWidth:140,
						renderer:timeRender
					},ctrColumn,{
						text :window.top.getIi18NText('creator'),
						dataIndex : 'userName'
						,minWidth:80
					}, {
						text :window.top.getIi18NText('lastUpdateTime'),
						dataIndex : 'latest',
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
    	   dataStore.getProxy().setExtraParam("status", Ext.getCmp('searchstate').getValue());
    	   dataStore.getProxy().setExtraParam("type", Ext.getCmp('searchType').getValue());
    	   dataStore.getProxy().setExtraParam("useType", Ext.getCmp('searchUseType').getValue());
    	   dataStore.getProxy().setExtraParam("frequency", Ext.getCmp('searchFrequency').getValue());
    	   dataStore.getProxy().setExtraParam("scope", Ext.getCmp('searchScope').getValue());
	       dataStore.getProxy().setExtraParam("n", encode(Ext.getCmp('searchTextId').getValue()));
		   dataStore.getProxy().setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   dataStore.getProxy().setExtraParam("e", Ext.Date.format(etime.getValue(),'Y/m/d 23:59:59'));
		   dataStore.loadPage(1);   	   
     } 
	
     //修改信息 
    function editInfoFu(v,r,c,i,e,record,row){
    	 openInfoWin(row,record.get("id"),record);
    }
     //添加窗口
    function openInfoWin(btn,tid,record){
    	couponId = tid;
    	
    	var beforecloseFn=function(){
	    	Ext.getCmp('couponMoney').setDisabled(false);
			Ext.getCmp('couponBtime').setDisabled(false);
	    	Ext.getCmp('couponEtime').setDisabled(false);
	    	Ext.getCmp('couponType').setDisabled(false);
    		Ext.getCmp('couponFrequency').setDisabled(false);
			Ext.getCmp('limitAmount').setDisabled(false);
	    	Ext.getCmp('otherAmount').setDisabled(false);
			Ext.getCmp('minAmount').setDisabled(false);
			Ext.getCmp('couponDay').setDisabled(false);
			Ext.getCmp('timeType').setDisabled(false);
			Ext.getCmp('useType').setDisabled(false);
			Ext.getCmp('maxAmount').setDisabled(false);
	    	Ext.getCmp('couponName').setValue(null);
	    	Ext.getCmp('couponStock').setMinValue(1);
	    	Ext.getCmp('couponStock').setValue(null);
	    	Ext.getCmp('couponMoney').setValue(null);
			Ext.getCmp('couponBtime').setValue(null);
	    	Ext.getCmp('couponEtime').setValue(null);
	    	Ext.getCmp('couponDay').setValue(7);
			Ext.getCmp('probability').setValue(0);
	    	Ext.getCmp('couponStatus').setValue(0);
	    	Ext.getCmp('couponType').setValue(1);
	    	Ext.getCmp('useType').setValue(1);
	    	Ext.getCmp('couponFrequency').setValue(1);
	    	Ext.getCmp('freeTerminal').setValue(0);
	    	// 选择商品 恢复至所有商品状态
	    	Ext.getCmp('goodsScope').setValue(1);
	    	Ext.getCmp('freeGoods').setValue(0);
	    	
			addInfoWin.setTitle(getIi18NText('addCoupon'));
	    	chooseTerIds.clear();
	    	// 清空已選擇的商品數據
	    	chooseGoodsIds.clear();
	    	if(checkBoxGoods.getCount() > 0){
   				checkBoxGoods.deselectAll();
   			}
	    	
    		addInfoWin.hide(btn);
    	};
    	var showFn = function(){
			if(/^\d+$/.test(tid)){//修改信息
				addInfoWin.setTitle(getIi18NText('updateCoupons'));
				editCallback(record)
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
				  title:getIi18NText('addCoupon')
				  ,plain: true
				  ,width: 550
				  ,minWidth: 200
				  ,minHeight: 200
				  ,autoScroll:true
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
                  	,id:'myForm'
				   	,width: '100%'
				   	,height: '100%'
				   	,monitorValid:true
				   	,border: false
				   	,defaults:{
				   		margin:'20 0 0 30'
				   	}
				   	,items:[
				   	        {                 	
							xtype : 'panel',
							border : false,
							layout:'column',
							items : [{
								xtype:'textfield',
								id:'couponName',
								fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('name'),
								width:220,
								labelWidth:60,
								labelAlign:'right',
								maxLength:50,
								enforceMaxLength:true,
								allowBlank:false,
								emptyText:getIi18NText("couponsTips")			
							}]						
	                  },{
	                  	 	xtype : 'panel',
							border : false,
							layout:'column',
							items : [{
		    	            	 fieldLabel: window.top.getIi18NText('type')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,store: [[1,getIi18NText('coupon')],[4,getIi18NText('fillCoupon')],[5,getIi18NText('randomCoupon')],[6,getIi18NText('freeCoupon')]]
				                ,value: 1
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,allowBlank:false
							    ,maxLength: 50
							    ,id: 'couponType'
							    ,listeners: {
							    	change: function($this,newValue,oldValue,e){
											Ext.getCmp('couponStock').show();
											Ext.getCmp('probabilityTips').hide();
											Ext.getCmp('probability').hide();
    										Ext.getCmp('couponFrequency').setDisabled(false);
							    			Ext.getCmp('randomPanel').hide();
							    			Ext.getCmp('limitPanel').hide();
							    			Ext.getCmp('couponMoney').show();
							    			Ext.getCmp('couponMoney').setMaxValue(100);
							    			Ext.getCmp('couponMoney').setValue(null);
											Ext.getCmp('limitAmount').setValue('');
									    	Ext.getCmp('otherAmount').setValue('');
							    			Ext.getCmp('couponMoney').setFieldLabel(getIi18NText('couponAmount'));
							    			Ext.getCmp('couponStock').setFieldLabel(getIi18NText('maxStock'));
											Ext.getCmp('timeType').setDisabled(false);
											// 商品范围
    										Ext.getCmp('goodsScopePanel').show();
							    		if (newValue == 7) {//系统推送券
							    			Ext.getCmp('couponTime').hide();
											Ext.getCmp('couponStock').hide();
    										Ext.getCmp('couponFrequency').setDisabled(true);
    										// 商品范围
    										Ext.getCmp('goodsScopePanel').hide();
							    		} else if (newValue == 6) {//免单券
											Ext.getCmp('probability').show();
											Ext.getCmp('probabilityTips').show();
											Ext.getCmp('timeType').setValue(1);
											Ext.getCmp('timeType').setDisabled(true);
							    			Ext.getCmp('couponMoney').setFieldLabel(getIi18NText('freeSum'));
							    			Ext.getCmp('couponStock').setFieldLabel(getIi18NText('freeNumber'));
							    			// 商品范围
    										Ext.getCmp('goodsScopePanel').hide();
							    		} else if (newValue == 5) {//随机券
							    			Ext.getCmp('randomPanel').show();
							    			Ext.getCmp('couponMoney').setFieldLabel(getIi18NText('couponSum'));
							    			Ext.getCmp('couponMoney').setMaxValue(10000);
							    			Ext.getCmp('couponMoney').setValue(null);
									    	Ext.getCmp('minAmount').setValue(null);
									    	Ext.getCmp('maxAmount').setValue(null);
									    	// 商品范围
    										Ext.getCmp('goodsScopePanel').hide();
							    		} else if (newValue == 4) {//满减券
							    			Ext.getCmp('couponMoney').hide();
							    			Ext.getCmp('limitPanel').show();
											Ext.getCmp('limitAmount').setValue('');
									    	Ext.getCmp('otherAmount').setValue('');
									    	// 商品范围
    										Ext.getCmp('goodsScopePanel').hide();
							    		}
							    	}
					            }
							},{
		    	            	 fieldLabel: window.top.getIi18NText('status')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,margin:'0 0 0 40'
							    ,store: [[0,getIi18NText("monitor_message_51")],[1,getIi18NText("nullify")]]
				                ,value: 0
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,allowBlank:false
							    ,maxLength: 50
							    ,id: 'couponStatus'
							}]
	                  },{
	                  	 	xtype : 'panel',
							border : false,
							layout:'column',
							items : [{
		    	            	 fieldLabel: window.top.getIi18NText('useType')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,store: [[1,getIi18NText('allDay')],[2,getIi18NText('breakfast')],[3,getIi18NText('lunch')],[4,getIi18NText('dinner')]]
				                ,value: 1
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,allowBlank:false
							    ,maxLength: 50
							    ,id: 'useType'
							},{
								fieldLabel: window.top.getIi18NText('frequency')
							    ,labelAlign: 'right'
							    ,id: 'couponFrequency'
							    ,xtype: 'combobox'
							    ,margin:'0 0 0 40'
							    ,store: [[1,getIi18NText('frequency1')],[2,getIi18NText('frequency2')]]
				                ,value: 1
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,allowBlank:false
							    ,maxLength: 50
							}]
	                  },{
	                  	    xtype : 'panel',
							border : false,
							layout:'column',
							id:'randomPanel',
							hidden:true,
							items : [{
								xtype:'numberfield',
								id:'minAmount',
								fieldLabel:getIi18NText('minAmount'),
								width:220,
								labelWidth:60,
								labelAlign: 'right',
								maxValue:100,
								minValue:0.1,
								allowDecimals: true,
						        decimalPrecision: 1,
								value:'',
								negativeText:window.top.getIi18NText('negativeTips'),
								emptyText:getIi18NText('minAmount')
							},{
								xtype:'numberfield',
								id:'maxAmount',
								fieldLabel:getIi18NText('maxAmount'),
								width:220,
								labelWidth:60,
								labelAlign: 'right',
							    margin:'0 0 0 40',
								maxValue:1000,
								minValue:0.1,
								allowDecimals: true,
						        decimalPrecision: 1,
								value:'',
								negativeText:window.top.getIi18NText('negativeTips'),
								emptyText:window.top.getIi18NText('maxAmount')
							}]
	                  },{
	                  	    xtype : 'panel',
							border : false,
							layout:'column',
							items : [{
								xtype:'numberfield',
								id:'couponMoney',
								fieldLabel:'<font color="red">*</font>'+getIi18NText('couponAmount'),
								width:220,
								labelWidth:60,
								labelAlign: 'right',
								maxValue:100,
								minValue:0.1,
								allowDecimals: true,
						        decimalPrecision: 1,
								value:'',
								negativeText:window.top.getIi18NText('negativeTips'),
								emptyText:getIi18NText('couponsTips1')
							},{
		                  	    xtype : 'panel',
								border : false,
								layout:'column',
								hidden:true,
								id:'limitPanel',
								items : [{
									xtype:'numberfield',
									fieldLabel:'<font color="red">*</font>'+getIi18NText('full'),
									labelAlign: 'right',
									width:window.top.langtype=="CN" ? 130 : 125,
									id:'limitAmount',
									labelWidth:60,
									maxValue:100,
									minValue:0.1,
									allowDecimals: true,
							        decimalPrecision: 1,
									value:'',
	//								allowBlank:false,
									negativeText:window.top.getIi18NText('negativeTips'),
									labelSeparator : ""
								} , {
									xtype:'numberfield',
									fieldLabel:getIi18NText('less'),
									width:window.top.langtype=="CN" ? 85 : 90,
									labelAlign: 'center',
									labelWidth:window.top.langtype=="CN" ? 15 : 25,
									maxValue:100,
									minValue:0.1,
									id:'otherAmount',
									allowDecimals: true,
							        decimalPrecision: 1,
							        margin: '0 0 0 5',
									value:'',
	//								allowBlank:false,
									negativeText:window.top.getIi18NText('negativeTips'),
									labelSeparator : ""
								}]
		                  },{
								xtype:'numberfield',
								id:'couponStock',
								fieldLabel:window.top.getIi18NText('maxStock'),
								width:220,
								labelWidth:60,
							    margin:'0 0 0 40',
								minValue:1,
								labelAlign:'right',
								allowDecimals: false,
								allowBlank:true,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:window.top.getIi18NText('count')
							}]
	                  },{
	                  	    xtype : 'panel',
							border : false,
							layout:'column',
							items : [{
		    	            	 fieldLabel: getIi18NText('terScope')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,store: [[1,getIi18NText('allTer')],[2,getIi18NText('someTer')]]
				                ,value: 1
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,allowBlank:false
							    ,maxLength: 50
							    ,id: 'terminalType'
							    ,listeners: {
							    	change: function($this,newValue,oldValue,e){
							    		if (newValue == 2) {//指定终端
							    			Ext.getCmp('freeTerminal').show();
											Ext.getCmp('saveTerminal').show();
							    		} else {
							    			Ext.getCmp('freeTerminal').hide();
											Ext.getCmp('saveTerminal').hide();
							    		}
							    	}
					            }
							},{
								xtype:'numberfield',
								id:'freeTerminal',
								fieldLabel:'<font color="red">*</font>'+getIi18NText('freeTerminal'),
								width:160,
								labelWidth:60,
								hidden:true,
								labelAlign: 'right',
							    margin:'0 0 0 40',
								maxValue:1000,
								minValue:0,
								allowDecimals: false,
							    editable:false,
							    readOnly:true,
								value:0,
								negativeText:window.top.getIi18NText('negativeTips')
							},{
								xtype : 'button',
								text : getIi18NText('choose'),
								margin:'0 0 0 5',
								hidden:true,
								id:'saveTerminal',
								border : true,
								handler: chooseTerminal
							}]
	                   },
	                   {
							xtype : 'panel',
							id:'goodsScopePanel',
							layout:'column',
							hidden: false,
							border : false,
							defaults:{labelAlign:'right'},
							items : [{
										xtype : 'combo',
										fieldLabel : getIi18NText('goodsScope'),
										editable : false,
										id : 'goodsScope',
										labelWidth :isEng == true?90:60,
										width : 220,
										value:1,
										store : [[1,getIi18NText('allGoods')],[2,getIi18NText('someGoods')]],
										allowBlank : false
										,listeners: {
									    	change: function($this,newValue,oldValue,e){
									    		if (newValue == 2) {//指定终端
									    			Ext.getCmp('freeGoods').show();
													Ext.getCmp('saveGoods').show();
									    		} else {
									    			Ext.getCmp('freeGoods').hide();
													Ext.getCmp('saveGoods').hide();
									    		}
									    	}
							            }
								},{
									xtype:'numberfield',
									id:'freeGoods',
									fieldLabel:'<font color="red">*</font>'+getIi18NText('goods')+' '+getIi18NText('count'),
									width:150,
									labelWidth:isEng == true?90:60,
									hidden:true,
									labelAlign: 'right',
								    margin:'0 0 0 40',
									maxValue:1000,
									minValue:0,
									allowDecimals: false,
								    editable:false,
								    readOnly:true,
									value:0,
									negativeText:window.top.getIi18NText('negativeTips')
								},{
									xtype : 'button',
									id:'saveGoods',
									text : getIi18NText('choose'),
									margin:'0 0 0 5',
									hidden:true,
									border : true,
									handler:openSelectGoodsWin
								}]		
	              		},{  	
							xtype : 'panel',
							border : false,
							layout:'column',
							items:[{
		    	            	 fieldLabel: getIi18NText('timeType')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,store: [[1,getIi18NText('timeInterval')],[2,getIi18NText('timeDay')]]
				                ,value: 1
				                ,labelWidth: 60
				                ,width: 220
				                ,editable: false
							    ,queryMode: 'local'
								,labelAlign:'right'
								,allowBlank:false
							    ,maxLength: 50
							    ,id: 'timeType'
							    ,listeners: {
							    	change: function($this,newValue,oldValue,e){
							    		if (newValue == 2) {//有效天数
							    			Ext.getCmp('couponTime').hide();
							    			Ext.getCmp('couponTimeDay').show();
							    		} else {
							    			Ext.getCmp('couponTime').show();
							    			Ext.getCmp('couponTimeDay').hide();
							    		}
							    	}
					            }
							},{
								xtype:'numberfield',
								id:'probability',
								fieldLabel:getIi18NText('probability'),
								width:160,
								hidden:true,
								labelWidth:60,
								labelAlign: 'right',
								editable: false,
							    margin:'0 0 0 40',
								maxValue:100,
								minValue:0,
								allowDecimals: false,
								value:0,
								negativeText:window.top.getIi18NText('negativeTips')
							},{
								xtype: 'displayfield',
								id:'probabilityTips',
								margin:'0 0 0 5',
								width:40,
								labelWidth:40,
								hidden:true,
		            		    fieldLabel: '%',
		            		    labelSeparator: '' 
							}]
	                   },{      	
							xtype : 'panel',
							border : false,
							id:'couponTimeDay',
							hidden:true,
							layout:'column',
							items:[{
						        xtype: 'numberfield'
						       ,fieldLabel:getIi18NText('timeDay')
						       ,labelWidth: 60
						       ,width: 220
//						       ,allowBlank:false
							   ,labelAlign:'right'
						   	   ,editable:false
						   	   ,allowDecimal:false
						   	   ,minValue:1
						   	   ,value:7
						       ,id: 'couponDay'
						       ,format:dateFormat
						      },{
								xtype: 'displayfield',
								margin:'0 0 0 20',
		            		    fieldLabel: '<font style="color:red;">'+getIi18NText('dayTips','?')+'</font>',
		            		    labelSeparator: '' 
							}]
	                  },{      	
							xtype : 'panel',
							border : false,
							id:'couponTime',
							layout:'column',
							items:[{
						        xtype: 'datefield',
						        fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('startTime')
						       ,labelWidth: 60
						       ,width: 220
							   ,labelAlign:'right'
//						       ,allowBlank:false
						   	   ,editable:false
						       ,id: 'couponBtime'
						       ,emptyText: window.top.getIi18NText('startTime')
						       ,format:dateFormat
						      },{
							     xtype: 'datefield'
							    ,fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('endTime')
							    ,id: 'couponEtime'
							    ,labelWidth: 60
//							    ,allowBlank:false
							    ,editable:false
								,labelAlign:'right'
						       	,width: 220
						        ,margin:'0 0 0 40'
							    ,emptyText: window.top.getIi18NText('endTime')
							    ,format: dateFormat
							    ,listeners: {
							    	select: function($this){
							    		var temdate=$this.getValue();
							    		temdate.setHours(23, 59, 59);
							    		$this.setValue(temdate);
							    	}
					            }
							 }]
	                  }]
                    ,dockedItems : [{
							xtype : 'toolbar',
							dock : 'bottom',
							ui : 'footer',
							margin:'10 0 0 0',
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
    
    //修改数据回显
    function editCallback(r){
    	var minVa = r.get("get");
    	if (minVa < 1) {
    		minVa = 1;
    	}
    	var type = r.get("type");
    	var total = r.get("total");
    	var amount = r.get("amount");
    	var terType = r.get("terType");
    	var timeType = r.get("timeType");
    	// 商品选择信息回显
    	var goodsScope = r.get("goodsScope");
    	Ext.getCmp('goodsScope').setValue(goodsScope);
    	
    	Ext.getCmp('couponName').setValue(r.get("cname"));
    	Ext.getCmp('useType').setValue(r.get("useType"));
    	Ext.getCmp('couponStatus').setValue(r.get("status"));
    	Ext.getCmp('couponType').setValue(type);
    	Ext.getCmp('couponFrequency').setValue(r.get("frequency"));
	    	
    	Ext.getCmp('couponStock').setValue(total);
    	Ext.getCmp('couponStock').setMinValue(minVa);
		Ext.getCmp('couponMoney').setValue(amount);
		
		Ext.getCmp('timeType').setValue(timeType);
    	if (timeType == 2) {//有效天数
    		Ext.getCmp('couponDay').setValue(r.get("day"));
    	} else {
			Ext.getCmp('couponBtime').setValue(new Date(r.get("stime")));
	    	Ext.getCmp('couponEtime').setValue(new Date(r.get("etime")));
    	}
		Ext.getCmp('terminalType').setValue(terType);
    	if (terType == 2) {//指定终端
			tids = r.get("tids");
			var idarr = tids.split(',')
//			console.info('所有终端',r.get("tids"));
			for (var i = 0; i < idarr.length; i++) {
				var t = new record({
		    		terId:idarr[i]
		        }); 
				chooseTerIds.add(idarr[i],t);
			}
	    	Ext.getCmp('freeTerminal').setValue(idarr.length);
    	}
    	
    	// 商品数据回显
    	if (goodsScope == 2) {//指定终端
        	var gidStr = r.get("gids");
        	gids = gidStr;
			var idArr = gidStr.split(',')
			for (var i = 0; i < idArr.length; i++) {
				var t = new goodsObject({
		    		id:idArr[i]
		        }); 
				chooseGoodsIds.add(idArr[i],t);
			}
			Ext.getCmp('freeGoods').setValue(idArr.length);
    	}
    	
		if (type == 5) {//随机券
	    	
    		Ext.getCmp('minAmount').setValue(r.get("minAmount"));
			Ext.getCmp('maxAmount').setValue(r.get("maxAmount"));
	    	
		} else if (type == 4) {//满减券
			
    		Ext.getCmp('couponMoney').setValue('');
			Ext.getCmp('limitAmount').setValue(r.get("price"));
	    	Ext.getCmp('otherAmount').setValue(amount);
		} else if (type == 6) {//免单券
			Ext.getCmp('probability').setValue(r.get("probability"));
		}
    	
    	Ext.getCmp('couponMoney').setDisabled(true);
    	Ext.getCmp('couponType').setDisabled(true);
		Ext.getCmp('couponBtime').setDisabled(true);
		Ext.getCmp('couponDay').setDisabled(true);
		Ext.getCmp('timeType').setDisabled(true);
		Ext.getCmp('useType').setDisabled(true);
    	Ext.getCmp('couponEtime').setDisabled(true);
		Ext.getCmp('limitAmount').setDisabled(true);
    	Ext.getCmp('otherAmount').setDisabled(true);
    	Ext.getCmp('couponFrequency').setDisabled(true);
		Ext.getCmp('minAmount').setDisabled(true);
		Ext.getCmp('maxAmount').setDisabled(true);
    }
    
    //保存数据
    function saveInfo(v,r,c,i,e,record,row){
    	//参数太多 应该用json传参的
    	var type = Ext.getCmp("couponType").getValue();
    	var useType = Ext.getCmp("useType").getValue();
    	var	timeType = Ext.getCmp("timeType").getValue();
    	var startTime,endTime,day;
		if (timeType == 1) {//时间区间
	    	var bt = Ext.getCmp('couponBtime').getValue();
	    	if (type != 7) {
			    if(Ext.isEmpty(bt)){
				   showTip(Ext.getCmp('couponBtime'), window.top.getIi18NText('notNull'));
				   return;
			    }
	    	}
		    var et = Ext.getCmp('couponEtime').getValue();
		    if (type != 7) {
			    if(Ext.isEmpty(et)){
				   showTip(Ext.getCmp('couponEtime'), window.top.getIi18NText('notNull'));
				   return;
			    }
		    }
		    if (type != 7) {
		       if(bt > et){
		    	   showTip(Ext.getCmp('couponBtime'), window.top.getIi18NText('timesErrWarming'));    		    	  
		    	   return;
		       }
		    }
		    if (type != 7) {
		        startTime = bt.getTime();
	    		endTime = et.getTime();
		    }
		} else {
			day = Ext.getCmp("couponDay").getValue();
		}
		// 商品选择
		var goodsScope = Ext.getCmp("goodsScope").getValue();
    	if (goodsScope == 2) {
    		var tn = Ext.getCmp("freeGoods").getValue();
	    	if(tn <= 0){
	    		showTip(Ext.getCmp("freeGoods"),window.top.getIi18NText('minGoodsTip'));
	    		return;
	    	}
    	}
    	
    	var name = Ext.getCmp("couponName").getValue();
    	var status = Ext.getCmp("couponStatus").getValue();
    	var frequency = Ext.getCmp("couponFrequency").getValue();
    	var	total = Ext.getCmp("couponStock").getValue();
    	var	terminalType = Ext.getCmp("terminalType").getValue();
    	var price,amount,probability;
    	var minAmount,maxAmount;
    	if (type == 4) {
    		amount = Ext.getCmp("otherAmount").getValue();
			if (amount == null) {//金额不能为空
				showTip(Ext.getCmp("otherAmount"),window.top.getIi18NText('amountNotNull'));
				return;
			}
    	} else {
    		amount = Ext.getCmp("couponMoney").getValue();
    		if (amount == null) {//金额不能为空
				showTip(Ext.getCmp("couponMoney"),window.top.getIi18NText('amountNotNull'));
				return;
			}
    	}
    	
		if (terminalType == 2) {//指定终端
			var tn = Ext.getCmp("freeTerminal").getValue();
	    	if(tn <= 0){
	    		showTip(Ext.getCmp("freeTerminal"),window.top.getIi18NText('ter_tip'));
	    		return;
	    	}
		}
    	if (type == 4) {//满减券
    		price = Ext.getCmp("limitAmount").getValue();
    		if (price == null) {
    			showTip(Ext.getCmp("limitAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (amount > price) {
    			showTip(Ext.getCmp("otherAmount"),window.top.getIi18NText('amountNotMax'));
    			return;
    		}
    	} else if (type == 5) {//随机券
    		minAmount = Ext.getCmp("minAmount").getValue();
    		maxAmount = Ext.getCmp("maxAmount").getValue();
    		if (minAmount == null) {
    			showTip(Ext.getCmp("minAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (maxAmount ==  null) {
    			showTip(Ext.getCmp("maxAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (minAmount >= maxAmount) {
    			showTip(Ext.getCmp("maxAmount"),window.top.getIi18NText('amountNotMax1'));
    			return;
    		}
    		if (amount <= minAmount) {
    			showTip(Ext.getCmp("couponMoney"),window.top.getIi18NText('amountNotMax2'));
    			return;
    		}
    		if (total ==  null) {
    			showTip(Ext.getCmp("couponStock"),window.top.getIi18NText('stockNotNull'));
    			return;
    		}
    		var maxNum = Math.floor(amount/minAmount);
    		if (total > maxNum) {
    			showTip(Ext.getCmp("couponStock"),window.top.getIi18NText('maxStockTips')+":"+maxNum);
    			return;
    		}
    	} else if (type == 6) {//免单券
    		if (total == null) {
    			showTip(Ext.getCmp("couponStock"),window.top.getIi18NText('notNull'));
    			return;
    		}
    		probability = Ext.getCmp("probability").getValue();//免单券概率
    	}

    	var param = {id:couponId,name:name,probability:probability,terType:terminalType,timeType:timeType,day:day,tids:tids,
		    	useType:useType,minAmount:minAmount,maxAmount:maxAmount,type:type,price:price,total:total,amount:amount,
		    	startTime:startTime,endTime:endTime,status:status,frequency:frequency,
		    	goodsType:goodsScope,gids:gids}
//    	console.log('param',param);
    	if (!/^\d+$/.test(couponId) && ((type != 5 && amount >= 50) || (type == 5 && minAmount >= 50))) {
	    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
				           msg:window.top.getIi18NText('amountTips', "<font color=red>" + amount + "</font>")
				 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('save'), cancel: getIi18NText('cancel')},
				 fn:function(bid, text, opt){
				   if(bid == 'ok'){
				    	gridPanel.getEl().mask(window.top.getIi18NText('saving'));
					    Ext.Ajax.request({
						     url: 'shared!saveCoupon.action'
						    ,params: param
					        ,method: 'post'
					        ,callback: function(opt, success, response){
					        	  gridPanel.getEl().unmask();
					        	  var result = showResult(success,response);
					        	  if(result == false) return;
					        	  addInfoWin.close();
					        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('quickR101'));
					        	  queryFun();
					        }
					    });
				   }
			 }});
    	} else {
    		gridPanel.getEl().mask(window.top.getIi18NText('saving'));
		    Ext.Ajax.request({
			     url: 'shared!saveCoupon.action'
			    ,params: param
		        ,method: 'post'
		        ,callback: function(opt, success, response){
		        	  gridPanel.getEl().unmask();
		        	  var result = showResult(success,response);
		        	  if(result == false) return;
		        	  addInfoWin.close();
		        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('quickR101'));
		        	  queryFun();
		        }
		    });
    	}
    	
    }
    
    //删除数据
    function removeInfoFu(v,r,c,i,e,record,row){
    	 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('confirm_del', "<font color=red>" + record.get("cname") + "</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'shared!deleteCoupon.action'
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
    
     //导出抵扣券
    function exportCoupon(v,r,c,i,e,record,row){
    	 Ext.getBody().mask(getIi18NText('monitor_message_33'));
    	 Ext.Ajax.request({
    		    url: 'shared!exportCoupon.action',
    		    timeout: 60000,
    		    params: {id: record.get("id")},
    		    success: function(response){
    		    	Ext.getBody().unmask();
    		        var text =eval('(' + response.responseText + ')'); ;
    		        if(text.code=='0'){
    		        	window.location.href =getWebPath()+'/'+text.msg;
    		        	queryFun();
    		        	Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('monitor_message_35'));
    		        }else{
    		        	 //提示内容居中
    		        	 Ext.Msg.alert(getIi18NText('systemMessage'), text.msg).getEl().dom.children[1].querySelector('div table').align = "center";;
    		        	 queryFun();
    		        }
    		    },
    		    failure: function(response){
    		    	Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText("timeout"));
    		    	Ext.getBody().unmask();
    		    	queryFun();
    		    }
    		    
    		});
     }
    
    //所有商品数据數據源
    var allGoodsStore = Ext.create('Ext.data.Store', {
		fields : ['id','name','code'],
		buffered : false,
		autoLoad : false,
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
	             	if(chooseGoodsIds.containsKey(record.data.id)){
	                  	arry.push(record); 
	                  	checkBoxGoods.select(arry, true);
		             }
	            });
			}
       } 
	});
    // 所有商品表格
    var allGoodsGrid = Ext.create('Ext.grid.Panel', {
		    store:allGoodsStore,
		    height: 335,
		    width: '100%',
		    selType:'checkboxmodel',
		    selModel:checkBoxGoods,
		    bodyStyle: 'background: white',
		    forceFit : true,
		    columns: [
		     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' }
		     	,{ text: 'goodsId', width: 60 , dataIndex: 'id',hidden:true, align: 'center' }
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
    
     //免单券选择终端	
	var terStore= Ext.create('Ext.data.Store', {
		fields : ['terId', 'name', 'groupName', "terNum",'stateValue', 'ip',
						'screen', 'authType','owner'],
		buffered : false,
		autoLoad : true,
		pageSize : 10,
		leadingBufferZone : 50,
		proxy : {
			type : 'ajax',
			url : 'terminal!getAllTerminal.action',
			extraParams:{t:-1,g:-1,w:1,a:0},
			reader : {
				type : 'json',
				root : 'data',
				tiemout : 30000,
				totalProperty : 'totalCount'
			}
		},
		listeners: {
 	       		load:function($this){
		            var arry = [];  
		            $this.each(function(record) {  
		             	if(chooseTerIds.containsKey(record.data.terId)){						              	
		                  	arry.push(record); 
			             	checkBoxTer.select(arry, true);
			             } 
		            });
				}
 	       }
	});
		//所有在线终端
	var allTerminalPanel=Ext.create('Ext.grid.Panel', {
		    store:terStore,
		    selType:'checkboxmodel',
		    selModel:checkBoxTer,
		    forceFit : true,
			border:false,
		    columns: {
				items :[{
						text : window.top.getIi18NText('Noo'),
						width : 60,
						xtype : 'rownumberer'
						,align : 'center'
					}, {
						text :getIi18NText('terminalName'),
						dataIndex : 'name'
						,minWidth:90
					}, {
						text :window.top.getIi18NText('terNum'),
						dataIndex : 'terNum'
						,minWidth:90
					}, {
						text :window.top.getIi18NText('jsp_terOwner'),
						dataIndex : 'owner'
						,minWidth:120
					}],
				defaults : {
					menuDisabled : true,
					sortable :false,
					draggable: false,
					align : 'center'
				}
		    },
		    bbar : [{
						xtype : 'pagingtoolbar',
						store : terStore,
						border : false,
						displayInfo : true
					},{
						xtype:'tbfill'
					},{						
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 5 0 0',
						border : true,
						handler:function(){
							chooseTerminalWin.close();
						}
					},{						
						xtype : 'button',
						text : getIi18NText('confirm'),
						margin:'0 5 0 0',
						border : true,
						handler:saveTerminal
					}],
		    viewConfig : {
				trackOver : false,
				disableSelection : false,
				emptyText : '<h1 style="margin:10px">'
						+ window.top.getIi18NText('roleTip05') + '</h1>'
			}
	});
	
	//选择商品
	function openSelectGoodsWin(btn) {

    	var beforecloseFn = function(){
    		selectGoodsWin.hide(btn);
    		Ext.getCmp('goodSearchTextId').setValue("");
    		allGoodsStore.proxy.setExtraParam("n", "");
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

    	selectGoodsWin = Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseGoods')
				  ,plain: true
				  ,width: 550
				  ,height:485
				  ,minWidth: 200
				  ,minHeight: 230
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
							// 優惠券活动商品搜索
							xtype : 'panel',
							layout : {type:'hbox', align: 'center',pack:'left'},
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
					            ,id: 'goodSearchTextId'
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
				    		   ,handler: queryGoodsFn
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
		    				 width:'90%',
		    				 height:350,
		    				 items: [allGoodsGrid]
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
						handler:saveGoodsFn
					},{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin:'0 20 0 20',
						border : true,
						iconCls:'pback_reset_IconCls',
						handler: function(){
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
	 // 选择终端
	 function chooseTerminal(btn){
    	var beforecloseFn=function(){
    	
    	};
    	var showFn = function(){
    		terStore.loadPage(1);
    	};
		 if (chooseTerminalWin && chooseTerminalWin.isWindow) {
			chooseTerminalWin.clearListeners( );
			chooseTerminalWin.addListener("beforeclose", beforecloseFn);
			chooseTerminalWin.addListener("show", showFn);
			 chooseTerminalWin.show();
		 } else {
    	    chooseTerminalWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('chooseTerminal')
				  ,plain: true
				  ,width: 600
				  ,minWidth: 280
				  ,minHeight: 400
				  ,id:'chooseTerminal'
				  ,autoScroll:true
				  ,border: false
				  ,frame: false
				  ,resizable:false
				  ,modal: true
				  ,constrain: true
				  ,closeAction: 'hide'
                  ,layout: 'fit'
//                  ,bodyCls: 'x_panel_backDD'
                  ,items:[allTerminalPanel]
	              ,listeners:{
	           		beforeclose: beforecloseFn,
					show:showFn
	              }
	        }).show(btn);
	    };
	}
     
	// 選擇商品後點擊完成 響應的函數
	function saveGoodsFn(){
		var rs = chooseGoodsIds.getCount();
   	 	if(rs <= 0){
   	 		Ext.Msg.alert(getIi18NText('systemMessage'), window.top.getIi18NText('minGoodsTip'));
   	 		return;
   	 	}
   	 	gids = '';
   	 	chooseGoodsIds.each(function(item,index,length){
   	 		if (index == 0) {
   	 			gids += item.get('id');
   	 		} else {
   	 			gids +=","+item.get('id');
   	 		}
   	 	})
   	 	console.info('全部商品',gids);
   	 	Ext.getCmp('freeGoods').setValue(rs);
   	 	selectGoodsWin.close();
	}
	// 選擇終端後點擊完成 響應的函數
	function saveTerminal () {
		 var rs = chooseTerIds.getCount();
    	 if(rs == 0){
    		 Ext.Msg.alert(getIi18NText('systemMessage'), window.top.getIi18NText('ter_tip'));
    		 return;
    	 }
    	 tids = '';
    	 chooseTerIds.each(function(item,index,length){
    	 	if (index == 0) {
    	 		tids +=item.get('terId');
    	 	} else {
    	 		tids +=","+item.get('terId');
    	 	}
    	 })
//    	 console.info('全部终端',tids);
    	 Ext.getCmp('freeTerminal').setValue(rs);
    	 chooseTerminalWin.close();
	}
	
	function  timeRender(value,m,r){
		if (value == 1) {
    	   return  Ext.Date.format(new Date(r.get('stime')), dateFormat)+'<br/>'+getIi18NText("to")+'<br/>'+Ext.Date.format(new Date(r.get('etime')), dateFormat);
		} else {
		   return  getIi18NText('dayTips',r.get('day'));
		}
     }
	
	function  datefmtRender(value,m,r){
    	return  Ext.Date.format(new Date(value), dateFormat);
     }
     
	function  statusRenderFn(value){
		if (value == 0) {
			return getIi18NText("monitor_message_51");
		} else {
			return "<font color=red>" + getIi18NText("nullify") + "</font>";
		}
     }
     
	function  amountRenderFn(value,metaData,record,rowIndex,colIndex,store,view){
		var type = record.get("type");
		if (type == 4) {
			return "<font color=blue>" + getIi18NText("full") + record.get("price") +getIi18NText("less") +value+"</font>";
		} else if (type == 5) {///
			return "<font color=purple>" + getIi18NText("randomTips1") + record.get("minAmount") + "-" +record.get("maxAmount") +"<br/>"+ getIi18NText("randomTips2") +value+"</font>";
		} else {
			return value;
		}
     }
     
	function  typeRenderFn(value){
		if (value == 1) {
			return getIi18NText("coupon");
		} else if (value == 2) {
			return '<font color="green">'+getIi18NText("breakfastCoupon")+'</font>';
		} else if (value == 3) {
			return '<font color="orange">'+getIi18NText("lunchCoupon")+'</font>';
		} else if (value == 4) {
			return '<font color="blue">'+getIi18NText("fillCoupon")+'</font>';
		} else if (value == 5) {
			return '<font color="purple">'+getIi18NText("randomCoupon")+'</font>';
		} else if (value == 6) {
			return '<font color="red">'+getIi18NText("freeCoupon")+'</font>';
		} else if (value == 7) {
			return '<font color="red">'+getIi18NText("pushCoupon")+'</font>';
		}
     }
     
	function  useTypeRenderFn(value){
		if (value == 1) {
			return getIi18NText("allDay");
		} else if (value == 2) {
			return '<font color="green">'+getIi18NText("breakfast")+'</font>';
		} else if (value == 3) {
			return '<font color="orange">'+getIi18NText("lunch")+'</font>';
		} else if (value == 4) {
			return '<font color="#008B8B">'+getIi18NText("dinner")+'</font>';
		}
     }
     
	// 终端选择类型
	function  scopeRenderFn(value){
		if (value == 1) {
			return getIi18NText("allTer");
		} else if (value == 2) {
			return '<font color="green">'+getIi18NText("someTer")+'</font>';
		}
     }
     
	// 商品选择类型
	function  goodsScopeRenderFn(value){
		if (value == 1) {
			return getIi18NText("allGoods");
		} else if (value == 2) {
			return '<font color="blue">'+getIi18NText("someGoods")+'</font>';
		}
     }
	
	function  frequencyRenderFn(value){
		if (value == 1) {
			return getIi18NText("frequency1");
		} else if (value == 2) {
			return getIi18NText("frequency2");
		}
     }
});
