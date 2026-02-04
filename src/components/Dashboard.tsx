import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total customers',
      value: '2,120',
      change: '+20%',
      trending: 'up',
      color: '#667eea'
    },
    {
      title: 'Members',
      value: '1,220',
      change: '+15%',
      trending: 'up',
      color: '#48bb78'
    },
    {
      title: 'Active now',
      value: '316',
      change: '-8%',
      trending: 'down',
      color: '#ed8936'
    }
  ]

  const opportunityData = [
    { name: 'Leads', value: 72, color: '#667eea' },
    { name: 'Sales calls', value: 6, color: '#48bb78' },
    { name: 'Follow-up', value: 4, color: '#ed8936' },
    { name: 'Conversion', value: 18, color: '#f6ad55' }
  ]

  const funnelData = [
    { name: 'Leads', value: 200 },
    { name: 'Sales calls', value: 100 },
    { name: 'Follow-up', value: 70 },
    { name: 'Conversion', value: 20 },
    { name: 'Sale', value: 10 }
  ]

  const revenueData = [
    { date: 'Sep 01', revenue: 25000, leads: 30 },
    { date: 'Sep 02', revenue: 32000, leads: 38 },
    { date: 'Sep 03', revenue: 28000, leads: 32 },
    { date: 'Sep 04', revenue: 35000, leads: 42 },
    { date: 'Sep 05', revenue: 31000, leads: 36 },
    { date: 'Sep 06', revenue: 38000, leads: 45 },
    { date: 'Sep 07', revenue: 42000, leads: 48 },
    { date: 'Sep 08', revenue: 39000, leads: 43 },
    { date: 'Sep 09', revenue: 45000, leads: 50 },
    { date: 'Sep 10', revenue: 48000, leads: 52 }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">March 30, 2023</p>
        </div>
        <button className="filter-button">
          Filter date
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-title">{card.title}</h3>
            <div className="stat-content">
              <p className="stat-value">{card.value}</p>
              <div className={`stat-change ${card.trending}`}>
                {card.trending === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Opportunity Stage */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Opportunity stage</h3>
            <p className="chart-subtitle">Total 100%</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={opportunityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {opportunityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {opportunityData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deal Funnel */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Deal funnel</h3>
            <p className="chart-subtitle">Total 150</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3 className="chart-title">Revenue vs Leads</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  strokeWidth={3}
                  name="Revenue"
                  dot={{ fill: '#667eea', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="leads"
                  stroke="#48bb78"
                  strokeWidth={3}
                  name="Leads"
                  dot={{ fill: '#48bb78', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
