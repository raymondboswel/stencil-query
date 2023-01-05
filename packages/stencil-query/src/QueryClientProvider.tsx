import { createStore, ObservableMap } from '@stencil/store';
import type { QueryClient } from '@tanstack/query-core'
import type { StoreOptions } from './types'

declare global {
  interface Window {
    StencilQueryClientStore?: ObservableMap<{client: QueryClient | undefined}>
  }
}

export const defaultStore = createStore<{client: QueryClient | undefined}>({client: undefined})
const queryClientSharingStore = createStore({shareQueryClient: false})

// If we are given a context, we will use it.
// Otherwise, if contextSharing is on, we share the first and at least one
// instance of the context across the window
// to ensure that if Stencil Query is used across
// different bundles or microfrontends they will
// all use the same **instance** of context, regardless
// of module scoping.
function getQueryClientStore(
  store: ObservableMap<{client: QueryClient | undefined}> | undefined,
  storeSharing: boolean,
) {
  if (store) {
    return store
  }
  if (storeSharing && typeof window !== 'undefined') {
    if (!window.StencilQueryClientStore) {
      window.StencilQueryClientStore = defaultStore;
    }

    return window.StencilQueryClientStore
  }

  return defaultStore
}

export const useQueryClient = ({ store }: StoreOptions = {}) => {
  const queryClient = getQueryClientStore(store, queryClientSharingStore.state.shareQueryClient).state.client


  if (!queryClient) {
    throw new Error('No QueryClient set, use initializeQueryClientStore to set one')
  }

  return queryClient
}

type QueryClientProviderPropsBase = {
  client: QueryClient
  children?: JSX.Element
}
type QueryClientProviderPropsWithContext = StoreOptions & {
  contextSharing?: never
} & QueryClientProviderPropsBase
type QueryClientProviderPropsWithContextSharing = {
  context?: never
  contextSharing?: boolean
} & QueryClientProviderPropsBase

export type QueryClientProviderProps =
  | QueryClientProviderPropsWithContext
  | QueryClientProviderPropsWithContextSharing


export function initializeQueryClientStore(client: QueryClient) {
  const clientStore = getQueryClientStore(undefined, true);
  clientStore.state.client = client;
}


