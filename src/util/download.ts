export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const downloadText = (text: string, filename: string) => {
  const blob = new Blob([text], {type: "text/plain"});
  downloadBlob(blob, filename);
};