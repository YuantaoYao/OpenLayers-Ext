/**
 * method ： *makeAnimatorFromGeo*
 * describe ： 创建路径动画效果需要先加载GeoGlobeJS.min.js文件
 * parameter： 
 * 		  moveImg 移動對象 一般是PNG
 * 		  speed 移动熟读
 * 		  map 基礎map
 * 		  callback 回调函数
 * 		  argument {lon:20,lat:20},{lon:20,lat:20},………
 * 			
 * return ：
 * 		  animator 返回动画对象 用于对移动对象的操作  start() stop() pause()
 * 
 * ep: var animator = makeAnimatorFromGeo("dd","img/people.png",40,map,null,{lon:-2000000,lat:4000000},{lon:5000000,lat:-3000000});
 * **/
function makeAnimatorFromGeo(name,moveImg,speed,map,callback){
	var l = 5;
	var len = arguments.length;
	var animator = new Geo.Animator();
	var vectorLayer = new Geo.View2D.Layer.Vector(name);
	if(len > l){
		var points = [];
		var mlon = arguments[l].lon;
		var mlat = arguments[l].lat;
		var lonlat = new OpenLayers.LonLat(mlon,mlat);
		var size = new OpenLayers.Size(20,20);
		var movePoint = new Geo.Feature.Vector(
										new Geo.Geometry.Point(lonlat.lon,lonlat.lat),
										null,
										{
										externalGraphic : moveImg,
										graphicWidth : 20,
										graphicHeight : 20
										}
		);
		var lonlat = new OpenLayers.LonLat(tlon,tlat);
		for(var i=l;i<len;i++){
			var tlon = arguments[i].lon;
			var tlat = arguments[i].lat;
			var lonlat = new OpenLayers.LonLat(tlon,tlat);
			points.push(new Geo.Geometry.Point(lonlat.lon,lonlat.lat));
		}
		var trackLine = new Geo.Feature.Vector(
									new Geo.Geometry.LineString(points),
									null,
									{
										strokeColor: "#00FF00", 
										strokeWidth: 3, 
										strokeDashstyle: "dashdot", 
										pointRadius: 1, 
										pointerEvents: "visiblePainted"
									}
		);
		vectorLayer.addFeatures([trackLine,movePoint]);
		map.addLayer(vectorLayer);
		animator.setFeature(movePoint);
		//当加载不同地图时移动速度不同
		animator.moveAlong(trackLine,{ratio : speed});
		if(!!callback && typeof callback !="undefined"){
			callback.apply(this,[animator,movePoint,trackLine]);
		}
		return animator;
	}
}
/**
 * method ： *makeLocationImgFramedCloud*
 * describe ： 自定义添的加Img路径消息气球
 * parameter： lon 经度
 *  	      lat 维度
 * 			  frameHtml html内容
 *   	      map 基础map
 * 			  callback 回调函数
 * ep : makeLocationImgFramedCloud(20,20,"<div style='font-size:.8em'>Feature: 顶顶反反复复付发发发方法的顶dddddddd<br><br><br><br>Area: 122</div>",map,null);
 * **/
function makeLocationImgFramedCloud(lon,lat,frameHtml,map,callback){
		var lonlat = new OpenLayers.LonLat(lon,lat);
		var size = new OpenLayers.Size(0,0);
		var popup = new OpenLayers.Popup.ImgFramedCloud("child",
									   lonlat,
									   size,
									   frameHtml,
									   null,
									   "../../img/cloud-popup-relative.png",
									   true,
									   null
									   );
		map.addPopup(popup);	
		if(!!callback && typeof callback !="undefined"){
			callback.call(popup);
		}
		return popup;
}
/**
 * method ： *makeLocationCSSFramedCloud*
 * describe ： 自定义消息气球
 * parameter： lon 经度
 *        lat 维度
 * 		  width 气球宽度
 * 		  height 气球高度
 * 		  frameHtml html内容
 *        map 基础map
 * 		  callback 回调函数
 * ep : makeLocationCSSFramedCloud(23,23,"<div style='font-size:.8em'>Feature: 顶顶反反复复付发发发方法的顶dddddddd<br><br><br><br>Area: 122</div>",map,null);
 * **/
function makeLocationCSSFramedCloud(lon,lat,frameHtml,map,callback){
	var lonlat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
	var size = new OpenLayers.Size(0,0);
	var popup = new OpenLayers.Popup.CSSFramedCloud("Frame Element",
                                 lonlat,
                                 size,
                                 frameHtml,
                                 null,
                                 true, null,null);
    map.addPopup(popup);
    if(!!callback && typeof callback !="undefined"){
		callback.call(popup);
	}
    return popup;
}
/**
 * method ： *makeLocationPopup*
 * describe ： 添加消息气球
 * parameter： lon 经度
 *        lat 维度
 * 		  width 气球宽度
 * 		  height 气球高度
 * 		  popupHtml html内容
 * 		  callback 回调函数
 * ep : makeLocationPopup(23,23,100,60,"<div style='border:2px solid #CCC;width:100px;height:50px;'>ddss</div>",map,null)
 * **/
