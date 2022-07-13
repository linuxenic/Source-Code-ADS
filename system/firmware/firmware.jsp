<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE>固件版本管理</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/system/firmware/firmware.css" rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript" src="js/jquery.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/business.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';</script>
	  <script type="text/javascript" src="page/system/firmware/firmware.js"></script>
  </head>
  <body></body>
</html>
