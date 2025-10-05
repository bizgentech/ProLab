import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, FileText, Download, Calendar, Filter,
  TrendingUp, DollarSign, CheckCircle, Clock
} from "lucide-react";

const reportCategories = [
  {
    title: "Operational Reports",
    icon: BarChart3,
    reports: [
      { name: "Daily Activity Report", description: "Daily operations summary", frequency: "Daily" },
      { name: "Weekly Operations Summary", description: "Week overview and metrics", frequency: "Weekly" },
      { name: "Turnaround Time Report", description: "Test completion times", frequency: "On Demand" },
      { name: "Inspector Performance", description: "Field tech productivity", frequency: "Monthly" }
    ]
  },
  {
    title: "Financial Reports",
    icon: DollarSign,
    reports: [
      { name: "Revenue Report", description: "Income analysis", frequency: "Monthly" },
      { name: "Profitability Analysis", description: "Profit margins by project", frequency: "Quarterly" },
      { name: "AR Aging Report", description: "Outstanding invoices", frequency: "Weekly" },
      { name: "Invoice Summary", description: "Billing overview", frequency: "Monthly" }
    ]
  },
  {
    title: "Quality Reports",
    icon: CheckCircle,
    reports: [
      { name: "QC Report", description: "Quality control metrics", frequency: "Monthly" },
      { name: "Pass/Fail Analysis", description: "Test result trends", frequency: "Weekly" },
      { name: "Compliance Summary", description: "Regulatory compliance", frequency: "Quarterly" },
      { name: "Non-Conformance Log", description: "Failed tests tracking", frequency: "On Demand" }
    ]
  },
  {
    title: "Client Reports",
    icon: FileText,
    reports: [
      { name: "Project Summary", description: "Client project overview", frequency: "On Demand" },
      { name: "Test Certificates", description: "Official test reports", frequency: "Per Sample" },
      { name: "Comprehensive Report", description: "Full project analysis", frequency: "Project End" }
    ]
  }
];

export default function Reports() {
  const [activeCategory, setActiveCategory] = useState("Operational Reports");

  const currentCategory = reportCategories.find(cat => cat.title === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Reports & Analytics</h1>
          <p className="text-[#64748B] mt-1">Generate reports and view analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Report
          </Button>
          <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Reports Generated</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">234</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <FileText className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">This Month</p>
                <p className="text-3xl font-bold text-[#10B981] mt-1">45</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <TrendingUp className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Scheduled</p>
                <p className="text-3xl font-bold text-[#F59E0B] mt-1">12</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B] bg-opacity-10">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Avg Gen Time</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">2.3s</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <Clock className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reportCategories.map(category => (
          <button
            key={category.title}
            onClick={() => setActiveCategory(category.title)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeCategory === category.title
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.title}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentCategory?.reports.map((report, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-1">{report.name}</CardTitle>
                  <p className="text-sm text-[#64748B]">{report.description}</p>
                </div>
                <Badge variant="outline">{report.frequency}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Filter className="w-4 h-4" />
                  Configure
                </Button>
                <Button size="sm" className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] gap-2">
                  <Download className="w-4 h-4" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}