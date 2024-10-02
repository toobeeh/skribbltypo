export const getCloudCommands = async (url: string) => {
  return await(await fetch(url)).json() as number[][];
};