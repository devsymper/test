<template>
    <div class="w-100 h-100">
       <list-task v-if="objecType==0" @changeObjectType="changeObjectType" :height="height" @change-height="changeHeight"></list-task>
       <p v-else>NTA</p>
    </div>
</template>

<script>
import Api from "./../../api/api.js";
import list from "@/components/myItem/list.vue";
export default {
    name: "ListTaskContainer",
    components: {
        "list-task": list,
    },
    computed: {
        
    },
    mounted() {
    },
    data: function() {

        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            virtualdocUrl: "virtualdocs",
            height: "calc(100vh - 120px)",
            objecType:0,
        };
    },
    methods: {
        changeHeight(newHeight) {
            this.height = newHeight
        },
        changeObjectType(index){
            this.objecType=index;
        }
    }
}
</script>
