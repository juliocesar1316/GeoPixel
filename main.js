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

// Função para executar o mapa
useGeographic();

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
    source: vectorSource,
});

// Imagem do mapa e setado primeiramente com as coordenadas 0,0
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

// Função que faz o update do mapa apos as requisiçoes na api 
function updateMap(coords){
    const coord = [coords.lon, coords.lat];  // Converte as coordenadas para o sistema de projeção do OpenLayers
    map.getView().setCenter(coord);
    map.getView().setZoom(10);

    vectorSource.clear();  // Limpa fontes vetoriais anteriores
    vectorSource.addFeature(new Feature(new Point(coord)));  // Adiciona o novo ponto
}

// Evento do botao de consulta onde ele espera para receber as coordenadas da função searchCity que faz uma requisição na api de https://openweathermap.org/api/geocoding-api.
btnConsult.addEventListener('click', async (event) =>{
    event.preventDefault();
    const coords = await searchCity(mapInput.value);
    document.getElementById('mapInput').value = '';
    if (coords) {
        updateMap(coords)
    }
});

// Evento do select onde ele pega o item selecionado e manda para a requisição https://openweathermap.org/api/geocoding-api.
citySelect.addEventListener('change', async (event) =>{
    event.preventDefault();
    if(event.target.value !== "Selecione uma cidade consultada"){
        const coords = await searchCity(event.target.value);
        if (coords) {
            updateMap(coords)
        }
    }
});

// Os dois itens tem a função de fechar os modal ao clickar no x
document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('modalContent').style.display = "none";
};
document.getElementsByClassName('closeDays')[0].onclick = function() {
    document.getElementById('modalDays').style.display = "none";
};
