import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Info, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetCaptionTracks,
  useRemoveCaptionTrack,
  useSetCaptionTrack,
} from "../hooks/useQueries";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
];

function padTime(n: number, dec = false): string {
  if (dec) {
    const ms = Math.round((n % 1) * 1000);
    const secs = Math.floor(n);
    const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
    const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const ss = String(secs % 60).padStart(2, "0");
    const msStr = String(ms).padStart(3, "0");
    return `${hh}:${mm}:${ss}.${msStr}`;
  }
  return String(Math.floor(n)).padStart(2, "0");
}

export function transcriptToVtt(text: string, durationMinutes: number): string {
  // Split on explicit timestamps like "0:30" or "1:05" if present
  const timestampPattern = /((?:\d+:)?\d+:\d+)\s/g;
  const hasTimestamps = timestampPattern.test(text);

  if (hasTimestamps) {
    // Parse timestamp-based transcript
    const lines = text.trim().split("\n").filter(Boolean);
    const segments: { start: number; text: string }[] = [];

    for (const line of lines) {
      const match = line.match(/^((?:\d+:)?\d+:\d+)\s+(.*)/);
      if (match) {
        const timeParts = match[1].split(":").map(Number);
        let secs = 0;
        if (timeParts.length === 3)
          secs = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        else if (timeParts.length === 2)
          secs = timeParts[0] * 60 + timeParts[1];
        segments.push({ start: secs, text: match[2] });
      } else if (segments.length > 0) {
        segments[segments.length - 1].text += ` ${line}`;
      }
    }

    if (segments.length > 0) {
      const vttLines = ["WEBVTT", ""];
      segments.forEach((seg, i) => {
        const end =
          i < segments.length - 1
            ? segments[i + 1].start - 0.1
            : seg.start + 3.5;
        vttLines.push(`${padTime(seg.start, true)} --> ${padTime(end, true)}`);
        vttLines.push(seg.text);
        vttLines.push("");
      });
      return vttLines.join("\n");
    }
  }

  // Fallback: word-based even distribution
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "WEBVTT\n";

  const chunkSize = 8;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  const totalSeconds = durationMinutes * 60;
  const secsPerChunk = totalSeconds / chunks.length;
  const captionDuration = Math.min(secsPerChunk, 3.5);

  const lines = ["WEBVTT", ""];
  chunks.forEach((chunk, idx) => {
    const start = idx * secsPerChunk;
    const end = start + captionDuration;
    lines.push(`${padTime(start, true)} --> ${padTime(end, true)}`);
    lines.push(chunk);
    lines.push("");
  });

  return lines.join("\n");
}

export function parseVttCaptions(
  vtt: string,
): { start: number; end: number; text: string }[] {
  const captions: { start: number; end: number; text: string }[] = [];
  const lines = vtt.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes(" --> ")) {
      const [startStr, endStr] = line.split(" --> ");
      const parseTime = (t: string) => {
        const parts = t.trim().replace(",", ".").split(":");
        let s = 0;
        if (parts.length === 3)
          s =
            Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
        else if (parts.length === 2)
          s = Number(parts[0]) * 60 + Number(parts[1]);
        return s;
      };
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i].trim());
        i++;
      }
      captions.push({
        start: parseTime(startStr),
        end: parseTime(endStr),
        text: textLines.join(" "),
      });
    } else {
      i++;
    }
  }
  return captions;
}

interface Props {
  videoId: string;
  onSaved?: () => void;
}

export function CaptionManager({ videoId, onSaved }: Props) {
  const { data: tracks = [], isLoading } = useGetCaptionTracks(videoId);
  const setTrack = useSetCaptionTrack();
  const removeTrack = useRemoveCaptionTrack();

  const [formOpen, setFormOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [vttContent, setVttContent] = useState("");
  const [vttFileName, setVttFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedLang = LANGUAGES.find((l) => l.code === language);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVttFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setVttContent((ev.target?.result as string) ?? "");
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!vttContent.trim()) {
      toast.error("No VTT content to save");
      return;
    }
    const label = selectedLang?.label ?? language;
    try {
      await setTrack.mutateAsync({
        videoId,
        language,
        captionLabel: label,
        vtt: vttContent,
      });
      toast.success(`Caption track added: ${label}`);
      onSaved?.();
      setFormOpen(false);
      setVttContent("");
      setVttFileName("");
    } catch {
      toast.error("Failed to save caption track");
    }
  };

  const handleRemove = async (lang: string) => {
    try {
      await removeTrack.mutateAsync({ videoId, language: lang });
      toast.success("Caption track removed");
    } catch {
      toast.error("Failed to remove caption track");
    }
  };

  const resetForm = () => {
    setFormOpen(false);
    setVttContent("");
    setVttFileName("");
  };

  return (
    <div
      data-ocid="captions.panel"
      className="rounded-xl border border-orange/30 bg-card/60 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-orange/5">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-orange" />
          <span className="text-sm font-semibold">
            Caption Tracks
            {isLoading ? (
              <Loader2
                size={12}
                className="inline ml-2 animate-spin text-muted-foreground"
              />
            ) : (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                ({tracks.length} track{tracks.length !== 1 ? "s" : ""})
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          data-ocid="captions.open_modal_button"
          onClick={() => setFormOpen((p) => !p)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-colors"
        >
          <Plus size={13} />
          Add Track
        </button>
      </div>

      {/* Existing tracks */}
      {tracks.length > 0 && (
        <div className="divide-y divide-border/30">
          {tracks.map((track) => (
            <div
              key={track.language}
              data-ocid="captions.row"
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-orange/15 text-orange text-[10px] font-bold uppercase tracking-wide">
                  {track.language}
                </span>
                <p className="text-sm font-medium text-foreground">
                  {track.captionLabel}
                </p>
              </div>
              <button
                type="button"
                data-ocid="captions.delete_button"
                onClick={() => handleRemove(track.language)}
                disabled={removeTrack.isPending}
                className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                aria-label={`Remove ${track.captionLabel} track`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tracks.length === 0 && !formOpen && (
        <div className="px-4 py-5 text-center">
          <p className="text-sm text-muted-foreground">
            No caption tracks yet. Add one to improve accessibility and reach.
          </p>
        </div>
      )}

      {/* Add track form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-4 py-4 space-y-4">
              {/* Language chips */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Language
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        language === lang.code
                          ? "bg-orange text-white border-orange shadow-sm"
                          : "bg-surface2/60 text-muted-foreground border-border/50 hover:border-orange/50 hover:text-foreground"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload VTT */}
              <div className="mt-3">
                <button
                  type="button"
                  data-ocid="captions.upload_button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-border hover:border-orange/50 rounded-xl p-4 flex items-center gap-3 transition-colors text-left"
                >
                  <FileText
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {vttFileName || "Tap to select .vtt file"}
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".vtt,text/vtt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  data-ocid="captions.cancel_button"
                  onClick={resetForm}
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  data-ocid="captions.save_button"
                  onClick={handleSave}
                  disabled={setTrack.isPending || !vttContent.trim()}
                  className="flex-1 text-xs bg-orange hover:bg-orange/90 text-white border-none"
                >
                  {setTrack.isPending ? (
                    <Loader2 size={13} className="animate-spin mr-1" />
                  ) : null}
                  {setTrack.isPending ? "Saving..." : "Save Track"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
