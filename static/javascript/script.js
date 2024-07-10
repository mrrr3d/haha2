window._AMapSecurityConfig = {
    serviceHost:'http://127.0.0.1:80/_AMapService',
};

var markerMap = new Map();
var map = new AMap.Map('container', {
    viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
    zoom: 12, // 初始化地图层级
});
var trafficLayer = new AMap.TileLayer.Traffic({
    zIndex: 10,
    zooms: [7, 22],
});
var trafficLayerVisible = false;

var items;
// 当窗口大小改变时调整布局
window.addEventListener('resize', adjustLayout);
// 页面加载完成时立即调整布局
window.addEventListener('load', adjustLayout);
listItemsInit();

function listItemsInit () {
    var location_list = document.getElementById("leftPanel");
    items = location_list.getElementsByTagName('li');
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', handleClick);
    }
    if (items.length > 0) {
        items[0].click();
        let pos = markerMap.get(1);
        map.setCenter ([pos[0], pos[1]]);
    }
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
    var start = Math.min(parseInt(startStr), items.length + 1);
    var end = Math.min(parseInt(endStr), items.length + 1);
    for (var i = start;i <= end;i ++) {
        var isSelected = items[i - 1].getAttribute('selected_flag');
        if (isSelected === 'false') {
            items[i - 1].click();
        }
    }
}

function lastChooseNum (val) {
    var valint = Math.min(parseInt(val), items.length + 1);
    for (var i = 1;i <= valint;i ++) {
        var isSelected = items[i - 1].getAttribute('selected_flag');
        if (isSelected === 'false') {
            items[i - 1].click();
        }
    }
}

function clearChooseItems (startNum) {
    for (var i = parseInt(startNum);i < items.length;i ++) {
        var isSelected = items[i].getAttribute('selected_flag');
        if (isSelected === 'true') {
            items[i].click();
        }
    }
}

function trafficButton () {
    if (trafficLayerVisible) {
        map.removeLayer(trafficLayer);
        trafficLayerVisible = false;
    } else {
        map.addLayer(trafficLayer);
        trafficLayerVisible = true;
    }
}

function reloadLogData () {
    var xhr = new XMLHttpRequest();
    var timestamp = (new Date()).getTime();
    xhr.open('GET', '/getloc/reload_log_data/?timestamp=' + timestamp, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            clearChooseItems(0);
            var data = JSON.parse(xhr.responseText);
            var ul = document.querySelector("ul");
            ul.innerHTML = '';
            for (var i = 0;i < data.length;i ++) {
                let item = data[i];
                let li = document.createElement('li');
                li.setAttribute('id', 'item_' + item[0]);
                li.setAttribute('selected_flag', 'false');
                li.setAttribute('num', item[0]);
                li.setAttribute('brand', item[1]);
                li.setAttribute('time', item[2]);
                li.setAttribute('longti', item[3]);
                li.setAttribute('lati', item[4]);
                li.setAttribute('speed', item[5]);
                var label = document.createElement('label');
                var span = document.createElement('span');
                span.innerHTML = item[0] + '&emsp;' + item[1] + '&emsp;' + item[2] + '<br>经度: ' + item[3] + '<br>纬度: ' + item[4] + '<br>速度: ' + item[5];
                label.appendChild(span);
                label.innerHTML += '<br>';
                li.appendChild(label);
                ul.appendChild(li);
            }
            listItemsInit();
        }
    }
    xhr.send();
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
