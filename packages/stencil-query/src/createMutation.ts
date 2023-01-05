import { createStore } from '@stencil/store'
import type { MutationFunction, MutationKey } from '@tanstack/query-core'
import { parseMutationArgs, MutationObserver } from '@tanstack/query-core'
import { useQueryClient } from './QueryClientProvider'
import type {
  CreateMutateFunction,
  CreateMutationOptions,
  CreateMutationResult,
} from './types'
import { shouldThrowError } from './utils'

// HOOK
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
>(
  options: CreateMutationOptions<TData, TError, TVariables, TStore>,
): CreateMutationResult<TData, TError, TVariables, TStore>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    CreateMutationOptions<TData, TError, TVariables, TStore>,
    'mutationFn'
  >,
): CreateMutationResult<TData, TError, TVariables, TStore>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
>(
  mutationKey: MutationKey,
  options?: Omit<
    CreateMutationOptions<TData, TError, TVariables, TStore>,
    'mutationKey'
  >,
): CreateMutationResult<TData, TError, TVariables, TStore>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    CreateMutationOptions<TData, TError, TVariables, TStore>,
    'mutationKey' | 'mutationFn'
  >,
): CreateMutationResult<TData, TError, TVariables, TStore>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | CreateMutationOptions<TData, TError, TVariables, TStore>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | CreateMutationOptions<TData, TError, TVariables, TStore>,
  arg3?: CreateMutationOptions<TData, TError, TVariables, TStore>,
): CreateMutationResult<TData, TError, TVariables, TStore> {
  const argsStore = createStore({args: parseMutationArgs(arg1, arg2, arg3)})
  const queryClient = useQueryClient({ store: argsStore.state.args.store })

  const observer = new MutationObserver<TData, TError, TVariables, TStore>(
    queryClient,
    argsStore.state.args,
  )

  const mutate: CreateMutateFunction<TData, TError, TVariables, TStore> = (
    variables,
    mutateOptions,
  ) => {
    observer.mutate(variables, mutateOptions).catch(noop)
  }

  const mutationResultStore = createStore<
    CreateMutationResult<TData, TError, TVariables, TStore>
  >({
    ...observer.getCurrentResult(),
    mutate,
    mutateAsync: observer.getCurrentResult().mutate,
  })

  mutationResultStore.onChange('status', (_newValue) => {
    if(mutationResultStore.state.isError && shouldThrowError(observer.options.useErrorBoundary, [mutationResultStore.state.error])) {
      throw mutationResultStore.state.error;
    }
  })

  //TODO: Maybe return the unsubscribe function to the calling context?
  observer.subscribe((result) => {
    mutationResultStore.state = {...result, mutate, mutateAsync: result.mutate}
  })


  return mutationResultStore.state
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
