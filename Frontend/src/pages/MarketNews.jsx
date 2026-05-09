import { useEffect, useState } from "react";
import { CloudRain } from "lucide-react";
import axios from "axios";
import NewsCard from "../components/market/NewsCard";
import TrendCard from "../components/market/TrendCard";
import WeatherAlert from "../components/market/WeatherAlert";

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await axios.get("/data/market-news.json");
        setNews(response.data.news);
        setTrends(response.data.trends);
        setAlerts(response.data.alerts);
      } catch (error) {
        console.error("Unable to load market news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white border border-gray-200 p-8 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-green-800">Market awareness</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Crop market intelligence for modern collectives.
            </h1>
            <p className="text-gray-600 max-w-2xl text-base sm:text-lg">
              A clean marketplace pulse for farmers, combining crop price movement, demand momentum, and weather alerts in one operating view.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 border border-gray-200 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Demand momentum</p>
              <p className="mt-3 text-3xl font-bold text-gray-900">+18%</p>
              <p className="mt-2 text-sm text-gray-600">Regional uplift across wheat and pulses.</p>
            </div>
            <div className="rounded-3xl bg-gray-50 border border-gray-200 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Irrigation insights</p>
              <p className="mt-3 text-3xl font-bold text-gray-900">Green zone</p>
              <p className="mt-2 text-sm text-gray-600">Soil moisture and water access remain stable.</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid place-items-center p-14 rounded-[32px] bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-600">Fetching market updates...</p>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {trends.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[32px] bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-green-50 text-green-700 shadow-sm">
                  <CloudRain size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Alerts</p>
                  <h2 className="text-xl font-semibold text-gray-900">Weather watch</h2>
                </div>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <WeatherAlert key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-gray-50 border border-gray-200 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Quick glance</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Weekly price</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">₹26.8/kg</p>
                </div>
                <div className="rounded-3xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Market demand</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">High</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default MarketNews;
