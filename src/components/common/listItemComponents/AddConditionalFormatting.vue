<template>
    <div @click="changeToConfig()">
        <span class="color-green fs-13 d-flex justify-center mt-2" >
            <v-icon class="color-green" size='16'>mdi-plus</v-icon>
        Thêm quy tắc định dạng</span>
    </div>
</template>
<script>
export default {
  methods: {
      changeToConfig(){
          this.$emit('changeToConfig')
      }
  },
  data () {
    return {
    }
  },
    
}
</script>