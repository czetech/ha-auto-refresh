interface LitElement extends HTMLElement {
  updateComplete: Promise<boolean>;
}

const LOG_PREFIX: string = "[HA Auto Refresh]";

const logger = {
  log: (msg: string, ...args: any[]) =>
    console.log(`${LOG_PREFIX} ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) =>
    console.warn(`${LOG_PREFIX} ${msg}`, ...args),
  error: (msg: string, ...args: any[]) =>
    console.error(`${LOG_PREFIX} ${msg}`, ...args),
};

async function handleHaToast(haToast: HTMLElement) {
  const haButton = haToast.querySelector(
    'ha-button[slot="action"]',
  ) as LitElement | null;

  if (haButton) {
    if (haButton.dataset.haClick) return;

    if (haButton.textContent.trim() === "Refresh") {
      haButton.dataset.haClick = "true";

      await haButton.updateComplete;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      haButton.click();
      logger.log("Dashboard refreshed.");
    }
  }
}

function haToastObserver(notificationManager: HTMLElement) {
  if (notificationManager.dataset.haAttached) return;

  if (!notificationManager.shadowRoot) {
    logger.warn(
      "Found 'notification-manager' but it has no shadowRoot.",
      "Cannot observe toasts.",
    );
    return;
  }

  notificationManager.dataset.haAttached = "true";

  const haToasts = notificationManager.shadowRoot.querySelectorAll("ha-toast");
  haToasts.forEach((node) => handleHaToast(node as HTMLElement));

  const mutationObserver = new MutationObserver((mutations) => {
    const nodes: Node[] = [];

    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        nodes.push(mutation.target);
      }
      nodes.push(...mutation.addedNodes);
    });

    nodes.forEach((node) => {
      if (node.nodeName === "HA-TOAST") {
        handleHaToast(node as HTMLElement);
      }
    });
  });
  mutationObserver.observe(notificationManager.shadowRoot, {
    subtree: true,
    childList: true,
    attributeFilter: ["open"],
  });
}

async function notificationManagerObserver() {
  if (!customElements.get("home-assistant")) {
    logger.log("'home-assistant' element not defined yet. Waiting...");
    await customElements.whenDefined("home-assistant");
  }

  const homeAssistant = document.querySelector("home-assistant");

  if (!homeAssistant?.shadowRoot) {
    logger.error(
      "'home-assistant' element found but shadowRoot is missing. Aborting.",
    );
    return;
  }

  const notificationManager = homeAssistant.shadowRoot.querySelector(
    "notification-manager",
  );
  if (notificationManager) {
    haToastObserver(notificationManager as HTMLElement);
  }

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "NOTIFICATION-MANAGER") {
          haToastObserver(node as HTMLElement);
        }
      });
    });
  });
  mutationObserver.observe(homeAssistant.shadowRoot, { childList: true });

  logger.log("Initialized. Observing for refresh button.");
}

function isEnabled() {
  const requiredQueryParam = import.meta.env.VITE_REQUIRED_QUERY_PARAM;

  if (requiredQueryParam) {
    const urlSearchParams = new URLSearchParams(window.location.search);

    if (!urlSearchParams.has(requiredQueryParam)) {
      logger.log(
        `Script disabled. To enable, add '?${requiredQueryParam}' to the URL.`,
      );
      return false;
    }
  }

  return true;
}

function bootstrap() {
  if (isEnabled()) {
    notificationManagerObserver();
  }
}

bootstrap();
