import path from 'path'
import type { BranchConfig, Package } from './types'

// TODO: List your npm packages here. The first package will be used as the versioner.
export const packages: Package[] = [
  { name: 'raymondboswel/stencil-query', packageDir: 'stencil-query', srcDir: 'src' },
]

export const latestBranch = 'main'

export const branchConfigs: Record<string, BranchConfig> = {
  main: {
    prerelease: false,
    ghRelease: true,
  },
  next: {
    prerelease: true,
    ghRelease: true,
  },
  beta: {
    prerelease: true,
    ghRelease: true,
  },
  alpha: {
    prerelease: true,
    ghRelease: true,
  },
}

export const rootDir = path.resolve(__dirname, '..')
export const examplesDirs = ['examples/react']
