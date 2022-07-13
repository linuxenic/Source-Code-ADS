/** import
Ext.Loader.setConfig({ enabled: true }); 
Ext.require([ 
	 'Ext.form.Panel'
	,'Ext.form.field.Text'
]); */
//(function(){if(window.top !== window.self){ window.top.location = window.location;}})();
/** item manager */
//var isNew=true;
var Lnumber = /^[0-9a-zA-Z_]{6,18}$/;
Ext.apply(Ext.form.field.VTypes, {
    Lnumber: function(val, field) {
        return Lnumber.test(val);
    },
    LnumberText: window.top.getIi18NText('passwordWarming01') + ',' + window.top.getIi18NText('passwordWarming02')
});
var loginPanel;
var registerPanel;

function adapt() {
    var h = document.body.clientHeight;
    var paddTop = (h - 472) / 2;
    var dot = (paddTop > 0 ? paddTop : 0);
    $("#loginpanel").css("top", dot);
    $("#registerpanel").css("top", dot);
    var pd = (document.body.scrollHeight-472)/2;
    if(pd > 0){
    	Ext.getBody().setStyle({
    		"height":"100%"
    	});
    }else{
    	Ext.getBody().setStyle({
    		"height":"660px"
    	});
    }
}
Ext.onReady(function() {
    var AUTH = Ext.merge({
        'register': false
    }, Ext.decode(decode(AUTH_TBAR)));
    //手机与电脑版
    if (isWechatBrowser()) {
        window.location.replace("weixin!wxLogin.action");
        return;
    }
    var isRightVersion = window.ActiveXObject ? true : false; //区分ie11以下版本浏览器
    var supportTips = '<font color = "red" size = "2">' + getIi18NText('supportTips_par1') + '<br />' + getIi18NText('supportTips_par2') + '</font>';
    if (window.top !== window.self) {
        Ext.Msg.show({
            title: getIi18NText('systemMessage'),
            msg: getIi18NText('longTimesWarming'),
            icon: Ext.MessageBox.WARNING,
            buttons: Ext.MessageBox.OK,
            closable: false,
            buttonText: {
                ok: getIi18NText('loginAgain')
            },
            fn: function() {
                window.top.location = window.location;
            }
        });
        return;
    }
    Ext.tip.QuickTipManager.init();
    var unnecesary = (local == "kr");
    //add by 2016-03 login logo
    var loginLogoIconCss = getloginCss(local);
    // 1.start
    window.setTimeout(function() {
        initPage();
    }, 500);
    var commonTip = Ext.create('Ext.tip.ToolTip', {
        title: window.top.getIi18NText('systemMessage'),
        minWidth: 100,
        html: ''
    });
    var modEvent = function($this, newValue, oldValue, eOpts) {
        if (newValue == oldValue) {
            return;
        }
        //保存cookie
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "currentMode" + "=" + escape("old") + ";expires=" + exp.toGMTString();
        window.location.replace(window.location.href);
    };

    function lanchangefn(lanValue) {
        var teml = 'EN';
        if (getIi18NText('login') == '登录') { //判断当前什么语言
            Ext.getCmp('chLan').addCls('dangCls');
            Ext.getCmp('rchLan').addCls('dangCls');
            teml = 'CN';
        }
        if (lanValue == teml) {
            return;
        }
        Ext.getBody().mask('正在为您切换语言...');
        Ext.Ajax.request({
            url: 'auth!changeLang.action',
            method: 'post',
            params: {
                lang: lanValue,
                rand: new Date().getTime()
            },
            callback: function() {
                Ext.getBody().unmask();
                window.location.replace(window.location.href);
            }
        });
    }
    // 2.init
    function initPage() {
        var bodyHe = Ext.getBody().getHeight();
        var bodyWi = Ext.getBody().getWidth();
        Ext.getBody().setStyle({
            'background': 'url(images/systemVersion/Self/SelfModel.jpg) no-repeat',
            'backgroundSize': '100% 100%'
        });
        var paddLeft = 0;
        var paddTop = 0;
        var pXY = [(paddLeft > 0 ? paddLeft/*+100*/ : /*10*/0), (paddTop > 0 ? paddTop/*+50*/ : /*5*/0)];
        //2.create 登录面板
        loginPanel = Ext.create('Ext.panel.Panel', {
            width: 388,
            height: 472,
            hidden: false,
            style: "margin:0 auto; top:0px;",
            id: "loginpanel",
            shadow: false,
            border: false,
            layout: 'absolute',
            items: [{
                xtype: 'panel',
                width: 388,
                height: 472,
                x: pXY[0],
                y: pXY[1],
                baseCls: 'panelBodyCls'
            }, {
                xtype: 'image',
                imgCls: loginLogoIconCss,
                width: 87,
                height: 53,
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 25px 0px 0px 153px'
            }, {
            	xtype: 'label',
                text: welcomelau,
                width: 324,
                height: 44,
                id: 'welImage',
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 128px 0px 0px 32px;font-size:26px; font-family:STKaiti;'
            }, {
                xtype: 'panel',
                baseCls: 'lansecss',
                width: 318,
                height: 24,
                x: pXY[0],
                y: pXY[1],
                margin: '180px 0 0 32px',
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'middle'
                },
                items: [{
                    xtype: 'button',
                    text: '中文',
                    baseCls: 'lanCCls',
                    id: 'chLan',
                    hidden: unnecesary,
                    listeners: {
                        afterrender: function() {
                            if (getIi18NText('login') == '登录') { //判断当前什么语言
                                Ext.getCmp('chLan').addCls('dangCls');
                            }
                        }
                    },
                    handler: function() {
                        lanchangefn('CN');
                    }
                }, {
                    xtype: 'button',
                    text: 'English',
                    baseCls: 'lanECls',
                    id: 'enLan',
                    hidden: unnecesary,
                    listeners: {
                        afterrender: function() {
                            if (getIi18NText('login') == 'Login') { //判断当前什么语言
                                Ext.getCmp('enLan').addCls('dangCls');
                            }
                        }
                    },
                    handler: function() {
                        lanchangefn('EN');
                    }
                }]
            }, {
                xtype: 'panel',
                baseCls: 'inpuNcss',
                width: 318,
                height: 46,
                x: pXY[0],
                y: pXY[1],
                margin: '214px 0 0 32px',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [{
                    xtype: 'image',
                    imgCls: 'userCss',
                    width: 40,
                    height: 40
                }, {
                    xtype: 'textfield',
                    id: 'userName',
                    emptyText: getIi18NText('enterUsnTips'),
                    width: 270,
                    fieldStyle: 'border:none;font-weight: bold; font-size: 16px; font-family: -webkit-pictograph;background: transparent; ',
                    height: 35,
                    allowBlank: false,
                    blankText: getIi18NText('notNull'),
                    allowOnlyWhitespace: false,
                    maxLength: 100,
                    enforceMaxLength: true,
                    initEvents: function() {
                        var keyPress = function(e) {
                            var blockchars = ' ';
                            var c = e.getCharCode();
                            if (blockchars.indexOf(String.fromCharCode(c)) != -1) {
                                e.stopEvent();
                            }
                        };
                        this.el.on("keypress", keyPress, this);
                    }
                }]
            }, {
                xtype: 'panel',
                baseCls: 'inpuMcss',
                width: 318,
                height: 46,
                x: pXY[0],
                y: pXY[1],
                margin: '280px 0 0 32px',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [{
                    xtype: 'image',
                    imgCls: 'passCss',
                    width: 40,
                    height: 40
                }, {
                    xtype: 'textfield',
                    id: 'userPwd',
                    fieldStyle: 'border:none;font-weight: bold; font-size: 16px; font-family: -webkit-pictograph;background: transparent; ',
                    emptyText: getIi18NText('enterPswTips'),
                    inputType: 'password',
                    allowBlank: false,
                    blankText: getIi18NText('notNull'),
                    allowOnlyWhitespace: false,
                    fieldCls: 'fieldInputCls',
                    width: 270,
                    height: 35,
                    maxLength: 100,
                    enforceMaxLength: true,
                    listeners: {
                        render: function($this) {
                            $this.getEl().on('keydown', function(e, t) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    loginFn(Ext.getCmp('loginBu'));
                                }
                            });
                        }
                    },
                    initEvents: function() {
                        var keyPress = function(e) {
                            var blockchars = ' ';
                            var c = e.getCharCode();
                            if (blockchars.indexOf(String.fromCharCode(c)) != -1) {
                                e.stopEvent();
                            }
                        };
                        this.el.on("keypress", keyPress, this);
                    }
                }]
            }, {
                xtype: 'button',
                id: 'loginBu',
                text: getIi18NText('login'),
                border: false,
                baseCls: 'newloginIconCss',
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 356px 0 0 32px;',
                width: 318,
                height: 46,
                handler: loginFn
            }, {
                xtype: 'button',
                text: '<span style="text-decoration: underline">' + getIi18NText('regist') + '</span>',
                title: getIi18NText('message_down_apk'),
                x: pXY[0],
                y: pXY[1],
                hidden: !AUTH['register'],
                id: 'regist',
                baseCls: 'DownCls',
                style: 'margin: 410px 0 0 320px;',
                border: false,
                handler: function() {
                    toregist();
                }
            }, /*{
                xtype: 'button',
                text: '<span style="text-decoration: underline">' + getIi18NText('message_down_apk') + '</span>',
                title: getIi18NText('message_down_apk'),
                x: pXY[0],
                y: pXY[1],
                id: 'aDownload',
                baseCls: 'DownCls',
                style: 'margin: 410px 0 0 260px;',
                border: false,
                handler: function() {
                    downloadApk();
                }
            },*/ {
                xtype: 'panel',
                width: 388,
                height: 40,
                x: pXY[0],
                y: pXY[1] + 432,
                hidden: !isRightVersion,
                baseCls: '',
                html: supportTips
            }, {
                xtype: 'displayfield',
                id: 'displayTipField',
                fieldCls: 'tipFontCls',
                hidden: true,
                value: '',
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 332px 0 0 33px'
            }/*,{
            	xtype: 'image',
                imgCls: 'eweIconCss',
                width: 87,
                height: 87,
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 580px 0px 0px 150px'
            },{
            	border: false,
            	id: 'ewmid',
                html: "<img src='images/systemVersion/weChat/govIcon.png'><div class='cprt'>Copyright &copy; 2015 All Rights Reserved.<span class='cprtc'>版权所有:深证市安致兰德科技有限公司 粤ICP备16113070号</span></div>",
                style: 'margin: 725px 0px 0px 0px;background: transparent;'
            }*/],
            renderTo: document.body
        });
        //注册面板
        registerPanel = Ext.create('Ext.panel.Panel', {
            width: 388,
            height: 472,
            hidden: true,
            style: "margin:0 auto; top:0px;",
            id: "registerpanel",
            shadow: false,
            border: false,
            layout: 'absolute',
            items: [{
                xtype: 'panel',
                width: 388,
                height: 472,
                x: pXY[0],
                y: pXY[1],
                baseCls: 'panelBodyCls'
            }, {
                xtype: 'image',
                imgCls: loginLogoIconCss,
                width: 87,
                height: 53,
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 25px 0px 0px 153px'
            }, {
                xtype: 'panel',
                baseCls: 'lansecss',
                width: 338,
                border: false,
                height: 24,
                x: pXY[0],
                y: pXY[1],
                margin: '120px 0 0 0',
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'middle'
                },
                items: [{
                    xtype: 'button',
                    text: '中文',
                    baseCls: 'lanCCls',
                    id: 'rchLan',
                    hidden: unnecesary,
                    listeners: {
                        afterrender: function() {
                            if (getIi18NText('login') == '登录') { //判断当前什么语言
                                Ext.getCmp('rchLan').addCls('dangCls');
                            }
                        }
                    },
                    handler: function() {
                        lanchangefn('CN');
                    }
                }, {
                    xtype: 'button',
                    text: 'English',
                    baseCls: 'lanECls',
                    id: 'renLan',
                    hidden: unnecesary,
                    listeners: {
                        afterrender: function() {
                            if (getIi18NText('login') == 'Login') { //判断当前什么语言
                                Ext.getCmp('renLan').addCls('dangCls');
                            }
                        }
                    },
                    handler: function() {
                        lanchangefn('EN');
                    }
                }, {
                    xtype: 'button',
                    text: getIi18NText('login'),
                    baseCls: 'tlogin',
                    id: 'rtologin',
                    margin: '0 0 0 170px',
                    handler: function() {
                        tologin();
                    }
                }]
            }, {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'middle'
                },
                width: 318,
                height: 290,
                x: pXY[0],
                y: pXY[1],
                id: 'formMy',
                margin: '140px 0 0 32px',
                layout: {
                    type: 'vbox',
                    align: 'middle'
                },
                border: false,
                fileUpload: true,
                items: [{
                    xtype: 'panel',
                    id: 'registerform',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'middle'
                    },
                    defaults: {
                        labelAlign: 'right',
                        width: 310,
                        margin: '19px 0 0 0',
                        labelWidth: 70,
                        xtype: 'textfield',
                        labelCls: 'labelCls',
                        fieldBodyCls: 'fieldBodyCls',
                        baseCls: 'baseBodyCls',
                        enforceMaxLength: true,
                        allowBlank: false,
                        validateOnChange: false
                    },
                    items: [{
                        fieldLabel: window.top.getIi18NText('account'),
                        vtype: 'alphanum',
                        name: 'userName',
                        id: 'account',
                        allowBlank: false,
                        blankText: getIi18NText('notNull'),
                        maxLength: 100,
                        emptyText: getIi18NText('userregex')
                    }, {
                        fieldLabel: window.top.getIi18NText('nickname'),
                        name: 'nickName',
                        id: 'nickName',
                        allowBlank: false,
                        blankText: getIi18NText('notNull'),
                        maxLength: 100,
                        emptyText: getIi18NText('nickregex')
                    }, {
                        fieldLabel: window.top.getIi18NText('keyword2'),
                        vtype: 'Lnumber',
                        inputType: 'password',
                        name: 'userPwd',
                        id: 'keyword2',
                        allowBlank: false,
                        blankText: getIi18NText('notNull'),
                        maxLength: 100,
                        emptyText: getIi18NText('passwordWarming02')
                    }, {
                        fieldLabel: window.top.getIi18NText('tel'),
                        name: 'userTel',
                        id: 'tel',
                        allowBlank: false,
                        blankText: getIi18NText('notNull'),
                        regex: /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/,
                        regexText: window.top.getIi18NText('TelFormatTip'),
                        emptyText: getIi18NText('telregex')
                    }, {
                        fieldLabel: window.top.getIi18NText('justEmail'),
                        vtype: 'email',
                        name: 'userEmail',
                        id: 'userEmail',
                        allowBlank: false,
                        blankText: getIi18NText('notNull'),
                        maxLength: 100,
                        emptyText: getIi18NText('emailregex')
                    }]
                }, {
                    xtype: 'button',
                    id: 'registerBu',
                    text: getIi18NText('regist'),
                    border: false,
                    baseCls: 'newregisterIconCss',
                    x: pXY[0],
                    y: pXY[1],
                    style: 'margin: 20px 0 0 0;',
                    width: 318,
                    height: 46,
                    handler: function(btn) {
                        register(btn);
                    }
                }, {
                    width: 388,
                    height: 40,
                    x: pXY[0],
                    y: pXY[1] ,
                    hidden: !isRightVersion,
                    style: 'margin: 20px 0 0 0;',
                    html: supportTips
                }]
            }, {
                border: false,
                width: 318,
                html: '<span class="desizeCls decolorCls">' + getIi18NText('registmessage') + '</span><span class="desizeCls degreycolorCls">' + getIi18NText('registmessage2') + '</span><br/>' + '<span class="desizeCls degreycolorCls">' + getIi18NText('registmessage3') + '</span>',
                margin: '430 0 0 35'  /*'480 0 0 135'*/
            }/*,{
            	xtype: 'image',
                imgCls: 'eweIconCss',
                width: 87,
                height: 87,
                x: pXY[0],
                y: pXY[1],
                style: 'margin: 580px 0px 0px 150px'
            },{
            	border: false,
            	id: 'ewmid2',
                html: "<img src='images/systemVersion/weChat/govIcon.png'><div class='cprt'>Copyright &copy; 2015 All Rights Reserved.<span class='cprtc'>版权所有:深证市安致兰德科技有限公司 粤ICP备16113070号</span></div>",
                style: 'margin: 725px 0px 0px 0px;background: transparent;'
            }*/],
            renderTo: document.body
        });

        function adjust() {
            var h = document.body.clientHeight;
            var paddTop = (h - 472) / 2;
            var dot = (paddTop > 0 ? paddTop : 0);
            $("#loginpanel").css("top", dot);
            $("#registerpanel").css("top", dot);
            var pd = (document.body.scrollHeight-472)/2;
            if(pd > 0){
            	Ext.getBody().setStyle({
            		"height": "100%"
            	});
            }else{
            	Ext.getBody().setStyle({
            		"height":"660px"
            	});
            }
        }
        adjust();
        //3.event
        function loginFn(btn) {
            //1.
            var name = Ext.getCmp('userName');
            var pwd = Ext.getCmp('userPwd');
            var tip = Ext.getCmp('displayTipField');
            tip.show();
            tip.setValue('');
            tip.getEl().slideIn('t', {
                duration: 400,
                easing: 'backIn'
            });
            if (!name.isValid()) {
                name.getEl().frame();
                tip.setValue(getIi18NText('enterUsnTips'));
                return;
            }
            if (!pwd.isValid()) {
                pwd.getEl().frame();
                tip.setValue(getIi18NText('enterPswTips'));
                return;
            }
            tip.setValue(getIi18NText('checkLoginInfo'));
            name.setDisabled(true);
            pwd.setDisabled(true);
            btn.setDisabled(true);
            //2.
            window.setTimeout(function() {
                // 	 console.info("新模"+isNew);
                Ext.Ajax.request({
                    url: 'auth!loginUser.action',
                    method: 'post',
                    params: {
                        n: name.getValue().trim(),
                        p: pwd.getValue(),
                        mod: 'new1'
                    },
                    success: function(data, opt) {
                        if (data && !Ext.isEmpty(data.responseText)) {
                            var R = Ext.JSON.decode(data.responseText);
                            if (R.code == 0) {
                                tip.setValue(getIi18NText('loginSuccessTips'));
                                window.location.replace('auth!indexPage.action');
                                return;
                            } else if (R.code == 1) {
                                tip.setValue(getIi18NText('loginError02'));
                            } else if (R.code == 2) {
                                tip.setValue(getIi18NText('loginError01'));
                            } else if (R.code == 3) {
                                tip.setValue(getIi18NText('loginError03'));
                            } else if (R.code == 4) {
                                tip.setValue(getIi18NText('loginError06'));
                            } else if (R.code == 5) {
                                tip.setValue(getIi18NText('loginError07'));
                            } else {
                                tip.setValue(getIi18NText('loginError04'));
                            }
                        }
                        name.setDisabled(false);
                        pwd.setDisabled(false);
                        btn.setDisabled(false);
                    },
                    failure: function(data, opt) {
                        tip.setValue(getIi18NText('loginError05'));
                        name.setDisabled(false);
                        pwd.setDisabled(false);
                        btn.setDisabled(false);
                    }
                });
            }, 800);
        }
        var apkwindow;

        function downloadApk() {
            if (apkwindow) {
                apkwindow.show('aDownload');
                return;
            }
            apkwindow = Ext.create('Ext.panel.Panel', {
                width: 300,
                title: getIi18NText('message_down_apk'),
                height: 220,
                header: true,
                modal: true,
                floating: true,
                draggable: true,
                closable: true,
                border: true,
                shadowOffset: 15,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'button',
                    text: 'Professional V4.0',
                    scale: 'large',
                    width: 180,
                    margin: 10,
                    handler: function() {
                        window.location = "images/app/player4.4.apk";
                    }
                }, {
                    xtype: 'button',
                    text: 'General V4.0',
                    scale: 'large',
                    width: 180,
                    margin: 10,
                    hidden: unnecesary,
                    handler: function() {
                        window.location = "images/app/player.apk";
                    }
                }],
                closeAction: 'hide'
            });
            apkwindow.show('aDownload');
        }
        //切换到注册
        function toregist() {
            loginPanel.hide();
            registerPanel.show();
        }
        //切换到登录
        function tologin() {
            registerPanel.hide();
            loginPanel.show();
        }
        //注册新的账号
        function register(btn) {
            var form = btn.up('form');
            if (!form || !form.isValid()) {
                showTip(btn, window.top.getIi18NText('inputAll'));
                return;
            };
            registerPanel.getEl().mask(window.top.getIi18NText('monitor_message_31'));
            form.submit({
                url: 'auth!saveMyUser.action',
                params: {
                    userType: 5
                },
                success: function(f, action) {
                    registerPanel.getEl().unmask();
                    var msg = action.result.msg;
                    if (action.result.code == 0) {
                        Ext.Msg.alert(window.top.getIi18NText('systemMessage'), window.top.getIi18NText('registerSuccess'), function() {
                            Ext.getCmp('formMy').form.reset();
                            tologin();
                        });
                        return;
                    }
                    Ext.Msg.alert(window.top.getIi18NText('systemMessage'), msg);
                },
                failure: function(form, action) {
                    Ext.Msg.alert(getIi18NText('systemMessage'), getIi18NText("loginTimeoutTip01"), function() {
                        window.location.replace("auth!logOffUser.action");
                    });
                }
            });
        }

        function showTip(comp, msg) {
            commonTip.update(msg);
            commonTip.showBy(comp, null, [50, -60]);
            comp.addListener('mouseout', function() {
                commonTip.hide();
            });
        }
    }
});