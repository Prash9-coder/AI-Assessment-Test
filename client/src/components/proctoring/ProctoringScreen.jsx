import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CameraOff,
  AlertCircle,
  AlertTriangle,
  Check,
  X,
  Monitor,
  MoveHorizontal,
} from "lucide-react";

export function ProctoringScreen({ onViolation, testTimeMinutes = 30 }) {
  const [violations, setViolations] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(testTimeMinutes * 60); // in seconds
  const [focusEvents, setFocusEvents] = useState(0);
  const [position, setPosition] = useState("right");

  // Monitor for focus/blur events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newViolations = [...violations, "Tab change detected"];
        setViolations(newViolations);
        setFocusEvents((prev) => prev + 1);
        if (onViolation) onViolation("tab_switch");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [violations, onViolation]);

  // Copy/Paste Lock
  useEffect(() => {
    const disableCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy/Paste is disabled during the test.");
    };

    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    return () => {
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePosition = () => {
    setPosition((prev) => (prev === "right" ? "left" : "right"));
  };

  return (
    <div
      className={`fixed top-24 ${
        position === "right" ? "right-4" : "left-4"
      } z-50`}
    >
      <Card className="w-64 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm flex items-center">
              <Monitor className="h-4 w-4 mr-1" />
              Proctoring Active
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={togglePosition}
                title="Move window"
              >
                <MoveHorizontal className="h-3 w-3" />
              </Button>
              <Badge
                variant={violations.length > 0 ? "destructive" : "outline"}
              >
                {violations.length} {violations.length === 1 ? "Alert" : "Alerts"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          {/* Flask camera feed */}
          <div className="relative bg-black rounded-md aspect-video overflow-hidden">
            <img
              src="http://localhost:5001/video_feed"
              alt="Live Proctoring Feed"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {formatTimeRemaining()}
            </div>
          </div>

          {/* Status indicators */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Camera</span>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">Streaming</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Screen Focus</span>
              <div className="flex items-center">
                {focusEvents > 0 ? (
                  <>
                    <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-amber-500">
                      {focusEvents} switch{focusEvents !== 1 ? "es" : ""}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">Focused</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Test Progress</span>
              <span>
                {Math.round(
                  ((testTimeMinutes * 60 - timeRemaining) /
                    (testTimeMinutes * 60)) *
                    100
                )}%
              </span>
            </div>
            <Progress
              value={
                ((testTimeMinutes * 60 - timeRemaining) /
                  (testTimeMinutes * 60)) *
                100
              }
              className="h-1.5"
            />
          </div>

          {/* Recent alerts */}
          {violations.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center text-xs font-medium text-muted-foreground mb-1.5">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Recent Alerts
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1.5">
                {violations.slice(-3).map((violation, i) => (
                  <div
                    key={i}
                    className="text-xs bg-destructive/10 text-destructive rounded px-2 py-1"
                  >
                    {violation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
