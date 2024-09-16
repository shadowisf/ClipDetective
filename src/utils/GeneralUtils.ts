export async function waitForEvent(
  target: HTMLElement,
  eventType: string
): Promise<void> {
  return new Promise<void>((resolve) => {
    function onEvent() {
      target.removeEventListener(eventType, onEvent);
      resolve();
    }

    target.addEventListener(eventType, onEvent);
  });
}

export async function sleepFor(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
