import Vue from 'vue';
import moment from 'moment';

const Todo = {
  props: [
    'todo',
    'index',
    'onIncrementCount',
    'onDecrementCount',
    'onRemoveTodo'
  ],
  data() {
    return {
      duration: '',
      times: false
    };
  },
  template: `
    <div>
      <div class="columns">
        <div class="column is-6">
          <h1 class="title is-5" v-on:click="toggleTimes">
            {{todo.text}}
          </h1>
        </div>
        <div class="column is-2">
          <input type="text"
                 placeholder="HH:MM:SS"
                 class="input"
                 v-model="duration"
                 v-on:keydown.enter="incrementCount(index)">
        </div>
        <div class="column is-3">
          <span class="tag is-success push-right ver-align-bot">
            Count: {{todo.counts.length}}
          </span>
          <span class="tag is-primary push-right ver-align-bot">
            Duration: {{totalDuration}}
          </span>
          <button
            class="button is-small is-danger is-outlined"
            v-on:click="onDecrementCount(index)"
          >
            -
          </button>
        </div>
        <div class="column">
          <button v-on:click="onRemoveTodo(index)" class="delete"></button>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-show="times" class="columns">
          <div v-if="!todo.counts.length" class="has-text-centered">
            <span class="tag is-danger is-large">No count data</span>
          </div>
          <div v-else class="column">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(count, index) in orderedCounts">
                  <td>{{todo.counts.length - index}}</td>
                  <td>{{getTime(count.time)}}</td>
                  <td>{{getDuration(count.duration)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </div>
  `,
  methods: {
    incrementCount(index) {
      const value = this.duration.trim();
      if (!value) return;
      this.duration = '';
      const duration = moment.duration(value);
      const time = moment(Date.now()).subtract(duration);
      this.onIncrementCount(index, {duration, time});
    },
    toggleTimes() {
      this.times = !this.times;
    },
    getTime(time) {
      return moment(time).format('LLLL');
    },
    getDuration(duration) {
      return moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    }
  },
  computed: {
    totalDuration() {
      const initial = moment.duration(0);
      const reducer = (acc, cur) => acc.add(cur.duration);
      const total = this.todo.counts.reduce(reducer, initial);
      const hours = total.asHours() === 0 ? '00' : Math.floor(total.asHours());
      return hours + ':' + moment.utc(total.asMilliseconds()).format('mm:ss');
    },
    orderedCounts() {
      return this.todo.counts.sort((left, right) =>
        moment.utc(right.time).diff(moment.utc(left.time)));
    }
  }
};

export default Todo;
