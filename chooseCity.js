//各省的data
   var province =  Ext.create('Ext.data.Store', {
	   		fields: ['value', 'name']
	   	    ,data:[
                   {'value':1, 'name': '北京'}
                   ,{'value':2, 'name': '上海'}
                   ,{'value':3, 'name': '天津'}
                   ,{'value':4, 'name': '重庆'}
                   ,{'value':5, 'name': '安徽'}
                   ,{'value':6, 'name': '福建'}
                   ,{'value':7, 'name': '甘肃'}
                   ,{'value':8, 'name': '广东'}
                   ,{'value':9, 'name': '广西'}
                   ,{'value':10, 'name': '贵州'}
                   ,{'value':11, 'name': '海南'}
                   ,{'value':12, 'name': '河北'}
                   ,{'value':13, 'name': '河南'}
                   ,{'value':14, 'name': '黑龙江'}
                   ,{'value':15, 'name': '湖北'}
                   ,{'value':16, 'name': '湖南'}
                   ,{'value':17, 'name': '江苏'}
                   ,{'value':18, 'name': '江西'}
                   ,{'value':19, 'name': '吉林'}
                   ,{'value':20, 'name': '辽宁'}
                   ,{'value':21, 'name': '内蒙古'}
                   ,{'value':22, 'name': '宁夏'}
                   ,{'value':23, 'name': '青海'}
                   ,{'value':24, 'name': '山东'}
                   ,{'value':25, 'name': '山西'}
                   ,{'value':26, 'name': '陕西'}
                   ,{'value':27, 'name': '四川'}
                   ,{'value':28, 'name': '西藏'}
                   ,{'value':29, 'name': '新疆'}
                   ,{'value':30, 'name': '云南'}
                   ,{'value':31, 'name': '浙江'}
                   ,{'value':32, 'name': '香港'}
                   ,{'value':33, 'name': '澳门'}
                   ,{'value':34, 'name': '台湾'}                         
                  ]
   });
   var defaultCity =  Ext.create('Ext.data.Store', {
  		fields: ['value', 'name']
   		,data:[
   	         {'value':'北京', 'name': '北京'}
   	    ]
   });
   
   //各地级市的data
   var beijing = [
         {'value':'北京', 'name': '北京'}
   ];
   var shanghai = [
         {'value':'上海', 'name': '上海'}
   ];
   var tianjin = [
         {'value':'天津', 'name': '天津'}         
   ];
   var chongqing = [
         {'value':'重庆', 'name': '重庆'}           
   ];
   var anhui = [
         {'value':'合肥', 'name': '合肥'}
         ,{'value':'安庆', 'name': '安庆'}
         ,{'value':'蚌埠', 'name': '蚌埠'}
         ,{'value':'亳州', 'name': '亳州'}
         ,{'value':'池州', 'name': '池州'}
         ,{'value':'滁州', 'name': '滁州'}
         ,{'value':'阜阳', 'name': '阜阳'}
         ,{'value':'淮北', 'name': '淮北'}
         ,{'value':'淮南', 'name': '淮南'}
         ,{'value':'黄山', 'name': '黄山'}
         ,{'value':'六安', 'name': '六安'}
         ,{'value':'马鞍山', 'name': '马鞍山'}
         ,{'value':'宿州', 'name': '宿州'}
         ,{'value':'铜陵', 'name': '铜陵'}
         ,{'value':'芜湖', 'name': '芜湖'}
         ,{'value':'宣城', 'name': '宣城'}
   ];
   var fujian = [
         {'value':'福州', 'name': '福州'}
         ,{'value':'龙岩', 'name': '龙岩'}
         ,{'value':'南平', 'name': '南平'}
         ,{'value':'宁德', 'name': '宁德'}
         ,{'value':'莆田', 'name': '莆田'}
         ,{'value':'泉州', 'name': '泉州'}
         ,{'value':'三明', 'name': '三明'}
         ,{'value':'厦门', 'name': '厦门'}
         ,{'value':'漳州', 'name': '漳州'}
         ,{'value':'钓鱼岛', 'name': '钓鱼岛'}
   ];
   var gansu = [
          {'value':'兰州', 'name': '兰州'}
          ,{'value':'白银', 'name': '白银'}
          ,{'value':'定西', 'name': '定西'}
          ,{'value':'甘南', 'name': '甘南'}
          ,{'value':'嘉峪关', 'name': '嘉峪关'}
          ,{'value':'金昌', 'name': '金昌'}
          ,{'value':'酒泉', 'name': '酒泉'}
          ,{'value':'临夏', 'name': '临夏'}
          ,{'value':'陇南', 'name': '陇南'}
          ,{'value':'平凉', 'name': '平凉'}
          ,{'value':'庆阳', 'name': '庆阳'}
          ,{'value':'天水', 'name': '天水'}
          ,{'value':'威武', 'name': '威武'}
          ,{'value':'张掖', 'name': '张掖'}
   ];
   var guangdong = [
		  {'value':'广州', 'name': '广州'}
		  ,{'value':'潮州', 'name': '潮州'}
		  ,{'value':'东莞', 'name': '东莞'}
		  ,{'value':'佛山', 'name': '佛山'}
		  ,{'value':'河源', 'name': '河源'}
		  ,{'value':'惠州', 'name': '惠州'}
		  ,{'value':'江门', 'name': '江门'}
		  ,{'value':'揭阳', 'name': '揭阳'}
		  ,{'value':'茂名', 'name': '茂名'}
		  ,{'value':'梅州', 'name': '梅州'}
		  ,{'value':'清远', 'name': '清远'}
		  ,{'value':'汕头', 'name': '汕头'}
		  ,{'value':'汕尾', 'name': '汕尾'}
		  ,{'value':'韶关', 'name': '韶关'}
		  ,{'value':'深圳', 'name': '深圳'}
		  ,{'value':'阳江', 'name': '阳江'}
		  ,{'value':'云浮', 'name': '云浮'}
		  ,{'value':'湛江', 'name': '湛江'}
		  ,{'value':'肇庆', 'name': '肇庆'}
		  ,{'value':'中山', 'name': '中山'}
   ];
   var guangxi = [
          {'value':'南宁', 'name': '南宁'}
          ,{'value':'百色', 'name': '百色'}
          ,{'value':'北海', 'name': '北海'}
          ,{'value':'崇左', 'name': '崇左'}
          ,{'value':'防城港', 'name': '防城港'}
          ,{'value':'贵港', 'name': '贵港'}
          ,{'value':'桂林', 'name': '桂林'}
          ,{'value':'河池', 'name': '河池'}
          ,{'value':'贺州', 'name': '贺州'}
          ,{'value':'来宾', 'name': '来宾'}
          ,{'value':'柳州', 'name': '柳州'}
          ,{'value':'钦州', 'name': '钦州'}
          ,{'value':'梧州', 'name': '梧州'}
          ,{'value':'玉林', 'name': '玉林'}
   ];
   var guizhou = [
          {'value':'贵阳', 'name': '贵阳'}
		  ,{'value':'安顺', 'name': '安顺'}
		  ,{'value':'毕节', 'name': '毕节'}
		  ,{'value':'六盘水', 'name': '六盘水'}
		  ,{'value':'黔东南', 'name': '黔东南'}
		  ,{'value':'黔南', 'name': '黔南'}
		  ,{'value':'黔西南', 'name': '黔西南'}
		  ,{'value':'铜仁', 'name': '铜仁'}
		  ,{'value':'遵义', 'name': '遵义'}	
   ];
   var hainan =[
          {'value':'海口', 'name': '海口'}
		  ,{'value':'白沙', 'name': '白沙'}
		  ,{'value':'保亭', 'name': '保亭'}
		  ,{'value':'昌江', 'name': '昌江'}
		  ,{'value':'澄迈', 'name': '澄迈'}
		  ,{'value':'安定', 'name': '安定'}
		  ,{'value':'东方', 'name': '东方'}
		  ,{'value':'儋州', 'name': '儋州'}
		  ,{'value':'乐东', 'name': '乐东'}
		  ,{'value':'临高', 'name': '临高'}
		  ,{'value':'陵水', 'name': '陵水'}
		  ,{'value':'南沙', 'name': '南沙'}
		  ,{'value':'琼海', 'name': '琼海'}
		  ,{'value':'琼中', 'name': '琼中'}
		  ,{'value':'三亚', 'name': '三亚'}
		  ,{'value':'屯昌', 'name': '屯昌'}
		  ,{'value':'万宁', 'name': '万宁'}
		  ,{'value':'文昌', 'name': '文昌'}
		  ,{'value':'五指山', 'name': '五指山'}
		  ,{'value':'西沙', 'name': '西沙'}
		  ,{'value':'中沙', 'name': '中沙'}
   ];
   var hebei = [
          {'value':'石家庄', 'name': '石家庄'}
		  ,{'value':'保定', 'name': '保定'}
		  ,{'value':'沧州', 'name': '沧州'}
		  ,{'value':'承德', 'name': '承德'}
		  ,{'value':'邯郸', 'name': '邯郸'}
		  ,{'value':'衡水', 'name': '衡水'}
		  ,{'value':'廊坊', 'name': '廊坊'}
		  ,{'value':'秦皇岛', 'name': '秦皇岛'}
		  ,{'value':'唐山', 'name': '唐山'}
		  ,{'value':'邢台', 'name': '邢台'}
		  ,{'value':'张家口', 'name': '张家口'}
   ];
   var henan = [
          {'value':'郑州', 'name': '郑州'}
	      ,{'value':'安阳', 'name': '安阳'} 
	      ,{'value':'鹤壁', 'name': '鹤壁'} 
	      ,{'value':'济源', 'name': '济源'}
	      ,{'value':'焦作', 'name': '焦作'} 
	      ,{'value':'开封', 'name': '开封'}
	      ,{'value':'漯河', 'name': '漯河'} 
	      ,{'value':'洛阳', 'name': '洛阳'}
	      ,{'value':'南阳', 'name': '南阳'} 
	      ,{'value':'平顶山', 'name': '平顶山'}
	      ,{'value':'三门峡', 'name': '三门峡'} 
	      ,{'value':'商丘', 'name': '商丘'}
	      ,{'value':'新乡', 'name': '新乡'} 
	      ,{'value':'信阳', 'name': '信阳'}
	      ,{'value':'许昌', 'name': '许昌'}
	      ,{'value':'周口', 'name': '周口'}
	      ,{'value':'驻马店', 'name': '驻马店'}
   ];
   var heilongjiang = [
          {'value':'哈尔滨', 'name': '哈尔滨'} 
          ,{'value':'大庆', 'name': '大庆'} 
          ,{'value':'大兴安岭', 'name': '大兴安岭'} 
          ,{'value':'鹤岗', 'name': '鹤岗'} 
          ,{'value':'黑河', 'name': '黑河'} 
          ,{'value':'鸡西', 'name': '鸡西'} 
          ,{'value':'佳木斯', 'name': '佳木斯'} 
          ,{'value':'牡丹江', 'name': '牡丹江'} 
          ,{'value':'七台河', 'name': '七台河'} 
          ,{'value':'齐齐哈尔', 'name': '齐齐哈尔'} 
          ,{'value':'双鸭山', 'name': '双鸭山'} 
          ,{'value':'绥化', 'name': '绥化'} 
          ,{'value':'伊春', 'name': '伊春'} 
   ];
   var hubei = [
          {'value':'武汉', 'name': '武汉'} 
          ,{'value':'鄂州', 'name': '鄂州'} 
          ,{'value':'恩施', 'name': '恩施'} 
          ,{'value':'黄冈', 'name': '黄冈'} 
          ,{'value':'黄石', 'name': '黄石'} 
          ,{'value':'荆门', 'name': '荆门'}
          ,{'value':'荆州', 'name': '荆州'} 
          ,{'value':'潜江', 'name': '潜江'}
          ,{'value':'神农架', 'name': '神农架'} 
          ,{'value':'十堰', 'name': '十堰'}
          ,{'value':'随州', 'name': '随州'} 
          ,{'value':'天门', 'name': '天门'}
          ,{'value':'仙桃', 'name': '仙桃'} 
          ,{'value':'咸宁', 'name': '咸宁'}
          ,{'value':'襄阳', 'name': '襄阳'} 
          ,{'value':'孝感', 'name': '孝感'}
          ,{'value':'宜昌', 'name': '宜昌'}
   ];
   var hunan = [
          {'value':'长沙', 'name': '长沙'} 
          ,{'value':'常德', 'name': '常德'}
          ,{'value':'郴州', 'name': '郴州'}
          ,{'value':'衡阳', 'name': '衡阳'}
          ,{'value':'怀化', 'name': '怀化'}
          ,{'value':'娄底', 'name': '娄底'}
          ,{'value':'邵阳', 'name': '邵阳'}
          ,{'value':'湘潭', 'name': '湘潭'}
          ,{'value':'湘西', 'name': '湘西'}
          ,{'value':'益阳', 'name': '益阳'}
          ,{'value':'永州', 'name': '永州'}
          ,{'value':'岳阳', 'name': '岳阳'}
          ,{'value':'张家界', 'name': '张家界'}
          ,{'value':'株洲', 'name': '株洲'}
   ];
   var jiangsu = [
          {'value':'南京', 'name': '南京'} 
          ,{'value':'常州', 'name': '常州'}
          ,{'value':'淮安', 'name': '淮安'}
          ,{'value':'连云港', 'name': '连云港'}
          ,{'value':'南通', 'name': '南通'}
          ,{'value':'苏州', 'name': '苏州'}
          ,{'value':'宿迁', 'name': '宿迁'}
          ,{'value':'秦州', 'name': '秦州'}
          ,{'value':'无锡', 'name': '无锡'}
          ,{'value':'徐州', 'name': '徐州'}
          ,{'value':'盐城', 'name': '盐城'}
          ,{'value':'扬州', 'name': '扬州'}
          ,{'value':'镇江', 'name': '镇江'}
   ];
   var jiangxi = [
	      {'value':'南昌', 'name': '南昌'} 
	      ,{'value':'抚州', 'name': '抚州'}
	      ,{'value':'赣州', 'name': '赣州'}
	      ,{'value':'吉安', 'name': '吉安'}
	      ,{'value':'景德镇', 'name': '景德镇'}
	      ,{'value':'九江', 'name': '九江'}
	      ,{'value':'萍乡', 'name': '萍乡'}
	      ,{'value':'上饶', 'name': '上饶'}
	      ,{'value':'新余', 'name': '新余'}
	      ,{'value':'宜春', 'name': '宜春'}
	      ,{'value':'鹰潭', 'name': '鹰潭'}
   ];
   var jilin = [
          {'value':'长春', 'name': '长春'} 
          ,{'value':'白城', 'name': '白城'}
          ,{'value':'白山', 'name': '白山'}
          ,{'value':'吉林', 'name': '吉林'}
          ,{'value':'辽源', 'name': '辽源'}
          ,{'value':'四平', 'name': '四平'}
          ,{'value':'松原', 'name': '松原'}
          ,{'value':'通化', 'name': '通化'}
          ,{'value':'延边', 'name': '延边'}
   ];
   var liaoning = [
          {'value':'沈阳', 'name': '沈阳'} 
          ,{'value':'鞍山', 'name': '鞍山'} 
          ,{'value':'本溪', 'name': '本溪'}
          ,{'value':'朝阳', 'name': '朝阳'}
          ,{'value':'大连', 'name': '大连'}
          ,{'value':'丹东', 'name': '丹东'}
          ,{'value':'抚顺', 'name': '抚顺'}
          ,{'value':'阜新', 'name': '阜新'}
          ,{'value':'葫芦岛', 'name': '葫芦岛'}
          ,{'value':'锦州', 'name': '锦州'}
          ,{'value':'辽阳', 'name': '辽阳'}
          ,{'value':'盘锦', 'name': '盘锦'}
          ,{'value':'铁岭', 'name': '铁岭'}
          ,{'value':'营口', 'name': '营口'}
   ];
   var neimenggu = [
          {'value':'呼和浩特', 'name': '呼和浩特'} 
          ,{'value':'阿拉善盟', 'name': '阿拉善盟'}
          ,{'value':'巴彦淖尔', 'name': '巴彦淖尔'}
          ,{'value':'包头', 'name': '包头'}
          ,{'value':'赤峰', 'name': '赤峰'}
          ,{'value':'鄂尔多斯', 'name': '鄂尔多斯'}
          ,{'value':'呼伦贝尔', 'name': '呼伦贝尔'}
          ,{'value':'通辽', 'name': '通辽'}
          ,{'value':'乌海', 'name': '乌海'}
          ,{'value':'乌兰察布', 'name': '乌兰察布'}
          ,{'value':'锡林郭勒', 'name': '锡林郭勒'}
          ,{'value':'兴安盟', 'name': '兴安盟'}
   ];
   var ningxia = [
		  {'value':'银川', 'name': '银川'} 
		  ,{'value':'固原', 'name': '固原'}
		  ,{'value':'石嘴山', 'name': '石嘴山'}
		  ,{'value':'吴忠', 'name': '吴忠'}
		  ,{'value':'中卫', 'name': '中卫'}   
   ];
   var qinghai = [
          {'value':'西宁', 'name': '西宁'} 
          ,{'value':'格尔木', 'name': '格尔木'}
          ,{'value':'果洛', 'name': '果洛'}
          ,{'value':'海北', 'name': '海北'}
          ,{'value':'海东', 'name': '海东'}    
          ,{'value':'海南', 'name': '海南'}
          ,{'value':'海西', 'name': '海西'}
          ,{'value':'黄南', 'name': '黄南'}
          ,{'value':'玉树', 'name': '玉树'}    
   ];
   var shandong = [
          {'value':'济南', 'name': '济南'} 
          ,{'value':'滨州', 'name': '滨州'}
          ,{'value':'德州', 'name': '德州'}
          ,{'value':'东营', 'name': '东营'} 
          ,{'value':'菏泽', 'name': '菏泽'}
          ,{'value':'济宁', 'name': '济宁'}
          ,{'value':'莱芜', 'name': '莱芜'} 
          ,{'value':'聊城', 'name': '聊城'}
          ,{'value':'临沂', 'name': '临沂'}
          ,{'value':'青岛', 'name': '青岛'} 
          ,{'value':'日照', 'name': '日照'}
          ,{'value':'泰安', 'name': '泰安'}
          ,{'value':'威海', 'name': '威海'} 
          ,{'value':'潍坊', 'name': '潍坊'}
          ,{'value':'烟台', 'name': '烟台'}
          ,{'value':'枣庄', 'name': '枣庄'} 
          ,{'value':'淄博', 'name': '淄博'} 
   ];
   //山西
   var shanxi1 = [
		  {'value':'太原', 'name': '太原'} 
		  ,{'value':'长治', 'name': '长治'}   
		  ,{'value':'大同', 'name': '大同'}   
		  ,{'value':'晋城', 'name': '晋城'}   
		  ,{'value':'晋中', 'name': '晋中'}   
		  ,{'value':'临汾', 'name': '临汾'}   
		  ,{'value':'吕梁', 'name': '吕梁'}   
		  ,{'value':'朔州', 'name': '朔州'}   
		  ,{'value':'忻州', 'name': '忻州'}  
		  ,{'value':'阳泉', 'name': '阳泉'}   
		  ,{'value':'运城', 'name': '运城'}   
   ];
   //陕西
   var shanxi2 = [
          {'value':'西安', 'name': '西安'} 
          ,{'value':'安康', 'name': '安康'}   
          ,{'value':'宝鸡', 'name': '宝鸡'}
          ,{'value':'汉中', 'name': '汉中'}   
          ,{'value':'商洛', 'name': '商洛'}
          ,{'value':'铜川', 'name': '铜川'}   
          ,{'value':'渭南', 'name': '渭南'}
          ,{'value':'咸阳', 'name': '咸阳'}   
          ,{'value':'延安', 'name': '延安'}
          ,{'value':'杨凌', 'name': '杨凌'}
          ,{'value':'榆林', 'name': '榆林'}
   ];
   var sichuan = [
          {'value':'成都', 'name': '成都'} 
          ,{'value':'阿坝', 'name': '阿坝'}   
          ,{'value':'巴中', 'name': '巴中'}
          ,{'value':'达州', 'name': '达州'}   
          ,{'value':'德阳', 'name': '德阳'}
          ,{'value':'甘孜', 'name': '甘孜'}   
          ,{'value':'广安', 'name': '广安'}
          ,{'value':'广元', 'name': '广元'}   
          ,{'value':'乐山', 'name': '乐山'}
          ,{'value':'凉山', 'name': '凉山'}   
          ,{'value':'泸州', 'name': '泸州'}
          ,{'value':'眉山', 'name': '眉山'}   
          ,{'value':'绵阳', 'name': '绵阳'}
          ,{'value':'南充', 'name': '南充'}   
          ,{'value':'内江', 'name': '内江'}
          ,{'value':'攀枝花', 'name': '攀枝花'}   
          ,{'value':'遂宁', 'name': '遂宁'}
          ,{'value':'雅安', 'name': '雅安'}   
          ,{'value':'宜宾', 'name': '宜宾'}
          ,{'value':'资阳', 'name': '资阳'}   
          ,{'value':'自贡', 'name': '自贡'}
   ];
   var xizang = [
          {'value':'拉萨', 'name': '拉萨'} 
          ,{'value':'阿里', 'name': '阿里'}   
          ,{'value':'昌都', 'name': '昌都'}
          ,{'value':'林芝', 'name': '林芝'}   
          ,{'value':'那曲', 'name': '那曲'}
          ,{'value':'日喀则', 'name': '日喀则'}   
          ,{'value':'山南', 'name': '山南'}
   ];
   var xinjiang = [
		  {'value':'乌鲁木齐', 'name': '乌鲁木齐'} 
		  ,{'value':'阿克苏', 'name': '阿克苏'}   
		  ,{'value':'阿拉尔', 'name': '阿拉尔'}
		  ,{'value':'阿勒泰', 'name': '阿勒泰'}   
		  ,{'value':'巴州', 'name': '巴州'}
		  ,{'value':'博州', 'name': '博州'}   
		  ,{'value':'昌吉', 'name': '昌吉'} 
		  ,{'value':'哈密', 'name': '哈密'}   
		  ,{'value':'和田', 'name': '和田'}
		  ,{'value':'喀什', 'name': '喀什'}   
		  ,{'value':'克拉玛依', 'name': '克拉玛依'}
		  ,{'value':'克州', 'name': '克州'}   
		  ,{'value':'石河子', 'name': '石河子'}
		  ,{'value':'塔城', 'name': '塔城'}
		  ,{'value':'吐鲁番', 'name': '吐鲁番'}
		  ,{'value':'伊犁', 'name': '伊犁'}
		  ,{'value':'巴音郭楞', 'name': '巴音郭楞'}
		  ,{'value':'博尔塔拉', 'name': '博尔塔拉'}
   ];
   var yunnan = [
          {'value':'昆明', 'name': '昆明'} 
          ,{'value':'保山', 'name': '保山'}   
          ,{'value':'楚雄', 'name': '楚雄'}
          ,{'value':'大理', 'name': '大理'}
          ,{'value':'德宏', 'name': '德宏'}
          ,{'value':'迪庆', 'name': '迪庆'}
          ,{'value':'红河', 'name': '红河'}
          ,{'value':'丽江', 'name': '丽江'}
          ,{'value':'临沧', 'name': '临沧'}
          ,{'value':'怒江', 'name': '怒江'}
          ,{'value':'普洱', 'name': '普洱'}
          ,{'value':'曲靖', 'name': '曲靖'}
          ,{'value':'文山', 'name': '文山'}
          ,{'value':'西双版纳', 'name': '西双版纳'}
          ,{'value':'玉溪', 'name': '玉溪'}
          ,{'value':'昭通', 'name': '昭通'}
   ];
   var zhejiang = [
          {'value':'杭州', 'name': '杭州'} 
          ,{'value':'湖州', 'name': '湖州'}   
          ,{'value':'嘉兴', 'name': '嘉兴'}
          ,{'value':'金华', 'name': '金华'}
          ,{'value':'丽水', 'name': '丽水'}   
          ,{'value':'宁波', 'name': '宁波'}
          ,{'value':'衢州', 'name': '衢州'}
          ,{'value':'绍兴', 'name': '绍兴'}   
          ,{'value':'台州', 'name': '台州'}
          ,{'value':'温州', 'name': '温州'}
          ,{'value':'舟山', 'name': '舟山'}
          ,{'value':'临海', 'name': '临海'}
   ];
   var hongkong = [
          {'value':'香港', 'name': '香港'} 
          ,{'value':'九龙', 'name': '九龙'}   
          ,{'value':'新界', 'name': '新界'}
   ];
   var macau = [
           {'value':'澳门', 'name': '澳门'} 
           ,{'value':'氹仔岛', 'name': '氹仔岛'}   
           ,{'value':'路环岛', 'name': '路环岛'}    
   ];
   var taiwan = [
           {'value':'台北', 'name': '台北'} 
           ,{'value':'桃园', 'name': '桃园'}   
           ,{'value':'新竹', 'name': '新竹'}
           ,{'value':'宜兰', 'name': '宜兰'}
           ,{'value':'高雄', 'name': '高雄'}
           ,{'value':'嘉义', 'name': '嘉义'}
           ,{'value':'屏东', 'name': '屏东'}
           ,{'value':'台东', 'name': '台东'}
           ,{'value':'台南', 'name': '台南'}
           ,{'value':'台中', 'name': '台中'}
           ,{'value':'花莲', 'name': '花莲'}
           ,{'value':'苗栗', 'name': '苗栗'}
           ,{'value':'南投', 'name': '南投'}
           ,{'value':'云林', 'name': '云林'}
           ,{'value':'彰化', 'name': '彰化'}
   ];
   
   function showCities(province){
	   var newCities;
	   log(province);
	   switch(province){
	   case 1:
		   newCities = beijing; 
		   break;
	   case 2:
		   newCities = shanghai; 
		   break;
	   case 3:
		   newCities = tianjin; 
		   break;
	   case 4:
		   newCities = chongqing; 
		   break;
	   case 5:
		   newCities = anhui; 
		   break;
	   case 6:
		   newCities = fujian; 
		   break;
	   case 7:
		   newCities = gansu; 
		   break;
	   case 8:
		   newCities = guangdong; 
		   break;
	   case 9:
		   newCities = guangxi; 
		   break;
	   case 10:
		   newCities = guizhou; 
		   break;
	   case 11:
		   newCities = hainan; 
		   break;
	   case 12:
		   newCities = hebei; 
		   break;
	   case 13:
		   newCities = henan; 
		   break;
	   case 14:
		   newCities = heilongjiang; 
		   break;
	   case 15:
		   newCities = hubei; 
		   break;
	   case 16:
		   newCities = hunan; 
		   break;
	   case 17:
		   newCities = jiangsu; 
		   break;
	   case 18:
		   newCities = jiangxi; 
		   break;
	   case 19:
		   newCities = jilin; 
		   break;
	   case 20:
		   newCities = liaoning; 
		   break;
	   case 21:
		   newCities = neimenggu; 
		   break;
	   case 22:
		   newCities = ningxia; 
		   break;
	   case 23:
		   newCities = qinghai; 
		   break;
	   case 24:
		   newCities = shandong; 
		   break;
	   case 25:
		   newCities = shanxi1; 
		   break;
	   case 26:
		   newCities = shanxi2; 
		   break;
	   case 27:
		   newCities = sichuan; 
		   break;
	   case 28:
		   newCities = xizang; 
		   break;
	   case 29:
		   newCities = xinjiang; 
		   break;
	   case 30:
		   newCities = yunnan; 
		   break;
	   case 31:
		   newCities = zhejiang; 
		   break;
	   case 32:
		   newCities = hongkong; 
		   break;
	   case 33:
		   newCities = macau; 
		   break;
	   case 34:
		   newCities = taiwan; 
		   break;
		   default:
		   break;
	   }
	   return newCities; 
   }