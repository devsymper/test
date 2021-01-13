<template>
   <v-dialog
      v-model="showDialog"
      persistent
      max-width="1000"
	  content-class="dialog-call-activity-modeler"
    >
		<div class=" w-100" style="height: 570px !important">
			<div class="action-diagram-bpmn" style="text-align:right;margin-top:3px">
				<!-- <span class="fs-13 pl-1" style="float:left">{{definitionName}}</span> -->
				<v-icon class="action-btn"  @click="handleZoomOut">mdi-plus-circle-outline</v-icon>
				<v-icon class="action-btn"  @click="handleZoomIn">mdi-minus-circle-outline</v-icon>
				<v-icon class="action-btn"  @click="handleFocus">mdi-image-filter-center-focus</v-icon>
				<v-icon  class="action-btn"  @click="handleClosePopup">mdi-close</v-icon>
			</div>
			<symper-bpmn
				class="symper-bpmn"
				style="height:95%!important"
				ref="symperBpmn"
				:readOnly="true"
				:diagramXML="diagramXML"
			></symper-bpmn>
		</div>
	</v-dialog>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
import { defaultXML } from "./../../components/process/reformatGetListData";
import bpmneApi from "./../../api/BPMNEngine";
export default {
    props: {
        processDefinitionId: {
            type: String,
            default: ''
		},
		showDialog:{
			type: Boolean,
			default: false
		}
    },
    created() {
	},
	watch:{
		showDialog(val){
			if(val){
				this.setInstanceXML();
			}
		}
	},
    data() {
        return {
            diagramXML: defaultXML,
            runtimeNodeMap: null, // Thông tin chạy của các node trong process instance. có dạng: {idNode : {thông tin}}
            nodeDetailPanel: {
                title: '',
                show: false,
                position: {
                    left: 0,
                    top: 0
                },
                data: {}
            },
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
    },
    computed:{
        stask() {
			return this.$store.state.task;
		},
    },
    methods: {
		handleClosePopup(){
			this.$emit('cancel')
		},
		handleFocus(){
            this.$refs.symperBpmn.focus();
        },
        handleZoomIn(){
            this.$refs.symperBpmn.zoomIn();
        },
        handleZoomOut(){
            this.$refs.symperBpmn.zoomOut();
		},
        async setInstanceXML(){
			let res = await bpmneApi.getProcessByProcessKey(this.processDefinitionId)
			if(res.data.content){
				this.diagramXML = res.data.content
			}
			setTimeout((self) => {
				self.$refs.symperBpmn.focus();
			}, 500,this);
		}
		
    },
   

};
</script>

<style scoped>
.action-diagram-bpmn{
    width:100%;
    margin-right: 10px;
}
.action-btn{
    cursor: pointer;
    font-size: 20px;
    margin-right:5px ;
}
.symper-bpmn >>> .djs-hit{
	pointer-events: none !important;
} 
</style>
<style>
.dialog-call-activity-modeler{
	z-index: 100000000 !important ;
	background-color: #ffffff !important
}

</style>