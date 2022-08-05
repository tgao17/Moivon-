// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: () => ["events"],
  QUERY_RELATED_EVENTS: () => ["relatedEvents"],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
};

export const ALL_ENDPOINTS = {
  BUILD_ALL_EVENTS: () => "/events",
  BUILD_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}`,
  BUILD_RELATED_EVENTS: () => "/events?size=3",
  BUILD_POST_QUERY: () => `/queries`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_ALL_GENRES: () => `/genres`,
};
