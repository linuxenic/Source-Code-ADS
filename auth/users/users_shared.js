/** auth shared  */

var authSharedWindow;

var authIds = {
		terRepl:1 , // 设备补货
		saleCount:2 , // 销售统计
		payAccount:3  // 支付账号
};
var authGoodsDomIds = {
		1:'authReplGoods' ,
		2:'authSalesGoods'  
};
var authTerDomIds = {
		1:'authReplTer' ,
		2:'authSalesTer' 
};
var assignOption = {
		3:'authWxPay' ,
		4:'authAliPay' ,
		5:'authJdPay' ,
		6:'authSbPay' 
};
var typeIds = {
		allTer:1 , // 所有售货机
		assignTer:2 , // 指定售货机
		allGoods:1 , // 所有商品
		assignGoods:2 , // 指定商品
		allWxAccount: 1 ,
		allAliAccount: 1 ,
		allJdAccount: 1 ,
		allSbAccount: 1 ,
		assignWxAccount: 2 ,
		assignAliAccount: 2 ,
		assignJdAccount: 2 ,
		assignSbAccount: 2 
};
var maxStrLen = 53;
var timeId;
function optionFn(type,authId) {
	var	html = '<a href="javascript:void(0);" onclick="openOption('+type+','+authId+')" />'+getIi18NText('choose')+'</a>';
	return html;
}
var thisAuthId;
// 商品id集合
var userSharedRecordIds = {};
var recordIds = new Ext.util.MixedCollection();
var uId ;
var isEn = getIi18NText('confirm') == 'OK';
function openAuthSharedWindowow(btn,gid,c,i,e,record,row){
	uId = record.get('id');
	if (window.top.USERID==uId) {
		Ext.Msg.alert(window.top.getIi18NText('systemMessage'),getIi18NText('notUpdThisUser'));
		return;
	}
	 var beforecloseFn = function(){
		          authSharedWindow.hide();
		          var form = authSharedWindow.down('form');
		          form.getForm().reset();
		          form.getForm().clearInvalid( );
     };
     var showFn = function(){
    	     //tab
    	     var tabpanel = Ext.getCmp("authSharedContentTabpanel");
    	     if(tabpanel){
    	    	// tabpanel.setActiveTab(0);
    	    	// tabpanel.down('tabpanel').setActiveTab(0);
    	     }
    	     
    	     //edit
    	     authSharedWindow.setTitle(getIi18NText('authShared'));
    	     var responseData = {};
    		 Ext.Ajax.request({
    		     url: 'auth!getUserAuthShared.action'
    		    ,params: {u:uId}
    	        ,method: 'post'
    	        ,callback: function(opt, success, response){
    	        	responseData = JSON.parse(response.responseText);
    	        	setData(responseData);
    	        }
    	     });
     };
	 if(authSharedWindow && authSharedWindow.isWindow){
		  authSharedWindow.clearListeners( );
		  authSharedWindow.addListener("beforeclose", beforecloseFn);
		  authSharedWindow.addListener("show", showFn);
		  authSharedWindow.show();
		  return;
	 }
	 
	 var tabComp = createAuthSharedTabInfo();
     authSharedWindow=Ext.create('Ext.window.Window',{
				   title: getIi18NText('authShared')
				  ,plain: true
				  ,width: 810
				  ,height: 410
				  ,minWidth: 310
				  ,minHeight: 260
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
                  ,cls: 'shadowBackCls'
                  ,items:[{
                	      xtype: 'form'
                	     ,layout: {type:'vbox', align: 'middle',pack:'center'}
                         ,border: false
                         ,autoScroll: true
                         ,items: [
                            {
                            	   xtype: 'panel'
                    		      ,flex:1
                    		      ,width: '100%'
                    		      ,border: false
                    		      ,layout: 'fit'
                    		      ,items: tabComp
                            },
                            {
                		           xtype: 'panel'
                     		      ,height: 30
                     		      ,border: false
                     		      ,width: '100%'
                     		       ,baseCls: 'topShadowCss'
                     			  ,margin: '3 0 0 0'
                     		      ,layout: {type: 'hbox',pack: 'end',align: 'middle'}
                     		      ,items: [{
          	                	         xtype: 'button',text: window.top.getIi18NText('save'), formBind: true, width: 80, iconCls: 'pback_finish_IconCls', handler: saveAuthInfoFn
            	                     },{
            	                    	 xtype: 'button',text: window.top.getIi18NText('cancel'), margin: '0 2 0 5', width: 80,iconCls: 'pback_reset_IconCls',handler: function(){
            	                    		  authSharedWindow.close();
            	                    	 }
            	                  }]
                     	  }]	
                         
                  }]
    }).show(btn);
}

var jmz = {};
// 获取 字符串真实长度，中文占2个字符
jmz.GetLength = function(str) {
    return str.replace(/[\u0391-\uFFE5]/g,"aa").length;   //先把中文替换成两个字节的英文，在计算长度
};  
/**
 * 设置数据
 * @param objData
 */
function setData(objData) {
	var dataArr = objData.data;
	Ext.getCmp('replEnable').setValue({'auth':false});
	Ext.getCmp('salesEnable').setValue({'auth':false});
	Ext.getCmp('accountEnable').setValue({'auth':false});
	// 默认禁用所有
	var checkboxgp = Ext.getCmp('authSharedContentTabpanel').query('checkbox[name!=auth]');
	Ext.each(checkboxgp,function(it){
		   it.setDisabled(true);
		   it.setValue(1) ;
	 });
	// * 业务多要查分出来
	for(var i=0;i<dataArr.length;i++) {
		// 权限数据
		var data = dataArr[i];
		// 权限
		var authId = data['authId'];
		// 1：所有 2：指定
		var type = data['type'];
		// 1：售货机 2：商品
		var authType = data['authType'];
		switch(authId) {
			// 设备补货 and 数据统计
			case authIds.terRepl:
			case authIds.saleCount:
				// 设置勾选
				if (authIds.terRepl==authId) {
					// 设置启用
					Ext.getCmp('replEnable').setValue({'auth':true});
					// 商品类型
					if (authType==2) {
						Ext.getCmp(authGoodsDomIds[authId]).setValue({'terGoodsOption':type});
					} else {
						Ext.getCmp(authTerDomIds[authId]).setValue({'terReplOption':type});
					}
				} else if (authIds.saleCount==authId) {
					// 设置启用
					Ext.getCmp('salesEnable').setValue({'auth':true});
					if (authType==2) {
						Ext.getCmp(authGoodsDomIds[authId]).setValue({'salesGoodsOption':type});
					} else {
						Ext.getCmp(authTerDomIds[authId]).setValue({'salesStaOption':type});
					}
				}
				// 指定商品名称回显  type:1所有 2指定
				if (type==2) {
					var names = '';
					// 指定类型的值
					var v = data['val'];
					if (v) {
						for(var s=0;s < v.length;s++) {
							// 验证字符长度
//							if (jmz.GetLength(names) > maxStrLen || jmz.GetLength(names+v[i]['name']) > maxStrLen) {
//								names +='<br/>';
//							}
							if (authType==1) {
								names +=v[s]['name']+'、';
							} else {
								names +=v[s]['name']+'、';
							}
						}
						if (authType==1) {
							userSharedRecordIds['selTer'+authId] = v;
							Ext.getCmp(authTerDomIds[authId]).up().items.last().setValue(names);
						} else if (authType==2) {
							userSharedRecordIds['selGoods'+authId] = v;
							Ext.getCmp(authGoodsDomIds[authId]).up().items.last().setValue(names);
						}
					}
				}
				break;
			case authIds.payAccount:
				// 设置启用
				Ext.getCmp('accountEnable').setValue({'auth':true});
				// 设置选择
				if (authType==3) {
					Ext.getCmp(assignOption[authType]).setValue({'payWxOption':type});
				} else if (authType==4) {
					Ext.getCmp(assignOption[authType]).setValue({'payAliOption':type});
				} else if (authType==5) {
					Ext.getCmp(assignOption[authType]).setValue({'payJdOption':type});
				} else if (authType==6) {
					Ext.getCmp(assignOption[authType]).setValue({'paySbOption':type});
				}
				if (type==2) {
					var names = '';
					// 指定类型的值
					var v = data['val'];
					if (v) {
						for(var s=0;s < v.length;s++) {
							// 验证字符长度
//							if (jmz.GetLength(names) > maxStrLen || jmz.GetLength(names+v[i]['name']) > maxStrLen) {
//								names +='<br/>';
//							}
							names +=v[s]['name']+'、';
						}
						Ext.getCmp(assignOption[authType]).up().items.last().setValue(names);
						userSharedRecordIds['selAccount'+authType] = v;
					}
				}
				break;
			default:
				break;
			}
		
	}
	
}

