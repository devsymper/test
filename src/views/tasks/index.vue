<template>
    <v-container fluid>
       <list-task :height="height" @change-height="changeHeight"></list-task>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import list from "./list";
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
            height: "calc(100vh - 120px)"
        };
    },
    methods: {
        changeHeight(newHeight) {
            this.height = newHeight
        }
    }
}
</script>
