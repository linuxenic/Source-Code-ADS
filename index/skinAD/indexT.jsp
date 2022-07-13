<%@page import="com.azld.core.BaseConstantKeys"%>
<%@ page language="java" import="java.util.*,com.azld.Config,com.azld.CacheUtil,net.sf.json.*,java.net.URLDecoder,java.net.URLEncoder,com.common.ConstantKeys,com.secure.SwitchLanguageCenter" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String currentLanguage =  String.valueOf(request.getSession().getAttribute(ConstantKeys.session_langType_key));
	JSONObject languageConfig = JSONObject.fromObject(SwitchLanguageCenter.instance().getLanguageConfig(currentLanguage));
	String languageConfigStr = languageConfig.toString();
	String version = CacheUtil.getConfg().getConfigValue("version");
	String version_xm = CacheUtil.getConfg().getConfigValue("version_xm");
	String system_name = CacheUtil.getConfg().getConfigValue("system_name");
	String local = CacheUtil.getConfg().getConfigValue("local");
	String welcome = "action_product_name";
	String netSource = CacheUtil.getConfg().getConfigValue("open_access_token");
	boolean flagNet = false;
	boolean flagInter = false;
	if(!"".equals(netSource) && null!=netSource && netSource.equals("azld")){
		flagInter = true;
	}
	String system_version = "";
	if(local.equals("weishi")){
		welcome = "shiweiSuccView";
	}
	if(!"".equals(netSource) && null!=netSource && netSource.equals("access_token")){
		flagNet = true;
	}
	
	/**帮助文档配置*/
	String helpSource = CacheUtil.getConfg().getConfigValue("helper_url");
	boolean	flagHelp=false;
	if(!"".equals(helpSource) && null!=helpSource && helpSource.equals("help")){
		flagHelp = true;
	}
	/**去除ADS字眼*/
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
		system_version = jsStr.getString("version");
		int num =5;
		if("EN".equals(currentLanguage)){
			welcomelau = jsStr.getString("en");
			num = 3;
		}else{
			welcomelau = jsStr.getString("cn");;
		} 
		version = jsStr.getString("release");
		if("noads".equals(localValue)){
			welcomelau = languageConfig.getString(names);
		}
	}else{
		welcomelau = languageConfig.get(welcome).toString();
	}
	String helpBTN = languageConfig.get("useHelp").toString();
	
	//add by 2019-01
	String azldcenter = CacheUtil.getConfg().getConfigValue(BaseConstantKeys.SYSTEM_AZLDCENTER);
	boolean acenter = BaseConstantKeys.SYSTEM_AZLDCENTER.equalsIgnoreCase(azldcenter);
