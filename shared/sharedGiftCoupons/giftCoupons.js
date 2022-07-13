Ext.onReady(function () {

    Ext.QuickTips.init();
    var isEng = window.top.langtype == "EN";
    var AUTH = Ext.merge({
        "delete": false,
        add: false,
        update: false,
        "self": true,
        admin: false
    }, Ext.decode(decode(AUTH_TBAR)));
    var commonTip = Ext.create('Ext.tip.ToolTip', {
        title: window.top.getIi18NText('systemMessage')
        , minWidth: 100
        , html: ''
    });

    function showTip(comp, msg) {
        commonTip.update(msg);
        commonTip.showBy(comp, null, [50, -60]);
        comp.addListener('mouseout', function () {
            commonTip.hide();
        });
    }

    var giftCouponViewport, giftCouponGridPanel, giftCouponDataStore, giftCouponCtrColumn, giftCouponAjaxProxy,
        giftCouponWin, rankingWin, rankingGridPanel, rankingDataStore, rankingAjaxProxy, rankingSelModel;
    var userIds = new Ext.util.MixedCollection(),is2Coupon = false;
    var dateFormat='Y/m/d H:i:s';
    giftCouponCtrColumn = {
        text: window.top.getIi18NText('operation'),
        minWidth: 110,
        maxWidth: 130,
        menuText: window.top.getIi18NText('operation'),
        menuDisabled: true,
        hidden: true,
        sortable: false,
        draggable: false,
        resizable: false,
        xtype: 'actioncolumn',
        items: []
    };
    // if (AUTH["update"]) {
    //     giftCouponCtrColumn.items.push({
    //         iconCls: 'editIconCss'
    //         , tooltip: window.top.getIi18NText('modify')
    //         ,handler:  editGiftCoupon
    //     });
    //     giftCouponCtrColumn.hidden = false;
    // }

    if (AUTH["delete"]) {
        giftCouponCtrColumn.items.push({
            iconCls: 'removeIconCss'
            , tooltip: window.top.getIi18NText('delete')
            ,handler:  delGiftCoupon
        });
        giftCouponCtrColumn.hidden = false;
    }
    function delGiftCoupon(v, r, c, i, e, record, row){
        var status = record.get('status');
        if(status === 1){
            showTip(this,getIi18NText('cannoot_del_gift_coupon_tip'));
        }else{
            var ids = record.get('id');
            Ext.Msg.show({
                icon: Ext.MessageBox.QUESTION,
                title: getIi18NText('systemMessage'),
                cls: 'msgCls',
                msg: getIi18NText("del_gift_coupon_tip"),
                plain: true,
                buttons: Ext.MessageBox.OKCANCEL,
                buttonText: {ok: getIi18NText("monitor_message_55"), cancel: getIi18NText("monitor_message_32")},
                fn: function (bid, text, opt) {
                    if (bid === 'ok') {
                        Ext.Ajax.request({
                            url: 'shared!delGiftCouponRecord.action'
                            , method: 'post'
                            ,params: {ids: ids}
                            , callback: function (opt, success, res) {
                                var result = showResult(success, res);
                                if (result === false) return;
                                Ext.example.msg(getIi18NText('operationResultTip'), getIi18NText("deleteWebSourceSuccess"));
                                searchFn();
                            }
                        });
                    }
                }
            });
        }
    }

    giftCouponViewport = Ext.create("Ext.container.Viewport", {
        layout: 'border',
        renderTo: Ext.getBody(),
        border: false,
        style: 'background:white',
        items: [{
            region: 'north',
            height: 40
            , width: 400
            , id: 'northContanier'
            , layout: {type: 'hbox', align: 'middle', defaultMargins: {right: 3}}
            , bodyCls: 'x_panel_backDD'
            , items: [
                {
                    xtype: 'image',
                    src: '',
                    width: 40,
                    height: 24,
                    imgCls: 'searchIconCss',
                }, {
                    xtype: 'datefield',
                    fieldLabel: getIi18NText("beCreatedTimne"),
                    margin: '8 2 5 25',
                    name: 'btime'
                    , labelWidth: 80
                    , editable: false
                    , format: 'Y/m/d'
                    , width: 190
                    , id: 'btime'
                    , emptyText: getIi18NText("startTime")
                }, {
                    xtype: 'datefield',
                    name: 'etime'
                    , id: 'etime'
                    , width: 110
                    , editable: false
                    , format: 'Y/m/d'
                    , emptyText: getIi18NText("endTime")
                }, {
                    fieldLabel: window.top.getIi18NText('name')
                    , id: 'searchText'
                    , xtype: 'textfield'
                    , width: 320
                    , labelWidth: 40
                    , margin: '8 2 5 43'
                    , emptyText: window.top.getIi18NText('gift_coupons_search_text')
                }, {
                    xtype: 'button'
                    , margin: isEng === true ? '8 2 5 100' : '8 2 5 3'
                    , iconCls: 'queryIconCss'
                    , width: 70
                    , text: getIi18NText("select")
                    , handler: searchFn
                }
            ]
        }, {
            region: 'center'
            , border: false
            , layout: 'fit'
            , listeners: {
                render: renderGiftCouponTable
            }
        }]
    });

    function renderGiftCouponTable($this, eopt) {
        giftCouponAjaxProxy = getAjaxProxy({url: 'shared!getAllGiftCouponRecord.action'});
        giftCouponDataStore = Ext.create('Ext.data.Store', {
            fields: ["id","cguid","creator","createDate","modifyDate","state","couponId","couponName","couponCode","userId","nickName","userCode","status"],
            buffered: false,
            autoLoad: true,
            pageSize: 10,
            leadingBufferZone: 50,
            proxy: giftCouponAjaxProxy
            , listeners: {}
        });
        giftCouponGridPanel = Ext.create("Ext.grid.Panel", {
            title: window.top.getIi18NText('gift_coupons_record'),
            iconCls: 'tabIconCss',
            store: giftCouponDataStore,
            frame: false,
            border: false,
            forceFit: true,
            autoScroll: true,
            columns: {
                items: [
                    {text: getIi18NText("No"), width: 40, xtype: 'rownumberer', align: 'center'},
                    {text: getIi18NText('wechatName'), dataIndex: 'nickName', minWidth: 150, flex: 1, align: 'center'},
                    {text: getIi18NText('userCode'), dataIndex: 'userCode', minWidth: 150, flex: 1, align: 'center'},
                    {
                        text: getIi18NText('coupon_name'),
                        dataIndex: 'couponName',
                        minWidth: 100,
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: getIi18NText('coupon_code'),
                        dataIndex: 'couponCode',
                        minWidth: 100,
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: getIi18NText("lastUpdateTime"),
                        dataIndex: 'modifyDate',
                        minWidth: 140,
                        align: 'center',
                        renderer: dateFmtRender
                    },
                    {
                        text: getIi18NText("status"),
                        dataIndex: 'status',
                        minWidth: 140,
                        align: 'center',
                        renderer: statusFmtRender
                    },
                    giftCouponCtrColumn
                ],
                defaults: {
                    menuDisabled: true,
                    sortable: false,
                    draggable: false,
                    align: 'center'
                }
            },
            bbar: [{
                xtype: 'pagingtoolbar',
                store: giftCouponDataStore,
                border: false,
                displayInfo: true
            }],
            margin: 1
            , tools: [{
                xtype: 'button',
                tooltip: window.top.getIi18NText('addCoupons'),
                tooltipType: 'title',
                text: window.top.getIi18NText('add'),
                border: false,
                hidden: !AUTH["add"],
                iconCls: 'addIconCss',
                margin: '0 5 0 0',
                handler: openGiftCouponWin
            }, {
                xtype: 'button',
                tooltipType: 'title',
                text: window.top.getIi18NText('refresh'),
                border: false,
                iconCls: 'refreshIconCss',
                handler: searchFn
            }
            ]
            , viewConfig: {
                trackOver: false
                , disableSelection: false
                , emptyText: '<h1 style="margin:10px">' + window.top.getIi18NText('roleTip05') + '</h1>'
            }
        });

        $this.add(giftCouponGridPanel);
    }

    function dateFmtRender(value) {
        return Ext.Date.format(new Date(value), dateFormat);
    }

    function statusFmtRender(value) {
        switch (value) {
            case 0:	//未使用
                return getIi18NText('unused');
            case 1:	//已使用
                return getIi18NText('used');
            default: //异常
                return '';
                break;
        }
    }

    function getQueryParams() {
        var params = {};

        var btime = Ext.getCmp("btime");
        var etime = Ext.getCmp("etime");
        if (!btime.isValid()) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_set_starttime") + '</font>');
            return null;
        }
        if (!etime.isValid()) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_set_endtime") + '</font>');
            return null;
        }
        etime = etime.getValue();
        btime = btime.getValue();

        if (btime > etime) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_timeerror") + '</font>');
            return null;
        }
        // 查询限制360天 add by ZL 2018.05.04
        var cutDy = (etime - btime) / (1000 * 60 * 60 * 24);
        if (cutDy > 360) {
            Ext.example.msg(getIi18NText('operationTips'), '<font color="red">' + getIi18NText('operationRangeTips') + '</font>');
            return null;
        }

        //微信名称,用户编号,优惠劵名称,优惠劵编号模糊查找
        var searchText = Ext.getCmp('searchText').getValue();
        etime == null ? null : etime.setHours(23, 59, 59);
        btime == null ? null : btime.setHours(0, 0, 0);
        params.startTime = Ext.Date.format(btime, dateFormat);
        params.endTime = Ext.Date.format(etime, dateFormat);
        params.search = encode(searchText);

        return params;
    }

    function searchFn(btn) {
        var params = getQueryParams();
        if (isNull(params)) {
            return;
        }
        Ext.getBody().mask();
        if (btn != null && btn.is('button')) {
            btn.getEl().blur();
        }
        giftCouponAjaxProxy.setExtraParam("startTime", params.startTime);
        giftCouponAjaxProxy.setExtraParam("endTime", params.endTime);
        giftCouponAjaxProxy.setExtraParam("search", params.search);

        giftCouponGridPanel.getSelectionModel().deselectAll();//此操作相当重要
        giftCouponDataStore.loadPage(1);
        Ext.getBody().unmask();
    }

    //打开赠券编辑、新增窗口
    //所有优惠券
    var couponStore = Ext.create('Ext.data.Store', {
        fields : ["id","cname"],
        buffered : false,
        autoLoad : true,
        pageSize : Number("0x7fffffff"),//未分页，防止显示不全
        leadingBufferZone : 50,
        proxy : {
            type : 'ajax',
            url : 'shared!getAllCouponList.action',
            extraParams : {status:0,attr:'activity'},
            reader : {
                type : 'json',
                root : 'data',
                tiemout : 30000,
                totalProperty : 'totalCount'
            }
        }
        ,listeners:{}
    });
    function openGiftCouponWin(btn) {
        if (giftCouponWin && giftCouponWin.isWindow) {
            giftCouponWin.show(btn);
            return
        }
        giftCouponWin = Ext.create('Ext.window.Window', {
            id: "giftCouponWin",
            frame: false,
            modal: true,
            constrain: true,
            border: false,
            closeAction: 'close',
            minWidth: 300,
            minHeight: 200,
            autoScroll: false,
            layout: 'fit',
            title: getIi18NText("add_gift_coupon"),
            iconCls: 'pback_write_IconCls',
            width: 600,
            height: 250,
            maximizable: false,
            draggable: false,
            resizable: false,
            defaults: {
                border: false
            },
            listeners:{
                beforeclose: function () {
                    userIds.removeAll();
                    if(rankingWin && rankingWin.isWindow){
                        rankingDataStore.reload();
                    }
                    Ext.getCmp('couponId1').setValue('');
                    Ext.getCmp('couponId2').setValue('');
                    Ext.getCmp('couponPanel2').hide();
                    Ext.getCmp('addCouponButton').show();
                    is2Coupon = false;
                },
                show:function () {
                    couponStore.load();
                }
            },
            items: [
                {
                    xtype: 'form',
                    bodyCls: 'x_panel_backDD',
                    items: [
                        {
                            xtype: 'panel',
                            layout:'vbox',
                            border:false,
                            items:[
                                {
                                    id:'couponPanel1',
                                    xtype: 'panel',
                                    layout: 'column',
                                    hidden: false,
                                    defaults: {margin: '20 0 0 30'},
                                    border: false,
                                    items: [
                                        {
                                            id:'couponId1',
                                            xtype : 'combo',
                                            fieldLabel : '<font color="red"> * </font>'+getIi18NText('coupon'),
                                            editable : false,
                                            labelWidth :60,
                                            margin:'20 0 0 40',
                                            width : 220,
                                            queryMode:'remote',
                                            value : '',
                                            store : couponStore,
                                            displayField :'cname',
                                            emptyText:getIi18NText('chooseCoupon'),
                                            valueField:'id',
                                            typeAhead : true,//允许自动选择匹配项  经过延时typeAheadDelay后
                                            allowBlank : true
                                            ,listConfig: {
                                                loadingText: getIi18NText("weather03")
                                                ,emptyText: '<font style="line-height: 22px; margin-left: 3px;font-size:12px;">'+getIi18NText("coupon_search_null")+'</font>'
                                            }

                                        },
                                        {
                                            id:'addCouponButton',
                                            xtype : 'button',
                                            text :window.top.getIi18NText('add'),
                                            margin:'20 0 0 40',
                                            width: 80,
                                            iconCls : 'pbacks_add_IconCls',
                                            handler:addCouponPanel
                                        }
                                    ]
                                },
                                {
                                    id:'couponPanel2',
                                    hidden:true,
                                    xtype: 'panel',
                                    layout: 'column',
                                    defaults: {margin: '20 0 0 30'},
                                    border: false,
                                    items: [
                                        {
                                            id:'couponId2',
                                            xtype : 'combo',
                                            fieldLabel : '<font color="red"> * </font>'+getIi18NText('coupon'),
                                            editable : false,
                                            labelWidth :60,
                                            margin:'20 0 0 40',
                                            width : 220,
                                            queryMode:'remote',
                                            value : '',
                                            store : couponStore,
                                            displayField :'cname',
                                            emptyText:getIi18NText('chooseCoupon'),
                                            valueField:'id',
                                            typeAhead : true,//允许自动选择匹配项  经过延时typeAheadDelay后
                                            allowBlank : true
                                            ,listConfig: {
                                                loadingText: getIi18NText("weather03")
                                                ,emptyText: '<font style="line-height: 22px; margin-left: 3px;font-size:12px;">'+getIi18NText("weather04")+'</font>'
                                            }

                                        },{
                                            xtype : 'button',
                                            margin:'20 0 0 40',
                                            text :window.top.getIi18NText('delete'),
                                            width: isEng === true ?'60':'200',
                                            iconAlign: 'left',
                                            iconCls : 'pbacks_det_IconCls',
                                            handler :delCouponPanel
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: 'column',
                            hidden: false,
                            border: false,
                            defaults: {margin: '80 0 0 30'},
                            items:[
                                {
                                    xtype: 'button',
                                    margin: '30 0 0 40',
                                    text: window.top.getIi18NText('add_wechat_user_info'),
                                    handler: openRankingWin
                                }
                            ]
                        }
                    ]
                }
            ],
            bbar: [
                {xtype: 'tbfill'},
                {
                    xtype: 'button',
                    margin: '0 20 0 10',
                    text: getIi18NText('confirm'),
                    align: 'right',
                    border: false,
                    handler: confirmGiftCoupon
                }
            ]
        }).show(btn);
    }

    function delCouponPanel(btn) {
        is2Coupon = false;
        Ext.getCmp('couponPanel2').hide();
        Ext.getCmp('couponId2').setValue('');
        Ext.getCmp('addCouponButton').show();
    }

    function addCouponPanel(btn) {
        var couponId1 = Ext.getCmp('couponId1').getValue();
        if(couponId1 && couponId1 !== ''){
            is2Coupon = true;
            Ext.getCmp('couponPanel2').show();
            Ext.getCmp('addCouponButton').hide();
        }else{
            showTip(btn,getIi18NText('choose_coupon_tip'));
        }

    }

    //添加或修改赠券
    function confirmGiftCoupon(btn) {
        var cIds = [];
        var uIds = [];
        //校验优惠劵
        var couponId1 = Ext.getCmp('couponId1').getValue();
        var couponId2 = Ext.getCmp('couponId2').getValue();
        var isNull = false;
        if(couponId1 == null || couponId1 === ''){
            isNull = true;
        }else {
            cIds.push(couponId1);
        }
        if(is2Coupon && (couponId2 == null || couponId2 === '')){
            isNull = true;
        }else {
            cIds.push(couponId2);
        }
        if(isNull){
            showTip(btn,getIi18NText('choose_coupon_null_tip'));
            return;
        }
        //校验用户信息
        if(userIds.length <= 0){
            showTip(btn,getIi18NText('choose_user_null_tip'));
            return;
        }else{
            userIds.each(function (item,index) {
                uIds.push(item.id);
            })
        }
        giftCouponWin.getEl().mask(window.top.getIi18NText('saving'));
        Ext.Ajax.request({
            url: 'shared!saveGiftCouponRecord.action'
            , params: {userIds: uIds.join(), couponIds: cIds.join()}
            , method: 'post'
            , callback: function (opt, success, response) {
                giftCouponWin.getEl().unmask();
                var result = showResult(success, response);
                if (result === false) return;
                Ext.example.msg(window.top.getIi18NText('operationTips'), window.top.getIi18NText('saveSuccess'));
                giftCouponWin.close();
                searchFn();
            }
        });

    }

    //打开排行榜窗口
    var groupStore = Ext.create('Ext.data.Store', {
        fields: ['gid', 'gname']
        , autoLoad: true
        , proxy: {
            type: 'ajax'
            , url: 'terminal!selTerminalGroupList.action'
            , reader: {
                type: 'json',
                root: 'data',
                tiemout: 20000,
                totalProperty: 'totalCount'
            }
        }
        , listeners: {
            load: function () {
                this.loadData([{'gid': -1, 'gname': '- -' + getIi18NText('allTerminalTeams') + '- -'}], true);
            }
        }
    });

    function openRankingWin(btn) {
        if (rankingWin && rankingWin.isWindow) {
            rankingWin.show(btn);
            return
        }
        rankingWin = Ext.create('Ext.window.Window', {
            title: window.top.getIi18NText('ranking_info'),
            id: "rankingWin",
            layout: 'border',
            iconCls: 'pback_write_IconCls',
            width: 900,
            height: 400,
            maximizable: false,
            frame: false,
            modal: true,
            constrain: true,
            border: false,
            closeAction: 'hide',
            minWidth: 480,
            minHeight: 300,
            autoScroll: false,
            items: [{
                region: 'north',
                height: 80
                , width: 400
                , id: 'rankingNorthContanier'
                , layout: {type: 'vbox', align: 'middle', defaultMargins: {right: 3}}
                , bodyCls: 'x_panel_backDD'
                , items: [
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        defaults: {margin: '8 2 5 3'},
                        id: 'rankingPanelone',
                        border: false,
                        items: [
                            {
                                xtype: 'image',
                                src: '',
                                width: 40,
                                height: 24,
                                imgCls: 'searchIconCss',
                            }, {
                                xtype: 'combo'
                                , fieldLabel: getIi18NText('onTerms')
                                , labelWidth: 40
                                , width: 140
                                , editable: false
                                , id: 'switchCombo'
                                , store: [[1, getIi18NText('terminalTeam')], [3, getIi18NText('terminalName')]]
                                , queryMode: 'local'
                                , displayField: 'name'
                                , valueField: 'value'
                                , value: 1
                                , listeners: {
                                    change: function ($this, newValue, oldValue, eOpts) {
                                        condEvent($this, newValue, oldValue, eOpts);
                                    }
                                }
                            }, {
                                xtype: 'combo'
                                , labelWidth: 40
                                , id: 'allGroup_combo'
                                , width: 130
                                , editable: false
                                , store: groupStore
                                , queryMode: 'local'
                                , displayField: 'gname'
                                , valueField: 'gid'
                                , value: -1
                            }, {
                                xtype: 'textfield'
                                , fieldLabel: getIi18NText('name')
                                , id: 'searchTextId'
                                , hidden: true
                                , maxLength: 50
                                , width: 130
                                , labelWidth: 30
                                , emptyText: getIi18NText('keyword')
                                , enforceMaxLength: true
                            }, {
                                xtype: 'datefield',
                                fieldLabel: getIi18NText("monitor_message_06"),
                                name: 'rankingBeginTime'
                                , labelWidth: 60
                                , editable: false
                                , format: 'Y/m/d'
                                , width: 190
                                , id: 'rankingBeginTime'
                                , emptyText: getIi18NText("startTime")
                            }, {
                                xtype: 'datefield',
                                name: 'rankingEndTime'
                                , id: 'rankingEndTime'
                                , width: 110
                                , editable: false
                                , format: 'Y/m/d'
                                , emptyText: getIi18NText("endTime")
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        border: false,
                        items: [{
                            fieldLabel: window.top.getIi18NText('name')
                            , id: 'userSearchText'
                            , xtype: 'textfield'
                            , maxLength: 50
                            , width: 250
                            , labelWidth: 30
                            , margin: '8 2 5 43'
                            , emptyText: window.top.getIi18NText('search_by_ranking')
                        }, {
                            xtype: 'button'
                            , margin: isEng == true ? '8 2 5 100' : '8 2 5 3'
                            , iconCls: 'queryIconCss'
                            , width: 70
                            , text: getIi18NText("select")
                            , handler: searchRankingFn
                        }
                        ]
                    }
                ]
            }, {
                region: 'center'
                , border: false
                , layout: 'fit'
                , listeners: {
                    render: renderRankTable
                }
            }]
        }).show(btn);
    }

    rankingSelModel = new Ext.selection.CheckboxModel({
        listeners: {
            'select': select,
            'deselect': unSelect
        }
    });

    function unSelect(me, record) {
        if (userIds.containsKey(record.get('id'))) {
            userIds.removeAtKey(record.get('id'));
        }
    }

    function select(me, record) {
        if (!userIds.containsKey(record.get('id'))) {
            userIds.add(record.get('id'), record.data);
        }
    }

    function renderRankTable($this, eopt) {
        rankingAjaxProxy = getAjaxProxy({url: 'shared!getRanking.action'});
        rankingDataStore = Ext.create('Ext.data.Store', {
            fields: ["id", "url", "openId", "nickName", "userCode", "count"],
            buffered: false,
            autoLoad: true,
            pageSize: 10,
            leadingBufferZone: 50,
            proxy: rankingAjaxProxy,
            listeners: {
                load: function ($this) {
                    var selection = rankingGridPanel.getSelectionModel();
                    var records = [];
                    for (var k = 0; k < selection.getStore().count(); k++) {
                        var record = selection.getStore().getAt(k);
                        if (userIds.containsKey(record.get('id'))) {
                            records.push(record);
                        }
                    }
                    selection.select(records);
                }
            }
        });
        rankingGridPanel = Ext.create("Ext.grid.Panel", {
            title: window.top.getIi18NText('ranking_info_list'),
            iconCls: 'tabIconCss',
            store: rankingDataStore,
            selType: 'checkboxmodel',
            selModel: rankingSelModel,
            frame: false,
            border: false,
            forceFit: true,
            autoScroll: true,
            columns: {
                items: [
                    {text: getIi18NText("No"), width: 40, xtype: 'rownumberer', align: 'center'},
                    {text: "", dataIndex: 'id', hidden: true},
                    {
                        text: getIi18NText('WechatAvatar'),
                        dataIndex: 'url',
                        width: 80,
                        align: 'center',
                        renderer: imgfmtRender
                    },
                    {text: getIi18NText('wechatName'), dataIndex: 'nickName', width: 120, flex: 1, align: 'center'},
                    {text: getIi18NText('userCode'), dataIndex: 'userCode', width: 120, flex: 1, align: 'center'},
                    {text: getIi18NText("purchase_number"), dataIndex: 'count', width: 100, flex: 1, align: 'center',renderer: countFmtRender},
                ],
                defaults: {
                    menuDisabled: true,
                    sortable: false,
                    draggable: false,
                    align: 'center'
                }
            },
            bbar: [{
                xtype: 'pagingtoolbar',
                store: rankingDataStore,
                border: false,
                displayInfo: true,
                // listeners : {
                //     "beforechange":function (bbar, params) {
                //         var selectDatas = rankingGridPanel.getSelectionModel().getSelection();
                //         if(selectDatas.length > 0){
                //             Ext.each(selectDatas,function (record,index) {
                //                 if(userIds.indexOf(record.data.id) === -1){
                //                     userIds.push(record.data.id);
                //                 }
                //             })
                //         }
                //     }
                // }
            }, {xtype: 'tbfill'},
                {
                    xtype: 'button',
                    margin: '0 20 0 10',
                    text: getIi18NText('confirm'),
                    align: 'right',
                    border: false,
                    handler:confirmUserInfo
                }],
            margin: 1
            , tools: [{
                xtype: 'button',
                tooltipType: 'title',
                text: window.top.getIi18NText('refresh'),
                border: false,
                iconCls: 'refreshIconCss',
                handler: searchRankingFn
            }
            ]
            , viewConfig: {
                trackOver: false
                , disableSelection: false
                , emptyText: '<h1 style="margin:10px">' + window.top.getIi18NText('roleTip05') + '</h1>'
            }
        });

        $this.add(rankingGridPanel);
    }

    function condEvent($this, newValue, oldValue, eOpts) {
        if (oldValue == 1) {
            Ext.getCmp('allGroup_combo').hide();
        } else if (oldValue == 2) {
            Ext.getCmp('allCompany_combo').hide();
        } else if (oldValue == 3) {
            Ext.getCmp('searchTextId').hide();
            Ext.getCmp('searchTextId').setValue("");
        }
        if (newValue == 1) {
            Ext.getCmp('allGroup_combo').show();
        } else if (newValue == 2) {
            Ext.getCmp('allCompany_combo').show();
        } else if (newValue == 3) {
            Ext.getCmp('searchTextId').show();
        }
    }

    function searchRankingFn(btn) {
        var params = getQueryRankingParams();
        if (isNull(params)) {
            return;
        }
        rankingWin.mask();
        if (btn != null && btn.is('button')) {
            btn.getEl().blur();
        }
        rankingAjaxProxy.setExtraParam("name", params.name);
        rankingAjaxProxy.setExtraParam("startTime", params.startTime);
        rankingAjaxProxy.setExtraParam("endTime", params.endTime);
        rankingAjaxProxy.setExtraParam("way", params.way);
        rankingAjaxProxy.setExtraParam("gid", params.gid);
        rankingAjaxProxy.setExtraParam("search", params.search);

        //rankingGridPanel.getSelectionModel().deselectAll();//此操作相当重要
        rankingDataStore.loadPage(1);
        rankingWin.unmask();
    }

    function getQueryRankingParams() {
        var params = {};
        var beginTime = Ext.getCmp("rankingBeginTime");
        var endTime = Ext.getCmp("rankingEndTime");
        if (!beginTime.isVisible()) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_set_starttime") + '</font>');
            return null;
        }
        if (!endTime.isVisible()) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_set_starttime") + '</font>');
            return null;
        }
        beginTime = beginTime.getValue();
        endTime = endTime.getValue();
        // beginTime = beginTime.getValue() == null ? null:beginTime.getValue().setHours(0,0,0);
        // endTime = endTime.getValue() == null ? null:endTime.getValue().setHours(23,59,59);
        if (beginTime > endTime) {
            Ext.example.msg(getIi18NText("operationTips"), '<font color="red">' + getIi18NText("item_timeerror") + '</font>');
            return null;
        }
        //查询限制360天
        var days = (endTime - beginTime) / (1000 * 60 * 60 * 24);
        if (days > 360) {
            Ext.example.msg(getIi18NText('operationTips'), '<font color="red">' + getIi18NText('operationRangeTips') + '</font>');
            return null;
        }
        //终端
        var name = Ext.getCmp("searchTextId").getValue();
        var way = Ext.getCmp('switchCombo').getValue();
        var gid = Ext.getCmp('allGroup_combo').getValue();
        //微信名称\用户编号
        var userSearchText = Ext.getCmp('userSearchText').getValue();

        params.name = encode(name);
        if(endTime != null && beginTime != null){
            endTime.setHours(23,59,59);
            beginTime.setHours(0,0,0);
            params.startTime = Ext.Date.format(beginTime,dateFormat);
            params.endTime = Ext.Date.format(endTime,dateFormat);
        }

        params.way = way;
        params.gid = gid;
        params.search = encode(userSearchText);
        return params;
    }

    function imgfmtRender(value, metaData, record, rIndex, cIndex) {
        var pic = Ext.String.format('<img src="{0}" width="80px" height="80px" style="float:left"/>', value);
        return pic;
    }
    function countFmtRender(value, metaData, record, rIndex, cIndex) {
        return value == null || value === ''? 0:value;
    }
    
    function confirmUserInfo() {
        rankingWin.hide();
    }
});
