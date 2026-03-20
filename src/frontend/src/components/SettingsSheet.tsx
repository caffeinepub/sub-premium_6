import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSettings, useUpdateSettings } from "../hooks/useQueries";

export function SettingsSheet() {
  const { settingsOpen, setSettingsOpen } = useApp();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { clear, identity } = useInternetIdentity();
  const qc = useQueryClient();

  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (settings) {
      setDarkMode(settings.darkMode);
      setLanguage(settings.language);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({ darkMode, language });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handleClearCache = () => {
    qc.clear();
    toast.success("Cache cleared");
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
    setSettingsOpen(false);
    toast.success("Logged out");
  };

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent
        side="right"
        data-ocid="settings.sheet"
        className="bg-popover border-border w-80 p-0"
      >
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="text-base font-bold">Settings</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-full pb-20">
          {/* Display */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Display
            </p>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Dark Mode</Label>
              <Switch
                data-ocid="settings.switch"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-orange"
              />
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Language */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Audio & Language
            </p>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                data-ocid="settings.select"
                className="bg-surface2 border-border"
              >
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-border/60" />

          {/* Privacy */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Privacy
            </p>
            <Button
              data-ocid="settings.secondary_button"
              variant="outline"
              size="sm"
              className="w-full border-border bg-surface2 text-sm"
              onClick={handleClearCache}
            >
              <Trash2 size={14} className="mr-2" /> Clear Cache
            </Button>
          </div>

          <Separator className="bg-border/60" />

          {/* App Info */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              App Info
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-mono text-orange">1.0.0</span>
            </div>
          </div>

          {identity && (
            <>
              <Separator className="bg-border/60" />
              <div className="px-5 py-4 space-y-2">
                <Button
                  data-ocid="settings.save_button"
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                  onClick={handleSave}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
                <Button
                  data-ocid="settings.delete_button"
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
