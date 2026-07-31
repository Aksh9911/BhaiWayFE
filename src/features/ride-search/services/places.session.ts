/** Session token groups Autocomplete + Place Details for Places API (New) billing/ranking. */
export const createPlacesSessionToken = (): string => {
  const random = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return `${time}-${random}`;
};
