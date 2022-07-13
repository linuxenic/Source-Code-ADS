<%@page import="com.azld.core.BaseConstantKeys"%>
<%@ page language="java" import="java.util.*,com.azld.Config,com.azld.CacheUtil,net.sf.json.*,java.net.URLDecoder,java.net.URLEncoder,com.common.ConstantKeys,com.secure.SwitchLanguageCenter" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String currentLanguage =  String.valueOf(request.getSession().getAttribute(ConstantKeys.session_langType_key));

	//这里可不可以只加载当前页面只需要的一点点资源
	JSONObject languageConfig = JSONObject.fromObject(SwitchLanguageCenter.instance().getLanguageConfig(currentLanguage));
	String languageConfigStr = languageConfig.toString(); 
	String version = CacheUtil.getConfg().getConfigValue("version");
	String local = CacheUtil.getConfg().getConfigValue("local");
	String system_name = CacheUtil.getConfg().getConfigValue("system_name");
	String welcome = "action_product_name";
	if(local.equals("weishi")){
		welcome = "shiweiSuccView";
	}
	//去除ADS字眼
	String localValue = "";
	String names = "";
	if(local.indexOf("noads") != -1){
		 String[] arr = local.split("_");
		 localValue = arr[0];
		 if(arr.length > 1){
			 names = arr[1];
		 }
	}
	String welcomelau = "";
	if(!"".equals(system_name) && null!=system_name){
		JSONObject jsStr = JSONObject.fromObject(system_name);
		int num = 5;
		if("EN".equals(currentLanguage)){
			welcomelau = jsStr.getString("en");
			num = 3;
		}else{
			welcomelau = jsStr.getString("cn");
		} 
		//拼接去除ADS之后的信息
		if("noads".equals(localValue)){
			welcomelau = languageConfig.getString(names);
		}
		
		version = jsStr.getString("release");
	}else{
		welcomelau = languageConfig.get(welcome).toString();
	}
	
	String azldcenter = CacheUtil.getConfg().getConfigValue(BaseConstantKeys.SYSTEM_AZLDCENTER);
	boolean acenter = BaseConstantKeys.SYSTEM_AZLDCENTER.equalsIgnoreCase(azldcenter);
	
	boolean konka_auth = ConstantKeys.SYSTEM_LOCAL_KONKA_AUTH;
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE><%=languageConfig.get("title")+" "+welcomelau+" "+version%></TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <link rel="shortcut icon" type="image/ico" href="images/icon.ico" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="css/icon.css" rel="stylesheet" type="text/css" />
	  <link href="page/login/loginAD/login.css" rel="stylesheet" type="text/css" />
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/language.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/jquery.js"></script>
	  <script type="text/javascript">
	  	currentLanguage = <%=languageConfigStr%>;
	  	var welcomelau = '<%=welcomelau%>';
	  	var currentLangType = '<%=currentLanguage%>';
	  	var local="<%=local%>";
	  	var konauth=eval('<%=konka_auth%>');
	  	var basePath="<%=basePath%>";
		var arr,reg=new RegExp("(^| )"+"currentMode"+"=([^;]*)(;|$)");
 		if(arr=document.cookie.match(reg)){
	  		var currentMode =unescape(arr[2]);
	 	}else{
	  		var currentMode ="";
	 	}
 		var acenter=eval('<%=acenter%>');
	  </script>
	  <script type="text/javascript" src="page/login/loginAD/login.js"></script>
	  <script type="text/javascript" src="page/login/loginCommon.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';</script>
  </head>
 
   <body onresize="adapt()">
   		
   </body>
   <script type="text/javascript">
	  	
	</script>
</html>
