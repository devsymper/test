<template>
    <detail-view :docObjectId="docObjectId" />
</template>

<script>
import Detail from './../detail/Detail'
export default {
    props: {
        docObjectId: {
            type: Number,
            default: 0 
        },

        docObjInfo: {
            type: Object,
            default(){
                return {
                    docObjId: 0,
                    docSize : '21cm'
                }
            }
        }
    },   
    components:{
        'detail-view' : Detail
    },
    data(){
        return {
        }
    }
    
}
</script>