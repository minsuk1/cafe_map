
var position = new naver.maps.LatLng(37.3595704, 127.105399);
var mapOptions = {
    center: position,
    zoom: 10
};


var map = new naver.maps.Map('map', mapOptions);


$.ajax({
    url:"/location",
    type:"GET",
    dataType:"json",
}).done((response)=>{
    //if (response!=="success") return;
    const data= response.data
    console.log(data)

    var markerList = [];
    var infowindowList = []
        
    function getClickHandler(i) {
        return function () {
            var marker = markerList[i];
            var infowindow = infowindowList[i];
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker)
            }
        }
    }

    function clickMap(i) {
        return function () {
            var infowindow = infowindowList[i];
            infowindow.close()
        }
    }



    
    for (var i in data) {
    
        var target = data[i];
        var latlng = new naver.maps.LatLng(target.lat, target.lng);
        marker = new naver.maps.Marker({
            map: map,
            position: latlng,
            icon: {
                content: '<div class="marker"></div>',
                anchor: new naver.maps.Point(7.5, 7.5)
            },
        });
        var content = `<div class="infowindowWrap">
        <div class="infowindowTitle">${target.title}</div>
        <div class="infowindowContent">${target.address}</div>
        </div>`
        var infowindow = new naver.maps.InfoWindow({
            content: content,
            backgroundColor: "#00ff0000",
            borderColor: "#00ff0000",
            anchorSize: new naver.maps.Size(0, 0)
        })
        markerList.push(marker);
        infowindowList.push(infowindow);
    }

    for (var i = 0, ii = markerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", clickMap(i));
        naver.maps.Event.addListener(markerList[i], "click", getClickHandler(i));
    }
})
