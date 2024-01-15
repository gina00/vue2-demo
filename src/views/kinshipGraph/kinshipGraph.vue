<template>
  <div>
    <a @click="getData('g6')">G6 官网数据</a>
    <a @click="getData('51')">51 测试环境数据</a>
    <a @click="getData('51graph')">51 画布生产数据</a>
    <div id="container" style="margin-top: 30px" />
  </div>
</template>

<script>
import G6 from '@antv/g6'
export default {
  data () {
    return {
      dataList: [],
      startTime: null,
      endTime: null
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    getData (type) {
      this.dataList = []
      if (type === 'g6') {
        this.dataList = require('../../mock/data/test.json')
      } else if (type === '51') {
        this.dataList = require('../../mock/data/test51Data.json')
      } else if (type === '51graph') {
        this.dataList = require('../../mock/data/test51graphdata.json')
      }
      this.init()
    },
    init () {
      const mapNodeSize = (nodes, propertyName, visualRange) => {
        let minp = 9999999999
        let maxp = -9999999999
        nodes.forEach((node) => {
          node[propertyName] = Math.pow(node[propertyName], 1 / 3)
          minp = node[propertyName] < minp ? node[propertyName] : minp
          maxp = node[propertyName] > maxp ? node[propertyName] : maxp
        })
        const rangepLength = maxp - minp
        const rangevLength = visualRange[1] - visualRange[0]
        nodes.forEach((node) => {
          node.size = ((node[propertyName] - minp) / rangepLength) * rangevLength + visualRange[0]
        })
      }

      const container = document.getElementById('container')
      const descriptionDiv = document.createElement('div')
      descriptionDiv.innerHTML = `正在渲染大规模数据，请稍等……`
      container.appendChild(descriptionDiv)

      const width = 1920
      const height = 700
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        defaultNode: {
          size: 8,
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9',
            lineWidth: 0.3
          },
          labelCfg: {
            style: {
              fontSize: 3
            },
            position: 'right',
            offset: 1
          }
        },
        defaultEdge: {
          size: 0.1,
          color: '#333',
          type: 'line',
          labelCfg: {
            style: {
              fontSize: 6
            },
            position: 'right',
            offset: 1
          }
        },
        nodeStateStyles: {
          selected: {
            fill: 'steelblue',
            stroke: '#000',
            lineWidth: 1
          },
          hover: {
            fill: 'red',
            stroke: '#000',
            lineWidth: 1
          }
        },
        modes: {
          default: [
            {
              type: 'zoom-canvas',
              enableOptimize: true,
              optimizeZoom: 0.9
            },
            {
              type: 'drag-canvas',
              enableOptimize: true
            },
            'drag-node',
            'brush-select'
          ] // 'drag-canvas',
        },
        layout: {
          type: 'gForce'
        }
      })
      // this.dataList = require('../../mock/data/test.json')
      // this.dataList = {
      //   nodes: dataList.kinshipNodes,
      //   edges: dataList.kinshipEdges
      // }
      // this.dataList.nodes.forEach((node) => {
      //   node.label = node.olabel
      //   node.labelCfg.style = {
      //     fontSize: 1.3
      //   }
      //   node.degree = 0
      //   this.dataList.edges.forEach((edge) => {
      //     if (edge.source === node.id || edge.target === node.id) {
      //       node.degree++
      //     }
      //   })
      // })
      console.log('原始数据', this.dataList.nodes.length, this.dataList.edges.length)
      mapNodeSize(this.dataList.nodes, 'degree', [1, 15])
      graph.data(this.dataList)
      this.startTime = new Date().getTime()
      graph.render()
      graph.on('afterlayout', e => {
        this.endTime = new Date().getTime()
        let graphData = graph.save()
        console.log('渲染时间', this.endTime - this.startTime)
        console.log('图数据', JSON.stringify(graphData))
      })
      this.endTime = new Date().getTime()
      console.log('渲染时间', this.endTime - this.startTime)
      graph.on('node:mouseenter', (e) => {
        const { item } = e
        graph.setItemState(item, 'hover', true)
      })
      graph.on('node:mouseleave', (e) => {
        const { item } = e
        graph.setItemState(item, 'hover', false)
      })

      const graphData = graph.save()
      const nodeLen = graphData.nodes.length
      const edgeLen = graphData.edges.length
      descriptionDiv.innerHTML = `节点数量：${nodeLen}, 边数量：${edgeLen}, 图元数量：${
        nodeLen * 2 + edgeLen * 2
      }`
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
    }
  }
}
</script>

<style>
a{
  cursor: pointer;
  color: #0af;
}
</style>
