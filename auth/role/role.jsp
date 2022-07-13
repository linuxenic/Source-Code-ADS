<%@ page language="java" import="java.util.*,com.azld.CacheUtil" pageEncoding="utf-8"%>
<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@page import="net.sf.json.JSONObject"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String system_name = CacheUtil.getConfg().getConfigValue("system_name");
	String local = CacheUtil.getConfg().getConfigValue("local");
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
	  <TITLE>角色管理</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/auth/role/role.css" rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/business.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';var localVersion= '<%=localVersion%>';var local = '<%=local%>';</script>
	  <script type="text/javascript" src="page/auth/role/role.js"></script>
	  <script type="text/javascript" src="page/auth/role/role_appendA.js"></script>
  </head>
  <body></body>
</html>
