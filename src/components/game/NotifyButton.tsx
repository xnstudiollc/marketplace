"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function NotifyButton({ gameName }: { gameName: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        toast.success(`Deal alerts on for ${gameName}`, { description: "Demo only: no notifications will be sent." })
      }
    >
      <Bell aria-hidden />
      Notify me about deals
    </Button>
  );
}
