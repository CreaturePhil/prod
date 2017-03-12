import Vue from 'vue';
import moment from 'moment';
import Todo from './Todo';
import {totalDuration, totalCount} from './total';

function loadTodos() {
  let todos = [];
  try {
    todos = JSON.parse(localStorage.getItem('prod-app') || '[]');
  } catch (e) {
    console.error(e);
  }
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
      <div class="notification">
        <strong>prod</strong>
        <span class="tag is-info push-right ver-align-bot">
          Today's Count: {{todayCount.length}}
        </span>
        <span class="tag is-info push-right ver-align-bot">
          Today's Duration: {{todayDuration}}
        </span>
        <span class="tag is-warning push-right ver-align-bot">
          Week's Count: {{weekCount.length}}
        </span>
        <span class="tag is-warning push-right ver-align-bot">
          Week's Duration: {{weekDuration}}
        </span>
        <span class="tag is-danger push-right ver-align-bot">
          Month's Count: {{monthCount.length}}
        </span>
        <span class="tag is-danger push-right ver-align-bot">
          Month's Duration: {{monthDuration}}
        </span>
      </div>
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
  computed: {
    todayCount() {
      return totalCount(this.todos.map(todo => todo.counts));
    },
    todayDuration() {
      return totalDuration(this.todayCount);
    },
    weekCount() {
      return totalCount(this.todos.map(todo => todo.counts), 'week');
    },
    weekDuration() {
      return totalDuration(this.weekCount);
    },
    monthCount() {
      return totalCount(this.todos.map(todo => todo.counts), 'month');
    },
    monthDuration() {
      return totalDuration(this.monthCount);
    }
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
