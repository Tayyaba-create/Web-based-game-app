"use client";
import Button from "@/app/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { Share2, X, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  gameSessionId: number;
  sessionCode?: string;
}

export default function QRCodeModal({
  open,
  onClose,
  gameSessionId,
  sessionCode,
}: QRCodeModalProps) {
  // Compute URL directly from props - no need for state to avoid cascading renders
  let url = "";
  if (typeof window !== "undefined") {
    url = `${window.location.origin}/playerlogin?sessionId=${gameSessionId}`;
  }

  const sessionUrl = url;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FLOW Game",
          text: "Scan this QR code to join the game session!",
          url: sessionUrl,
        });
      } catch {}
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg p-[25px] sm:p-[20px] md:p-[25px] w-[72vw]  ">
        {/* ❌ icon in top-right corner */}
        <X
          onClick={onClose}
          className="absolute top-[15px] right-[15px] w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        />

        <DialogHeader>
          <DialogTitle>
            <span className="text-2xl font-bold text-center text-white block">
              Session QR Code
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-6 mt-[5px]">
          <div className="bg-[#0B0D22] p-[6px] rounded-xl">
            {sessionUrl && (
              <QRCodeSVG
                value={sessionUrl}
                size={180}
                level="H"
                includeMargin
                fgColor="#7C3AED"
              />
            )}
          </div>

          <p
            className="text-base text-white px-6 leading-relaxed mb-4 font-medium"
            style={{ fontSize: "18px", color: "white" }}
          >
            Ask players to scan this QR code with their phone cameras to join
            the session.
          </p>

          {/* Link Input with Copy Button */}
          <div className="w-full max-w-md relative">
            <div className="flex mx-[15px]">
              <input
                type="text"
                readOnly
                value={sessionUrl}
                className="w-full px-[5px] py-[6px] bg-[#0B0D22] border-2 border-[#1E2144] rounded-l-md focus:outline-none font-medium text-white"
                style={{ fontSize: "24px", color: "white" }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sessionUrl);
                  const msgElement = document.getElementById("copyMsg");
                  if (msgElement) {
                    msgElement.classList.remove("opacity-0");
                    setTimeout(
                      () => msgElement.classList.add("opacity-0"),
                      2000
                    );
                  }
                }}
                className="px-8 bg-[#7B61FF] rounded-r-md hover:bg-[#6B51EF] transition-colors border-2 border-[#7B61FF]"
              >
                <Copy className="h-5 w-5 text-white" />
              </button>
            </div>
            <p
              id="copyMsg"
              className="text-base text-white mt-2 opacity-0 transition-opacity duration-200 font-medium"
            >
              Link copied to clipboard!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 mb-[30px] justify-center ">
            <Button
              variant="primary"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 mr-[10px]"
            >
              <span className="text-xl font-semibold">Share QR Code</span>
              <Share2 className="h-5 w-5 ml-[5px]" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
