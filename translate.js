/**
 * 经纬度转墨卡托
 * @param poi 经纬度
 * @returns {{}}
 * @private
 */
function _getMercator(lon,lat) {//[114.32894, 30.585748]
    var mercator = {};
    var earthRad = 6378137.0;
    // console.log("mercator-poi",poi);
    mercator.x = lon * Math.PI / 180 * earthRad;
    var a = lat * Math.PI / 180;
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    // console.log("mercator",mercator);
    return mercator; //[12727039.383734727, 3579066.6894065146]
}
/**
 * 墨卡托转经纬度
 * @param poi 墨卡托
 * @returns {{}}
 * @private
 */
function _getlonLat(x, y){
    var lonlat = {};
    lonlat.lon = x/20037508.34*180;
    var mmy = y/20037508.34*180;
    lonlat.lat = 180/Math.PI*(2*Math.atan(Math.exp(mmy*Math.PI/180))-Math.PI/2);
    return lonlat;
}