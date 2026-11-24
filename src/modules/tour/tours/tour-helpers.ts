import type { TourClickConfig, TourPanelConfig } from "../tour.types";

export const PROJECT_ROUTE = "/projects/:projectId";

/** CSS selector for a `data-tour` anchor. */
export const anchor = (tourId: string) => `[data-tour="${tourId}"]`;

/** Same, ignoring disabled controls (they can't be clicked to move on). */
export const enabledAnchor = (tourId: string) => `${anchor(tourId)}:not(:disabled)`;

/** A "click here" hint; `what` completes the sentence before the Next reminder. */
export const click = (
  element: string,
  title: string,
  what: string,
  optional = false,
): TourClickConfig => ({
  element,
  title,
  description: `${what} Click it yourself, or press Next and we'll do it for you.`,
  speechText: `${title}.`,
  optional,
});

/** A modal opened by a button. Closed through the shared Modal's backdrop. */
export const modal = (tourId: string, open: TourClickConfig, close?: string): TourPanelConfig => ({
  element: anchor(tourId),
  open,
  close,
});