/**role tab*/
function  createAuthSharedTabInfo(){
	 var auth_repl_info = [
	                      { boxLabel: getIi18NText('shareAuthAllTer'),inputValue: '1' ,checked:true ,name: 'terReplOption'},
	                      { boxLabel: getIi18NText('shareAuthOneTer'),inputValue: '2' ,name: 'terReplOption'}
	                      ];
	 var auth_repl_info2 = [
	                      { boxLabel: getIi18NText('allGoods'),	inputValue: '1' ,checked:true ,name: 'terGoodsOption'},
	                      { boxLabel: getIi18NText('shareAuthOneGoods'),inputValue: '2' ,name: 'terGoodsOption'}
	                      ];
	 //   ============================================ 设备补货  ============================================
	 var auth_repl = {
             xtype: 'panel'
            ,width: 600
            ,padding: '15 0 0 20'
            ,layout: {type: 'vbox'}
	         ,border: false
            ,items:[{
           	 xtype:'label',
           	 componentCls: 'componentTitleCls2',
           	 html: getIi18NText('eqAdd')
            },{
                    xtype: 'checkboxgroup'
                    ,margin: '0 0 0 38'
                    ,defaults: {margin: '5 5 0 5'}
            		,id: 'replEnable'
                    ,columns: 1
                    ,value : authIds.terRepl
                    ,items: [{ boxLabel: window.top.getIi18NText('useThisFunction') ,name: 'auth', listeners:{change: checkChangeFn} , inputValue: authIds.terRepl  }]
             },{
                     xtype: 'component'
                     ,margin: '0 0 0 38'
                     ,width: 340
                     ,height: 2
                     ,componentCls: 'componentTitleCls'
               },
               
                {
                    xtype: 'panel'
                  	  ,width:500 
                  	  ,border: false
      		    	  ,items: [
								 {
								    xtype: 'radiogroup'
								    ,margin: '0 0 0 38'
								    ,columns: 2
								    ,defaults: {margin: '5 5 0 5', name:'auth', checked: false}
								    ,value: 1
								    ,id: 'authReplTer'
								    ,items: auth_repl_info
								    ,listeners:{change: allOrSingleFn}
								 },
								 {
					                	xtype: 'displayfield',
					                    name: 'optionName',
					                    hidden:true,
									     cls : isEn?'authSharedOptionCls':'authSharedOptionClsCn',
					                    value: optionFn(1,authIds.terRepl)
					            },
								 {
								  	  xtype: 'textareafield',
								      name: 'optSingleVal',
								      readOnly: true,
								      fieldStyle:'	background: transparent;border-style: none' ,
								      anchor    : '100%',
								      width :330,
								      style: {
								          marginLeft: '48px'
								      },
								      value: ''
								  }]
                },
               
                {
                    xtype: 'panel'
                  	  ,width:500 
                  	  ,border: false
      		    	  ,items: [
								 {
								    xtype: 'radiogroup'
								    ,margin: '0 0 0 38'
								    ,columns: 2
								    ,defaults: {margin: '5 5 0 5', name:'auth', checked: false}
								    ,items: auth_repl_info2
								    ,id: 'authReplGoods'
								    ,listeners:{change: allOrSingleFn}
								 },
								 {
					                	xtype: 'displayfield',
					                    name: 'optionName',
					                    hidden:true,
									     cls : isEn?'authSharedOptionCls':'authSharedOptionClsCn',
					                    value: optionFn(2,authIds.terRepl)
					            },
								 {
								  	  xtype: 'textareafield',
								      name: 'optSingleVal',
								      readOnly: true,
								      anchor    : '100%',
								      fieldStyle:'	background: transparent;border-style: none' ,
								      width :330,
								      style: {
								          marginLeft: '48px'
								      },
								      value: ''
								  }]
                }
               ]
	  };
	 
	 
	 
	 var auth_sales_statistics = [
	                      { boxLabel: getIi18NText('shareAuthAllTer') ,inputValue: '1' ,checked:true , name: 'salesStaOption'},
	                      { boxLabel: getIi18NText('shareAuthOneTer') ,inputValue: '2' ,name: 'salesStaOption'}
	                      ];
	 var auth_sales_statistics2 = [
	    	                      { boxLabel: getIi18NText('allGoods') ,inputValue: '1' ,checked:true ,name: 'salesGoodsOption'},
	    	                      { boxLabel: getIi18NText('shareAuthOneGoods') ,inputValue: '2' ,name: 'salesGoodsOption'}
	    	                      ];
	 //   ============================================ 销售统计 ============================================
	 var salesStatistics = {
             xtype: 'panel'
            ,width: 600
            ,padding: '15 0 0 20'
            ,layout: {type: 'vbox'}
	         ,border: false
            ,items:[{
           	 xtype:'label',
           	 componentCls: 'componentTitleCls2',
           	 html: getIi18NText('saleStatistics')
            },
            {
                    xtype: 'checkboxgroup'
                    ,margin: '0 0 0 38'
                    ,defaults: {margin: '5 5 0 5'}
            		,id: 'salesEnable'
                    ,columns: 1
                    ,items: [{ boxLabel: window.top.getIi18NText('useThisFunction'), listeners:{change: checkChangeFn} ,name: 'auth', inputValue: authIds.saleCount}]
             },
            {
                     xtype: 'component'
                     ,margin: '0 0 0 38'
                     ,width: 340
                     ,height: 2
                     ,componentCls: 'componentTitleCls'
               },
               {
                   xtype: 'panel'
                 	  ,width:500 
                 	  ,border: false
     		    	  ,items: [
								{
								    xtype: 'radiogroup'
								    ,margin: '0 0 0 38'
								    ,columns: 2
								    ,id: 'authSalesTer'
								    ,defaults: {margin: '5 5 0 5', name:'auth', checked: false}
								    ,items: auth_sales_statistics
								    ,listeners:{change: allOrSingleFn}
								 },
								 {
								 	 xtype: 'displayfield',
								     name: 'optionName',
					                 hidden:true,
								     cls : isEn?'authSharedOptionCls':'authSharedOptionClsCn',
								     value: optionFn(1,authIds.saleCount)
								  },
								 {
								  	  xtype: 'textareafield',
								      name: 'optSingleVal',
								      fieldStyle:'	background: transparent;border-style: none' ,
								      readOnly: true,
								      anchor    : '100%',
								      width :330,
								      style: {
								          marginLeft: '48px'
								      },
								      value: ''
								  }]
               },
               {
                   xtype: 'panel'
                 	  ,width:500 
                 	  ,border: false
     		    	  ,items: [
								{
								    xtype: 'radiogroup'
								    ,margin: '0 0 0 38'
								    ,columns: 2
								    ,id: 'authSalesGoods'
								    ,defaults: {margin: '5 5 0 5', name:'auth', checked: false}
								    ,items: auth_sales_statistics2
								    ,listeners:{change: allOrSingleFn}
								 },
								 {
								 	 xtype: 'displayfield',
								     name: 'optionName',
					                 hidden:true,
								     cls : isEn?'authSharedOptionCls':'authSharedOptionClsCn',
								     value: optionFn(2,authIds.saleCount)
								  },
									 {
								  	  xtype: 'textareafield',
								      name: 'optSingleVal',
								      readOnly: true,
								      fieldStyle:'	background: transparent;border-style: none' ,
								      anchor    : '100%',
								      width :330,
								      style: {
								          marginLeft: '48px'
								      },
								      value: ''
								  }]
               }
               ]
	  };
	 
	 
	 
	 var auth_pay_wx = [
	                      { boxLabel: getIi18NText('shareAuthAllAccount') ,inputValue: '1' ,checked:true ,name: 'payWxOption'},
	                      { boxLabel: getIi18NText('shareAuthOneAccount') ,inputValue: '2' ,name: 'payWxOption'}
	                      ];
	 var auth_pay_ali = [
	                      { boxLabel: getIi18NText('shareAuthAllAccount')  ,inputValue: '1' ,checked:true ,name: 'payAliOption'},
	                      { boxLabel: getIi18NText('shareAuthOneAccount') ,inputValue: '2' ,name: 'payAliOption'}
	                      ];
	 var auth_pay_jd = [
	                      { boxLabel: getIi18NText('shareAuthAllAccount') ,inputValue: '1' ,checked:true ,name: 'payJdOption'},
	                      { boxLabel: getIi18NText('shareAuthOneAccount') ,inputValue: '2' ,name: 'payJdOption'}
	                      ];
	 var auth_pay_sb = [
	                      { boxLabel: getIi18NText('shareAuthAllAccount') ,inputValue: '1' ,checked:true ,name: 'paySbOption'},
	                      { boxLabel: getIi18NText('shareAuthOneAccount') ,inputValue: '2' ,name: 'paySbOption'}
	                      ];
	 //  ============================================ 支付账号  ============================================
	 var payAccount = {
             xtype: 'panel'
            ,width: 600
            ,padding: '15 0 0 20'
            ,layout: {type: 'vbox'}
	         ,border: false
            ,items:[{
           	 xtype:'label',
           	 componentCls: 'componentTitleCls2',
           	 html: getIi18NText('shareAuthPayAccount')
            },{
                    xtype: 'checkboxgroup'
                    ,margin: '0 0 0 38'
                    ,defaults: {margin: '5 5 0 5'}
                    ,columns: 1
                    ,id: 'accountEnable'
                    ,value: 3
                    ,items: [{ boxLabel: window.top.getIi18NText('useThisFunction'),listeners:{change: checkChangeFn} , name: 'auth', inputValue: 3 ,checked: false}]
             },{
                     xtype: 'component'
                     ,margin: '0 0 0 38'
                     ,width: 340
                     ,height: 2
                     ,componentCls: 'componentTitleCls'
               },
               {
            	   xtype: 'panel'
            	  ,width:500 
             	  ,border: false
		    	  ,items: [
					{
					    xtype: 'hiddenfield',
					    value: 3
					},
					{
					    xtype: 'radiogroup'
					    ,margin: '5 0 0 38'
					    ,columns: 2
					    ,labelWidth : 60
					    ,id: 'authWxPay'
					    ,fieldLabel: getIi18NText('pay_wechat')
					    ,defaults: {margin: '0 5 0 5', name:'auth', checked: false}
					    ,items: auth_pay_wx
					    ,listeners:{change: allOrSingleFn}
					 },
					 {
					 	xtype: 'displayfield',
					    name: 'optionName',
	                    hidden:true,
					     cls : isEn?'authSharedOptionCls2':'authSharedOptionClsCn',
					    value: optionFn(3,authIds.payAccount)
					 },
					 {
					  	  xtype: 'textareafield',
					      name: 'optSingleVal',
					      readOnly: true,
					      fieldStyle:'	background: transparent;border-style: none' ,
					      anchor    : '100%',
					      width :330,
					      style: {
					          marginLeft: '36px'
					      },
					      value: ''
					  }]
               },
               {
               xtype: 'panel'
             	  ,width:500 
             	  ,border: false
 		    	  ,items: [
 		    	          {
 		                     xtype: 'radiogroup'
 		                     ,margin: '5 0 0 38'
 		                     ,columns: 2
 		                     ,labelWidth : 60
 						     ,id: 'authAliPay'
 		                     ,fieldLabel: getIi18NText('pay_alipay')
 		                     ,defaults: {margin: '0 5 0 5', name:'auth', checked: false}
 		                     ,items: auth_pay_ali
							 ,listeners:{change: allOrSingleFn}
 		                  },
 		                  {
 		                  	  xtype: 'displayfield',
 		                      name: 'optionName',
			                  hidden:true,
							     cls : isEn?'authSharedOptionCls2':'authSharedOptionClsCn',
 		                      value: optionFn(4,authIds.payAccount)
 		                  },
 						 {
						  	  xtype: 'textareafield',
						      name: 'optSingleVal',
						      readOnly: true,
						      fieldStyle:'	background: transparent;border-style: none' ,
						      anchor    : '100%',
						      width :330,
						      style: {
						          marginLeft: '36px'
						      },
						      value: ''
						  }
 		    	           ]
	 			}
	 			// 聚合支付账号
//	 			{
//	 			xtype: 'panel'
//             	  ,width:478 
//             	  ,border: false
// 		    	  ,items: [
//						{
//						    xtype: 'radiogroup'
//						    ,margin: '5 20 0 38'
//						    ,columns: 2
//						    ,labelWidth : 80
//						    ,id: 'authJdPay'
//						    ,fieldLabel: getIi18NText('jdPay')
//						    ,defaults: {margin: '0 5 0 5', name:'auth', checked: false}
//						    ,items: auth_pay_jd
//						    ,listeners:{change: allOrSingleFn}
//						 },
//						 {
//						 	 xtype: 'displayfield',
//						     name: 'optionName',
//			                 hidden:true,
//						     cls : isEn?'authSharedOptionCls2':'authSharedOptionClsCn',
//						     value: optionFn(5,authIds.payAccount)
//						 },
//						 {
//						  	  xtype: 'textareafield',
//						      name: 'optSingleVal',
//						      fieldStyle:'	background: transparent;border-style: none' ,
//						      readOnly: true,
//						      anchor    : '100%',
//						      width :330,
//						      style: {
//						          marginLeft: '36px'
//						      },
//						      value: ''
//						  }
//    	           ]
//	 			},
	 			// 扫呗
//	 			{
//	 			xtype: 'panel'
//             	  ,width:478 
//             	  ,border: false
// 		    	  ,items: [
//						{
//						    xtype: 'radiogroup'
//						    ,margin: '5 20 0 38'
//						    ,columns: 2
//						    ,labelWidth : 80
//						    ,id: 'authSbPay'
//						    ,fieldLabel: getIi18NText('sbPay')
//						    ,defaults: {margin: '0 5 0 5', name:'auth', checked: false}
//						    ,items: auth_pay_sb
//						    ,listeners:{change: allOrSingleFn}
//						 },
//						 {
//						 	 xtype: 'displayfield',
//						     name: 'optionName',
//			                 hidden:true,
//						     cls : isEn?'authSharedOptionCls2':'authSharedOptionClsCn',
//						     value: optionFn(6,authIds.payAccount)
//						 },
//						 {
//						  	  xtype: 'textareafield',
//						      name: 'optSingleVal',
//						      fieldStyle:'	background: transparent;border-style: none' ,
//						      readOnly: true,
//						      anchor    : '100%',
//						      width :330,
//						      style: {
//						          marginLeft: '36px'
//						      },
//						      value: ''
//						  }
//    	           ]
//	 			}
               ]
	  };
	 
	 
	 return {
	     xtype: 'tabpanel'
	    ,minTabWidth : 60
		,shadow : false
		,id: 'authSharedContentTabpanel'
        ,tabPosition : 'top'
        ,layout: 'fit'
        ,cls: 'headerMenuCls'
		,items : [{
                 title: getIi18NText('authShared')
                ,iconCls: 'auth_tabIcon_cls'
		        ,layout: 'fit'
			    ,items: [{
			    	   xtype: 'panel'
			          ,bodyStyle : 'overflow-y:auto;'
			    	  ,items: [
			    	          auth_repl
                             ,salesStatistics
                             ,payAccount
			    	  ]
			    }]
		}]
	 };
}
// 启用方法
function checkChangeFn($this, newValue, oldValue, eOpts){
	// 组件尚未渲染成功
	if (!$this.up('checkboxgroup').up()) {
		return;
	}
	var checkboxgp = $this.up('checkboxgroup').up().query('checkbox[name!=auth]');
	Ext.each(checkboxgp,function(it){
		   it.setDisabled(!newValue);
		   it.setValue(1) ;
	 });
	// 隐藏选择按钮
	var optionNames = $this.up('checkboxgroup').up().query('displayfield[name=optionName]');
		Ext.each(optionNames,function(it){
			   it.hide();
	});
}
// 选择所有类型的按钮
function allOrSingleFn ($this, newValue, oldValue, eOpts) {
	// 选择所有 则清除指定已选的数据
	if ($this.getChecked()[0].inputValue==1) {
		
		if ($this.getId()=='authReplGoods'){
			
			delete userSharedRecordIds['selGoods'+authIds.terRepl];
			
		} else if ($this.getId()=='authReplTer'){
			
			delete userSharedRecordIds['selTer'+authIds.terRepl];
			
		} else if ($this.getId()=='authSalesTer'){
			
			delete userSharedRecordIds['selTer'+authIds.saleCount];
			
		} else if ($this.getId()=='authSalesGoods'){
			
			delete userSharedRecordIds['selGoods'+authIds.saleCount];
			
		} else if ($this.getId()=='authWxPay') {
			
			delete userSharedRecordIds['selAccount'+3];

		} else if ($this.getId()=='authAliPay') {
			
			delete userSharedRecordIds['selAccount'+4];
			
		} else if ($this.getId()=='authJdPay') {
			
			delete userSharedRecordIds['selAccount'+5];
			
		}
		 else if ($this.getId()=='authSbPay') {
			
			delete userSharedRecordIds['selAccount'+6];
			
		}
		$this.up().items.last().setValue('');
		$this.nextSibling().hide();
	} else {
		// 显示选择
		$this.nextSibling().show();
	}
}
var isReturn = false; 
// 保存 BY DB
function saveAuthInfoFn (btn) {
	var allCheckbox = Ext.getCmp('authSharedContentTabpanel').query('checkbox[name=auth]');
	
    var jsonArr = new Ext.util.HashMap();
    
	isReturn = false;
	Ext.each(allCheckbox,function(item, index, all){
		if (isReturn) {
			return false;
		}
		var key ='';
		var authType = item.inputValue;
		if (!item.checked) {
			return true;
		}
		var res ;
		switch (authType) {
		case authIds.terRepl:
			res = checkRepl();
			key = 'terRepl';
			break;
		case authIds.saleCount:
			res = checkSales();
			key = 'saleCount';
			break;
		case authIds.payAccount:
			res = checkPay();
			key = 'payAccount';
			break;
		default:
			break;
		}
		if (res) {
			jsonArr.add(key,res);
		}
  });
	 var val = JSON.stringify(jsonArr.map);
	 authSharedWindow.getEl().mask(window.top.getIi18NText('createRoleTip02'));
	 Ext.Ajax.request({
	     url: 'auth!saveUserAuthShared.action'
	    ,params: {v:encode(val),u:uId}
        ,method: 'post'
        ,callback: function(opt, success, response){
        	authSharedWindow.getEl().unmask();
        	  var result = showResult(success,response);
        	  if(result == false) return;
        	  Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('saveSuccess'),function(){
        		  authSharedWindow.close();
        	  });
        }
   });
	
	
}

