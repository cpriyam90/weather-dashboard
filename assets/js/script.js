var input = document.getElementById("query")
var searchBtn = document.getElementById("search-btn")
var cityList = []
var cityContainer = document.querySelector(".cityContainer")


//add event listener to search button display weather forecast
searchBtn.addEventListener("click", function(event) {
   event.preventDefault () 
   getLatLon(input.value)
   //this is what you are pushing into the array to pull user's input
   cityList.push(input.value)
   console.log(cityList)
    //create buttons for searched cities
    var cityButton = document.createElement("button")
    cityButton.textContent = input.value
    cityButton.classList.add("btn-primary", "col-8", "btn", "mb-2")
    cityContainer.appendChild(cityButton)
    cityButton.addEventListener("click", function(event){
       event.preventDefault()
       getLatLon(cityButton.textContent) 
    })
    savedCities ()
})


//create function for saving city buttons to localstorage
function savedCities () {
    for(var i =0; i < cityList.length; i++) {
        localStorage.setItem(i,cityList[i])
    }
}

//function to display data from localstorage
function getCities () {
    for(var i = 0; i < localStorage.length; i++) {
       var cityIndex = localStorage.key(i)
       var cities = localStorage.getItem(cityIndex)
       var cityButton = document.createElement("button")
       cityButton.textContent = cities
       cityButton.classList.add("btn-primary", "col-8", "btn", "mb-2")
       cityContainer.appendChild(cityButton)

      
    }
}
getCities ()

//api key from weatherapi
var apiKey = "ce9ddbed2a5483d36efd8e6483c1ffa6"

//get api data for lat/lon 
function getLatLon (city) {
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    var restUrl ="&appid="
    fetch(baseUrl+city+restUrl+apiKey)
        .then(function (response){
            response.json()
            .then(function(data){
                currentWeather(data.coord.lat,data.coord.lon)
                getDaily(data.coord.lat,data.coord.lon)
            })
        })
}

//create a function to display daily weather for city input by user
function currentWeather(lat,lon) {
    var baseUrl ="https://api.openweathermap.org/data/2.5/onecall?"
    var getLat ="lat=" + lat
    var getLon ="&lon=" + lon
    var restUrl ="&exclude=minutely,hourly,daily,alerts&units=imperial&appid="
    fetch(baseUrl+getLat+getLon+restUrl+apiKey)
        .then(function (response){
            response.json()
            .then(function(data){
                console.log(data)
                displayCurrentData (data)
    
                showCurrentDate ()
            })
    }) 

}
//function to display daily date
var showCurrentDate = function() {
    var date = document.getElementById("date")
    var dateString = moment().format("MMM Do YY");
    console.log(dateString)
    date.innerText = dateString;
}

//function to display data from current weather
function displayCurrentData (data) {
    var cityName = document.querySelector(".city");
    cityName.innerText = input.value;
    var currentWeatherIconEl = $("#current-icon");
    currentWeatherIconEl.attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
    var cityTemp = document.querySelector(".city-temp")
    var cityWind = document.querySelector(".city-wind")
    var cityHumidity = document.querySelector(".city-humidity")
    var cityUv = document.querySelector(".city-uv")
    cityTemp.textContent = "Temp: " + data.current.temp + "F"
    cityWind.textContent = "Wind Speed: " + data.current.wind_speed + "MPH"
    cityHumidity.textContent = "Humidity: " + data.current.humidity + "%"
    cityUv.textContent = "UV Index: " + data.current.uvi
    // cityUv.style.color = "Green" 
    if (cityUv < 1) {
        cityUv.style.color = "Green"
    } else {
        cityUv.style.color = "Red"
    }
    input.value = ""
    
}

//function to display weekly forecast
var getDaily = function(lat,lon) {
    var baseUrl ="https://api.openweathermap.org/data/2.5/onecall?"
    var getLat ="lat=" + lat
    var getLon ="&lon=" + lon
    var restUrl ="&exclude=minutely,hourly,alerts&units=imperial&appid="
    fetch(baseUrl+getLat+getLon+restUrl+apiKey)
        .then(function (response){
            response.json()
            .then(function(data){
            console.log(data.daily)
            showForecast(data.daily);
        })
    })
}

//function to fetch weekly forecast
var forecastContainer = document.querySelector('.forecast')
var showForecast = function(data) {
    forecastContainer.innerHTML = " "
    for (var i = 1; i < data.length; ++i){
        const eachDay = document.createElement("div")
        eachDay.classList.add("card-forecast", "col-lg-2", "col-4")

        const date = document.createElement("h4")
        date.classList.add("forecastDate")
        var dateString = moment.unix(data[i].dt).format("MM/DD/YYYY")
        date.textContent = dateString        
    
        //temp forcast
        const temp = document.createElement('div')
        temp.classList.add("forecast-detail", "temp")
        temp.textContent = "Temp: " + data[i].temp.day + "F";
        //wind forcast
        const wind = document.createElement('div')
        wind.classList.add("forecast-detail", 'wind')
        wind.textContent = "Wind: " + data[i].wind_speed + " MPH";
        //humidity forcast
        const humidity = document.createElement('div')
        humidity.classList.add("forecast-detail", "humidity")
        humidity.textContent = "Humidity: " + data[i].humidity + "%";


        //image icon
        const imgUrl = "https://openweathermap.org/img/wn/" + data[i].weather[0].icon + ".png"
        var img = document.createElement("img")
        img.setAttribute("src", imgUrl)


        eachDay.appendChild(date);
        // eachDay.find(".weathericon").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + ".png");
        eachDay.appendChild(img);
        eachDay.appendChild(temp);
        eachDay.appendChild(wind);
        eachDay.appendChild(humidity);
        forecastContainer.appendChild(eachDay);
    }
}

