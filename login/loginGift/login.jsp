<%@ page language="java" import="java.util.*,com.bean.Config,com.common.CacheUtil,net.sf.json.*,java.net.URLDecoder,java.net.URLEncoder,com.common.ConstantKeys,com.secure.SwitchLanguageCenter" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String currentLanguage =  String.valueOf(request.getSession().getAttribute(ConstantKeys.session_langType_key));
//	JSONObject languageConfig = null;
//	String languageConfigStr = null;
//	if(currentLanguage.equals("EN")){
//		languageConfig =  JSONObject.fromObject(CacheUtil.getENLanguageConfig().getConfigMap());
//		session.setAttribute("currentLanguageJSON", languageConfig);
//	}

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
	String welcomelau = "";
	if(!"".equals(system_name) && null!=system_name){
		JSONObject jsStr = JSONObject.fromObject(system_name);
		if("EN".equals(currentLanguage)){
			welcomelau = jsStr.getString("en");
		}else{
			welcomelau = jsStr.getString("cn");;
		}  
		version = jsStr.getString("release");
	}else{
		welcomelau = languageConfig.get(welcome).toString();
	}
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>"> 
	  <TITLE><%=languageConfig.get("title")+" "+welcomelau+" "+version%></TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link rel="shortcut icon" type="image/ico" href="images/icon.ico" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="css/icon.css" rel="stylesheet" type="text/css" />
	  <link href="page/login/loginGift/login.css" rel="stylesheet" type="text/css" />
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/language.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="js/jquery.js"></script>
	  <script type="text/javascript">
	  	currentLanguage = <%=languageConfigStr%>;
	  	var welcomelau = '<%=welcomelau%>';
	  	var currentLangType = '<%=currentLanguage%>';
	  	var local="<%=local%>";
	  	var basePath="<%=basePath%>";
		var arr,reg=new RegExp("(^| )"+"currentMode"+"=([^;]*)(;|$)");
 		if(arr=document.cookie.match(reg)){
	  		var currentMode =unescape(arr[2]);
	 	}else{
	  		var currentMode ="";
	 	}
	  </script>
	  <script type="text/javascript" src="page/login/loginGift/login.js"></script>
	  <script type="text/javascript">var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';</script>
  </head>
   <body onresize="adapt()"></body>
</html>
