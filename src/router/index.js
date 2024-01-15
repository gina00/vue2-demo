import Vue from 'vue'
import Router from 'vue-router'
import kinshipGraph from '@/views/kinshipGraph/kinshipGraph.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: '查看血缘图',
      component: kinshipGraph
    }
  ]
})
