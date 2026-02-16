"use client";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

interface UnlockSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function UnlockSessionDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: UnlockSessionDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] p-[40px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center max-w-sm">
        {/* ❌ icon in top-right corner */}
        <X
          onClick={onClose}
          className="absolute top-[15px] right-[15px] w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        />

        <div className="flex flex-col items-center text-center space-y-8 mt-[5px]">
          <p className="text-2xl text-white px-4 leading-relaxed font-medium mt-[10px]">
            Do you want to unlock session for players?
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-[20px] mb-[10px] justify-center w-full">
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center justify-center px-[5px] py-[3px] mr-[5px] font-semibold"
            >
              <span className="text-lg">
                {isLoading ? "Processing..." : "Yes"}
              </span>
            </Button>
            <Button
              variant="white"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center justify-center px-[5px] py-[3px] font-semibold"
            >
              <span className="text-lg">Cancel</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
