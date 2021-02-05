<template>
      <div class="h-100">
        <Preloader ref="preLoaderView"/>
      <backlog 
        @loaded-content="afterLoadContent"
        @loading="beforeLoadContent"
      />
      </div>
</template>

<script>
import Backlog from '@/components/taskManagement/board/Backlog.vue'
import Preloader from '../../../components/common/Preloader.vue';
export default {
  components: { Backlog ,Preloader},
  methods:{
        afterLoadContent(){
            this.$refs.preLoaderView.hide();
        },
        beforeLoadContent(){
            this.$refs.preLoaderView.show();
        }
    },

}
</script>

<style>

</style>