function checkRepl () {
	var json = {};
	// 售卖机
	var authReplTer = Ext.getCmp('authReplTer').getChecked()[0].inputValue; 
	// 商品
	var authReplGoods = Ext.getCmp('authReplGoods').getChecked()[0].inputValue;
	
	// 权限id
	json.ai = authIds.terRepl;
	// 选中为所有
	json.terT =  typeIds.allTer;
	json.goodsT =  typeIds.allGoods;
	
	// 选中为指定
	if (authReplTer == 2) {
		json.terT =  typeIds.assignTer;
		json.terV =  userSharedRecordIds['selTer'+authIds.terRepl];
	}
	if (authReplGoods == 2) {
		json.goodsT =  typeIds.assignGoods;
		// 选择商品集合值
		json.goodsV =  userSharedRecordIds['selGoods'+authIds.terRepl];
	}
	
	return json;
}
function checkSales() {
	var json = {};
	// 售卖机
	var authSalesTer = Ext.getCmp('authSalesTer').getChecked()[0].inputValue; 
	// 商品
	var authSalesGoods = Ext.getCmp('authSalesGoods').getChecked()[0].inputValue;
	// 权限id
	json.ai = authIds.saleCount;
	// 选中为所有
	json.terT =  typeIds.allTer;
	json.goodsT =  typeIds.allGoods;
	// 选中为指定
	if (authSalesTer == 2) {
		json.terT =  typeIds.assignTer;
		json.terV =  userSharedRecordIds['selTer'+authIds.saleCount];
	}
	if (authSalesGoods == 2) {
		json.goodsT =  typeIds.assignGoods;
		json.goodsV =  userSharedRecordIds['selGoods'+authIds.saleCount];
	}
	
	return json;
}

