<template>
    <div class="pt-6">
        <div class="text-right pb-3">
            <v-btn text color="green lighten-2" class="font-weight-regular">
                <label for="sym-upload-input" id="upload-segment" :style="{'background-image': 'url('+img+')'}">
                    <v-icon class="mr-2" size="20">mdi-upload</v-icon>
                    Upload file
                </label>
            </v-btn>
        </div>
        <input 
            type="file" ref="file" 
            class="d-none" @change.prevent="changeFile" 
            id="sym-upload-input"
            multiple
        >
        <v-data-table 
            :headers="headers" 
            :items="desserts" 
            dense
            flat
            :disable-pagination="true"
            class="table-attachment tbl-no-border">
            <template v-slot:item.owner="{ item }">
                <user :user="item.owner"></user>
            </template>
            <template v-slot:item.remove="{ item }">
                <v-icon small color="red" :id="item.size">mdi-close</v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import user from "./user";
export default {
    name: "attachment",
    components: {
        user,
    },
    props: {
        task: {
            type: Object,
            default: () => {},
        },
    },
    data: function() {
        const srcs = {
            1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
            4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
            5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        }
        return {
            desserts: [
                {
                    name: "Frozen Yogurt",
                    size: 159,
                    owner: { id: 1, name: 'Sandra Adams', role: 'BA', avatar: srcs[1] },
                    type: "xlsx",
                    date: "02-03-2020",
                    remove: ""
                },
                {
                    name: "Ice cream sandwich",
                    size: 237,
                    owner: { id: 2, name: 'Ali Connors', role: 'BA', avatar: srcs[2] },
                    type: "pdf",
                    date: "02-03-2020",
                    remove: ""
                },
                {
                    name: "Eclair",
                    size: 262,
                    owner: { id: 3, name: 'Trevor Hansen', role: 'BA', avatar: srcs[3] },
                    type: "dpcs",
                    date: "02-03-2020",
                    remove: ""
                },
                {
                    name: "Jelly bean",
                    size: 375,
                    owner: { id: 4, name: 'Tucker Smith', role: 'BA', avatar: srcs[2] },
                    type: "xlsx",
                    date: "02-03-2020",
                    remove: ""
                },
                {
                    name: "Lollipop",
                    size: 392,
                    owner: { id: 5, name: 'Britta Holt', role: 'BA', avatar: srcs[4] },
                    type: "txt",
                    date: "02-03-2020",
                    remove: ""
                },
                {
                    name: "KitKat",
                    size: 518,
                    owner: { id: 6, name: 'Jane Smith ', role: 'BA', avatar: srcs[5] },
                    type: "ppt",
                    date: "02-03-2020",
                    remove: ""
                },
            ],
            headers: [
                {
                    text: "File",
                    align: "start",
                    value: "name",
                },
                { text: "Kiểu", value: "type" },
                { text: "Người upload", value: "owner" },
                { text: "Size", value: "size" },
                { text: "Ngày", value: "date" },
                { text: "", value: "remove" },
            ],
        };
    },
    methods: {
        changeFile(evt) {
            let files = evt.target.files;
            console.log(files);
        },
    }
};
</script>

<style scoped>
.theme--light.v-data-table >>> tbody >>> tr >>> td, 
.table-attachment .v-data-table__wrapper table tbody tr td {
    border: 0 !important;
}
</style>
