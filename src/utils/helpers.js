export const formatCurrency = (price, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);

export const checkMaxFileSize = (size, max_size) => {
  const sizeInMB = size / 1024 / 1024;
  return sizeInMB < max_size;
};

export const isEmpty = (param) => (param ? !Object.keys(param).length : true);

export const calculateTotalPagesCount = (pageSize, totalCount) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};

export const getMapsLocation = (location) => {
  if (!location) return null;
  if (typeof location !== "string") return null;

  if (isValidURL(location)) {
    return location;
  }

  return `https://www.google.com/maps/place/${encodeURIComponent(location)}`;
};

export function isValidURL(string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

export const objectToQueryParams = (obj) =>
  Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join("&");

export const toTitleCase = (phrase) => {
  if (!phrase) return null;
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
