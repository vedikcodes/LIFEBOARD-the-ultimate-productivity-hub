import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Mock weather data for now
const weatherData = {
  city: "New Delhi",
  temperature: 28,
  condition: "Sunny",
  humidity: 65,
  wind: 12
};

export default function Weather() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherIcon, setWeatherIcon] = useState(<Sun className="h-10 w-10 text-yellow-500" />);

  useEffect(() => {
    // Update the time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Set weather icon based on condition and time of day
    const hours = currentTime.getHours();
    const isNight = hours < 6 || hours > 18;

    switch (weatherData.condition.toLowerCase()) {
      case 'cloudy':
        setWeatherIcon(<Cloud className="h-10 w-10 text-gray-400" />);
        break;
      case 'rainy':
        setWeatherIcon(<CloudRain className="h-10 w-10 text-blue-400" />);
        break;
      case 'sunny':
      case 'clear':
        if (isNight) {
          setWeatherIcon(<Moon className="h-10 w-10 text-gray-300" />);
        } else {
          setWeatherIcon(<Sun className="h-10 w-10 text-yellow-500" />);
        }
        break;
      default:
        setWeatherIcon(<Sun className="h-10 w-10 text-yellow-500" />);
    }
  }, [currentTime]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Weather</CardTitle>
        <CardDescription>{weatherData.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
            <p className="text-muted-foreground">{weatherData.condition}</p>
          </div>
          {weatherIcon}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Humidity: {weatherData.humidity}%</div>
          <div>Wind: {weatherData.wind} km/h</div>
        </div>
      </CardContent>
    </Card>
  );
}
