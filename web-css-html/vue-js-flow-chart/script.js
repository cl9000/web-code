class SleepHandler {
  constructor() {
    this.timeouts = {};
  }

  shh(ms) {
    console.log('shh!');
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms);
      this.timeouts[t] = t;
    });
  }

  flush() {
    console.log('flush!');
    Object.keys(this.timeouts).map(t => {
      window.clearTimeout(t);
      delete this.timeouts[t];
    });
  }}


const mountingComponent = {
  template: `
    <div class="pos">
      <span class="f1 pr2 dark-gray">{{ count }}</span>
      <button class="br2 b--none pa2 vue-blue hover-bg-dark-gray white bg-animate" v-bind:disabled="!ready" type="text" @click="count++">{{buttonText}}</button>
    </div>
  `,
  data: function () {
    return { count: '', ready: false };
  },
  computed: {
    buttonText: function () {
      return this.ready ? 'Trigger Update' : 'Wait...';
    } },

  beforeCreate: function () {
    this.$emit('beforeCreate', true);
    this.$parent.timeouts.shh(500).then(() => {
      this.$emit('beforeCreate', false);
    });
  },
  created: function () {
    this.$parent.timeouts.shh(500).then(() => {
      this.$emit('created', true);
      return this.$parent.timeouts.shh(500);
    }).then(() => {
      this.$emit('created', false);
    });
  },
  mounted: function () {
    this.$parent.timeouts.shh(1000).then(() => {
      this.$emit('mounted', true);
      return this.$parent.timeouts.shh(500);
    }).then(() => {
      this.$emit('mounted', false);
      this.ready = true;
    });
  },
  beforeUpdate: function () {
    this.$emit('beforeUpdate', true);
    this.$parent.timeouts.shh(500).then(() => {
      this.$emit('beforeUpdate', false);
    });
  },
  updated: function () {
    this.$parent.timeouts.shh(500).then(() => {
      this.$emit('updated', true);
      return this.$parent.timeouts.shh(500);
    }).then(() => {
      this.$emit('updated', false);
      this.$emit('flush');
    });
  } };


const app = new Vue({
  el: '#app',
  template: '#lifecycle',
  data: {
    beforeCreate: false,
    created: false,
    mounted: false,
    beforeUpdate: false,
    updated: false,
    timeouts: new SleepHandler() },

  methods: {
    bc: function (val) {this.beforeCreate = val;},
    c: function (val) {this.created = val;},
    m: function (val) {this.mounted = val;},
    bu: function (val) {this.beforeUpdate = val;},
    u: function (val) {this.updated = val;} },

  components: { 'mounting-component': mountingComponent } });