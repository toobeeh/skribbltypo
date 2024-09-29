export const chooseFile = async (accept: string, multiple: boolean): Promise<FileList | null> => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.click();
  return new Promise<FileList | null>((resolve) => {
    input.onchange = () => {
      if(input.files && input.files.length > 0){
        resolve(input.files);
      } else {
        resolve(null);
      }
    };
  });
};