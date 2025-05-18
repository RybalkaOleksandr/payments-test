import { IOwnApiOptions, IRequestCacheOptions } from '@modules/common/types';

import { setCanceler } from './setCanceler';

export const getAxiosCacheOptions = (options: IOwnApiOptions | undefined): IRequestCacheOptions | {} => {
  return options
    ? {
        ...setCanceler({ setCancel: options.setCancel }),
        cache: options.cache,
      }
    : {};
};
