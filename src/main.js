import Vue from 'vue';
import moment from 'moment';
import Todo from './Todo';

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('prod-app') || '[]');
  todos.forEach(todo => {
    todo.counts.forEach(count => {
      count.duration = moment.duration(count.duration);
      count.time = moment(count.time);
    });
  });
  return todos;
}

new Vue({
  el: '#app',
	data: {
		text: '',
		todos: loadTodos()
	},
  components: {
    Todo
  },
  template: `
    <div class="container">
      <p class="control">
        <input type="text"
               placeholder="Add a task"
               class="input is-medium"
               v-model="text"
               v-on:keydown.enter="addTodo">
      </p>
      <ul>
        <transition-group name="list">
          <li v-for="(todo, index) in todos" :key="index">
            <Todo
              :todo="todo"
              :index="index"
              :onIncrementCount="incrementCount"
              :onDecrementCount="decrementCount"
              :onRemoveTodo="removeTodo"
            />
          </li>
        </transition-group>
      </ul>
    </div>
  `,
	methods: {
		addTodo() {
			const text = this.text.trim();
			if (!text) return;
			this.todos.push({text, counts: []});
			this.text = '';
		},

		removeTodo(index) {
			this.todos.splice(index, 1);
		},

		incrementCount(index, count) {
			this.todos[index].counts.push(count);
		},

		decrementCount(index) {
			this.todos[index].counts.pop();
		},
	},
	watch: {
		todos: {
      handler(todos) {
				localStorage.setItem('prod-app', JSON.stringify(todos));
        console.log(localStorage.getItem('prod-app'));
      },
      deep: true
		}
	}
});
