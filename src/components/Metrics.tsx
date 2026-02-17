import { useEffect, useRef, useState } from "react";
import { FiCpu, FiHardDrive, FiThermometer } from "react-icons/fi";
import { FaMemory } from "react-icons/fa";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

interface MetricsData {
  cpu: { usagePercent: number };
  ram: { totalBytes: number; usedBytes: number; freeBytes: number; usagePercent: number };
  disk: { mount: string; totalBytes: number; usedBytes: number; freeBytes: number; usagePercent: number } | null;
  temperature: { celsius: number | null };
  at: string;
}

interface HistoryEntry {
  time: string;
  cpu: number;
  ram: number;
}

const MAX_HISTORY = 20;

function fmtBytes(n: number | null | undefined): string {
  if (n == null) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0, v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${units[i]}`;
}

export default function Metrics() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyRef = useRef<HistoryEntry[]>([]);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/metrics", { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j: MetricsData = await r.json();
        if (alive) {
          setData(j);
          setErr(null);
          const entry: HistoryEntry = {
            time: new Date(j.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            cpu: j.cpu.usagePercent,
            ram: j.ram.usagePercent,
          };
          const next = [...historyRef.current, entry].slice(-MAX_HISTORY);
          historyRef.current = next;
          setHistory(next);
        }
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : String(e));
      }
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (err)
    return (
      <div className="dashboard">
        <div className="stat-card" style={{ color: "#d73a49" }}>API error: {err}</div>
      </div>
    );

  if (!data)
    return (
      <div className="dashboard">
        <div className="stat-card" style={{ color: "#86868b" }}>Loading…</div>
      </div>
    );

  const { cpu, ram, disk, temperature } = data;

  const diskPieData = disk
    ? [
        { name: "Used", value: disk.usedBytes, color: "#667eea" },
        { name: "Free", value: disk.freeBytes, color: "#e2e8f0" },
      ]
    : [];

  const statsCards = [
    { title: "CPU Usage", value: `${cpu.usagePercent}%`, icon: FiCpu, color: "#667eea" },
    { title: "RAM Usage", value: `${ram.usagePercent}%`, subtitle: `${fmtBytes(ram.usedBytes)} / ${fmtBytes(ram.totalBytes)}`, icon: FaMemory, color: "#48bb78" },
    { title: "Disk Usage", value: disk ? `${disk.usagePercent}%` : "N/A", subtitle: disk ? `${fmtBytes(disk.usedBytes)} / ${fmtBytes(disk.totalBytes)}` : undefined, icon: FiHardDrive, color: "#ed8936" },
    { title: "Temperature", value: temperature.celsius != null ? `${temperature.celsius}°C` : "N/A", icon: FiThermometer, color: "#e53e3e" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Server Metrics</h1>
          <p className="dashboard-subtitle">
            Last updated: {new Date(data.at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="stat-card">
              <h3 className="stat-title">{card.title}</h3>
              <div className="stat-content">
                <div>
                  <p className="stat-value">{card.value}</p>
                  {card.subtitle && (
                    <p style={{ fontSize: 13, color: "#86868b", marginTop: 4 }}>{card.subtitle}</p>
                  )}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  backgroundColor: `${card.color}18`, color: card.color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* CPU History */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">CPU Usage History</h3>
            <p className="chart-subtitle">Last {history.length} readings</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, "CPU"]} />
                <Bar dataKey="cpu" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RAM History */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">RAM Usage History</h3>
            <p className="chart-subtitle">Last {history.length} readings</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, "RAM"]} />
                <Bar dataKey="ram" fill="#48bb78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disk Storage Pie */}
        {disk && (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Storage ({disk.mount})</h3>
              <p className="chart-subtitle">{fmtBytes(disk.totalBytes)} total</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {diskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtBytes(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {diskPieData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: item.color }} />
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{fmtBytes(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}