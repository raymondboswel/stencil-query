import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { createQuery, QueryObserverResult, TData, TError } from '@tanstack/stencil-query';
import { fetchTodos } from '../../api/api';

@Component({
  tag: 'app-todos',
  shadow: true,
})
export class AppRoot {

  @Prop({ mutable: true }) filter: string;
  @Event() editItem: EventEmitter<number>;

  todosQuery: QueryObserverResult<TData, TError>;;

  componentWillLoad() {
    this.todosQuery = this.useTodos()
  }

  useTodos() {
    return createQuery({
      queryKey: ['todos', { filter: this.filter }],
      queryFn: fetchTodos
    });
  }

  render() {
    console.log("Query", this.todosQuery.result)
    return (
      <div>
        <div>
          <label>
            Filter:{" "}
            <input value={this.filter} onChange={(e) => this.filter = (e.target as any).value} />
          </label>
        </div>
        {this.todosQuery.status === "loading" ? (
          <span>Loading... (Attempt: {this.todosQuery.result.failureCount + 1})</span>
        ) : this.todosQuery.status === "error" ? (
          <span>
            Error: {this.todosQuery.result.error.message}
            <br />
            <button onClick={() => this.todosQuery.refetch()}>Retry</button>
          </span>
        ) : (
          <section>
            <ul>
              {this.todosQuery.result?.data
                ? this.todosQuery.result.data.map((todo) => (
                  <li key={todo.id}>
                    {todo.name}{" "}
                    <button onClick={() => this.editItem.emit(todo.id)}>
                      Edit
                    </button>
                  </li>
                ))
                : null}
            </ul>
            <div>
              {this.todosQuery.isFetching ? (
                <span>
                  Background Refreshing... (Attempt: {this.todosQuery.failureCount + 1})
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }
}
