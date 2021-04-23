export default function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return [hours, seconds, minutes]
    .map((unit) => {
      return String(unit).padStart(2, '0');
    })
    .join(':');
}
