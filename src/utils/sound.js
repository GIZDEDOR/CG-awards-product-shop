import { ASSET_PATH } from "../data/products";

export function playSound(file, volume = 0.28) {
  const audio = new Audio(`${ASSET_PATH}${file}`);
  audio.volume = volume;
  audio.play().catch(() => {});
}
