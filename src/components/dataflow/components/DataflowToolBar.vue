<template>
<div class="w-100 d-flex justify-space-between">
    <div class="h-100">
        <v-tooltip bottom v-for="(item, key) in headerActions" :key="key">
            <template v-slot:activator="{ on }">
                <v-btn
                    @click="handleHeaderAction(key)"
                    icon
                    small
                    class="ml-2"
                    style="position:relative; top: -1px"
                > 
                    <v-icon size="18" v-on="on">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{$t(item.text) }}</span>
        </v-tooltip>
    </div>
    <div class="h-100" style="position: relative; top: -1px">
        <v-btn 
            :disabled="selectingNode.id == 'home'"
            @click="runDataflow" 
            text 
            small 
            depressed 
            class="mr-2">
            <i class="mdi mdi-play-outline mr-1 fs-16"></i>
            Chạy
        </v-btn>
        <v-btn color="primary" depressed small class="mr-2">
            <i class="mdi mdi-content-save mr-1 fs-16"></i>
            Lưu
        </v-btn>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        runDataflow(){
            this.$emit('run-dataflow');
        },
        handleHeaderAction(action){
            this.$emit('action-on-workspace', action);
        }
    },
    data(){
        return {
            headerActions: {
                zoomOut: {
                    icon: "mdi-minus-circle-outline",
                    text: "process.header_bar.zoom_in",
                },
                zoomIn: {
                    icon: "mdi-plus-circle-outline",
                    text: "process.header_bar.zoom_out",
                },
                zoomToFit: {
                    icon: "mdi-image-filter-center-focus",
                    text: "process.header_bar.focus",
                },
                saveSVG: {
                    icon: "mdi-image-outline",
                    text: "process.header_bar.save_svg"
                }	
            }
        }
    },
    computed: {
		selectingNode(){
			return this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
    },
    props: {
        action: {
            default: 'create'
        },
        instanceKey: {
            default: ''
        },
    }
}
</script>

<style>

</style>