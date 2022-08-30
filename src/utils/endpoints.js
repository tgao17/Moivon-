// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

import { objectToQueryParams } from "./helpers";

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: ({ genre = "all" }) => ["events", genre],
  QUERY_RELATED_EVENTS: () => ["relatedEvents"],
  QUERY_UPCOMING_EVENTS: () => ["upcomingEvents"],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
  QUERY_HERO_SLIDER: () => ["heroSlider"],
  QUERY_MOST_POPULAR: () => ["mostPopular"],
};

export const ALL_ENDPOINTS = {
  BUILD_ALL_EVENTS: ({ page = 1, perPage = 10, genreId }) => {
    let url = `/events?published=true&page=${page}&size=${perPage}`;
    if (genreId !== "all") {
      url += `&genreId=${genreId}`;
    }
    return url;
  },
  BUILD_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}`,
  BUILD_RELATED_EVENTS: () => "/events?size=3&published=true",
  BUILD_UPCOMING_EVENTS: () =>
    `/events?size=10&published=true&upComing=true&sort=upComingSeq&order=asc`,
  BUILD_MOST_POPULAR_EVENTS: () =>
    `/events?size=10&published=true&mostPopular=true&sort=mostPopularSeq&order=asc`,
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

  // genres
  BUILD_FETCH_ALL_GENRES: () => `/genres`,
};
