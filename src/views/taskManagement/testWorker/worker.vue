<script>
export default {
  data() {
    return {
      myWorker: null
    }
  },
  methods:{

  },

  created() {
    this.myWorker = this.$worker.create([
      {message: 'message1', func: (arg) => `Output 1 ${arg}`},
      {message: 'message2', func: () => 'Output 2'}
    ])

    this.myWorker.postMessage('message1', ['Boop!'])
    .then(result => {
      console.log(result)
    })
  }
}
</script>