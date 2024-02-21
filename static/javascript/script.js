window._AMapSecurityConfig = {
    securityJsCode: "",
};

var loader = AMapLoader.load({
    key: "",
    version: "2.0",
});

var markerPositions = [];

function loadMap() {
    loader.then((AMap) => {

        
        var map = new AMap.Map("container", {
            mapStyle: "amap://styles/normal",
            viewMode: '2D',
            zoom: 12,
            center: [markerPositions[0][1], markerPositions[0][2]],
        });

        for (var i = 0; i < markerPositions.length; i++) {
            const markerContent = `<div class="custom-content-marker">
                <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
                </div>`;
            let position = new AMap.LngLat(markerPositions[i][1], markerPositions[i][2]);

            marker = new AMap.Marker({
                position: position,
                content: markerContent,
                title: markerPositions[i][0],
                offset: new AMap.Pixel(-13, -30),
            });
            map.add(marker);
        }
    }).catch((e) => {
        console.error(e);
    });
}



var location_list = document.getElementById("leftPanel");
var items = location_list.getElementsByTagName('li');

for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', handleClick);
}

if (items.length > 0) {
    items[0].click();
}

function handleClick(event) {
    var item = event.target.closest('li');
    var isSelected = item.getAttribute('selected_flag');
    var num = item.getAttribute('num')
    var longitude = parseFloat(item.getAttribute('longti'));
    var latitude = parseFloat(item.getAttribute('lati'));
    var position = [num, longitude, latitude];

    if (isSelected === 'true') {
        item.setAttribute('selected_flag', "false");
        document.getElementById(item.id).classList.toggle("item_selected");
    } else {
        item.setAttribute('selected_flag', "true");
        document.getElementById(item.id).classList.add("item_selected");
    }
    if (isSelected === 'true') {
        var index = markerPositions.findIndex(function (pos) {
            return pos[1] === longitude && pos[2] === latitude;
        });
        if (index !== -1) {
            markerPositions.splice(index, 1);
        }
    } else {
        markerPositions.push(position);
    }
    loadMap();
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