import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import styles from './weatherPage.module.css';
import { WeatherApi } from '../api/WeatherApi';

const WeatherPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchWeatherData = async (city) => {
        const formButton = document.querySelector('button[type="submit"]');
        formButton.disabled = true;
        formButton.style.cursor = 'not-allowed';
        setWeatherData(null);
        setWeatherForecast([]);

        const data = await WeatherApi(city, setLoading, setError);
        formButton.disabled = false;
        formButton.style.cursor = 'pointer';

        if (data) {
            setWeatherData(data.weatherData);
            setWeatherForecast(data.forecast);
            setSearchHistory(prev => [data.weatherData.city, ...prev.filter(c => c !== data.weatherData.city)].slice(0, 5));
        }
    };

    const handleWeatherSearch = async (e) => {
        e.preventDefault();
        const city = e.target.elements[0].value;
        await fetchWeatherData(city);
    };

    const handleHistoryClick = async (event) => {
        const city = event.target.innerText;
        await fetchWeatherData(city);
    };

    const handleRefresh = async () => {
        if (weatherData) {
            const city = weatherData.city;
            await fetchWeatherData(city);
        }
    };

    const handleNextDay = () => {
        if ((currentIndex + 1) * 8 < weatherForecast.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevDay = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className={styles.weatherPageContainer}>
            <form className={styles.weatherSearchForm} onSubmit={handleWeatherSearch}>
                <input type="text" placeholder="Enter City" />
                <button type="submit">Search</button>
            </form>

            <div className={styles.searchHistory}>
                <h3>Recent Searches</h3>
                <ul>
                    {searchHistory.map((city, index) => (
                        <li key={index} onClick={handleHistoryClick} >{city}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.weatherInfo}>
                {loading && <p className={styles.loading}>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {weatherData ? (
                    <div className={`${styles.weathercard} ${document.documentElement.style.getPropertyValue('--bg') === '#0f0f0f' ? styles.dark : styles.light}`}>
                        <div className={styles.row1}>
                            <h1>{weatherData.city}</h1>
                            <button onClick={handleRefresh}><RefreshCcw /></button>
                        </div>

                        <div className={styles.row2}>
                            <img src={weatherData.icon} alt={weatherData.condition} />
                            <div>
                                <p className={styles.temp}> {Math.round(weatherData.temperature)}°C</p>
                                <p className={styles.condition}>{weatherData.condition}</p>
                            </div>
                        </div>

                        <div className={styles.row3}>
                            <p>Humidity: {weatherData.humidity}%</p>
                            <p>Wind: {weatherData.windSpeed} m/s</p>
                        </div>
                    </div>
                ) : (
                    !loading && <p className={styles.message}>Please enter a valid city to get weather information.</p>
                )}
            </div>

            {weatherForecast.length > 0 && (
                <div className={styles.forecastContainer}>
                    <h3 className={styles.forecastTitle}>5-Day Forecast</h3>

                    <div className={styles.forecastCards}>
                        {weatherForecast
                            .slice(currentIndex * 8, (currentIndex + 1) * 8)
                            .map((item, index) => (
                                <div key={index} className={styles.forecastCard}>
                                    <p>{new Date(item.date).toLocaleDateString()}</p>
                                    <img src={item.icon} alt={item.condition} />
                                    <p>{Math.round(item.temperature)}°C</p>
                                    <p>{item.condition}</p>
                                </div>
                            ))}
                    </div>

                    <div className={styles.paginationButtons}>
                        <button
                            onClick={handlePrevDay}
                            disabled={currentIndex === 0}
                            style={{ cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            Prev
                        </button>
                        <button
                            onClick={handleNextDay}
                            disabled={(currentIndex + 1) * 8 >= weatherForecast.length}
                            style={{
                                cursor: (currentIndex + 1) * 8 >= weatherForecast.length ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherPage;