const KEY = "sub_notifications";

export type NotifType = "new_video" | "comment_reply" | "comment_like";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  videoId?: string;
  timestamp: number;
  read: boolean;
}

export function getNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Notification[];
  } catch {
    return [];
  }
}

function saveNotifications(notifs: Notification[]): void {
  localStorage.setItem(KEY, JSON.stringify(notifs));
}

export function addNotification(
  n: Omit<Notification, "id" | "timestamp" | "read">,
): void {
  const notifs = getNotifications();
  const newNotif: Notification = {
    ...n,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    read: false,
  };
  // Keep last 50
  const updated = [newNotif, ...notifs].slice(0, 50);
  saveNotifications(updated);
}

export function markAllRead(): void {
  const notifs = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(notifs);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}
