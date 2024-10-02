export interface cloudMeta {
  author: string,
  name: string,
  private: boolean,
  own: boolean,
  language: string,
  login: number,
  date: string
}

export const getCloudMeta = async (url: string) => {
  return await(await fetch(url)).json() as cloudMeta;
};