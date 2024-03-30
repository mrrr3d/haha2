window._AMapSecurityConfig = {
    serviceHost:'http://127.0.0.1:80/_AMapService',
};

var markerMap = new Map();
var map = new AMap.Map('container', {
    viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
    zoom: 12, // 初始化地图层级
});

var location_list = document.getElementById("leftPanel");
var items = location_list.getElementsByTagName('li');
// 当窗口大小改变时调整布局
window.addEventListener('resize', adjustLayout);
// 页面加载完成时立即调整布局
window.addEventListener('load', adjustLayout);

for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', handleClick);
}

if (items.length > 0) {
    items[0].click();
    let pos = markerMap.get(1);
    map.setCenter ([pos[0], pos[1]]);
}

function addMarker(num, pos) {
    const markerContent = `<div class="custom-content-marker">
                <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
                </div>`;

    let marker = new AMap.Marker({
        position: new AMap.LngLat(pos[0], pos[1]),
        content: markerContent,
        title: num,
        offset: new AMap.Pixel(-13, -30),
    });
    map.add(marker);
    return marker;
}

function handleClick(event) {
    var item = event.target.closest('li');
    var isSelected = item.getAttribute('selected_flag');
    var num = parseInt(item.getAttribute('num'));
    var longitude = parseFloat(item.getAttribute('longti'));
    var latitude = parseFloat(item.getAttribute('lati'));
    var position = [longitude, latitude];

    // delete marker
    if (isSelected === 'true') {
        item.setAttribute('selected_flag', "false");
        document.getElementById(item.id).classList.toggle("item_selected");
        map.remove(markerMap.get(num)[2]);
        markerMap.delete(num);
    } else { // add new marker
        item.setAttribute('selected_flag', "true");
        document.getElementById(item.id).classList.add("item_selected");
        let newMarker = addMarker(num, position);
        position.push(newMarker);
        markerMap.set(num, position);
    }
}

function queryData() {
    var startStr = document.getElementById("start-input").value;
    var endStr = document.getElementById("end-input").value;
    var start = parseInt(startStr);
    var end = parseInt(endStr);

    for (var i = start;i <= end;i ++) {
        var isSelected = items[i - 1].getAttribute('selected_flag');
        if (isSelected === 'false') {
            items[i - 1].click();
        }
    }
}

function lastChooseNum (val) {
    var valint = parseInt(val)
    for (var i = 1;i <= valint;i ++) {
        var isSelected = items[i - 1].getAttribute('selected_flag');
        if (isSelected === 'false') {
            items[i - 1].click();
        }
    }
}

function adjustLayout () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (width < height) {
        document.getElementById('leftPanel').style.width = '100%';
        document.getElementById('leftPanel').style.height = '35%';
        document.getElementById('container').style.width = '100%';
        document.getElementById('container').style.height = '65%';
    }
    else {
        document.getElementById('leftPanel').style.width = '18%';
        document.getElementById('leftPanel').style.height = '100%';
        document.getElementById('container').style.width = '82%';
        document.getElementById('container').style.height = '100%';
    }
}