function checkPay() {
	var json = {};
	// 微信支付
	var authWxPay = Ext.getCmp('authWxPay').getChecked()[0].inputValue; 
	// 支付宝支付
	var authAliPay = Ext.getCmp('authAliPay').getChecked()[0].inputValue;
	// 聚合支付
//	var authJdPay = Ext.getCmp('authJdPay').getChecked()[0].inputValue;
	
	// 扫呗支付
//	var authSbPay = Ext.getCmp('authSbPay').getChecked()[0].inputValue;
	// 权限id
	json.ai = authIds.payAccount;
	// 选中为所有
	json.wx = typeIds.allWxAccount;
	json.ali =  typeIds.allAliAccount;
	json.jd =  typeIds.allJdAccount;
	json.sb =  typeIds.allSbAccount;

	// 选中为指定
	if (authWxPay == 2) {
		json.wx = typeIds.assignWxAccount;
		json.wxPayV = userSharedRecordIds['selAccount'+3];
	}
	if (authAliPay == 2) {
		json.ali =  typeIds.assignAliAccount;
		json.aliPayV = userSharedRecordIds['selAccount'+4];
	}
	
//	if (authJdPay == 2) {
//		json.jd =  typeIds.assignJdAccount;
//		json.jdPayV = userSharedRecordIds['selAccount'+5];
//	}
//	
//	if (authSbPay == 2) {
//		json.sb =  typeIds.assignSbAccount;
//		json.sbPayV = userSharedRecordIds['selAccount'+6];
//	}
	return json;
}

// 选择商品
function openOption (type,authId){
	var idName = assignOption[type];
	var msgInfo = '指定账号下才能选择!';
	if (authId == 1) {
		if (type==1)  {
			idName = authTerDomIds[1];
			msgInfo = '指定售货机下才能选择!';
		} else {
			idName = authGoodsDomIds[1];
			 msgInfo = '指定商品下才能选择!';
		}
	} else if (authId==2) {
		if (type==1)  {
			idName = authTerDomIds[2];
			msgInfo = '指定售货机下才能选择!';
		} else {
			idName = authGoodsDomIds[2];
			msgInfo = '指定商品下才能选择!';
		}
	}
	var t = Ext.getCmp(idName);
	// 是否启用
	var isEnable = t.up().up().query('checkbox[name=auth]')[0].getRawValue();
	if (!isEnable) {
		Ext.Msg.alert(window.top.getIi18NText('systemMessage'),'请先启用！');
		return;
	}
	// 指定模式下
	var selType = t.getChecked()[0].inputValue==1;
	if (selType) {
		Ext.Msg.alert(window.top.getIi18NText('systemMessage'),msgInfo);
		return;
	}
	thisAuthId = authId;

	switch (type) {
		case 1:
			recordIds.clear();
			var re = userSharedRecordIds['selTer'+thisAuthId];
   		 	if (re) {
   			 for(var i=0;i<re.length;i++) {
   				 if (re[i].data) {
   					 recordIds.add(re[i].data.id,re[i].data);
   				 } else {
   					 recordIds.add(re[i].id,re[i]);
   				 }
   			 }
   		 	}
			openTerWin();
			break;
		case 2:
			openGoodsWin();
			break;
		case 3:
			recordIds.clear();
			thisAuthId = 3;
			var re = userSharedRecordIds['selAccount'+thisAuthId];
			if (re) {
   			 for(var i=0;i<re.length;i++) {
   				 if (re[i].data) {
   					 recordIds.add(re[i].data.id,re[i].data);
   				 } else {
   					 recordIds.add(re[i].id,re[i]);
   				 }
   			 }
   		 	}
			openWechatWin();
			break;
		case 4:
			recordIds.clear();
			thisAuthId = 4;
			var re = userSharedRecordIds['selAccount'+thisAuthId];
			if (re) {
   			 for(var i=0;i<re.length;i++) {
   				 if (re[i].data) {
   					 recordIds.add(re[i].data.id,re[i].data);
   				 } else {
   					 recordIds.add(re[i].id,re[i]);
   				 }
   			 }
   		 	}
			openAlipayWin();
			break;
		case 5:
			recordIds.clear();
			thisAuthId = 5;
			var re = userSharedRecordIds['selAccount'+thisAuthId];
   		 	if (re) {
   			 for(var i=0;i<re.length;i++) {
   				 if (re[i].data) {
   					 recordIds.add(re[i].data.id,re[i].data);
   				 } else {
   					 recordIds.add(re[i].id,re[i]);
   				 }
   			 }
   		 	}
			openJdWin();
			break;
		case 6:
			recordIds.clear();
			thisAuthId = 6;
			var re = userSharedRecordIds['selAccount'+thisAuthId];
   		 	if (re) {
   			 for(var i=0;i<re.length;i++) {
   				 if (re[i].data) {
   					 recordIds.add(re[i].data.id,re[i].data);
   				 } else {
   					 recordIds.add(re[i].id,re[i]);
   				 }
   			 }
   		 	}
			openSbWin();
			break;
		default:
			break;
	}
	
	
}



// ========================================================== 选择商品WIN ========================================================== // 
var queryGoodsWin;
var queryGoodsWinId="usQueryGoodsWinId"
function openGoodsWin(){
	recordIds.clear();
	iframeImg=1060;
	var baseCfg = {
			frame : false,
			modal : true,
			constrain : true,
			border : false,
//			closeAction : 'hide',
			width : 1024,
			height : 576,
			autoScroll : false
	};
	queryGoodsWin = Ext.getCmp("queryGoodsWin");
	if (queryGoodsWin) {
		queryGoodsWin.show();
	} else {
		Ext.merge(baseCfg,
			{
			id : queryGoodsWinId,
			xtype : 'panel',
			layout:'border',
			title : window.top.getIi18NText('goods_li'),
			iconCls : 'pback_write_IconCls',
			maximizable:true,
			maximized : true,
			html:'<iframe frameborder="0" width="100%" height="100%" src="source!goodsManage.action" ></iframe>',
			bbar : [
				 '->',
					{
						xtype : 'button',
						text : getIi18NText('cancel'),
						margin : '0 5 0 0',
						iconCls : '',
						handler : function(){
							if(queryGoodsWin){
							   queryGoodsWin.close();
 							}				
						}
					}, {
						xtype : 'button',
						iconCls : '',
						text : getIi18NText('confirm'),
						handler : addGoods
			}],
			listeners : {
				hide : function() {
				}
			}
		});
		queryGoodsWin = Ext.create('Ext.window.Window', baseCfg).show();
	}
}

//========================================================== 选择终端WIN ==========================================================


