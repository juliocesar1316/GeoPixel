import './style.css';
import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import { searchCity, getWeather } from './script';

const mapInput = document.querySelector('#mapInput');
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

btnConsult.addEventListener('click', async (event) =>{
    event.preventDefault();
    const coords = await searchCity(mapInput.value);
    if (coords) {
        const coord = [coords.lon, coords.lat];  // Converte as coordenadas para o sistema de projeção do OpenLayers
        map.getView().setCenter(coord);
        map.getView().setZoom(10);

        vectorSource.clear();  // Limpa fontes vetoriais anteriores
        vectorSource.addFeature(new Feature(new Point(coord)));  // Adiciona o novo ponto
    }
});
