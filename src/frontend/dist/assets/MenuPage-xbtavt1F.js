import { d as createLucideIcon, u as useApp, g as useInternetIdentity, k as useActor, V as useUserProfile, W as useSaveProfile, b as useListVideos, Y as useDeleteVideo, r as reactExports, Z as useQuery, j as jsxRuntimeExports, m as motion, A as AnimatePresence, F as Avatar, G as AvatarImage, H as AvatarFallback, _ as LogIn, $ as Separator, a0 as Settings, T as Trash2, p as Button, a1 as CreatorTier, L as LoaderCircle, U as Label, I as Input, X, a2 as AlertDialog, a3 as AlertDialogTrigger, a4 as AlertDialogContent, a5 as AlertDialogHeader, a6 as AlertDialogTitle, a7 as AlertDialogDescription, a8 as AlertDialogFooter, a9 as AlertDialogCancel, aa as AlertDialogAction, ab as ExternalBlob, e as ue } from "./index-DSOyFnVG.js";
import { S as Skeleton } from "./skeleton-B_QR17Nm.js";
import { C as Camera, T as Textarea } from "./textarea-spydyZwh.js";
import { g as getPlaylists, d as deletePlaylist } from "./playlists-BxogQr83.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { C as ChevronRight } from "./chevron-right-K2z2zorW.js";
import { C as CalendarDays } from "./calendar-days-D3ElAG3s.js";
import { L as ListVideo } from "./list-video-DbPyzDI5.js";
import { B as Bookmark } from "./bookmark-CXa_WCMS.js";
import { B as BadgeCheck, S as ShieldCheck } from "./shield-check-DbhD4JdR.js";
import { P as Plus } from "./plus-ChHCscM6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function MenuPage() {
  const { setPage, setSelectedVideo, setSelectedPlaylistId } = useApp();
  const { identity, login, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const { data: allVideos = [] } = useListVideos();
  const deleteVideo = useDeleteVideo();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [links, setLinks] = reactExports.useState([]);
  const [newLink, setNewLink] = reactExports.useState("");
  const [avatarUrl, setAvatarUrl] = reactExports.useState("");
  const [avatarPreview, setAvatarPreview] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const hasHydratedRef = reactExports.useRef(false);
  const [playlists, setPlaylists] = reactExports.useState(getPlaylists());
  const avatarInputRef = reactExports.useRef(null);
  const editProfileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (profile && !hasHydratedRef.current) {
      hasHydratedRef.current = true;
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarBlobId || "");
    }
  }, [profile]);
  const prevIdentityRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const currentId = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? null;
    if (currentId !== prevIdentityRef.current) {
      prevIdentityRef.current = currentId;
      hasHydratedRef.current = false;
    }
  }, [identity]);
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
  const myVideos = allVideos.filter(
    (v) => v.creatorId === (identity == null ? void 0 : identity.getPrincipal().toString())
  );
  const handleAvatarChange = async (file) => {
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setAvatarUrl(url);
    } catch {
      ue.error("Failed to process avatar");
    } finally {
      setUploading(false);
    }
  };
  const isActorReady = !!actor && !actorFetching;
  const isSaveDisabled = saveProfile.isPending || uploading || !isActorReady || profileLoading;
  const handleSave = async () => {
    if (!identity) {
      ue.error("Please log in first");
      login();
      return;
    }
    if (!isActorReady) {
      ue.error("Still connecting — please try again in a moment.");
      return;
    }
    if (!displayName.trim()) {
      ue.error("Name is required");
      return;
    }
    if (uploading) {
      ue.error("Please wait for image upload to finish");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        displayName,
        username,
        bio,
        avatarBlobId: avatarUrl
      });
      ue.success("Profile saved");
    } catch {
      ue.error("Failed to save profile");
    }
  };
  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks((prev) => [...prev, newLink.trim()]);
      setNewLink("");
    }
  };
  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteVideo.mutateAsync(videoId);
      ue.success("Video deleted");
    } catch {
      ue.error("Failed to delete video");
    }
  };
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPage("player");
  };
  const refreshPlaylists = () => setPlaylists(getPlaylists());
  const scrollToEditProfile = () => {
    var _a;
    (_a = editProfileRef.current) == null ? void 0 : _a.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const avatarSrc = avatarPreview || avatarUrl;
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex-1 overflow-y-auto pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "menu.close_button",
              onClick: () => setPage("home"),
              className: "p-1.5 rounded-full hover:bg-accent transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base", children: "Profile & Settings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isInitializing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "flex items-center gap-3 px-4 py-4 bg-background",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full bg-surface2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28 bg-surface2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 bg-surface2" })
              ] })
            ]
          },
          "header-loading"
        ) : identity ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -6 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "flex items-center gap-0 px-4 py-4 bg-background",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "menu.upload_button",
                  onClick: scrollToEditProfile,
                  className: "relative flex-shrink-0",
                  "aria-label": "Edit profile",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-12 h-12 border-2 border-orange/60", children: [
                      avatarSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-surface2 text-sm font-bold text-orange", children: avatarInitials })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        "aria-label": "Online",
                        className: "absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "menu.link",
                  onClick: () => setPage("channel"),
                  className: "flex-1 ml-3 min-w-0 text-left active:opacity-70 transition-opacity cursor-pointer",
                  children: profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28 bg-surface2 mb-1.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 bg-surface2" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-sm leading-tight truncate", children: displayName || "Your Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                      "@",
                      username || "username"
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "menu.secondary_button",
                  onClick: () => setPage("channel"),
                  className: "flex items-center gap-0.5 text-xs font-semibold text-orange flex-shrink-0 ml-2 hover:text-orange/80 transition-colors",
                  children: [
                    "View channel",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13, className: "mt-px" })
                  ]
                }
              )
            ]
          },
          "header-loggedin"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "flex items-center gap-3 px-4 py-4 bg-background",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 20, className: "text-muted-foreground" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm text-muted-foreground", children: "Sign in to see your profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "menu.primary_button",
                  onClick: login,
                  className: "text-xs font-semibold text-orange hover:text-orange/80 transition-colors flex-shrink-0",
                  children: "Sign in"
                }
              )
            ]
          },
          "header-loggedout"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "menu.settings.button",
            onClick: () => setPage("settings"),
            className: "w-full flex items-center justify-between px-4 py-3.5 border-b border-border/30 hover:bg-white/5 active:bg-white/5 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 17, className: "text-orange" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Settings" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "text-muted-foreground" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "menu.calendar.button",
            onClick: () => setPage("calendar"),
            className: "w-full flex items-center justify-between px-4 py-3.5 border-b border-border/30 hover:bg-white/5 active:bg-white/5 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 17, className: "text-orange" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Scheduled Videos" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "text-muted-foreground" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { size: 14, className: "text-orange" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Playlists" })
            ] }),
            playlists.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "menu.empty_state",
                className: "text-center py-6 text-muted-foreground text-sm",
                children: "No playlists yet"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "menu.list", className: "space-y-2", children: playlists.map((pl, idx) => {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": `menu.item.${idx + 1}`,
                  className: "bg-surface2/50 rounded-xl overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setSelectedPlaylistId(pl.id);
                        setPage("playlist");
                      },
                      className: "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface2 transition-colors text-left",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Bookmark,
                          {
                            size: 15,
                            className: "text-orange flex-shrink-0"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: pl.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            pl.videoIds.length,
                            " video",
                            pl.videoIds.length !== 1 ? "s" : ""
                          ] })
                        ] }),
                        pl.id !== "watch_later" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `menu.delete_button.${idx + 1}`,
                            onClick: (e) => {
                              e.stopPropagation();
                              deletePlaylist(pl.id);
                              refreshPlaylists();
                            },
                            className: "p-1 text-muted-foreground hover:text-destructive transition-colors",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                          }
                        )
                      ]
                    }
                  )
                },
                pl.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/60" }),
          !isInitializing && !identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              className: "flex flex-col items-center gap-4 py-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 28, className: "text-orange" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base mb-1", children: "Log in to edit your profile" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in with Internet Identity to access and save your profile." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "menu.primary_button",
                    className: "bg-orange hover:bg-orange/90 text-white font-semibold px-8",
                    onClick: login,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16, className: "mr-2" }),
                      " Log In"
                    ]
                  }
                )
              ]
            }
          ),
          isInitializing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "menu.loading_state",
              className: "flex flex-col items-center gap-4 py-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-full bg-surface2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 bg-surface2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 bg-surface2" })
              ]
            }
          ),
          !isInitializing && identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-20 h-20 border-2 border-orange", children: [
                  (avatarPreview || avatarUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarPreview || avatarUrl }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-surface2 text-xl font-bold text-orange", children: displayName.slice(0, 2).toUpperCase() || "SP" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "menu.upload_button",
                    onClick: () => {
                      var _a;
                      return (_a = avatarInputRef.current) == null ? void 0 : _a.click();
                    },
                    disabled: uploading,
                    className: "absolute bottom-0 right-0 w-7 h-7 rounded-full bg-orange flex items-center justify-center shadow-lg",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 14, className: "text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: avatarInputRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: (e) => {
                      var _a;
                      const file = (_a = e.target.files) == null ? void 0 : _a[0];
                      if (file) handleAvatarChange(file);
                    }
                  }
                )
              ] }),
              profileLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 bg-surface2" }),
              !profileLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: displayName || "Your Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "@",
                  username || "username"
                ] }),
                creatorStats && creatorStats.tier === CreatorTier.verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 13, className: "text-blue-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-blue-400", children: "Verified Creator" })
                ] }),
                creatorStats && creatorStats.tier === CreatorTier.active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-orange" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-orange", children: "Active Creator" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: "Unlimited uploads" })
              ] })
            ] }),
            actorFetching && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "menu.loading_state",
                className: "flex items-center gap-2 rounded-xl bg-surface2/60 px-3 py-2.5 text-sm text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connecting to network…" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: editProfileRef, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Edit Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Display Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "menu.input",
                    value: displayName,
                    onChange: (e) => setDisplayName(e.target.value),
                    placeholder: "Your display name",
                    className: "bg-surface2 border-border focus-visible:ring-orange"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Username" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "menu.input",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    placeholder: "@username",
                    className: "bg-surface2 border-border focus-visible:ring-orange"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Bio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    "data-ocid": "menu.textarea",
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    placeholder: "Tell viewers about yourself...",
                    className: "bg-surface2 border-border focus-visible:ring-orange resize-none",
                    rows: 3
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "External Links" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  links.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        size: 12,
                        className: "text-muted-foreground flex-shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm text-muted-foreground truncate", children: link }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `menu.delete_button.${i + 1}`,
                        onClick: () => setLinks((prev) => prev.filter((_, j) => j !== i)),
                        className: "p-1 hover:text-destructive transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
                      }
                    )
                  ] }, link)),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "menu.search_input",
                        value: newLink,
                        onChange: (e) => setNewLink(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && handleAddLink(),
                        placeholder: "https://...",
                        className: "bg-surface2 border-border focus-visible:ring-orange text-sm"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        "data-ocid": "menu.secondary_button",
                        size: "sm",
                        variant: "outline",
                        onClick: handleAddLink,
                        className: "border-border flex-shrink-0",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "menu.save_button",
                  className: "w-full bg-orange hover:bg-orange/90 text-white font-semibold disabled:opacity-60",
                  onClick: handleSave,
                  disabled: isSaveDisabled,
                  children: saveProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-2 animate-spin" }),
                    " ",
                    "Saving..."
                  ] }) : actorFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-2 animate-spin" }),
                    " ",
                    "Connecting..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14, className: "mr-2" }),
                    " Save Profile"
                  ] })
                }
              ),
              saveProfile.isError && !saveProfile.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 text-center mt-1", children: "Save failed — tap Save Profile to retry. Your edits are preserved." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: [
                "My Videos (",
                myVideos.length,
                ")"
              ] }),
              myVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "menu.empty_state",
                  className: "text-center py-8 text-muted-foreground text-sm",
                  children: "You haven't uploaded any videos yet"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "menu.list", className: "space-y-3", children: myVideos.map((video, i) => {
                var _a, _b;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `menu.item.${i + 1}`,
                    className: "flex gap-3 items-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "relative w-24 h-14 rounded-lg overflow-hidden bg-surface2 flex-shrink-0",
                          onClick: () => handleVideoClick(video),
                          "aria-label": `Play ${video.title}`,
                          children: ((_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: video.thumbnailBlob.getDirectURL(),
                              alt: video.title,
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-orange/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              "aria-hidden": "true",
                              width: "8",
                              height: "8",
                              viewBox: "0 0 8 8",
                              fill: "none",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "path",
                                {
                                  d: "M2 1L7 4L2 7V1Z",
                                  fill: "oklch(0.68 0.18 35)"
                                }
                              )
                            }
                          ) }) })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold line-clamp-2 leading-snug", children: video.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                          Number(video.views).toLocaleString(),
                          " views"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `menu.delete_button.${i + 1}`,
                            className: "p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          AlertDialogContent,
                          {
                            "data-ocid": "menu.dialog",
                            className: "bg-popover border-border max-w-xs mx-4",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete video?" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                                  "“",
                                  video.title,
                                  "” will be permanently deleted."
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  AlertDialogCancel,
                                  {
                                    "data-ocid": "menu.cancel_button",
                                    className: "border-border",
                                    children: "Cancel"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  AlertDialogAction,
                                  {
                                    "data-ocid": "menu.confirm_button",
                                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                                    onClick: () => handleDeleteVideo(video.id),
                                    children: "Delete"
                                  }
                                )
                              ] })
                            ]
                          }
                        )
                      ] })
                    ]
                  },
                  video.id
                );
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-6 pt-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/50", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ". Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline hover:text-muted-foreground transition-colors",
              children: "caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  MenuPage
};