var terSelMode = Ext.create('Ext.selection.CheckboxModel', {
 	listeners : {
    	'select' : terSelect,
   		'deselect' : terDeselect
 	}
});
var groupStore = Ext.create('Ext.data.Store', {
    fields: ['gid', 'gname']
    , autoLoad: true
    , proxy: {
        type: 'ajax'
        , url: 'terminal!selTerminalGroupList.action'
        , reader: {
            type: 'json',
            root: 'data',
            tiemout: 20000,
            totalProperty: 'totalCount'
        }
    }
    , listeners: {
        /*  load: function(){
	    	this.loadData([{'gid':-1, 'gname':'- -'+getIi18NText('allTerminalTeams')+'- -'}],true);
	    }*/
    }
});
function terDeselect(me, record) {
	 if (recordIds.containsKey(record.get('id'))) {
	     recordIds.removeAtKey(record.get('id'));
	 }
}
function terSelect(me, record) {
	 if (!recordIds.contains(record.get('id'))) {
	      recordIds.add(record.get('id'),record.data);
	 }
}
function condEvent($this, newValue, oldValue, eOpts) {
    if (oldValue == 1) {
        Ext.getCmp('allGroup_combo').hide();
    } else if (oldValue == 2) {
        Ext.getCmp('allCompany_combo').hide();
    } else if (oldValue == 3) {
        Ext.getCmp('searchNameId').hide();
    } else if (oldValue == 4) {
        Ext.getCmp('searchBianTextId').hide();
    } else if (oldValue == 5) {
    }
    if (newValue == 1) {
        Ext.getCmp('searchNameId').setValue("");
        Ext.getCmp('searchBianTextId').setValue("");
        Ext.getCmp('allGroup_combo').show();
    } else if (newValue == 2) {
        Ext.getCmp('allCompany_combo').show();
    } else if (newValue == 3) {
        Ext.getCmp('allGroup_combo').setValue('');
        Ext.getCmp('searchBianTextId').setValue("");
        Ext.getCmp('searchNameId').show();
    } else if (newValue == 4) {
        Ext.getCmp('allGroup_combo').setValue('');
        Ext.getCmp('searchNameId').setValue("");
        Ext.getCmp('searchBianTextId').show();
    } else if (newValue == 5) {
        Ext.getCmp('allGroup_combo').setValue('');
        Ext.getCmp('searchNameId').setValue("");
        Ext.getCmp('searchBianTextId').setValue("");
    } else if (newValue == 6) {
        Ext.getCmp('allGroup_combo').setValue('');
        Ext.getCmp('searchNameId').setValue("");
        Ext.getCmp('searchBianTextId').setValue("");
    }
}
var queryTerWin;
var queryTerId="usTerWin";
function openTerWin(){
	 var baseCfg = {
			 frame : false,
			 modal : true,
			 constrain : true,
			 border : false,
			 closeAction : 'hide',
			 maximizable:true,
			 maximized: true,
			 width : 980,
			 height : 600,
			 minWidth : 480,
			 minHeight : 300,
			 autoScroll : false
	 };
	 
	 queryWechatWin = Ext.getCmp(queryTerId);
	 if (queryTerWin) {
		 queryTerWin.show();
	 } else {
		 Ext.merge(baseCfg,{
			 id : queryTerId,
			 xtype : 'panel',
			 layout:'border',
			 title : getIi18NText('terList'),
			 iconCls : 'pback_write_IconCls',
			 width : 900,
			 height : 500,
			 maximizable:true,
			 maximized: true,
			 items:[{ 
				 region: 'north'
				,height: 40
				,width: 900
				,id: 'northTerContanier'
				,layout:'hbox'
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
	                        xtype: 'combo'
	                        ,
	                        fieldLabel: getIi18NText('onTerms')
	                        ,
	                        labelWidth: 40
	                        ,
	                        width: 125
	                        ,
	                        editable: false
	                        ,
	                        id: 'switchCombo'
	                        ,
	                        store: [[1, getIi18NText('deviceGroup')], 
	                        [3, getIi18NText('deviceNames')], 
	                        [4, getIi18NText('deviceNo')]]
	                        ,
	                        queryMode: 'local'
	                        ,
	                        displayField: 'name'
	                        ,
	                        valueField: 'value'
	                        ,
	                        value: 1
	                        ,
	                        listeners: {
	                            change: function ($this, newValue, oldValue, eOpts) {
	                                condEvent($this, newValue, oldValue, eOpts);
	                                refreshMonitarData();
	                            }
	                        }
	                    },
	                    {
	                        xtype: 'combo'
	                        , id: 'allGroup_combo'
	                        , name: 'allGroup_combo'
	                        , width: 90
	                        , editable: true
	                        , typeAhead: true
	                        , selectOnFocus: true
	                        , store: groupStore
	                        , queryMode: 'local'
	                        , displayField: 'gname'
	                        , emptyText: getIi18NText('allTerminalTeams')
	                        , valueField: 'gid'
	                        , value: ''
	                        , listeners: {
	                        	 change: delaySearch
	                        }
	                    },
	                    {
	                        fieldLabel: getIi18NText('name')
	                        , id: 'searchNameId'
	                        , xtype: 'textfield'
	                        , hidden: true
	                        , maxLength: 50
	                        , width: 130
	                        , labelWidth: 30
	                        , emptyText: getIi18NText('keyword')
	                        , enforceMaxLength: true
	                        , listeners: {
	                        change: delaySearch
	                    }
	                    },
	                    {
	                        fieldLabel: getIi18NText('serNu')
	                        , id: 'searchBianTextId'
	                        , xtype: 'textfield'
	                        , hidden: true
	                        , maxLength: 50
	                        , width: 130
	                        , labelWidth: 30
	                        , emptyText: getIi18NText('serTre')
	                        , enforceMaxLength: true
	                        , listeners: {
	                        change: delaySearch
	                    }
	                    }
	                    , {
	                        xtype: 'button'
	                        , iconCls: 'refreshIconCss'
	                        , text: getIi18NText('refresh')
	                        , handler: function () {
	                            refreshMonitarData();
	                        }
	                    }
	                   ]
			 },
			 terGrid
			 ],
			 listeners : {
				 beforeShow : function() {
					 searchTerFun();
				 },
				 hide:function(){
					 terSelMode.deselectAll(true);
				 }
			 }
		});
		 queryTerWin = Ext.create('Ext.window.Window', baseCfg).show();
	 }
}

// 自动查询
function delaySearch() {
    window.clearTimeout(timeId);
    timeId = window.setTimeout(function () {
        refreshMonitarData();
    }, 800);
}
var terStore = Ext.create('Ext.data.Store', {
	 fields: ['id','name','groupName','terNum','version','screen','owner'],
	 buffered: false,
	 pageSize: 10
	 ,leadingBufferZone: 50
	 ,proxy:{
		 type: 'ajax',
		 url: 'terminal!getTerInfo.action',
		 reader: {
			 type: 'json',
			 root: 'data',
			 totalProperty: 'totalCount'
		 }
	 }
	 ,autoLoad: true
	 ,listeners: {
  	    	load:function($this){
	    		 terBranch($this);
  	    	}
	 } 
});
function terBranch($this) {
	var arry = [];
	if (!recordIds) {
		return;
	}
    $this.each(function (record) {
    	if (recordIds.containsKey(record.data.id))
		{
    	    arry.push(record);
    	    terSelMode.select(arry, true);
		}
    });
    terSelMode.addListener('deselect', terDeselect);
}
function searchTerFun(but){
//	   terStore.getProxy().setExtraParam("n", encode(Ext.getCmp('searchTerTextId').getValue()));
	   terStore.loadPage(1);
}
var terGrid	= Ext.create('Ext.grid.Panel', {
 	region: 'center',
 	width:890,
 	height:500,
    frame: false,
    selModel: terSelMode,
    store: terStore,
    selType: 'checkboxmodel',
    columns: [
        { text: window.top.getIi18NText('Noo'), width: 80 , xtype: 'rownumberer', align: 'center'},
        { text: window.top.getIi18NText('deviceNames'), flex: 1, dataIndex: 'name', minWidth: 150},
        { text: window.top.getIi18NText('deviceNo'),flex: 1,  dataIndex: 'terNum', minWidth: 120 ,align: 'center'},
        { text: window.top.getIi18NText('apk_version'), flex: 1, dataIndex: 'version', minWidth: 150},
        { text: window.top.getIi18NText('deviceGroup'),flex: 1,  dataIndex: 'groupName', minWidth: 150},
	    { text: window.top.getIi18NText('screen'),flex: 1,  dataIndex: 'screen', minWidth: 150},
	    { text: window.top.getIi18NText('creator'), flex: 1, dataIndex: 'owner', minWidth: 140}
    ],
    bbar: [{
        xtype: 'pagingtoolbar',
        store: terStore,
        border:false,
        displayInfo: true                 
    },{ xtype: 'tbfill' },
    {
	    xtype:'button',
	    text : getIi18NText('cancel'),
        align: 'right',
        border: false,
	    handler: function () {
	    	queryTerWin.close();
	    }
    },
    {
	    xtype:'button',
	    margin:'0 20 0 0',
	    text : getIi18NText('confirm'),
        align: 'right',
        border: false,
	    handler: addTer
    }],
	listeners : {
	}
	,viewConfig: {
		trackOver: false
		,disableSelection: false
		,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
	}
});
//重载数据
function refreshMonitarData() {
    var name = Ext.getCmp("searchNameId").getValue();//终端名称
    var teridB = Ext.getCmp("searchBianTextId").getValue();//终端编号
    var groupName = Ext.getCmp('allGroup_combo').getValue();// 终端组
//    terStore.load({
//        params: {
//            g: groupName,
//            n: encode(name),
//            tb: encode(teridB)
//        }	
//    });
    
    terStore.getProxy().setExtraParam("g", groupName);
    terStore.getProxy().setExtraParam("n", encode(name));
    terStore.getProxy().setExtraParam("tb", encode(teridB));
	terStore.loadPage(1);
}
//========================================================== 选择微信WIN ==========================================================


