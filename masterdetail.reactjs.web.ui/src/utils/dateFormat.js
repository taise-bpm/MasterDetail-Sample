// Minimal, dependency-free date format/parse engine supporting the token set
// this app needs: yyyy, MMM (Jan/Feb/...), MM, dd, HH, mm, ss. A production
// app would likely reach for date-fns/dayjs instead; this is deliberately
// small and self-contained for a prototype.
//
// The point of it: a field's *API format* (what's actually stored/submitted,
// e.g. a legacy backend's "dd-MM-yyyy") and its *display format* (what a
// human reads, e.g. "31 Aug 2026") are independent of each other and of
// whatever format the native <input type="date"> picker itself requires
// (always "yyyy-MM-dd"). These helpers convert between all three.

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TOKEN_RE = /yyyy|MMM|MM|dd|HH|mm|ss/g;
const TOKEN_LENGTH = { yyyy: 4, MMM: 3, MM: 2, dd: 2, HH: 2, mm: 2, ss: 2 };

const pad = (n) => String(n).padStart(2, '0');

// Formats a real Date object using `pattern`. Returns '' for anything else,
// so callers can pass a possibly-null parse result straight through.
export const formatDate = (date, pattern) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const tokens = {
    yyyy: date.getFullYear(),
    MMM: MONTH_NAMES[date.getMonth()],
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };
  return pattern.replace(TOKEN_RE, (token) => tokens[token]);
};

// Parses a string written in `pattern` back into a Date, by walking the
// pattern's tokens and slicing the same-length pieces out of `value` at the
// matching positions (tokens are fixed-width, so this works for any
// numeric-only pattern - MMM is format-only and not parsed back).
export const parseFormattedDate = (value, pattern) => {
  if (!value) return null;
  const parts = {};
  let valueIndex = 0;
  let lastPatternIndex = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(pattern))) {
    const literal = pattern.slice(lastPatternIndex, match.index);
    valueIndex += literal.length;
    const token = match[0];
    const length = TOKEN_LENGTH[token];
    parts[token] = value.slice(valueIndex, valueIndex + length);
    valueIndex += length;
    lastPatternIndex = match.index + token.length;
  }
  if (!parts.yyyy || !parts.MM || !parts.dd) return null;
  const date = new Date(
    Number(parts.yyyy),
    Number(parts.MM) - 1,
    Number(parts.dd),
    Number(parts.HH || 0),
    Number(parts.mm || 0),
    Number(parts.ss || 0)
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

// Convenience compositions for the two conversions controls actually need.
export const apiValueToNative = (apiValue, apiFormat, nativeFormat) => {
  const date = parseFormattedDate(apiValue, apiFormat);
  return date ? formatDate(date, nativeFormat) : '';
};

export const nativeValueToApi = (nativeValue, apiFormat, nativeFormat) => {
  const date = parseFormattedDate(nativeValue, nativeFormat);
  return date ? formatDate(date, apiFormat) : '';
};

export const formatForDisplay = (apiValue, apiFormat, displayFormat) => {
  const date = parseFormattedDate(apiValue, apiFormat);
  return date ? formatDate(date, displayFormat) : apiValue ?? '';
};
