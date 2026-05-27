const apiKey = "bd5e378503939ddaee76f12ad7a97608";

const cityInput = document.getElementById("city");
const forecastDiv = document.getElementById("forecast");

async function getWeather(){

    const city = cityInput.value;

    if(city === ""){
        alert("Please enter city name");
        return;
    }

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    if(data.cod == "404"){
        alert("City not found");
        return;
    }

    updateWeather(data);

    getForecast(city);

    getAQI(data.coord.lat,data.coord.lon);
}

function updateWeather(data){

    document.getElementById("temp").innerHTML =
    Math.round(data.main.temp) + "°C";

    document.getElementById("city-name").innerHTML =
    data.name;

    document.getElementById("humidity").innerHTML =
    data.main.humidity + "%";

    document.getElementById("wind").innerHTML =
    data.wind.speed + " km/h";

    document.getElementById("weather-type").innerHTML =
    data.weather[0].main;

    const icon = data.weather[0].icon;

    document.getElementById("weather-icon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

async function getForecast(city){

    forecastDiv.innerHTML = "Loading forecast...";

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    forecastDiv.innerHTML = "";

    data.list.slice(0,8).forEach(item=>{

        forecastDiv.innerHTML += `

        <div class="card">
            <h3>${item.dt_txt.slice(11,16)}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
            <p>${Math.round(item.main.temp)}°C</p>
        </div>

        `;

    });

}

async function getAQI(lat,lon){

    const url =
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(url);

    const data = await response.json();

    const aqi = data.list[0].main.aqi;

    const statusMap = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    };

    document.getElementById("aqi").innerHTML =
    `${aqi} - ${statusMap[aqi]}`;
}

function getLocationWeather(){

    if(!navigator.geolocation){
        alert("Geolocation is not supported in your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);

            const data = await response.json();

            updateWeather(data);

            getForecast(data.name);

            getAQI(lat,lon);

        },

        ()=>{
            alert("Please allow location access");
        }

    );
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if(recognition){
    recognition.onresult = function(event){

        const city = event.results[0][0].transcript;

        cityInput.value = city;

        getWeather();

    }
}

function startVoice(){

    if(!recognition){
        alert("Voice recognition not supported in this browser");
        return;
    }

    recognition.start();
}

cityInput.addEventListener("keypress",function(event){

    if(event.key === "Enter"){
        getWeather();
    }

});

const themeBtn =
document.getElementById("theme-btn");

themeBtn.onclick = ()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️";
    }
    else{
        themeBtn.innerHTML = "🌙";
    }

}