var wxSelMode = Ext.create('Ext.selection.CheckboxModel', {
 	listeners : {
    	'select' : wxSelect,
   		'deselect' : wxDeselect
 	}
});

function wxDeselect(me, record) {
	 if (recordIds.containsKey(record.get('id'))) {
	     recordIds.removeAtKey(record.get('id'));
	 }
}
function wxSelect(me, record) {
	 if (!recordIds.contains(record.get('id'))) {
	     recordIds.add(record.get('id'),record.data);
	 }
}

var queryWechatWin;
var queryWechatId="usWechatWin";
function openWechatWin(){
	 var baseCfg = {
			 frame : false,
			 modal : true,
			 constrain : true,
			 border : false,
			 closeAction : 'hide',
			 maximizable : true,
			 maximized: true,
			 width : 980,
			 height : 600,
			 minWidth : 480,
			 minHeight : 300,
			 autoScroll : false
	 };
	 
	 queryWechatWin = Ext.getCmp(queryWechatId);
	 if (queryWechatWin) {
		 queryWechatWin.show();
	 } else {
		 Ext.merge(baseCfg,{
			 id : queryWechatId,
			 xtype : 'panel',
			 layout:'border',
			 title : window.top.getIi18NText('wp_List'),
			 iconCls : 'pback_write_IconCls',
			 width : 900,
			 height : 500,
			 maximizable:true,
			 maximized: true,
			 items:[{ 
				 region: 'north'
				,height: 40
				,width: 900
				,id: 'northWechatContanier'
				,layout:'hbox'
				,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
			 	,bodyCls: 'x_panel_backDD'
				 ,items: [{
					 xtype: 'image',
					 src: '',
					 width: 40,
					 height: 24,
					 imgCls: 'searchIconCss'
				 },{
					 fieldLabel: window.top.getIi18NText('name')
					 ,id: 'searchWechatTextId'
					 ,xtype: 'textfield'
					 ,maxLength: 50
					,width: 180
					 ,labelWidth: 30
					 ,emptyText: window.top.getIi18NText('wechatPublicNameSearch')
				 },{
					 xtype: 'button'
					,id: 'wechatqueryBut'
					 ,iconCls: 'queryIconCss'
					,text:  window.top.getIi18NText('select')
					,handler: searchWechatFun
				 }]
			 },
			 wechatGrid
			 ],
			 listeners : {
				 beforeShow : function() {
					 searchWechatFun();
				 },
				 hide:function(){
					 Ext.getCmp('searchWechatTextId').setValue(null);
					 wxSelMode.deselectAll(true);
				 }
			 }
		});
		 queryWechatWin = Ext.create('Ext.window.Window', baseCfg).show();
	 }
}

var wechatStore = Ext.create('Ext.data.Store', {
	 fields: ['id','name','payTitle','connector','tel', 'state', 'latest', 'username','subMch'],
	 buffered: false,
	 pageSize: 10
	 ,leadingBufferZone: 50
	 ,proxy:{
		 type: 'ajax',
		 url: 'auth!allWepublic.action?sharedType=1',
		 reader: {
			 type: 'json',
			 root: 'data',
			 totalProperty: 'totalCount'
		 }
	 }
	 ,autoLoad: true
	 ,listeners: {
  	    	load:function($this){
	    		 wxAccountBranch($this);
  	    	}
	 } 
});
function wxAccountBranch($this) {
	var arry = [];
	if (!recordIds) {
		return;
	}
    $this.each(function (record) {
    	if (recordIds.containsKey(record.data.id))
		{
    	    arry.push(record);
    	    wxSelMode.select(arry, true);
		}
    });
    wxSelMode.addListener('deselect', wxDeselect);
}
function searchWechatFun(but){
	   wechatStore.getProxy().setExtraParam("n", encode(Ext.getCmp('searchWechatTextId').getValue()));
	   wechatStore.loadPage(1);
}
var wechatGrid	= Ext.create('Ext.grid.Panel', {
 	region: 'center',
 	width:890,
 	height:500,
    frame: false,
    selModel: wxSelMode,
    store: wechatStore,
    selType: 'checkboxmodel',
    columns: [
        { text: window.top.getIi18NText('Noo'), width: 80 , xtype: 'rownumberer', align: 'center'},
        { text: window.top.getIi18NText('name'), dataIndex: 'name', minWidth: 100,flex: 1},
        { text: window.top.getIi18NText('subMch'), dataIndex: 'subMch', minWidth: 100 ,align: 'center',renderer: renderSubMchType},
        { text: window.top.getIi18NText('payTitle'), dataIndex: 'payTitle', minWidth: 100},
        { text: window.top.getIi18NText('wp_connector'), dataIndex: 'connector', minWidth: 100},
	    { text: window.top.getIi18NText('Tel'), dataIndex: 'tel', minWidth: 100},
	    { text: window.top.getIi18NText('creator'), dataIndex: 'username', minWidth: 70}
    ],
    bbar: [{
        xtype: 'pagingtoolbar',
        store: wechatStore,
        border:false,
        displayInfo: true                 
    },{ xtype: 'tbfill' },
    {
	    xtype:'button',
	    text : getIi18NText('cancel'),
        align: 'right',
        border: false,
	    handler: function () {
	    	recordIds.clear();
	    	queryWechatWin.close();
	    }
    },
    {
	    xtype:'button',
	    margin:'0 20 0 0',
	    text : getIi18NText('confirm'),
        align: 'right',
        border: false,
	    handler: addPayAccount
    }],
	listeners : {
	}
	,viewConfig: { //GZE 2016/8/12  添加没有查询到信息时的提示消息
		trackOver: false
		,disableSelection: false
		,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
	}
});
/**渲染特约商户**/
function renderSubMchType(value,metaData,record,rowIndex,colIndex,store,view){
	 if(value == 1){
		 return getIi18NText("yes");
	 }else{
		 return getIi18NText("no");
	 }
}
//========================================================== 选择支付宝WIN ==========================================================

var queryAlipayWin;
var queryAlipayId="usAlipayWin";


var aliSelMode = Ext.create('Ext.selection.CheckboxModel', {
 	listeners : {
    	'select' : aliSelect,
   		'deselect' : aliDeselect
 	}
});

function aliDeselect(me, record) {
	 if (recordIds.containsKey(record.get('id'))) {
	     recordIds.removeAtKey(record.get('id'));
	 }
}
function aliSelect(me, record) {
	 if (!recordIds.contains(record.get('id'))) {
	     recordIds.add(record.get('id'),record.data);
	 }
}