%>
<!DOCTYPE html>
<html>
  <head>
      <base href="<%=basePath%>" />
	  <TITLE><%=languageConfig.get("title")+" "+welcomelau+" "+version%></TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link rel="shortcut icon" type="image/ico" href="images/icon.ico" />
	  <link href="css/base.css" rel="stylesheet" type="text/css" />
	  <link href="page/index/skinAD/indexT.css" rel="stylesheet" type="text/css" />
	  <link href="page/index/bootstrap.min.css" rel="stylesheet" type="text/css" />
	  <link href="page/index/webSocket/webSocket.css" rel="stylesheet" type="text/css" />
	  <link rel="stylesheet" type="text/css" href="page/source/file/webupload/uploader.css" />
	   <link href="js/ext/examples/shared/example.css"  rel="stylesheet" type="text/css" />
	  <link href="page/index/indexCommon.css" rel="stylesheet" type="text/css" />
	    <!--  intro-2.4.js -->
	   <link href="css/introjs/introjs.css""  rel="stylesheet" type="text/css" />
	   <link href="css/introjs/bootstrap-responsive.min.css""  rel="stylesheet" type="text/css" />
	   <link href="css/introjs/introjs-nassim.css""  rel="stylesheet" type="text/css" />
	  <script type="text/javascript" src="bootstrap-3.3.5-dist/js/jquery-1.11.3.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/include-ext.js"></script>
	  <script type="text/javascript" src="js/ext/examples/shared/examples.js"></script>
	  <script type="text/javascript" src="js/language.js"></script>
	  <script type="text/javascript" src="page/index/helpData.js"></script>
	  <script type="text/javascript" src="bootstrap-3.3.5-dist/js/bootstrap.js"></script>
	  
	  <script type="text/javascript" src="page/index/indexCommon.js"></script>
	  <script type="text/javascript" src="page/index/index_progress.js"></script>
	  <!--  intro-2.4.js -->
	  <script type="text/javascript" src="js/introjs/intro.js""></script>
	  <!-- 引用webSocket JS  -->
	  <script type="text/javascript">
	  var stmver = '<%=system_version%>';
	  var getFromNet = '<%=flagNet%>';
	  var isInter = '<%=flagInter%>'; 
	  var getFromHelp = '<%=flagHelp%>';
	  var AUTH_TBAR  = '<%=request.getAttribute("auth")%>';
	  var serverPort = '<%=request.getServerPort()%>';
	  var serverPath = '<%=request.getServerName()+":"+request.getServerPort()+path+"/"%>';
	  var flag = 0;
	  		currentLanguage = <%=languageConfigStr%>;
	  		var langtype = '<%=currentLanguage%>';
	  		var local= '<%=local%>';
	  		 
	  </script>
	  <script type="text/javascript" src="page/index/webSocket/webSocket.js"></script>
	  <script type="text/javascript" src="js/tool.js"></script>
	  <script type="text/javascript" src="page/source/file/webupload/uploader.js"></script>
	  <script type="text/javascript" src="page/source/file/webupload/jquery.js"></script>
	  <script type="text/javascript" src="page/source/file/webupload/webuploader.js"></script>
	  <script type="text/javascript" src="page/source/file/webupload/tbarUtil.js"></script>
	  <script type="text/javascript" src="page/source/file/webupload/UUID.js"></script>
	  <script type="text/javascript">
	  		var SESSIONID = '<%=request.getSession().getId()%>';
	  		var USERID = '<%=request.getSession().getAttribute("loginUser_Id_session_key")%>';
	  		var BASEPATH = '<%=basePath%>';
	  		var version_xm="<%=local%>";
	  		version_xm=version_xm=="xm";
	        var isintro=<%=request.getAttribute("intro")%>;//是否开启引导
	        var hasAuth=<%=request.getAttribute("hasAuth")%>;//是否修改授权权限
	        var istercode=<%=request.getAttribute("registerCode")%>;//是否能修改免注册
	        var isFirst=<%=request.getSession().getAttribute("isFirst")%>;//当前用户是否第一次登陆
	        //临时授权剩余时间：有："6#20#20" 无："null"
	        var leftTime="<%=request.getAttribute("leftTime")%>";
	  		var welcomeTips='<%=welcomelau%>';
	  		var local='<%=local%>';
	  		var acenter=eval('<%=acenter%>');
	  		var admin=<%=request.getAttribute("admin")%>;//是否是超管
	  		//console.log('acenter',acenter,'admin',admin);
	  </script>
	  
	  <script type="text/javascript" src="page/index/skinAD/indexT.js"></script>
  </head>
  
  <BODY class="indexContentDiv">
        <div id="contentDiv" style="height:100%;">
         		<input type="text" id="flagId" value="0"  hidden="true"/>
		         <!-- logo -->
                <!-- <div class="logoCss" id="logoDiv"></div>  -->
                
				 <!-- user -->
		     	 <div class="userHeadCss" id="userHead_div">
				      <input type="hidden" value="${name}" id="nowPickName"/>
				      <input type="hidden" value="${uName}" id="userName"/>
				      <input type="hidden" value="${src}" id="iconSrc"/>
				       <input type="hidden" value="images/message/message01.png" id="messageIconSrc"/>
				  	<!-- <p class="lintime" id="lintime" title="">临时授权剩余时间:<span id="lefttime">07天00时00分</span></p> -->
				       <p class="lintime" id="lintime"  title="<%=languageConfig.get("lintitle")%>"  ></p>
					  <ul class="uCss">
					     <li id="userImgLi"></li>
					  </ul>
				      <ul class="nCss">
					     <li class="mCss" id="messageIcon"> <font class="totalNumberCss" id="totalNumber"></font> </li>
					     <li class="nameCss" id="showUserName"></li>
						 <li class="groupNameCss" id="showUserGroupName"></li>
					  </ul>
				 </div> 

				 <!-- content -->
				 <div id="contentAppAreaDiv" class="appAreaDivCss"></div>
				 
				 <!--GZE 添加终端信息  -->
                 <div class="terminalInfo" id="terminalInfo"> 
                 
					<ul class="bodyInfo">
						<li id="sysInfo" class="sysInfo"></li>
						<li id="onlineTer" class="onlineTer terin lisCo" ></li>
						<li  id="offlineTer" class="offlineTer terin lisCo"></li>
						<!-- <li  id="activeNum" class="activeNum terin lisCo"></li> -->
						<li  id="activePro"  class="activePro terin lisCo"></li>
						<li id="norPro" class="norPro terin lisCo"></li>
						<li id="weiPro" class="weiPro terin lisCo"></li>
											</ul> 
					<ul>
						<li id="lishi" class="lishi"></li> 
							</ul>               
					<ul>
						<li class="rigist" id="rigist"></li>
					</ul>                
                 	
                 </div>
                 
               <!--  JP 视频请求提示 -->
               <div id="message">
					<center>
					<div class="info"></div>
					<button style="position:absolute;bottom:5px;left:80px;" id="accept" class="accept btn-1 bubu">是</button>
					<button style="position:absolute;bottom:5px;left:170px;" id="refuse" class="refuse btn-1 bubu">否</button>
					</center>
				</div>
				
				<!-- 测试 -->
				<!-- <div id="test1" style="position:absolute;bottom:25px;right:80px;">
					<input type="button" onclick="sendqing()" value="随机用户请求">
				</div> -->
				<!-- 视频请求列表 -->
				<div id="messagelist">
					<table class="tacss table table-bordered table-striped" style="width:275px;">
					    <thead>
						    <tr>
						         <th class="tatype">类型</th>
						         <th class="tatid">终端</th>
						         <th class="tado">操作</th>
						    </tr>
					    </thead>
					    <tbody>
					        
					    </tbody>
					</table>
				</div> 
        </div>  
		<div id="bigtitle" class="bigtitle"><%=welcomelau%></div>
		<div id="azldlogo_title">&nbsp;</div>
        <!-- appIframe area -->
		<div  id="appIFrame"  style="display: none">
			       <TABLE class="cTable">
					  <TR>
						<TD class="left_top"></TD>
						<TD class="top_X"></TD>
						<TD class="right_top"></TD>
					  </TR>
					  <TR>
						<TD class="left_Y"></TD>
						<TD class="center_middle" style="height:480px;">
							 &nbsp;
						</TD>
						<TD class="right_Y"></TD>
					  </TR>
					  <TR>
						<TD class="left_down"></TD>
						<TD class="bottom_X"></TD>
						<TD class="right_down"></TD>
					  </TR>
				  </TABLE>
	    </div>

	    <!-- left bar-->
		<div class="leftBarCss" id="leftBarDiv"></div> 
		<div class="sysSetCss" id="sysSet"></div> 
		<div id = "bottomBtn1" class="bottomBtn" style="position:absolute;bottom:40px;right:60px;"><button class="btn btn-primary" id="usingHelp" type="button" onclick="window.open('http://doc.azld.net')"><%=helpBTN %></button><div>
		<script type="text/javascript">
	  		if(local == "noads_konka"){
	  			 $("#bottomBtn1").hide();
  			}
		</script>
 </BODY>
</html>