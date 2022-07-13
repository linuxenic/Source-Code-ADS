<%@ page language="java" contentType="text/html; charset=utf-8"  pageEncoding="utf-8"%>
<%@ taglib prefix="ads" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
      <base href="<%=basePath%>" />
	  <TITLE>Sell Meal</TITLE>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	  <meta http-equiv="Expires" content="0"/>
	  <meta http-equiv="X-UA-Compatible" content="IE=10" />
	  <link rel="shortcut icon" type="image/ico" href="images/icon.ico" />
</head>
<body>
    <!-- ${ zf_user.cert == false ? "已实名" : "未实名"} -->
    <ads:choose>
       <ads:when test="${not empty zf_user && not empty  zf_user.aliUid}"> 
	           <h3>欢迎访问ADS共享无人售卖机！</h3>
		              头像：<img src="${zf_user.headIcon}"  style="max-width: 200px; max-height: 200px;"/><br/>
		       ID: ${zf_user.aliUid} <br/>
		              妮称: ${zf_user.name}<br/>
                                    认证: ${ zf_user.cert == true ? "已实名" : "未实名"}   <br/>
                          机器编号: ${ zf_user.vname }   <br/>	 
       </ads:when>
       <ads:otherwise>
           <h4>未获取到用户信息！</h4>
       </ads:otherwise>
    </ads:choose>
   
</body>
</html>