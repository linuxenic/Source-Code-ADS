<%@ page language="java" import="java.util.*,com.azld.Config,com.azld.CacheUtil,net.sf.json.*,java.net.URLDecoder,java.net.URLEncoder,com.common.ConstantKeys,com.secure.SwitchLanguageCenter" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	
	String locals = CacheUtil.getConfg().getConfigValue("local");
	String currentLanguage =  String.valueOf(request.getSession().getAttribute(ConstantKeys.session_langType_key));
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE>系统信息</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/system/infor/systemInfor.css"  rel="stylesheet" type="text/css" />
	  <link href="js/ext/examples/shared/example.css" rel="stylesheet" type="text/css" />
	  
	  <script type="text/javascript">
	  		var currentLangType = '<%=currentLanguage%>';
			//获取noads_   版本信息
	  		var local="<%=locals%>";
	  		var localValue = "";
	  		var names = "";
	  		if(local.indexOf("noads") != -1){
	  			 var arr = local.split("_");
	  			 localValue = arr[0];
	  			 if(arr.length > 1){
	  				 names = arr[1];
	  			 }
	  		}
	  </script>
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="page/system/infor/systemInfor.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';</script>
  </head>
  <body></body>
</html>
