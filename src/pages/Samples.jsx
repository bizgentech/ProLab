import React, { useState, useEffect } from "react";
import { Sample } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, MapPin } from "lucide-react";

const statusColors = {
  "Collected": "bg-[#64748B] text-white",
  "In Transit": "bg-[#3B82F6] text-white",
  "In Lab": "bg-[#F59E0B] text-white",
  "Testing": "bg-[#F59E0B] text-white",
  "Completed": "bg-[#10B981] text-white",
  "Archived": "bg-[#64748B] text-white"
};

const resultColors = {
  "Pass": "bg-[#10B981] text-white",
  "Fail": "bg-[#EF4444] text-white",
  "Pending": "bg-[#64748B] text-white",
  "In Progress": "bg-[#F59E0B] text-white"
};

export default function Samples() {
  const [samples, setSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    const data = await Sample.list("-created_date");
    setSamples(data);
  };

  const filteredSamples = samples.filter(sample => {
    const matchesTab = activeTab === "All" || sample.status === activeTab;
    const matchesSearch = sample.sample_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ["All", "Collected", "In Transit", "In Lab", "Testing", "Completed"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Sample Database</h1>
          <p className="text-[#64748B] mt-1">Track samples from collection to completion</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
            Scan Barcode
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                placeholder="Search by Sample ID, Project, Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8FAFC]">
                  <TableHead className="font-semibold">Sample ID</TableHead>
                  <TableHead className="font-semibold">WO Number</TableHead>
                  <TableHead className="font-semibold">Project</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Sample Type</TableHead>
                  <TableHead className="font-semibold">Collection Date</TableHead>
                  <TableHead className="font-semibold">Collected By</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Results</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <TableCell className="font-medium text-[#2563EB]">
                      {sample.sample_id}
                    </TableCell>
                    <TableCell>{sample.wo_number}</TableCell>
                    <TableCell>{sample.project_name}</TableCell>
                    <TableCell>{sample.client_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#F1F5F9]">
                        {sample.sample_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {sample.collection_date ? new Date(sample.collection_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm">{sample.collected_by}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#64748B]" />
                        <span className="text-sm">{sample.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[sample.status]}>
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={resultColors[sample.test_results]}>
                        {sample.test_results}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}