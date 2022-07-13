var currentLanguage = {};

//function getIi18NText(key){
//	return currentLanguage[key]?currentLanguage[key]:"";
//}
function getIi18NText(key,value){
	var str = '';
	if(key!=null&&currentLanguage[key]){
		  str = currentLanguage[key];
		  for(var i=1; i<arguments.length; i++){
			  if(typeof(arguments[i]) != "undefined" ){
				  str = str.replace("{#}",arguments[i]);
			  }
		  }
		  str = str.replace("\\n","");
	}
	return str;
}
function minConvertDayHourMin(min) {
		var html = "0分钟";
		if (min != null) {
			var m = parseFloat(min);
			var array = new Array() ;
			var days = parseInt((m / (60 * 24)));
			var hours = parseInt( (m / (60) - days * 24));
			var minutes = parseInt((m - hours * 60 - days * 24 * 60));
			if (days >0) {
				html = days+getIi18NText('tian')+hours+getIi18NText('xiaoshi')+minutes+getIi18NText('min');
			} else if (hours >0) {
				html = hours+getIi18NText('xiaoshi')+minutes+getIi18NText('min');
			} else {
				html = minutes
			}
		}
		return html;
}

function getMsgIi18NText(value){
	
//	console.log(value);
	if(value!=null&&currentLanguage[value[0]]){
		 
		  str = currentLanguage[value[0]];
		  for(var i=1; i<value.length; i++){
		  	if (value[0]=='deviceOfflineTips2' || value[0]=='message41') {
				str = str.replace("{#}",i==2?minConvertDayHourMin(value[i]):value[i]);
		 	} else {
			  str = str.replace("{#}",value[i]);
		 	}
		  }
		  str = str.replace("\\n","");
	}
	return str;
}

function getDynIi18NText(key,value){
	return currentLanguage[key].replace('{0}',value);
}

function getItemIi18NText(key,value){
	return "azld:"+ currentLanguage[key].replace('{0}',value);
}
//角色权限竖标题
function getIi18NRoleManagerTitle(key){
	var title = currentLanguage[key];
	var charArr = title.split('');
	for(var i=charArr.length-1;i>=0;i--){
		charArr[i] = '<span class="selft_transformSpan">'+charArr[i]+'</span>'
	}
	return charArr.join('');
}