import { parseFilterArgs, QueryFilters, QueryKey } from '@tanstack/query-core'

import { useQueryClient } from './QueryClientProvider'
import { StoreOptions } from './types'


interface Options extends StoreOptions {}

export function useIsFetching(
  filters?: QueryFilters,
  options?: Options,
): number
export function useIsFetching(
  queryKey?: QueryKey,
  filters?: QueryFilters,
  options?: Options,
): number
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters | Options,
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
