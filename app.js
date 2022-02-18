let template = Handlebars.templates.weather_cards;
let timeId = 0;
let form = document.getElementById('get-info-form');

const fetchWeatherInfo = async (city) => {
  const API_KEY = '8c853592195e48dea7842707221702';
  const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  console.log(data);
  if (data.error) {
    alert(data.error.message);
    console.log(data.error);
    return;
  } else {
    clearInterval(timeId);
    timeId = setInterval(() => {
      updateTime(data.location.tz_id);
    }, 1000);
    updateUI(data.current, data.location);
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const city = document.querySelector('#city').value;
  if (city.trim() === '') {
    alert('Please enter a city name');
    return;
  }
  fetchWeatherInfo(city);
};

const updateUI = (current, location) => {
  const [iconClass, weatherDescription] = weatherDescriptionToClass(
    current.condition.text
  );

  document.getElementById('weather-cards').innerHTML = template({
    location: location.name,
    region: location.region,
    country: location.country,
    icon: iconClass,
    weather: weatherDescription,
    temperature: current.temp_c,
    lastUpdated: current.last_updated,
    uvIndex: current.uv,
    pressure: current.pressure_mb,
    visibility: current.vis_km,
    windSpeed: current.wind_kph,
    windDirection: current.wind_dir,
    windDegree: current.wind_degree,
    humidity: current.humidity,
  });

  document.querySelector('.weather-card').classList.remove('d-none');
  form.reset();
};

const weatherDescriptionToClass = (description) => {
  let iconClass = 'full_clouds';
  let weatherDescription = description;

  switch (description) {
    case 'Partly Cloudy':
      iconClass = 'partly_cloudy';
      break;
    case 'Haze':
    case 'Overcast':
      iconClass = 'full_clouds';
      break;
    case 'Clear':
      iconClass = 'night';
      break;
    case 'Patchy Light Drizzle':
      iconClass = 'sun_rain_clouds';
      weatherDescription = 'Light Drizzle';
      break;
    case 'Sunny':
      iconClass = 'full_sun';
      break;
    case 'Patchy Rain Possible':
      iconClass = 'cloud_slight_rain';
      weatherDescription = 'Patchy Rain';
      break;
    case 'Light Rain':
    case 'Light Rain, Mist':
      iconClass = 'cloud_slight_rain';
      break;
    case 'Moderate Or Heavy Rain Shower':
      iconClass = 'rainy';
      weatherDescription = 'Heavy Rain';
      break;
    case 'Thunder':
      iconClass = 'thunder';
      break;
    default:
      iconClass = 'full_clouds';
      break;
  }
  return [iconClass, weatherDescription];
};

const updateTime = (timezone) => {
  let date = new Date();
  let time = date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: true,
  });
  let timeElement = document.getElementsByClassName('time');
  timeElement[0].innerHTML = time;
};

form.addEventListener('submit', handleFormSubmit);
