import type { QueryFilters } from '@tanstack/query-core'

import type { StoreOptions, SolidQueryKey, SolidQueryFilters } from './types'
import { useQueryClient } from './QueryClientProvider'
import { parseFilterArgs } from './utils'

interface Options extends StoreOptions {}

export function useIsFetching(
  filters?: SolidQueryFilters,
  options?: Options,
): number
export function useIsFetching(
  queryKey?: SolidQueryKey,
  filters?: SolidQueryFilters,
  options?: Options,
): number
export function useIsFetching(
  arg1?: SolidQueryKey | SolidQueryFilters,
  arg2?: SolidQueryFilters | Options,
  arg3?: Options,
): number {
  const [filters, options = {}] = parseFilterArgs(arg1, arg2, arg3)
  const queryClient = useQueryClient({ store: options.store })

/*   const queryCache = queryClient.getQueryCache() */

  /* const fetchesStore = createStore(
    {isFetching: queryClient.isFetching(filters as QueryFilters)}
  )

  const unsubscribe = queryCache.subscribe(() => {
    fetchesStore.state.isFetching = queryClient.isFetching(filters as QueryFilters)
  }) */

  return queryClient.isFetching(filters as QueryFilters)
}
