<template>
    <div>
        <Comment 
            :showComment="true" 
            :objectIdentifier="originData.id"
            :objectType="'task'"
            :height="'100%'"
            :width="'100%'"
        />
    </div>
</template>

<script>
import Comment from '@/components/common/comment/Comment.vue'
export default {
    name: "comment",
    components:{
        Comment
    },
    props:{
        taskInfo: {
            type: Object,
            default: () => {}
        },
        originData:{
            type: Object,
            default: () => {}
        }
    },
    mounted(){
        console.log(this.originData,'taskkkkkkkkkkkkkkkkkkkkkkkkkkk');
        debugger
    }
}
</script>

<style>

</style>