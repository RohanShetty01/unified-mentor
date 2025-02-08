const apiKey = "5accf7a4171ee50fcb9fc0921038eca8";

const icons = {
  cloudy: {
    src: "./Images/cloudy.png",
  },
  rainy: {
    src: "./Images/rainy.png",
  },
  snowfall: {
    src: "./Images/snowfall.png",
  },
  foggy: {
    src: "./Images/foggy-day.png",
  },
  thunder: {
    src: "./Images/thunderstrom.png",
  },
  sunny: {
    src: "./Images/sunny.png",
  },
};

function convertUnixToTime(unixTimestamp, timezoneOffsetInSeconds) {
  const date = new Date((unixTimestamp + timezoneOffsetInSeconds) * 1000);
  let hours = date.getUTCHours();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${ampm}`;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const handleLocation = debounce(async function (event) {
  const query = event.target.value.trim();
  if (query.length < 3) {
    clearSuggestions();
    return;
  }

  const suggestions = await fetchLocationSuggestions(query);
  displaySuggestions(suggestions);
}, 1000);

async function fetchLocationSuggestions(query) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  );
  const data = await response.json();
  return data;
}

function showLoading() {
  const loader = document.querySelector(".loading-container");
  loader.style.display = "flex";
  document.body.style.overflow = "hidden"
}

function hideLoading() {
  const loader = document.querySelector(".loading-container");
  loader.style.display = "none";
  document.body.style.overflow = ""
}

async function fetchWeatherDetails(selectedSuggestion) {
  document.getElementById("current-location").innerText =
    selectedSuggestion.innerText;
  clearSuggestions();
  showLoading();
  try {
    const response = await fetch(
      `https://pro.openweathermap.org/data/2.5/weather?lat=${selectedSuggestion.dataset.lat}&lon=${selectedSuggestion.dataset.lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
  
    if (response) {
      const airPollution = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${selectedSuggestion.dataset.lat}&lon=${selectedSuggestion.dataset.lon}&appid=${apiKey}`
      );
      const aqi = await airPollution.json();
      data.aqi = aqi;
    }
    if (data) {
      const aqiValue = data?.aqi?.list[0]?.main?.aqi;
      document.getElementById("weather-text").innerText =
        (data?.weather[0]?.main).toUpperCase();
      document.getElementById("weather-description").innerText =
        (data?.weather[0]?.description).toUpperCase();
      document.getElementById("main-temp").innerText = data?.main?.temp;
      document.getElementById("temp-high").innerText = data?.main?.temp_max;
      document.getElementById("temp-low").innerText = data?.main?.temp_min;
      document.getElementById("real-feel").innerText = data?.main?.feels_like;
      document.getElementById("real-feel-info").innerText =
        data?.main?.feels_like <= 15
          ? "COLD"
          : data?.main?.feels_like >= 16 && data?.main?.feels_like <= 30
          ? "MODERATE/WARM"
          : "HOT";
      document.getElementById("humidity").innerText = data?.main?.humidity + " %";
      document.getElementById("wind-speed").innerText = data?.wind?.speed;
      document.getElementById("aqi").innerText = data?.aqi?.list[0]?.main?.aqi;
      document.getElementById("aqi-info").innerText =
        data?.aqi?.list[0]?.main?.aqi === 1
          ? "GOOD"
          : data?.aqi?.list[0]?.main?.aqi === 2
          ? "FAIR"
          : data?.aqi?.list[0]?.main?.aqi === 3
          ? "MODERATE"
          : data?.aqi?.list[0]?.main?.aqi === 4
          ? "POOR"
          : "VERY POOR";
  
          if(aqiValue >= 4) {
            document.querySelector('.extra-info').style.backgroundColor = "red"
            document.querySelector('.extra-info').style.color = "white"
          }
          else {
            document.querySelector('.extra-info').style.backgroundColor = ""
            document.querySelector('.extra-info').style.color = ""
          }
      document.getElementById("sunrise-time").innerText = convertUnixToTime(
        data?.sys?.sunrise,
        data?.timezone
      );
      document.getElementById("sunset-time").innerText = convertUnixToTime(
        data?.sys?.sunset,
        data?.timezone
      );
      if (data.weather[0]?.id >= 801 && data.weather[0]?.id <= 804)
        document.getElementById("weather-icon").src = icons.cloudy.src;
      else if (data.weather[0]?.id >= 200 && data.weather[0]?.id <= 232)
        document.getElementById("weather-icon").src = icons.thunder.src;
      else if (data.weather[0]?.id >= 300 && data.weather[0]?.id <= 531)
        document.getElementById("weather-icon").src = icons.rainy.src;
      else if (data.weather[0]?.id >= 600 && data.weather[0]?.id <= 622)
        document.getElementById("weather-icon").src = icons.rainy.src;
      else if (data.weather[0]?.id >= 701 && data.weather[0]?.id <= 781)
        document.getElementById("weather-icon").src = icons.foggy.src;
    }
  }
  catch(err) {
    console.log(err)
  }
  finally {
    hideLoading();
  }
  
}

function displaySuggestions(suggestions) {
  const suggestionsBox = document.getElementById("suggestionsBox");
  suggestionsBox.innerHTML = "";
  if (suggestions.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  const suggestionItem = document.createElement("div");
  suggestionItem.className = "suggestion-item";
  suggestionItem.innerHTML = `${
    suggestions[0].local_names?.en ??
    suggestions[0].local_names?.kn ??
    suggestions[0].local_names?.hi ??
    "Unknown"
  }, <span>${suggestions[0].country ?? "Country Unknown"}</span>`;
  suggestionItem.dataset.lat = suggestions[0].lat;
  suggestionItem.dataset.lon = suggestions[0].lon;

  suggestionItem.onclick = () => fetchWeatherDetails(suggestionItem);

  suggestionsBox.appendChild(suggestionItem);

  suggestionsBox.style.display = "block";
}

function clearSuggestions() {
  const suggestionsBox = document.getElementById("suggestionsBox");
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "none";
}
