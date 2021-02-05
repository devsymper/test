<template>
    <div style="width: auto;background-color:white" class="pa-2">
        <div class="fs-14 font-weight-bold" style="text-align:center">
            Dataset infomation
        </div>
        <div class="w-100 d-flex justify-space-between">
            <div class="font-weight-bold">
                Dataset origin:
            </div>
            <div >
                {{datasetOrigin[info.type]}}
            </div>
        </div>

        <div v-if="info.type == 'doc'" class="w-100">
            <div class="w-100 d-flex justify-space-between ">
                <div class=" font-weight-bold">
                    Document id:
                </div>
                <div >
                    {{info.symperId}}
                </div>
            </div>

            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Document name:
                </div>
                <div class="ml-1">
                    {{info.name}}
                </div>
            </div>

            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Document title:
                </div>
                <div class="ml-1">
                    {{info.title}}
                </div>
            </div>
        </div>

        <div v-else class="w-100">
            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Dataset id:
                </div>
                <div>
                    {{info.id}}
                </div>
            </div>

            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Dataset name:
                </div>
                <div class="ml-1">
                    {{info.dataflowName}}
                </div>
            </div>

            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Node name:
                </div>
                <div class="ml-1">
                    {{info.nodeName}}
                </div>
            </div>

            <div class="w-100 d-flex justify-space-between">
                <div class=" font-weight-bold">
                    Node type:
                </div>
                <div>
                    {{info.nodeType}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            datasetOrigin: {
                doc: 'Document',
                dataset_by_dataflow: "Dataflow"
            },
        
        }
    },
}
</script>

<style>

</style>