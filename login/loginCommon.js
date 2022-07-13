/**
 * common login js 
 **/
Ext.onReady(function() {
	  var qrpanel,wsconn = false,wsrand = -1;
	  function init(){
		  var auth = Ext.decode(decode(AUTH_TBAR));
		  //qrlogin
		  if(auth.wqrlogin){
		    appendQrbutton();
		  }
		  
		  //etc ..
		  
	  }

	  function appendQrbutton(){
		    window.setTimeout(function() {
		    	var loginPanel = Ext.getCmp("loginpanel");
			    if(loginPanel == null){
			    	return;
			    }
			    loginPanel.add([{
				    	  xtype: 'button',
				          width: 32,
				          height: 32,
				          border: false,
				          id: 'qrswitch_btn',
				          x: 0,
				          y: 0,
				          tooltip: getIi18NText('jsp_qrlogin_switchbtn'),
				          style: 'margin: 415px 0px 0px '+(local == "noads_juli"?417:340)+'px; background:url(images/imgPanel1.png) no-repeat scroll -49px -2px  transparent;',
				          handler: showQrimg
			         },{
				    	  xtype: 'panel',
				    	  closable: true,
				          width: 353,
				          height: 330,
				          hidden: true,
				          closeAction: 'hide',
				          id: 'qrimg_panel',
				          x: 0,
				          y: 0,				          
				          title: getIi18NText('jsp_qrlogin_scan'),
				          iconCls: 'qrpanel_logo',
				          html: '<div style="width:100%;background:url(images/other/loading.gif) no-repeat scroll 0 0  transparent;height: 100%;"></div>',   
				          style: local == 'noads_juli'?'margin: 82px 0 0 117px;':'margin: 122px 0 0 20px;',
				          bodyStyle: 'border-color: #afc2d0;' 
			    }]);
		    }, 700);
      }
	  
	  function showQrimg(){
		    qrpanel= Ext.getCmp('qrimg_panel');
		    if(qrpanel == null || qrpanel.isVisible() == true){
		    	return;
		    }
		    
		    qrpanel.show('qrswitch_btn');
		    if(qrpanel.hasimg != "img"){
		    	    wsrand =  ""+(Math.round(Math.random()*100000)+666);
			    	Ext.Ajax.request({
				    	   url: 'qrlogin!gateway.action?m=qrimg&r='+wsrand
	                       ,callback: function (opt, success, res) {
			                    	  var result = Ext.decode(res['responseText']);
			 			        	  if(result['code'] == 0) {
			 			        		  websocketQrlogin(result['msg']);
			 			        	  }else if(result['code'] == 1){
			 			        		  showQRerror(getIi18NText('jsp_qrlogin_reqwxfail'));
			 			        	  }else{
			 			        		  showQRerror(getIi18NText('jsp_qrlogin_reqqrfail'));
			 			        	  }
			 			        	 qrpanel.hasimg = "img";
	                       }
				    });
		    }
	  }
	  
	  function websocketQrlogin(msg){
		   
		    var mdata = jsonToObj(msg);
            //var wpath = "ws://azld.net/wqlogin/"+wsrand; 
            //var wpath = "ws://localhost:8081/Digital/wqlogin/"+wsrand;
              var wpath = mdata['ws'];
              if(window.location.protocol.startWith("https")){
                  wpath = wpath.replace("ws:","wss:").replace("net","net:446");
              }
		    var img =  mdata['img'];
	        var webSocket =  new WebSocket(wpath);
	        
	        webSocket.onopen = function(event) {
	        	 wsconn = true;
	        	 console.log('# qrlogin open successfuly.'+event);
	        	 qrpanel.update('<div style="width:100%;background:url('+img+') no-repeat scroll 0 0  transparent;height: 100%;margin:5px 0 0 32px"></div>');
	        };  
	  
	        webSocket.onmessage = function(event) {  
	        	 console.log('# qrlogin message :'+event.data);
	        	 var msg = event.data;
	        	 var msgvalid = !isNull(msg) && (msg.length>wsrand.length+10) && (msg.substr(0,wsrand.length) == wsrand);
	        	 if(wsconn&&msgvalid){
	        		     msg = msg.substring(wsrand.length+1);
	        		     showQRerror(getIi18NText('jsp_qrlogin_logining'));
		        		 Ext.Ajax.request({
					    	   url: 'qrlogin!gateway.action?m=qrindex'
					    	   ,method: 'post'
					    	   ,params: {p:msg}   
		                       ,callback: function (opt, success, res) {
				                    	  var result = Ext.decode(res['responseText']);
				 			        	  if(result['code'] == 0) {
				 			        		  window.location.replace('auth!indexPage.action');
				 			        	  }else{
				 			        		  showQRerror(getIi18NText('jsp_qrlogin_loginfail'));
				 			        	  }
		                       }
					    });
	        	 }
	        	 
	        };  
	        webSocket.onclose=function(event){
	        	 wsconn = false;
	        	 console.log('# qrlogin onclose.'+event);
	        };
	        
	        webSocket.onerror = function(event) {  
	        	 wsconn = false;
	        	 console.log('# qrlogin onerror:'+event);
	        	 showQRerror(getIi18NText('jsp_qrlogin_reqwxfail'));
	        };
	  }
	  
	  function showQRerror(err){
		  qrpanel.remove('msgid');
		  qrpanel.add({
     		 border: false,
     		 height: 13,
     		 id: 'msgid',
     		 html: '<font color="red">'+err+'</font>',
     	 });
	  }
	  init();
});

