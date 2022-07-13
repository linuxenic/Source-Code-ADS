/** item manager */
var defaultSelect,extFileRegistId;
var showflag = true;
var editid = "";
var ishide;
var userType;
var allotPanel;//分配面板
var groupSelectedProxy;
var groupSelected;//单选面板
var flatSelected;//多选面板
var singlePanel;
var multiPanel;
var companyid = "";//创建新用户时，当需要分配用户时，分配用户的id
var constrainedWin;
var adVersion = (localVersion=="AD");
var wechatVersion = (localVersion=="WeChat");
var selfVersion = (localVersion=="Self-selling");
var giftVersion = (localVersion=="gift-AD");
var orderVersion = (localVersion=="order");

// 点击更新按钮时，获取到的用户的数据    // 是否开启了容量配置。true：开启 // 总容量最大值				// 总容量最小值
var loginUserCapacityInfo = null,capacityStatus = false,maxValueLimit = 900000000,minValueLimit = 0;
Ext.onReady(function() {
	Ext.Ajax.timeout=180000;
	var isEng = window.top.getIi18NText('confirm') == 'OK';
	 // 1.start
	//Ext.getBody().mask('加载数据中...');
	//vtype
	var Lnumber = /^[0-9a-zA-Z_]{6,18}$/;
	Ext.apply(Ext.form.field.VTypes, {
	  Lnumber: function(val, field) {
	    return Lnumber.test(val);
	  },
	  LnumberText: window.top.getIi18NText('passwordWarming01')+','+window.top.getIi18NText('passwordWarming02')
//	  LnumberMask: /[\d\s:amp]/
	});
	Ext.apply(Ext.form.field.VTypes, {
	  Lnumber2: function(val, field) {
	  	var pwd = Ext.getCmp('userFirstPwd').getValue().trim();
	  	if(!(val.trim()==pwd)){
	  		Ext.Msg.alert(window.top.getIi18NText('systemMessage'),getIi18NText('defaultInputPsw'));
	  		return false;
	  	}
	    return Lnumber.test(val);
	  },
	  Lnumber2Text: window.top.getIi18NText('passwordWarming01')+','+window.top.getIi18NText('passwordWarming02')
//	  LnumberMask: /[\d\s:amp]/
	});
	//variable
	var viewport,gridPanel,tabStore,ajaxProxy,gridRowFix="grid_row_",userWind,bindWind
	     ,roleAjaxProxy,gridRolepanel,puserStore,bolRoleComplete = false,rolesResult, hideRolePanel=true,currClickId;
	
	var  AUTH = Ext.merge({add: false,update: false, "delete": false,type:false,bind:false,aloneAssign:false}, Ext.decode(decode(AUTH_TBAR)));
 
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title: window.top.getIi18NText('systemMessage')
		  ,minWidth: 100
	      ,html: ''
	});
	
	var konka_ip = (adVersion && local == 'noads_konka' && AUTH["konka_ip"]);
	var konka_phone = (adVersion && local == 'noads_konka' && AUTH["konka_phone"]);
	
	
	var medication = (local=='medication');
	
