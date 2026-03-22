const KEY = "sub_subscriptions";
const COUNT_KEY_PREFIX = "sub_subcount_";

export function getSubscriptions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function isSubscribed(creatorId: string): boolean {
  return getSubscriptions().includes(creatorId);
}

/**
 * Get local subscriber count for a creator.
 * This is the count stored on this device — it reflects whether
 * the current user is subscribed but is approximate for total count.
 */
export function getLocalSubscriberCount(creatorId: string): number {
  try {
    const stored = localStorage.getItem(`${COUNT_KEY_PREFIX}${creatorId}`);
    return stored ? Number(stored) : 0;
  } catch {
    return 0;
  }
}

export function setLocalSubscriberCount(
  creatorId: string,
  count: number,
): void {
  try {
    localStorage.setItem(
      `${COUNT_KEY_PREFIX}${creatorId}`,
      String(Math.max(0, count)),
    );
  } catch {
    // ignore
  }
}

export function subscribeToCreator(creatorId: string): void {
  const subs = getSubscriptions();
  if (!subs.includes(creatorId)) {
    subs.push(creatorId);
    localStorage.setItem(KEY, JSON.stringify(subs));
    // Increment local count
    const count = getLocalSubscriberCount(creatorId);
    setLocalSubscriberCount(creatorId, count + 1);
  }
}

export function unsubscribeFromCreator(creatorId: string): void {
  const subs = getSubscriptions().filter((id) => id !== creatorId);
  localStorage.setItem(KEY, JSON.stringify(subs));
  // Decrement local count
  const count = getLocalSubscriberCount(creatorId);
  setLocalSubscriberCount(creatorId, count - 1);
}

/** Returns new subscribed state */
export function toggleSubscription(creatorId: string): boolean {
  if (isSubscribed(creatorId)) {
    unsubscribeFromCreator(creatorId);
    return false;
  }
  subscribeToCreator(creatorId);
  return true;
}
