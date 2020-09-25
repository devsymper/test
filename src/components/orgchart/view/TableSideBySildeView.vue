<template>
   <div style="display:flex">
       <VueResizable :width="300" :max-width="800" :min-width="100" :active ="['r']">
           <div class="h-100" style="border-right:1px solid lightgray">
                <span>Trrviews</span>
           </div>
       </VueResizable>
       <ListItems />
   </div>
</template>

<script>
import ListItems from '@/components/common/ListItems.vue'
import VueResizable from 'vue-resizable';
export default {
    components:{
        ListItems,
        VueResizable
    },
    props:{

    }
}
</script>

<style>

</style>