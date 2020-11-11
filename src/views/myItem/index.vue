<template>
    <div class="w-100 h-100 myitem">
       <list-task v-if="objecType==0" @changeObjectType="changeObjectType" :height="height" @change-height="changeHeight"></list-task>
       <list-work v-if="objecType==1" @changeObjectType="changeObjectType" :height="height" @change-height="changeHeight"></list-work>
       <list-document v-if="objecType==2" @changeObjectType="changeObjectType" :height="height" @change-height="changeHeight"></list-document>
    </div>
</template>

<script>
import Api from "./../../api/api.js";
import list from "@/components/myItem/List";
import listWork from "@/components/myItem/work/List";
import listDocument from "@/components/myItem/document/List";
export default {
    name: "ListTaskContainer",
    components: {
        "list-task": list,
        "list-work": listWork,
        "list-document": listDocument,
    },
    computed: {
        
    },
    mounted() {
    },
    data: function() {
        return {
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
    },
    created(){
        if (this.$route.params.type) {
            if (this.$route.params.type=="work") {
                this.objecType=1;
            }
        }
       
    }
    
}
</script>
