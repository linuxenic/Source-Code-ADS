<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE>终端数据</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/statistics/passengerFlow/passengerFlow.css" rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript" src="js/jquery.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/business.js"></script>
	  <script type="text/javascript" src="js/editor/tinymce.min.js"></script>
	  <script type="text/javascript" src="js/editor/langs/zh_CN.js"></script>
	  <script type="text/javascript" src="js/editor/langs/en_GB.js"></script>
	  <script type="text/javascript" src="js/editor/editor.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';var rdnum= '<%=new java.util.Random().nextInt(100000000) %>';</script>
	  <script type="text/javascript" src="page/statistics/passengerFlow/passengerFlow.js"></script>
	  <script type="text/javascript">

	       if(window.Event){//主流浏览器
	    	   
// 	    	   window.onunload = function(event){
			    window.onunload = function(event){//刷新或者关闭都有改操作
			    	 $.ajax({			    
						    type: "post",
						    url: 'statistics!closeExport.action',
						    data:{
						    	rd:rdnum,
						    	flag:'cvcvc'
						    }
						    
						   });
			        return ""; 
			    }
			}else{//非主流浏览
				window.onunload = function(event){
//	 			    window.onbeforeunload = function(event){//刷新或者关闭都有改操作
				    	 $.ajax({			    
							    type: "post",
							    url: 'statistics!closeExport.action',
							    data:{
							    	rd:rdnum,
							    	flag:'cvcvc'
							    }
							    
							   });
				        return ""; 
				    }
			}
   		 </script>
	  <style type="text/css">
	  
	    .x-panel-body-default{
	        
	    }
	    
	    .x_panel_backDD{
	        background: #D0FAF4; /* Old browsers */
			background: -moz-linear-gradient(left top, #D0FAF4 0%, #FEED83 100%); /* FF3.6+ */
			background: -webkit-gradient(linear, left top, right top, color-stop(0%,#D0FAF4),color-stop(100%,#FEED83)); /* Chrome,Safari4+ */
			background: -webkit-linear-gradient(left top, #D0FAF4 0%,#FEED83 100%); /* Chrome10+,Safari5.1+ */
			background: -o-linear-gradient(left top, #D0FAF4 0%,#FEED83 100%); /* Opera11.10+ */
			background: -ms-linear-gradient(left top, #D0FAF4 0%,#FEED83 100%); /* IE10+ */
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#D0FAF4', endColorstr='#FEED83',GradientType=1 ); /* IE6-9 */
			background: linear-gradient(left top, #D0FAF4 0%,#FEED83 100%); /* W3C */
	    }
	    
	    .x_panel_backTools{background: #EEF8D2}
	    .x_panel_backCenter{background: white}
	  </style>
  </head>
  <body></body>
</html>
