var program  ,programStore;
/** item manager */
var editOrderRowFn;
var parentTab ;
var c = 1;
Ext.onReady(function() {
	// 1.start
	Ext.QuickTips.init();
	
	parentTab = parent ;
	//variable
	var tabPanel,gridPanel,dateFormat='Y/m/d H:i:s',ctrlTrUl="ctrlTrUl_prefix_orders";
	var  AUTH = Ext.merge({"delete": false , "ordersRefund" : false , "ordersRefundQuery":false}, Ext.decode(decode(AUTH_TBAR)));
	
    var stateStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data : [
        {"name":getIi18NText("orders15"), "value":""},
        {"name":getIi18NText("orders16"), "value":"1"},
        {"name":getIi18NText("orders17"), "value":"2"},
        {"name":getIi18NText("orders18"), "value":"3"}
    ]
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
			this.loadData([{'sid':-1, 'storeName':''+getIi18NText('allstore')+''}],true); 
		}
	}
	});
	//2.create
    tabPanel = Ext.create('Ext.container.Viewport', {
		renderTo : document.body
		,shadow : false
		,autoScroll: false
		,minWidth: 800
		,minHeight: 350
		,border: false
		,layout: 'border'
        ,items:[{
        	    region: 'north'
        	   ,layout: 'absolute'
        	   ,bodyCls: 'x_panel_backDD'
        	   ,defaults: { 		y:0, labelWidth:60, width: 180,margin:'5 10 5 5'}
        	   ,border: false
        	   ,height:90
        	   ,items : [{
        	   							x:5,
        					        	xtype: 'image',
        					        	src: '',
        					        	hidden:true,
        					        	width: 40,
        					        	height: 24,
        					        	imgCls: 'searchIconCss'
        				          },{
        				          		  x:45,
 				    	            	  fieldLabel: getIi18NText('name')
 				    	            	  ,id: 'searchTextId'
			    	            		  ,xtype: 'textfield'
		    	            			  ,maxLength: 50
		    	            			  ,width: 250
		    	            			  ,labelWidth: 40
	    	            			      ,labelAlign: 'left'
		    	            			  ,emptyText: getIi18NText("orders19")
		    	            			  ,enforceMaxLength: true
		    	            			  ,listeners: {
//			    	            				  change: delaySearch
		    	            			  }
 				    	            },{
 				    	            	x:45,
 				    	            	y:60,
 				    	            	xtype: 'checkboxgroup',
								        fieldLabel: getIi18NText("status"),
								        id  : 'status',
								        labelWidth:40,
								        width: 900,
								        layout: 'hbox',
								        defaults:{
								        	width :getIi18NText("confirm")=="OK"?108:85
								        },
								        items: [
											{ boxLabel: getIi18NText('orders16'), name: 'status', inputValue: '1' , checked:true},
											{ boxLabel: getIi18NText('orders17'), name: 'status', inputValue: '2' ,checked :true},
											{ boxLabel: getIi18NText('orders18'), name: 'status', inputValue: '3' , checked : true },
											{ boxLabel: getIi18NText('orders23'), name: 'status', inputValue: '-3' , checked: true },
											{ boxLabel: getIi18NText('orders25'), name: 'status', inputValue: '-4' , checked:true},
											{ boxLabel: getIi18NText('orders26'), name: 'status', inputValue: '-5'  , checked : true},											
											{ boxLabel: getIi18NText('orders24'), name: 'status', inputValue: '-2'},
											{ boxLabel: getIi18NText('payFail'), name: 'status', inputValue: '-6'}
								        ]
 				    	            },{
 				    	            	x:315,
        					           	xtype : 'datefield',
        						        fieldLabel: getIi18NText("beCreatedTimne"),
        						        labelWidth: 80, 
        						        width:240,
										id : 'btime',
										name : 'btime',
										emptyText : window.top.getIi18NText('startTime'),
										format : dateFormat,
										extraH : 0,
										extraM : 0,
										extraS : 0,
										listeners : {
//											afterrender : defaultDatetime,
									        expand : function($this){
									        	  if( typeof($this.setTimeFn) != 'function') addTimeToDatePicker($this);
									        }
									        ,select: function( field, value, eOpts ){
											      if( typeof(field.setTimeFn) == 'function') field.setTimeFn(value);
											}
										}
        					     },{
        					     		x:560,
    							    	xtype : 'datefield',
										fieldLabel : "-",
										labelSeparator : "",
								   	    labelWidth: 10, 
								   	    width:180,
										name : 'etime',
										id : 'etime',
										emptyText : window.top.getIi18NText('endTime'),
										format : dateFormat,
										extraH : 23,
										extraM : 59,
										extraS : 59,
										listeners : {
								      	    afterrender: function($this){
						            	    	  defaultDatetime($this);
						            	    	  var da = this.getValue();
						            	    	  da.setMonth( da.getMonth());
						            	    	  this.setValue(da);
							            	    }
										        ,expand : function($this){
										        	  if( typeof($this.setTimeFn) != 'function') addTimeToDatePicker($this);
										        }
										        ,select: function( field, value, eOpts ){
												      if( typeof(field.setTimeFn) == 'function') field.setTimeFn(value);
												}
										}
        						 },{
        						 		x:777,
        						        xtype: 'button'
        						        ,id: 'queryBut'
        						        ,iconCls: 'queryIconCss'
        						        ,width: 70
        							    ,text:  getIi18NText("select")
        							    ,handler: searchFn
        					 },{
        					 		x:45,
        					 		y:30,
			    	                 xtype: 'combo'
			    	                ,fieldLabel: getIi18NText('storeName')
			    	                ,labelWidth: 80
			    	                ,labelAlign:'left'
			    	                ,id: 'allStore_combo'
			    	                ,width: 200
			    	                ,editable: false
			    	                ,store: stoStore
								    ,queryMode: 'local'
								    ,displayField: 'storeName'
								    ,valueField: 'sid'
								    ,value: -1
								    ,listeners:{
								    	change:searchFn
								    }
        					 }]
          },{
        	 region: 'center'
        	,layout: 'fit'
        	,autoScroll: false
            ,id: 'tabContent'
        }]
	});
	
	//3.event
	function defaultDatetime($this) {
		var date = new Date();
		date.setHours($this.extraH);
		date.setMinutes($this.extraM);
		date.setSeconds($this.extraS);
		$this.setValue(date);
	}
		/**
	 * 添加时间节点
	 */
	function addTimeToDatePicker(picker){
			//1.create
		    var footer = picker.getPicker().el.down('.x-datepicker-footer');
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
						 fieldLabel: getIi18NText("h")
						,id: picker.id+"_hours"
						,value: Ext.Number.from(picker.extraH, 0)
						,maxValue: 23
					    ,negativeText:getIi18NText('number_input_error01')
				   },{
				         fieldLabel: getIi18NText("m")
						,id: picker.id+"_minutes"
						,value: Ext.Number.from(picker.extraM, 0)
						,maxValue: 59
					    ,negativeText:getIi18NText('number_input_error01')
				   },{
				         fieldLabel: getIi18NText("s")
						,id: picker.id+"_seconds"
						,value: Ext.Number.from(picker.extraS, 0)
						,maxValue: 59
					    ,negativeText:getIi18NText('number_input_error01')
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
	 //4.grid
	   var  ajaxProxy = getAjaxProxy({url:'restaurant!getOrderList.action', extraParams: {n:'',b:null,e:null , state: '1,2,3,-3,-4,-5' }});
	   var tabStore = Ext.create('Ext.data.Store', {
				 fields: ['id', 'number', 'state', 'pricesum','totalPrice','discount', 'tradeNo', 'creator','createtime','lasttime','remark', 'type', 'ordersDetail','storeName']
				//,buffered: true
				,pageSize: 20
				//,leadingBufferZone: 50
				,proxy: ajaxProxy
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
	
	gridPanel = Ext.create('Ext.grid.Panel', {
	    title: getIi18NText("orders08"),
	    iconCls: 'tabIconCss',
	    shadow:false,
	    store: tabStore,
	    columns: {
	    	 items: [
	    	            { text: getIi18NText("No"), width: 60 , xtype: 'rownumberer', align: 'center'},
	    		        { text: getIi18NText('orders09'),  dataIndex: 'number' , width: getIi18NText("confirm") == "OK"?80:70},
	    		        { text: getIi18NText('storeName'),  dataIndex: 'storeName' , width: getIi18NText("confirm") == "OK"?100:90},
	    		        { text: getIi18NText('orders14'),  dataIndex: 'tradeNo' , width: getIi18NText("confirm") == "OK"?120:110},
	    		        { text: getIi18NText("orders11"), dataIndex: 'totalPrice', width: getIi18NText("confirm") == "OK"?80:70},
	    		        { text: getIi18NText('actualCharge'), dataIndex: 'pricesum', width: getIi18NText("confirm") == "OK"?100:60},
	    		        { text: getIi18NText('discount'), dataIndex: 'discount', width: getIi18NText("confirm") == "OK"?90:60},
	    		        { text: getIi18NText("orders10"), dataIndex: 'state', width: getIi18NText("confirm") == "OK"?95:80, renderer: statusRenderFn},
	    		        { text: getIi18NText("type"), dataIndex: 'type', width: getIi18NText("confirm") == "OK"?80:70 ,renderer: typeRenderFn},
	    		        { text: getIi18NText("creator"), dataIndex: 'creator', minWidth: 60},
	    		        { text: getIi18NText("create_time"), dataIndex: 'createtime',flex:1, minWidth: 135, renderer:timeRenderFn},
//	    		        { text: getIi18NText("remark"), dataIndex: 'remark', minWidth: 140 },
	    		        { text: getIi18NText("monitor_message_10"), dataIndex: 'id',  width: getIi18NText("confirm") == "OK"?120:120, menuText: getIi18NText("monitor_message_10"), menuDisabled: true, sortable: false,draggable: false, resizable: false, renderer: ctrlRenderFn}
	    		    ]
	        ,defaults: {
	 	 	  menuDisabled: true, sortable: true
	 	    }
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
	   ,tools:[
//		         xtype: 'displayfield'
//			    ,id: 'totalTabRows'
//		        ,fieldLabel: getIi18NText("totalCount")
//		        ,labelWidth: 70
//		        ,width: 130
//		        ,value: '-'
	   {

		    xtype:'button',
		    tooltip: getIi18NText("item_refresh_schedule") ,
            text: getIi18NText("refresh"),
            border: false,
            iconCls: 'refreshIconCss',
		    handler: searchFn
		}]
	    ,listeners: {
	    	resize: resizeChildContent
	    }
	    ,viewConfig: {
            trackOver: true
           ,disableSelection: true
           ,emptyText: '<h1 style="margin:10px; font-size: 18px;">'+getIi18NText("item_noresult")+'</h1>'
        }
	   
	});
	Ext.getCmp('tabContent').add(gridPanel);
	
	
	function typeRenderFn(value,metaData,record,rIndex,cIndex){
		switch(value){
		case 1:
			return getIi18NText('pay_lading');
		case 2:
			return getIi18NText('pay_wechat');
		case 3:
			return getIi18NText('pay_alipay');
		case 4:
			return getIi18NText('pay_weichat_scan');
		case 5:
			return getIi18NText('pay_alipay_scan');
		case 6:
			return getIi18NText('posPay');
		default:
			return '--';
			break;
		}
	}
	
	function timeRenderFn(value , metaData , record , rIndex , cIndex){
//		zxLog("record",record);
//		zxLog(" record.data.lasttime;" , record.data.lasttime);
//		return value+"<br/>最后修改的时间为:<br/>"+record.data.lasttime;
		return value;
	}
	//状态渲染 
	function statusRenderFn(value,metaData,record,rIndex,cIndex){
		switch(value){
		case 1:
			return '<font color="green">' + getIi18NText("orders20") + '</font>';
		case 2:
			return '<font color="green">' +getIi18NText("orders21")+ '</font>';
		case 3:
			return '<font color="red">' + getIi18NText("orders18") + '</font>'; 
		case -2:
			return '<font color="gray">' + getIi18NText("orders24")+ '</font>';
		case -3:
			return '<font color="gray">' + getIi18NText("orders23")+ '</font>';
		case -4 :
			return '<font color="gray">' + getIi18NText("orders25") + '</font>';
		case -5:
			return  '<font color="gray">' + getIi18NText("orders26")+ '</font>';
		case -6:
			return  '<font color="orange">' + getIi18NText("payFail")+ '</font>';

		default:
			return '--';
			break;
		}
	}
	
	
	//删除交易记录
	function executeDel(ids,terId,btn){
		   if(Ext.isEmpty(ids)) return;
		   ids =  ids instanceof Array ? ids.join(','):ids;
		   Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: getIi18NText("upload_tip_systip"), cls:'msgCls', msg:getIi18NText("jsp_confirmDelete"), plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText("confirm"), cancel: getIi18NText("cancel")}, fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   gridPanel.getEl().mask(getIi18NText("item_deleting"));
				   Ext.Ajax.request({
					     url: 'restaurant!deleteOrders.action'
					    ,params: {oids: ids}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  if(btn != null && btn.isComponent){
						    	  btn.enable();
						      }
				        	  gridPanel.getEl().unmask();
				        	  var result = showResult(success,response);
				        	  if(result == false) return;
				        	  Ext.example.msg(getIi18NText("item_result"), getIi18NText("monitor_message_35"));
				        	  searchFn();
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
				searchFn();
			}
		});
	}
	
	editOrderRowFn = function(r,t){
		var model = gridPanel.getStore().getAt(r);
		console.log("model",model);
		if(model){
			//1. delet
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
				gridPanel.doLayout();
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
	        				  gridPanel.doLayout();
				    	 }
				     }
			});
		
		}
	};
	
	function ctrlRenderFn(value,metaData,record,rIndex,cIndex){
		 var ctrlHtml = ['<ul class="ctrlULCls" id="'+ctrlTrUl+rIndex+'">'];
		 ctrlHtml.push('<li><span class="viewIconCss">&nbsp;</span><a  href="javascript: editOrderRowFn('+rIndex+',\'V\');" title='+getIi18NText("item_detail_info")+' class="viewIconACss">'+getIi18NText("item_detail")+'</a></li>');
		 if(AUTH['delete']){
			 ctrlHtml.push('<li><span class="removeIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'D\');" title='+getIi18NText("item_delete")+'>'+getIi18NText("delete")+'</a></li>');
		 }
		if(AUTH['ordersRefundQuery']){
		 	ctrlHtml.push('<li><span class="auditIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'Q\');" title='+getIi18NText("orders35")+'>'+getIi18NText("orders36")+'</a></li>');
		 }
		if(AUTH['ordersRefund']){
		 	ctrlHtml.push('<li><span class="editIconCss">&nbsp;</span><a href="javascript: editOrderRowFn('+rIndex+',\'T\');" title='+getIi18NText("orders37")+'>'+getIi18NText("orders38")+'</a></li>');
		 }
		 ctrlHtml.push('</ul>');
		 return ctrlHtml.join('');
	}
	
	function getQueryParams(){
		var params = {};
	     var btime = Ext.getCmp("btime");
	     var etime = Ext.getCmp("etime");
	     if(!btime.isValid()){
	    	 Ext.example.msg(getIi18NText("operationTips"), '<font color="red">'+getIi18NText("item_set_starttime")+'</font>'); 
	    	 return;
	     }
	     if(!etime.isValid()){
	    	 Ext.example.msg(getIi18NText("operationTips"), '<font color="red">'+getIi18NText("item_set_endtime")+'</font>'); 
	    	 return;
	     }
	     if(btime.getValue() > etime.getValue()){
	    	 Ext.example.msg(getIi18NText("operationTips"), '<font color="red">'+getIi18NText("item_timeerror")+'</font>'); 
	    	 return;
	     }
	     
	     var name = Ext.getCmp("searchTextId").getValue();
	     var statusArr = [];
     	var checkboxgroup = Ext.getCmp('status').items;
		checkboxgroup.each(function(k, v, l){
		 	if(k.getValue()==true){
		 		statusArr.push(k.inputValue);
		 	}
	  	}); 
	     params.n = encode(name);
	     params.state = statusArr.join(",");
	     params.b = Ext.Date.format(btime.getValue(),dateFormat);
	     params.e = Ext.Date.format(etime.getValue(),dateFormat);
	     params.sid = Ext.getCmp("allStore_combo").getValue();
	     
         ajaxProxy.setExtraParam("number",params.n);
	     ajaxProxy.setExtraParam("btime",params.b);
	     ajaxProxy.setExtraParam("etime",params.e);
	     ajaxProxy.setExtraParam("state",params.state);
	     ajaxProxy.setExtraParam("storeId",params.sid);
	     gridPanel.getSelectionModel().deselectAll();//此操作相当重要
	     tabStore.loadPage(1);
	}
	
	function searchFn(btn){
		getQueryParams();
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
		              ,{text: getIi18NText("count"), dataIndex: 'count',width: 100,align: 'center'}
		              ,{text: getIi18NText("minTotal"), dataIndex: 'count',width: 100,align: 'center' , renderer:subtotal } 
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
	    	 return (parseFloat(value) * parseFloat(record.raw["price"])).toFixed(2);
	     }catch(e){
	    	 return "--";
	     }
	}
	function shouldRefund(value,metadata,record,rowIndex){
	     try{
	    	 return value ;
	     }catch(e){
	    	 return "--";
	     }
	}
	function trueRefund(value,metadata,record,rowIndex){
	     try{
	    	 return value;
	     }catch(e){
	    	 return "--";
	     }
	}
	
	
	// *.final
	// Ext.getBody().unmask();
});
