const inputCity = document.querySelector('#city');
const inputDate = document.querySelector('#date');
const inputToday = document.querySelector('#today');
const inputMaxima = document.querySelector('#max');
const inputMinima = document.querySelector('#min');
const inputRain = document.querySelector('#rain');
const imageTemp = document.querySelector('#temp');
const imageMoon = document.querySelector('#moonPhase');

// Função para adicionar uma cidade ao localStorage
function addCityToLocal(city) {
    const cities = JSON.parse(localStorage.getItem('consultCities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('consultCities', JSON.stringify(cities));
    }

    // função para gerar um option no select com a cidade
    citySelect.innerHTML = '<option>Selecione uma cidade consultada</option>'; // Limpa e adiciona a opção padrão
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// função que faz uma requisição na api https://openweathermap.org/api/geocoding-api. e retorna com as coordenadas e manda para a função getWeather
export async function searchCity(mapInputValue){
    console.log(mapInputValue)
    if(mapInputValue.length === 0){
        alert('Insira o nome da cidade');
        return;
    };
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${mapInputValue}&APPID=f38547952deb9c14ab65504cba9abcd0`;
    try {
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error('Não foi possível localizar as informações da cidade!');
        };
        const data = await response.json();
        addCityToLocal(mapInputValue)
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        getWeather(lat,lon);
        return {lon, lat};
    } catch (error) {
        alert('Erro:' + error.message);
    }
}

// função que recebe as coordenadas e faz a requisição na api https://hgbrasil.com/status/weather, mandando a latitude e longitude e recebendo o json dos tempos
async function getWeather(lat, lon){
    
    if((lat || lon) === 0){
        alert('Valor de latitude e longitude errado');
        return;
    }
    const apiUrl = `https://api.hgbrasil.com/weather?format=json-cors&key=01a2b67f&lat=${lat}&lon=${lon}&user_ip=remote`;
    try {
        const response  = await fetch(apiUrl);
        if(!response.ok){
            throw new Error('Não foi possível localizar as informações da cidade!');
        };
        const data = await response.json();

        // Inserindo os dados do json nos campos de imput dos dados para amostragem
        document.getElementById('modalContent').style.display = "block";
        inputCity.value = data.results.city_name;
        inputDate.value = data.results.date;
        inputToday.value = data.results.forecast[0].description;
        inputMaxima.value = data.results.forecast[0].max;
        inputMinima.value = data.results.forecast[0].min;
        imageTemp.src = `https://assets.hgbrasil.com/weather/icons/conditions/${data.results.forecast[0].condition}.svg`;
        inputRain.value = data.results.forecast[0].rain_probability;
        imageMoon.src = `https://assets.hgbrasil.com/weather/icons/moon/${data.results.moon_phase}.png`;

        document.getElementById('btnTempDays').onclick = function(){
            document.getElementById('modalContent').style.display = "none";
            document.getElementById('modalDays').style.display = "block";

            for (let i = 1; i <= 4; i++) {
                document.getElementById(`date${i}`).value = data.results.forecast[i].date;
                document.getElementById(`max${i}`).value = data.results.forecast[i].max;
                document.getElementById(`min${i}`).value = data.results.forecast[i].min;
                document.getElementById(`temp${i}`).src = `https://assets.hgbrasil.com/weather/icons/conditions/${data.results.forecast[i].condition}.svg`;
                document.getElementById(`rain${i}`).value = data.results.forecast[i].rain_probability;
            }
        }

        return
    } catch (error) {
        alert('Erro:' + error.message);
    }
}   

