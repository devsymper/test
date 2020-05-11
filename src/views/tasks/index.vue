<template>
    <v-container fluid>
       <list-task></list-task>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import list from "./list";
export default {
    name: "Listvirtualdocs",
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
        };
    },
    methods: {
    }
}
</script>
