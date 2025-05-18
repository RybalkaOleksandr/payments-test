import { IOptions } from "@modules/common/types";

export const setCanceler = (options: IOptions): { signal: AbortSignal } => {
  const controller = new AbortController();

  if (options.setCancel) {
    options.setCancel(() => controller.abort());
  }

  return { signal: controller.signal };
};
