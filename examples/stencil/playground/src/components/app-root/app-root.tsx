import { Component, h, State } from '@stencil/core';
import { QueryClient, QueryObserverResult, useQueryClient, initializeQueryClientStore } from '@tanstack/stencil-query';
import { Todo } from '../types';

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
  state: QueryObserverResult<Todo[], unknown>;

  @State() editingIndex: number = null;

  initialFilter = ["", "fruit", "grape"]

 componentWillLoad() {
  initializeQueryClientStore(this.queryClient);
 }

  render() {
    const queryClient = useQueryClient();
    return (
      <div class="App">
      <div>
        <button onClick={() => queryClient.invalidateQueries()}>
          Force Refetch All
        </button>
      </div>
      <br />
      <hr />
      {this.initialFilter.map((view, index) => (
        <div key={index}>
          <app-todos
            filter={view}
            onEditItem={(e) => this.editingIndex = e.detail}
          ></app-todos>
          <br />
        </div>
      ))}
      {/* <button
        onClick={() => {
          setViews((old) => [...old, ""]);
        }}
      >
        Add Filter List
      </button> */}
      <hr />
      {this.editingIndex !== null ? (
        <section>

          <edit-todo
            editingIndex={this.editingIndex}
          ></edit-todo>
          <hr />
        </section>
      ) : null}
     {/*  <AddTodo /> */}
    </div>
    );
  }

  // "API" //


}
