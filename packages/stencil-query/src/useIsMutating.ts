import type { MutationKey, MutationFilters } from '@tanstack/query-core'
import { parseMutationFilterArgs } from '@tanstack/query-core'
import type { StoreOptions } from './types'
import { useQueryClient } from './QueryClientProvider'
import { createStore } from '@stencil/store'

interface Options extends StoreOptions {}

export function useIsMutating(
  filters?: MutationFilters,
  options?: Options,
): number
export function useIsMutating(
  mutationKey?: MutationKey,
  filters?: Omit<MutationFilters, 'mutationKey'>,
  options?: Options,
): number
export function useIsMutating(
  arg1?: MutationKey | MutationFilters,
  arg2?: Omit<MutationFilters, 'mutationKey'> | Options,
  arg3?: Options,
): number {
  const [filters, options = {}] = parseMutationFilterArgs(arg1, arg2, arg3)

  const queryClient = useQueryClient({ store: options.store })
  const mutationCache = queryClient.getMutationCache()

  const isMutatingStore = createStore(
    {mutations: queryClient.isMutating(filters)}
  )

  //TODO: Handle unsubscribe
  mutationCache.subscribe((_result) => {
    isMutatingStore.state.mutations = queryClient.isMutating(filters)
  });

  return isMutatingStore.state.mutations
}
