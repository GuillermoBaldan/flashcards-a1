const formatDateToLocaleString = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('es-ES', options);
};

export { formatDateToLocaleString }; 