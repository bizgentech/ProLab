import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TestTube } from "lucide-react";

export default function Testing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Laboratory Testing</h1>
        <p className="text-[#64748B] mt-1">Active tests and data entry</p>
      </div>
      
      <Card>
        <CardContent className="p-16 text-center">
          <TestTube className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
          <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Testing Interface</h3>
          <p className="text-[#64748B] max-w-md mx-auto">
            Real-time test data entry and results recording
          </p>
        </CardContent>
      </Card>
    </div>
  );
}