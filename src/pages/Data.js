import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Zap,
  Plus,
  Edit3,
  //   Trash2,
  Eye,
  Download,
  //   Upload,
} from "lucide-react";

const DataVisualizationApp = () => {
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      title: "World War II Major Events",
      description: "Timeline of significant WWII events and their impact",
      type: "historical",
      chartType: "timeline",
      data: [
        { year: 1939, event: "War Begins", casualties: 0, countries: 2 },
        {
          year: 1940,
          event: "Battle of Britain",
          casualties: 544,
          countries: 5,
        },
        { year: 1941, event: "Pearl Harbor", casualties: 2400, countries: 12 },
        { year: 1942, event: "Stalingrad", casualties: 850000, countries: 15 },
        {
          year: 1943,
          event: "Italy Surrenders",
          casualties: 200000,
          countries: 18,
        },
        { year: 1944, event: "D-Day", casualties: 425000, countries: 25 },
        { year: 1945, event: "War Ends", casualties: 1200000, countries: 30 },
      ],
    },
    {
      id: 2,
      title: "Renaissance Art Masters",
      description: "Major works and influence of Renaissance artists",
      type: "cultural",
      chartType: "scatter",
      data: [
        { year: 1503, artist: "Leonardo", works: 15, influence: 95 },
        { year: 1512, artist: "Michelangelo", works: 23, influence: 92 },
        { year: 1520, artist: "Raphael", works: 18, influence: 88 },
        { year: 1556, artist: "Titian", works: 45, influence: 75 },
        { year: 1594, artist: "Tintoretto", works: 38, influence: 72 },
      ],
    },
    {
      id: 3,
      title: "Fictional: Middle-earth Timeline",
      description: "Major events in Tolkien's Middle-earth",
      type: "fictional",
      chartType: "area",
      data: [
        { age: "First Age", year: 0, events: 12, importance: 85 },
        { age: "Second Age", year: 3441, events: 8, importance: 70 },
        { age: "Third Age", year: 3019, events: 25, importance: 95 },
        { age: "Fourth Age", year: 120, events: 5, importance: 60 },
      ],
    },
  ]);

  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);
  //   const [viewMode, setViewMode] = useState("visualization");
  const [isEditing, setIsEditing] = useState(false);
  const [newDataset, setNewDataset] = useState({
    title: "",
    description: "",
    type: "historical",
    chartType: "timeline",
    data: [],
  });

  const chartTypes = [
    { value: "timeline", label: "Timeline", icon: Calendar },
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "line", label: "Line Chart", icon: TrendingUp },
    { value: "scatter", label: "Scatter Plot", icon: Zap },
    { value: "area", label: "Area Chart", icon: TrendingUp },
  ];

  const renderChart = (dataset) => {
    const { chartType, data } = dataset;

    switch (chartType) {
      case "timeline":
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              {data[0]?.casualties !== undefined && (
                <Line
                  type="monotone"
                  dataKey="casualties"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Casualties"
                />
              )}
              {data[0]?.countries !== undefined && (
                <Line
                  type="monotone"
                  dataKey="countries"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Countries Involved"
                />
              )}
              {data[0]?.influence !== undefined && (
                <Line
                  type="monotone"
                  dataKey="influence"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Influence Score"
                />
              )}
              {data[0]?.importance !== undefined && (
                <Line
                  type="monotone"
                  dataKey="importance"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Importance"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              {data[0]?.casualties !== undefined && (
                <Bar dataKey="casualties" fill="#EF4444" name="Casualties" />
              )}
              {data[0]?.events !== undefined && (
                <Bar dataKey="events" fill="#3B82F6" name="Events" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis dataKey="influence" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Scatter dataKey="influence" fill="#8B5CF6" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Area
                type="monotone"
                dataKey="importance"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  const addNewDataset = () => {
    if (newDataset.title && newDataset.description) {
      const dataset = {
        ...newDataset,
        id: Date.now(),
        data:
          newDataset.data.length > 0
            ? newDataset.data
            : [{ year: 2024, value: 100, category: "Sample Data" }],
      };
      setDatasets([...datasets, dataset]);
      setNewDataset({
        title: "",
        description: "",
        type: "historical",
        chartType: "timeline",
        data: [],
      });
      setIsEditing(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "historical":
        return "bg-blue-500";
      case "cultural":
        return "bg-purple-500";
      case "fictional":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            Historical Data Visualization
          </h1>
          <p className="text-gray-300 mt-2">
            Explore and analyze historical events, cultural movements, and
            fictional timelines
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Datasets</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    onClick={() => setSelectedDataset(dataset)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border ${
                      selectedDataset.id === dataset.id
                        ? "bg-gray-700 border-blue-500"
                        : "bg-gray-750 border-gray-600 hover:bg-gray-700"
                    }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getTypeColor(
                          dataset.type
                        )}`}></div>
                      <span className="font-medium text-sm">
                        {dataset.title}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {dataset.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 capitalize">
                        {dataset.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {dataset.chartType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {!isEditing ? (
              <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                {/* Dataset Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedDataset.title}
                      </h2>
                      <p className="text-gray-400 mt-1">
                        {selectedDataset.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            selectedDataset.type
                          )} text-white`}>
                          {selectedDataset.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedDataset.data.length} data points
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Eye size={20} />
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Download size={20} />
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Edit3 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="p-6">{renderChart(selectedDataset)}</div>

                {/* Analysis Section */}
                <div className="p-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">
                    Analysis & Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Data Points:</span>
                          <span>{selectedDataset.data.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Span:</span>
                          <span>
                            {selectedDataset.data[0]?.year ||
                              selectedDataset.data[0]?.age}{" "}
                            -
                            {selectedDataset.data[
                              selectedDataset.data.length - 1
                            ]?.year ||
                              selectedDataset.data[
                                selectedDataset.data.length - 1
                              ]?.age}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Chart Type:</span>
                          <span className="capitalize">
                            {selectedDataset.chartType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Contextual Notes</h4>
                      <p className="text-sm text-gray-300">
                        {selectedDataset.type === "historical" &&
                          "This dataset represents real historical events and their documented impact on society."}
                        {selectedDataset.type === "cultural" &&
                          "Cultural movements and artistic achievements that shaped human civilization."}
                        {selectedDataset.type === "fictional" &&
                          "Events from fictional worlds that demonstrate narrative structure and world-building."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Add New Dataset Form */
              <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
                <h2 className="text-2xl font-bold mb-6">Create New Dataset</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newDataset.title}
                      onChange={(e) =>
                        setNewDataset({ ...newDataset, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter dataset title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={newDataset.description}
                      onChange={(e) =>
                        setNewDataset({
                          ...newDataset,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Describe your dataset"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Type
                      </label>
                      <select
                        value={newDataset.type}
                        onChange={(e) =>
                          setNewDataset({ ...newDataset, type: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="historical">Historical</option>
                        <option value="cultural">Cultural</option>
                        <option value="fictional">Fictional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chart Type
                      </label>
                      <select
                        value={newDataset.chartType}
                        onChange={(e) =>
                          setNewDataset({
                            ...newDataset,
                            chartType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {chartTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={addNewDataset}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Create Dataset
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationApp;
