// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

import { objectToQueryParams } from "./helpers";

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: () => ["events"],
  QUERY_RELATED_EVENTS: () => ["relatedEvents"],
  QUERY_UPCOMING_EVENTS: () => ["upcomingEvents"],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
  QUERY_HERO_SLIDER: () => ["heroSlider"],
};

export const ALL_ENDPOINTS = {
  BUILD_ALL_EVENTS: ({ page = 1, perPage = 10 }) =>
    `/events?published=true&page=${page}&size=${perPage}`,
  BUILD_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}`,
  BUILD_RELATED_EVENTS: () => "/events?size=3&published=true",
  BUILD_UPCOMING_EVENTS: (
    startDate = new Date(new Date().setHours(0, 0, 0, 0))
  ) => `/events?size=10&published=true&startDate=${startDate}`,
  BUILD_POST_QUERY: () => `/queries`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_ALL_GENRES: () => `/genres`,
  BUILD_HERO_SLIDER: ({ page, size }) => {
    const data = {
      page,
      size,
    };
    const qs = `?${objectToQueryParams(data)}`;
    return "/heroimage" + qs;
  },
};