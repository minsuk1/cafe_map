const mapContainer = document.getElementById("map");
const mapOption = {
    center : new daum.maps.LatLng(37.554477, 126.97041),
    level : 3,
};

let map = new daum.maps.Map(mapContainer, mapOption);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

let infowindow = new daum.maps.InfoWindow({
    zIndex: 1,
});

let markerList = [];

currentx=37.498095; currenty= 127.027610

function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2))
        return 0;

    var radLat1 = Math.PI * lat1 / 180;
    var radLat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radTheta = Math.PI * theta / 180;
    var dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1)
        dist = 1;

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
}



function removeAllchildNodes(el){
    while(el.hasChildNodes()){
        el.removeChild(el.lastChild);
    }
}

function removeMarker(){
    for(let i=0; i<markerList.length; i++){
        markerList[i].setMap(null)
    }
    markerList=[]
}



function displayInfowindow(marker, title, address, lat, lng){
    let content = `
    <div style="padding:25px;">
        ${title}<br>
        ${address}<br>
        <button onClick = "onSubmit('${title}','${address}',${lat},${lng});">등록</button>
    </div>
    `;
    map.panTo(marker.getPosition());
    infowindow.setContent(content);
    infowindow.open(map, marker);
}



let ps = new daum.maps.services.Places();

searchPlaces();

function searchPlaces() {
    let keyword = $("#keyword").val();
    ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status) {
    if (status === daum.maps.services.Status.OK) {
        displayPlaces(data);
    }else if (status === daum.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다")
        return;
    }else if (status === daum.maps.services.Status.ERROR) {
        alert("검색 결과중 오류가 발생했습니다")
        return;
    }
}

function displayPlaces(data) {
    let listEl = document.getElementById("placesList");
    let bounds = new daum.maps.LatLngBounds();

    removeAllchildNodes(listEl);
    removeMarker();

    for (let i = 0; i < data.length; i++) {
        if (getDistance(currentx,currenty,data[i].y,data[i].x) < 1000){
        let lat = data[i].y;
        let lng = data[i].x;
        let address_name = data[i]["address_name"];
        let place_name = data[i]["place_name"];

        const placePosition = new daum.maps.LatLng(lat, lng);
        bounds.extend(placePosition);

        let marker = new daum.maps.Marker({
            position : placePosition,
        });

        marker.setMap(map);
        markerList.push(marker);

        const el = document.createElement("div");
        const itemStr = `
            <div class="info">
                <div class="info_title">
                    ${place_name}
                </div>
                <span>${address_name}</span>
            </div>
        `;

        el.innerHTML = itemStr;
        el.className = "item";

        daum.maps.event.addListener(marker, "click", function(){
            displayInfowindow(marker, place_name, address_name, lat, lng);
        });

        daum.maps.event.addListener(map, "click", function() {
            infowindow.close();
        });

        el.onclick = function () {
            displayInfowindow(marker, place_name, address_name, lat, lng);
        };

        listEl.appendChild(el);
    }else{
        console.log(2)
    }}
    map.setBounds(bounds);
}


function onSubmit(title,address,lat,lng){
    $.ajax({
        url:"/location",
        data:{title,address,lat,lng},
        type:"POST",
        dataType:"json"
    }).done((response)=>{
            console.log("데이터 요청 성공")
            alert("성공")
        }).fail((error)=>{
            console.log("데이터 요청 실패")
            alert("실패")
        })
}
