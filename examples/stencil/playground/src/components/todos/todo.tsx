import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { createQuery, QueryObserverResult } from '@tanstack/stencil-query';
import { fetchTodos } from '../../api/api';
import { Todo } from '../types';

@Component({
  tag: 'app-todos',
  shadow: true,
})
export class AppTodos {

  @Prop({ mutable: true }) filter: string;
  @Event() editItem: EventEmitter<number>;

  todosQuery: {result: QueryObserverResult<Todo[], {message: string}>};

  componentWillLoad() {
    this.todosQuery = this.useTodos()
  }

  useTodos() {
    return createQuery<Todo[], {message: string} >({
      queryKey: ['todos', { filter: this.filter }],
      queryFn: ({signal, queryKey}) => fetchTodos({signal, queryKey: queryKey as any}),
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
        {this.todosQuery.result.status === "loading" ? (
          <span>Loading... (Attempt: {this.todosQuery.result.failureCount + 1})</span>
        ) : this.todosQuery.result.status === "error" ? (
          <span>
            Error: {this.todosQuery.result.error.message}
            <br />
            <button onClick={() => this.todosQuery.result.refetch()}>Retry</button>
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
              {this.todosQuery.result.isFetching ? (
                <span>
                  Background Refreshing... (Attempt: {this.todosQuery.result.failureCount + 1})
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