function openAlipayWin(){
	 var baseCfg = {
			 frame : false,
			 modal : true,
			 constrain : true,
			 border : false,
			 closeAction : 'hide',
			 maximizable:true,
			 maximized: true,
			 width : 980,
			 height : 600,
			 minWidth : 480,
			 minHeight : 300,
			 autoScroll : false
	 };
	 
	 queryAlipayWin = Ext.getCmp(queryAlipayId);
	 if (queryAlipayWin) {
		 queryAlipayWin.show();
	 } else {
		 Ext.merge(baseCfg,{
			 id : queryAlipayId,
			 xtype : 'panel',
			 layout:'border',
			 title : getIi18NText('alipay_List'),
			 iconCls : 'pback_write_IconCls',
			 width : 900,
			 height : 500,
			 maximizable:true,
			 maximized: true,
			 items:[{ 
				 region: 'north',
				 height: 40
				 ,width: 900
				 ,id: 'northAlipayContanier'
				,layout:'hbox'
				,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
			 	,bodyCls: 'x_panel_backDD'
				 ,items: [{
					 xtype: 'image',
					 src: '',
					 width: 40,
					 height: 24,
					 imgCls: 'searchIconCss'
				 },{
					 fieldLabel: window.top.getIi18NText('name')
					 ,id: 'alipaysearchTextId'
					 ,xtype: 'textfield'
					 ,maxLength: 50
					,width: 180
					 ,labelWidth: 30
					 ,emptyText: window.top.getIi18NText('byAlipayName')
				 },{
					 xtype: 'button'
					,id: 'alipayqueryBut'
					 ,iconCls: 'queryIconCss'
					,text:  window.top.getIi18NText('select')
					,handler: searchAlipayFun
				 }]
			 },
			 alipayGrid
			 ],
			 listeners : {
				 beforeShow : function() {
					 searchAlipayFun();
				 },
				 hide:function(){
					 Ext.getCmp('alipaysearchTextId').setValue(null);
					 aliSelMode.deselectAll(true);
				 }
			 }
				 });
		 queryAlipayWin = Ext.create('Ext.window.Window', baseCfg).show();
	 }
 }
 
  var alipayStore = Ext.create('Ext.data.Store', {
	 fields: ['id','name','pvkey', 'pbkey', 'connector','tel', 'state', 'latest', 'creator', 'appid', 'pid','remark'],
	 buffered: false,
	 pageSize: 10
	 ,leadingBufferZone: 50
	 ,proxy:{
		 type: 'ajax',
		 url: 'auth!getAliAcnt.action?sharedType=1',
		 reader: {
			 type: 'json',
			 root: 'data',
			 totalProperty: 'totalCount'
		 }
	 }
	 ,autoLoad: true
	 ,listeners: {
	    	load:function($this){
	    		 aliAccountBranch($this);
 	    	}
	 }
});
function aliAccountBranch($this) {
	var arry = [];
	if (!recordIds) {
		return;
	}
   $this.each(function (record) {
	   if (recordIds.containsKey(record.data.id)) {
		   	    arry.push(record);
		   	    aliSelMode.select(arry, true);
		}
   });
   aliSelMode.addListener('deselect', aliDeselect);
}
 
 
 var alipayGrid= Ext.create('Ext.grid.Panel', {
	 	region: 'center',
	 	width:890,
	 	height:500,
	    frame: false,
	    selModel: aliSelMode,
	    selType: 'checkboxmodel',
	    store: alipayStore,
	    columns: [
		        { text: window.top.getIi18NText('Noo'), width: 80 , xtype: 'rownumberer', align: 'center'},
		        { text: window.top.getIi18NText('name'), dataIndex: 'name', minWidth: 100,flex: 1},
		        { text: window.top.getIi18NText('wp_connector'), dataIndex: 'connector', minWidth: 100},
			    { text: window.top.getIi18NText('Tel'), dataIndex: 'tel', minWidth: 100},
			    { text: window.top.getIi18NText('payTitle'), dataIndex: 'remark', minWidth: 100 ,flex: 1},
			    { text: window.top.getIi18NText('creator'), dataIndex: 'creator', minWidth: 70}
	    ],
        bbar: [{
            xtype: 'pagingtoolbar',
            store: alipayStore,
            border:false,
            displayInfo: true                 
        },{ xtype: 'tbfill'},
        {
    	    xtype:'button',
    	    text : getIi18NText('cancel'),
            align: 'right',
            border: false,
    	    handler: function () {
    	    	recordIds.clear();
    	    	queryAlipayWin.close();
    	    }
        },{
		    xtype:'button',
		    margin:'0 20 0 10',
		    text : getIi18NText('confirm'),
            align: 'right',
            border: false
		    ,handler: addPayAccount
        }],
    listeners : {
	}
 	,viewConfig: { //GZE 2016/8/12  添加没有查询到信息时的提示消息
 		trackOver: false
 		,disableSelection: false
 		,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
   }
});
//模糊搜索支付宝账号
function searchAlipayFun(but){
	   alipayStore.getProxy().setExtraParam("n", encode(Ext.getCmp('alipaysearchTextId').getValue()));
	   alipayStore.loadPage(1);
}

 // ========================添加扫呗支付账号信息========================
var querySbWin;
var querySbId="usSbpayWin";


var sbSelMode = Ext.create('Ext.selection.CheckboxModel', {
 	listeners : {
    	'select' : sbSelect,
   		'deselect' : sbDeselect
 	}
});

function sbDeselect(me, record) {
	 if (recordIds.containsKey(record.get('id'))) {
	     recordIds.removeAtKey(record.get('id'));
	 }
}
function sbSelect(me, record) {
	 if (!recordIds.contains(record.get('id'))) {
	     recordIds.add(record.get('id'),record.data);
	 }
}

	var sbStore = Ext.create('Ext.data.Store', {
		 fields: ['id','name','connector', 'tel' ,'latest'],
		 buffered: false,
		 pageSize: 10
		 ,leadingBufferZone: 50
		 ,proxy:{
			 type: 'ajax',
			 url: 'saobei!getAllSbBindingInfo.action?sharedType=1',
			 reader: {
				 type: 'json',
				 root: 'data',
				 totalProperty: 'totalCount'
			 }
		 }
		 ,autoLoad: true
		 ,listeners: {
			 load:function($this){
			 	sbAccountBranch($this);
			 }
		 } 
	 });
	var sbGrid	= Ext.create('Ext.grid.Panel', {
	 	region: 'center',
	 	width:890,
	 	height:500,	    
	 	selModel: sbSelMode,
	    frame: false,
	    store: sbStore,
	    columns: [
	        { text: window.top.getIi18NText('Noo') , width: 80 , xtype: 'rownumberer', align: 'center'},
	        { text: window.top.getIi18NText('businessName'), dataIndex: 'name', minWidth: 100,flex: 1},
	        { text: window.top.getIi18NText('wp_connector'), dataIndex: 'connector', minWidth: 100 ,align: 'center'},
		    { text: window.top.getIi18NText('Tel'), dataIndex: 'tel', minWidth: 100}
	    ],
        bbar: [{
            xtype: 'pagingtoolbar',
            store: sbStore,
            border:false,
            displayInfo: true                 
        },{ xtype: 'tbfill' },
   		{
		    xtype:'button',
		    text : getIi18NText('cancel'),
	        align: 'right',
	        border: false,
		    handler: function () {
	    	recordIds.clear();
	    	querySbWin.close();
	    }
   		},{
		    xtype:'button',
		    margin:'0 20 0 10',
		    text : getIi18NText('confirm'),
            align: 'right',
            border: false,
		    handler: addPayAccount
   }],
   listeners : {
	    itemdblclick: function(dv, record, item, index, e) {
	    	addPayAccount();
	    }
   }
 	,viewConfig: { //GZE 2016/8/12  添加没有查询到信息时的提示消息
 		trackOver: false
 		,disableSelection: false
 		,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
 	}
});
	function sbAccountBranch($this) {
		var arry = [];
		if (!recordIds) {
			return;
		}
	   $this.each(function (record) {
		   if (recordIds.containsKey(record.data.id)) {
			   	    arry.push(record);
			   	    sbSelMode.select(arry, true);
			}
	   });
	   sbSelMode.addListener('deselect', sbDeselect);
	}
	// 扫呗支付选择窗口
	function openSbWin(){
		 var baseCfg = {
				 frame : false,
				 modal : true,
				 constrain : true,
				 border : false,
				 closeAction : 'hide',
				 maximizable:true,
				 maximized: true,
				 width : 980,
				 height : 600,
				 minWidth : 480,
				 minHeight : 300,
				 autoScroll : false
		 };
		 querySbWin = Ext.getCmp(querySbId);
		 if (querySbWin) {
			 sbStore.reload();
			 querySbWin.show();
		 } else {
			 Ext.merge(baseCfg,{
				 id : querySbId,
				 xtype : 'panel',
				 layout:'border',
				 title : getIi18NText('addSbPay'),
				 iconCls : 'pback_write_IconCls',
				 width : 900,
				 height : 500,
				 maximizable:false,
				 items:[{ 
					 region: 'north'
					,height: 40
					,width: 900
					,id: 'northSbContanier'
					,layout:'hbox'
					,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
				 	,bodyCls: 'x_panel_backDD'
					 ,items: [{
						 xtype: 'image',
						 src: '',
						 width: 40,
						 height: 24,
						 imgCls: 'searchIconCss'
					 },{
						 fieldLabel: window.top.getIi18NText('name')
						 ,id: 'searchSbTextId'
						 ,xtype: 'textfield'
						 ,maxLength: 80
						,width: 220
						 ,labelWidth: 30
						 ,emptyText: getIi18NText('businessNameSearch')
					 },{
						 xtype: 'button'
						,id: 'sbqueryBut'
						 ,iconCls: 'queryIconCss'
						,text:  window.top.getIi18NText('select')
						,handler: searchSbFun
					 }]
				 },
				 sbGrid
				 ],
				 listeners : {
					 beforeShow : function() {
						 searchSbFun();
					 },
					 hide:function(){
						 Ext.getCmp('searchSbTextId').setValue(null);
						 sbSelMode.deselectAll(true);
					 }
				 }
			});
			 querySbWin = Ext.create('Ext.window.Window', baseCfg).show();
		 }
		 sbStore.reload();
	 }
//========================================================== 选择聚合支付WIN ==========================================================

