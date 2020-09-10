/* global ol */

'use strict';

const mapExtent = [-6000, -5000, 6000, 5000];

const map = new ol.Map({
    target: 'openlayers-map',
    view: new ol.View({
        center: [0, 0],
        zoom: 13.5,
        maxZoom: 18,
        minZoom: 13,
        projection: 'EPSG:3857',
        extent: [mapExtent[0] - 4000, mapExtent[1] - 4000, mapExtent[2] + 4000, mapExtent[3] + 4000],
        smoothExtentConstraint: false
    })
});

const scaleLine = new ol.control.ScaleLine();
map.addControl(scaleLine);

const baseLayer = new ol.layer.Tile({
    extent: mapExtent,
    source: new ol.source.XYZ({
        url: 'tiles/{z}/{x}/{y}.png',
        opaque: true
    })
});

// const baseLayer = new ol.layer.Image({

//     source: new ol.source.ImageStatic({
//         url: 'tiles/BotW-Map-SMALL.jpeg',
//         imageExtent: mapExtent,
//         projection: new ol.proj.Projection({
//             units: 'pixels',
//             extent: mapExtent,
//         })
//     }),
// });

map.addLayer(baseLayer);

// let debugLayer = new ol.layer.Tile({
//     source: new ol.source.TileDebug()
// });

// map.addLayer(debugLayer);

const towerLayer = new ol.layer.Vector({
    zIndex: 1000,
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'images/icons/tower.svg'
        })
    })
});

map.addLayer(towerLayer);


const shrineLayer = new ol.layer.Vector({
    zIndex: 500,
    source: new ol.source.Vector(),
    style: function (feature) {
        let zoom = map.getView().getZoom();

        let style = new ol.style.Style({
            image: new ol.style.Icon({
                src: 'images/icons/shrine.svg'
            })
        });

        if (zoom >= 15) {
            style.setText(new ol.style.Text({
                font: '14px sans-serif',
                text: feature.get('name'),
                offsetY: 12,
                fill: new ol.style.Fill({color: '#fff'}),
                stroke: new ol.style.Stroke({color: '#000', width: 0.5}),
                textBaseline: 'top'
            }));
        }

        return style;
    }
});

map.addLayer(shrineLayer);


const shrineDlcLayer = new ol.layer.Vector({
    zIndex: 500,
    source: new ol.source.Vector(),
    style: function (feature) {
        let zoom = map.getView().getZoom();

        let style = new ol.style.Style({
            image: new ol.style.Icon({
                src: 'images/icons/shrine-dlc.svg'
            })
        });

        if (zoom >= 15) {
            style.setText(new ol.style.Text({
                font: '14px sans-serif',
                text: feature.get('name'),
                offsetY: 12,
                fill: new ol.style.Fill({color: '#fff'}),
                stroke: new ol.style.Stroke({color: '#000', width: 0.5}),
                textBaseline: 'top'
            }));
        }

        return style;
    }
});

map.addLayer(shrineDlcLayer);


const korokSeedLayer = new ol.layer.Vector({
    zIndex: 300,
    minZoom: 15,
    source: new ol.source.Vector({
        features: [],
    }),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'images/icons/korok-seed.png',
            scale: 0.5
        })
    })
});

map.addLayer(korokSeedLayer);


const get_json = (url, callback) => {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState != XMLHttpRequest.DONE) {
            return;
        }

        let txt = this.responseText;
        let json;
        try {
            json = JSON.parse(txt);
        } catch (e) {
            console.error('ajax parse JSON error');
            return;
        }

        callback(json);
    };

    xhr.open('GET', url);
    xhr.send();
};

const features_form_json = (arr, feature_name) => {
    let features = [];
    for (let item of arr) {

        let coor = item.coordinate;
        coor[1] = -coor[1];

        let feature = new ol.Feature({
            geometry: new ol.geom.Point(coor),
            name: item.title_chs ?? feature_name
        });

        features.push(feature);
    }
    return features;
};


const fetch_map_data = () => {
    get_json('data/tower.json', (data) => {
        let features = features_form_json(data);
        towerLayer.getSource().addFeatures(features);
    });

    get_json('data/shrine.json', (data) => {
        let features = features_form_json(data);
        shrineLayer.getSource().addFeatures(features);
    });

    get_json('data/shrine-dlc.json', (data) => {
        let features = features_form_json(data);
        shrineDlcLayer.getSource().addFeatures(features);
    });

    get_json('data/korok-seed.json', (data) => {
        let features = features_form_json(data, '呀哈哈');
        korokSeedLayer.getSource().addFeatures(features);
    });
};

fetch_map_data();

const init_map_event = () => {
    const popup = new ol.Overlay({
        element: document.getElementById('popup'),
        positioning: 'bottom-center',
        offset: [0, -12]
    });
    map.addOverlay(popup);

    let select = new ol.interaction.Select();
    select.on('select', function (e) {
        if (e.selected.length == 0) {
            popup.setPosition();
            return;
        }

        let feature = e.selected[0];
        let content = feature.get('name');

        let coor = feature.getGeometry().getCoordinates();
        let el_content = document.getElementById('popup-content');
        el_content.innerHTML = content;

        popup.setPosition(coor);
    });

    map.addInteraction(select);
};

init_map_event();



