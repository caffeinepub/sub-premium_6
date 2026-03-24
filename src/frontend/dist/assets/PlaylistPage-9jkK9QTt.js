import { u as useApp, b as useListVideos, r as reactExports, j as jsxRuntimeExports, m as motion, P as Play, T as Trash2, e as ue } from "./index-DSOyFnVG.js";
import { g as getPlaylists, r as removeVideoFromPlaylist } from "./playlists-BxogQr83.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
function PlaylistPage() {
  var _a, _b, _c;
  const { selectedPlaylistId, setPage, setSelectedVideo } = useApp();
  const { data: allVideos = [] } = useListVideos();
  const [playlists, setPlaylists] = reactExports.useState(() => getPlaylists());
  const playlist = playlists.find((p) => p.id === selectedPlaylistId);
  const refresh = () => setPlaylists(getPlaylists());
  if (!playlist) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-64 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Playlist not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPage("home"),
          className: "text-orange text-sm font-medium",
          children: "Go Home"
        }
      )
    ] });
  }
  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  const playlistVideos = playlist.videoIds.map((id) => videoMap.get(id)).filter((v) => !!v);
  const firstThumb = (_c = (_b = (_a = playlistVideos[0]) == null ? void 0 : _a.thumbnailBlob) == null ? void 0 : _b.getDirectURL) == null ? void 0 : _c.call(_b);
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPage("player");
  };
  const handleRemove = (videoId, _title) => {
    removeVideoFromPlaylist(playlist.id, videoId);
    refresh();
    ue.success(`Removed from "${playlist.title}"`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "flex flex-col pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "playlist.page",
            className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "playlist.close_button",
                  onClick: () => setPage("home"),
                  className: "p-1.5 rounded-full hover:bg-accent transition-colors flex-shrink-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base truncate", children: playlist.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  playlist.videoIds.length,
                  " video",
                  playlist.videoIds.length !== 1 ? "s" : "",
                  playlist.privacy === "private" ? " · Private" : ""
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video bg-surface2 flex-shrink-0", children: [
          firstThumb ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: firstThumb,
              alt: playlist.title,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-surface2 to-orange/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 40, className: "text-orange/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full", children: [
            playlist.videoIds.length,
            " video",
            playlist.videoIds.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-bold text-lg drop-shadow-lg", children: playlist.title }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: playlistVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "playlist.empty_state",
            className: "flex flex-col items-center justify-center py-16 gap-3 text-center px-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-surface2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 22, className: "text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No videos in this playlist yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/50 text-xs", children: "Add videos using the bookmark button" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "playlist.list", className: "divide-y divide-border/20", children: playlistVideos.map((video, i) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `playlist.item.${i + 1}`,
              className: "flex items-center gap-3 px-4 py-3 hover:bg-surface2/40 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50 w-5 flex-shrink-0 text-center", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleVideoClick(video),
                    className: "relative w-24 h-14 rounded-lg overflow-hidden bg-surface2 flex-shrink-0",
                    "aria-label": `Play ${video.title}`,
                    children: ((_b2 = (_a2 = video.thumbnailBlob) == null ? void 0 : _a2.getDirectURL) == null ? void 0 : _b2.call(_a2)) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: video.thumbnailBlob.getDirectURL(),
                        alt: video.title,
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-orange/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 14, className: "text-orange/50" }) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleVideoClick(video),
                    className: "flex-1 min-w-0 text-left",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground line-clamp-2 leading-snug", children: video.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: video.creatorName || "Unknown" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `playlist.delete_button.${i + 1}`,
                    onClick: () => handleRemove(video.id, video.title),
                    className: "p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0",
                    "aria-label": "Remove from playlist",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
                  }
                )
              ]
            },
            video.id
          );
        }) }) })
      ]
    }
  );
}
export {
  PlaylistPage
};
