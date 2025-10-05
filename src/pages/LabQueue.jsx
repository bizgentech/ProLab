import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Microscope } from "lucide-react";

export default function LabQueue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Lab Queue</h1>
        <p className="text-[#64748B] mt-1">Samples pending laboratory testing</p>
      </div>
      
      <Card>
        <CardContent className="p-16 text-center">
          <Microscope className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
          <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Lab Queue</h3>
          <p className="text-[#64748B] max-w-md mx-auto">
            Priority queue of samples awaiting testing
          </p>
        </CardContent>
      </Card>
    </div>
  );
}