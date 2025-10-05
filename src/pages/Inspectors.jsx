import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function Inspectors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Inspector Management</h1>
        <p className="text-[#64748B] mt-1">Manage internal and external inspectors</p>
      </div>
      
      <Card>
        <CardContent className="p-16 text-center">
          <UserCheck className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
          <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Inspector Management</h3>
          <p className="text-[#64748B] max-w-md mx-auto">
            Track inspector availability, certifications, and performance metrics
          </p>
        </CardContent>
      </Card>
    </div>
  );
}