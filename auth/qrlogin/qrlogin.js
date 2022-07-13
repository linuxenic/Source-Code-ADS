/** item manager */
Ext.onReady(function() {
	
	//variable
	var viewport,gridPanel,tabStore,ajaxProxy,alipayWin;
	
	var  AUTH = Ext.merge({add: false,update: false, "delete": false ,"self":true}, Ext.decode(decode(AUTH_TBAR)));
 
	var commonTip = Ext.create('Ext.tip.ToolTip',{
		   title:  "系统提示"
		  ,minWidth: 100
	      ,html: ''
	});
	
	var ustore = Ext.create('Ext.data.Store', {
	    fields: ['uid', 'name'],
	    data : []
	});
	Ext.QuickTips.init(); 
     
    function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
    
    function init(){
    	createPanel();
    	initdata();
    	regevent();
    }  
    
    function createPanel(){
		 viewport = Ext.create("Ext.container.Viewport",{
			    
			    layout: { type: 'vbox', align: 'center'}
 	           ,border: false
 	           ,style: 'background-color: white;'
 	           ,margin: '80px 0 0 0'
 	           ,defaults: {margin: '0 0 10px 0'}
 	           ,items: [{
	 	                   xtype: 'image'
		 	               ,src: 'images/other/qr_bind_title.jpg'
		 	              ,border: false
		 	              ,width: 128
		 	              ,height: 128
	                  }
	 	             ,{
	 	        	    xtype: 'panel'
	 	        	    ,border: false	
	 	        	    ,items: [
	 	        	             {
								      xtype: 'text',
								      text: "请选择登陆账号"
								      ,style: 'font-size: 16px'  
								      ,margin: '20 0 20 30'
								   }
							  ,{
								     
										    fieldLabel: "账号"
										    ,xtype: 'combobox'
										    ,store: ustore
							                ,width: 175
							                ,editable: false
										    ,queryMode: 'local'
										    ,labelWidth: 35
										    ,displayField: 'name'
										    ,valueField: 'uid'
										    ,id: 'accout_lable'
							    
								   }
								 ,{
									 xtype: 'displayfield',
								     fieldLabel: '平台',
								     labelWidth: 35,
								     id: 'server_field',
								     value: '信发平台'
								 },{
									 xtype: 'hiddenfield',
								     id: 'suser_field',
								     value: '-1'
								 }
	 	        	            ]
	 	          }
	 	         ,{
	 	        	 xtype: 'button',
	 	             id: 'sub_field',
	 	             height: 30,
	 	             width: 170,
	 	             text: '登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;陆'
		          }]
 	           });
	
   }
    
    function initdata(){
    	var mdata = jsonToObj(msgdata);
    	var cdata = mdata['user'];
    	Ext.getCmp("accout_lable").getStore().loadData(cdata);
    	Ext.getCmp("accout_lable").setValue(cdata[0]['uid']);
    	Ext.getCmp("server_field").setValue(mdata['plat']);
    	Ext.getCmp("suser_field").setValue(mdata['rid']);
    }
    function regevent(){
    	Ext.getCmp('sub_field').addListener('click',function(){
	    		var uid  = Ext.getCmp("accout_lable").getValue();
	    		if(isNull(uid)){
	    			showTip(this, "请选择登陆用户.");
	    			return;
	    		}
	    	   var wid = Ext.getCmp("suser_field").getValue();
	    	   
	    	   viewport.getEl().mask('正在发送账号登陆请求..');
    		   Ext.Ajax.request({
				     url: 'qrlogin!gateway.action?m=elogin'
				    ,params: {wid: wid, uid: uid}
			        ,method: 'post'
			        ,callback: function(opt, success, response){
			        	  viewport.getEl().unmask();
			        	  var result = Ext.decode(response['responseText']);
			        	  if(result['code'] == 0) {
			        		  alert("账号登陆发送成功，请返回电脑端继续操作.");
			        	  }else{
			        		  alert("账号登陆发送失败，error:"+result['code']);
			        	  }
			        	  closePage();
			        }
			   });
    		
    	});
    }
    function closePage(){
    	  window.opener=null;
		  window.open('','_self');
		  window.close();
		  WeixinJSBridge.call('closeWindow');
    }
    init();
});
