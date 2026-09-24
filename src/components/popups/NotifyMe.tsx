import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { track } from "@/lib/analytics";
import { postLead } from "@/lib/api";
import { CheckIcon } from "@/components/ui/icons";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Submitting this form is the opt-in: the modal does one thing, and the
      // line under the button says what is stored and what it is used for.
      await postLead({
        email,
        source: "ios_waitlist",
        locale: "en",
        consent: true,
      });
      track("waitlist_submit", { platform: "ios" });
      setStatus("success");
    } catch (err) {
      track("waitlist_error", { platform: "ios" });
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleClose = () => {
    setEmail("");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogPrimitive.Close>

          {status !== "success" ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-5">
                <img src="/images/cloud_ios.webp" alt="" width={64} height={64} className="w-16 h-16" />
              </div>

              <DialogTitle className="text-2xl font-display font-normal mb-2 text-center">
                Calmisu for iOS is coming soon
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mb-6 text-sm leading-relaxed text-center">
                Leave your email below and we'll be the first to notify you when
                Calmisu launches on the App Store.
              </DialogDescription>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="notify-me-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="notify-me-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "notify-me-email-error" : undefined}
                    className="w-full px-5 py-3.5 bg-background border border-control-border rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-brand transition text-foreground placeholder-muted-foreground"
                  />
                  {status === "error" && (
                    <p
                      id="notify-me-email-error"
                      role="alert"
                      className="text-destructive-text text-sm mt-2 text-left"
                    >
                      {errorMessage}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-black text-white font-medium py-3.5 rounded-2xl hover:bg-black/80 transition flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{status === "loading" ? "Sending..." : "Notify Me"}</span>
                </button>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  We store your email to tell you once Calmisu is on the App
                  Store. Nothing else. Unsubscribe in one click. See our{" "}
                  <a
                    href="/en/privacy-policy/"
                    className="underline hover:text-foreground transition-colors"
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5 text-brand-dark">
                <CheckIcon className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-display font-normal mb-2 text-center">
                You're on the list!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mb-6 text-sm text-center">
                Keep an eye on your inbox. We'll reach out as soon as the iOS app
                is ready.
              </DialogDescription>
              <button
                onClick={handleClose}
                className="w-full bg-muted text-foreground font-medium py-3 rounded-2xl hover:bg-muted/80 transition"
              >
                Done
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};
