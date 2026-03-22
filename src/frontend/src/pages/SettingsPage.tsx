import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronRight,
  Clock,
  Globe,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Palette,
  Sliders,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { ManageStorageSheet } from "../components/ManageStorageSheet";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";
import { SUPPORTED_LANGUAGES, useI18n } from "../i18n";
import {
  COMMON_TIMEZONES,
  formatAppDateTime,
  loadDateTimePrefs,
  saveDateTimePrefs,
} from "../utils/dateTimePrefs";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const PREF_KEY = "sp_app_prefs";

function loadPrefs(): Record<string, string | boolean> {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePref(key: string, value: string | boolean) {
  try {
    const prefs = loadPrefs();
    prefs[key] = value;
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function getPref<T>(key: string, fallback: T): T {
  const prefs = loadPrefs();
  return key in prefs ? (prefs[key] as T) : fallback;
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
}: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-6 pb-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function SettingsRow({
  label,
  sublabel,
  right,
  onClick,
  indent,
  disabled,
  ocid,
}: {
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  indent?: boolean;
  disabled?: boolean;
  ocid?: string;
}) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between border-b border-border/30 ${
        indent ? "pl-8 pr-4" : "px-4"
      } py-3.5 text-left transition-colors ${
        disabled
          ? "opacity-40 pointer-events-none"
          : "active:bg-white/5 hover:bg-white/5"
      }`}
      onClick={onClick}
      disabled={disabled}
      data-ocid={ocid}
    >
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        )}
      </div>
      {right}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { setPage } = useApp();
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const qc = useQueryClient();
  const { language, setLanguage } = useI18n();

  // ── Account fields ──────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarBlobId || "");
    }
  }, [profile]);

  // ── Notifications ────────────────────────────────────────────────────────
  const [notifPush, setNotifPush] = useState(() =>
    getPref<boolean>("notif_push", true),
  );
  const [notifVideos, setNotifVideos] = useState(() =>
    getPref<boolean>("notif_new_videos", true),
  );
  const [notifComments, setNotifComments] = useState(() =>
    getPref<boolean>("notif_comments", true),
  );
  const [notifUploads, setNotifUploads] = useState(() =>
    getPref<boolean>("notif_uploads", true),
  );

  // ── Appearance ───────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() =>
    getPref<boolean>("appearance_dark", true),
  );
  const [fontSize, setFontSize] = useState<"S" | "M" | "L">(() =>
    getPref<"S" | "M" | "L">("appearance_fontsize", "M"),
  );

  // Apply font size on mount
  useEffect(() => {
    const fsMap = { S: "small", M: "medium", L: "large" };
    document.documentElement.setAttribute("data-fontsize", fsMap[fontSize]);
  }, [fontSize]);

  // ── Language & Region ────────────────────────────────────────────────────
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">(() =>
    getPref<"12h" | "24h">("pref_time_format", "12h"),
  );
  const [dateFormat, setDateFormat] = useState<"A" | "B">(() =>
    getPref<"A" | "B">("pref_date_format", "A"),
  );
  const [dtTimezoneMode, setDtTimezoneMode] = useState<"auto" | "manual">(
    () => loadDateTimePrefs().timezoneMode,
  );
  const [dtManualTz, setDtManualTz] = useState<string>(
    () => loadDateTimePrefs().manualTimezone,
  );

  function saveDtPrefs(
    overrides: Partial<{
      timezoneMode: "auto" | "manual";
      manualTimezone: string;
      timeFormat: "12h" | "24h";
      dateFormat: "MDY" | "DMY";
    }> = {},
  ) {
    const current = loadDateTimePrefs();
    saveDateTimePrefs({
      ...current,
      ...overrides,
    });
  }

  // ── App Preferences ──────────────────────────────────────────────────────
  const [soundFx, setSoundFx] = useState(() =>
    getPref<boolean>("pref_sound_effects", true),
  );
  const [autoPlay, setAutoPlay] = useState(() =>
    getPref<boolean>("pref_autoplay", true),
  );
  const [captionsDefault, setCaptionsDefault] = useState(() =>
    getPref<boolean>("pref_captions_default", false),
  );

  // ── Storage sheet ────────────────────────────────────────────────────────
  const [storageOpen, setStorageOpen] = useState(false);

  // ── Feedback sheet ───────────────────────────────────────────────────────
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // ────────────────────────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────────────────────────

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !actor) return;
    setUploading(true);
    try {
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setAvatarUrl(url);
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to process avatar");
    } finally {
      setUploading(false);
    }
  }

  function handleSaveProfile() {
    saveProfile.mutate(
      { displayName, username, bio, avatarBlobId: avatarUrl },
      {
        onSuccess: () => toast.success("Profile saved"),
        onError: () => toast.error("Failed to save profile"),
      },
    );
  }

  function toggle(val: boolean, set: (v: boolean) => void, key: string) {
    set(val);
    savePref(key, val);
  }

  function handleFontSize(size: "S" | "M" | "L") {
    setFontSize(size);
    savePref("appearance_fontsize", size);
    const fsMap = { S: "small", M: "medium", L: "large" };
    document.documentElement.setAttribute("data-fontsize", fsMap[size]);
  }

  function handleTimeFormat(f: "12h" | "24h") {
    setTimeFormat(f);
    savePref("pref_time_format", f);
    saveDtPrefs({ timeFormat: f });
  }

  function handleDateFormat(f: "A" | "B") {
    setDateFormat(f);
    savePref("pref_date_format", f);
    saveDtPrefs({ dateFormat: f === "A" ? "MDY" : "DMY" });
  }

  function handleLogout() {
    clear();
    setPage("home");
    toast.success("Logged out");
  }

  const avatarSrc = avatarPreview || avatarUrl;
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const SegBtn = ({
    active,
    onClick,
    children,
    ocid,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ocid?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
        active
          ? "bg-primary text-primary-foreground font-semibold"
          : "bg-white/10 text-muted-foreground hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-background/95 backdrop-blur border-b border-border/30">
          <button
            type="button"
            onClick={() => setPage("menu")}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            data-ocid="settings.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight">Settings</h1>
        </div>

        {/* ── Account ────────────────────────────────────────────────────── */}
        <SectionHeader icon={User} label="Account" />
        <div className="mx-4 mb-1 rounded-xl bg-card border border-border/40 overflow-hidden">
          {!identity ? (
            <div
              className="px-4 py-6 text-center"
              data-ocid="settings.account.section"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Sign in to manage your profile
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => setPage("menu")}
              >
                Sign In
              </Button>
            </div>
          ) : profileLoading ? (
            <div
              className="px-4 py-6 flex justify-center"
              data-ocid="settings.account.loading_state"
            >
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div
              className="px-4 py-4 space-y-4"
              data-ocid="settings.account.section"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    {avatarSrc ? <AvatarImage src={avatarSrc} /> : null}
                    <AvatarFallback className="text-lg font-bold bg-primary/20 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg"
                    data-ocid="settings.account.upload_button"
                  >
                    {uploading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {displayName || "Set your name"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{username || "username"}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Display Name
                  </Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="bg-background/60"
                    data-ocid="settings.account.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Username
                  </Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                    className="bg-background/60"
                    data-ocid="settings.account.search_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Bio
                  </Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="About you..."
                    rows={3}
                    className="bg-background/60 resize-none"
                    data-ocid="settings.account.textarea"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending}
                data-ocid="settings.account.save_button"
              >
                {saveProfile.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {saveProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          )}
        </div>
        <SettingsRow
          label="Manage Linked Accounts"
          sublabel="Google, Apple and more"
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={() => toast.info("Coming soon")}
          ocid="settings.account.button"
        />

        {/* ── Notifications ───────────────────────────────────────────────── */}
        <SectionHeader icon={Bell} label="Notifications" />
        <SettingsRow
          label="Push Notifications"
          right={
            <Switch
              checked={notifPush}
              onCheckedChange={(v) => toggle(v, setNotifPush, "notif_push")}
              data-ocid="settings.notifications.switch"
            />
          }
          ocid="settings.notifications.toggle"
        />
        <SettingsRow
          label="New video alerts"
          indent
          disabled={!notifPush}
          right={
            <Switch
              checked={notifVideos}
              onCheckedChange={(v) =>
                toggle(v, setNotifVideos, "notif_new_videos")
              }
              disabled={!notifPush}
            />
          }
        />
        <SettingsRow
          label="Comments & replies"
          indent
          disabled={!notifPush}
          right={
            <Switch
              checked={notifComments}
              onCheckedChange={(v) =>
                toggle(v, setNotifComments, "notif_comments")
              }
              disabled={!notifPush}
            />
          }
        />
        <SettingsRow
          label="Upload status"
          indent
          disabled={!notifPush}
          right={
            <Switch
              checked={notifUploads}
              onCheckedChange={(v) =>
                toggle(v, setNotifUploads, "notif_uploads")
              }
              disabled={!notifPush}
            />
          }
        />

        {/* ── Appearance ──────────────────────────────────────────────────── */}
        <SectionHeader icon={Palette} label="Appearance" />
        <SettingsRow
          label="Dark Mode"
          sublabel="Default for SUB PREMIUM"
          right={
            <Switch
              checked={darkMode}
              onCheckedChange={(v) => toggle(v, setDarkMode, "appearance_dark")}
              data-ocid="settings.appearance.switch"
            />
          }
          ocid="settings.appearance.toggle"
        />
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">Font Size</p>
          <div className="flex gap-1.5">
            <SegBtn
              active={fontSize === "S"}
              onClick={() => handleFontSize("S")}
              ocid="settings.appearance.tab"
            >
              S
            </SegBtn>
            <SegBtn
              active={fontSize === "M"}
              onClick={() => handleFontSize("M")}
            >
              M
            </SegBtn>
            <SegBtn
              active={fontSize === "L"}
              onClick={() => handleFontSize("L")}
            >
              L
            </SegBtn>
          </div>
        </div>

        {/* ── Language & Region ────────────────────────────────────────────── */}
        <SectionHeader icon={Globe} label="Language & Region" />
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">App Language</p>
          <Select value={language} onValueChange={(v) => setLanguage(v)}>
            <SelectTrigger
              className="w-36 h-8 text-sm bg-background/60 border-border/50"
              data-ocid="settings.language.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Date & Time ──────────────────────────────────────────────────── */}
        <SectionHeader icon={Clock} label="Date & Time" />
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">Time Format</p>
          <div className="flex gap-1.5">
            <SegBtn
              active={timeFormat === "12h"}
              onClick={() => handleTimeFormat("12h")}
              ocid="settings.datetime.tab"
            >
              12h AM/PM
            </SegBtn>
            <SegBtn
              active={timeFormat === "24h"}
              onClick={() => handleTimeFormat("24h")}
            >
              24h
            </SegBtn>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">Date Format</p>
          <div className="flex gap-1.5">
            <SegBtn
              active={dateFormat === "A"}
              onClick={() => handleDateFormat("A")}
            >
              Mar 21
            </SegBtn>
            <SegBtn
              active={dateFormat === "B"}
              onClick={() => handleDateFormat("B")}
            >
              21 Mar
            </SegBtn>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">Timezone</p>
          <div className="flex gap-1.5">
            <SegBtn
              active={dtTimezoneMode === "auto"}
              onClick={() => {
                setDtTimezoneMode("auto");
                saveDtPrefs({ timezoneMode: "auto" });
              }}
              ocid="settings.datetime.toggle"
            >
              Auto
            </SegBtn>
            <SegBtn
              active={dtTimezoneMode === "manual"}
              onClick={() => {
                setDtTimezoneMode("manual");
                saveDtPrefs({ timezoneMode: "manual" });
              }}
            >
              Manual
            </SegBtn>
          </div>
        </div>
        {dtTimezoneMode === "auto" && (
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
            <p className="text-xs text-muted-foreground">Detected timezone</p>
            <span className="text-xs font-mono text-primary">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        )}
        {dtTimezoneMode === "manual" && (
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-2.5">
            <p className="text-xs text-muted-foreground mr-3">
              Select Timezone
            </p>
            <Select
              value={dtManualTz || "UTC"}
              onValueChange={(v) => {
                setDtManualTz(v);
                saveDtPrefs({ timezoneMode: "manual", manualTimezone: v });
              }}
            >
              <SelectTrigger
                className="w-48 h-8 text-xs bg-background/60 border-border/50"
                data-ocid="settings.datetime.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_TIMEZONES.map((tz) => (
                  <SelectItem
                    key={tz.value}
                    value={tz.value}
                    className="text-xs"
                  >
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-2.5">
          <p className="text-xs text-muted-foreground">Preview</p>
          <span className="text-xs text-primary font-mono">
            {formatAppDateTime(new Date(), loadDateTimePrefs())}
          </span>
        </div>

        {/* ── Privacy & Security ──────────────────────────────────────────── */}
        <SectionHeader icon={Lock} label="Privacy & Security" />
        <SettingsRow
          label="Change Password"
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={() => toast.info("Password management coming soon")}
          ocid="settings.privacy.button"
        />
        <SettingsRow
          label="Clear Cache"
          sublabel="Removes temporary data"
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={() => {
            qc.clear();
            toast.success("Cache cleared");
          }}
          ocid="settings.privacy.secondary_button"
        />
        <SettingsRow
          label="Manage Storage"
          sublabel="View usage & free space"
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={() => setStorageOpen(true)}
          ocid="settings.privacy.open_modal_button"
        />
        {identity && (
          <SettingsRow
            label="Logout"
            right={<LogOut className="h-4 w-4 text-destructive" />}
            onClick={handleLogout}
            ocid="settings.privacy.delete_button"
          />
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <SettingsRow
              label="Delete Account"
              right={<Trash2 className="h-4 w-4 text-destructive" />}
              ocid="settings.privacy.open_modal_button"
            />
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="settings.delete.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All your videos, playlists, and
                profile data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="settings.delete.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => toast.info("Account deletion requested")}
                data-ocid="settings.delete.confirm_button"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── Support & About ──────────────────────────────────────────────── */}
        <SectionHeader icon={HelpCircle} label="Support & About" />
        <div className="mx-4 mb-1 rounded-xl bg-card border border-border/40 overflow-hidden">
          <Accordion
            type="single"
            collapsible
            data-ocid="settings.support.panel"
          >
            <AccordionItem value="q1" className="border-b border-border/30">
              <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline">
                How do I upload a video?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3.5 text-sm text-muted-foreground">
                Tap the + button at the bottom to upload.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="border-b border-border/30">
              <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline">
                How do I change my username?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3.5 text-sm text-muted-foreground">
                Go to Account → edit your username → Save.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline">
                How do I delete my account?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3.5 text-sm text-muted-foreground">
                Go to Privacy & Security → Delete Account.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Sheet open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <SheetTrigger asChild>
            <SettingsRow
              label="Send Feedback"
              right={
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              }
              onClick={() => setFeedbackOpen(true)}
              ocid="settings.support.open_modal_button"
            />
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl"
            data-ocid="settings.feedback.sheet"
          >
            <SheetHeader className="mb-4">
              <SheetTitle>Send Feedback</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Tell us what you think..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                className="bg-background/60 resize-none"
                data-ocid="settings.feedback.textarea"
              />
              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={() => {
                  toast.success("Feedback sent — thank you!");
                  setFeedbackText("");
                  setFeedbackOpen(false);
                }}
                data-ocid="settings.feedback.submit_button"
              >
                Send
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3.5">
          <p className="text-sm text-foreground">Version</p>
          <span className="text-sm font-mono text-primary">v1.0.0</span>
        </div>

        {/* ── App Preferences ──────────────────────────────────────────────── */}
        <SectionHeader icon={Sliders} label="App Preferences" />
        <SettingsRow
          label="Sound Effects"
          right={
            <Switch
              checked={soundFx}
              onCheckedChange={(v) =>
                toggle(v, setSoundFx, "pref_sound_effects")
              }
              data-ocid="settings.prefs.switch"
            />
          }
          ocid="settings.prefs.toggle"
        />
        <SettingsRow
          label="Auto-play"
          sublabel="Automatically play next video"
          right={
            <Switch
              checked={autoPlay}
              onCheckedChange={(v) => toggle(v, setAutoPlay, "pref_autoplay")}
            />
          }
          ocid="settings.prefs.secondary_button"
        />
        <SettingsRow
          label="Captions Default ON"
          sublabel="Enable captions when videos load"
          right={
            <Switch
              checked={captionsDefault}
              onCheckedChange={(v) =>
                toggle(v, setCaptionsDefault, "pref_captions_default")
              }
            />
          }
          ocid="settings.prefs.checkbox"
        />

        {/* Footer */}
        <div className="px-4 py-8 text-center space-y-1">
          <p className="text-xs text-muted-foreground">© 2026 SUB PREMIUM</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>

      {/* Storage sheet */}
      <ManageStorageSheet open={storageOpen} onOpenChange={setStorageOpen} />
    </>
  );
}
