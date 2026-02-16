"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Button from "@/app/components/ui/Button";
import { AlertTriangle } from "lucide-react";

function SessionErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage =
    searchParams.get("error") || "Invalid or expired session";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-2xl w-full text-center space-y-6 flex flex-col items-center">
        <AlertTriangle className="w-16 h-16 text-yellow-400" />
        <p className="text-gray-300 text-lg leading-relaxed">{errorMessage}</p>
        <Button
          variant="primary"
          onClick={() => router.push("/facilitator-login")}
          className="px-8 py-3 font-semibold"
        >
          Return to Login Page
        </Button>
      </div>
    </main>
  );
}

export default function SessionErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionErrorContent />
    </Suspense>
  );
}
