import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string;

interface NotifyMeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotifyMe: React.FC<NotifyMeProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        mode: "no-cors",
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {status !== "success" ? (
          <div className="text-center">
            <div className="flex items-center justify-center mb-5">
              <img src="/images/cloud_ios.webp" alt="" className="w-16 h-16" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Calmisu for iOS is coming soon
            </h2>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Leave your email below and we'll be the first to notify you when
              Calmisu launches on the App Store.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-slate-700 placeholder-slate-400"
                />
                {status === "error" && (
                  <p className="text-red-500 text-xs mt-2 text-left">
                    {errorMessage}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-black text-white font-medium py-3.5 rounded-2xl hover:bg-slate-800 transition flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{status === "loading" ? "Sending..." : "Notify Me"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 text-green-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">You're on the list!</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Keep an eye on your inbox. We'll reach out as soon as the iOS app
              is ready.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-2xl hover:bg-slate-200 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
