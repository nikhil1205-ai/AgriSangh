import { useState, useEffect } from "react";
import { Search, Filter, Loader2, Package, Users, Leaf, AlertCircle } from "lucide-react";
import BatchCard from "../components/buy/BatchCard";
import BatchDetailsModal from "../components/buy/BatchDetailsModal";
import { getAvailableBatches, expressBuyerInterest } from "../services/dashboardService";

const CROP_FILTERS = ["All", "Wheat", "Rice", "Cotton", "Corn", "Soybean", "Pulses"];
const SEASON_FILTERS = ["All", "Kharif", "Rabi", "Zaid"];

const BuyPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cropFilter, setCropFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await getAvailableBatches();
      setBatches(data || []);
    } catch (err) {
      setError("Failed to load available batches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (batchId, formData) => {
    try {
      await expressBuyerInterest(batchId, formData);
      // Refresh batches to show updated buyer count
      await loadBatches();
      return true;
    } catch (err) {
      console.error("Failed to express interest:", err);
      throw err;
    }
  };

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      searchQuery === "" ||
      (batch.batchId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.cropType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.group?.groupName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.group?.groupId || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = cropFilter === "All" || (batch.cropType || "").toLowerCase() === cropFilter.toLowerCase();
    const matchesSeason = seasonFilter === "All" || (batch.season || "").toLowerCase() === seasonFilter.toLowerCase();

    return matchesSearch && matchesCrop && matchesSeason;
  });

  // Stats
  const stats = {
    total: batches.length,
    active: batches.filter((b) => b.statusTimeline?.some((s) => s.progressStatus === "pending")).length,
    harvestReady: batches.filter((b) => b.status === "harvested").length,
    totalProduction: batches.reduce((acc, b) => acc + (b.estimatedProduction || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Available Production Batches</h1>
              <p className="text-green-100">Verified Collaborative Agricultural Batches</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-green-100 text-sm">Total Batches</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-green-100 text-sm">Active Growing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-bold">{stats.harvestReady}</p>
              <p className="text-green-100 text-sm">Harvest Ready</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-bold">{stats.totalProduction}</p>
              <p className="text-green-100 text-sm">Total Tons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Batch ID, Crop, or Group Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {CROP_FILTERS.map((crop) => (
                  <option key={crop} value={crop}>{crop === "All" ? "All Crops" : crop}</option>
                ))}
              </select>
              <select
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {SEASON_FILTERS.map((season) => (
                  <option key={season} value={season}>{season === "All" ? "All Seasons" : season}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-green-600 animate-spin" />
            <span className="ml-3 text-slate-600">Loading available batches...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <AlertCircle size={40} className="text-red-500" />
            <span className="ml-3 text-red-600">{error}</span>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No batches found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCropFilter("All");
                setSeasonFilter("All");
              }}
              className="mt-4 text-green-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Showing {filteredBatches.length} of {batches.length} batches
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBatches.map((batch) => (
                <BatchCard
                  key={batch._id || batch.batchId}
                  batch={batch}
                  onClick={() => setSelectedBatch(batch)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <BatchDetailsModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onExpressInterest={handleExpressInterest}
        />
      )}
    </div>
  );
};

export default BuyPage;