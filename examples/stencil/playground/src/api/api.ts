let errorRate = 0.05;
let queryTimeMin = 1000;
let queryTimeMax = 2000;

let id = 0;
let list = [
  "apple",
  "banana",
  "pineapple",
  "grapefruit",
  "dragonfruit",
  "grapes",
].map((d) => ({ id: id++, name: d, notes: "These are some notes" }));


export function fetchTodos({ signal, queryKey: [, { filter }] }) {
  console.info("fetchTodos", { filter });

  if (signal) {
    signal.addEventListener("abort", () => {
      console.info("cancelled", filter);
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        return reject(
          new Error(JSON.stringify({ fetchTodos: { filter } }, null, 2))
        );
      }
      resolve(list.filter((d) => d.name.includes(filter)));
    }, queryTimeMin + Math.random() * (queryTimeMax - queryTimeMin));
  });
}

export function fetchTodoById({ id }) {
  console.info("fetchTodoById", { id });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        return reject(
          new Error(JSON.stringify({ fetchTodoById: { id } }, null, 2))
        );
      }
      resolve(list.find((d) => d.id === id));
    }, queryTimeMin + Math.random() * (queryTimeMax - queryTimeMin));
  });
}

export function postTodo({ name, notes }) {
  console.info("postTodo", { name, notes });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        return reject(
          new Error(JSON.stringify({ postTodo: { name, notes } }, null, 2))
        );
      }
      const todo = { name, notes, id: id++ };
      list = [...list, todo];
      resolve(todo);
    }, queryTimeMin + Math.random() * (queryTimeMax - queryTimeMin));
  });
}

export function patchTodo(todo) {
  console.info("patchTodo", todo);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        return reject(new Error(JSON.stringify({ patchTodo: todo }, null, 2)));
      }
      list = list.map((d) => {
        if (d.id === todo.id) {
          return todo;
        }
        return d;
      });
      resolve(todo);
    }, queryTimeMin + Math.random() * (queryTimeMax - queryTimeMin));
  });
}
