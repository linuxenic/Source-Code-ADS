/** item manager */
var defaultSelect;
Ext.onReady(function() {	
	
    var d=new Date(); 
//    console.log("当前日期 ： ",d.getDate());
    d.setDate(d.getDate()+1);
//    console.log("设置后的日期 ： ",d.getDate());
    
	 // 1.start
	 //Ext.getBody().mask('加载数据中...');
	
	//variable
	var viewport,gridPanel,datastore,gridRowFix="grid_row_",customerInfo={},childItems = [],roomWin;
	
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	Ext.QuickTips.init();
	
	
	//2.create
	var ctrColumn =  { text: window.top.getIi18NText('operation'),  minWidth: 100, maxWidth: 60, menuText: window.top.getIi18NText('operation'), menuDisabled: true, hidden: true,  sortable: false,draggable: false, resizable: false,xtype: 'actioncolumn', items:[]};
//	if(AUTH.update){
		 ctrColumn.items.push({
		 	        iconCls: 'editIconCss'
		    	   ,tooltip : window.top.getIi18NText('modify')
		    	   ,handler:  editRoom
		 });
//		 ctrColumn.hidden = false;
//	}
//	if(AUTH["delete"]){
		ctrColumn.items.push({
	    	       iconCls: 'removeIconCss'
	        	   ,tooltip: window.top.getIi18NText('delete')
	        	   ,handler:  delRoom
	    });
//		ctrColumn.hidden = false;
//	}
	ctrColumn.items.push({
		iconCls: 'detailIconCss'
		,tooltip: window.top.getIi18NText('item_detail')
		,handler:  viewDetail
	});
	ctrColumn.hidden = false;
//	if(!AUTH["self"]){
//		// 2.create
//		viewport = Ext.create("Ext.container.Viewport", {
//			layout : {
//				type : 'fit'
//			},
//			renderTo : document.body,
//			defaults : {},
//			border : false,
//			style : 'background: white',
//			height : '100%',
//			width : '100%',
//			items : [{
//				html:"<div style='width: 100%;height: 100%;display:table;text-align:center !important'><span style='height: 100%;display:table-cell;vertical-align:middle;'>"
//					+"<img style='vertical-align: middle;' src='"+BASEPATH+"images/"+getIi18NText('noauth')+"'></span></div>"
//			}]
//		});
//	}else{
		viewport = Ext.create("Ext.container.Viewport",{
					layout: {
				        type: 'border'
				    },
				    renderTo: document.body,
				    defaults:{},
				    border: false,
				    style: 'background: white',
				    items: [{ 
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
				    	              },
				    	              {
		            		            fieldLabel: window.top.getIi18NText('name')
		            		            ,id: 'searchTextId'
									    ,xtype: 'textfield'
									    ,maxLength: 50
									    ,width: 180
									    ,labelWidth: 30
									    ,emptyText: window.top.getIi18NText('searchByRoomName')
				            	      },{
									        xtype: 'datefield',
									        fieldLabel: window.top.getIi18NText('beCreatedTimne'),
									        name: 'btime'
									        ,labelWidth: 80
									        ,width: 260
									       ,id: 'btime'
									       ,name: 'btime'
									       ,emptyText: window.top.getIi18NText('startTime')
									       ,value : new Date()
									       ,format: dateFormat
									    	   
								      },{
										     xtype: 'datefield',
										     name: 'etime'
										    ,id: 'etime'
										    ,width: 180
										    ,emptyText: window.top.getIi18NText('endTime')
										    ,value : d
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
//	}
	//4.create tools
	/**fun methods*/
	function renderTable($this, eopt){
			ajaxProxy =  getAjaxProxy({url: 'livetoy!getRoomList.action'});
		    tabStore = Ext.create('Ext.data.Store', {
				        fields: ['id','serial','roomName', 'roomType', 'startTime','endTime'],
		                buffered: false,
		                pageSize: 20
		     	       ,proxy: ajaxProxy
		     	       ,listeners: {
		     	    	    load:function($this){
		     	    	    	 Ext.getBody().unmask();
		     	    	    }
		     	       } 
	        });
		    
//		    tabStore.loadPage(1);
//		    console.log("进来了");
		    queryFun();
			gridPanel = Ext.create('Ext.grid.Panel', {
			    title: window.top.getIi18NText('roomList'),
			    iconCls: 'tabIconCss',
			    frame: false,
			    store: tabStore,// Ext.data.StoreManager.lookup('simpsonsStore'),
			    columns: [
			        { text: window.top.getIi18NText('No'), width: 80 , xtype: 'rownumberer', align: 'center'},
			        { text: window.top.getIi18NText('roomNo'), dataIndex: 'serial', minWidth: 100},
			        { text: window.top.getIi18NText('roomName'), dataIndex: 'roomName', minWidth: 150,flex: 1},
				    { text: window.top.getIi18NText('roomType'), dataIndex: 'roomType', minWidth: 100,renderer: roomTypeRender},
				    { text: window.top.getIi18NText('startTime'), dataIndex: 'startTime', minWidth: 150},
				    { text: window.top.getIi18NText('endTime'), dataIndex: 'endTime', width: 150},
				    ctrColumn
			    ],
	            bbar: [{
	            	id:'padingBar',
	                xtype: 'pagingtoolbar',
	                store: tabStore,
	                border:false,
	                displayInfo: true                 
	            }],
			    margin: 1
			   ,tools:[{
					    xtype:'button',
					    tooltip: window.top.getIi18NText('add'),
					    tooltipType: 'title',
			            text: window.top.getIi18NText('add'),
			            border: false,
			            iconCls: 'addIconCss',
			            margin: '0 5 0 0',
//			            hidden: !AUTH.add,
			            hidden : false,
					    handler: openRoomWin
			       },{
					    xtype:'button',
					    tooltipType: 'title',
			            text: window.top.getIi18NText('syncData'),
			            border: false,
			            iconCls: 'refreshIconCss',
					    handler: queryFunByType
				    }
			   ]
			   ,viewConfig: { //GZE 2016/8/12  添加没有查询到信息时的提示消息
				   trackOver: false
				   ,disableSelection: false
				   ,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
			   }
			});
			$this.add(gridPanel);
	}
	
	//房间类型值渲染
    function roomTypeRender(value,metaData,record,rowIndex){
//    	 console.log("roomTypeRender : "+value);
    	 if(value == 0){
    		 return window.top.getIi18NText('oneOne');
    	 }else if(value == 3){
    		 return window.top.getIi18NText('oneMany');
    	 }else{
    		 return window.top.getIi18NText('not_name');
    	 }    	 
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
	       if((!Ext.isEmpty(btime.getValue()) &&　Ext.isEmpty(etime.getValue()))
		    	   || Ext.isEmpty(btime.getValue()) &&　!Ext.isEmpty(etime.getValue())){
		    	   
		    	   showTip(but, window.top.getIi18NText('secondtimeNotNull'));		    	  
		    	   return;
		   }
	       
	       ajaxProxy.setExtraParam("roomName", encode(Ext.getCmp('searchTextId').getValue().trim()));
		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("type", 0);
		   tabStore.loadPage(1);
    	   
     } 
     
     /**
      * 立即同步，远程获取数据
      */
     function queryFunByType(){
    	 var type = 1;
    	 ajaxProxy.setExtraParam("type",type);
    	 tabStore.loadPage(1);
     }
     
     /////////////edit page  start \\\\\\\\\\\\
     function openRoomWin(btn,gid, opt){
    	 if(opt == 3){
    		 //readonly
    	 }
		 var beforecloseFn = function(){
			 roomWin.hide(btn);
			 //reset form
			 var form = roomWin.down('form');
			 form.down('field[name="roomName"]').setReadOnly(false);
			 form.down('field[name="startTime"]').setReadOnly(false);
			 form.down('field[name="endTime"]').setReadOnly(false);

    		 Ext.getCmp('saveRoomBtn').setVisible(true);
    		 Ext.getCmp('cancelRoomBtn').setVisible(true);
    		 
			 form.getForm().reset();
			 form.getForm().clearInvalid();
//			 queryFun();
	     };
	     
	     var showFn = function(){
	    	 roomWin.setTitle(window.top.getIi18NText('add'));
    		 
	    	 var form = roomWin.down('form');
	    	 if(opt != 3){

	    	 }else{
	    		 form.down('field[name="roomName"]').setReadOnly(true);
	    		 form.down('field[name="startTime"]').setReadOnly(true);
	    		 form.down('field[name="endTime"]').setReadOnly(true);

	    		 Ext.getCmp('saveRoomBtn').setVisible(false);
	    		 Ext.getCmp('cancelRoomBtn').setVisible(false);
	    	 }
	    	 if(/^\d+$/.test(gid)){
	    		 roomWin.setTitle(window.top.getIi18NText('modify'));
	    		 var idx = tabStore.find("id", gid);
	    		 var rcd = tabStore.getAt(idx);
	    		 setEditData(rcd);
	    	 }
	     };
		 if(roomWin && roomWin.isWindow){
			  roomWin.clearListeners( );
			  roomWin.addListener("beforeclose", beforecloseFn);
			  roomWin.addListener("show", showFn);
			  roomWin.show(btn);
			  return;
		 }
		 
	     roomWin=Ext.create('Ext.window.Window',{
					  title: window.top.getIi18NText('add')
					  ,plain: true
					  ,width: 340
					  ,height: 300
					  ,minWidth: 200
					  ,minHeight: 200
					  ,border: false
					  ,frame: false
					  ,modal: true
					  ,constrain: true
					  ,closeAction: 'hide'
					  ,listeners: {
						   beforeclose: beforecloseFn
						  ,show: showFn
					  }
	                  ,layout: 'fit'
	                  ,bodyCls: 'x_panel_backDD'
	                  ,items:[{
	                	      xtype: 'form'
	                	     ,layout: {type:'hbox', align: 'middle',pack:'center'}
	                         ,width: '100%'
	                         ,height: '100%'
	                         ,border: false
	                         ,autoScroll: true
	                         ,items: [{
	                        	   xtype: 'panel'
	                        	   ,flex: 1
	                        	   ,border: false
	                        	   ,height: '100%'
	                        	   ,width: '100%'
	                        	   ,layout: {type: 'vbox', align: 'center'}
	                               ,defaults: {labelAlign: 'right',width: 260,margin:'0 0 20 0',labelWidth: 60,xtype: 'textfield', labelCls: 'labelCls',fieldBodyCls: 'fieldBodyCls',baseCls: 'baseBodyCls',enforceMaxLength: true,allowBlank: false,validateOnChange:false}
	                        	   ,items: [	                        	            
									{
									    id:'roomId'
									    ,name: 'roomId'
									    ,allowBlank: true
									    ,inputType: 'hidden'
									}
	                        	   ,{
	 	                        		fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('roomName')
	                        		    ,xtype: 'textfield'
	                        		    ,name: 'roomName'
	                        		    ,margin:'30 0 20 0'
	                        		    ,allowBlank:false
	                        		    ,maxLength:150
	                        	   }
	                        	   ,{
	                        		     fieldLabel:'<font color="red"> * </font>'+ window.top.getIi18NText('startTime')
	                        		     ,xtype: 'datefield'
	                        		     ,id: 'startTime'
	                        		     ,name: 'startTime'
	                        		     ,allowBlank:false	                        		     
									     ,emptyText: window.top.getIi18NText('startTime')
									     ,format: dateFormat
	                        	   },{
	                        		     fieldLabel:'<font color="red"> * </font>'+ window.top.getIi18NText('endTime')
	                        		     ,xtype: 'datefield'
	                        		     ,id: 'endTime'
		                        		 ,name: 'endTime'		                        		 
		                        		 ,allowBlank:false
										 ,emptyText: window.top.getIi18NText('startTime')
										 ,format: dateFormat
	                        	   },{
	                        		   xtype:'panel',
	                        		   width:'100%',
	                        		   height:40,
	                        		   margin:'40 0 0 180',
	                        		   items:[{
	         	                	        xtype: 'button', 
	         	                	        text: window.top.getIi18NText('save'), 
	         	                	        width: 80, 
	         	                	        id:'saveRoomBtn', 
	         	                	        iconCls: 'pback_finish_IconCls',
	         	                	        formBind:true, 
	         	                	        handler: function(btn){addRoomHandler(btn,gid);}
          	                     		},{
	          	                     		xtype: 'button', 
	          	                     		text: window.top.getIi18NText('cancel'), 
	          	                     		width: 80, 
	          	                     		id:'cancelRoomBtn',
	          	                     		iconCls: 'pback_reset_IconCls',
	          	                     		handler: cancelWinFn,
	          	                     		margin: '0 2 0 5'
          	                     		}]
	                        	   }]
	                         }]	
	                         
	                  }]
        }).show(btn);
	}
    //点击编辑，设置到窗口的值 
    function setEditData(rcd){
		 var form = roomWin.down('form');
		 form.down('field[name="roomId"]').setValue(rcd.get("id"));	
		 form.down('field[name="roomName"]').setValue(rcd.get("roomName"));		 
		 form.down('field[name="startTime"]').setValue(rcd.get("startTime"));
		 form.down('field[name="endTime"]').setValue(rcd.get("endTime"));
		 
		 form.getForm().checkValidity();
    }
     
    //新增房间
    function addRoomHandler(btn,gid){
    	 //1. form
    	 var form = btn.up('form');
    	 if(!form || !form.isValid()) return;
    	 
    	 console.log(form.getForm().getValues());
    	 
    	 form.getEl().mask(window.top.getIi18NText('sendingData'));
    	 btn.disable();
    	 //3. sumbit
    	 form.submit({
	    	    url: 'livetoy!saveRoom.action'
	    	   ,success: function(f, action) {
	    		        form.getEl().unmask();
	    		        var msg = action.result.msg;
	    		        if(action.result.code == 0){
	    		        	Ext.example.msg(window.top.getIi18NText('systemMessage'), msg, function(){
	    		        		   btn.enable();
	    		        		   roomWin.close();
	    		        		   queryFun();
	    		        	});
	    		        	return;
	    		        }else{Ext.Msg.alert(window.top.getIi18NText('systemMessage'),action.result.msg);}
	    		        btn.enable();
	           },
                failure: function(form, action) {
                	Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("loginTimeoutTip01"),function(){
//					   window.location.replace("auth!logOffUser.action");
				   });
                }
	    });
    }
     
    //删除房间
    function delRoom(v,r,c,i,e,record,row){
		 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', msg:window.top.getIi18NText('alipay_delwarm',"<font color=red>"+record.get("name")+"</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   gridPanel.getEl().mask(window.top.getIi18NText('deling'));
				   Ext.Ajax.request({
					     url: 'livetoy!deleteRoon.action'
					    ,params: {i: record.get("id")}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  gridPanel.getEl().unmask();
				        	  var result = showResult(success,response);
				        	  if(result == false) return;
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('success'));
				        	  queryFun();
				        }
				   });
			   }
		 }});
    }
   
    function editRoom(v,r,c,i,e,record,row){
    	openRoomWin(row, record.get("id"));
    }
    
    function viewDetail(v,r,c,i,e,record,row){
    	openRoomWin(row, record.get("id"), 3);
    }
     
     function cancelWinFn(){
    	 roomWin.close();
    }
     
    function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
});
