const AVATAR_ATLAS_SIZE = 480;
const CONTAINER_ATLAS_SIZE = 800;
const AVATAR_SIZE = 48;
const CONTAINER_SIZE = 80;
const AVATAR_COUNT = AVATAR_ATLAS_SIZE / AVATAR_SIZE;
const CONTAINER_COUNT = CONTAINER_ATLAS_SIZE / CONTAINER_SIZE;

/**
 * Calculate the offsets for the avatar or container atlas in percent
 * @param atlas
 * @param index
 */
export const calculateAtlasOffsets = (atlas: "avatar" | "container", index: number) => {

  const size = atlas === "avatar" ? AVATAR_SIZE : CONTAINER_SIZE;
  const atlasSize = atlas === "avatar" ? AVATAR_ATLAS_SIZE : CONTAINER_ATLAS_SIZE;
  const columns = atlasSize / size;
  const row = Math.floor(index / columns);
  const column = index % columns;
  return {
    x: column * size,
    y: row * size
  };
};

export const wrapOffsetAsStyle = (atlas: "avatar" | "container", offset: { x: number, y: number }, containerSize: string) => {
  return `
    background-position: calc(-${offset.x} / 80 * ${containerSize}) calc(-${offset.y} / 80 * ${containerSize}); 
    background-size: calc(${atlas === "avatar" ? AVATAR_COUNT : CONTAINER_COUNT} * calc(${atlas === "avatar" ? 48/80 : 1} * ${containerSize}));
  `;
};