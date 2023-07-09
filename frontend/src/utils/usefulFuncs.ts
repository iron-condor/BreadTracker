export const getTimeLabel = (duration: number): string => {
  let ms = duration % 1000;
  duration = (duration - ms) / 1000;
  let secs = duration % 60;
  duration = (duration - secs) / 60;
  let mins = duration % 60;
  let hrs = (duration - mins) / 60;

  let str = "";
  if (hrs != 0) {
    str += hrs + " hour" + (hrs > 1 ? "s " : " ");
  }
  if (mins != 0) {
    str += mins + " minute" + (mins > 1 ? "s " : " ");
  }
  if (secs != 0) {
    str += secs + " second" + (secs > 1 ? "s " : " ");
  }
  return str;
}

export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result?.toString() ?? "");
  reader.onerror = reject;
});