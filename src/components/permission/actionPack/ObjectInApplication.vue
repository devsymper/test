<template>
    <div >
        <div class="my-2">
            Chọn hành động cho các đối tượng trong ứng dụng
        </div>
        <v-tabs
            hide-slider
            active-class="symper-tab-active"
            v-model="openingTab"
            color="grey darken-4"
            dark
            >
            <v-tab
                class="symper-app-tab"
                v-for="(items, name) in objects"
                :key="name">
                {{ objectTypes[name] }}
            </v-tab>
        </v-tabs>
    </div>
</template>

<script>
export default {
    data(){
        return {
            openingTab: null,
            applicationObjects: {} // các object của các application, có dạng: {idApp: objects},

        }
    },
    watch: {
        async idApplication(newId){
            if(!this.applicationObjects[newId]){
                let appDetail = 
            }
        }
    },
    computed: {
        objectTypes(){
            return {
                document_definition: {
                    text: 'Văn bản',
                },
                workflow_definition: {
                    text: 'Quy trình',
                },
                orgchart: {
                    text: 'Sơ đồ tổ chức',
                },
                dashboard: {
                    text: 'Dashboard',
                },
            }
        }
    },
    props: {
        objects: {
            default(){
                return {
                    document_definition:[],
                    workflow_definition:[],
                    orgchart:[],
                    dashboard:[],
                }
            }
        },
        idApplication: {
            default: 0
        }
    }
}
</script>

<style>

</style>