<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String code = String.valueOf( request.getAttribute("code") );
	String msg  = String.valueOf( request.getAttribute("msg") );
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE>微信登陆绑定</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  
       <meta name="viewport" content="width=device-width, initial-scale=1.0,"/>
	  <link rel="shortcut icon" type="image/ico" href="images/icon.ico" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/auth/qrlogin/qrbind.css" rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript" src="js/jquery.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/business.js"></script>
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
	     .x_panel_backDD .x-panel-body-default{
		         background-color: transparent; 
		 }
	  </style>

	   
	  
  </head>
  <body>
       <%
	    //如果请求正常 则加载js
	    if("0".equals(code) || "2".equals(code)){
	   %>
		  <script type="text/javascript">var BASEPATH = '<%=basePath%>';var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';var code='<%=code%>';var msgdata = '<%=msg%>';</script>
		  <script type="text/javascript" src="page/auth/qrlogin/qrbind.js"></script>
	   <%
	    }else{%>
    
        ERROR : <%=code %>[<%=msg %>]
         
   <%}%>
  </body>
</html>
