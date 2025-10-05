import React from "react";
import { DollarSign, FolderKanban, FlaskConical, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatsCard from "../components/dashboard/StatsCard";

const revenueData = [
  { month: "Jan", revenue: 35000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 41000 },
  { month: "May", revenue: 45000 },
  { month: "Jun", revenue: 45230 }
];

const testTypeData = [
  { name: "Density Testing", value: 35, color: "#2563EB" },
  { name: "Asphalt Content", value: 25, color: "#10B981" },
  { name: "Gradation", value: 20, color: "#F59E0B" },
  { name: "Marshall Stability", value: 15, color: "#EF4444" },
  { name: "Other", value: 5, color: "#64748B" }
];

const inspectorData = [
  { name: "John Martinez", completed: 45 },
  { name: "Sarah Chen", completed: 42 },
  { name: "Mike Johnson", completed: 38 },
  { name: "Emily Rodriguez", completed: 35 },
  { name: "David Kim", completed: 32 }
];

const recentActivity = [
  { time: "10 mins ago", action: "New sample collected", user: "John Martinez", type: "sample" },
  { time: "25 mins ago", action: "Test completed - PASSED", user: "Lab Tech", type: "success" },
  { time: "1 hour ago", action: "Work order assigned", user: "Sarah Chen", type: "assignment" },
  { time: "2 hours ago", action: "Engineering review approved", user: "Dr. Anderson", type: "approval" },
  { time: "3 hours ago", action: "Invoice sent to client", user: "Billing", type: "invoice" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
        <p className="text-[#64748B] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue This Month"
          value="$45,230"
          trend="up"
          trendValue="+12.5%"
          icon={DollarSign}
          iconBg="bg-[#10B981]"
        />
        <StatsCard
          title="Active Projects"
          value="23"
          trendValue="5 starting this week"
          icon={FolderKanban}
          iconBg="bg-[#2563EB]"
        />
        <StatsCard
          title="Samples This Week"
          value="156"
          trend="up"
          trendValue="+8%"
          icon={FlaskConical}
          iconBg="bg-[#F59E0B]"
        />
        <StatsCard
          title="Avg Turnaround Time"
          value="38.5 hrs"
          trend="down"
          trendValue="-4.2 hrs"
          icon={Clock}
          iconBg="bg-[#EF4444]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tests by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Tests by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {testTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#64748B]">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspector Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Inspector Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inspectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis type="category" dataKey="name" stroke="#64748B" width={120} />
                <Tooltip />
                <Bar dataKey="completed" fill="#2563EB" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'success' ? 'bg-[#10B981] bg-opacity-10' :
                      activity.type === 'approval' ? 'bg-[#2563EB] bg-opacity-10' :
                      activity.type === 'invoice' ? 'bg-[#F59E0B] bg-opacity-10' :
                      'bg-[#64748B] bg-opacity-10'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-[#10B981]' :
                        activity.type === 'approval' ? 'bg-[#2563EB]' :
                        activity.type === 'invoice' ? 'bg-[#F59E0B]' :
                        'bg-[#64748B]'
                      }`} />
                    </div>
                    {index < recentActivity.length - 1 && (
                      <div className="w-0.5 h-8 bg-[#E2E8F0] mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1E293B]">{activity.action}</p>
                    <p className="text-xs text-[#64748B]">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}