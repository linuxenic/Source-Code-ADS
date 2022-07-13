/** toy manager */
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var viewport,tbarPanel,gridPanel,dataStore,ctrColumn,ctrColumn1,ajaxProxy,toyWin,toyId;
	var selectTer=[];
	
	Ext.define('record',{
		extend:'Ext.data.Model',
		fields:['terId','name','terNum','type']
		
	})
	
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
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
	
	ctrColumn =  { text: window.top.getIi18NText('operation'),  minWidth: 110,  menuText: window.top.getIi18NText('operation'), menuDisabled: true, 
					   hidden: true,  sortable: false,draggable: false, resizable: false,xtype: 'actioncolumn', items:[]};
	if(true){
		 ctrColumn.items.push({
		 	        iconCls: 'editIconCss'
		    	   ,tooltip : window.top.getIi18NText('modify')
		    	   ,handler:  editToy
		 });
		 ctrColumn.hidden = false;
	}
	if(true){
		ctrColumn.items.push({
	    	       iconCls: 'removeIconCss'
	        	   ,tooltip: window.top.getIi18NText('delete')
	        	   ,handler:  removeToy
	    });
		ctrColumn.hidden = false;
	}
	if(true){
		ctrColumn.items.push({
	    	       iconCls: 'configIconCss'
	        	   ,tooltip:  window.top.getIi18NText('updateType')
	        	   ,handler:  updateToyType
	    });
		ctrColumn.hidden = false;
	}
	ctrColumn1 =  { text: window.top.getIi18NText('operation'),  width: 100,align : 'center', menuText: window.top.getIi18NText('operation'), menuDisabled: true, 
					   hidden: false,  sortable: false,draggable: false, resizable: false,xtype: 'actioncolumn', items:[]};
	if(true){
		 ctrColumn1.items.push({
		 	        iconCls: 'editIconCss'
		    	   ,tooltip : window.top.getIi18NText('selectMain')
		    	   ,handler:function(v,r,c,i,e,record,row){
					    	 selectTerFu(1,record);
					}
		 });
	}
	if(true){
		ctrColumn1.items.push({
	    	       iconCls: 'removeIconCss'
	        	   ,tooltip:  window.top.getIi18NText('selectSecond')
	        	   ,handler:function(v,r,c,i,e,record,row){
					    	 selectTerFu(2,record);
					}
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
//		    ,hidden:true
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
					    ,width: 200
					    ,labelWidth: 30
					    ,emptyText: window.top.getIi18NText('toyName')
					    ,enforceMaxLength: true
		    	      },{
				        xtype: 'datefield',
				        fieldLabel: window.top.getIi18NText('beCreatedTimne')
				        ,labelWidth: 80
				        ,width: 260
				       ,id: 'btime'
				       ,name: 'btime'
				       ,emptyText: window.top.getIi18NText('startTime')
				       ,format: dateFormat
					    	   
				      },{
					     xtype: 'datefield'
					    ,name: 'etime'
					    ,id: 'etime'
					    ,width: 180
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
		ajaxProxy =  getAjaxProxy({url: 'livetoy!getAllToyList.action'});
		dataStore=Ext.create('Ext.data.Store', {
			fields : ["id","name","status","latest","type","rid","rname","mptid","mpterNum","mptname","aatid","aaterNum","aatname"],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
//			proxy :ajaxProxy
			proxy : {
				type : 'ajax',
				url : 'livetoy!getAllToyList.action',
				extraParams:{search:'',b:'',e:''},
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
			,listeners: {
				load:function($this){
					$this.sort('status', "ASC");
				}
			}
		});
		    
	    gridPanel=Ext.create("Ext.grid.Panel",{
		    title:window.top.getIi18NText('toyList'),
		    iconCls: 'tabIconCss',
		    frame: false,
		    store: dataStore,
	    	frame : false,
			border:false,
			forceFit : true,
		    columns: {
				items :[{
						text : window.top.getIi18NText('Noo'),
						minWidth : 60,
						align : 'center',
						xtype : 'rownumberer'
					}, {
						text : 'toyid',
						dataIndex : 'id',
						hidden : true
					}, {
						text :window.top.getIi18NText('toyName'),
						minWidth : 100,
						dataIndex : 'name'
					}, {
						text :'rid',
						dataIndex : 'rid'
						,hidden : true
					}, {
						text :window.top.getIi18NText('roomName'),
						minWidth : 100,
						dataIndex : 'rname'
					}, {
						text :window.top.getIi18NText('status'),
						minWidth : 100,
						dataIndex : 'status'
						,renderer:statusRenderFn						
					}, {
						text : 'mptid',
						dataIndex : 'mptid'
						,hidden : true
					}, {
						text : window.top.getIi18NText('mainNum'),
						minWidth : 100,
						dataIndex : 'mpterNum'
					}, {
						text : window.top.getIi18NText('mainTer'),
						minWidth : 100,
						dataIndex : 'mptname'
					}, {
						text : 'aatid',
						dataIndex : 'aatid'
						,hidden : true
					}, {
						text : window.top.getIi18NText('secondNum'),
						minWidth : 100,
						dataIndex : 'aaterNum'
					}, {
						text : window.top.getIi18NText('secondTer'),
						minWidth : 100,
						dataIndex : 'aatname'
					}, {
						text : window.top.getIi18NText('type'),
						minWidth:100,
						dataIndex : 'type',
						renderer:typeRenderFn
					},
					ctrColumn
					 ,{
						text : window.top.getIi18NText('createTime'),
						dataIndex : 'latest'
						,minWidth:140
						,renderer:datefmtRender
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
		   ,tools:[
//		   	{
//		            xtype: 'displayfield'
//			        ,id: 'totalUserTabRows'
//	                ,fieldLabel: window.top.getIi18NText('total')
//	                ,labelWidth: 50
//	                ,minWidth: 90
//	                ,value: '-'
//			  },
			  	{
				    xtype:'button',
				    tooltip: window.top.getIi18NText('addToy'),
				    tooltipType: 'title',
		            text: window.top.getIi18NText('addToy'),
		            border: false,
		            iconCls: 'addIconCss',
		            margin: '0 5 0 0',
		            handler:openAddToyWin //打开添加娃娃机窗口
		       },{
				    xtype:'button',
		            text: window.top.getIi18NText('refresh'),
		            border: false,
		            iconCls: 'refreshIconCss'
		            ,handler:queryFun
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
////    	   ajaxProxy.setExtraParam("search", encode(Ext.getCmp('searchTextId').getValue()));
////		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
////		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),dateFormat));
    	   dataStore.getProxy().extraParams.search=encode(Ext.getCmp('searchTextId').getValue());
    	   dataStore.getProxy().extraParams.b=Ext.Date.format(btime.getValue(),dateFormat);
    	   dataStore.getProxy().extraParams.e=Ext.Date.format(etime.getValue(),dateFormat);
		   dataStore.loadPage(1);   	   
     } 
     //房间数据
     var allRoomStore = Ext.create('Ext.data.Store', {
	      fields:['rid','rname']
		  ,autoLoad: true
	      ,proxy: {
    	     type: 'ajax'
    	     ,url:'livetoy!getAllRoom.action'
    	     ,reader: {
    	    	    type: 'json',
                    root: 'data',
                    tiemout: 20000,
                    totalProperty: 'totalCount'
             }
	      }
	      ,listeners: {
        	  load:function(){
//        		  this.loadData([{'rid':-1, 'rname':'- -请选择房间- -'}],true);
			    }
		}
          
 	});
     //终端数据
    var terStore= Ext.create('Ext.data.Store', {
			fields : ['terId', 'name', 'groupName', 'stateValue', 'terNum',
							'screen', 'authType','owner'],
			buffered : false,
			autoLoad : true,
			pageSize : 10,
			leadingBufferZone : 50,
			proxy : {
				type : 'ajax',
				url : 'terminal!getAllTerminal.action',
				extraParams:{t:-1,g:-1,w:1,a:0,toy:'toy'},
				reader : {
					type : 'json',
					root : 'data',
					tiemout : 30000,
					totalProperty : 'totalCount'
				}
			}
		});
    
    //终端表格
    var terGrid=Ext.create('Ext.grid.Panel', {
			    store:terStore,
			    height: 300,
			    width: 400,
			    columns: [
			     	{ text: getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center' },
			        { text: getIi18NText('No'),dataIndex: 'terId',hidden:true, width:75, menuDisabled: true,sortable:false, draggable: false },
			        { text: getIi18NText('serNu'),dataIndex: 'terNum', width:85, menuDisabled: true,align : 'center',sortable:false, draggable: false },
			        { text: getIi18NText("name"), dataIndex: 'name',align:'center',width:135,align:'center', menuDisabled: true,sortable:false, draggable: false },
//			        { text: getIi18NText('jsp_terOwner'),dataIndex: 'owner',align:'center',width:110, align : 'center',menuDisabled: true,sortable:false, draggable: false },
			        ctrColumn1
			    ],
//			    border:false,
			    bbar : [{
							xtype : 'pagingtoolbar',
							store : terStore,
							border : false,
							displayMsg: '共{2}条',
							displayInfo : true
						}],
			    viewConfig : {
					trackOver : false,
					disableSelection : false,
					emptyText : '<h1 style="margin:10px">'
							+ window.top.getIi18NText('roleTip05') + '</h1>'
				}
		});
		
	var checkBoxTer=new Ext.selection.CheckboxModel();
    //已选设备表格
    var selGrid=Ext.create('Ext.grid.Panel', {
			    store:[],
			    height: 300,
			    width: 245,
			    selType:'checkboxmodel',
			    selModel:checkBoxTer,
			    columns: [
			        { text: getIi18NText('No'),dataIndex: 'terId',hidden:true, width:75, menuDisabled: true,sortable:false, draggable: false },
			        { text: getIi18NText('terNum'),dataIndex: 'zf', hidden:true,minWidth:105, menuDisabled: true,align : 'center',sortable:false, draggable: false },
			        { text: getIi18NText('serNu'),dataIndex: 'terNum', width:60, menuDisabled: true,align : 'center',sortable:false, draggable: false },
			        { text: getIi18NText("name"), dataIndex: 'name',align:'center',minWidth:158,renderer:tnameRender, menuDisabled: true,sortable:false, draggable: false }
			    ],
			    bbar : [{
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
									if(selectTer[m].get('terId')!=recs[j].get('terId')){
										temo.push(selectTer[m]);
									}
								}
								selectTer=new Array();
								selectTer=temo;
								temo=new Array();								
							}
							selGrid.getStore().removeAll();
							selGrid.getStore().add(selectTer);
						}
					 }]
		});
	
	//删除娃娃机
    function removeToy(v,r,c,i,e,record,row){
    	 if(record.get("status")==1){
    		Ext.Msg.show({ 
		           title : getIi18NText("systemMessage"),  
		           msg : getIi18NText("toyIsPlaying"),  
		           width : 250,  
		           icon : Ext.Msg.QUESTION,  
		           buttons :Ext.Msg.OK,
		           buttonText : {
						ok : getIi18NText("confirm")
		           }
		       }); 
		    queryFun();
	    	return;
    	 }
    	 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('confirm_del', "<font color=red>" + record.get("name") + "</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('deling'));			   
				   Ext.Ajax.request({
					     url: 'livetoy!deleteToy.action'
					    ,params: {i: record.get("id")}
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
    //修改娃娃机类型
    function updateToyType(v,r,c,i,e,record,row){
    	 var typeTips,type;
    	 if(record.get("type")==1){//测试修改为正式
    	 	typeTips=getIi18NText("formal");
    	 	type=2;
    	 }else{//正式修改为测试
    	 	typeTips=getIi18NText("testConnect");
    	 	type=1;
    	 }
    	 //确认将当前娃娃机设置为[{#}]娃娃机吗?
    	 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('updateToyType', "<font color=red>" + typeTips + "</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('confirm'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.getBody().mask(getIi18NText('monitor_message_33'));			   
				   Ext.Ajax.request({
					     url: 'livetoy!updateToyType.action'
					    ,params: {type: type,tid:record.get("id")}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  var result = showResult(success,response);				        	  
				        	  Ext.getBody().unmask();
				        	  if(result == false) return;
				        	  queryFun();
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('monitor_message_35'));
				        }
				   });
			   }
		 }});
    }
	//修改娃娃机
    function editToy(v,r,c,i,e,record,row){
    	if(record.get("status")==1){
    		Ext.Msg.show({ 
		           title : getIi18NText("systemMessage"),  
		           msg : getIi18NText("toyIsPlaying"),  
		           width : 250,  
		           icon : Ext.Msg.QUESTION,  
		           buttons :Ext.Msg.OK,
		           buttonText : {
						ok : getIi18NText("confirm")
		           }
		       });
		    queryFun();
	    	return;
    	}
    	openAddToyWin(row, record.get("id"),record);
    }
    //打开娃娃机窗口
    function openAddToyWin(btn,tid,record){
    	toyId=tid;
    	selectTer=new Array();
    	var beforecloseFn=function(){
    		selGrid.getStore().removeAll();
	   		selGrid.getStore().add(selectTer);
    		toyWin.hide(btn);
    		Ext.getCmp('toyName').setValue('');
    		Ext.getCmp('toyRoom').setValue('');
    	};
    	var showFn = function(){
    		selGrid.getStore().removeAll();
	        selGrid.getStore().add(selectTer);
	        terStore.loadPage(1);
			toyWin.setTitle(getIi18NText('addToy'));
			if(/^\d+$/.test(tid)){//修改娃娃机
				toyWin.setTitle(getIi18NText('updateToy'));
				editToyCallback(record)
			}
		};
		
		if(toyWin && toyWin.isWindow){
			toyWin.clearListeners( );
			toyWin.addListener("beforeclose", beforecloseFn);
			toyWin.addListener("show", showFn);
			toyWin.show(btn);
			return;
		}
    	toyWin=Ext.create('Ext.window.Window',{
				  title:getIi18NText('addToy')
				  ,plain: true
				  ,width: 740
				  ,height: 450
				  ,minWidth: 200
				  ,minHeight: 200
				  ,border: false
				  ,frame: false
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
				   	,items:[{                 	
							xtype : 'panel',
							layout : 'column',
							border : false,
							defaults : {
								margin : '5 0 0 15'
							},
							items : [{
										fieldLabel : '<font color="red"> * </font>'+getIi18NText('name'),
										xtype : 'textfield',
										id : 'toyName',
										width : 240,
										emptyText : getIi18NText('toyNameTips'),
										allowBlank : false,
										maxLength : 200,
										labelWidth : 50
									}, {
										xtype : 'combo',
										id : 'toyRoom',
										fieldLabel : '<font color="red"> * </font>'+getIi18NText('room'),
										editable : false,
										margin : '5 0 0 150',
										labelWidth : 40,
										width : 200,
										value:'',
										displayField : 'rname',
										valueField : 'rid',
										store : allRoomStore,
										emptyText:getIi18NText('roomNameTips'),
										allowBlank : false,
//										queryMode : 'local',
										listeners : {
											change : function($this, newValue,oldValue, eOpts) {}
										}
							}]						
                  },{                 	
						xtype : 'panel',
						layout : {type:'hbox', align: 'middle',pack:'center'},
						border : false,
						defaults : {
							margin : '10 0 0 10'
						},
						items : [{
					 	 xtype: 'fieldset',
				  		 title: '<strong>'+getIi18NText('noChoose')+'</strong>',
//					 	 margin: '10 0 0 0',
	    				 width:425,
	    				 height:330,
	    				 items: [terGrid]
	    			 },{
	    			 	 xtype: 'fieldset',
				  		 title: '<strong>'+getIi18NText('checkedTerminals')+'</strong>',
	    				 width:270,
	    				 height:330,
	    				 items: [selGrid]
	    			 }]						
                  },{
                  	 xtype:'panel'
                  	 ,border:false,
                  	 items:[{
							xtype : 'button',
							text : getIi18NText('save'),
							formBind:true,
							margin:'5 0 0 300',
							border : true,
							handler:saveToy
						},{
							xtype : 'button',
							text : getIi18NText('cancel'),
							margin:'5 0 0 20',
							border : true,
							handler: function(){
								toyWin.close();
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
    //保存娃娃机
    function saveToy(){
    	var toyName=Ext.getCmp('toyName').getValue();
    	if(toyName.length<=0){
    		return;
    	}
    	var rid=Ext.getCmp('toyRoom').getValue();
    	var mptid,aatid;
    	for (var i = 0; i < selectTer.length; i++) {
			if(selectTer[i].get("type")==1){
				mptid=selectTer[i].get("terId");
			}
			if(selectTer[i].get("type")==2){
				aatid=selectTer[i].get("terId");
			}
		};
		Ext.Ajax.request({
			url:"livetoy!saveToy.action",
			method: 'post',
			params: {toyid: toyId,toyName:toyName,rid:rid,mptid: mptid,aatid: aatid},
			timeout:30000,
			callback: function(opt, success, response){
	        	  Ext.getBody().mask(getIi18NText('saving'));
	        	  var result = showResult(success,response);
	        	  Ext.getBody().unmask();
	        	  if(result == false) return;
	        	  Ext.example.msg(window.top.getIi18NText('operationTips'), getIi18NText('saveSuccess'));
	        	  toyWin.close();
	        	  queryFun();
	        }
		})
    }
    
    //修改娃娃机函数
    function editToyCallback(r){
    	Ext.getCmp('toyName').setValue(r.get('name'));
    	Ext.getCmp('toyRoom').setValue(r.get('rid'));
    	var mpt,aat;
    	selectTer=new Array();
    	if(typeof(r.get("mptid"))=="number"){
		  mpt = Ext.create('record', {
		    terId: r.get("mptid"),  
		    name:r.get("mptname"),  
		    terNum:r.get("mpterNum"),
		    type:'1'  
		  });
		  selectTer.push(mpt);
    	};
    	if(typeof(r.get("aatid"))=="number"){
		  aat = Ext.create('record', {
		    terId: r.get("aatid"),  
		    name:r.get("aatname"),  
		    terNum:r.get("aaterNum"),
		    type:'2'  
		  });
		  selectTer.push(aat); 
    	}
    	selGrid.getStore().removeAll();
	    selGrid.getStore().add(selectTer);
    }
    //设为主辅设备
	function selectTerFu(type,r){
		var count=0;
		var ter ;
		if(type==1){//设为主设备
		   ter = Ext.create('record', {
			   terId: r.get("terId"),  
			   name:r.get("name"),  
			   terNum:r.get("terNum"),
			   type:'1'  
		  });
		}else if(type==2){//设为辅设备
		  ter = Ext.create('record', {
			   terId: r.get("terId"),  
			   name:r.get("name"),  
			   terNum:r.get("terNum"),
			   type:'2'  
		  });
		}
		for (var i = 0; i < selectTer.length; i++) {
			if(ter.get("terId")==selectTer[i].get("terId")||ter.get("type")==selectTer[i].get("type")){
				count++;
			}
		}
		if(count>=1){
			return;
		}		
		selectTer.push(ter);  
	    selGrid.getStore().removeAll();
	    selGrid.getStore().add(selectTer);
	}
    
    function tnameRender(value,m,record,r,c){
    	if(record.get("type")==1){
    		return getIi18NText("mainDevice")+value;
    	}else if(record.get("type")==2){
    		return getIi18NText("secondDevice")+value;
    	}
    }
    
	function statusRenderFn(value){
		if(value==1){//游戏中
			return "<font color=\"red\">●&nbsp;"+getIi18NText("inGame")+"</font>";
		}else if(value==2){//在线
			return "<font color=\"#009900\">●&nbsp;"+getIi18NText("online")+"</font>";
		}else if(value==3){//离线
			return "<font color=\"gray\">●&nbsp;"+getIi18NText("offLine")+"</font>";
		}
	}
    
	function typeRenderFn(value){
		if(value==2){//正式
			return "<font color=\"red\">●&nbsp;"+getIi18NText("formal")+"</font>";
		}else{//测试
			return "<font color=\"gray\">●&nbsp;"+getIi18NText("testConnect")+"</font>";
		}
	}

	function  datefmtRender(value){
    	   return  Ext.Date.format(new Date(value), dateFormat);
     }
	
});
