let time_id = 0;
let form = document.getElementById('get-info-form');

const fetchWeatherInfo = async (city) => {
  const API_KEY = 'bf7f97a77c75b169f9ceb8267edbc2db';
  const URL = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`;
  console.log(URL);
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  console.log(data);
  if (data.success === false) {
    alert(data.error.info);
    console.log(data.error.info);
    return;
  } else {
    clearInterval(time_id);
    time_id = setInterval(() => {
      updateTime(data.location.timezone_id);
    }, 1000);
    updateUI(data.current, data.location, data.request);
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

const updateUI = (current, location, request) => {
  let cardTitle = document.getElementsByClassName('card-title');
  let weather_icon = document.getElementsByClassName('weather-icon');
  let weather_type = document.getElementsByClassName('weather-type');
  let temperature = document.getElementsByClassName('temperature');

  let last_updated = document.getElementsByClassName('last-updated');
  let uv_index = document.getElementsByClassName('uv-index');
  let pressure = document.getElementsByClassName('pressure');
  let visibility = document.getElementsByClassName('visibility');
  let wind_speed = document.getElementsByClassName('wind-speed');
  let wind_direction = document.getElementsByClassName('wind-direction');
  let wind_degree = document.getElementsByClassName('wind-degree');
  let humidity = document.getElementsByClassName('humidity');

  const [iconClass, weatherDescription] = weatherDescriptionToClass(
    current.weather_descriptions[0]
  );

  cardTitle[0].innerHTML = `${location.name}, ${location.region}, ${location.country}`;
  weather_icon[0].src = `https://weatherstack.com/site_images/weather_icon_${iconClass}.svg`;
  weather_type[0].innerHTML = weatherDescription;
  temperature[0].innerHTML = `${current.temperature}&deg;C`;

  last_updated[0].innerHTML = `Last Updated: ${current.observation_time}`;
  uv_index[0].innerHTML = `UV Index: ${current.uv_index}`;
  pressure[0].innerHTML = `Pressure: ${current.pressure}`;
  visibility[0].innerHTML = `Visibility: ${current.visibility}`;
  wind_speed[0].innerHTML = `Wind Speed: ${current.wind_speed} kmph`;
  wind_direction[0].innerHTML = `Wind Direction: ${current.wind_dir}`;
  wind_degree[0].innerHTML = `Wind Degree: ${current.wind_degree}`;
  humidity[0].innerHTML = `Humidity: ${current.humidity}`;

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
  let time_element = document.getElementsByClassName('time');
  time_element[0].innerHTML = time;
};

form.addEventListener('submit', handleFormSubmit);
