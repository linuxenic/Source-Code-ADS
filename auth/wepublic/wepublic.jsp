<%@ page language="java" import="java.util.*, com.common.CacheUtil" pageEncoding="utf-8"%>
<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@page import="net.sf.json.JSONObject"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String local = CacheUtil.getConfg().getConfigValue("local");
	String system_name = CacheUtil.getConfg().getConfigValue("system_name");
	String localVersion ="";
	if(StringUtils.isNotBlank(system_name)){
		JSONObject json = JSONObject.fromObject(system_name);
		if(json.containsKey("version")){
			localVersion = json.getString("version");
		}
	}
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE>微信公众号管理</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/auth/wepublic/wepublic.css" rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/business.js"></script>
	  <script type="text/javascript" src="page/auth/wepublic/wepublic.js"></script>
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
	  <script type="text/javascript">
		  var localVersion="<%=localVersion%>";
		  var orVersion = (localVersion=="order");
	  </script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';</script>
	  <script type="text/javascript">var BASEPATH = '<%=basePath%>';</script>
  </head>
  <body>
  </body>
</html>
