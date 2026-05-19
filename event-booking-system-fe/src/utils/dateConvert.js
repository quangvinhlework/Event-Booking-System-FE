export function formatTimestamp(timestamp) {
  if (timestamp === null || timestamp === undefined || Number.isNaN(Number(timestamp))) {
    return '';
  }

  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (value) => String(value).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function dateToTimestamp(date) {
  if (!date) return null;
  return new Date(date).getTime();
}

export function timestampToDateForUpdateModal(timestamp){
  if (!timestamp) return '';

  const date = new Date(timestamp);

  const pad = (num) => String(num).padStart(2, '0');

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}
