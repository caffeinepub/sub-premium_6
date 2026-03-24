import { d as createLucideIcon, O as useGetCaptionTracks, Q as useSetCaptionTrack, S as useRemoveCaptionTrack, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, T as Trash2, A as AnimatePresence, m as motion, U as Label, p as Button, e as ue } from "./index-DSOyFnVG.js";
import { P as Plus } from "./plus-ChHCscM6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "14", x: "3", y: "5", rx: "2", ry: "2", key: "12ruh7" }],
  ["path", { d: "M7 15h4M15 15h2M7 11h2M13 11h4", key: "1ueiar" }]
];
const Captions = createLucideIcon("captions", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
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
  { code: "hi", label: "हिन्दी" }
];
function CaptionManager({ videoId, onSaved }) {
  const { data: tracks = [], isLoading } = useGetCaptionTracks(videoId);
  const setTrack = useSetCaptionTrack();
  const removeTrack = useRemoveCaptionTrack();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [language, setLanguage] = reactExports.useState("en");
  const [vttContent, setVttContent] = reactExports.useState("");
  const [vttFileName, setVttFileName] = reactExports.useState("");
  const fileRef = reactExports.useRef(null);
  const selectedLang = LANGUAGES.find((l) => l.code === language);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setVttFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      setVttContent(((_a2 = ev.target) == null ? void 0 : _a2.result) ?? "");
    };
    reader.readAsText(file);
  };
  const handleSave = async () => {
    if (!vttContent.trim()) {
      ue.error("No VTT content to save");
      return;
    }
    const label = (selectedLang == null ? void 0 : selectedLang.label) ?? language;
    try {
      await setTrack.mutateAsync({
        videoId,
        language,
        captionLabel: label,
        vtt: vttContent
      });
      ue.success(`Caption track added: ${label}`);
      onSaved == null ? void 0 : onSaved();
      setFormOpen(false);
      setVttContent("");
      setVttFileName("");
    } catch {
      ue.error("Failed to save caption track");
    }
  };
  const handleRemove = async (lang) => {
    try {
      await removeTrack.mutateAsync({ videoId, language: lang });
      ue.success("Caption track removed");
    } catch {
      ue.error("Failed to remove caption track");
    }
  };
  const resetForm = () => {
    setFormOpen(false);
    setVttContent("");
    setVttFileName("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "captions.panel",
      className: "rounded-xl border border-orange/30 bg-card/60 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border/40 bg-orange/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15, className: "text-orange" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
              "Caption Tracks",
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 12,
                  className: "inline ml-2 animate-spin text-muted-foreground"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs text-muted-foreground font-normal", children: [
                "(",
                tracks.length,
                " track",
                tracks.length !== 1 ? "s" : "",
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "captions.open_modal_button",
              onClick: () => setFormOpen((p) => !p),
              className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
                "Add Track"
              ]
            }
          )
        ] }),
        tracks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/30", children: tracks.map((track) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "captions.row",
            className: "flex items-center justify-between px-4 py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-orange/15 text-orange text-[10px] font-bold uppercase tracking-wide", children: track.language }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: track.captionLabel })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "captions.delete_button",
                  onClick: () => handleRemove(track.language),
                  disabled: removeTrack.isPending,
                  className: "p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40",
                  "aria-label": `Remove ${track.captionLabel} track`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ]
          },
          track.language
        )) }),
        tracks.length === 0 && !formOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No caption tracks yet. Add one to improve accessibility and reach." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: formOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 px-4 py-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block", children: "Language" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: LANGUAGES.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setLanguage(lang.code),
                    className: `px-3 py-1 rounded-full text-xs font-semibold transition-all border ${language === lang.code ? "bg-orange text-white border-orange shadow-sm" : "bg-surface2/60 text-muted-foreground border-border/50 hover:border-orange/50 hover:text-foreground"}`,
                    children: lang.label
                  },
                  lang.code
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "captions.upload_button",
                    onClick: () => {
                      var _a;
                      return (_a = fileRef.current) == null ? void 0 : _a.click();
                    },
                    className: "w-full border border-dashed border-border hover:border-orange/50 rounded-xl p-4 flex items-center gap-3 transition-colors text-left",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FileText,
                        {
                          size: 18,
                          className: "text-muted-foreground flex-shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate", children: vttFileName || "Tap to select .vtt file" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileRef,
                    type: "file",
                    accept: ".vtt,text/vtt",
                    className: "hidden",
                    onChange: handleFileChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    "data-ocid": "captions.cancel_button",
                    onClick: resetForm,
                    className: "flex-1 text-xs",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    "data-ocid": "captions.save_button",
                    onClick: handleSave,
                    disabled: setTrack.isPending || !vttContent.trim(),
                    className: "flex-1 text-xs bg-orange hover:bg-orange/90 text-white border-none",
                    children: [
                      setTrack.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1" }) : null,
                      setTrack.isPending ? "Saving..." : "Save Track"
                    ]
                  }
                )
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  Captions as C,
  CaptionManager as a
};
