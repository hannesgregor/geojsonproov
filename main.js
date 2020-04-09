window.onload = init;



function init() {
    const map = new ol.Map({
        view: new ol.View({
            center: [2883548.994708121, 8077250.034630281],
            zoom: 4,
            maxZoom: 10,
            minZoom: 4
        }),
        target: 'js-map' 
    })

    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard'
    })

    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: true,
        title: 'OSMHumanitarian'
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
            atttributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: false,
        title: 'StamenTerrain'
    })

    // basemaps Groups

    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapStandard,
            openStreetMapHumanitarian,
            stamenTerrain
        ]
    })
    map.addLayer(baseLayerGroup);

    // layer switch logic for base maps

    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    for(let baseLayerElement of baseLayerElements){
       baseLayerElement.addEventListener('change', function(){
           let baseLayerElementValue = this.value;
           baseLayerGroup.getLayers().forEach(function(element, index, array){
               let baseLayerTitle = element.get('title');
               element.setVisible(baseLayerTitle === baseLayerElementValue);

               
           })
       });
    }

    // vector layers
    
    const fillStyle = new ol.style.Fill({
        color: [4, 111, 255, 0]
})
    const strokeStyle = new ol.style.Stroke({
        color: [0, 111 , 245, 1],
        width: 2
    })

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 25, 24, 1]
        }),
        radius: 7,
        stroke: strokeStyle
    })

    // klikkimisel uus värv
    const clickFillStyle = new ol.style.Fill({
        color: [200, 11, 255, 0.2]
})
    const EUCountriesGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector_data/EuroopaRiigid.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'EUCountriesGeoJSON',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle
        })
    })

    map.addLayer(EUCountriesGeoJSON);

    //vector Feature popup logic
const overlayContainerElement = document.querySelector('.overlay-container');
const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
})



    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureAddition = document.getElementById('feature-additional-info')

    map.on('click', function(e){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            let clickedFeatureName = feature.get('name');
            let clickedFeatureAdditionInfo = feature.get('additionalinfo');
            overlayLayer.setPosition(clickedCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureAddition.innerHTML = clickedFeatureAdditionInfo;
        },
        {
            layerFilter: function(layerCandidate){
                return layerCandidate.get('title') === 'EUCountriesGeoJSON'
            }
        })
    })
}

function newStyle(id) {
    return {
        fillColor: getColor(id),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

$('feature').on('click', function () {
    var id = $(btn).attr('id');
    var new_style = newStyle(id);
    mylayer.setStyle(new_style);
});
