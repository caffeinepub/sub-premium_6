const KEY = "sub_subscriptions";

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

export function subscribeToCreator(creatorId: string): void {
  const subs = getSubscriptions();
  if (!subs.includes(creatorId)) {
    subs.push(creatorId);
    localStorage.setItem(KEY, JSON.stringify(subs));
  }
}

export function unsubscribeFromCreator(creatorId: string): void {
  const subs = getSubscriptions().filter((id) => id !== creatorId);
  localStorage.setItem(KEY, JSON.stringify(subs));
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
