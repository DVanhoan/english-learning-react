"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/VideoPlayer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoursePreviewModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  courseTitle: string;
  videoSrc: string;
  videoPoster?: string;
}

export default function CoursePreviewModal({
  isOpen,
  setOpen,
  courseTitle,
  videoSrc,
  videoPoster,
}: CoursePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-full p-0 bg-gray-900 border-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Course Preview</p>
              <DialogTitle className="text-white text-xl font-bold">
                {courseTitle}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="aspect-video w-full">
            <VideoPlayer
              src={videoSrc}
              poster={videoPoster}
              title=""
              showTitle={false}
              autoPlay={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
