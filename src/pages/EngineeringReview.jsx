import React, { useState, useEffect } from "react";
import { Sample } from "@/api/entities";
import { LabTest } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  FileCheck, AlertCircle, CheckCircle, XCircle, 
  Clock, Search, Filter, ChevronDown, Eye
} from "lucide-react";

const statusConfig = {
  "Pending": { color: "bg-gray-500", icon: Clock },
  "In Review": { color: "bg-blue-500", icon: Eye },
  "Approved": { color: "bg-green-500", icon: CheckCircle },
  "Rejected": { color: "bg-red-500", icon: XCircle },
};

export default function EngineeringReview() {
  const [samples, setSamples] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    decision: "",
    comments: "",
    engineerName: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not logged in");
    }
    
    const allSamples = await Sample.list("-created_date");
    const allTests = await LabTest.list();
    
    setSamples(allSamples);
    setLabTests(allTests);
  };

  const getTestsForSample = (sampleId) => {
    return labTests.filter(test => test.sample_id === sampleId);
  };

  const getSampleAge = (sample) => {
    const submitted = new Date(sample.created_date);
    const now = new Date();
    const hours = Math.floor((now - submitted) / (1000 * 60 * 60));
    
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const filteredSamples = samples.filter(sample => {
    const matchesTab = 
      (activeTab === "pending" && (!sample.review_status || sample.review_status === "Pending")) ||
      (activeTab === "review" && sample.review_status === "In Review") ||
      (activeTab === "approved" && sample.review_status === "Approved") ||
      (activeTab === "rejected" && sample.review_status === "Rejected");
    
    const matchesSearch = 
      sample.sample_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const pendingCount = samples.filter(s => !s.review_status || s.review_status === "Pending").length;
  const inReviewCount = samples.filter(s => s.review_status === "In Review").length;
  const approvedCount = samples.filter(s => s.review_status === "Approved").length;
  const rejectedCount = samples.filter(s => s.review_status === "Rejected").length;

  const handleOpenReview = (sample) => {
    setSelectedSample(sample);
    setReviewData({
      decision: "",
      comments: "",
      engineerName: currentUser?.full_name || ""
    });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedSample || !reviewData.decision) return;

    await Sample.update(selectedSample.id, {
      review_status: reviewData.decision,
      review_comments: reviewData.comments,
      reviewed_by: reviewData.engineerName,
      review_date: new Date().toISOString()
    });

    setReviewDialogOpen(false);
    setSelectedSample(null);
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Engineering Review</h1>
          <p className="text-[#64748B] mt-1">Review and approve laboratory test results</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]">
            <Clock className="w-3 h-3 mr-1" />
            {pendingCount} Pending Review
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Pending</p>
                <p className="text-3xl font-bold text-[#F59E0B] mt-1">{pendingCount}</p>
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
                <p className="text-sm text-[#64748B]">In Review</p>
                <p className="text-3xl font-bold text-[#2563EB] mt-1">{inReviewCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <Eye className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Approved</p>
                <p className="text-3xl font-bold text-[#10B981] mt-1">{approvedCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Rejected</p>
                <p className="text-3xl font-bold text-[#EF4444] mt-1">{rejectedCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#EF4444] bg-opacity-10">
                <XCircle className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="review">In Review ({inReviewCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <Input
            placeholder="Search by Sample ID, Project, Client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC]">
                      <TableHead className="font-semibold">Priority</TableHead>
                      <TableHead className="font-semibold">Sample ID</TableHead>
                      <TableHead className="font-semibold">Project</TableHead>
                      <TableHead className="font-semibold">Client</TableHead>
                      <TableHead className="font-semibold">Sample Type</TableHead>
                      <TableHead className="font-semibold">Test Results</TableHead>
                      <TableHead className="font-semibold">Submitted</TableHead>
                      <TableHead className="font-semibold">Age</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSamples.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-[#64748B]">
                          No samples in this category
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSamples.map((sample) => {
                        const sampleTests = getTestsForSample(sample.sample_id);
                        const age = getSampleAge(sample);
                        const isUrgent = parseInt(age) > 24;

                        return (
                          <TableRow key={sample.id} className="hover:bg-[#F8FAFC]">
                            <TableCell>
                              {isUrgent ? (
                                <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                              ) : (
                                <div className="w-5 h-5" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-[#2563EB]">
                              {sample.sample_id}
                            </TableCell>
                            <TableCell>{sample.project_name}</TableCell>
                            <TableCell>{sample.client_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{sample.sample_type}</Badge>
                            </TableCell>
                            <TableCell>
                              {sample.test_results === "Pass" ? (
                                <Badge className="bg-[#10B981] text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Pass
                                </Badge>
                              ) : sample.test_results === "Fail" ? (
                                <Badge className="bg-[#EF4444] text-white">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Fail
                                </Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-[#64748B]">
                              {new Date(sample.created_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span className={isUrgent ? "text-[#EF4444] font-medium" : "text-[#64748B]"}>
                                {age}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusConfig[sample.review_status || "Pending"].color} text-white`}>
                                {sample.review_status || "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleOpenReview(sample)}
                                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Engineering Review - {selectedSample?.sample_id}
            </DialogTitle>
          </DialogHeader>

          {selectedSample && (
            <div className="space-y-6">
              {/* Sample Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sample Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-[#64748B]">Project</Label>
                    <p className="font-medium">{selectedSample.project_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#64748B]">Client</Label>
                    <p className="font-medium">{selectedSample.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#64748B]">Sample Type</Label>
                    <p className="font-medium">{selectedSample.sample_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#64748B]">Collection Date</Label>
                    <p className="font-medium">
                      {selectedSample.collection_date ? new Date(selectedSample.collection_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#64748B]">Collected By</Label>
                    <p className="font-medium">{selectedSample.collected_by}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#64748B]">Test Result</Label>
                    <Badge className={
                      selectedSample.test_results === "Pass" 
                        ? "bg-[#10B981] text-white" 
                        : "bg-[#EF4444] text-white"
                    }>
                      {selectedSample.test_results || "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Lab Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Laboratory Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {getTestsForSample(selectedSample.sample_id).length === 0 ? (
                    <p className="text-[#64748B] text-center py-4">No lab tests recorded</p>
                  ) : (
                    <div className="space-y-4">
                      {getTestsForSample(selectedSample.sample_id).map((test, idx) => (
                        <div key={idx} className="border border-[#E2E8F0] rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{test.test_type}</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-[#64748B]">Technician:</span>
                              <p className="font-medium">{test.technician}</p>
                            </div>
                            <div>
                              <span className="text-[#64748B]">Date:</span>
                              <p className="font-medium">
                                {test.test_date ? new Date(test.test_date).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[#64748B]">Result:</span>
                              <Badge className={
                                test.pass_fail === "Pass"
                                  ? "bg-[#10B981] text-white"
                                  : "bg-[#EF4444] text-white"
                              }>
                                {test.pass_fail}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Engineering Decision */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engineering Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Decision *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={reviewData.decision === "Approved" ? "default" : "outline"}
                        onClick={() => setReviewData({...reviewData, decision: "Approved"})}
                        className={reviewData.decision === "Approved" ? "bg-[#10B981] hover:bg-[#059669]" : ""}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant={reviewData.decision === "Rejected" ? "default" : "outline"}
                        onClick={() => setReviewData({...reviewData, decision: "Rejected"})}
                        className={reviewData.decision === "Rejected" ? "bg-[#EF4444] hover:bg-[#DC2626]" : ""}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comments" className="mb-2 block">
                      Engineering Comments
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Enter technical comments, recommendations, or concerns..."
                      value={reviewData.comments}
                      onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="engineer" className="mb-2 block">
                      Professional Engineer (PE)
                    </Label>
                    <Input
                      id="engineer"
                      placeholder="Engineer name and license number"
                      value={reviewData.engineerName}
                      onChange={(e) => setReviewData({...reviewData, engineerName: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewData.decision || !reviewData.engineerName}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}