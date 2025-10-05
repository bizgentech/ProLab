import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function SampleCollection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Sample Collection</h1>
        <p className="text-[#64748B] mt-1">Field sample collection and logging</p>
      </div>
      
      <Card>
        <CardContent className="p-16 text-center">
          <FlaskConical className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
          <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Sample Collection</h3>
          <p className="text-[#64748B] max-w-md mx-auto">
            Mobile-friendly interface for field technicians to log samples
          </p>
        </CardContent>
      </Card>
    </div>
  );
}