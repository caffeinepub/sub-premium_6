import { d as createLucideIcon, j as jsxRuntimeExports, a_ as Slot, c as cn, a$ as cva, r as reactExports, au as useDirection, al as useControllableState, ak as createContextScope, am as useId, an as Primitive, b0 as createRovingFocusGroupScope, b1 as Root$1, b2 as Item, ao as composeEventHandlers, ap as Presence, k as useActor, aw as useQueryClient, a2 as AlertDialog, a4 as AlertDialogContent, a5 as AlertDialogHeader, a6 as AlertDialogTitle, a7 as AlertDialogDescription, a8 as AlertDialogFooter, a9 as AlertDialogCancel, aa as AlertDialogAction, e as ue, aI as Sheet, aK as SheetContent, aL as SheetHeader, aM as SheetTitle, U as Label, I as Input, b3 as SheetFooter, p as Button, L as LoaderCircle, ab as ExternalBlob, R as RefreshCw, b4 as DropdownMenu, b5 as DropdownMenuTrigger, b6 as DropdownMenuContent, b7 as DropdownMenuItem, T as Trash2, u as useApp, g as useInternetIdentity, b8 as usePublicProfile, b9 as useVideosByCreator, ba as useSubscriberCount, bb as useIsSubscribed, bc as useSubscribe, bd as useUnsubscribe, m as motion, F as Avatar, G as AvatarImage, H as AvatarFallback, a0 as Settings, ac as Check, V as useUserProfile, b as useListVideos, Z as useQuery, a1 as CreatorTier } from "./index-DSOyFnVG.js";
import { g as getPlaylists, r as removeVideoFromPlaylist } from "./playlists-BxogQr83.js";
import { S as Share2 } from "./share-2-stuau9JC.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { L as ListVideo } from "./list-video-DbPyzDI5.js";
import { B as BadgeCheck, S as ShieldCheck } from "./shield-check-DbhD4JdR.js";
import { I as Infinity } from "./infinity-ClZeehc0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root$1,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function DeleteVideoDialog({
  video,
  open,
  onClose
}) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [deleting, setDeleting] = reactExports.useState(false);
  const handleDelete = async () => {
    if (!actor || !video) return;
    setDeleting(true);
    try {
      await actor.deleteVideo(video.id);
      const playlists = getPlaylists();
      for (const pl of playlists) {
        removeVideoFromPlaylist(pl.id, video.id);
      }
      try {
        const hist = JSON.parse(
          localStorage.getItem("sub_watch_history") ?? "[]"
        );
        const filtered = hist.filter((h) => h.videoId !== video.id);
        localStorage.setItem("sub_watch_history", JSON.stringify(filtered));
      } catch {
      }
      await qc.invalidateQueries({ queryKey: ["videos"] });
      ue.success("Video deleted");
      onClose();
    } catch (err) {
      console.error(err);
      ue.error("Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      "data-ocid": "channel.dialog",
      className: "bg-[#1a1a1a] border-border/40 mx-4 rounded-2xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-white", children: "Delete Video?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground text-sm", children: [
            "Delete “",
            video == null ? void 0 : video.title,
            "”? This will remove it from your channel, playlists, and history."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-row gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              "data-ocid": "channel.cancel_button",
              className: "flex-1 border-border/40 bg-transparent text-white",
              disabled: deleting,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              "data-ocid": "channel.confirm_button",
              onClick: handleDelete,
              disabled: deleting,
              className: "flex-1 bg-destructive hover:bg-destructive/90 text-white",
              children: deleting ? "Deleting..." : "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function EditVideoSheet({ video, open, onClose }) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [thumbFile, setThumbFile] = reactExports.useState(null);
  const [thumbPreview, setThumbPreview] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a, _b;
    if (video) {
      setTitle(video.title);
      setThumbFile(null);
      setThumbPreview(((_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) ?? null);
    }
  }, [video]);
  const handleThumbChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };
  const handleSave = async () => {
    if (!actor || !video) return;
    if (!title.trim()) {
      ue.error("Title cannot be empty");
      return;
    }
    setSaving(true);
    try {
      let thumbnailBlob = video.thumbnailBlob;
      if (thumbFile) {
        const bytes = new Uint8Array(await thumbFile.arrayBuffer());
        thumbnailBlob = ExternalBlob.fromBytes(bytes);
      }
      await actor.updateVideoMetadata(video.id, title.trim(), thumbnailBlob);
      await qc.invalidateQueries({ queryKey: ["videos"] });
      ue.success("Video updated");
      onClose();
    } catch (err) {
      console.error(err);
      ue.error("Failed to update video");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      "data-ocid": "channel.sheet",
      side: "bottom",
      className: "bg-[#1a1a1a] border-t border-border/40 rounded-t-2xl px-4 pb-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-white text-base font-bold", children: "Edit Video" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "edit-title",
                className: "text-xs text-muted-foreground",
                children: "Title"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-title",
                "data-ocid": "channel.input",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "bg-[#121212] border-border/40 text-white",
                maxLength: 200
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Thumbnail (optional)" }),
            thumbPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbPreview,
                alt: "Thumbnail preview",
                className: "w-full aspect-video rounded-lg object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "channel.upload_button",
                onClick: () => {
                  var _a;
                  return (_a = fileRef.current) == null ? void 0 : _a.click();
                },
                className: "w-full py-2.5 rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground hover:border-orange/50 hover:text-orange transition-colors",
                children: thumbFile ? thumbFile.name : "Choose new thumbnail"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleThumbChange
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "mt-6 flex-row gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "channel.cancel_button",
              variant: "outline",
              className: "flex-1 border-border/40",
              onClick: onClose,
              disabled: saving,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "channel.save_button",
              className: "flex-1 bg-orange hover:bg-orange/90 text-white",
              onClick: handleSave,
              disabled: saving,
              children: [
                saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
                saving ? "Saving..." : "Save"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
const MAX_SIZE = 2 * 1024 * 1024 * 1024;
const MAX_DURATION = 2 * 60 * 60;
function ReuploadSheet({ video, open, onClose }) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const fileRef = reactExports.useRef(null);
  const [file, setFile] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [uploading, setUploading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleFileChange = async (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!f) return;
    setError(null);
    if (f.size > MAX_SIZE) {
      setError("File too large — max 2GB");
      return;
    }
    const dur = await new Promise((resolve) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => resolve(el.duration);
      el.onerror = () => resolve(0);
      el.src = URL.createObjectURL(f);
    });
    if (dur > MAX_DURATION) {
      setError("Video too long — max 2 hours");
      return;
    }
    setFile(f);
  };
  const handleReupload = async () => {
    if (!actor || !video || !file) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const videoBytes = new Uint8Array(await file.arrayBuffer());
      const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
        (pct) => {
          setProgress(Math.round(pct * 0.9));
        }
      );
      await actor.uploadVideo(
        video.id,
        video.title,
        videoBlob,
        video.thumbnailBlob,
        video.description
      );
      setProgress(95);
      const qualities = ["480p", "720p", "1080p"];
      for (const q of qualities) {
        await actor.updateVideoQuality(video.id, q);
        await new Promise((r) => setTimeout(r, 3e3));
      }
      setProgress(100);
      await qc.invalidateQueries({ queryKey: ["videos"] });
      ue.success("Video replaced successfully");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };
  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setProgress(0);
    setError(null);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      "data-ocid": "channel.sheet",
      side: "bottom",
      className: "bg-[#1a1a1a] border-t border-border/40 rounded-t-2xl px-4 pb-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "text-white text-base font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, className: "text-orange" }),
          "Re-upload Video"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Replace the video file for “",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: video == null ? void 0 : video.title }),
            "”. Title and metadata will be kept."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "channel.upload_button",
              onClick: () => {
                var _a;
                return (_a = fileRef.current) == null ? void 0 : _a.click();
              },
              disabled: uploading,
              className: "w-full py-6 rounded-xl border-2 border-dashed border-border/40 hover:border-orange/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-orange disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 22 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: file ? file.name : "Choose video file" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "MP4, WebM, MOV — max 2GB, 2 hours" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: "video/mp4,video/webm,video/quicktime",
              className: "hidden",
              onChange: handleFileChange
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "channel.error_state",
              className: "text-sm text-destructive",
              children: error
            }
          ),
          uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "channel.loading_state", className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: progress < 90 ? "Uploading..." : progress < 100 ? "Processing quality levels..." : "Complete!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "channel.cancel_button",
                variant: "outline",
                className: "flex-1 border-border/40",
                onClick: handleClose,
                disabled: uploading,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "channel.confirm_button",
                className: "flex-1 bg-orange hover:bg-orange/90 text-white",
                onClick: handleReupload,
                disabled: !file || uploading,
                children: uploading ? `${progress}%` : "Start Re-upload"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function formatDuration(seconds) {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function VideoChannelCard({
  video,
  index,
  onEdit,
  onDelete,
  onReupload,
  onClick,
  duration
}) {
  var _a, _b;
  const thumbUrl = (_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
  const isProcessing = video.status === "processing" || video.status === "uploading";
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `channel.item.${index}`,
      className: "rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute inset-0 w-full h-full",
              onClick: () => onClick(video),
              "aria-label": `Play ${video.title}`,
              children: thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: thumbUrl,
                  alt: video.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-[#1a1a1a] to-orange/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  "aria-hidden": "true",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4L20 12L6 20V4Z", fill: "oklch(0.68 0.18 35 / 0.5)" })
                }
              ) })
            }
          ),
          duration != null && duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded pointer-events-none", children: formatDuration(duration) }),
          isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/80 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse", children: "Processing..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 right-1.5 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `channel.dropdown_menu.${index}`,
                className: "p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors",
                "aria-label": "Video options",
                onClick: (e) => e.stopPropagation(),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 14, className: "text-white" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuContent,
              {
                align: "end",
                className: "w-44 bg-[#1a1a1a] border-border/40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      "data-ocid": `channel.edit_button.${index}`,
                      onClick: () => onEdit(video),
                      className: "gap-2 text-sm cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 }),
                        "Edit video"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      "data-ocid": `channel.delete_button.${index}`,
                      onClick: () => onDelete(video),
                      className: "gap-2 text-sm cursor-pointer text-destructive focus:text-destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
                        "Delete"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      "data-ocid": `channel.secondary_button.${index}`,
                      onClick: () => onReupload(video),
                      className: "gap-2 text-sm cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }),
                        "Re-upload"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: handleShare,
                      className: "gap-2 text-sm cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 13 }),
                        "Share"
                      ]
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium line-clamp-2 text-white/90 leading-snug", children: video.title }) })
      ]
    }
  );
}
const durationCache = /* @__PURE__ */ new Map();
function useVideoDurations(videos) {
  const [durations, setDurations] = reactExports.useState(
    /* @__PURE__ */ new Map()
  );
  const loadingRef = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    var _a, _b;
    if (videos.length === 0) return;
    let cancelled = false;
    const toLoad = videos.filter((v) => {
      var _a2, _b2;
      const url = (_b2 = (_a2 = v.videoBlob) == null ? void 0 : _a2.getDirectURL) == null ? void 0 : _b2.call(_a2);
      return url && !durationCache.has(v.id) && !loadingRef.current.has(v.id);
    });
    for (const video of toLoad) {
      const url = (_b = (_a = video.videoBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
      if (!url) continue;
      loadingRef.current.add(video.id);
      const el = document.createElement("video");
      el.preload = "metadata";
      el.muted = true;
      el.onloadedmetadata = () => {
        const d = Number.isFinite(el.duration) ? el.duration : null;
        durationCache.set(video.id, d);
        loadingRef.current.delete(video.id);
        el.src = "";
        if (!cancelled) setDurations(new Map(durationCache));
      };
      el.onerror = () => {
        durationCache.set(video.id, null);
        loadingRef.current.delete(video.id);
        el.src = "";
        if (!cancelled) setDurations(new Map(durationCache));
      };
      el.src = url;
    }
    return () => {
      cancelled = true;
    };
  }, [videos]);
  return durations;
}
function formatSubscriberCount(count) {
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
  return `${count}`;
}
function OwnChannelView() {
  const { setPage, setSelectedVideo } = useApp();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: allVideos = [] } = useListVideos();
  const [playlists, setPlaylists] = reactExports.useState([]);
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? null;
  const { data: subCount = 0 } = useSubscriberCount(myPrincipal);
  const [editVideo, setEditVideo] = reactExports.useState(null);
  const [deleteVideo, setDeleteVideo] = reactExports.useState(null);
  const [reuploadVideo, setReuploadVideo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setPlaylists(
      getPlaylists().filter(
        (p) => p.videoIds.length > 0 || p.id === "watch_later"
      )
    );
  }, []);
  const myVideos = allVideos.filter((v) => v.creatorId === (identity == null ? void 0 : identity.getPrincipal().toString())).sort((a, b) => Number(b.uploadTime - a.uploadTime));
  const durations = useVideoDurations(myVideos);
  const { data: creatorStats } = useQuery({
    queryKey: ["creatorStats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCreatorStats();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity,
    staleTime: 6e4
  });
  const displayName = (profile == null ? void 0 : profile.displayName) || "Your Name";
  const username = (profile == null ? void 0 : profile.username) || "username";
  const avatarSrc = (profile == null ? void 0 : profile.avatarBlobId) || "";
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPage("player");
  };
  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.22 },
      className: "flex flex-col pb-20 min-h-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "channel.close_button",
              onClick: () => setPage("menu"),
              className: "p-1.5 rounded-full hover:bg-accent transition-colors",
              "aria-label": "Back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base", children: "My Channel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 flex flex-col items-center gap-3 bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-20 h-20 border-2 border-orange", children: [
            avatarSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-surface2 text-xl font-bold text-orange", children: avatarInitials })
          ] }),
          profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-28 rounded bg-surface2 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-20 rounded bg-surface2 animate-pulse" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-lg leading-tight", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "@",
              username
            ] }),
            (creatorStats == null ? void 0 : creatorStats.tier) === CreatorTier.verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 13, className: "text-blue-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-blue-400", children: "Verified Creator" })
            ] }),
            (creatorStats == null ? void 0 : creatorStats.tier) === CreatorTier.active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-orange" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-orange", children: "Active Creator" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "border-orange/40 text-orange/80 text-[10px] px-2 py-0 h-5 gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Infinity, { size: 10 }),
                  "Unlimited uploads"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                formatSubscriberCount(subCount),
                " subscriber",
                subCount !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "channel.secondary_button",
                onClick: () => setPage("menu"),
                className: "mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-orange text-orange hover:bg-orange/10 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 12 }),
                  "Manage Channel"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "videos", className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              "data-ocid": "channel.tab",
              className: "w-full rounded-none bg-background border-b border-border/40 h-10 px-4 gap-0 justify-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "videos",
                    className: "text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent",
                    children: [
                      "Videos (",
                      myVideos.length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "playlists",
                    className: "text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent",
                    children: [
                      "Playlists (",
                      playlists.length,
                      ")"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "videos", className: "mt-0", children: myVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "channel.empty_state",
              className: "flex flex-col items-center gap-3 py-16 text-center px-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    "aria-hidden": "true",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 3L17 10L5 17V3Z", fill: "oklch(0.68 0.18 35)" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No videos uploaded yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "channel.list",
              className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3",
              children: myVideos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                VideoChannelCard,
                {
                  video,
                  index: i + 1,
                  duration: durations.get(video.id),
                  onEdit: setEditVideo,
                  onDelete: setDeleteVideo,
                  onReupload: setReuploadVideo,
                  onClick: handleVideoClick
                },
                video.id
              ))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "playlists", className: "mt-0", children: playlists.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "channel.empty_state",
              className: "flex flex-col items-center gap-3 py-16 text-center px-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { size: 22, className: "text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No playlists yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "channel.list",
              className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3",
              children: playlists.map((playlist, i) => {
                var _a, _b;
                const firstVideoId = playlist.videoIds[0];
                const firstVideo = firstVideoId ? videoMap.get(firstVideoId) : void 0;
                const thumbUrl = (_b = (_a = firstVideo == null ? void 0 : firstVideo.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `channel.item.${i + 1}`,
                    className: "rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer text-left group",
                    onClick: () => setPage("menu"),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
                        thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: thumbUrl,
                            alt: playlist.title,
                            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-[#1a1a1a] to-orange/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { size: 24, className: "text-orange/50" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded", children: [
                          playlist.videoIds.length,
                          " video",
                          playlist.videoIds.length !== 1 ? "s" : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium line-clamp-2 text-white/90 leading-snug", children: playlist.title }) })
                    ]
                  },
                  playlist.id
                );
              })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditVideoSheet,
          {
            video: editVideo,
            open: !!editVideo,
            onClose: () => setEditVideo(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteVideoDialog,
          {
            video: deleteVideo,
            open: !!deleteVideo,
            onClose: () => setDeleteVideo(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReuploadSheet,
          {
            video: reuploadVideo,
            open: !!reuploadVideo,
            onClose: () => setReuploadVideo(null)
          }
        )
      ]
    }
  );
}
function PublicChannelView({ creatorId }) {
  const { setPage, setSelectedVideo, setChannelCreatorId, setLoginModalOpen } = useApp();
  const { identity } = useInternetIdentity();
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? null;
  const isOwn = myPrincipal === creatorId;
  const { data: profile, isLoading: profileLoading } = usePublicProfile(creatorId);
  const { data: videos = [], isLoading: videosLoading } = useVideosByCreator(creatorId);
  const { data: subCountRaw = 0 } = useSubscriberCount(creatorId);
  const { data: subscribedRaw = false } = useIsSubscribed(creatorId);
  const subscribeMut = useSubscribe();
  const unsubscribeMut = useUnsubscribe();
  const [optimisticSubscribed, setOptimisticSubscribed] = reactExports.useState(null);
  const [optimisticCount, setOptimisticCount] = reactExports.useState(null);
  const subscribed = optimisticSubscribed !== null ? optimisticSubscribed : subscribedRaw;
  const subCount = optimisticCount !== null ? optimisticCount : subCountRaw;
  const durations = useVideoDurations(videos);
  const displayName = (profile == null ? void 0 : profile.displayName) || "Creator";
  const username = (profile == null ? void 0 : profile.username) || "unknown";
  const avatarSrc = (profile == null ? void 0 : profile.avatarBlobId) || "";
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPage("player");
  };
  const handleSubscribeToggle = () => {
    if (!identity) {
      setLoginModalOpen(true);
      return;
    }
    if (subscribed) {
      setOptimisticSubscribed(false);
      setOptimisticCount(Math.max(0, subCount - 1));
      unsubscribeMut.mutate(creatorId, {
        onError: () => {
          setOptimisticSubscribed(null);
          setOptimisticCount(null);
        }
      });
      ue(`Unsubscribed from ${displayName}`);
    } else {
      setOptimisticSubscribed(true);
      setOptimisticCount(subCount + 1);
      subscribeMut.mutate(creatorId, {
        onError: () => {
          setOptimisticSubscribed(null);
          setOptimisticCount(null);
        }
      });
      ue.success(`Subscribed to ${displayName}`);
    }
  };
  const handleManageChannel = () => {
    setChannelCreatorId(null);
    setPage("channel");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.22 },
      className: "flex flex-col pb-20 min-h-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "channel.close_button",
              onClick: () => {
                setChannelCreatorId(null);
                setPage("home");
              },
              className: "p-1.5 rounded-full hover:bg-accent transition-colors",
              "aria-label": "Back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base line-clamp-1", children: profileLoading ? "Channel" : displayName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 flex flex-col items-center gap-3 bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-20 h-20 border-2 border-orange", children: [
            avatarSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-surface2 text-xl font-bold text-orange", children: avatarInitials })
          ] }),
          profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-28 rounded bg-surface2 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-20 rounded bg-surface2 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-16 rounded bg-surface2 animate-pulse" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-lg leading-tight", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "@",
              username
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                formatSubscriberCount(subCount),
                " subscriber",
                subCount !== 1 ? "s" : ""
              ] })
            ] }),
            isOwn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "channel.secondary_button",
                onClick: handleManageChannel,
                className: "mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-orange text-orange hover:bg-orange/10 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 12 }),
                  "Manage Channel"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "channel.toggle",
                onClick: handleSubscribeToggle,
                className: `mt-3 flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${subscribed ? "bg-orange text-white" : "border border-border text-foreground hover:bg-surface2"}`,
                children: subscribed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                  " Subscribed"
                ] }) : "Subscribe"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "videos", className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              "data-ocid": "channel.tab",
              className: "w-full rounded-none bg-background border-b border-border/40 h-10 px-4 gap-0 justify-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "videos",
                    className: "text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent",
                    children: [
                      "Videos (",
                      videos.length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    value: "playlists",
                    className: "text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent",
                    children: "Playlists"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "videos", className: "mt-0", children: videosLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "channel.loading_state",
              className: "grid grid-cols-2 gap-2.5 px-3 pt-3",
              children: ["s1", "s2", "s3", "s4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-lg bg-surface2 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-4/5 rounded bg-surface2 animate-pulse" })
              ] }, k))
            }
          ) : videos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "channel.empty_state",
              className: "flex flex-col items-center gap-3 py-16 text-center px-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    "aria-hidden": "true",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M5 3L17 10L5 17V3Z",
                        fill: "oklch(0.68 0.18 35 / 0.4)"
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No videos yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "channel.list",
              className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3",
              children: videos.map((video, i) => {
                var _a, _b;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `channel.item.${i + 1}`,
                    className: "rounded-xl overflow-hidden bg-surface2 cursor-pointer text-left group",
                    onClick: () => handleVideoClick(video),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
                        ((_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: video.thumbnailBlob.getDirectURL(),
                            alt: video.title,
                            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-surface2 to-orange/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "svg",
                          {
                            "aria-hidden": "true",
                            width: "16",
                            height: "16",
                            viewBox: "0 0 16 16",
                            fill: "none",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M4 2L14 8L4 14V2Z",
                                fill: "oklch(0.68 0.18 35 / 0.4)"
                              }
                            )
                          }
                        ) }),
                        (() => {
                          const d = durations.get(video.id);
                          if (d == null) return null;
                          const h = Math.floor(d / 3600);
                          const m = Math.floor(d % 3600 / 60);
                          const s = Math.floor(d % 60);
                          const fmt = h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
                          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded", children: fmt });
                        })()
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium line-clamp-2 text-white/90 leading-snug", children: video.title }) })
                    ]
                  },
                  video.id
                );
              })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "playlists", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "channel.empty_state",
              className: "flex flex-col items-center gap-3 py-16 text-center px-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { size: 22, className: "text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Playlists coming soon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Public playlists from this creator will appear here" })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function ChannelPage() {
  const { channelCreatorId } = useApp();
  if (channelCreatorId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicChannelView, { creatorId: channelCreatorId });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnChannelView, {});
}
export {
  ChannelPage
};
