import { d as createLucideIcon, ak as createContextScope, r as reactExports, al as useControllableState, j as jsxRuntimeExports, am as useId, an as Primitive, ao as composeEventHandlers, ap as Presence, aq as useComposedRefs, ar as useLayoutEffect2, as as React, at as createCollection, au as useDirection, c as cn, av as ChevronDown, u as useApp, g as useInternetIdentity, k as useActor, V as useUserProfile, W as useSaveProfile, aw as useQueryClient, ax as useI18n, l as loadDateTimePrefs, ay as User, p as Button, L as LoaderCircle, F as Avatar, G as AvatarImage, H as AvatarFallback, U as Label, I as Input, e as ue, B as Bell, az as Switch, aA as Select, aB as SelectTrigger, aC as SelectValue, aD as SelectContent, aE as SUPPORTED_LANGUAGES, aF as SelectItem, aG as COMMON_TIMEZONES, o as formatAppDateTime, aH as LogOut, a2 as AlertDialog, a3 as AlertDialogTrigger, T as Trash2, a4 as AlertDialogContent, a5 as AlertDialogHeader, a6 as AlertDialogTitle, a7 as AlertDialogDescription, a8 as AlertDialogFooter, a9 as AlertDialogCancel, aa as AlertDialogAction, aI as Sheet, aJ as SheetTrigger, aK as SheetContent, aL as SheetHeader, aM as SheetTitle, aN as ManageStorageSheet, ab as ExternalBlob, aO as saveDateTimePrefs } from "./index-DSOyFnVG.js";
import { C as Camera, T as Textarea } from "./textarea-spydyZwh.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { C as ChevronRight } from "./chevron-right-K2z2zorW.js";
import { C as Clock } from "./clock-_PitsIeG.js";
import { L as Lock } from "./lock-QCMAnrix.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$2);
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
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14", key: "1p332r" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3", key: "gb41h5" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12", key: "hf2csr" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3", key: "1kfi7u" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16", key: "1lhrwl" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3", key: "16vvfq" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14", key: "1uebub" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8", key: "1yglbp" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16", key: "1jxqpz" }]
];
const SlidersVertical = createLucideIcon("sliders-vertical", __iconNode);
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId(),
        open,
        onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState$1(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME$1 = "CollapsibleTrigger";
var CollapsibleTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME$1, __scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState$1(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger.displayName = TRIGGER_NAME$1;
var CONTENT_NAME$1 = "CollapsibleContent";
var CollapsibleContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME$1, props.__scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent.displayName = CONTENT_NAME$1;
var CollapsibleContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME$1, __scopeCollapsible);
  const [isPresent, setIsPresent] = reactExports.useState(present);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = reactExports.useRef(0);
  const height = heightRef.current;
  const widthRef = reactExports.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = reactExports.useRef(isOpen);
  const originalStylesRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-state": getState$1(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState$1(open) {
  return open ? "open" : "closed";
}
var Root = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;
var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME);
var [createAccordionContext] = createContextScope(ACCORDION_NAME, [
  createCollectionScope,
  createCollapsibleScope
]);
var useCollapsibleScope = createCollapsibleScope();
var Accordion$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { type, ...accordionProps } = props;
    const singleProps = accordionProps;
    const multipleProps = accordionProps;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeAccordion, children: type === "multiple" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplSingle, { ...singleProps, ref: forwardedRef }) });
  }
);
Accordion$1.displayName = ACCORDION_NAME;
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(
  ACCORDION_NAME,
  { collapsible: false }
);
var AccordionImplSingle = React.forwardRef(
  (props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange = () => {
      },
      collapsible = false,
      ...accordionSingleProps
    } = props;
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? "",
      onChange: onValueChange,
      caller: ACCORDION_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionValueProvider,
      {
        scope: props.__scopeAccordion,
        value: React.useMemo(() => value ? [value] : [], [value]),
        onItemOpen: setValue,
        onItemClose: React.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }) })
      }
    );
  }
);
var AccordionImplMultiple = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...accordionMultipleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: ACCORDION_NAME
  });
  const handleItemOpen = React.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );
  const handleItemClose = React.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccordionValueProvider,
    {
      scope: props.__scopeAccordion,
      value,
      onItemOpen: handleItemOpen,
      onItemClose: handleItemClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }) })
    }
  );
});
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
    const accordionRef = React.useRef(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);
    const getItems = useCollection(__scopeAccordion);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      var _a;
      if (!ACCORDION_KEYS.includes(event.key)) return;
      const target = event.target;
      const triggerCollection = getItems().filter((item) => {
        var _a2;
        return !((_a2 = item.ref.current) == null ? void 0 : _a2.disabled);
      });
      const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
      const triggerCount = triggerCollection.length;
      if (triggerIndex === -1) return;
      event.preventDefault();
      let nextIndex = triggerIndex;
      const homeIndex = 0;
      const endIndex = triggerCount - 1;
      const moveNext = () => {
        nextIndex = triggerIndex + 1;
        if (nextIndex > endIndex) {
          nextIndex = homeIndex;
        }
      };
      const movePrev = () => {
        nextIndex = triggerIndex - 1;
        if (nextIndex < homeIndex) {
          nextIndex = endIndex;
        }
      };
      switch (event.key) {
        case "Home":
          nextIndex = homeIndex;
          break;
        case "End":
          nextIndex = endIndex;
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              moveNext();
            } else {
              movePrev();
            }
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              movePrev();
            } else {
              moveNext();
            }
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
      }
      const clampedIndex = nextIndex % triggerCount;
      (_a = triggerCollection[clampedIndex].ref.current) == null ? void 0 : _a.focus();
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionImplProvider,
      {
        scope: __scopeAccordion,
        disabled,
        direction: dir,
        orientation,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            ...accordionProps,
            "data-orientation": orientation,
            ref: composedRefs,
            onKeyDown: disabled ? void 0 : handleKeyDown
          }
        ) })
      }
    );
  }
);
var ITEM_NAME = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
var AccordionItem$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, value, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
    const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    const triggerId = useId();
    const open = value && valueContext.value.includes(value) || false;
    const disabled = accordionContext.disabled || props.disabled;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionItemProvider,
      {
        scope: __scopeAccordion,
        open,
        disabled,
        triggerId,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            "data-orientation": accordionContext.orientation,
            "data-state": getState(open),
            ...collapsibleScope,
            ...accordionItemProps,
            ref: forwardedRef,
            disabled,
            open,
            onOpenChange: (open2) => {
              if (open2) {
                valueContext.onItemOpen(value);
              } else {
                valueContext.onItemClose(value);
              }
            }
          }
        )
      }
    );
  }
);
AccordionItem$1.displayName = ITEM_NAME;
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...headerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.h3,
      {
        "data-orientation": accordionContext.orientation,
        "data-state": getState(itemContext.open),
        "data-disabled": itemContext.disabled ? "" : void 0,
        ...headerProps,
        ref: forwardedRef
      }
    );
  }
);
AccordionHeader.displayName = HEADER_NAME;
var TRIGGER_NAME = "AccordionTrigger";
var AccordionTrigger$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...triggerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Trigger,
      {
        "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
        "data-orientation": accordionContext.orientation,
        id: itemContext.triggerId,
        ...collapsibleScope,
        ...triggerProps,
        ref: forwardedRef
      }
    ) });
  }
);
AccordionTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "AccordionContent";
var AccordionContent$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...contentProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content,
      {
        role: "region",
        "aria-labelledby": itemContext.triggerId,
        "data-orientation": accordionContext.orientation,
        ...collapsibleScope,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
          ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
          ...props.style
        }
      }
    );
  }
);
AccordionContent$1.displayName = CONTENT_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var Root2 = Accordion$1;
var Item = AccordionItem$1;
var Header = AccordionHeader;
var Trigger2 = AccordionTrigger$1;
var Content2 = AccordionContent$1;
function Accordion({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item,
    {
      "data-slot": "accordion-item",
      className: cn("border-b last:border-b-0", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger2,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" })
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "accordion-content",
      className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pt-0 pb-4", className), children })
    }
  );
}
const PREF_KEY = "sp_app_prefs";
function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function savePref(key, value) {
  try {
    const prefs = loadPrefs();
    prefs[key] = value;
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
  }
}
function getPref(key, fallback) {
  const prefs = loadPrefs();
  return key in prefs ? prefs[key] : fallback;
}
function SectionHeader({
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 pt-6 pb-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
function SettingsRow({
  label,
  sublabel,
  right,
  onClick,
  indent,
  disabled,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      className: `w-full flex items-center justify-between border-b border-border/30 ${indent ? "pl-8 pr-4" : "px-4"} py-3.5 text-left transition-colors ${disabled ? "opacity-40 pointer-events-none" : "active:bg-white/5 hover:bg-white/5"}`,
      onClick,
      disabled,
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: label }),
          sublabel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sublabel })
        ] }),
        right
      ]
    }
  );
}
function SettingsPage() {
  const { setPage } = useApp();
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const qc = useQueryClient();
  const { language, setLanguage } = useI18n();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [avatarUrl, setAvatarUrl] = reactExports.useState("");
  const [avatarPreview, setAvatarPreview] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const avatarInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarBlobId || "");
    }
  }, [profile]);
  const [notifPush, setNotifPush] = reactExports.useState(
    () => getPref("notif_push", true)
  );
  const [notifVideos, setNotifVideos] = reactExports.useState(
    () => getPref("notif_new_videos", true)
  );
  const [notifComments, setNotifComments] = reactExports.useState(
    () => getPref("notif_comments", true)
  );
  const [notifUploads, setNotifUploads] = reactExports.useState(
    () => getPref("notif_uploads", true)
  );
  const [darkMode, setDarkMode] = reactExports.useState(
    () => getPref("appearance_dark", true)
  );
  const [fontSize, setFontSize] = reactExports.useState(
    () => getPref("appearance_fontsize", "M")
  );
  reactExports.useEffect(() => {
    const fsMap = { S: "small", M: "medium", L: "large" };
    document.documentElement.setAttribute("data-fontsize", fsMap[fontSize]);
  }, [fontSize]);
  const [timeFormat, setTimeFormat] = reactExports.useState(
    () => getPref("pref_time_format", "12h")
  );
  const [dateFormat, setDateFormat] = reactExports.useState(
    () => getPref("pref_date_format", "A")
  );
  const [dtTimezoneMode, setDtTimezoneMode] = reactExports.useState(
    () => loadDateTimePrefs().timezoneMode
  );
  const [dtManualTz, setDtManualTz] = reactExports.useState(
    () => loadDateTimePrefs().manualTimezone
  );
  function saveDtPrefs(overrides = {}) {
    const current = loadDateTimePrefs();
    saveDateTimePrefs({
      ...current,
      ...overrides
    });
  }
  const [soundFx, setSoundFx] = reactExports.useState(
    () => getPref("pref_sound_effects", true)
  );
  const [autoPlay, setAutoPlay] = reactExports.useState(
    () => getPref("pref_autoplay", true)
  );
  const [captionsDefault, setCaptionsDefault] = reactExports.useState(
    () => getPref("pref_captions_default", false)
  );
  const [storageOpen, setStorageOpen] = reactExports.useState(false);
  const [feedbackOpen, setFeedbackOpen] = reactExports.useState(false);
  const [feedbackText, setFeedbackText] = reactExports.useState("");
  async function handleAvatarChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !actor) return;
    setUploading(true);
    try {
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setAvatarUrl(url);
      ue.success("Avatar updated");
    } catch {
      ue.error("Failed to process avatar");
    } finally {
      setUploading(false);
    }
  }
  function handleSaveProfile() {
    saveProfile.mutate(
      { displayName, username, bio, avatarBlobId: avatarUrl },
      {
        onSuccess: () => ue.success("Profile saved"),
        onError: () => ue.error("Failed to save profile")
      }
    );
  }
  function toggle(val, set, key) {
    set(val);
    savePref(key, val);
  }
  function handleFontSize(size) {
    setFontSize(size);
    savePref("appearance_fontsize", size);
    const fsMap = { S: "small", M: "medium", L: "large" };
    document.documentElement.setAttribute("data-fontsize", fsMap[size]);
  }
  function handleTimeFormat(f) {
    setTimeFormat(f);
    savePref("pref_time_format", f);
    saveDtPrefs({ timeFormat: f });
  }
  function handleDateFormat(f) {
    setDateFormat(f);
    savePref("pref_date_format", f);
    saveDtPrefs({ dateFormat: f === "A" ? "MDY" : "DMY" });
  }
  function handleLogout() {
    clear();
    setPage("home");
    ue.success("Logged out");
  }
  const avatarSrc = avatarPreview || avatarUrl;
  const initials = displayName ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?";
  const SegBtn = ({
    active,
    onClick,
    children,
    ocid
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": ocid,
      className: `px-4 py-1.5 text-sm rounded-full transition-colors ${active ? "bg-primary text-primary-foreground font-semibold" : "bg-white/10 text-muted-foreground hover:bg-white/20"}`,
      children
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-background/95 backdrop-blur border-b border-border/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setPage("menu"),
            className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
            "data-ocid": "settings.back_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-semibold tracking-tight", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: User, label: "Account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 mb-1 rounded-xl bg-card border border-border/40 overflow-hidden", children: !identity ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-6 text-center",
          "data-ocid": "settings.account.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Sign in to manage your profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-primary text-primary-foreground",
                onClick: () => setPage("menu"),
                children: "Sign In"
              }
            )
          ]
        }
      ) : profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-4 py-6 flex justify-center",
          "data-ocid": "settings.account.loading_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-4 space-y-4",
          "data-ocid": "settings.account.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16", children: [
                  avatarSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc }) : null,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-lg font-bold bg-primary/20 text-primary", children: initials })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a;
                      return (_a = avatarInputRef.current) == null ? void 0 : _a.click();
                    },
                    className: "absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg",
                    "data-ocid": "settings.account.upload_button",
                    children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: avatarInputRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handleAvatarChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: displayName || "Set your name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "@",
                  username || "username"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Display Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: displayName,
                    onChange: (e) => setDisplayName(e.target.value),
                    placeholder: "Your name",
                    className: "bg-background/60",
                    "data-ocid": "settings.account.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Username" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    placeholder: "@username",
                    className: "bg-background/60",
                    "data-ocid": "settings.account.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Bio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    placeholder: "About you...",
                    rows: 3,
                    className: "bg-background/60 resize-none",
                    "data-ocid": "settings.account.textarea"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full bg-primary text-primary-foreground",
                onClick: handleSaveProfile,
                disabled: saveProfile.isPending,
                "data-ocid": "settings.account.save_button",
                children: [
                  saveProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                  saveProfile.isPending ? "Saving..." : "Save Profile"
                ]
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Manage Linked Accounts",
          sublabel: "Google, Apple and more",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
          onClick: () => ue.info("Coming soon"),
          ocid: "settings.account.button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Bell, label: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Push Notifications",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: notifPush,
              onCheckedChange: (v) => toggle(v, setNotifPush, "notif_push"),
              "data-ocid": "settings.notifications.switch"
            }
          ),
          ocid: "settings.notifications.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "New video alerts",
          indent: true,
          disabled: !notifPush,
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: notifVideos,
              onCheckedChange: (v) => toggle(v, setNotifVideos, "notif_new_videos"),
              disabled: !notifPush
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Comments & replies",
          indent: true,
          disabled: !notifPush,
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: notifComments,
              onCheckedChange: (v) => toggle(v, setNotifComments, "notif_comments"),
              disabled: !notifPush
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Upload status",
          indent: true,
          disabled: !notifPush,
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: notifUploads,
              onCheckedChange: (v) => toggle(v, setNotifUploads, "notif_uploads"),
              disabled: !notifPush
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Palette, label: "Appearance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Dark Mode",
          sublabel: "Default for SUB PREMIUM",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: darkMode,
              onCheckedChange: (v) => toggle(v, setDarkMode, "appearance_dark"),
              "data-ocid": "settings.appearance.switch"
            }
          ),
          ocid: "settings.appearance.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Font Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: fontSize === "S",
              onClick: () => handleFontSize("S"),
              ocid: "settings.appearance.tab",
              children: "S"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: fontSize === "M",
              onClick: () => handleFontSize("M"),
              children: "M"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: fontSize === "L",
              onClick: () => handleFontSize("L"),
              children: "L"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Globe, label: "Language & Region" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "App Language" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: language, onValueChange: (v) => setLanguage(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-36 h-8 text-sm bg-background/60 border-border/50",
              "data-ocid": "settings.language.select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUPPORTED_LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l.code, children: l.name }, l.code)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Clock, label: "Date & Time" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Time Format" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: timeFormat === "12h",
              onClick: () => handleTimeFormat("12h"),
              ocid: "settings.datetime.tab",
              children: "12h AM/PM"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: timeFormat === "24h",
              onClick: () => handleTimeFormat("24h"),
              children: "24h"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Date Format" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: dateFormat === "A",
              onClick: () => handleDateFormat("A"),
              children: "Mar 21"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: dateFormat === "B",
              onClick: () => handleDateFormat("B"),
              children: "21 Mar"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Timezone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: dtTimezoneMode === "auto",
              onClick: () => {
                setDtTimezoneMode("auto");
                saveDtPrefs({ timezoneMode: "auto" });
              },
              ocid: "settings.datetime.toggle",
              children: "Auto"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegBtn,
            {
              active: dtTimezoneMode === "manual",
              onClick: () => {
                setDtTimezoneMode("manual");
                saveDtPrefs({ timezoneMode: "manual" });
              },
              children: "Manual"
            }
          )
        ] })
      ] }),
      dtTimezoneMode === "auto" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Detected timezone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-primary", children: Intl.DateTimeFormat().resolvedOptions().timeZone })
      ] }),
      dtTimezoneMode === "manual" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mr-3", children: "Select Timezone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: dtManualTz || "UTC",
            onValueChange: (v) => {
              setDtManualTz(v);
              saveDtPrefs({ timezoneMode: "manual", manualTimezone: v });
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-48 h-8 text-xs bg-background/60 border-border/50",
                  "data-ocid": "settings.datetime.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: COMMON_TIMEZONES.map((tz) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectItem,
                {
                  value: tz.value,
                  className: "text-xs",
                  children: tz.label
                },
                tz.value
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-mono", children: formatAppDateTime(/* @__PURE__ */ new Date(), loadDateTimePrefs()) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Lock, label: "Privacy & Security" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Change Password",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
          onClick: () => ue.info("Password management coming soon"),
          ocid: "settings.privacy.button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Clear Cache",
          sublabel: "Removes temporary data",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
          onClick: () => {
            qc.clear();
            ue.success("Cache cleared");
          },
          ocid: "settings.privacy.secondary_button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Manage Storage",
          sublabel: "View usage & free space",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
          onClick: () => setStorageOpen(true),
          ocid: "settings.privacy.open_modal_button"
        }
      ),
      identity && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Logout",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 text-destructive" }),
          onClick: handleLogout,
          ocid: "settings.privacy.delete_button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsRow,
          {
            label: "Delete Account",
            right: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }),
            ocid: "settings.privacy.open_modal_button"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "settings.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Account?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone. All your videos, playlists, and profile data will be permanently removed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "settings.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                onClick: () => ue.info("Account deletion requested"),
                "data-ocid": "settings.delete.confirm_button",
                children: "Delete Account"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: CircleHelp, label: "Support & About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 mb-1 rounded-xl bg-card border border-border/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Accordion,
        {
          type: "single",
          collapsible: true,
          "data-ocid": "settings.support.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "q1", className: "border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "px-4 py-3.5 text-sm hover:no-underline", children: "How do I upload a video?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-4 pb-3.5 text-sm text-muted-foreground", children: "Tap the + button at the bottom to upload." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "q2", className: "border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "px-4 py-3.5 text-sm hover:no-underline", children: "How do I change my username?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-4 pb-3.5 text-sm text-muted-foreground", children: "Go to Account → edit your username → Save." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "q3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "px-4 py-3.5 text-sm hover:no-underline", children: "How do I delete my account?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-4 pb-3.5 text-sm text-muted-foreground", children: "Go to Privacy & Security → Delete Account." })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: feedbackOpen, onOpenChange: setFeedbackOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsRow,
          {
            label: "Send Feedback",
            right: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" }),
            onClick: () => setFeedbackOpen(true),
            ocid: "settings.support.open_modal_button"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SheetContent,
          {
            side: "bottom",
            className: "rounded-t-2xl",
            "data-ocid": "settings.feedback.sheet",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Send Feedback" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Tell us what you think...",
                    value: feedbackText,
                    onChange: (e) => setFeedbackText(e.target.value),
                    rows: 5,
                    className: "bg-background/60 resize-none",
                    "data-ocid": "settings.feedback.textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full bg-primary text-primary-foreground",
                    onClick: () => {
                      ue.success("Feedback sent — thank you!");
                      setFeedbackText("");
                      setFeedbackOpen(false);
                    },
                    "data-ocid": "settings.feedback.submit_button",
                    children: "Send"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 px-4 py-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Version" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-primary", children: "v1.0.0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: SlidersVertical, label: "App Preferences" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Sound Effects",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: soundFx,
              onCheckedChange: (v) => toggle(v, setSoundFx, "pref_sound_effects"),
              "data-ocid": "settings.prefs.switch"
            }
          ),
          ocid: "settings.prefs.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Auto-play",
          sublabel: "Automatically play next video",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: autoPlay,
              onCheckedChange: (v) => toggle(v, setAutoPlay, "pref_autoplay")
            }
          ),
          ocid: "settings.prefs.secondary_button"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsRow,
        {
          label: "Captions Default ON",
          sublabel: "Enable captions when videos load",
          right: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: captionsDefault,
              onCheckedChange: (v) => toggle(v, setCaptionsDefault, "pref_captions_default")
            }
          ),
          ocid: "settings.prefs.checkbox"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-8 text-center space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "© 2026 SUB PREMIUM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors",
            children: "Built with ❤️ using caffeine.ai"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ManageStorageSheet, { open: storageOpen, onOpenChange: setStorageOpen })
  ] });
}
export {
  SettingsPage
};
