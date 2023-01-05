import { Component, h } from '@stencil/core';
import { QueryClient, QueryObserverResult, TData, TError, createQuery, QueryClientProvider } from '@tanstack/stencil-query';

type Post = {
  id: number
  title: string
  body: string
}

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
  state: QueryObserverResult<TData, TError>;

  componentWillLoad() {
    QueryClientProvider(this.queryClient);
    this.state = this.usePosts()
  }

  usePosts() {
    return createQuery({
      queryKey: () => ['posts'],
      queryFn: async (): Promise<Array<Post>> => {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts',
          {
            method: 'GET',
          },
        )
        return response.json()
      },
    });
  }

  render() {
    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>
        {this.state.result && <main>
          {this.state.result.status === 'loading' ?
            <div>Loading...</div>
            : <div>
              {this.state.result.error instanceof Error ?
                <div>Error</div>
                : <div>
                  {this.state.result.data.map(post => <p>
                    {post.title}
                  </p>)}
                </div>
              }
            </div>
          }
        </main>}
      </div>
    );
  }
}
