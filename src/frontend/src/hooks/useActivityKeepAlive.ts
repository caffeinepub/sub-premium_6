import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useActor } from "./useActor";

const HEARTBEAT_INTERVAL = 4 * 60 * 1000; // 4 minutes
const LAST_ACTIVE_INTERVAL = 60 * 1000; // 1 minute
const SESSION_STALE_THRESHOLD = 30 * 60 * 1000; // 30 minutes
const AUTO_RELOAD_DELAY = 5 * 1000; // 5 seconds
const MAX_CONSECUTIVE_FAILURES = 3;
const LAST_ACTIVE_KEY = "sub_premium_last_active";

export function useActivityKeepAlive() {
  const { actor } = useActor();
  const failureCountRef = useRef(0);
  const reloadScheduledRef = useRef(false);
  const actorRef = useRef(actor);

  // Keep actor ref current without re-running effects
  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  // Check session staleness on mount
  useEffect(() => {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      const elapsed = Date.now() - Number.parseInt(lastActive, 10);
      if (elapsed > SESSION_STALE_THRESHOLD) {
        // Soft reload to re-hydrate state
        window.location.reload();
        return;
      }
    }
    localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  }, []);

  useEffect(() => {
    const scheduleReload = () => {
      if (reloadScheduledRef.current) return;
      reloadScheduledRef.current = true;
      toast.loading("Reconnecting...", {
        id: "reconnecting",
        duration: AUTO_RELOAD_DELAY,
      });
      setTimeout(() => {
        window.location.reload();
      }, AUTO_RELOAD_DELAY);
    };

    const heartbeat = async () => {
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
      const a = actorRef.current;
      if (!a) return;
      try {
        await a.listAllVideos();
        failureCountRef.current = 0;
      } catch {
        failureCountRef.current += 1;
        if (failureCountRef.current >= MAX_CONSECUTIVE_FAILURES) {
          scheduleReload();
        }
      }
    };

    const updateLastActive = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        // Trigger a silent heartbeat when user returns to the tab
        heartbeat();
      }
    };

    const handleOnline = () => {
      failureCountRef.current = 0;
      reloadScheduledRef.current = false;
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    };

    const heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL);
    const lastActiveTimer = setInterval(updateLastActive, LAST_ACTIVE_INTERVAL);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(lastActiveTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
