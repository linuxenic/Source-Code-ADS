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
	
	Ext.QuickTips.init(); 
     
    function showTip(comp, msg){
	  	commonTip.update(msg);
	  	commonTip.showBy(comp,null,[50,-60]);
	  	comp.addListener('mouseout',function(){
	  		  commonTip.hide();
	  	});
     }
    
    function init(){
    	if(code == '2'){
    		createUnbindPanel();
    		return;
    	}
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
								     xtype: 'displayfield',
								     fieldLabel: '账号',
								     labelWidth: 35,
								     id: 'accout_lable',
								     value: 'test'
								   }
								  ,{
									 xtype: 'displayfield',
								     fieldLabel: '昵称',
								     labelWidth: 35,
								     id: 'nick_field',
								     value: '安致兰德科技有限公司'
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
	 	        	 xtype: 'textfield',
	 	             id: 'pwd_field',
	 	             emptyText: '请输入待绑定账号的密码',
	 	             fieldLabel: ''
	 	             ,inputType: 'password'
					 ,width: 170
					 ,height: 35
					 ,maxLength: 50
					 ,enforceMaxLength: true
	 	             ,allowBlank: false 
		          }
	 	         ,{
	 	        	 xtype: 'button',
	 	             id: 'sub_field',
	 	             height: 30,
	 	             width: 170,
	 	             text: '绑 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定'
		          }]
 	           });
	
   }
    
    function createUnbindPanel(){
    	 Ext.create("Ext.container.Viewport",{
		    
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
									      text: "您已经绑定当前服务器的该账号了。"
									      ,style: 'font-size: 16px'  
									      ,margin: '20 0 20 30'
									   },{
										   xtype: 'hiddenfield',
									       id: 'ser_field',
									       value: msgdata
									   }
		 	        	            ]
		 	          }
	 	            ,{
		 	        	 xtype: 'button',
		 	             id: 'close_btn',
		 	             height: 30,
		 	             width: 170,
		 	             text: '关 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;闭',
		 	             handler: function(){
		 	            	  closePage();
		 	             }
			          }
		 	         ,{
		 	        	 xtype: 'button',
		 	             id: 'unbind_btn',
		 	             height: 30,
		 	             width: 170,
		 	             text: '解除绑定',
		 	             handler: function(){ 
		 	            	  unbindUser(Ext.getCmp("ser_field").getValue());
			 	         }
			          }]
	           });
    	
    }
    
    function initdata(){
    	var mdata = jsonToObj(msgdata);
    	Ext.getCmp("accout_lable").setValue(mdata['uname']);
    	Ext.getCmp("nick_field").setValue(mdata['nick']);
    	Ext.getCmp("server_field").setValue(mdata['plat']);
    	Ext.getCmp("suser_field").setValue(mdata['wid']);
    }
    function regevent(){
    	Ext.getCmp('sub_field').addListener('click',function(){
	    		var pwd  = Ext.getCmp("pwd_field").getValue();
	    		if(isNull(pwd)){
	    			showTip(this, "请输入密码.");
	    			return;
	    		}
	    	   var wid = Ext.getCmp("suser_field").getValue();
	    	   
	    	   viewport.getEl().mask('正在执行绑定..');
    		   Ext.Ajax.request({
				     url: 'qrlogin!gateway.action?m=ebind'
				    ,params: {wid: wid, pwd: pwd}
			        ,method: 'post'
			        ,callback: function(opt, success, response){
			        	  viewport.getEl().unmask();
			        	  var result = Ext.decode(response['responseText']);
			        	  if(result['code'] == 0) {
			        		  alert("绑定成功.");
			        		  closePage();
			        	  }else if(result['code'] == -5){
			        		  alert("密码不正确，请重新输入.");
			        	  }else{
			        		  alert("绑定失败，error:"+result['code']);
			        		  closePage();
			        	  }
			        }
			   });
    		
    	});
    }
    
    function unbindUser(uid){
    	Ext.Msg.show({icon: Ext.MessageBox.QUESTION, title: "系统提示", cls:'msgCls', msg:"确定要解除绑定吗？",plain: true, buttons: Ext.MessageBox.OKCANCEL,  fn:function(bid, text, opt){
			   if(bid == 'ok'){
				   Ext.Ajax.request({
					     url: 'qrlogin!gateway.action?m=unbind'
					    ,params: {id: uid, rand: Ext.id()}
				        ,method: 'post'
				        ,callback: function(opt, success, response){
				        	  var result = Ext.decode(response['responseText']);
				        	  if(result['code'] == 0) {
				        		  alert("解绑成功。");
				        	  }else if(result['code'] == -4){
				        		  alert("解绑失败，页面已失效，请重试。");
				        	  }else{
				        		  alert("解绑失败，error:"+result['code']);
				        	  }
				        	  closePage();
				        	  
				        }
				   });
			   }
		 }});
    }
    
    
    function closePage(){
    	  window.opener=null;
		  window.open('','_self');
		  window.close();
		  WeixinJSBridge.call('closeWindow');
    }
    init();
});
