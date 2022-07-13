Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var viewport,gridPanel,dataStore,ctrColumn,ajaxProxy,addInfoWin,id,startType;
	var  AUTH = Ext.merge({"delete": false , add : false , update : false ,"export":false}, Ext.decode(decode(AUTH_TBAR)));
	
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	var nowDate = new Date();
	 //创建对象
 	 Ext.define('record', {
	     extend: 'Ext.data.Model',
	     fields: [
	         {name: 'uid', type: 'int'},
	         {name: 'uname',  type: 'String'}
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
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('coupon')],[2,getIi18NText('breakfastCoupon')],[3,getIi18NText('lunchCoupon')],[4,getIi18NText('fillCoupon')],[5,getIi18NText('randomCoupon')],[7,getIi18NText('pushCoupon')]]
		                ,value: -1
		                ,labelWidth: 40
		                ,width: 190
		                ,editable: false
					    ,queryMode: 'local'
					    ,maxLength: 50
					    ,id: 'searchType'
	            	},{
    	            	 fieldLabel: window.top.getIi18NText('frequency')
					    ,labelAlign: 'right'
					    ,xtype: 'combobox'
					    ,store: [[-1,window.top.getIi18NText('allType')],[1,getIi18NText('frequency1')],[2,getIi18NText('frequency2')]]
		                ,value: -1
		                ,labelWidth: window.top.langtype=="CN"?40:60
		                ,width: 170
		                ,editable: false
					    ,queryMode: 'local'
					    ,maxLength: 50
					    ,id: 'searchFrequency'
	            	},{
			            fieldLabel: window.top.getIi18NText('name')
			            ,id: 'searchTextId'
					    ,xtype: 'textfield'
					    ,maxLength: 50
					    ,width: 250
					    ,labelWidth: 40
					    ,emptyText: getIi18NText('searchByNameCode')
					    ,enforceMaxLength: true
		    	      },{
				        xtype: 'datefield',
				        fieldLabel: window.top.getIi18NText('beCreatedTimne')
				        ,labelWidth: 80
				        ,width: 260
				       ,id: 'btime'
				       ,name: 'btime'
				       ,hidden:true
				       ,emptyText: window.top.getIi18NText('startTime')
				       ,format: dateFormat
					    	   
				      },{
					     xtype: 'datefield'
					    ,name: 'etime'
					    ,id: 'etime'
					    ,width: 180
				       ,hidden:true
					    ,emptyText: window.top.getIi18NText('endTime')
					    ,format: dateFormat
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
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","cname","code","frequency","minAmount","maxAmount","price","type","way","total","count","get","used","status","amount","stime","etime","latest","userName"],
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
						,minWidth:130
						,renderer:typeRenderFn
					}, {
						text :window.top.getIi18NText('frequency'),
						dataIndex : 'frequency'
						,minWidth:110
						,renderer:frequencyRenderFn
					}, {
						text :window.top.getIi18NText('startTime'),
						dataIndex : 'stime',
						minWidth:140,
						renderer:datefmtRender
					}
					, {
						text :window.top.getIi18NText('endTime'),
						dataIndex : 'etime',
						minWidth:140,
						renderer:datefmtRender
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
    	   dataStore.getProxy().setExtraParam("frequency", Ext.getCmp('searchFrequency').getValue());
	       dataStore.getProxy().setExtraParam("n", encode(Ext.getCmp('searchTextId').getValue()));
		   dataStore.getProxy().setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   dataStore.getProxy().setExtraParam("e", Ext.Date.format(etime.getValue(),dateFormat));
		   dataStore.loadPage(1);   	   
     } 
	
     //修改信息 
    function editInfoFu(v,r,c,i,e,record,row){
    	 openInfoWin(row,record.get("id"),record);
    }
     //添加窗口
    function openInfoWin(btn,tid,record){
    	id=tid;
    	var beforecloseFn=function(){
	    	
	    	Ext.getCmp('couponMoney').setDisabled(false);
			Ext.getCmp('couponBtime').setDisabled(false);
	    	Ext.getCmp('couponEtime').setDisabled(false);
	    	Ext.getCmp('couponType').setDisabled(false);
    		Ext.getCmp('couponFrequency').setDisabled(false);
			Ext.getCmp('limitAmount').setDisabled(false);
	    	Ext.getCmp('otherAmount').setDisabled(false);
			Ext.getCmp('minAmount').setDisabled(false);
			Ext.getCmp('maxAmount').setDisabled(false);
	    	Ext.getCmp('totalAmount').setDisabled(false);
	    	Ext.getCmp('couponName').setValue(null);
	    	Ext.getCmp('couponStock').setMinValue(1);
	    	Ext.getCmp('couponStock').setValue(null);
	    	Ext.getCmp('randomStock').setMinValue(1);
	    	Ext.getCmp('randomStock').setValue(null);
	    	Ext.getCmp('couponMoney').setValue(null);
			Ext.getCmp('couponBtime').setValue(null);
	    	Ext.getCmp('couponEtime').setValue(null);
	    	Ext.getCmp('couponStatus').setValue(0);
	    	Ext.getCmp('couponType').setValue(1);
	    	Ext.getCmp('couponFrequency').setValue(1);
	    	
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
				   	,items:[{                 	
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
		    	            	 fieldLabel: window.top.getIi18NText('type')
							    ,labelAlign: 'right'
							    ,xtype: 'combobox'
							    ,store: [[1,getIi18NText('coupon')],[2,getIi18NText('breakfastCoupon')],[3,getIi18NText('lunchCoupon')],[4,getIi18NText('fillCoupon')],[5,getIi18NText('randomCoupon')],[7,getIi18NText('pushCoupon')]]
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
							    		if (newValue == 7) {
							    			Ext.getCmp('couponTime').hide();
											Ext.getCmp('couponStock').hide();
    										Ext.getCmp('couponFrequency').setDisabled(true);
							    		} else {
							    			Ext.getCmp('couponTime').show();
											Ext.getCmp('couponStock').show();
    										Ext.getCmp('couponFrequency').setDisabled(false);
							    		}
							    		if (newValue == 5) {
							    			Ext.getCmp('generalPanel').hide();
							    			Ext.getCmp('randomPanel').show();
											Ext.getCmp('randomStock').setValue(null);
									    	Ext.getCmp('totalAmount').setValue(null);
									    	Ext.getCmp('minAmount').setValue(null);
									    	Ext.getCmp('maxAmount').setValue(null);
							    		} else {
								    			Ext.getCmp('randomPanel').hide();
								    			Ext.getCmp('generalPanel').show();
								    		if (newValue == 4) {
								    			Ext.getCmp('couponMoney').hide();
								    			Ext.getCmp('limitPanel').show();
												Ext.getCmp('limitAmount').setValue('');
										    	Ext.getCmp('otherAmount').setValue('');
								    		} else {
								    			Ext.getCmp('couponMoney').show();
												Ext.getCmp('limitAmount').setValue('');
										    	Ext.getCmp('otherAmount').setValue('');
								    			Ext.getCmp('limitPanel').hide();
								    		}
							    		}
							    	}
					            }
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
							id:'generalPanel',
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
								emptyText:window.top.getIi18NText('maxStock')
							}]
	                  }, {
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
							},{
								xtype:'numberfield',
								id:'totalAmount',
								fieldLabel:'<font color="red">*</font>'+getIi18NText('gd_sum'),
								width:220,
								labelWidth:60,
								labelAlign: 'right',
								maxValue:1000,
								minValue:0.1,
								allowDecimals: true,
							    margin:'20 0 0 0',
						        decimalPrecision: 1,
								value:'',
								negativeText:window.top.getIi18NText('negativeTips'),
								emptyText:getIi18NText('gd_sum')
							},{
								xtype:'numberfield',
								id:'randomStock',
								fieldLabel:getIi18NText('maxStock'),
								width:220,
								labelWidth:60,
							    margin:'20 0 0 40',
								minValue:1,
								labelAlign:'right',
								allowBlank:true,
								allowDecimals: false,
								negativeText:window.top.getIi18NText('negativeTips'),
								value:'',
								emptyText:window.top.getIi18NText('maxStock')
							}]
	                  }, {      	
							xtype : 'panel',
							border : false,
							id:'couponTime',
							layout:'column',
							items:[{
						        xtype: 'datefield',
						        fieldLabel:'<font color="red">*</font>'+window.top.getIi18NText('startTime')
						       ,labelWidth: 60
						       ,width: 220
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
    	Ext.getCmp('couponName').setValue(r.get("cname"));
    	Ext.getCmp('couponStatus').setValue(r.get("status"));
    	Ext.getCmp('couponType').setValue(type);
    	Ext.getCmp('couponFrequency').setValue(r.get("frequency"));
    	
		if (type == 5) {
	    	Ext.getCmp('randomStock').setValue(total);
	    	Ext.getCmp('randomStock').setMinValue(minVa);
	    	
    		Ext.getCmp('minAmount').setValue(r.get("minAmount"));
			Ext.getCmp('maxAmount').setValue(r.get("maxAmount"));
	    	Ext.getCmp('totalAmount').setValue(amount);
	    	
		} else if (type == 4) {
			
	    	Ext.getCmp('couponStock').setValue(total);
	    	Ext.getCmp('couponStock').setMinValue(minVa);
			
    		Ext.getCmp('couponMoney').setValue('');
			Ext.getCmp('limitAmount').setValue(r.get("price"));
	    	Ext.getCmp('otherAmount').setValue(amount);
		} else {
			
	    	Ext.getCmp('couponStock').setValue(total);
	    	Ext.getCmp('couponStock').setMinValue(minVa);
    		Ext.getCmp('couponMoney').setValue(amount);
		}
    	
		Ext.getCmp('couponBtime').setValue(new Date(r.get("stime")));
    	Ext.getCmp('couponEtime').setValue(new Date(r.get("etime")));
    	Ext.getCmp('couponMoney').setDisabled(true);
    	Ext.getCmp('couponType').setDisabled(true);
		Ext.getCmp('couponBtime').setDisabled(true);
    	Ext.getCmp('couponEtime').setDisabled(true);
		Ext.getCmp('limitAmount').setDisabled(true);
    	Ext.getCmp('otherAmount').setDisabled(true);
    	Ext.getCmp('couponFrequency').setDisabled(true);
		Ext.getCmp('minAmount').setDisabled(true);
		Ext.getCmp('maxAmount').setDisabled(true);
    	Ext.getCmp('totalAmount').setDisabled(true);
    }
    
    //保存数据
    function saveInfo(v,r,c,i,e,record,row){
    	var type = Ext.getCmp("couponType").getValue();
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
    	var startTime,endTime;
	    if (type != 7) {
	        startTime = bt.getTime();
    		endTime = et.getTime();
	    }
    	var name = Ext.getCmp("couponName").getValue();
    	var status = Ext.getCmp("couponStatus").getValue();
    	var frequency = Ext.getCmp("couponFrequency").getValue();
    	var total,amount;
    	var price;
    	var minAmount,maxAmount;
    	if (type == 4) {//满减券
    		price = Ext.getCmp("limitAmount").getValue();
    		amount = Ext.getCmp("otherAmount").getValue();
    		total = Ext.getCmp("couponStock").getValue();
    		if (price == null) {
    			showTip(Ext.getCmp("limitAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (amount ==  null) {
    			showTip(Ext.getCmp("otherAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (amount > price) {
    			showTip(Ext.getCmp("otherAmount"),window.top.getIi18NText('amountNotMax'));
    			return;
    		}
    	} else if (type == 5) {//随机券
    		total = Ext.getCmp("randomStock").getValue();
    		minAmount = Ext.getCmp("minAmount").getValue();
    		maxAmount = Ext.getCmp("maxAmount").getValue();
    		amount = Ext.getCmp("totalAmount").getValue();
    		console.info('随机券',total,minAmount,maxAmount,amount);
    		if (minAmount == null) {
    			showTip(Ext.getCmp("minAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (maxAmount ==  null) {
    			showTip(Ext.getCmp("maxAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (minAmount > maxAmount) {
    			showTip(Ext.getCmp("maxAmount"),window.top.getIi18NText('amountNotMax1'));
    			return;
    		}
    		if (amount ==  null) {
    			showTip(Ext.getCmp("totalAmount"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    		if (maxAmount > amount) {
    			showTip(Ext.getCmp("totalAmount"),window.top.getIi18NText('amountNotMax2'));
    			return;
    		}
    		if (total ==  null) {
    			showTip(Ext.getCmp("randomStock"),window.top.getIi18NText('stockNotNull'));
    			return;
    		}
    		var maxNum = Math.ceil(amount/minAmount);
    		var minNum = Math.floor(amount/maxAmount);
    		if (total > maxNum) {
    			showTip(Ext.getCmp("randomStock"),window.top.getIi18NText('maxStockTips')+":"+maxNum);
    			return;
    		}
    	} else {
    		amount = Ext.getCmp("couponMoney").getValue();
    		total = Ext.getCmp("couponStock").getValue();
    		if (amount == null) {
    			showTip(Ext.getCmp("couponMoney"),window.top.getIi18NText('amountNotNull'));
    			return;
    		}
    	}
    	if (!/^\d+$/.test(id) && ((type != 5 && amount >= 50) || (type == 5 && minAmount >= 50))) {
	    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
				           msg:window.top.getIi18NText('amountTips', "<font color=red>" + amount + "</font>")
				 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('save'), cancel: getIi18NText('cancel')},
				 fn:function(bid, text, opt){
				   if(bid == 'ok'){
				    	gridPanel.getEl().mask(window.top.getIi18NText('saving'));
					    Ext.Ajax.request({
						     url: 'shared!saveCoupon.action'
						    ,params: {id:id,name:name,minAmount:minAmount,maxAmount:maxAmount,type:type,price:price,total:total,amount:amount,startTime:startTime,endTime:endTime,status:status,frequency:frequency}
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
			    ,params: {id:id,name:name,minAmount:minAmount,maxAmount:maxAmount,type:type,price:price,total:total,amount:amount,startTime:startTime,endTime:endTime,status:status,frequency:frequency}
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
    
	function  datefmtRender(value,m,r){
		if (r.get("type") != 7) {
    	   return  Ext.Date.format(new Date(value), dateFormat);
		}
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
     
	function  frequencyRenderFn(value){
		if (value == 1) {
			return getIi18NText("frequency1");
		} else if (value == 2) {
			return getIi18NText("frequency2");
		}
     }
});
