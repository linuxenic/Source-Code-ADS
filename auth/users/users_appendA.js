function iconfileChange(g,e,b){var d=g.getEl().down("input[type=file]").dom;var c=d.files[0];var a=c.name.substring(c.name.lastIndexOf(".")+1).toLowerCase();if(c.type.indexOf("image")==-1){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("avatarChooseWarming01",'<font color="red">'+c.name+"</font>"));return}if(c.size>51200){Ext.Msg.alert(window.top.getIi18NText("systemMessage"),window.top.getIi18NText("avatarChooseWarming02",'<font color="red">'+c.name+"</font>"));return}Ext.getCmp(extFileRegistId.substring(0,extFileRegistId.lastIndexOf("-"))).setValue("");previewImage(d,extFileRegistId)}function renderFileControl(b){var c=[];var a=b.getEl().down("input[type=file]");a.dom.setAttribute("accept",c.join(","))}function previewImage(e,d){var f={top:0,left:0,width:64,height:64};var b=document.getElementById(d);if(e.files&&e.files[0]){var c=document.getElementById(d);c.onload=function(){c.width=f.width;c.height=f.height};var a=new FileReader();a.onload=function(i){c.src=i.target.result};a.readAsDataURL(e.files[0])}else{var h='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';var g=document.selection.createRange().text;status=("rect:"+f.top+","+f.left+","+f.width+","+f.height);b.outerHTML="<div id='"+d+"' style='width:"+f.width+"px;height:"+f.height+"px;"+h+g+"\"'></div>"}};