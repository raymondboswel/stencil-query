import { createStore } from '@stencil/store'

const isRestoringStore = createStore({isRestoring: false})

export const useIsRestoring = () => isRestoringStore.state.isRestoring

