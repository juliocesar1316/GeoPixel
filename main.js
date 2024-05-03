import './style.css';
import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import { searchCity} from './script';

const mapInput = document.querySelector('#mapInput');
const citySelect = document.querySelector('#citySelect');
const btnConsult = document.querySelector('#btnConsult');

useGeographic();

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
    source: vectorSource,
});

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        vectorLayer
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

function updateMap(coords){
    const coord = [coords.lon, coords.lat];  // Converte as coordenadas para o sistema de projeção do OpenLayers
    map.getView().setCenter(coord);
    map.getView().setZoom(10);

    vectorSource.clear();  // Limpa fontes vetoriais anteriores
    vectorSource.addFeature(new Feature(new Point(coord)));  // Adiciona o novo ponto
}

btnConsult.addEventListener('click', async (event) =>{
    event.preventDefault();
    const coords = await searchCity(mapInput.value);
    document.getElementById('mapInput').value = '';
    if (coords) {
        updateMap(coords)
    }
});

citySelect.addEventListener('change', async (event) =>{
    event.preventDefault();
    if(event.target.value !== "Selecione uma cidade consultada"){
        const coords = await searchCity(event.target.value);
        if (coords) {
            updateMap(coords)
        }
    }
});

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('modalContent').style.display = "none";
};
document.getElementsByClassName('closeDays')[0].onclick = function() {
    document.getElementById('modalDays').style.display = "none";
};
