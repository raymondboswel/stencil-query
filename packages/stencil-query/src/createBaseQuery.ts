import type { QueryObserver } from '@tanstack/query-core'
import type { QueryKey, QueryObserverResult } from '@tanstack/query-core'
import type { CreateBaseQueryOptions } from './types'
import { useQueryClient } from './QueryClientProvider'
import { createStore } from '@stencil/store'

// Base Query Function that is used to create the query.
export function createBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
>(
  options: CreateBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver,
): {result: QueryObserverResult<TData, TError>} {
  const queryClient = useQueryClient()
  const defaultedOptions = queryClient.defaultQueryOptions(options)
  defaultedOptions._optimisticResults = 'optimistic'
  const observer = new Observer(queryClient, defaultedOptions)
  const optimisticResult = observer.getOptimisticResult(defaultedOptions)
  let { state } = createStore<{result: QueryObserverResult<TData, TError>}>(
    // @ts-ignore
    {result: optimisticResult}
  )

  observer.subscribe(result => {
    state.result = result;
  })

  return state
}
