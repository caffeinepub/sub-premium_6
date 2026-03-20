import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen } = useApp();
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent
        data-ocid="login.dialog"
        className="bg-popover border-border max-w-xs mx-auto"
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-orange flex items-center justify-center shadow-glow">
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path d="M6 4L18 11L6 18V4Z" fill="white" />
              </svg>
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome to <span className="text-orange">SUB PREMIUM</span>
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Sign in to upload, save, and access your profile
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Button
            data-ocid="login.primary_button"
            className="w-full bg-orange hover:bg-orange/90 text-white font-semibold"
            onClick={() => {
              login();
              setLoginModalOpen(false);
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In / Create Account"
            )}
          </Button>
          <Button
            data-ocid="login.cancel_button"
            variant="ghost"
            className="w-full"
            onClick={() => setLoginModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
