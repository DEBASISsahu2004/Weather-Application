const WeatherApi = async (city, setLoading, setError) => {
    setLoading(true);
    setError(null);

    const baseurl = "https://api.openweathermap.org/data/2.5/";
    const VITE_OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    const weatherUrl = `${baseurl}weather?q=${city}&appid=${VITE_OPEN_WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `${baseurl}forecast?q=${city}&appid=${VITE_OPEN_WEATHER_API_KEY}&units=metric`;
    
    try {
        const response = await fetch(weatherUrl);
        const forecastResponse = await fetch(forecastUrl);

        if (!response.ok || !forecastResponse.ok) {
            setLoading(false);
            setError('City not found');
            return null;
        }

        const data = await response.json();
        const forecastData = await forecastResponse.json();
        console.log('Weather Data:', data);
        console.log('Forecast Data:', forecastData);
        
        const weatherData = {
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        };

        const forecast = forecastData.list.map(item => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            condition: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        }));

        setLoading(false);
        return { weatherData, forecast };
    } catch (error) {
        console.error('Error while fetching weather data: ', error);
        setLoading(false);
        setError('Failed to fetch weather data');
        return null;
    }
};

export { WeatherApi };
