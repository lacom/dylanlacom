const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatCardDate = (isoDate: string) => SHORT_DATE_FORMATTER.format(new Date(isoDate));

export const formatPostDate = (isoDate: string) => LONG_DATE_FORMATTER.format(new Date(isoDate));
