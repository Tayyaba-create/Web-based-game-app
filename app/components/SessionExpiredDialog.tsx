"use client";
import Button from "@/app/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";

interface SessionExpiredDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language?: string;
}

export default function SessionExpiredDialog({
  open,
  onClose,
  onConfirm,
  language = "en",
}: SessionExpiredDialogProps) {
  const { t } = useGameTranslation(language);

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .session-expired-dialog {
            width: 250px !important;
          }
        }
      `}</style>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="session-expired-dialog relative rounded-[10px] p-[30px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center max-w-sm">
          <div className="flex flex-col items-center text-center space-y-8">
            <AlertTriangle className="w-16 h-16 text-yellow-400" />

            <p className="text-2xl text-white px-4 leading-relaxed font-medium">
              {t("sessionExpired.title", "Session Expired")}
            </p>

            <p className="text-sm text-gray-300 px-4">
              {t(
                "sessionExpired.message",
                "The game session has ended. Please return to the dashboard to start a new session.",
              )}
            </p>

            {/* Action Button */}
            <div className="flex gap-4 mt-[20px] mb-[10px] justify-center w-full">
              <Button
                variant="primary"
                onClick={onConfirm}
                className="flex items-center justify-center px-[5px] py-[3px] font-semibold"
              >
                <span className="text-lg">
                  {t("sessionExpired.returnToLogin", "Return to Login Page")}
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
