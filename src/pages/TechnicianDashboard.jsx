
import React, { useState, useEffect, useCallback } from "react";
import { Employee } from "@/api/entities";
import { WorkOrder } from "@/api/entities";
import { Sample } from "@/api/entities";
import { FieldTest } from "@/api/entities";
import { ActivityLog } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, MessageCircle, Clock, ClipboardList, FlaskConical, Activity, CheckCircle, XCircle, Upload, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TechnicianDashboard() {
  const [technician, setTechnician] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [samples, setSamples] = useState([]);
  const [fieldTests, setFieldTests] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [expandedWO, setExpandedWO] = useState(null);
  const [activeWOTab, setActiveWOTab] = useState("in-progress");
  const [activeSampleTab, setActiveSampleTab] = useState("all");
  const [showTestForm, setShowTestForm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSamples, setSelectedSamples] = useState([]);
  
  const urlParams = new URLSearchParams(window.location.search);
  const techId = urlParams.get('id');
  const techName = urlParams.get('name');

  const loadTechnicianData = useCallback(async () => {
    // Ensure techId and techName are available before making API calls
    if (!techId || !techName) return;

    const tech = await Employee.filter({ id: techId });
    if (tech && tech.length > 0) {
      setTechnician(tech[0]);
    }
    
    const orders = await WorkOrder.filter({ assigned_to: techName });
    setWorkOrders(orders);
    
    const allSamples = await Sample.list();
    const techSamples = allSamples.filter(s => s.collected_by === techName);
    setSamples(techSamples);
    
    const tests = await FieldTest.filter({ technician_name: techName });
    setFieldTests(tests);
    
    const logs = await ActivityLog.filter({ technician_name: techName });
    setActivityLog(logs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
  }, [techId, techName]); // Dependencies for useCallback

  useEffect(() => {
    if (techId && techName) { // Ensure both are present before loading data
      loadTechnicianData();
    }
  }, [techId, techName, loadTechnicianData]); // Dependencies for useEffect

  if (!technician) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-[#64748B] animate-spin" />
          <p className="text-[#64748B]">Loading technician data...</p>
        </div>
      </div>
    );
  }

  const inProgressWOs = workOrders.filter(wo => wo.status === "In Progress");
  const completedTodayWOs = workOrders.filter(wo => wo.status === "Completed");
  const scheduledWOs = workOrders.filter(wo => wo.status === "Assigned");

  const filteredSamples = samples.filter(s => {
    if (activeSampleTab === "all") return true;
    if (activeSampleTab === "ready") return s.status === "Collected";
    if (activeSampleTab === "transit") return s.status === "In Transit";
    if (activeSampleTab === "lab") return s.status === "In Lab";
    if (activeSampleTab === "results") return s.test_results !== "Pending";
    return true;
  });

  const handleTransferSamples = () => {
    setShowTransferModal(true);
  };

  const confirmTransfer = async () => {
    // In real app, would create SampleTransfer record and update sample statuses
    setShowTransferModal(false);
    setSelectedSamples([]);
    await loadTechnicianData(); // Reload data after transfer
  };

  const todayStats = {
    jobs: completedTodayWOs.length + inProgressWOs.length,
    samples: samples.filter(s => {
      const today = new Date().toDateString();
      return new Date(s.collection_date).toDateString() === today;
    }).length,
    tests: fieldTests.length,
    hours: technician.current_status === "On Shift" ? "6.5" : "0" // This should probably be dynamically calculated
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl("FieldTechnicians")}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#1E293B]">{technician.full_name}'s Dashboard</h1>
          <p className="text-[#64748B] mt-1">Field technician real-time operations</p>
        </div>
      </div>

      {/* Tech Info Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-xl">
                  {technician.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  technician.current_status === "On Shift" ? "bg-[#10B981]" :
                  technician.current_status === "Break" ? "bg-[#F59E0B]" :
                  "bg-[#EF4444]"
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#1E293B]">{technician.full_name}</h2>
                  <Badge className={
                    technician.current_status === "On Shift" ? "bg-[#10B981] text-white" :
                    technician.current_status === "Break" ? "bg-[#F59E0B] text-white" :
                    "bg-[#64748B] text-white"
                  }>
                    {technician.current_status}
                    {technician.current_status === "On Shift" && ` (${todayStats.hours} hours)`}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-[#64748B]">
                  <MapPin className="w-4 h-4" />
                  <span>{technician.current_location || "Location unavailable"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>
              <Button variant="outline">View Profile</Button>
              {technician.current_status === "On Shift" && (
                <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white">
                  Clock Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Today's Jobs</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{todayStats.jobs}</p>
                <p className="text-xs text-[#64748B] mt-1">
                  {completedTodayWOs.length} Completed, {inProgressWOs.length} In Progress
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <ClipboardList className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Samples Collected</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{todayStats.samples}</p>
                <p className="text-xs text-[#64748B] mt-1">All transferred to lab</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <FlaskConical className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Tests Performed</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{todayStats.tests}</p>
                <p className="text-xs text-[#64748B] mt-1">
                  {fieldTests.filter(t => t.pass_fail === "Pass").length} Pass, {fieldTests.filter(t => t.pass_fail === "Fail").length} Fail
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Hours Worked</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{todayStats.hours}</p>
                {technician.clock_in_time && (
                  <p className="text-xs text-[#64748B] mt-1">Clock In: {technician.clock_in_time}</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-[#EF4444] bg-opacity-10">
                <Clock className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders - Scheduled & Active</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveWOTab("scheduled")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeWOTab === "scheduled"
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              Scheduled ({scheduledWOs.length})
            </button>
            <button
              onClick={() => setActiveWOTab("in-progress")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeWOTab === "in-progress"
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              In Progress ({inProgressWOs.length})
            </button>
            <button
              onClick={() => setActiveWOTab("completed")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeWOTab === "completed"
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              Completed Today ({completedTodayWOs.length})
            </button>
          </div>

          {/* Work Order Cards */}
          {activeWOTab === "in-progress" && inProgressWOs.map(wo => (
            <Card key={wo.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#1E293B]">{wo.wo_number}</h3>
                      <Badge className="bg-[#F59E0B] text-white">In Progress</Badge>
                    </div>
                    <p className="text-[#64748B]">Client: <span className="text-[#1E293B] font-medium">{wo.client_name}</span></p>
                    <p className="text-[#64748B]">Project: <span className="text-[#1E293B] font-medium">{wo.project_name}</span></p>
                    <p className="text-[#64748B]">Service: <span className="text-[#1E293B] font-medium">{wo.service_type}</span></p>
                  </div>
                  <Button
                    onClick={() => setExpandedWO(expandedWO === wo.id ? null : wo.id)}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                  >
                    {expandedWO === wo.id ? "Close Work Order" : "Open Work Order"}
                  </Button>
                </div>

                {expandedWO === wo.id && (
                  <div className="border-t pt-6 mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Left Column - WO Info & Map */}
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-3">Work Order Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">WO Number:</span>
                              <span className="font-medium">{wo.wo_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">Client:</span>
                              <span className="font-medium">{wo.client_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">Project:</span>
                              <span className="font-medium">{wo.project_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">Location:</span>
                              <span className="font-medium">{wo.location}</span>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full mt-4 gap-2">
                            <Navigation className="w-4 h-4" />
                            Get Directions
                          </Button>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-3">Site Map</h4>
                          <div className="bg-[#F8FAFC] rounded-lg h-48 flex items-center justify-center">
                            <div className="text-center text-[#64748B]">
                              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Job site location map</p>
                            </div>
                          </div>
                        </div>

                        {wo.special_instructions && (
                          <div>
                            <h4 className="font-semibold text-[#1E293B] mb-3">Special Instructions</h4>
                            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-3 text-sm">
                              {wo.special_instructions}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Test Entry */}
                      <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-[#1E293B]">Test Entry - {wo.service_type}</h4>
                          <Button
                            onClick={() => setShowTestForm(!showTestForm)}
                            className="bg-[#10B981] hover:bg-[#059669] text-white gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {showTestForm ? "Cancel Test" : "Add New Test"}
                          </Button>
                        </div>

                        {showTestForm && (
                          <Card className="bg-[#F8FAFC]">
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-semibold text-lg">Test #{fieldTests.length + 1}</h5>
                                <Badge variant="outline">Nuclear Density Testing</Badge>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label>Station</Label>
                                  <Input placeholder="10+50" />
                                </div>
                                <div>
                                  <Label>Offset</Label>
                                  <Input placeholder="5' RT" />
                                </div>
                                <div>
                                  <Label>Depth</Label>
                                  <Input placeholder="6 inches" />
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h6 className="font-medium mb-3">Field Results</h6>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Wet Density (pcf)</Label>
                                    <Input type="number" placeholder="140.5" />
                                  </div>
                                  <div>
                                    <Label>Dry Density (pcf)</Label>
                                    <Input type="number" placeholder="132.8" />
                                  </div>
                                  <div>
                                    <Label>Moisture (%)</Label>
                                    <Input type="number" placeholder="5.8" />
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                  <span className="text-sm text-[#64748B]">Pass/Fail:</span>
                                  <Badge className="bg-[#10B981] text-white">✓ Pass (Auto-calculated)</Badge>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h6 className="font-medium mb-3">Sample Collection</h6>
                                <div className="flex items-center gap-2 mb-3">
                                  <input type="checkbox" id="sample-collected" className="w-4 h-4" />
                                  <Label htmlFor="sample-collected">Sample Collected for Lab</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Sample ID (Auto-generated)</Label>
                                    <Input value={`S-2025-${Math.floor(Math.random() * 1000)}`} disabled />
                                  </div>
                                  <div>
                                    <Label>Photos</Label>
                                    <Button variant="outline" className="w-full gap-2">
                                      <Upload className="w-4 h-4" />
                                      Upload Photos
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <Label>Notes</Label>
                                  <Textarea placeholder="Additional notes..." rows={2} />
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4">
                                <Button className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8]">
                                  Save Test
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Save & Add Another
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Completed Tests */}
                        <div>
                          <h5 className="font-semibold text-[#1E293B] mb-3">Completed Tests Today</h5>
                          <div className="space-y-2">
                            {fieldTests.filter(t => t.work_order_id === wo.wo_number).map((test) => (
                              <div key={test.id} className="bg-white rounded-lg p-4 border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Test #{test.test_number} - Station {test.station}</p>
                                    <p className="text-sm text-[#64748B]">
                                      Dry Density: {test.dry_density} pcf | Moisture: {test.moisture_content}%
                                    </p>
                                  </div>
                                  <Badge className={test.pass_fail === "Pass" ? "bg-[#10B981] text-white" : "bg-[#EF4444] text-white"}>
                                    {test.pass_fail}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {activeWOTab === "scheduled" && scheduledWOs.map(wo => (
            <Card key={wo.id} className="mb-4 bg-[#F8FAFC]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B]">{wo.wo_number}</h3>
                    <p className="text-sm text-[#64748B]">{wo.client_name} - {wo.project_name}</p>
                    <p className="text-sm text-[#64748B]">Service: {wo.service_type}</p>
                  </div>
                  <Badge className="bg-[#3B82F6] text-white">Scheduled</Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeWOTab === "completed" && completedTodayWOs.map(wo => (
            <Card key={wo.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B]">{wo.wo_number}</h3>
                    <p className="text-sm text-[#64748B]">{wo.client_name} - {wo.project_name}</p>
                    <p className="text-sm text-[#10B981] font-medium">All tests completed ✓</p>
                  </div>
                  <Badge className="bg-[#10B981] text-white">Completed</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Samples & Results Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Samples & Results</CardTitle>
            {samples.filter(s => s.status === "Collected").length > 0 && (
              <Button onClick={handleTransferSamples} className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2">
                <FlaskConical className="w-4 h-4" />
                Transfer All to Lab
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {["all", "ready", "transit", "lab", "results"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSampleTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${
                  activeSampleTab === tab
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                {tab === "ready" ? "Ready for Transfer" : 
                 tab === "transit" ? "In Transit" :
                 tab === "lab" ? "In Lab" :
                 tab === "results" ? "Results Available" : "All"}
              </button>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC]">
                <TableHead className="font-semibold">Sample ID</TableHead>
                <TableHead className="font-semibold">WO#</TableHead>
                <TableHead className="font-semibold">Station</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Collection Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSamples.map((sample) => (
                <TableRow key={sample.id} className="hover:bg-[#F8FAFC]">
                  <TableCell className="font-medium text-[#2563EB]">{sample.sample_id}</TableCell>
                  <TableCell>{sample.wo_number}</TableCell>
                  <TableCell>{sample.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sample.sample_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B]">
                    {new Date(sample.collection_date).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      sample.status === "Collected" ? "bg-[#F59E0B] text-white" :
                      sample.status === "In Transit" ? "bg-[#3B82F6] text-white" :
                      sample.status === "In Lab" ? "bg-[#F59E0B] text-white" :
                      "bg-[#10B981] text-white"
                    }>
                      {sample.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      sample.test_results === "Pass" ? "bg-[#10B981] text-white" :
                      sample.test_results === "Fail" ? "bg-[#EF4444] text-white" :
                      "bg-[#64748B] text-white"
                    }>
                      {sample.test_results}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Daily Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLog.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.activity_type === "clock_in" ? "bg-[#10B981] bg-opacity-10" :
                    activity.activity_type === "test_complete" ? "bg-[#2563EB] bg-opacity-10" :
                    activity.activity_type === "sample_transfer" ? "bg-[#F59E0B] bg-opacity-10" :
                    "bg-[#64748B] bg-opacity-10"
                  }`}>
                    {activity.activity_type === "clock_in" && <Clock className="w-5 h-5 text-[#10B981]" />}
                    {activity.activity_type === "test_complete" && <CheckCircle className="w-5 h-5 text-[#2563EB]" />}
                    {activity.activity_type === "sample_transfer" && <FlaskConical className="w-5 h-5 text-[#F59E0B]" />}
                    {!["clock_in", "test_complete", "sample_transfer"].includes(activity.activity_type) && (
                      <Activity className="w-5 h-5 text-[#64748B]" />
                    )}
                  </div>
                  {index < activityLog.length - 1 && (
                    <div className="w-0.5 h-12 bg-[#E2E8F0] mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-[#1E293B]">{activity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#64748B] mt-1">
                    <span>{new Date(activity.created_date).toLocaleTimeString()}</span>
                    {activity.location_name && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Samples to Lab</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Samples Selected</Label>
              <p className="text-2xl font-bold text-[#2563EB]">
                {samples.filter(s => s.status === "Collected").length}
              </p>
            </div>
            <div>
              <Label>Transfer To</Label>
              <select className="w-full p-2 border rounded-lg">
                <option>Main Laboratory</option>
                <option>Secondary Lab</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cooler #</Label>
                <Input placeholder="C-101" />
              </div>
              <div>
                <Label>Temperature (°F)</Label>
                <Input placeholder="65" type="number" />
              </div>
            </div>
            <div>
              <Label>Transport Method</Label>
              <select className="w-full p-2 border rounded-lg">
                <option>Company Vehicle</option>
                <option>Courier</option>
                <option>Hand Delivery</option>
              </select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Additional transfer notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmTransfer} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
