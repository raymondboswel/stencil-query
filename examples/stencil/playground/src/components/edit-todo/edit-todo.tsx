import { Component, h, Prop, Watch } from '@stencil/core';
import { createQuery, createMutation, QueryObserverResult, useQueryClient, TData, TError } from '@tanstack/stencil-query';
import { fetchTodoById, patchTodo } from '../../api/api';

@Component({
  tag: 'edit-todo',
  shadow: true,
})
export class EditTodo {

  @Prop({mutable: true}) editingIndex: number;

  todo: any;

  todoQuery: QueryObserverResult<TData, TError>;
  queryClient = useQueryClient();

  saveMutation;

  componentWillLoad() {
    this.useTodo();
    this.todoMutation();
  }

  @Watch("editingIndex")
  todoMutation() {
    console.log("Updating mutation")
    this.saveMutation = createMutation({
      mutationFn: patchTodo,
      onSuccess: (data) => {
        // Update `todos` and the individual todo queries when this mutation succeeds
        this.queryClient.invalidateQueries({ queryKey: ["todos"] });
        this.queryClient.setQueryData(["todo", { id: this.editingIndex }], data);
      },
    });
  }

  @Watch("editingIndex")
  useTodo() {
   this.todoQuery =  createQuery({
      queryKey: ["todo", { id: this.editingIndex }],
      queryFn: () => fetchTodoById({ id: this.editingIndex }),
      enabled: this.editingIndex !== null,
    });
  }

  onSave = () => {
    this.saveMutation.mutate(this.todo);
  };

  render() {
    console.log("Query", this.todoQuery.result)
    const data = this.todoQuery.result.data;
    const status = this.todoQuery.result.status;
    const error = this.todoQuery.result.error;
    const refetch = this.todoQuery.result.refetch;
    const failureCount = this.todoQuery.result.failureCount;
    const isFetching = this.todoQuery.result.isFetching;
    const disableEditSave =
    status === "loading" || this.saveMutation.status === "loading";
    this.todo = {...data};
    return (
      <div>
      <div>
        {this.todoQuery.result.data ? (
            <section>
            <button onClick={() => this.editingIndex = null}>Back</button>
            <span >Editing Todo "{data.name}" (#
            {this.editingIndex})</span>
            </section>

        ) : null}
      </div>
      {status === "loading" ? (
        <span>Loading... (Attempt: {failureCount + 1})</span>
      ) : error ? (
        <span>
          Error! <button onClick={() => refetch()}>Retry</button>
        </span>
      ) : (
        <section>
          <label>
            Name:{" "}
            <input
              value={data.name}
              onChange={(e) =>
                this.todo = { ...this.todo, name: (e.target as any).value }
              }
              disabled={disableEditSave}
            />
          </label>
          <label>
            Notes:{" "}
            <input
              value={this.todo.notes}
              onChange={(e) =>
                this.todo = { ...this.todo, notes: (e.target as any).value }
              }
              disabled={disableEditSave}
            />
          </label>
          <div>
            <button onClick={() => this.onSave()} disabled={disableEditSave}>
              Save
            </button>
          </div>
          <div>
            {this.saveMutation.status === "loading"
              ? "Saving..."
              : this.saveMutation.status === "error"
              ? this.saveMutation.error.message
              : "Saved!"}
          </div>
          <div>
            {isFetching ? (
              <span>
                Background Refreshing... (Attempt: {failureCount + 1})
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
