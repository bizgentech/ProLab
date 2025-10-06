import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { User } from "@/api/entities";
import { Employee } from "@/api/entities";
import { WorkOrder } from "@/api/entities";
import { Sample } from "@/api/entities";
import { FieldTest } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Clock, MapPin, CheckCircle, FlaskConical, Camera, 
  Navigation, Phone, AlertCircle, LogOut, Menu
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function FieldTechApp() {
  const { logout } = useAuth();
  const { location, error: gpsError, loading: gpsLoading, getCurrentLocation } = useGeolocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [myWorkOrders, setMyWorkOrders] = useState([]);
  const [mySamples, setMySamples] = useState([]);
  const [activeTab, setActiveTab] = useState("work-orders");
  const [selectedWO, setSelectedWO] = useState(null);
  const [testFormData, setTestFormData] = useState({
    station: "",
    offset: "",
    depth: "",
    wet_density: "",
    dry_density: "",
    moisture_content: "",
    notes: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const employees = await Employee.filter({ created_by: user.email });
      if (employees && employees.length > 0) {
        const emp = employees[0];
        setEmployee(emp);
        
        const orders = await WorkOrder.filter({ assigned_to: emp.full_name });
        setMyWorkOrders(orders);
        
        const allSamples = await Sample.list();
        const techSamples = allSamples.filter(s => s.collected_by === emp.full_name);
        setMySamples(techSamples);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleClockIn = async () => {
    if (employee) {
      await Employee.update(employee.id, {
        current_status: "On Shift",
        clock_in_time: new Date().toLocaleTimeString()
      });
      await loadUserData();
    }
  };

  const handleClockOut = async () => {
    if (employee) {
      await Employee.update(employee.id, {
        current_status: "Off Duty",
        clock_in_time: null
      });
      await loadUserData();
    }
  };

  const handleSubmitTest = async () => {
    if (!selectedWO || !employee) return;

    const testData = {
      work_order_id: selectedWO.wo_number,
      technician_id: employee.id,
      technician_name: employee.full_name,
      test_number: 1,
      station: testFormData.station,
      offset: testFormData.offset,
      depth: testFormData.depth,
      wet_density: parseFloat(testFormData.wet_density),
      dry_density: parseFloat(testFormData.dry_density),
      moisture_content: parseFloat(testFormData.moisture_content),
      pass_fail: "Pass",
      notes: testFormData.notes,
      status: "Completed",
      gps_latitude: location?.latitude,
      gps_longitude: location?.longitude,
      gps_accuracy: location?.accuracy
    };

    await FieldTest.create(testData);
    
    setTestFormData({
      station: "",
      offset: "",
      depth: "",
      wet_density: "",
      dry_density: "",
      moisture_content: "",
      notes: ""
    });
    
    alert("Test saved successfully!");
  };

  if (!currentUser || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-[#64748B] animate-spin" />
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Loading...</h3>
            <p className="text-[#64748B]">Setting up your field interface</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const inProgressWOs = myWorkOrders.filter(wo => wo.status === "In Progress" || wo.status === "Assigned");
  const todaySamples = mySamples.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.collection_date).toDateString() === today;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-lg">
                {employee.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="font-bold text-[#1E293B]">{employee.full_name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    employee.current_status === "On Shift" ? "bg-[#10B981]" : "bg-[#EF4444]"
                  }`} />
                  <span className="text-sm text-[#64748B]">{employee.current_status}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="flex gap-2">
            {employee.current_status === "Off Duty" ? (
              <Button 
                onClick={handleClockIn}
                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white"
              >
                <Clock className="w-4 h-4 mr-2" />
                Clock In
              </Button>
            ) : (
              <>
                <div className="flex-1 bg-[#10B981] bg-opacity-10 rounded-lg px-4 py-2 text-center">
                  <p className="text-xs text-[#64748B]">Clocked In</p>
                  <p className="font-bold text-[#10B981]">{employee.clock_in_time}</p>
                </div>
                <Button 
                  onClick={handleClockOut}
                  variant="outline"
                  className="border-[#EF4444] text-[#EF4444]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Clock Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#E2E8F0] p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2563EB]">{inProgressWOs.length}</p>
            <p className="text-xs text-[#64748B]">Active Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#10B981]">{todaySamples.length}</p>
            <p className="text-xs text-[#64748B]">Samples Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#F59E0B]">
              {employee.current_status === "On Shift" ? "6.5" : "0"}
            </p>
            <p className="text-xs text-[#64748B]">Hours</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="work-orders">Jobs</TabsTrigger>
            <TabsTrigger value="test-entry">Tests</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
          </TabsList>

          <TabsContent value="work-orders" className="space-y-3 mt-4">
            {inProgressWOs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-[#64748B] opacity-50" />
                  <p className="text-[#64748B]">No active work orders</p>
                </CardContent>
              </Card>
            ) : (
              inProgressWOs.map(wo => (
                <Card key={wo.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{wo.wo_number}</CardTitle>
                        <p className="text-sm opacity-90 mt-1">{wo.client_name}</p>
                      </div>
                      <Badge className="bg-white text-[#2563EB]">
                        {wo.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-[#1E293B]">{wo.project_name}</p>
                      <p className="text-sm text-[#64748B]">{wo.service_type}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <MapPin className="w-4 h-4" />
                      <span>{wo.location}</span>
                    </div>

                    {wo.special_instructions && (
                      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-3">
                        <p className="text-xs font-medium text-[#92400E] mb-1">⚠️ Special Instructions</p>
                        <p className="text-sm text-[#92400E]">{wo.special_instructions}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
                        onClick={() => {
                          setSelectedWO(wo);
                          setActiveTab("test-entry");
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Start Work
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="test-entry" className="space-y-4 mt-4">
            {!selectedWO ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-[#64748B] opacity-50" />
                  <p className="text-[#64748B] mb-3">Select a work order to start testing</p>
                  <Button onClick={() => setActiveTab("work-orders")}>
                    View Work Orders
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="bg-[#F8FAFC] border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedWO.wo_number}</CardTitle>
                      <p className="text-sm text-[#64748B] mt-1">{selectedWO.service_type}</p>
                    </div>
                    <Badge>{selectedWO.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#1E293B]">Test Location</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={gpsLoading}
                        className="gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        {gpsLoading ? 'Getting GPS...' : 'Get GPS'}
                      </Button>
                    </div>
                    
                    {location && (
                      <div className="bg-[#10B981] bg-opacity-10 border border-[#10B981] rounded-lg p-3 text-sm">
                        <p className="font-medium text-[#10B981] mb-1">GPS Captured</p>
                        <p className="text-xs text-[#64748B]">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Accuracy: {location.accuracy.toFixed(0)}m
                        </p>
                      </div>
                    )}
                    
                    {gpsError && (
                      <div className="bg-[#EF4444] bg-opacity-10 border border-[#EF4444] rounded-lg p-3 text-sm">
                        <p className="text-[#EF4444]">GPS Error: {gpsError}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Station</Label>
                        <Input
                          placeholder="10+50"
                          value={testFormData.station}
                          onChange={(e) => setTestFormData({...testFormData, station: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Offset</Label>
                        <Input
                          placeholder="5' RT"
                          value={testFormData.offset}
                          onChange={(e) => setTestFormData({...testFormData, offset: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Depth</Label>
                        <Input
                          placeholder="6 in"
                          value={testFormData.depth}
                          onChange={(e) => setTestFormData({...testFormData, depth: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1E293B]">Field Results</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Wet Density (pcf)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="140.5"
                          value={testFormData.wet_density}
                          onChange={(e) => setTestFormData({...testFormData, wet_density: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Dry Density (pcf)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="132.8"
                          value={testFormData.dry_density}
                          onChange={(e) => setTestFormData({...testFormData, dry_density: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Moisture (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="5.8"
                          value={testFormData.moisture_content}
                          onChange={(e) => setTestFormData({...testFormData, moisture_content: e.target.value})}
                        />
                      </div>
                    </div>

                    {testFormData.dry_density && (
                      <div className="bg-[#10B981] bg-opacity-10 rounded-lg p-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                        <div>
                          <p className="text-sm font-medium text-[#10B981]">Pass</p>
                          <p className="text-xs text-[#64748B]">Meets specification requirements</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1E293B]">Photos & Notes</h3>
                    <Button variant="outline" className="w-full gap-2">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    <Textarea
                      placeholder="Additional notes..."
                      rows={3}
                      value={testFormData.notes}
                      onChange={(e) => setTestFormData({...testFormData, notes: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedWO(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                      onClick={handleSubmitTest}
                      disabled={!testFormData.station || !testFormData.dry_density}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="samples" className="space-y-3 mt-4">
            {todaySamples.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FlaskConical className="w-12 h-12 mx-auto mb-3 text-[#64748B] opacity-50" />
                  <p className="text-[#64748B]">No samples collected today</p>
                </CardContent>
              </Card>
            ) : (
              todaySamples.map(sample => (
                <Card key={sample.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-[#2563EB]">{sample.sample_id}</p>
                        <p className="text-sm text-[#64748B]">{sample.wo_number}</p>
                      </div>
                      <Badge className={
                        sample.status === "Collected" ? "bg-[#F59E0B] text-white" :
                        sample.status === "In Transit" ? "bg-[#3B82F6] text-white" :
                        "bg-[#10B981] text-white"
                      }>
                        {sample.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Type:</span>
                        <span className="font-medium">{sample.sample_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Location:</span>
                        <span className="font-medium">{sample.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Time:</span>
                        <span className="font-medium">
                          {new Date(sample.collection_date).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {todaySamples.filter(s => s.status === "Collected").length > 0 && (
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] gap-2">
                <FlaskConical className="w-4 h-4" />
                Transfer {todaySamples.filter(s => s.status === "Collected").length} Samples to Lab
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-[#64748B]">
          <Phone className="w-4 h-4" />
          <span>Need help? Call dispatch: (305) 555-0100</span>
        </div>
      </div>
    </div>
  );
}