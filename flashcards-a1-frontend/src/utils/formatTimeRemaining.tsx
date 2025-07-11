const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return 'Ahora mismo';

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  let parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} día${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  }
  if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) return 'Ahora mismo';

  let result = '';
  if (parts.length === 1) {
    result = parts[0];
  } else if (parts.length === 2) {
    result = `${parts[0]} y ${parts[1]}`;
  } else {
    const lastPart = parts.pop();
    result = `${parts.join(', ')} y ${lastPart}`;
  }

  return `en ${result}`;
};

export { formatTimeRemaining }; 