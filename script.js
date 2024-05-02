// const mapInput = document.querySelector('#mapInput');
// const btnConsult = document.querySelector('#btnConsult');
// const resp = document.querySelector('#resp');

// btnConsult.addEventListener('click', searchCity );

export async function searchCity(mapInputValue){
    if(mapInput.value.length === 0){
        alert('Insira o nome da cidade');
        return;
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${mapInput.value}&APPID=f38547952deb9c14ab65504cba9abcd0`
    try {
        const response = await fetch(apiUrl)
        if(!response.ok){
            throw new Error('Não foi possível localizar as informações da cidade!');
        }
        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        getWeather(lat,lon);
        return {lon, lat}
    } catch (error) {
        alert('Erro:' + error.message);
    }
}

export async function getWeather(lat, lon){
    
    if((lat || lon) === 0){
        alert('Valor de latitude e longitude errado');
        return;
    }
    const apiUrl = `https://api.hgbrasil.com/weather?format=json-cors&key=01a2b67f&lat=${lat}&lon=${lon}&user_ip=remote`
    try {
        const response  = await fetch(apiUrl)
        if(!response.ok){
            throw new Error('Não foi possível localizar as informações da cidade!');
        }
        const data = await response.json();
        console.log(data)
        return
    } catch (error) {
        alert('Erro:' + error.message);
    }
}   