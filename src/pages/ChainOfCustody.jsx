import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ChainOfCustody() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Chain of Custody</h1>
        <p className="text-[#64748B] mt-1">Track sample custody and transfers</p>
      </div>
      
      <Card>
        <CardContent className="p-16 text-center">
          <FileText className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
          <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Chain of Custody</h3>
          <p className="text-[#64748B] max-w-md mx-auto">
            Maintain detailed custody records for all samples
          </p>
        </CardContent>
      </Card>
    </div>
  );
}