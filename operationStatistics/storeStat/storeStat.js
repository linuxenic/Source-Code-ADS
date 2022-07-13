/** item manager */
var  showTerminal,showTerminalDetail,isFreshing = true,freshPlanTimeout,isPlanfresh=false;
Ext.onReady(function() {
	 // 1.start
//	Ext.getBody().mask(getIi18NText('loadingInfo'));
	Ext.QuickTips.init();
	
	//variable
	var viewport,webpath=getWebPath();
//	var  AUTH = Ext.merge({screen: false, off: false, "delete": false, play: false, pub: false, restart: false}, Ext.decode(decode(AUTH_TBAR)));
	var chartPanel;
	var chart;
	//日期转换
	var formatDateTime = function (date) {  
	    var y = date.getFullYear();  
	    var m = date.getMonth()+1;  
	    m = m < 10 ? ('0' + m) : m;  
	    var d = date.getDate();  
	    d = d < 10 ? ('0' + d) : d;  
	    var h = date.getHours();  
	    var minute = date.getMinutes();  
	    minute = minute < 10 ? ('0' + minute) : minute;  
	    var s=date.getSeconds()
	    s = s < 10 ? ('0' + s) : s;  
	    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+s;  
//	    return y + '-' + m + '-' + d;  
	};  
	//对穿过来的时间进行调整
	var teti=	new Date(etime);
	var tebt=	new Date(btime);
	var cutDy = (teti - tebt) / (1000 * 60 * 60 * 24) ;
    if(cutDy > 30){
    	teti.setTime(tebt.getTime()+30*(1000 * 60 * 60 * 24)); 
    	teti.setHours(23, 59, 59);
    	etime=formatDateTime(new Date(teti.toString()));
    }
    btime=formatDateTime(new Date(btime));
	   
	var nowEndDate = new Date(etime);
	nowEndDate.setHours(23, 59, 59);
	var nowBeginDate = new Date(btime);
	nowBeginDate.setHours(0,0,0);
	var dateFormat='Y-m-d H:i:s';
	Ext.define('StoreStat', {
	    extend: 'Ext.data.Model',
	    fields: ['toPrice', 'date','orNum']
	});
	dayStore = Ext.create('Ext.data.Store', {
	     fields: [{name: 'toPrice', type: 'float'},
	              {name: 'date', type: 'string'},
	              {name: 'orNum', type: 'int'}],
		
		buffered: false //暂时设置为false,为true会导致刷新的时候报错，原因暂未清楚
	    ,pageSize: 30
//	       ,leadingBufferZone: 50
       ,proxy: {
	        type: 'ajax'
	        ,url: 'statistics!storeStatOrder.action'
	        ,extraParams: {stid: stid,b:btime,e:etime}
	        ,reader: {
	    	    type: 'json',
                root: 'data',
                tiemout: 20000,
                totalProperty: 'totalCount'
         	}
       }
	       ,autoLoad: true
	       ,listeners: {
	    	    load:function($this){
//	    	    	 Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
	    	    	 Ext.getBody().unmask();
	    	    }
	       } 
	});
	toFoodStore = Ext.create('Ext.data.Store', {   
		fields: [{name: 'date', type: 'string'},
		         {name: 'dishesid', type: 'int'},
		         {name: 'gname', type: 'string'},
		         {name: 'tocount', type: 'int'}],
		buffered: false //暂时设置为false,为true会导致刷新的时候报错，原因暂未清楚
		,pageSize: 30
//	       ,leadingBufferZone: 50
		,proxy: {
			type: 'ajax'
				,url: 'statistics!storeStatFood.action'
				 ,extraParams: {stid: stid,b:btime,e:etime}
				,reader: {
					type: 'json',
					root: 'data',
					tiemout: 20000,
					totalProperty: 'totalCount'
				}
		}
	,autoLoad: true
	,listeners: {
		load:function($this){
//	    	    	 Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
			Ext.getBody().unmask();
		}
	} 
	});
	toTypeStore = Ext.create('Ext.data.Store', {   
//      fields: ['pubid', 'pubname','proid','proname','pageid', 'pagename','clickTime', 'stayTime'],
		fields: ['type','tynum'],
		buffered: false //暂时设置为false,为true会导致刷新的时候报错，原因暂未清楚
		,pageSize: 30
//	       ,leadingBufferZone: 50
		,proxy: {
			type: 'ajax'
				,url: 'statistics!orderTypeStat.action'
				 ,extraParams: {stid: stid,b:btime,e:etime}
				,reader: {
					type: 'json',
					root: 'data',
					tiemout: 20000,
					totalProperty: 'totalCount'
				}
		}
	,autoLoad: true
	,listeners: {
		load:function($this){
//	    	    	 Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
			Ext.getBody().unmask();
		}
	} 
	});
	var tabStore;
	 chart = Ext.create('Ext.chart.Chart', {
	//	 	store: localstore,  
		    store: dayStore,
		    legend: true,
		    axes: [
		        {
//		        	title: '收入', 
		        	title: getIi18NText('income'),
		            type: 'Numeric',
		            position: 'left',
		            fields: ['toPrice'],
		            label: {
		                renderer: Ext.util.Format.numberRenderer('00.00')
		            },
		            grid: false,
		            minimum: 0
		        },
		        {
		        	title: getIi18NText('sat_order'),
		        	type: 'Numeric',
		        	position: 'right',
		        	fields: ['orNum'],
		   //     	width : 0,
		        	label: {
		        		renderer: Ext.util.Format.numberRenderer('00.00'),
		        		   color: '#333'
		        	},
		        	grid: false,
		        	minimum: 0
		        },
		        {
//		            type: 'Time', 
		            type: 'Category',
		            position: 'bottom',
		            fields: ['date'],
		            title: getIi18NText('time'),
	        		label: {
						rotate: {
							degrees: 45
						}
					}
		        }
		    ],
		    series: [
		        {
		        	title:getIi18NText('income'),
		            type: 'line',
		            axis: 'left',
		    //       highlight: true,
		            xField: 'date',
		            yField: 'toPrice',
		            smooth:true,
		            highlight:{
		                            size:5,
		                            radius:5
		                           },
		                tips: {  
		                	trackMouse: true,  
		                	width: 180,  
		                	height: 28,  
		                	renderer: function(storeItem, item) {  
		                		this.setTitle(storeItem.get('date') +  ' '+getIi18NText('income')+':￥' + storeItem.get('toPrice') );  
		                	} 
		                } 
		          },
		        {
		        	type: 'line',
		        	axis: 'right',
		        	title:getIi18NText('sat_order'),
		    //    	highlight: true,
		        	xField: 'date',
		        	yField: 'orNum',
		            smooth:true,
		            highlight:{
		                            size:5,
		                            radius:5
		                           },
		        		   tips: {  
			                	trackMouse: true,  
			                	width: 200,  
			                	height: 28,  
			                	renderer: function(storeItem, item) {  
			                		this.setTitle(  storeItem.get('date') + ' '+getIi18NText('sat_order')+':' + storeItem.get('orNum') );  
			                	} 
			                } 
		        }
		      ]
		  });

	//2.create
	viewport = Ext.create("Ext.container.Viewport",{
				layout: 'vbox',
			    renderTo: document.body,
			    border: false,
			    overflowY : 'auto',
			    items: [
			            {
			            	xtype:'panel'
			            		,height: 30
			            		,width: '100%'
			            			//    	    ,id: 'northContanier'
			            			,border: false
			        	    	    ,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
						            ,bodyCls: 'x_panel_backDD'
			            ,items: [
			     	              {
				    	                 xtype: 'combo'
				    	/*                ,fieldLabel: '店铺名称'
				    	                ,labelWidth: 60*/  
				    	                ,id: 'restcombo'
				    	                ,width: 110
				    	                ,editable: false
				    	                ,store:  [[1,getIi18NText('7_days')],[2,getIi18NText('15_days')],[3, getIi18NText('30_days')]] 
				    	                ,margin:'0 0 0 10'
									    ,queryMode: 'local'
									    ,displayField: 'storeName'
									    ,valueField: 'sid'
									    ,value: 1
									    ,listeners: {
									    	select:  function(){
									        	var rtes=Ext.getCmp("restcombo").getValue();
									        	var nowda=new Date();
									        	var nowed=new Date();
										        if(rtes==1){
										        	nowed.setTime(nowda.getTime()-7*24*60*60*1000);
										        }else   if(rtes==2){
										        	nowed.setTime(nowda.getTime()-15*24*60*60*1000);
										        }else   if(rtes==3){
										        	nowed.setTime(nowda.getTime()-29*24*60*60*1000);
										        }
										        nowed.setHours(0, 0, 0);
										        Ext.getCmp("etime").setValue(nowda);
										        Ext.getCmp("btime").setValue(nowed);
										        queryFun();
									        }
									    }
				    	              },
					            	  {
									        xtype: 'datefield',
									        fieldLabel: getIi18NText('time'),
									        hidden: false
									        ,format: dateFormat
									        ,labelWidth: 30
									        ,width: 200
									        ,id: 'btime'
									        ,name: 'btime'
									        ,emptyText: getIi18NText('startTime')
									        ,value:nowBeginDate
									    	   
								      },{
										     xtype: 'datefield'
										    ,id: 'etime'
										    ,hidden: false
										    ,format: dateFormat
										    ,width: 170
										    ,emptyText: getIi18NText('endTime')
										    ,value:nowEndDate
										    ,listeners: {
										    	select: function($this){
										    		var temdate=$this.getValue();
										    		temdate.setHours(23, 59, 59);
										    		$this.setValue(temdate);
										    	}
								            }
									  },{
					            	      xtype: 'button'
					            //	      ,id: 'queryBut'
//					            	      ,iconCls: 'queryIconCss'
							    		  ,text: window.top.getIi18NText('selectAndRefresh')
							    		  ,handler: queryFun
									  }
			                     ] 
			            },
			            {
			            xtype:'panel'
			    	    ,height: 30
			    	    ,width: '100%'
			//    	    ,id: 'northContanier'
			    	    ,border: false
			    	    ,layout: { type: 'hbox'}
			//            ,bodyCls: 'x_panel_backDD'
			    	    ,items: [
									{
									    xtype: 'displayfield'
								//	    ,id: 'totalTabRows'
							//		    ,baseCls: 'totalCountCls'  
									    ,fieldLabel: getIi18NText('dailyOrderIncome')
									    ,labelWidth: 70
									    ,margin: '0 0 0 40'
									    ,width: 100
							//		    ,value: '每日订单收入'
									},
			/*						{
					            	      xtype: 'button'
					            //	      ,id: 'queryBut'
					            	      ,margin: '5 0 0 600'
							    		  ,text: '上一页'
							    //		  ,handler: queryFun
									},
									{
										xtype: 'button'
											//	      ,id: 'queryBut'
										,margin: '5 0 0 10'
										,text: '下一页'
												//		  ,handler: queryFun
									}*/
								  ] 
				    },
				    { 
				    	xtype:'panel',
				    	border: false
			            ,height:400
			            ,width:'100%'
					    ,layout: 'fit'
					    ,items:[chart]
				    },
				    { 
				    	height: 30
				    	,width: '100%'
			//	    		,id: 'northContanier'
				    			,border: false
				    			,layout: { type: 'hbox', align: 'middle',defaultMargins : {right: 3}}
				    //            ,bodyCls: 'x_panel_backDD'
				    ,items: [
				             {
				            	 xtype: 'displayfield'
				            		 //	    ,id: 'totalTabRows'
				            		 ,fieldLabel: getIi18NText('salesTop')
				            			 ,labelWidth: 70
				            			 ,margin: '0 0 0 40'
				            				 ,width: 100
				             }
				             ] 
				    },
				    { 
				    	xtype:'panel',
				    	border: false
				    	,height:400
				    	,width:'100%'
				    		,layout: 'fit'
				    			,items:[
{
	xtype:'chart'
    ,store: toFoodStore 
    ,axes: [
        {
        	title: getIi18NText('sales'),
            type: 'Numeric',
            position: 'left',
            fields: ['tocount'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            grid: false,
            minimum: 0,
        },
        {  
        	type: 'Numeric',
        	position: 'right',
   //     	fields: ['tocount'],
        	label: {
        		renderer: Ext.util.Format.numberRenderer('0,0')
        	},
        	grid: false,
        	minimum: 0,
        	maximum:10
        },
        {
//            type: 'Time',
            type: 'Category',
            //'Category'
            position: 'bottom',
            fields: ['date'],
            title: getIi18NText('time'),
        		label: {
					rotate: {
						degrees: 45
					}
				}
        }
    ],
    series: [
        {
            type: 'line',
            axis: 'left',
            highlight: true,
            tips: {  
            	trackMouse: true,  
            	width: 300,  
            	height: 28,  
            	renderer: function(storeItem, item) {  
            		if(storeItem.get('tocount')==0){
            			this.setTitle(storeItem.get('date')+getIi18NText('notSell') );   
            		}else{
            			this.setTitle(storeItem.get('date')+' '+storeItem.get('gname') + ': ' + storeItem.get('tocount')  );  
            		}
            	}  
        },  
            xField: 'date',
            yField: 'tocount'
          }
      ]
  }
]
				    },
				    { 
				    	xtype:'panel'
				    	,id:'pieoanel'
				    	,border: false
				    	,height:400
				    	,width:'100%'
				    		,layout: 'fit'
				    			,items:[{  
				    			            xtype: 'chart',  
				    			            height: 400,  
				    			            id: 'piechart',  
				    			            width: 495,  
				    			            animate: true,  
				    			            insetPadding: 20,  //'type','tynum']
				    			            store: toTypeStore,  
				    			            series: [  
				    			                {  
				    			                    type: 'pie',  
				    			                    highlight: //鼠标移过片段突起  
				    			                    {  
				    			                        segment: {  
				    			                            margin: 20  
				    			                        }  
				    			                    },  
				    			                    label: {  
				    			                        field: 'type',  
				    			                        display: 'rotate',  
				    			                        contrast: true,  
				    			                        font: '14px Arial'  
				    			                    },  
				    			                    showInLegend: true,  
				    			                    tips: {  
				    			                        trackMouse: true,  
				    			                        width: '120px',  
				    			                        renderer: function(storeItem, item) {  
				    			                            //calculate percentage.  
				    			                            var total = 0;  
				    			                            toTypeStore.each(function(record) {  
				    			                                total += record.get('tynum');  
				    			                            });  
				    			                            this.setTitle(storeItem.get('type') + ': ' +Math.round(storeItem.get('tynum') / total * 100)+ '%'+'  '+storeItem.get('tynum')+'/'+total);  
				    			                        }  
				    			                    },  
				    			                    angleField: 'tynum'  
				    			                }  
				    			            ],  
				    			        	listeners: {
				    			        		refresh:function( $this, eOpts ){
//				    			        	    	    	 Ext.getCmp('totalTabRows').setValue($this.getTotalCount());
				    			        //			console.info("变化了 ");
			    			        			  	var vo=0;
			    			        	  			toTypeStore.each(function(r){
			    			        						if(r.get("tynum")==0){
			    			        							vo++;
			    			        						}
			    			        				 });
			    			        	  			if(vo==toTypeStore.count()){
			    			        	  				Ext.getCmp("piechart").hide();
			    			        	  				Ext.getCmp("pieoanel").hide();
			    			        	  			}else{
			    			        	  				Ext.getCmp("piechart").show();
			    			        	  				Ext.getCmp("pieoanel").show();
			    			        	  			}
				    			        		}
				    			        	}, 
				    			            legend: {  
				    			                position: 'right'  
				    			            }  
				    			        }]
				    }
				    

				    
				    
				    
				    ]
	});

	function queryFun(isCurrent){
/*    	isFreshing = false;
    	if(isCurrent != "true"){
	    	if(btime){
	    		Ext.getCmp("btime").setValue(btime);
	    	}
	    	if(etime){
	    		Ext.getCmp("etime").setValue(etime);
	    	}
		}*/
//  	    var name = Ext.getCmp("pname").getValue();
  	    if(Ext.getCmp("btime").getValue()){
  	    	btme = Ext.getCmp("btime").getValue();
  	    }
  	    if(Ext.getCmp("etime").getValue()){
  	    	etme = Ext.getCmp("etime").getValue();
  	    }
  	    if(btme > etme&&etme){
	    	 Ext.example.msg(window.top.getIi18NText('operationTips'), '<font color="red">'+window.top.getIi18NText('programTip04')+'</font>'); 
	    	 return;
	     }
    	var cutDy = (etme - btme) / (1000 * 60 * 60 * 24) ;  
  	    if(cutDy > 30){
  	    	Ext.example.msg(getIi18NText('operationTips'), '<font color="red">'+getIi18NText("noMore30")+'</font>'); 
	    	return;
  	    }
  	  btme =formatDateTime(new Date(Ext.getCmp("btime").getValue().toString()));
  	  etme =formatDateTime(new Date(Ext.getCmp("etime").getValue().toString()));
  	    dayStore.load({
 		    params: {stid: stid,b:btme,e:etme},
 	        callback: function(records, operation, success){
 	            if(success == false){
 	        //    	isFreshing = false;
 	            	alert(getIi18NText("monitor_error_01"));
 	            	return;
 	            }
 	    //        isFreshing = true;
 	        }
 	    });
  	toFoodStore.load({
  		  params: {stid: stid,b:btme,e:etme},
  		  callback: function(records, operation, success){
  			  if(success == false){
  			//	  isFreshing = false;
  				  alert(getIi18NText("monitor_error_01"));
  				  return;
  			  }
  	//		  isFreshing = true;
  		  }
  	  });
  	toTypeStore.load({
  		  params: {stid: stid,b:btme,e:etme},
  		  callback: function(records, operation, success){
  			  if(success == false){
  	//			  isFreshing = false;
  				  alert(getIi18NText("monitor_error_01"));
  				  return;
  			  }
  			  var vo=0;
  			toTypeStore.each(function(r){
				if(r.get("tynum")==0){
					vo++;
				}
		 	});
			if(vo==toTypeStore.count()){
				Ext.getCmp("piechart").hide();
				Ext.getCmp("pieoanel").hide();
			}else{
  				Ext.getCmp("piechart").show();
  				Ext.getCmp("pieoanel").show();
  			}
  	//		  isFreshing = true;
  		  }
  	  });
     }
	
	function statusRender(value){
		if (value === 1) {
            return getIi18NText('jsp_success');
        }
		return"<span style='color:red;'>"+getIi18NText('jsp_fail')+"</span>";  
	}
     
});	