function makeLocationPopup(lon,lat,width,height,popupHtml,map,callback){
	var lonlat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
	var size = new OpenLayers.Size(width,height);
	var popup = new OpenLayers.Popup.Anchored('Anchored Element',
												lonlat, 
												size, 
												popupHtml, 
												null, 
												false, 
												null);
    map.addPopup(popup);
	if(!!callback && typeof callback !="undefined"){
		callback.call(popup);
	}
	return popup;
}
/**
 * method ： *makeLocationLink*
 * describe ： 添加轨迹
 * parameter： startLon 开始经度
 *        startLat 开始维度
 * 		  endLon 结束经度
 *        endLat 结束经度
 *        map 基础map
 *        name 轨迹名称
 * 		  callback 回调函数
 * ep : 		makeLocationLink(-600000,0,0,1000000,map,"Simple Geometry",null);
 * **/
function makeLocationLink(startLon,startLat,endLon,endLat,map,name,callback){
	var pointList = [];
	
	//画线图层设置 
	var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']); 
//	if(vectors && vectors != ''){
//		//清除以前的路径
//		vectors.removeAllFeatures();
//	}
//	;
	//创建画线图层 
	if(!!map && map.getLayersByName(name).length != 0){
		vectors.setName(name);
	}else{
		vectors = new OpenLayers.Layer.Vector(name, {style: layer_style}); 
		map.addLayer(vectors);
	}
	 
	var autoPoint = new OpenLayers.Geometry.Point(startLon,startLat)
	pointList.push(autoPoint);
	autoPoint = new OpenLayers.Geometry.Point(endLon,endLat);
	pointList.push(autoPoint);
	var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList),
													null,
													{      //线路样式     
														strokeColor: "#00FF00", 
														strokeWidth: 3, 
														strokeDashstyle: "dashdot", 
														pointRadius: 1, 
														pointerEvents: "visiblePainted" 
													}); 
	if(!!callback && typeof callback !="undefined"){
		callback.call(lineFeature,vectors);
	}
	vectors.addFeatures([lineFeature]);
}
/**
 * method ： *makeLocationAnimatorPoint*
 * describe ： 添加动态标记
 * parameter： lon 经度
 *        lat 维度
 * 		  img 标记图片 20*20
 * 		  type 动画效果 0 无动画 1 动画一次 2 连续动画
 * 		  map 基础map
 *        name 标记名称
 * 		  callback 回调函数
 * ep : makeLocationAnimatorPoint(60,20,"img/point.png",1,map,"Poinwtsm",null);
 * **/
function makeLocationAnimatorPoint(lon,lat,img,type,map,name,callback){
	
	if(!!map && map.getLayersByName(name) != 0){
		//同步name属性
		markers.setName(name);
	}else{
		markers = new Geo.View2D.Layer.Markers(name);
		map.addLayer(markers)
	}
	var size = new Geo.Size(40,40);
	var offset = new Geo.Pixel(-(size.w/2),-size.h);
	var icon = new Geo.View2D.Icon(img,size,offset);
	var marker = new Geo.GeoMarker(new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()),icon);
	
	switch (type){
		case 0:
			var AnimationType = "";
			break;
		case 1:
			var AnimationType = Geo.GeoMarker.ANIMATION_DROP;
			break;
		case 2:
			var AnimationType = Geo.GeoMarker.ANIMATION_BOUNCE;
			break;
	}
	
	//设置动画效果。动画类型，像素高度，加速度 
	marker.setAnimation(AnimationType, 20, 500);   
	
	if(!!callback && typeof callback !="undefined"){
		callback.call(marker,markers);
	}
	markers.addMarker(marker);

}
/**
 * method ： *makeLocationPoint*
 * describe ： 添加标记
 * parameter： lon 经度
 *        lat 维度
 * 		  img 标记图片 20*20
 * 		  map 基础map
 *        name 标记名称
 * 		  callback 回调函数
 * ep : makeLocationPoint(60,20,"img/point.png",map,"Pointsm",null)
 * **/
function makeLocationPoint(lon,lat,img,map,name,callback){
	
	if(!!map && map.getLayersByName(name) != 0){
		//同步name属性
		markers.setName(name);
	}else{
		markers = new OpenLayers.Layer.Markers(name);
		map.addLayer(markers)
	}
	var size = new OpenLayers.Size(40,40);
	var offset = new OpenLayers.Pixel(-(size.w/2),-size.h);
	var icon = new OpenLayers.Icon(img,size,offset);
	var marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()),icon);
	
	if(!!callback && typeof callback !="undefined"){
		callback.call(marker,markers);
	}
	markers.addMarker(marker);
}
/**
 * method ： *deleteLayers*
 * describe ： 删除图层
 * parameter： layerName 图层名称
 *        map 基础map
 * 		  callback	回调函数
 * **/
function deleteLayers(layerName,map,callback){
	var layers = map.getLayersByName(layerName);
	for(var index in layers){
		map.removeLayer(layers[index]);
	}
	if(!!callback && typeof callback !="undefined"){
		callback.call(true);
	}
}
function deletePopup(popup,map,callback){
	if(popup && popup != null && popup != ''){
		map.removePopup(popup);
	}
	if(!!callback && typeof callback !="undefined"){
		callback.call(true);
	}
}
/*等待毫秒数*/
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}