//	var status;	//权限状态值
//	Ext.Ajax.request({
//		 url: 'auth!getAuthValue.action'
//				,method: 'post'
//				,success: function(data){
//					var result = data.responseText;
//					var obj = eval('('+result+')');
//					status = obj.status;
//				}
//	});
	var generation=1;	//后台判断授权类型值，1为共享授权，2为独立分配
	Ext.Ajax.request({
		 url: 'auth!getUserType.action'
			,method: 'post'
			,success: function(data){
				userType = data.responseText;
			}
	 });
	if(userType == 0){
		var userajaxProxy =  getAjaxProxy({url: 'auth!getcom.action',params: {type: 1}});
	}
	var iconArray = [
					{"name":"interface_designer.png", "src":'images/user/interface_designer.png'},
					{"name":"device_manager.png", "src":'images/user/device_manager.png'},
					{"name":"replenishment.png", "src":'images/user/replenishment.png'},
	                {"name":"default.png", "src":'images/user/default.png'},
	                {"name":"head.png", "src":'images/user/head.png'},
					{"name":"yellow1.png", "src":'images/user/yellow1.png'},
					{"name":"yellow2.png", "src": 'images/user/yellow2.png'}
				];
	Ext.QuickTips.init();
	
	//2.create
	var ctrColumn =  { text: window.top.getIi18NText('operation'),  minWidth: 140, maxWidth: 140, menuText: window.top.getIi18NText('operation'), menuDisabled: true, 
					   hidden: true,  sortable: false,draggable: false, resizable: false,xtype: 'actioncolumn', items:[]};
	if(AUTH.update){
		 ctrColumn.items.push({
		 	        iconCls: 'editIconCss'
		    	   ,tooltip : window.top.getIi18NText('modify')
		    	   ,handler:  editUser
		 });
		 ctrColumn.hidden = false;
	}

	if(AUTH["authShared"] && selfVersion){
		ctrColumn.items.push({
	    	       iconCls: 'authShared'
	        	   ,tooltip: window.top.getIi18NText('authShared')
	        	   ,handler:  openAuthSharedWindowow
	    });
		ctrColumn.hidden = false;
	}
	
	if(AUTH["delete"]){
		ctrColumn.items.push({
	    	       iconCls: 'removeIconCss'
	        	   ,tooltip: window.top.getIi18NText('delete')
	        	   ,handler:  removeUser
	    });
		ctrColumn.hidden = false;
	}
	if(isInter!="true"){
		ctrColumn.items.push({
	    	       iconCls: 'viewIconCss '
	        	   ,tooltip: window.top.getIi18NText('checkregister')
	        	   ,handler:  shower
	    });
		ctrColumn.hidden = false;
	}
	if(AUTH.bind){
		ctrColumn.items.push({
			iconCls: 'bindIconCss '
//			,tooltip: '绑定第三方'
			,tooltip: window.top.getIi18NText('thirdParty')
			,handler:  bindUser
		});
		ctrColumn.hidden = false;
	}
	if(AUTH.doctorCode && medication){
		ctrColumn.items.push({
	    	       iconCls: 'doctorCode'
	        	   ,tooltip: getIi18NText('checkUserCode')
	        	   ,handler:  showDoctorCode
	    });
		ctrColumn.hidden = false;
	}
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
								    ,emptyText: window.top.getIi18NText('selectByUsername')
								    ,enforceMaxLength: true
			            	      },{
								        xtype: 'datefield',
								        fieldLabel: window.top.getIi18NText('beCreatedTimne'),
								        name: 'btime'
								        ,labelWidth: 80
								        ,width: 260
								       ,id: 'btime'
								       ,name: 'btime'
								       ,emptyText: window.top.getIi18NText('startTime')
								       ,format: dateFormat
								    	   
							      },{
									     xtype: 'datefield',
									     name: 'etime'
									    ,id: 'etime'
									    ,width: 180
									    ,emptyText: window.top.getIi18NText('endTime')
									    ,format: dateFormat
								  },{
				            	      xtype: 'button'
				            	      ,id: 'queryBut'
				            	      ,iconCls: 'queryIconCss'
						    		  ,text:  window.top.getIi18NText('select')
						    		  ,handler: function () {
						    			  queryFun(false);
						    		  }
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
	
	//4.create tools
	
	/**fun methods*/
    /* listeners event .dragZone      -------start **/
	function renderTable($this, eopt){
			ajaxProxy =  getAjaxProxy({url: 'auth!allUsers.action'});
			////id,name,userName,imgsrc,pName,roleName,author,updateDate
		    tabStore = Ext.create('Ext.data.Store', {
				        fields: ['id','name','userName','imgsrc','pName','roleName','type','author','updateDate'],
		     	       pageSize: 10
//		     	       ,leadingBufferZone: 50
//		     	       ,buffered:true
		     	       ,proxy: ajaxProxy
		     	      ,purgePageSize :10
//		     	       ,paganation:true
                       ,sorters: [{
                            property: 'updateDate',
                            direction: 'DESC'
                        }]
//		     	       ,autoLoad: true
		     	       ,listeners: {
		     	    	    load:function($this){
		     	    	    	 Ext.getCmp('totalUserTabRows').setValue($this.getTotalCount());
		     	    	    	 Ext.getBody().unmask();
		     	    	    }
		     	       }
	        });
		    
		    tabStore.loadPage(1);
			gridPanel = Ext.create('Ext.grid.Panel', {
			    title: window.top.getIi18NText('usersList'),
			    iconCls: 'tabIconCss',
			    frame: false,
			    store: tabStore,// Ext.data.StoreManager.lookup('simpsonsStore'),
			    columns: [
			        { text: window.top.getIi18NText('No'), width: 60 , xtype: 'rownumberer', align: 'center'},
			        { text: window.top.getIi18NText('avatar'),flex: 1, dataIndex: 'imgsrc', minWidth: 64,menuDisabled : true, renderer: renderHeader},
			        { text: "id", dataIndex: 'id', minWidth: 64,flex: 1, hidden:true},
			        { text: window.top.getIi18NText('nickname'),flex: 1, dataIndex: 'name', menuDisabled : true,minWidth: 100},
			        { text: window.top.getIi18NText('username'),flex: 1, dataIndex: 'userName',menuDisabled : true, minWidth: 100},
				    { text: window.top.getIi18NText('hasAuth'),flex: 1, dataIndex: 'roleName', menuDisabled : true,minWidth: 100, renderer: renderRoleName},
				    { text: window.top.getIi18NText('usertype'),flex: 1, dataIndex: 'type', menuDisabled : true,minWidth: 100, renderer: renderUserType},
				    { text: window.top.getIi18NText('superior'),flex: 1, dataIndex: 'pName', menuDisabled : true,minWidth: 100},
				    { text: window.top.getIi18NText('creator'),flex: 1, dataIndex: 'author',menuDisabled : true,width: 100},
				    ctrColumn,
				    { text: window.top.getIi18NText('lastUpdateTime'),flex: 1, dataIndex: 'updateDate',menuDisabled : true, width: 140,flex: 1,renderer: datefmtRender}
			    ],
	            bbar: [{
	            	id:'padingBar',
	                xtype: 'pagingtoolbar',
	                store: tabStore,
	                border:false,
//	                displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
//	                emptyMsg: "没有数据",
//	                beforePageText: "当前页",
//	                afterPageText: "共{0}页",
	                displayInfo: true                 
	            }],
			    margin: 1
			   ,tools:[{
			            xtype: 'displayfield'
				        ,id: 'totalUserTabRows'
		                ,fieldLabel: window.top.getIi18NText('total')
		                ,labelWidth: 50
		                ,minWidth: 90
		                ,labelStyle: 'color: white'
		                ,fieldStyle: 'color: white'
		                ,value: '-'
				  },{
					    xtype:'button',
					    tooltip: window.top.getIi18NText('adduser'),
					    tooltipType: 'title',
			            text: window.top.getIi18NText('adduser'),
			            border: false,
			            iconCls: 'addIconCss',
			            margin: '0 5 0 0',
			            hidden: !AUTH.add,
					    handler: openAddUserWindow		//打开添加用户窗口
			       },{
					    xtype:'button',
					    tooltip: window.top.getIi18NText('refreshUsersList'),
					    tooltipType: 'title',
			            text: window.top.getIi18NText('refresh'),
			            border: false,
			            iconCls: 'refreshIconCss',
					    handler: queryFun
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
	
     /* listeners event .dragZone      -------end **/
	 /**add by area fun*/
    
     //event start
     function  renderHeader(value,metaData,record,rowIndex,colIndex,store,view){
		   return  Ext.String.format('<img src="{0}" width="64px" height="64px"/>',value);
	 }
     function  renderRoleName(value,metaData,record,rowIndex,colIndex,store,view){
    	 return  "<span title='"+value+"'>"+value+"</span>";
     }
     function renderUserType(value,metaData,record,rowIndex,colIndex,store,view){
    	 if(Ext.decode(record.get('id'))==1){
    		 return window.top.getIi18NText('superuser');
    	 }else if(value==1){
    		 return window.top.getIi18NText('platformuser');
    	 }else if(value==2){
    		 return window.top.getIi18NText('companyuser');
    	 }else if(value==3){
    		 return window.top.getIi18NText('employeesuser');
    	 }else if(value==5){
    		 return window.top.getIi18NText('tempuser');
    	 }else{
    		 return window.top.getIi18NText('averageuser');
    	 }
     }
     function  datefmtRender(value,metaData,record,rowIndex,colIndex,store,view){
    	   return  Ext.Date.format(new Date(value), dateFormat);
     }
     
	 function validDateFn(v){
		 return /^(\d+)(\*)(\d+)$/.test(v)?true:v+window.top.getIi18NText('roleTip06');
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
	       ajaxProxy.setExtraParam("n", encode(Ext.getCmp('searchTextId').getValue()));
		   ajaxProxy.setExtraParam("b", Ext.Date.format(btime.getValue(),dateFormat));
		   ajaxProxy.setExtraParam("e", Ext.Date.format(etime.getValue(),dateFormat));
		   gridPanel.getSelectionModel().deselectAll();//此操作相当重要
//		   Ext.getCmp("padingBar").moveFirst();
//		   tabStore.load();
    	   var pageIndex =gridPanel.store.currentPage; //获取当前页停留当前页
    	   if (gridPanel.store.data.length==1 && pageIndex!=1) {
    		   if (but!=undefined) {
    			   pageIndex = 1;
    		   }
		   }
		   if (Ext.getCmp('searchTextId').getValue()!='') {
		   		pageIndex = 1;
		   }
		  tabStore.loadPage(pageIndex);
		  
		  //tabStore.load({params:{start:pagebar.cursor,limit:pagebar.pageSize}});
     } 
     function openBindUserWindow(btn,gid){
    	 currClickId = gid ;
		 var beforecloseFn = function(){
			 Ext.getCmp("onames").setValue("");
			 Ext.getCmp("totalCapacity").setMaxValue(900000000);
			 Ext.getCmp("totalCapacity").setMinValue(0);
	     };
	     var showFn = function(){
		     if(/^\d+$/.test(gid)){
		    	 Ext.Ajax.request({
			    	   url: 'auth!getBindUser.action'
			    	  ,params: {i: gid}
			    	  ,callback: function(opt, success, res){
			    		  var result = Ext.decode(res['responseText']);
					   	  if(result.code == 0){
					   		  Ext.getCmp('onames').setValue(result.account);
					   	  }
					   }
			    });
		     }
	     };
		 if(bindWind && bindWind.isWindow){
			 bindWind.clearListeners( );
			 bindWind.addListener("beforeclose", beforecloseFn);
			 bindWind.addListener("show", showFn);
			 Ext.getCmp('oid').setValue(gid);
			 bindWind.show(btn);
			  return;
		 }
		 //用户绑定窗口
		 bindWind=Ext.create('Ext.window.Window',{
					  title: window.top.getIi18NText('thirdParty')
					  ,plain: true
					  ,width: 370
					  ,height: 215
					  ,minWidth: 370
					  ,minHeight: 200
					  ,border: false
					  ,frame: false
					  ,modal: true
					  ,constrain: true
					  ,closeAction: 'hide'
					  ,listeners: {
						   beforeclose: beforecloseFn
						  ,show: showFn
						  ,close: function(){
						  }
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
	                        	   ,layout: {type: 'vbox', align: 'center',pack:'center'}
	                               ,defaults: {labelAlign: 'right',width: 220,labelWidth: 100,xtype: 'textfield',enforceMaxLength: true,allowBlank: false,validateOnChange:false}
	                        	   ,items: [{
	                        		     id:'oid'
	                        		    ,name: 'ouserId'
	                        		    ,allowBlank: true
	                        		    ,inputType: 'hidden'
	                        		    ,value:gid
	                        	   },{
	                        		     fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('thirdAccount')
	                        		    ,vtype: 'alphanum'
	                        		    ,id:'onames'
	                        		    ,name: 'ouserName'
	                        		    ,maxLength: 16
	                        	   },{
	                          	     xtype: 'fieldcontainer'
	                          	    ,layout: 'hbox'
	                          	    ,fieldLabel: '&nbsp;'
	                          	    ,labelSeparator : ''
	                          	    ,width:'100%'
	                          	    ,items: [{
	                          	    	 xtype: 'button',
	                          	    	 text: window.top.getIi18NText('save')
	                          	    	 ,formBind: true
	                          	    	 ,disabled: true
	                          	    	 ,margin: '5 0 0 0'
	                          	    	 ,width: 80
	                          	    	 ,iconCls: 'pback_finish_IconCls'
	                          	    	 ,handler: function(btn){
	                          	    	 saveBindUser(btn,gid);
	                          	    	 }
	                          	    },{
	                          	    	 xtype: 'button',
	                          	    	 text: window.top.getIi18NText('cancel')
	                          	    	 ,margin: '5 0 0 20'
	                          	    	 ,width: 80, 
	                          	    	 iconCls: 'pback_reset_IconCls'
	                          	         ,handler: function(){
	                          	        	bindWind.close();
	                          	        }
	                          	    }]
	                           }]
	                        }]	
	                  }]
        }).show(btn);
	}
     
     /////////////TODO 打开添加用户信息窗口\\\\\\\\\\\\
     function openAddUserWindow(btn,gid){	
    	 currClickId = gid ;
    	 
    	 //关闭前调用的函数 ，将form表单进行一些操作
		 var beforecloseFn = function(){
			 
			          userWind.hide(btn);
			          //reset form
			          var form = userWind.down('form');
			          
			          var fieldPwd = form.down('field[name="userPwd"]');
			          fieldPwd.setReadOnly(false);
			          fieldPwd.getEl().setOpacity(1);
			          
			          var fieldPwd = form.down('field[name="userType"]');
			          fieldPwd.setReadOnly(false);
			          fieldPwd.getEl().setOpacity(1);
			          
			          var field_Pwd = form.down('field[name="userPPwd"]');
			          field_Pwd.setReadOnly(false);
			          field_Pwd.getEl().setOpacity(1);
			          
			          var field_name = form.down('field[name="userName"]');
			          field_name.setReadOnly(false);
			          field_name.getEl().setOpacity(1);
			          
			          //var field_pname = form.down('field[name="userPuser"]');
			         // field_pname.setReadOnly(false);
			         // field_pname.getEl().setOpacity(1);
			          
			          gridRolepanel.getSelectionModel().deselectAll();
			          form.getForm().reset();
			          form.getForm().clearInvalid( );
			          //初始化头像
			          form.down('combo[name="iconName"]').initDefault();
			          
			          //新增用户时一直隐藏权限
			          Ext.getCmp('authpan').hide();	
			          Ext.getCmp('authpan1').hide();
			          //根据时间查询
				      queryFun(false);
	     };
	     
	     //用户类型  userType  0:所有用户   1：公司管理员     2：员工用户   averageuser：普通用户
	     if(userType==0){
	    	 var states = Ext.create('Ext.data.Store', {
	    		 fields: ['abbr', 'name'],
	    		 data : [
	    		         {"abbr":4, "name": window.top.getIi18NText('averageuser')},
	    		         {"abbr":1, "name": window.top.getIi18NText('platformuser')},
	    		         {"abbr":2, "name": window.top.getIi18NText('companyuser')},
	    		         {"abbr":3, "name": window.top.getIi18NText('employeesuser')}
	    		        ]
	    	 });
	     }else if(userType==1){
	    	 var states = Ext.create('Ext.data.Store', {
	    		 fields: ['abbr', 'name'],
	    		 data : [
//	    		         {"abbr":4, "name": window.top.getIi18NText('averageuser')},
	    		         {"abbr":2, "name": window.top.getIi18NText('companyuser')}
	    		         //{"abbr":3, "name": window.top.getIi18NText('employeesuser')}
	    		        ]
	    	 });
	     }else if(userType==2){
	    	 var states = Ext.create('Ext.data.Store', {
	    		 fields: ['abbr', 'name'],
	    		 data : [
//	    		         {"abbr":4, "name": window.top.getIi18NText('averageuser')},
	    		         {"abbr":3, "name": window.top.getIi18NText('employeesuser')}
	    		        ]
	    	 });
	     }else if(userType==3){
	    	 var states = Ext.create('Ext.data.Store', {
	    		 fields: ['abbr', 'name'],
	    		 data : [
	    		         {"abbr":3, "name": window.top.getIi18NText('employeesuser')}
	    		        ]
	    	 });
	     }else{
	    	 var states = Ext.create('Ext.data.Store', {
	    		 fields: ['abbr', 'name'],
	    		 data : [
	    		         {"abbr":4, "name": window.top.getIi18NText('averageuser')}
	    		        ]
	    	 });
	     }
	     
	     var comstore = Ext.create('Ext.data.Store', {
    		 fields: ['id', 'name'],
    		 data : [
    		         {"id":4, "name": window.top.getIi18NText('averageuser')}
    		        ]
    	 });
	     

	     //show的时候调用该函数，但作用？
	     var showFn = function(){
	    	     var file = userWind.down('form').down('field[name="sourceFile"]');
	    	     if(file){
	    	    	 renderFileControl(file);
	    	     };
	    	     bolRoleComplete = false;
	    	     refresbRoleEvent();
	    	     
			     Ext.getCmp("usedCapacity").getEl().setOpacity(0.5);
	    	     //设置窗口标题为添加用户
	    	     userWind.setTitle(window.top.getIi18NText('adduser'));
	    	     
	    	     // 是否开启容量开关，true：开启
	    	     capacityStatus = false;
	    	     // 总容量最大值				// 总容量最小值
	    	     maxValueLimit = 900000000,minValueLimit = 0;
	    	     
	    	     //判断是否是更新（编辑）用户信息
	    	     if(/^\d+$/.test(gid)){		
	    	    	 userWind.setTitle(window.top.getIi18NText('updateUserInfo'));
	    	    	 Ext.Ajax.request({
				    	   url: 'auth!getSingleUser.action'
				    	  ,params: {i: gid}
				    	  ,callback: showEditUserCallback
				    });
	    	     }else{
	    	    	 Ext.Ajax.request({
				    	   url: 'system!getLoginAuthInfo.action'
				//    	  ,params: {uid: gid}
				    	   ,method: 'post'
	                       ,callback: function (opt, success, res) {
				        	  var result = showResult(success,res);
				        	  if(result == false) return;
				        	  var data = Ext.decode(result["msg"]);
				        	  //console.log('add user data -> '+JSON.stringify(data));
				        	  //设置读取到的互动点数和信发点数,作为当前数字框的上限值
			        	      Ext.getCmp("acau").setMaxValue(data["activeAuthNum"]);
			        	      Ext.getCmp("siau").setMaxValue(data["simpleAuthNum"]);
			    		   	  if(data["isShare"]=='1'){
					        	 Ext.getCmp("autypebo").setReadOnly(true);
					        	 Ext.getCmp("autypebo").getEl().setOpacity(0.3);
				        	 }else{
				        		 Ext.getCmp("acau").setReadOnly(false);
				        		 Ext.getCmp("siau").setReadOnly(false);
				        		 Ext.getCmp("autypebo").setReadOnly(false);
				        		 Ext.getCmp("acau").getEl().setOpacity(1);
				        		 Ext.getCmp("siau").getEl().setOpacity(1);
				        		 Ext.getCmp("autypebo").getEl().setOpacity(1);
				        	 }		        	      
					          Ext.getCmp("acau1").getEl().setOpacity(0.5);
					          Ext.getCmp("siau1").getEl().setOpacity(0.5);
				    		 if (cap) {//版本限制
				    		 	if (data["capacityStatus"] == true) {//开启了容量配置
				    		 		capacityStatus = true;
				    		 		
				    		 		Ext.getCmp("capacityType").show();
				    		 		if (data["pct"] == "2") {//当前用户是独立容量才能在新增用户时创建独立分配
							        	Ext.getCmp("capacityType").setReadOnly(false);
							        	Ext.getCmp("capacityType").getEl().setOpacity(1);
							        	Ext.getCmp("totalCapacity").setReadOnly(false);
							        	Ext.getCmp("totalCapacity").getEl().setOpacity(1);
							        	Ext.getCmp("totalCapacity").setMaxValue(data["maxtc"]);
							        	Ext.getCmp("totalCapacity").setMinValue(0);
							        	maxValueLimit = data["maxtc"];
	    		 						minValueLimit = 0;
				    		 		} else {
							        	Ext.getCmp("capacityType").setReadOnly(true);
							        	Ext.getCmp("capacityType").getEl().setOpacity(0.5);
							        	Ext.getCmp("totalCapacity").setReadOnly(true);
							        	Ext.getCmp("totalCapacity").getEl().setOpacity(0.5);
				    		 		}
				    		 		
				    		 		// 将获取到的更新用户数据置为null，表示是新增用户
				    		 		loginUserCapacityInfo = null;
				    		 	} else {
				    		 		Ext.getCmp("capacityType").hide();
				    		 	}
				    		 }
				    		 document.getElementById("autypebo-inputEl").readOnly=true;
				    	     document.getElementById("capacityType-inputEl").readOnly=true;
	                       }
				    });
	    	     }
	    	     document.getElementById("autypebo-inputEl").readOnly=true;
	    	     document.getElementById("capacityType-inputEl").readOnly=true;
	     };
	     
	     //窗口打开之后添加前面定义的监听函数（窗口重复利用）
		 if(userWind && userWind.isWindow){
			  userWind.clearListeners( );
			  userWind.addListener("beforeclose", beforecloseFn);
			  userWind.addListener("show", showFn);
			  userWind.show(btn);
			  if(userType == 4){
			    Ext.getCmp('userType').setValue(4);
			    Ext.getCmp('userType').hide();
			  }else if(userType == 2){
			    Ext.getCmp('userType').setValue(3);
			  }
			  Ext.getCmp('rssetButton').hide();
			  return;
		 }
		 
		 // 获取角色列表
		 getGridRolepanel(gid);
		 
		 //获取头像列表
		 var iconCombox =  getIconCombo();
		 //var userCombo = getPUserCombo();
		 
		 
		 //真正的用户窗口（集添加和更新为一体的窗口）
	     userWind=Ext.create('Ext.window.Window',{
					  title: window.top.getIi18NText('adduser')
					  ,plain: true
					  ,width: 740
					  ,height: 480
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
						  ,close: function(){
							  companyid = ""; 
						  }
	     				
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
	                        	   ,layout: {type: 'vbox', align: 'center',pack:'center'}
	                               ,defaults: {labelAlign: 'right',width: 260,labelWidth: 60,xtype: 'textfield', labelCls: 'labelCls',fieldBodyCls: 'fieldBodyCls',
	                            	           baseCls: 'baseBodyCls',enforceMaxLength: true,allowBlank: false,validateOnChange:false}
	                        	   ,items: [{
	                        		      xtype: 'panel'
	                        		     ,border: false	                        		    	  
	                        		     ,layout: {type: 'table',columns: 2,tdAttrs: {style: 'vertical-align: middle'}}
	                        	         ,padding: '2 0 5 10'
	                        	         ,items: [iconCombox,
	                        	          {
	                        	        	     xtype: 'displayfield'
	                        	        	    ,fieldCls: 'displayfieldCls'
	                        	        	    ,value: window.top.getIi18NText('choosePictureTip')
	                        	         },{
				   	                		     xtype: 'filefield'
					   	                	    ,buttonText: window.top.getIi18NText('choosePicture')
					   	                	    ,allowBlank: true
					   	                	    ,buttonOnly: true
					   	                	    ,margin: '0 0 0 8'
					   	                	    ,name: 'sourceFile'
					   	                	    ,id: 'sourceFile'
					   	                	    ,listeners: {
					   	                	         change:  iconfileChange,
					   	                	    	 afterrender:  renderFileControl
					   	                	    }
	                        	         }]
	                        	   },{//用户类型选择
	                   	        	 	xtype: 'combo',
	                	        	 	margin: '0 0 0 10',
	                	        	 	fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('type'),
	                	        	    store: states,
	                	        	    queryMode: 'local',
	                	        	    displayField: 'name',
	                	        	    valueField: 'abbr',
	                	        	    allowBlank: !AUTH.type,
	                	        	    //value: 4,
	                	        	    hidden: !AUTH.type,
	                	        	    editable : false,
	                	        	    name: 'userType',
	                	        	    id: 'userType',
	                	        	    width: 270 ,
	                	        	    //暂时注释，当需要公司、平台分类可用
	                	        	    listeners:{
	                	        	    	change:  function($this, newValue, oldValue, eOpts){
	                	        	    		companyid = "";
	                	        	    		if(userType == 0){
	                	        	    			if(newValue==3 || newValue==2){
	                	        	    				Ext.getCmp("allot").show();
	                	        	    			}else{
	                	        	    				Ext.getCmp("allot").hide();
	                	        	    			}
	                	        	    		}else if(userType == 1){
	                	        	    			if(newValue==3){
	                	        	    				Ext.getCmp("allot").show();
	                	        	    			}else{
	                	        	    				Ext.getCmp("allot").hide();
	                	        	    			}
	                	        	    		}
		                	        	    }
	                	        	    }
	                        	   },{
	                        		     id:'uid'
	                        		    ,name: 'userId'
	                        		    ,allowBlank: true
	                        		    ,inputType: 'hidden'
	                        	   },{
	                        		     fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('username')
	                        		    ,vtype: 'alphanum'
	                        		    ,name: 'userName'
	                        		    ,maxLength: 50
	                        	   }
	                        	   ,{
	                        		     fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('nickname')
	                        		     ,name: 'nickName'
	                        		     ,maxLength: 80 	 
	                        	   }
	                        	   ,{
	                        		     fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('password')
	                        		     ,inputType: 'password'
		                        		 ,name: 'userPwd'
		                        		 ,id: 'userFirstPwd'
		                        		 ,confirm: 'userSecondPwd'
			                        	 ,vtype: 'Lnumber'
			                        	 ,emptyText:window.top.getIi18NText('auth_password_tip')
		                        		 ,minLength: 6
						    	    	 ,maxLength: 18
	                        	   }
	                        	   ,{
	                        		     fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('confirmPassword')
	                        		     ,inputType: 'password'
	                        		     ,id: 'userSecondPwd'
	                        		     ,confirm: 'userFirstPwd'
	                        		     ,vtype: 'Lnumber2'
	                        		     ,name: 'userPPwd'
	                        		     ,minLength: 6
	   					    	    	 ,maxLength: 18
	                        	   }
	                        	   ,{
	                        		   fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('password')
                        			   ,name: 'suserPwd'
                    				   ,id: 'suserFirstPwd'
        							   ,emptyText:window.top.getIi18NText('auth_password_tip')
        							   ,minLength: 6
        							   ,maxLength: 18
        							   ,allowBlank: true
        							   ,hidden: true
	                        	   }
	                        	   ,{
	                        		   fieldLabel: '<font color="red"> * </font>'+window.top.getIi18NText('confirmPassword')
                        			   ,id: 'suserSecondPwd'
            						   ,name: 'suserPPwd'
        							   ,minLength: 6
        							   ,maxLength: 18
        							   ,allowBlank: true
        							   ,hidden: true
	                        	   }
	                        	   //, userCombo
	                        	   ,{
	                        		     fieldLabel:window.top.getIi18NText('Tel')
	                        		     ,name: 'userTel'
	                        		     ,maxLength: 15
	                        		     ,allowBlank: true
	                        		     ,regex : /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/ 
	                        		     ,regexText : window.top.getIi18NText('TelFormatTip')
	                        		     ,hidden: (local == 'noads_konka')
	                        	   }
	                        	   ,{
	                        		     fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText('phone')
	                        		     ,name: 'userPhone'
	                        		     ,maxLength: 15
	                        		     ,allowBlank: !konka_phone
	                        		     ,disabled: !konka_phone
	                        		     ,regex : /^1(3|4|5|7|8)\d{9}$/ 
	                        		     ,regexText : window.top.getIi18NText('phoneTips')
	                        		     ,hidden: (local != 'noads_konka') // 康佳版本开放
	                        	   }
	                        	   ,{
	                        		     fieldLabel:'<font color="red"> * </font>'+window.top.getIi18NText('userLoginIp')
	                        		     ,name: 'userIP'
	                        		     ,width: 260
	                        		     ,labelWidth: isEng == true ?60:70
	                        		     ,maxLength: 15
	                        		     ,allowBlank: !konka_ip
	                        		     ,disabled: !konka_ip
	                        		     ,regex : /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/ 
	                        		     ,regexText : window.top.getIi18NText('ipTips')
	                        		     ,hidden: (local != 'noads_konka') // 康佳版本开放
	                        	   }
	                        	   ,{
	                        		     fieldLabel: window.top.getIi18NText('email')
	                        		    ,vtype: 'email'
	                        		    ,name: 'userEmail'
	                        		    ,allowBlank: true
	                        		    ,hidden:true
	                        		    ,maxLength: 100
	                        	   }
	                        	   ,{
	                        		   fieldLabel: window.top.getIi18NText('restTime')
                        			   ,name: 'restTime'
                    				   ,id: 'restTime'
                    				   ,allowBlank: true
                    				   ,maxLength: 100
                    				   ,hidden: true
	                        	   }
	                        	   ,{
	                        		     xtype: 'textarea'
	                        		     ,fieldLabel: window.top.getIi18NText('remarks')
	                        		     ,height: 25
	                        		     ,name: 'userRemark'
	                        		     ,allowBlank: true
	                        		     ,maxLength: 200
	                        	   }
	                        	   ,{
	                        		   	//更新用户时的授权类型
				    	                 xtype: 'combo'
				    	                ,fieldLabel: window.top.getIi18NText('jsp_authType')
				    	                ,editable: false
				    	                ,id: 'autypebo'
	                        	   		,store: [ [1,getIi18NText('shareduth')],[2, getIi18NText('indDistr')]]
									    ,queryMode: 'local'
									    ,displayField: 'name'
									    ,valueField: 'value'
									    ,value: 1
									    ,hidden: !AUTH["aloneAssign"] || (local == 'noads_konka')
									    ,listeners: {
									    	change:  function($this, newValue, oldValue, eOpts){
											if(oldValue == 2){
												generation = 1;
												Ext.getCmp('authpan').hide();
												Ext.getCmp('authpan1').hide();
											}
											if(newValue == 2){
												generation = 2;
												Ext.getCmp('authpan').show();
												Ext.getCmp('authpan1').show();
											}
										}
									 }
				    	              },
		           					{
				    	            	//独立分配选项值
										xtype: 'panel'
										,width: "100%"
										,height: 30
										,border: false
										,id:'authpan'
										,hidden:true
										,layout: {type: 'hbox', align:'left',pack:'center'}
					    	            ,defaults: {labelAlign: 'right',width: 260,labelWidth: 60,xtype: 'textfield', labelCls: 'labelCls',fieldBodyCls: 'fieldBodyCls',
	                           	         baseCls: 'baseBodyCls',enforceMaxLength: true,allowBlank: false,validateOnChange:false}
										,items: [	{
			                        	        xtype: 'numberfield',
			                        	        fieldLabel: window.top.getIi18NText('jsp_activeAuth'),
			                        	        id:'acau',
			                        	        value: 0,
			                        	        editable : false,
			                        	        maxValue: 0,
			                        	        width: "35%",
			                        	        minValue: 0,
			                        	        negativeText:window.top.getIi18NText('negativeTips'),
												listeners: {
											    	change:  function($this, newValue, oldValue, eOpts){
											    		if(newValue>0){
//											    			acauChangeValue = true;
											    			generation = 2;
											    		}else{
//											    			acauChangeValue = false;
											    		}
													}
												 }
		                        	    	},{
		                        	    		 id:'siau',
			                        	        xtype: 'numberfield',
			                        	        fieldLabel: window.top.getIi18NText('jsp_ordinaryAuth'),
			                        	        editable : false,
			                        	        value: 0,
			                        	        maxValue: 0,
			                        	        width: "35%",
			                        	        negativeText:window.top.getIi18NText('negativeTips'),
			                        	        minValue: 0,
												listeners: {
											    	change:  function($this, newValue, oldValue, eOpts){
											    		if(newValue>0){
//											    			siauChangeValue = true;
											    			generation = 2;
											    		}else{											    			
//											    			siauChangeValue = false;
											    		}
													}
												 }
			                        	    }]

									}
									,
		           					{
				    	            	//独立分配选项值
										xtype: 'panel'
										,width: "100%"
										,height: 30
										,border: false
										,id:'authpan1'
										,hidden:true
										,ReadOnly:true
										,layout: {type: 'hbox', align:'left',pack:'center'}
					    	            ,defaults: {labelAlign: 'right',width: 260,labelWidth: 60,xtype: 'textfield', labelCls: 'labelCls',fieldBodyCls: 'fieldBodyCls',
	                           	         baseCls: 'baseBodyCls',enforceMaxLength: true,allowBlank: false,validateOnChange:false}
										,items: [	{
			                        	        xtype: 'numberfield',
			                        	        fieldLabel: window.top.getIi18NText('traceActiveAuth'),
			                        	        id:'acau1',
			                        	        value: 0,
			                        	        editable : false,
			                        	        width: "35%",
			                        	        readOnly:true
		                        	    	},{
		                        	    		 id:'siau1',
			                        	        xtype: 'numberfield',
			                        	        fieldLabel: window.top.getIi18NText('traceSimpleAuth'),
			                        	        editable : false,
			                        	        value: 0,
			                        	        width: "35%",
			                        	        readOnly:true
			                        	    }]

									}
									,{
										xtype: 'panel'
										,width: "100%"
										,border: false
										,id:'capacityPanel'
										,hidden: !cap
										,layout: {type: 'vbox', align:'center',pack:'center'}
					    	            ,defaults: {labelAlign: 'right',xtype: 'textfield', labelCls: 'labelCls',fieldBodyCls: 'fieldBodyCls',
	                           	         baseCls: 'baseBodyCls',enforceMaxLength: true,allowBlank: true,validateOnChange:false}
										,items: [{
						    	                 xtype: 'combo'
						    	                ,fieldLabel: getIi18NText('capacityType')
						    	                ,width: 260,labelWidth: 60
			                        	        ,id:'capacityType'
						    	                ,editable: false
			                        	   		,store: [ [1,getIi18NText('sharedCapacity')],[2, getIi18NText('selfCapacity')]]
											    ,queryMode: 'local'
											    ,value: 1
											    ,listeners: {
											    	change:  function($this, newValue, oldValue, eOpts){
											    		if (newValue == 2) {
											    			Ext.getCmp("totalCapacity").setMaxValue(maxValueLimit);
											    			Ext.getCmp("totalCapacity").setMinValue(minValueLimit);
	    		 											
											    			Ext.getCmp('capacityPanel1').show();
											    			Ext.getCmp('capacityPanel2').show();
											    		} else {
											    			Ext.getCmp("totalCapacity").setMaxValue(900000000);
											    			Ext.getCmp("totalCapacity").setMinValue(0);
											    			
											    			Ext.getCmp('capacityPanel1').hide();
											    			Ext.getCmp('capacityPanel2').hide();
											    		}
											    	}
												 }
				    	               		},{
												xtype: 'panel'
												,width: "100%"
												,border: false
				                        	    ,hidden:true
												,id: 'capacityPanel1'
												,layout:'column'
												,defaults: {labelAlign: 'right'}
												,items:[{
				                        	        xtype: 'numberfield',
				                        	        fieldLabel: getIi18NText('totalCapacity'),
				                        	        value: 0,
				                        	        width: 230,
				                        	        labelWidth: 60,
													margin:'0 0 0 53',
				                        	        id:'totalCapacity',
				                        	        maxValue: 900000000,
				                        	        minValue: 0,
				                        	        negativeText:window.top.getIi18NText('capacityTips')
				                        	 	},{	
					                        	 	xtype: 'displayfield',
							            		    fieldLabel: '<font style="color:red">MB</font>',
							            		    width:30,
							            		    labelWidth:30,
							            		    labelSeparator: '' 
												}]
				    	               		},{
												xtype: 'panel'
												,width: "100%"
												,id: 'capacityPanel2'
												,border: false
				                        	    ,hidden:true
												,layout:'column'
												,defaults: {labelAlign: 'right',allowBlank: true}
												,items:[{
				                        	        xtype: 'numberfield',
				                        	        fieldLabel: getIi18NText('usedCapacity'),
				                        	        readOnly:true,
				                        	        width: 230,
													margin:'2 0 0 53',
				                        	        labelWidth: isEng?60:70,
				                        	        id:'usedCapacity',
				                        	        value: 0,
				                        	        negativeText:window.top.getIi18NText('capacityTips'),
				                        	        minValue: 0
					                        	 },{
					                        	 	xtype: 'displayfield',
							            		    fieldLabel: '<font style="color:red">MB</font>',
							            		    width:30,
							            		    labelWidth:30,
							            		    labelSeparator: '' 
				                        	 }]
				    	               		}]
									}
									]
	                         },
	                         {
	                        	   xtype: 'panel'
	                        	  ,flex: 1
	                        	  ,height: '100%'
	                        	  ,layout: {type: 'vbox', align: 'center'}
	                              ,border: false
	                        	  ,items: [gridRolepanel,{
			                     		       xtype: 'panel'
			                     		      ,height: 30
			                     		      ,border: false
			                     		      ,width: '100%'
			                     		      ,layout: {type: 'hbox',pack: 'end'}
			                     		      ,items: [/*{
			           					           xtype: 'displayfield'
			              					       ,minWidth: 40
			              					       ,baseCls: 'choiceDisplayfield'
			              					       ,id: 'choiceTotalRows'
			              					       ,fieldLabel: window.top.getIi18NText('choose')
			              					       ,labelWidth: 30
			              					       ,value: 0
			              				         },{
			              				           xtype: 'displayfield'
			              				           ,baseCls: 'choiceDisplayfield'
			              				           ,minWidth: 40
			              				           ,labelWidth: 7
			              				           ,id: 'totalTabRows'
			              				           ,labelSeparator: ''
			              				           ,fieldLabel: '&nbsp;/ '
			              				           ,value: 3   
			              				         },*/
			                     		         
		                     		             {//临时账号延期
			          	                	        xtype: 'button', id:"delay", text: window.top.getIi18NText('delay'), width: 70, iconCls: 'pback_reset_IconCls',
			          	                	        handler: function(){constrainedWin.show()},margin: '0 5 0 0',hidden: true
				            	                 },{//分配用户
			          	                	        xtype: 'button', id:"allot", text: window.top.getIi18NText('allotUser'), width: 110, iconCls: 'pback_reset_IconCls',
			          	                	        handler: function(){allotUser()},margin: '0 5 0 0',hidden: true
				            	                 },{//密码重置
			          	                	        xtype: 'button', id:"rssetButton", text: window.top.getIi18NText('resetpassword'), width: 110, 
			          	                	        iconCls: 'pback_reset_IconCls', handler: function(){resetPassword()},margin: '0 5 0 0'
			            	                     },{//保存
			          	                	        xtype: 'button',id:"saveUserButton", text: window.top.getIi18NText('save'), width: 80, iconCls: 'pback_finish_IconCls',formBind:true, 
			          	                	        handler: function(btn){addUserHandler(btn,gid);}
			            	                     },{//取消
			            	                	    xtype: 'button', text: window.top.getIi18NText('cancel'), width: 80, iconCls: 'pback_reset_IconCls',
			            	                	    handler: cancelWinFn,margin: '0 2 0 5'
			            	                  }]
                     	             }]
	                         }]	
	                         
	                  },constrainedWin = Ext.create('Ext.Window', {		//延期窗口
	                      title: window.top.getIi18NText('delay'),
	                      width: 250,
	                      height: 140,
	                      constrain: true,
	                      resizable:false,
	                      closeAction: 'hide',
	                      hidden: true,
	                      layout: 'fit',
	                      items: [{
    						   xtype:'panel',
    						   border: false,
    						   header: false,
    						   layout: 'hbox',
    						   margin: '15 0 0 0',
    						   defaults: { xtype: 'displayfield', labelWidth: 60, width: '100%', labelAlign: 'right'},
    						   items:[{
    							   xtype:'displayfield',
    							   value: getIi18NText('delayDaty')+"：",
    							   labelAlign: 'right',
    							   margin: '0 0 0 15',
    							   width:(getIi18NText('confirm') == "OK") ? 120:65,
    									   labelSeparator: '：'
    						   },{
    							   xtype:'numberfield',
    							   width:100,
    							   allowBland:false,
    							   name:'relay_day',
    							   id:'relay_day',
    							   allowDecimals:false,
    							   minValue:1,
    							   value:7,
    							   maxValue:30,
    							   margin:'0 0 0 15'
    						   },{
    							   xtype:'displayfield',
    							   labelWidth:80,
    							   value:'<font style="color:#5AA4DF">'+getIi18NText('day')+'</font>',
    							   margin:'0 0 0 10'
    						   }]
    					   }],
    					   bbar:["->",{
							  xtype : 'button',
							  text : window.top.getIi18NText('save'),
							  margin : '0 20 0 0',
							  width : 80,
							  border: false,
							  height : 30,
							  iconCls : 'pback_finish_IconCls',
							  handler: function(){delayTime(currClickId)}
						  }]
	                  })]
        }).show(btn);
	    if(userType == 4){
	    	Ext.getCmp('userType').setValue(4);
	    	Ext.getCmp('userType').hide();
	    }else if(userType == 2){
	    	Ext.getCmp('userType').setValue(3);
	    	Ext.getCmp('userType').show();
	    }
	    Ext.getCmp('rssetButton').hide();
	}
     
     //获取所有角色信息，给用户勾选
     function getGridRolepanel(id){
    	 roleAjaxProxy =  getAjaxProxy({url: 'auth!allRoles.action'});
		  //id,name,remark,author,updateDate
		 gridRolepanel =  Ext.create('Ext.grid.Panel',{
				                 xtype: 'grid'
				     			,autoRender:true
					            ,width: '100%'
					            ,flex: 1
					            ,title: window.top.getIi18NText('rolesList'),
							    iconCls: 'tabIconCss',
							    frame: false,
							    selType: 'checkboxmodel',
							    cls: 'childContentCls',
							    scrollDelta: 50,
							    selModel :{ 
						  	               mode: 'MULTI'
							    		, allowDeselect: false
							    		, showHeaderCheckbox : true
							    		, enableKeyNav: false
							    		, ignoreRightMouseSelection:true
							    		},
							    store: Ext.create('Ext.data.Store', {
										        fields: ['id','name','remark','updateDate','createUser'],
								                buffered: false
								     	       ,pageSize: 9999
								     	       ,leadingBufferZone: 50
								     	       ,proxy: roleAjaxProxy
								     	       ,autoLoad: true
								     	       ,listeners: {
								     	    	    load:function($this){
								     	    	    	 bolRoleComplete = true;
								     	    	    	 this.sort('updateDate','DESC');
								     	    	    	// Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
								     	    	    }
								     	       } 
							    }),
							    columns: [
							        { text: window.top.getIi18NText('No'), width: 50 , xtype: 'rownumberer', align: 'center'},
							        { text: window.top.getIi18NText('roleName'), dataIndex: 'name', minWidth:70},
								    { text: window.top.getIi18NText('createUser'), dataIndex: 'createUser', minWidth: 70},
							        { text: window.top.getIi18NText('remarks'), dataIndex: 'remark', minWidth: 70, flex: 1}
							    ],
							    margin: 1
							   ,tools:[{
									    xtype:'button',
									    tooltip: window.top.getIi18NText('roleTip01'),
									    tooltipType: 'title',
							            text: window.top.getIi18NText('addrole'),
							            border: false,
							            iconCls: 'addIconCss',
							            margin: '0 5 0 0',
							            handler: goAddRoleEvent
							       },{
									    xtype:'button',
									    tooltip: window.top.getIi18NText('roleTip04'),
									    tooltipType: 'title',
							            text: window.top.getIi18NText('refresh'),
							            border: false,
							            iconCls: 'refreshIconCss',
							            handler: refresbRoleEvent
								    }
							   ]
							  ,listeners: {
								  selectionchange: roleSelectionEvent
								  ,beforedeselect: function(T,r){
									  if(!hideRolePanel&&currClickId&&parseInt(currClickId)>0) return false ;
									  else if(!hideRolePanel&&!(currClickId&&parseInt(currClickId)>0)) return true ;
									  else return hideRolePanel;
								  }
								  ,beforeselect: function(T,r){
									  if(!hideRolePanel&&currClickId&&parseInt(currClickId)>0) return false ;
									  else if(!hideRolePanel&&!(currClickId&&parseInt(currClickId)>0)) return true ;
									  else return hideRolePanel;
								  }
							  }
	  
		 });
     }
     
     //更换头像时获取头像信息
     function getIconCombo(){   	
    	 var states = Ext.create('Ext.data.Store', {
			fields: ['name', 'src'],
			data : iconArray
		 });
    	  return  {
		            xtype: 'combo',
					store: states,
					allowBlank: true,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'name',
					baseCls: 'iconComboboxCls',
					name: 'iconName',
					width: 88,
					height: 64,
					tpl:  new Ext.XTemplate(
					        '<div id="iconComboboxDiv">',
					        '<tpl for=".">',
	                        '<div class="comboDiv" style="text-align: center; vertical-align: middle" title="{name}">'
					             +'<input value="{name}" type="hidden"/><img src="{src}" width="64px" height="64px"/></div>',
							'</tpl>',
							'</div>'
						  ),
					editable: false,
					changeToImg: function(combo,obj){
						  extFileRegistId = combo.id+"-inputEl";
	                      var divDom = combo.el.getById(extFileRegistId,true);
						  divDom.outerHTML ='<image src="'+obj.get("src")+'" width="64px" height="64px" id="'+extFileRegistId+'"/>';
						  
                          combo.setValue(obj.get(combo.valueField));
					},
					initDefault: function(){
						this.changeToImg(this, this.getStore().findRecord(this.displayField,iconArray[0][this.valueField]));
					},
					listeners: {
					   afterrender: function(){
					        var comboStore = this.getStore();
							if(comboStore.getCount()>0){
							     var value = this.getValue();
	                             var modal = comboStore.getAt(0);
								 var valueField =  this.valueField;
								 if(value){
								     comboStore.each(function(r){
									  	   if(r.get(valueField) == value){
										        modal = r;
	                                            return false;
										   }
								    });    
								 }
								 var $this = this;
								 //$this.changeToImg($this, modal);
								 setTimeout(function(){$this.changeToImg($this, modal);},500);
							}
					   },
					   expand: function(){
					        if(this.hasRegist) return;
							this.hasRegist = true;
							var $this = this;
							Ext.each(Ext.get('iconComboboxDiv').el.query('.comboDiv'),function(v){
							     v.onmouseover= function(){
							         v.style.backgroundColor="lightblue";
							     };

								 v.onmouseout= function(){
							         v.style.backgroundColor="white";
							     };

	                             v.onclick=function(){
									 var modal = $this.getStore().findRecord($this.valueField, v.firstElementChild.value);
									 $this.changeToImg($this, modal);
								 };
							});
					   }
					}
					,rowspan: 2
		};
     }
     
     function getPUserCombo(){
    	 
    	 //获取上一级用户
    	 var puserProxyAjax = getAjaxProxy({url: 'auth!allUsers.action'});
    	 puserStore = Ext.create('Ext.data.Store', {
				        fields: ['id','name'],
		                buffered: false
		     	       ,pageSize: 20
		     	       ,leadingBufferZone: 50
		     	       ,proxy: puserProxyAjax
		     	       ,autoLoad: true
          });
		  //id,name,userName,imgsrc,pName,roleName,author,updateDate
    	  return  {
		            xtype: 'combo',
		            fieldLabel: '<font color="red"> * </font>'+getIi18NText('superior'),
					store: puserStore,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					name: 'userPuser',
					editable: false
		 };
     }
     //重置用户的密码为123456
     function resetPassword(){
    	 var gid = Ext.getCmp('uid').getValue();
    	 
    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', msg:getIi18NText('suerresetpassword')
			 , plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('confirm'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.Ajax.request({
					     url: 'auth!modifypass.action'
					    ,params: {i: gid}
				   		,async: false
				        ,method: 'post'
			        	,callback: function(opt, success, response){
				        	  var result = showResult(success,response);
				        	  if(result == false) return;
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('success')+'</font>');
				        }
				   });
				   Ext.Ajax.request({
					   	url: 'auth!getSingleUser.action'
				   		,params: {i: gid}
				   		,callback: showEditUserCallback
				   });
			   }
		 }});
     }
   //刷新子用户数据
 	 refreshTerminalGroup = function(){
		 groupSelected.getStore().load() ;
		 flatSelected.getStore().load() ;
	};
	//在分配用户前需要加载的一些信息
	function refreshData(newValue){
		//超级管理员
		 if(userType == 0){
			 //给公司分配平台
			 if(newValue==2){
				 flatSelected.getStore().load({params:{type:1}});
				 groupSelected.getStore().load({params:{type:1}});
				 showPanel(2);
			 }else if(newValue==3){//给员工分配公司
				 groupSelected.getStore().load({params:{type:3}});
				 flatSelected.getStore().load({params:{type:3}});
				 showPanel(1);
			 }
		 }else if(userType == 1){//平台管理员
			 //给员工分配公司
			 flatSelected.getStore().load({params:{type:2}});
			 groupSelected.getStore().load({params:{type:2}});
			 showPanel(1);
		 }
	}
     //给新建用户分配公司或平台
     function allotUser(){
    	 var newValue = Ext.getCmp("userType").getValue();
    	
    	
    	 allotPanel=Ext.getCmp('allotPanel');
 		 if(allotPanel && allotPanel.isWindow){
 			refreshData(newValue);
 			allotPanel.show();
			return;
		 }else{
			//超级管理员
			 if(userType == 0){
				 //给公司分配平台
				 if(newValue==2){
					 groupSelectedProxy = getAjaxProxy({url:'auth!getcom.action', extraParams: {type: 1}});
				 }else if(newValue==3){//给员工分配公司
					 groupSelectedProxy = getAjaxProxy({url:'auth!getcom.action', extraParams: {type: 3}});
				 }
			 }else if(userType == 1){//平台管理员
				 //给员工分配公司
				 groupSelectedProxy = getAjaxProxy({url:'auth!getcom.action', extraParams: {type: 2}});
			 }
			 //单选公司
	    	 groupSelected=Ext.create('Ext.grid.Panel', {
				 store: Ext.create('Ext.data.Store', {
					      fields:['id','name'],
			              pageSize: Number("0x7fffffff"),//未分页，防止显示不全
						  proxy: groupSelectedProxy
						  ,buffered: false
				          ,autoLoad: true
				          ,listeners: {
				        	  load:function($this){
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
				           { text: window.top.getIi18NText('allotcompany'),  dataIndex: 'name', flex: 1, menuDisabled: true, draggable: false }
				  ],
	             height: 100,
	             minWidth: 200,
	             width: '100%'
	    	 });
	    	 //多选平台
	    	 flatSelected=Ext.create('Ext.grid.Panel', {
	    		 store: Ext.create('Ext.data.Store', {
	    			 fields:['id','name'],
	    			 pageSize: Number("0x7fffffff"),//未分页，防止显示不全
	    			 proxy: groupSelectedProxy
	    			 ,buffered: false
	    			 ,autoLoad: true
	    			 ,listeners: {
	    				 load:function($this){
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
	    		           { text: window.top.getIi18NText('allotcompany'),  dataIndex: 'name', flex: 1, menuDisabled: true, draggable: false }
	    		           ],
	    		           height: 100,
	    		           minWidth: 200,
	    		           width: '100%'
	    	 });
	    	 
	    	 allotPanel =Ext.create('Ext.window.Window',{
				 title: window.top.getIi18NText('allotpanel')
				 ,id:"allotPanel"
				 ,plain: true
				 ,width: 340
				 ,height: 300
				 ,minWidth: 300
				 ,maximizable: true
				 ,minHeight: 200
				 ,border: false
				 ,modal: true
				 ,constrain: true
				 ,closeAction: 'destroy'
				 ,listeners: {
					 beforeclose: function(){},
	    	 		 hide:function(){}
				 }
			 	 ,layout: 'fit'
				 ,items:[{
					 xtype: 'panel'
					,layout: {type:'hbox', align: 'middle',pack:'center'}
				 	,width: '100%', height: '100%'
					,border: false
					,defaults: { width: '38%', height: '100%', margin: '2 2 5 2', xtype: 'fieldset',minWidth:230,layout: 'fit'}
					,items: [{
						 title: '<strong>'+getIi18NText('allottocompany')+' &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" onclick="refreshTerminalGroup();">'
						        +getIi18NText('refresh')+'</a></strong>'
						 ,items: [groupSelected]
						 ,id: 'singlepanel'
					 },{
						 title: '<strong>'+getIi18NText('allottoflat')+' &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" onclick="refreshTerminalGroup();">'
						        +getIi18NText('refresh')+'</a></strong>'
						 ,items: [flatSelected]
					     ,id: 'multipanel'
					 },{
						 xtype: 'panel'
						 ,width: 40
						 ,minWidth: 80
						 ,border: false
						 ,layout: {type: 'vbox', align:'center',pack:'center'}
					 	 ,items: [{ 
								 xtype: 'button'
								 ,width:50
								 ,height:30
								 ,text: getIi18NText('confirm')
								 ,id:'activeBtn'
							     ,handler: saveDistribution
							 },{
								 xtype: 'button'
								 ,width:50
								 ,height:30
								 ,margin:'20 0 0 0'
								 ,id:'simpleBtn' 
								 ,text: getIi18NText('jsp_close')
								 ,handler: function(){
									 companyid = "";
									 allotPanel.hide();
								 }
						 }]
					 }]
				 }]
			 });
	    	 refreshData(newValue);
	    	 allotPanel.show();
		 }
     }
     //给临时用户延长使用时间
     function delayTime(usid){
    	 var num = Ext.getCmp("relay_day").getValue();
    	 Ext.Ajax.request({
		     url: 'auth!addUseDay.action'
	    	,params: {days: num,userid:usid}
	        ,method: 'post'
	        ,async:false
	        ,callback: function(opt, success, res) {
  	   			 var result = showResult(success,res);
		      	 if(result.code==0){
		      		Ext.getCmp("relay_day").setValue(7);
		      		constrainedWin.hide();
		      		Ext.Ajax.request({
				    	   url: 'auth!getSingleUser.action'
				    	  ,params: {i: usid}
				    	  ,callback: showEditUserCallback
				    });
		      		Ext.example.msg(window.top.getIi18NText('operationTips'), getIi18NText('success'));
	         	}else{
	         		Ext.example.msg(window.top.getIi18NText('operationTips'), getIi18NText('fail'));
	         	}
    	 	}
    	 });
     }
     
     
     //编辑用户信息
     function showEditUserCallback(opt, success, res){	//TODO
		      rolesResult = showResult(success,res);
		      if(generation == 1){
		    	  Ext.getCmp('authpan').hide();	//隐藏可选择点数
		      }else{
		    	  Ext.getCmp('authpan').show();	
		      }
		   	  if(rolesResult == false) return; 
		 
		   	  
		   	  //若编辑的用户是当前登录的用户，则隐藏重置密码按钮
		   	  if(rolesResult["isself"]){
		   		  Ext.getCmp('rssetButton').hide();
		   	  }else{ 
		   		  Ext.getCmp('rssetButton').show();
		   	  }		
		   	  
		   	  
		   	 delayCall(100,function(){
	    		 return bolRoleComplete;
	    	 },function(){
	    		 //form
	    		 var form = userWind.down('form');
	    		 form.down('field[name="userId"]').setValue(rolesResult["uid"]);
	    		 form.down('field[name="nickName"]').setValue(rolesResult["name"]);
	    		 
	    		 var fieldPwd = form.down('field[name="userType"]');
	    		 if(rolesResult["uid"]==1){
	    			 fieldPwd.setValue(window.top.getIi18NText('superuser')).setReadOnly(true);
	        	 }else if(rolesResult["userType"]==1){
	        		 fieldPwd.setValue(window.top.getIi18NText('platformuser')).setReadOnly(true);
	        	 }else if(rolesResult["userType"]==2){
	        		 fieldPwd.setValue(window.top.getIi18NText('companyuser')).setReadOnly(true);
	        	 }else if(rolesResult["userType"]==3){
	        		 fieldPwd.setValue(window.top.getIi18NText('employeesuser')).setReadOnly(true);
	        	 }else if(rolesResult["userType"]==5){
	        		 fieldPwd.setValue(window.top.getIi18NText('tempuser')).setReadOnly(true);
	        	 }else{
	        		 fieldPwd.setValue(window.top.getIi18NText('averageuser')).setReadOnly(true);
	        	 }
	    		 fieldPwd.getEl().setOpacity(0.3);
	    		 //临时用户显示密码
	    		 if(rolesResult["userType"]==5 && loginid == 1){
	    			 Ext.getCmp("userFirstPwd").hide();
	    			 Ext.getCmp("userSecondPwd").hide();
	    			 Ext.getCmp("suserFirstPwd").show();
	    			 Ext.getCmp("suserSecondPwd").show();
	    			 Ext.getCmp("restTime").show();
	    			 Ext.getCmp("delay").show();
	    			 var fieldPwd = form.down('field[name="suserPwd"]');
	    			 fieldPwd.setValue(rolesResult["userpwd"]).setReadOnly(true);
	    			 fieldPwd.getEl().setOpacity(0.3);
	    			 
	    			 var field_Pwd = form.down('field[name="suserPPwd"]');
	    			 field_Pwd.setValue(rolesResult["userpwd"]).setReadOnly(true);
	    			 field_Pwd.getEl().setOpacity(0.3);
	    			 
	    			 var field_Pwd = form.down('field[name="restTime"]');
	    			 field_Pwd.setValue(rolesResult["restDay"]+getIi18NText('tian')+rolesResult["restHour"]+getIi18NText('xiaoshi')).setReadOnly(true);
	    		 }else{
	    			 Ext.getCmp("userFirstPwd").show();
	    			 Ext.getCmp("userSecondPwd").show();
	    			 Ext.getCmp("suserFirstPwd").hide();
	    			 Ext.getCmp("suserSecondPwd").hide();
	    			 Ext.getCmp("restTime").hide();
	    			 Ext.getCmp("delay").hide();
	    		 }
	    		 var fieldPwd = form.down('field[name="userPwd"]');
	    		 fieldPwd.setValue("123456").setReadOnly(true);
	    		 fieldPwd.getEl().setOpacity(0.3);
	    		 
	    		 var field_Pwd = form.down('field[name="userPPwd"]');
	    		 field_Pwd.setValue("123456").setReadOnly(true);
	    		 field_Pwd.getEl().setOpacity(0.3);
	    		 
	    		 var field_name = form.down('field[name="userName"]');
	    		 field_name.setValue(rolesResult["uname"]).setReadOnly(true);
	    		 field_name.getEl().setOpacity(0.3);
					
				 // 将用户相关信息存到变量中	    		 
	    		 loginUserCapacityInfo = rolesResult;
	    		 
	    		 if (cap) {//版本限制
	    			 
	    		 	if (rolesResult["capacityStatus"] == true) {//开启了容量配置
	    		 		capacityStatus = true;
	    		 		//console.log('修改用户，准备修改容量信息',rolesResult);
	    		 		
	    		 		Ext.getCmp("capacityType").show();
	    		 		var uct = 1;
	    		 		if(rolesResult["uct"])
	    		 		uct = rolesResult["uct"];
	    		 		
	    		 		Ext.getCmp("capacityType").setValue(uct);
	    		 		Ext.getCmp("totalCapacity").setValue(rolesResult["utc"]);
	    		 		// 规避已使用容量大于总容量的问题
	    		 		var usedCapacity = rolesResult["ufc"] > rolesResult["utc"] ? rolesResult["utc"]:rolesResult["ufc"];
	    		 		Ext.getCmp("usedCapacity").setValue(usedCapacity);
	    		 		//console.log('max',rolesResult["maxtc"],'min',rolesResult["ufc"]);
	    		 		// 设置最大最小值
	    		 		maxValueLimit = rolesResult["maxtc"];
	    		 		minValueLimit = rolesResult["mintc"];
	    		 		if(2 == rolesResult["uct"]){
		    		 		Ext.getCmp("totalCapacity").setMaxValue(rolesResult["maxtc"]);
				    		Ext.getCmp("totalCapacity").setMinValue(rolesResult["mintc"]);
	    		 		}
			    		
			    		Ext.getCmp("capacityType").setReadOnly(false);
			    		Ext.getCmp("capacityType").getEl().setOpacity(1);
			        	Ext.getCmp("totalCapacity").setReadOnly(false);
			        	Ext.getCmp("totalCapacity").getEl().setOpacity(1);
			        	// 自己不能修改自己
			    		if(rolesResult["isself"]){
			    			Ext.getCmp("capacityType").setReadOnly(true);
				        	Ext.getCmp("capacityType").getEl().setOpacity(0.5);
				        	Ext.getCmp("totalCapacity").setReadOnly(true);
				        	Ext.getCmp("totalCapacity").getEl().setOpacity(0.5);
			    		}
	    		 	} else {
	    		 		Ext.getCmp("capacityType").hide();
	    		 	}
	    		 }
	    		 //设置授权的上限 修改用户
	    		 Ext.getCmp("acau").setMaxValue(rolesResult["activeAuthNum"]);
	        	 Ext.getCmp("siau").setMaxValue(rolesResult["simpleAuthNum"]);
	    		 Ext.getCmp("acau").setMinValue(rolesResult["activeAuthNumMin"]);
	        	 Ext.getCmp("siau").setMinValue(rolesResult["simpleAuthNumMin"]);
	        	 Ext.getCmp("acau").setValue(rolesResult["tacAu"]);
	        	 Ext.getCmp("siau").setValue(rolesResult["tsiAu"]);
	        	 Ext.getCmp("autypebo").setValue(rolesResult["auNutype"]);
	        	 Ext.getCmp("acau1").setValue(rolesResult["acAu"]);
	        	 Ext.getCmp("siau1").setValue(rolesResult["siAu"]);
	             Ext.getCmp("acau1").getEl().setOpacity(0.5);
	             Ext.getCmp("siau1").getEl().setOpacity(0.5);
	        	 if(rolesResult["isself"]){
	              	 Ext.getCmp("acau").setReadOnly(true);
		        	 Ext.getCmp("siau").setReadOnly(true);
		        	 Ext.getCmp("autypebo").setReadOnly(true);
		        	 Ext.getCmp("acau").getEl().setOpacity(0.3);
		        	 Ext.getCmp("siau").getEl().setOpacity(0.3);
		        	 Ext.getCmp("autypebo").getEl().setOpacity(0.3);
	        	 }else{
	        		 Ext.getCmp("acau").setReadOnly(false);
	        		 Ext.getCmp("siau").setReadOnly(false);
	        		 Ext.getCmp("autypebo").setReadOnly(false);
	        		 Ext.getCmp("acau").getEl().setOpacity(1);
	        		 Ext.getCmp("siau").getEl().setOpacity(1);
	        		 Ext.getCmp("autypebo").getEl().setOpacity(1);
	        	 }
	        	 if(rolesResult["isShare"]=='1'){
		        	 Ext.getCmp("autypebo").setReadOnly(true);
		        	 Ext.getCmp("autypebo").getEl().setOpacity(0.3);
	        	 }
	        	 if(rolesResult["sonIsAlone"]=='2'){
		        	 Ext.getCmp("autypebo").setReadOnly(true);
		        	 Ext.getCmp("autypebo").getEl().setOpacity(0.3);
	        	 }
	        	 
	    		 form.down('field[name="userTel"]').setValue(rolesResult["tel"]);
	    		 // 回显手机号码和登录ip
	    		 form.down('field[name="userPhone"]').setValue(rolesResult["userPhone"]);
	    		 form.down('field[name="userIP"]').setValue(rolesResult["userIP"]);
	    		 //若当前用户是临时用户，不可以修改邮箱
	    		 if(rolesResult["userType"]==5 && loginid == rolesResult["uid"]){
	    			 form.down('field[name="userEmail"]').setValue(rolesResult["email"]).setReadOnly(true);
	    			 form.down('field[name="userEmail"]').getEl().setOpacity(0.3);
	    		 }else{
	    			 form.down('field[name="userEmail"]').setValue(rolesResult["email"]);
	    		 }
	    		 form.down('field[name="userRemark"]').setValue(rolesResult["mark"]);
	    		 //form.down('field[name="userPuser"]').setValue(rolesResult["pid"]);
	    		 //form.down('combo[name="iconName"]').initDefault();
	    		 
	    		 //default choice
	    		
	    		 var selectTerId = rolesResult['rid'].split(',');
	    		 var selection =  gridRolepanel.getSelectionModel();
	    		 
	    		 hideRolePanel = true;
	    		 if(selectTerId instanceof Array && selectTerId.length > 0){
	    			 var store = gridRolepanel.getStore();
	    			 for(var k =0; k < store.getCount(); k++){
	    				 var model = store.getAt(k);	    				 
	    				 if( Ext.Array.contains(selectTerId,""+model.get("id"))){
	    					//TODO 查询该用户下所拥有角色的权限
	    					 selection.select(k, true);
	    				 }else{
	    					 selection.deselect(k, true);
	    				 }
	    			 }
	    			 

	    		 }
	    		 
	    		 var loginId = rolesResult['uid'];
	    		 hideRolePanel = window.top.USERID != loginId ;
	    		 
	    		 log(gridRolepanel.getSize()) ;
//	    		 if(!hideRolePanel){
//	    			 selection.setLocked(true) ;
//	    		 }
	    		 
	    		 //icon
	    		 var iconCombo = form.down('combo[name="iconName"]');
	    		 Ext.Array.each(iconArray, function(item, index, allItems) {
	    			 if (item['name'] == rolesResult['icon']) {
	    				 //iconCombo.change();
	    				 var modal = iconCombo.getStore().findRecord(iconCombo.valueField, item["name"]);
	    				 iconCombo.changeToImg(iconCombo, modal);
	    				 return false;
	    			 }else if(index == iconArray.length-1){
	    				 Ext.get(extFileRegistId).dom.setAttribute("src", rolesResult["src"]);
	    				 iconCombo.setValue(rolesResult['icon']);
	    			 }
	    		 });
	    		 //form.checkChange();
	    		 
	    		 form.getForm().checkValidity(  );
	    		 
	    		 // 将保存按钮置为可点击
	    		 Ext.getCmp('saveUserButton').enable();
	    	 });
		   	  document.getElementById("autypebo-inputEl").readOnly=true;
	    	  document.getElementById("capacityType-inputEl").readOnly=true;
	    	  document.getElementById("userType-inputEl").readOnly=true;
	}
     function saveBindUser(btn,gid){
    	 //1. form
    	 var form = btn.up('form');
    	 if( !form || !form.isValid()) return;
    	 form.getEl().mask(window.top.getIi18NText('sendingData'));
    	 btn.disable();
    	 var oname =Ext.getCmp("onames").getValue();
    	 var od=Ext.getCmp("oid").getValue();
    	 Ext.Ajax.request({
	    	   url: 'auth!saveBindUser.action'
	    	  ,method: 'post' 
	    	  ,params: {id:od,oname:oname}
  		  	  ,timeout:120000
  		  ,failure: function(response, opts) {
  			 form.getEl().unmask();
  			  isFreshing = true;
  			  Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText('timeout'));
  		    }
	    	  ,success: function(response){
	    		  form.getEl().unmask();
	    		  var result =eval('(' + response.responseText + ')');
	    		  if(result.code==0){
	    			  btn.enable();
	    			  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
	    			  bindWind.close();
	    		  }else{
	    			  btn.enable();
	    			  Ext.Msg.alert(getIi18NText('systemMessage'),result.msg);
	    		  }
	    	  }
    	 });
     }
     
     //添加用户相应函数
     function addUserHandler(btn,gid){
    	 //1. form
    	 var form = btn.up('form');
    	 if(!gridRolepanel || !form || !form.isValid()) return;
    	 
    	 //2. roles
    	 var models =gridRolepanel.getSelectionModel().getSelection();
    	 if(models.length == 0){
    		 showTip(btn,window.top.getIi18NText('roleTip03'));
    		 return;
    	 }
    	 //获取用户的创建类型
    	 var newValue = Ext.getCmp("userType").getValue();
    	 if(newValue == 3){
    		 if(userType == 0 || userType == 1){
    			 if(companyid.length<1){
					showTip(btn,window.top.getIi18NText('roleTip08'));
					return;
    			 }
    		 }
    	 }
    	 // 判断是否开启了容量配置，并且当前登录用户能否修改被修改的用户
    	 console.log('change loginUserCapacityInfo -> ',loginUserCapacityInfo);
    	 var ct = Ext.getCmp("capacityType").getValue();
    	 if(cap && capacityStatus && null != loginUserCapacityInfo && ct != loginUserCapacityInfo.uct
    			 && !loginUserCapacityInfo.capaTypeChange 
    			 && !loginUserCapacityInfo.super){
    		 var tipsStr = getIi18NText('capacityTip',loginUserCapacityInfo.userNames);
    		 if (ct == 1) {//共享
    			 tipsStr = getIi18NText('capacityTip2',loginUserCapacityInfo.userNames);
    		 }
    		 showTip(btn,tipsStr);
  			return ;
    	 }
    	 var roleInfo = [];
    	 for(var i=0; i<models.length; i++){
    		 roleInfo.push(models[i].get("id"));
    	 }
    	 
    	 
//    	 var auype=Ext.getCmp("autypebo").getValue();
		 var simn=Ext.getCmp("siau").getValue();
		 var actn=Ext.getCmp("acau").getValue();
		 
		 var tc = 0;
		 if (ct == 2) {//独立
			
			if(null == Ext.getCmp("totalCapacity").getValue() || "" == Ext.getCmp("totalCapacity").getValue()){
				showTip(btn,getIi18NText('requiredOptionTips',getIi18NText('totalCapacity')));
				return ;
			}
		 	tc = Ext.getCmp("totalCapacity").getValue()*1024*1024;
		 }
		 // 显示遮罩，并且按钮不可点击
		 form.getEl().mask(window.top.getIi18NText('sendingData'));
    	 btn.disable();
    	 
    	 var auype=generation;
         var local_uid = form.down('field[name="userId"]').getValue();
    	 //3. sumbit
    	 form.submit({
	    	    url: 'auth!saveUser.action'
	    	   ,params: {rid: roleInfo.join(','),companyid: companyid,auype:auype,actn:actn,simn:simn,ct:ct,tc:tc}
	    	   ,success: function(f, action) {
	    		        form.getEl().unmask();
	    		        
	    		        //reset 
	    		        renderFileControl(form.down('filefield')); 
	    		        var msg = action.result.msg;
	    		        if(action.result.code == 0){
	    		        	Ext.example.msg(window.top.getIi18NText('systemMessage'), msg, function(){
	    		        		   btn.enable();
	    		        		   userWind.close();
	    		        		   if(puserStore) puserStore.reload();
	    		        		   //modify 2018.10.12 只有在修改用户的时候才更新
    		        		       if(!isNull(local_uid)){
	    		        		    	  Ext.Ajax.request({//在index页面同步已经修改的用户信息
		    		                       url: 'auth!synModifyUser.action?id='+local_uid,
		    		                       //params: { id: gid},
		    		                       method: 'GET',
		    		                       callback: function (opt, success, res) {
		    		                    	   var result = showResult(success,res);
		    		                         //  Ext.MessageBox.alert('成功', '从服务端获取结果: ' + response.responseText);
		    		                    	   if(result.same==1){
		    		                    		   var info = window.top.loginInfo ;
		    		                    		   var img = info.down('image') ;
		    		                    		   img.setSrc("images//user//"+result.icon);
		    		                    		   window.top.$("#showUserName").attr("title",result.name).text(subShowStr(result.name,10));
		    		                    	   }
		    		                       }
		    		                   });
    		        		      }
	    		        			  
	    		        		   
	    		        	});
	    		        	return;
	    		        }
	    		        btn.enable();
	    		        var combo = form.down('combo[name="iconName"]');
	    		        //combo.changeToImg(combo, combo.getStore().findRecord(combo.displayField,iconArray[0][combo.valueField]));
	    		        combo.initDefault();
	    		        
	    		        Ext.Msg.alert(window.top.getIi18NText('systemMessage'),msg+"<br/><font color=red>("+window.top.getIi18NText('reChoosePicture')+")</font>");
	    		        
	           },
                failure: function(form, action) {
                	Ext.Msg.alert(getIi18NText('systemMessage'),getIi18NText("loginTimeoutTip01"),function(){
					   window.location.replace("auth!logOffUser.action");
				   });
                }
	    });
    	 
     }
     
     function subShowStr(str,num){
	        var realLength = 0, len = str.length, charCode = -1;
				for (var i = 0; i < len; i++) {
					if(realLength == num){
						return str.substring(0,i)+"..";
					}
					if(realLength > num && num != 0){
						return str.substring(0,i-1)+"..";
					}
					charCode = str.charCodeAt(i);
					if (charCode >= 0 && charCode <= 128) realLength += 1;
					else realLength += 2; 
				}
		   return str;
	 }
     
     function removeUser(v,r,c,i,e,record,row){
		 Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: window.top.getIi18NText('systemMessage'), cls:'msgCls', 
			           msg:window.top.getIi18NText('deleteUserWarming',"<font color=red>"+record.get("name")+"</font>")
			 ,animateTarget: row, plain: true, buttons: Ext.MessageBox.OKCANCEL, buttonText: {ok: getIi18NText('delete'), cancel: getIi18NText('cancel')},
			 fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   gridPanel.getEl().mask(window.top.getIi18NText('deletingUser'));
				   
				   Ext.Ajax.request({
					     url: 'auth!deleteUser.action'
					    ,params: {i: record.get("id")}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  gridPanel.getEl().unmask();
				        	  var result = showResult(success,response);
				        	  if(result == false) return;
				        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('deleteUserSuccessTip'));
				        	  if(puserStore) puserStore.reload();
				        	  queryFun(1);
				        }
				   });
			   }
		 }});
    }
     function shower(v,r,c,i,e,record,row){
    	 Ext.Ajax.request({
    		 url: 'auth!getRigister.action'
		    ,params: {loginId: record.get("id")}
	        ,method: 'post'
	        ,callback: function(opt, success, response){
	        	var result = showResult(success,response);
	        	if(result.code != 0){
	        		Ext.example.msg(window.top.getIi18NText('operationTips'), result.msg);
	        		return;
	        	}
	        	var json = eval('(' + result.msg + ')'); 
	        	if(selfVersion||orderVersion){
	        		Ext.Msg.alert({title:window.top.getIi18NText('registercode'), msg:window.top.getIi18NText("Hregister")+": "+json.hu+"<font color='#02d802'>【"+json.new_hu+"】</font>"});	   
	        	}else{
	        		var mmsg = window.top.getIi18NText("Hregister")+": "+json.hu;
	        		mmsg+="<font color='#02d802'>【"+json.new_hu+"】</font>";
	        		mmsg+="<br/><br/>";
	        		mmsg+=window.top.getIi18NText("Xregister")+": "+json.xin;
	        		mmsg+="<font color='#02d802'>【"+json.new_xin+"】</font>";
	        		
	        		Ext.Msg.alert({title:window.top.getIi18NText('registercode'), msg: mmsg});	        					
	        	}
	        }
    	 });
     }
   function showDoctorCode(v,r,c,i,e,record,row){
    	 Ext.Ajax.request({
    		 url: 'auth!getDoctorCode.action'
		    ,params: {loginId: record.get("id")}
	        ,method: 'post'
	        ,callback: function(opt, success, response){
	        	var result = showResult(success,response);
	        	if(result.code != 0){
	        		Ext.example.msg(window.top.getIi18NText('operationTips'), result.msg);
	        		return;
	        	}
	        	console.log("result.msg->"+result.msg);
//	        	var json = eval('(' + result.msg + ')'); 
	        	var msgBox = Ext.create('Ext.window.MessageBox', {
					width : 100,
					height : 200
				});
				msgBox.alert(getIi18NText('checkUserCode'), getIi18NText('userCode')+": "+result.msg, function(){
					
				});
	        }
    	 });
     }
    function editUser(v,r,c,i,e,record,row){
    	 openAddUserWindow(row, record.get("id"));
    }
    function bindUser(v,r,c,i,e,record,row){
    	openBindUserWindow(row, record.get("id"));
    }
     
     function cancelWinFn(){
    	 userWind.close();
    }  
     function goAddRoleEvent(){
    	 if(parent && parent.switchTabFn){
    		  parent.switchTabFn("rolesTab");
    	 }
     }
     function refresbRoleEvent(){
    	 if(roleAjaxProxy&&gridRolepanel){
    		 gridRolepanel.getSelectionModel().deselectAll();
    		 gridRolepanel.getStore().load({params:{currid:currClickId}});
    	 }
     }
     function roleSelectionEvent($this, selected, eOpts){
    	  //1. show auth
    	 
     	  //2. update num
    	// Ext.getCmp('choiceTotalRows').setValue($this.getCount( ));
    	 
     }
     /////////////edit page  end \\\\\\\\\\\\  
     
    function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
    //显示不同的选择框
    function showPanel(type){
    	if(type == 1){
    		Ext.getCmp("singlepanel").show();
    		Ext.getCmp("multipanel").hide();
    	}else{
    		Ext.getCmp("singlepanel").hide();
    		Ext.getCmp("multipanel").show();
    	}
    }
    //记录要分配的id
    function saveDistribution(){
    	var rows;
    	if(!Ext.getCmp("singlepanel").isHidden()){
    		rows=groupSelected.getSelectionModel().getSelection();
    	}else{
    		rows=flatSelected.getSelectionModel().getSelection();
    	}
    	for(var i=0;i<rows.length;i++){
			 companyid +=  rows[i].get('id')+",";
    	}
    	allotPanel.hide();
    }
	 // *.final
	 // Ext.getBody().unmask();
});
