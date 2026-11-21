import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";
import { tourSpeech, type SpeechState } from "./tour-speech.service";
import { useTourStore } from "./tour.store";
import type {
  TourDefinition,
  TourStepBranchConfig,
  TourStepConfig,
  TourId,
} from "./tour.types";
import { NAV_ITEMS } from "@/config/navigation.config";
import { store } from "@/redux/store";
import { projectApi } from "@/redux/api/projectApi";
import { plantOperationsTour } from "./tours/plant-operations.tour";
import { orderFlowTour } from "./tours/order-flow.tour";
import { projectDetailsTour } from "./tours/project-details.tour";

export const TOURS_REGISTRY: Record<TourId, TourDefinition> = {
  "plant-operations": plantOperationsTour,
  "order-flow": orderFlowTour,
  "project-details": projectDetailsTour,
};

const DESKTOP_TOUR_WIDTH = 1024;
const OPTIONAL_STEP_TIMEOUT_MS = 1500;
const STEP_TIMEOUT_MS = 4000;

function isTourTargetVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (!element.isConnected) return false;
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  return true;
}

function stripPath(path: string): string {
  const clean = path.split("?")[0];
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

function currentLocation(): string {
  return window.location.pathname + window.location.search;
}

/** Matches a path against a route pattern; `:param` segments match anything. */
function routeMatches(currentPath: string, pattern: string): boolean {
  if (!pattern) return true;
  const current = stripPath(currentPath);
  const target = stripPath(pattern);
  if (target === "/" || target === "/dashboard") {
    return current === "/" || current === "/dashboard";
  }
  const currentParts = current.split("/");
  const targetParts = target.split("/");
  if (currentParts.length !== targetParts.length) return false;
  return targetParts.every(
    (part, i) => part.startsWith(":") || part === currentParts[i],
  );
}

/** Reads a route param's value from the current URL, using a route pattern. */
function readParamFromLocation(param: string, pattern: string): string | null {
  const patternParts = stripPath(pattern).split("/");
  const currentParts = stripPath(window.location.pathname).split("/");
  const i = patternParts.indexOf(`:${param}`);
  if (i === -1 || currentParts.length <= i) return null;
  // Every static segment before the param must line up.
  for (let j = 0; j < i; j++) {
    if (!patternParts[j].startsWith(":") && patternParts[j] !== currentParts[j]) {
      return null;
    }
  }
  return currentParts[i] || null;
}

const PROJECT_ROUTE_PREFIX = "/projects/:projectId";
const NON_PROJECT_SEGMENTS = new Set(["customerinfo", "all-projects"]);

function readProjectIdFromLocation(): string | null {
  const id = readParamFromLocation("projectId", PROJECT_ROUTE_PREFIX);
  return id && !NON_PROJECT_SEGMENTS.has(id) ? id : null;
}

async function fetchFirstProjectId(): Promise<string | null> {
  try {
    const result = await store
      .dispatch(
        projectApi.endpoints.getPlantProjects.initiate(
          { page: 1, limit: 1 },
          { subscribe: false },
        ),
      )
      .unwrap();
    return result.projects?.[0]?._id ?? null;
  } catch (error) {
    console.warn("[Tour] Unable to resolve a project ID.", error);
    return null;
  }
}

interface NavHint {
  element: string;
  title: string;
  description: string;
  speechText: string;
}

/** Finds which sidebar tab (and sub-tab, if any) a route lives under. */
function findNavLocation(route: string): { tabIndex: number; subPath?: string; subLabel?: string } | null {
  const target = stripPath(route);
  for (let tabIndex = 0; tabIndex < NAV_ITEMS.length; tabIndex++) {
    const tab = NAV_ITEMS[tabIndex];
    if (tab.path && routeMatches(target, tab.path)) return { tabIndex };
    const sub = tab.items?.find((item) => !item.isAction && stripPath(item.path) === target);
    if (sub) return { tabIndex, subPath: sub.path, subLabel: sub.label };
  }
  return null;
}

/**
 * Builds the "click here" steps a user would take in the sidebar to get from
 * the current page to `targetRoute`. Empty when the route isn't in the sidebar.
 */
function buildNavHints(currentPath: string, targetRoute: string): NavHint[] {
  const target = findNavLocation(targetRoute);
  if (!target) return [];
  const current = findNavLocation(currentPath);
  const tab = NAV_ITEMS[target.tabIndex];
  const hints: NavHint[] = [];

  if (!current || current.tabIndex !== target.tabIndex) {
    const opensSection = Boolean(tab.items?.length);
    hints.push({
      element: `[data-tour-nav="${tab.title}"]`,
      title: `Go to ${tab.title}`,
      description: opensSection
        ? `Click the <b>${tab.title}</b> icon in the sidebar to open its sections. Click it yourself, or press Next and we'll do it for you.`
        : `Click the <b>${tab.title}</b> icon in the sidebar to open it. Click it yourself, or press Next and we'll do it for you.`,
      speechText: `Click ${tab.title} in the sidebar.`,
    });
  }

  if (target.subPath) {
    hints.push({
      element: `[data-tour-nav-sub="${target.subPath}"]`,
      title: `Open ${target.subLabel}`,
      description: `Inside <b>${tab.title}</b>, click <b>${target.subLabel}</b> to open that page. Click it yourself, or press Next and we'll do it for you.`,
      speechText: `Now click ${target.subLabel}.`,
    });
  }

  return hints;
}

type HintResult = "clicked" | "missing" | "cancelled";

interface PopoverConfig {
  element: string | null;
  title: string;
  description: string;
  speechText: string;
  side?: TourStepConfig["side"];
  align?: TourStepConfig["align"];
  index: number;
  nextBtnText: string;
  branch?: TourStepBranchConfig;
  onNext: () => void;
  onPrev: () => void;
}

interface ResumeTourContext {
  tourId: TourId;
  stepIndex: number;
}

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export class TourCoordinator {
  private driverObj: Driver | null = null;
  private navigate: NavigateFunction | null = null;
  private currentTour: TourDefinition | null = null;
  private stepToken = 0;
  private unsubscribe: (() => void) | null = null;
  private currentSpeechUnsub: (() => void) | null = null;
  private cancelPendingHint: (() => void) | null = null;
  /** What the visible popover narrates; replayed when audio is unmuted. */
  private currentSpeechText = "";
  /** Set while a branched tour runs; where to return when it ends. */
  private resumeContext: ResumeTourContext | null = null;
  /** Project the current tour is showing, so every step stays on the same one. */
  private tourProjectId: string | null = null;

  private cleanupSpeechSubscription() {
    if (this.currentSpeechUnsub) {
      this.currentSpeechUnsub();
      this.currentSpeechUnsub = null;
    }
  }

  private clearPendingHint() {
    if (this.cancelPendingHint) {
      const cancel = this.cancelPendingHint;
      this.cancelPendingHint = null;
      cancel();
    }
  }

  public init(navigate: NavigateFunction) {
    this.navigate = navigate;
    if (this.unsubscribe) return;

    this.unsubscribe = useTourStore.subscribe((state, previous) => {
      if (state.isAudioMuted === previous.isAudioMuted) return;
      if (state.isAudioMuted) {
        tourSpeech.stop("muted");
        return;
      }

      if (!this.currentTour || !this.currentSpeechText) return;
      tourSpeech.speak(this.currentSpeechText, false);
    });
  }

  private async waitForElement(
    selector: string,
    timeoutMs = STEP_TIMEOUT_MS,
  ): Promise<Element | null> {
    const existing = document.querySelector(selector);
    if (existing && isTourTargetVisible(existing)) return existing;

    return new Promise((resolve) => {
      let timeoutId = 0;
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element && isTourTargetVisible(element)) {
          window.clearTimeout(timeoutId);
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      timeoutId = window.setTimeout(() => {
        observer.disconnect();
        const element = document.querySelector(selector);
        resolve(element && isTourTargetVisible(element) ? element : null);
      }, timeoutMs);
    });
  }

  public async startTour(
    tour: TourDefinition,
    startIndex = 0,
    resumeContext?: ResumeTourContext | null,
  ) {
    this.stopTour(false);
    if (resumeContext !== undefined) {
      this.resumeContext = resumeContext;
    }
    tourSpeech.prime();
    this.currentTour = tour;
    useTourStore.getState().setActiveTour(tour.id);

    if (window.innerWidth < DESKTOP_TOUR_WIDTH) {
      toast.info(
        "This tour is designed for desktop. Hidden navigation steps are skipped on smaller screens.",
      );
    }

    this.driverObj = driver({
      animate: true,
      allowClose: true,
      overlayClickBehavior: "none",
      overlayColor: "rgba(15, 23, 42, 0.7)",
      stagePadding: 8,
      stageRadius: 8,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Finish Tour ✓",
      showProgress: true,
      progressText: "{{current}} of {{total}}",
      onDestroyed: (_element, _step, opts) => {
        if (opts.reason === "replaced") return;
        this.cleanupSpeechSubscription();
        tourSpeech.stop();
        this.currentTour = null;
        this.driverObj = null;
        if (useTourStore.getState().activeTourId) {
          useTourStore.getState().setActiveTour(null);
        }
      },
    });

    await this.goToStep(startIndex);
  }

  /** Fills `:projectId` / `:requestId` in a route. Null if one can't be found. */
  private async resolveRoute(pattern: string): Promise<string | null> {
    let route = pattern;

    if (route.includes(":projectId")) {
      const projectId =
        readProjectIdFromLocation() ?? this.tourProjectId ?? (await fetchFirstProjectId());
      if (!projectId) return null;
      this.tourProjectId = projectId;
      route = route.replace(":projectId", projectId);
    }

    if (route.includes(":requestId")) {
      const requestId = readParamFromLocation("requestId", pattern);
      if (!requestId) return null;
      route = route.replace(":requestId", requestId);
    }

    return route;
  }

  private skipStep(index: number, direction: "forward" | "backward") {
    if (!this.currentTour) return;
    const nextIndex = direction === "forward" ? index + 1 : index - 1;
    if (nextIndex >= 0 && nextIndex < this.currentTour.steps.length) {
      void this.goToStep(nextIndex, direction);
    } else {
      this.completeTour();
    }
  }

  /** Leaves a tour that can't run (e.g. no projects yet), resuming the parent if any. */
  private abortTour(message: string) {
    toast.info(message);
    if (this.resumeContext) {
      const { tourId, stepIndex } = this.resumeContext;
      this.resumeContext = null;
      void this.startTour(TOURS_REGISTRY[tourId], stepIndex, null);
      return;
    }
    this.stopTour();
  }

  /** Shows the sidebar clicks that lead to `targetRoute`. False if the tour moved on. */
  private async walkSidebarTo(targetRoute: string, index: number, token: number): Promise<boolean> {
    const hints = buildNavHints(currentLocation(), targetRoute);
    for (let i = 0; i < hints.length; i++) {
      if (i > 0) {
        // The side panel slides its sub-items into place; let it settle
        // so the highlight lands on the final position.
        await delay(350);
        if (token !== this.stepToken) return false;
      }
      const result = await this.showClickHint(hints[i], index, token);
      if (result === "cancelled") return false;
    }
    return true;
  }

  public async goToStep(
    index: number,
    direction: "forward" | "backward" = "forward",
  ) {
    if (!this.currentTour || !this.driverObj) return;
    const token = ++this.stepToken;
    this.clearPendingHint();
    const step = this.currentTour.steps[index];
    if (!step) {
      this.completeTour();
      return;
    }

    useTourStore.getState().setCurrentStepIndex(index);

    const isActive = () => token === this.stepToken && !!this.currentTour && !!this.driverObj;
    const showClicks = direction === "forward" && window.innerWidth >= DESKTOP_TOUR_WIDTH;

    if (step.route && !routeMatches(currentLocation(), step.route)) {
      // Going forward on desktop, walk the user through the clicks instead of
      // jumping to the page, so they learn where it lives.
      if (showClicks && step.via) {
        const { via } = step;
        if (!routeMatches(currentLocation(), via.fromRoute)) {
          if (!(await this.walkSidebarTo(via.fromRoute, index, token))) return;
          const fromRoute = await this.resolveRoute(via.fromRoute);
          if (!isActive()) return;
          if (fromRoute && this.navigate && !routeMatches(currentLocation(), via.fromRoute)) {
            this.navigate(fromRoute);
          }
        }

        const result = await this.showClickHint(
          {
            element: via.element,
            title: via.title,
            description: via.description,
            speechText: via.speechText || via.title,
          },
          index,
          token,
        );
        if (result === "cancelled") return;
        // The control isn't there (no shipper files yet, BOM not generated...),
        // so this page has nothing to show yet. Skip it.
        if (result === "missing") {
          this.skipStep(index, direction);
          return;
        }
      } else if (showClicks) {
        if (!(await this.walkSidebarTo(step.route, index, token))) return;
      }

      const targetRoute = await this.resolveRoute(step.route);
      if (!isActive()) return;

      if (!targetRoute) {
        if (step.route.includes(":projectId")) {
          this.abortTour(
            "The project details guide needs at least one project assigned to your plant.",
          );
          return;
        }
        console.info(`[Tour] Route not available for step: ${step.id}. Skipping.`);
        this.skipStep(index, direction);
        return;
      }

      if (this.navigate && !routeMatches(currentLocation(), step.route)) {
        this.navigate(targetRoute);
      }
    } else if (step.route.includes(":projectId")) {
      this.tourProjectId = readProjectIdFromLocation() ?? this.tourProjectId;
    }

    const timeout = step.optional ? OPTIONAL_STEP_TIMEOUT_MS : STEP_TIMEOUT_MS;
    const element = await this.waitForElement(step.element, timeout);
    if (!isActive()) return;

    if (!element) {
      console.warn(`[Tour] Element not found: ${step.element}. Skipping.`);
      this.skipStep(index, direction);
      return;
    }

    this.presentStep(step, index, step.element);
  }

  /**
   * Highlights a control and waits until it is clicked, either by the user or
   * by the Next button.
   */
  private async showClickHint(hint: NavHint, index: number, token: number): Promise<HintResult> {
    const element = await this.waitForElement(hint.element, STEP_TIMEOUT_MS);
    if (token !== this.stepToken || !this.currentTour || !this.driverObj) return "cancelled";
    if (!element || !(element instanceof HTMLElement)) return "missing";

    const isSidebar = Boolean(element.closest('[data-tour="sidebar-nav"]'));

    return new Promise<HintResult>((resolve) => {
      const onClick = () => {
        element.removeEventListener("click", onClick);
        this.cancelPendingHint = null;
        // Let the app's own click handler run (and navigate) before moving on.
        window.setTimeout(
          () => resolve(token === this.stepToken ? "clicked" : "cancelled"),
          0,
        );
      };
      element.addEventListener("click", onClick);
      this.cancelPendingHint = () => {
        element.removeEventListener("click", onClick);
        resolve("cancelled");
      };

      this.showPopover({
        element: hint.element,
        title: hint.title,
        description: hint.description,
        speechText: hint.speechText,
        side: isSidebar ? "right" : "bottom",
        align: "start",
        index,
        nextBtnText: "Next →",
        onNext: () => element.click(),
        onPrev: () => void this.goToStep(Math.max(0, index - 1), "backward"),
      });
    });
  }

  private presentStep(
    step: TourStepConfig,
    index: number,
    element: string | null,
  ) {
    if (!this.currentTour) return;
    const isLast = index === this.currentTour.steps.length - 1;
    const returnsToParent = isLast && this.resumeContext !== null;
    const parentName = this.resumeContext
      ? TOURS_REGISTRY[this.resumeContext.tourId].name
      : "";

    this.showPopover({
      element,
      title: step.title,
      description: returnsToParent
        ? `${step.description}<br><br>You've finished the <b>${this.currentTour.name}</b>. Press Continue to return to the ${parentName}.`
        : step.description,
      speechText: returnsToParent
        ? `${step.speechText || step.description} You've finished the ${this.currentTour.name}. Press continue to return to the main walkthrough.`
        : step.speechText || step.description,
      side: step.side,
      align: step.align,
      index,
      nextBtnText: returnsToParent
        ? "Continue Walkthrough →"
        : isLast
          ? "Finish Tour ✓"
          : "Next →",
      branch: step.branch,
      onNext: () => void this.goToStep(index + 1, "forward"),
      onPrev: () => void this.goToStep(Math.max(0, index - 1), "backward"),
    });
  }

  private startBranch(branch: TourStepBranchConfig, index: number) {
    if (!this.currentTour) return;
    const targetTour = TOURS_REGISTRY[branch.tourId];
    if (!targetTour) return;
    const resume: ResumeTourContext = {
      tourId: this.currentTour.id,
      stepIndex: branch.resumeStepIndex ?? index + 1,
    };
    this.cleanupSpeechSubscription();
    tourSpeech.stop();
    void this.startTour(targetTour, 0, resume);
  }

  private renderBranch(wrapper: HTMLElement, footer: HTMLElement | undefined, branch: TourStepBranchConfig | undefined, index: number) {
    wrapper.querySelector(".tour-branch-container")?.remove();
    if (!branch) return;

    const box = document.createElement("div");
    box.className = "tour-branch-container";

    const prompt = document.createElement("div");
    prompt.className = "tour-branch-prompt";
    prompt.textContent =
      branch.description || "Want a closer look? Take the detailed guide, then come back here.";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tour-branch-btn";
    btn.textContent = `${branch.label} →`;
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startBranch(branch, index);
    };

    box.append(prompt, btn);
    if (footer && footer.parentNode === wrapper) {
      wrapper.insertBefore(box, footer);
    } else {
      wrapper.appendChild(box);
    }
  }

  private showPopover(config: PopoverConfig) {
    if (!this.currentTour || !this.driverObj) return;
    const { element, index } = config;

    if (element) {
      const domEl = document.querySelector(element);
      if (domEl) {
        domEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    const total = this.currentTour.steps.length;
    const isFirst = index === 0;
    const speech = config.speechText;
    this.currentSpeechText = speech;

    this.driverObj.highlight({
      ...(element ? { element } : {}),
      popover: {
        title: config.title,
        description: config.description,
        side: config.side || "bottom",
        align: config.align || "start",
        showButtons: ["next", "previous", "close"],
        disableButtons: isFirst ? ["previous"] : [],
        showProgress: true,
        progressText: `${index + 1} of ${total}`,
        nextBtnText: config.nextBtnText,
        prevBtnText: "← Back",
        onPopoverRender: (popoverDOM) => {
          this.cleanupSpeechSubscription();

          this.renderBranch(popoverDOM.wrapper, popoverDOM.footer, config.branch, index);

          let badge = popoverDOM.wrapper.querySelector<HTMLButtonElement>(
            ".tour-speaker-status-badge",
          );
          if (!badge) {
            badge = document.createElement("button");
            badge.type = "button";
            badge.className = "tour-speaker-status-badge";
            badge.setAttribute("aria-label", "Tour speech status");
            if (popoverDOM.title && popoverDOM.title.parentNode) {
              popoverDOM.wrapper.insertBefore(badge, popoverDOM.title);
            } else {
              popoverDOM.wrapper.prepend(badge);
            }
          }

          const updateBadge = (state: SpeechState) => {
            if (!badge) return;
            badge.className = `tour-speaker-status-badge ${state}`;
            if (state === "speaking") {
              badge.innerHTML = `<span class="tour-pulse-dot"></span><span>🔊 Voice: Speaking...</span>`;
              badge.title = "Audio guide is playing (Click to mute)";
            } else if (state === "finished") {
              badge.innerHTML = `<span>✓ Voice: Finished</span>`;
              badge.title = "Audio guide completed (Click to replay)";
            } else if (state === "muted") {
              badge.innerHTML = `<span>🔇 Voice: Muted</span>`;
              badge.title = "Audio is muted (Click to unmute and play)";
            } else {
              badge.innerHTML = `<span>🔈 Voice: Ready</span>`;
              badge.title = "Click to play audio guidance";
            }
          };

          badge.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            tourSpeech.prime();
            const currentState = tourSpeech.getState();
            const currentlyMuted = useTourStore.getState().isAudioMuted;

            if (currentState === "finished" && !currentlyMuted) {
              tourSpeech.speak(speech, false);
              return;
            }

            useTourStore.getState().toggleAudioMute();
          };

          this.currentSpeechUnsub = tourSpeech.onStateChange((state) => {
            updateBadge(state);
          });
        },
        onNextClick: () => {
          this.cleanupSpeechSubscription();
          tourSpeech.stop();
          config.onNext();
        },
        onPrevClick: () => {
          this.cleanupSpeechSubscription();
          tourSpeech.stop();
          config.onPrev();
        },
        onCloseClick: () => {
          this.cleanupSpeechSubscription();
          this.stopTour();
        },
      },
    });

    const isMuted = useTourStore.getState().isAudioMuted;
    tourSpeech.speak(speech, isMuted);
  }

  public completeTour() {
    const finishedTour = this.currentTour;
    if (finishedTour) {
      useTourStore.getState().markTourCompleted(finishedTour.id);
    }

    if (this.resumeContext) {
      const { tourId, stepIndex } = this.resumeContext;
      this.resumeContext = null;
      const parentTour = TOURS_REGISTRY[tourId];
      toast.success(
        `${finishedTour?.name || "Guide"} complete! Resuming ${parentTour.name}...`,
      );
      void this.startTour(parentTour, stepIndex, null);
      return;
    }

    this.stopTour();
  }

  public stopTour(clearResume = true) {
    this.cleanupSpeechSubscription();
    tourSpeech.stop();
    this.stepToken += 1;
    this.clearPendingHint();
    if (clearResume) {
      this.resumeContext = null;
      this.tourProjectId = null;
    }
    if (this.driverObj) {
      const activeDriver = this.driverObj;
      this.driverObj = null;
      this.currentTour = null;
      activeDriver.destroy();
      return;
    }
    this.currentTour = null;
  }
}

export const tourCoordinator = new TourCoordinator();