var jdSelMode = Ext.create('Ext.selection.CheckboxModel', {
 	listeners : {
    	'select' : jdSelect,
   		'deselect' : jdDeselect
 	}
});

function jdDeselect(me, record) {
	 if (recordIds.containsKey(record.get('id'))) {
	     recordIds.removeAtKey(record.get('id'));
	 }
}
function jdSelect(me, record) {
	 if (!recordIds.contains(record.get('id'))) {
	     recordIds.add(record.get('id'),record.data);
	 }
}
var jdStore = Ext.create('Ext.data.Store', {
	 fields: ['id','name','connector', 'tel' ,'latest'],
	 buffered: false,
	 pageSize: 10
	 ,leadingBufferZone: 50
	 ,proxy:{
		 type: 'ajax',
		 url: 'jdpay!getAllJdBindingInfo.action?sharedType=1',
		 reader: {
			 type: 'json',
			 root: 'data',
			 totalProperty: 'totalCount'
		 }
	 }
	 ,autoLoad: true
	 ,listeners: {
		 load:function($this){
    		 
    		 jdAccountBranch($this);
		 }
	 } 
});

function jdAccountBranch($this) {
	var arry = [];
	if (!recordIds) {
		return;
	}
   $this.each(function (record) {
	   if (recordIds.containsKey(record.data.id)) {
		   	    arry.push(record);
		   	 jdSelMode.select(arry, true);
		}
   });
   jdSelMode.addListener('deselect', jdDeselect);
}
 
 
var jdGrid	= Ext.create('Ext.grid.Panel', {
   region: 'center',
   width:890,
   height:500,
   frame: false,
   selModel: jdSelMode,
   selType: 'checkboxmodel',
   store: jdStore,
   columns: [
       { text: window.top.getIi18NText('Noo') , width: 80 , xtype: 'rownumberer', align: 'center'},
       { text: window.top.getIi18NText('businessName'), dataIndex: 'name', minWidth: 100,flex: 1},
       { text: window.top.getIi18NText('wp_connector'), dataIndex: 'connector', minWidth: 100 ,align: 'center'},
	    { text: window.top.getIi18NText('Tel'), dataIndex: 'tel', minWidth: 100}
   ],
   bbar: [{
       xtype: 'pagingtoolbar',
       store: jdStore,
       border:false,
       displayInfo: true                 
   },{ xtype: 'tbfill' },
   	{
	    xtype:'button',
	    text : getIi18NText('cancel'),
       align: 'right',
       border: false,
	    handler: function () {
	    	recordIds.clear();
	    	queryJdWin.close();
	    }
   	},{
	    xtype:'button',
	    margin:'0 20 0 10',
	    text : getIi18NText('confirm'),
       align: 'right',
       border: false,
	    handler: addPayAccount
	}],
	listeners : {
	}
	,viewConfig: { //GZE 2016/8/12  添加没有查询到信息时的提示消息
		trackOver: false
		,disableSelection: false
		,emptyText: '<h1 style="margin:10px">'+window.top.getIi18NText('roleTip05')+'</h1>'
	}
});
function searchJdFun(but){
	   jdStore.getProxy().setExtraParam("name", encode(Ext.getCmp('searchJdTextId').getValue()));
	   jdStore.getProxy().setExtraParam("shareType", 1);
	   jdStore.loadPage(1);
  }

function searchSbFun(but){
	   sbStore.getProxy().setExtraParam("name", encode(Ext.getCmp('searchSbTextId').getValue()));
	   sbStore.getProxy().setExtraParam("shareType", 1);
	   sbStore.loadPage(1);
  }

var queryJdWin;
var queryJdId="usJdWin";
// 聚合支付选择窗口
function openJdWin(){
	 var baseCfg = {
			 frame : false,
			 modal : true,
			 constrain : true,
			 border : false,
			 closeAction : 'hide',
			 maximizable:true,
			 maximized: true,
			 width : 980,
			 height : 600,
			 minWidth : 480,
			 minHeight : 300,
			 autoScroll : false
	 };
	 queryJdWin = Ext.getCmp(queryJdId);
	 if (queryJdWin) {
		 jdStore.reload();
		 queryJdWin.show();
	 } else {
		 Ext.merge(baseCfg,{
			 id : queryJdId,
			 xtype : 'panel',
			 layout:'border',
			 title : getIi18NText('addJdPay'),
			 iconCls : 'pback_write_IconCls',
			 width : 900,
			 height : 500,
			 maximizable:true,
			 maximized: true,
			 items:[{ 
				 region: 'north'
				,height: 40
				,width: 900
				,id: 'northJdContanier'
				,layout:'hbox'
				,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
			 	,bodyCls: 'x_panel_backDD'
				 ,items: [{
					 xtype: 'image',
					 src: '',
					 width: 40,
					 height: 24,
					 imgCls: 'searchIconCss'
				 },{
					 fieldLabel: window.top.getIi18NText('name')
					 ,id: 'searchJdTextId'
					 ,xtype: 'textfield'
					 ,maxLength: 80
					,width: 220
					 ,labelWidth: 30
					 ,emptyText: getIi18NText('businessNameSearch')
				 },{
					 xtype: 'button'
					,id: 'jdqueryBut'
					 ,iconCls: 'queryIconCss'
					,text:  window.top.getIi18NText('select')
					,handler: searchJdFun
				 }]
			 },
			 jdGrid
			 ],
			 listeners : {
				 beforeShow : function() {
					 searchJdFun();
				 },
				 hide:function(){
					 Ext.getCmp('searchJdTextId').setValue(null);
					 jdSelMode.deselectAll(true);
				 }
			 }
		});
		 queryJdWin = Ext.create('Ext.window.Window', baseCfg).show();
	 }
	 jdStore.reload();
}



//========================================================== END WIN ==========================================================

// 完成添加支付账号
function addPayAccount() {
	var id = '';
	var data ;
	// 3 微信 4 支付宝 5聚合
	switch (thisAuthId) {
		case 3:
			id = 'authWxPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			wxSelMode.deselectAll(true);
			queryWechatWin.close();
			// 取消所有选中记录
			break;
		case 4: 
			id = 'authAliPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			aliSelMode.deselectAll(true);
			queryAlipayWin.close();
			// 取消所有选中记录
			break;
		case 5:
			id = 'authJdPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			// 取消所有选中记录
			jdSelMode.deselectAll(true);
			queryJdWin.close();
			break;
		case 6:
			id = 'authSbPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			// 取消所有选中记录
			sbSelMode.deselectAll(true);
			querySbWin.close();
			break;
		default:
			break;
	}
	setAssignValue(id,data);
}
// 完成添加终端
function addTer() {
	var id;
	var data;
	if (thisAuthId==authIds.terRepl) {
		id = 'authReplTer';
		userSharedRecordIds['selTer'+thisAuthId] = recordIds.items;
		data  = userSharedRecordIds['selTer'+thisAuthId];
		queryTerWin.close();
	} else if (thisAuthId==authIds.saleCount) {
		id = 'authSalesTer';
		userSharedRecordIds['selTer'+thisAuthId] = recordIds.items;
		data  = userSharedRecordIds['selTer'+thisAuthId];
		queryTerWin.close();
	}
	setAssignValue(id,data);
}
// 完成添加商品 和 支付账号
function addGoods () {
	var id = '';
	var data ;
	switch (thisAuthId) {
		case authIds.terRepl:
			id = 'authReplGoods';
			userSharedRecordIds['selGoods'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selGoods'+thisAuthId];
			queryGoodsWin.close();
			break;
		case authIds.saleCount:
			id = 'authSalesGoods';
			userSharedRecordIds['selGoods'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selGoods'+thisAuthId];
			queryGoodsWin.close();
			break;
		case 3:
			id = 'authWxPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			queryWechatWin.close();
			break;
		case 4: 
			id = 'authAliPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			queryAlipayWin.close();
			break;
		case 5:
			id = 'authJdPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			queryJdWin.close();
			break;
		case 6:
			id = 'authSbPay';
			userSharedRecordIds['selAccount'+thisAuthId] = recordIds.items;
			data  = userSharedRecordIds['selAccount'+thisAuthId];
			querySbWin.close();
			break;
		default:
			break;
	}
	setAssignValue(id,data);
	
}
function setAssignValue(id ,data ) {
	var html = '';
	for(var i=0;i<data.length;i++) {
		// 验证长度
//		if (jmz.GetLength(data[i].name) % maxStrLen==0 || jmz.GetLength(html) % maxStrLen==0) {
//			html+="<br/>";
//		}
		html+=data[i].name+"、";
	}
	Ext.getCmp(id).up().items.last().setValue(html);
}
usersSharedInfo = function(r,db){
 	if(r){
 		recordIds.clear();
		Ext.each(r.items,function(record , index , countriesItSelf){
			var id;
			var data;
			if (record.data) {
				id = record.get('id');
				data = record.data;
			} else {
				id = record.id;
				data = record;
			}
			if(!recordIds.containsKey(id)){
				recordIds.add(id,data);  
			}
		});
 	}
}
