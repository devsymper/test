<template>
    <v-dialog
        v-model="isShow"
        max-width="500px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <span class="fs-16">Config gantt interaction</span>
        </v-card-title>
        <v-card-text>
            <v-tabs vertical class="tab-config fs-13">
                <v-tab class="s-tab">
                    <v-icon left>
                    mdi-gradient
                    </v-icon>
                    Task submit
                </v-tab>
                <v-tab class="s-tab">
                    <v-icon left>
                    mdi-pencil-outline
                    </v-icon>
                    Update item action
                </v-tab>
                <v-tab-item class="s-item fs-13">
                    <span>Lựa chọn doc submit</span>
                    <symper-list-autocomplete 
                        class="select-document"
                        :items="listDocument"
                        :isEmitOnSearch="true"
                        @symper-autocomplete-search-vl="onSearch"
                        @change="selectItem"
                    />
                    <VuePerfectScrollbar >
                        <v-list dense>
                            <v-list-item
                                v-for="item in listDocumentSubmitTask"
                                :key="item.id"
                            >
                                <div class="w-100">
                                    <span>{{item.title}}</span>
                                    <v-icon @click.prevent.stop="removeDocSelected(item)" class="fs-14" style="float: right;padding-top: 4px;">mdi-close</v-icon>
                                </div>
                            </v-list-item>
                        </v-list>
                    </VuePerfectScrollbar>
                </v-tab-item>
                <v-tab-item class="s-item fs-13">
                        <form-tpl 
                            :allInputs="formulaUpdateTask"
                        />
                </v-tab-item>
            </v-tabs>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="isLoading"
                @click="saveConfig"
            >
                Chọn
            </v-btn>
            <v-btn
            color="red darken-1"
            text
            @click="isShow = false"
            >
                {{$t("common.cancel")}}
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import SymperListAutocomplete from '../../common/symperInputs/SymperListAutocomplete.vue';
import GanttchartWorker from 'worker-loader!@/worker/dashboard/ganttchart/Ganttchart.Worker.js';
import { util } from '../../../plugins/util';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from '../../common/FormTpl.vue';

export default {
    components: { 
        SymperListAutocomplete,
        VuePerfectScrollbar,
        FormTpl
    },
    data(){
        let self = this;
        return{
            ganttchartWorker:null,
            isLoading:false,
            isShow:false,
            listDocument:[],
            filter:{
                page: 1,
                pageSize: 30,
                distinct: true
            },
            formulaUpdateTask: {
                formulaValue : { 
                    title: "Formula",
                    type: "script",
                    value: self.cellConfigs.rawConfigs.extra.formulaUpdateTask ? self.cellConfigs.rawConfigs.extra.formulaUpdateTask : '' ,
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    }
                },
            },        
        }
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
        listDocumentSubmitTask:{
            type: Array,
            default(){
                return []
            }
        }
    },
    computed:{
        allDoc(){
            return this.$store.state.document.listAllDocument;
        }
    },
    methods:{
        removeDocSelected(item){
            let obj = this.listDocumentSubmitTask.find(data => data.id === item.id)
            var index = this.listDocumentSubmitTask.indexOf(obj);
            if (index > -1) {
                this.listDocumentSubmitTask.splice(index, 1);
            }
        },
        saveConfig(){
            let arrDocId = [] ;
            if (this.listDocumentSubmitTask.length > 0) {
                for (let i = 0; i < this.listDocumentSubmitTask.length; i++) {
                    arrDocId.push(this.listDocumentSubmitTask[i].id);
                }
                this.$set(this.cellConfigs.rawConfigs.extra,"ganttDocIdSelected",arrDocId);
            }

            if (this.formulaUpdateTask.formulaValue.value) {
                this.$set(this.cellConfigs.rawConfigs.extra,"formulaUpdateTask",this.formulaUpdateTask.formulaValue.value);
            }
            this.isShow = false;
        },
        show(){
            this.isShow=true;
        },
        onSearch(val){
            let filter = util.cloneDeep(this.filter);
            filter.search = val;
            this.getListDocument(filter);
        },
        selectItem(data){
            let docId = data.value;
            if (this.listDocumentSubmitTask.length > 0) {
                let item = this.listDocumentSubmitTask.find(ele => ele.id == docId);
                if (item) {
                    return;
                }
            }
            this.listDocumentSubmitTask.push(data.items.find(ele => ele.id == docId));
        },
        getListDocument(filter = null){
            this.ganttchartWorker.postMessage({
				action: 'getListDocumentBefor',
				data:{
                    filter: filter ? filter : util.cloneDeep(this.filter)
				}
            });
        },
        getListDocumentBeforAfter(data){
            this.listDocument = data.listDocument;
        },
        listenFromWorker(){
            let self = this;
            this.ganttchartWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
    },
    created(){
        this.ganttchartWorker = new GanttchartWorker();
        this.listenFromWorker();
        this.getListDocument();
        
    }
}
</script>

<style scoped>
.tab-config >>>.v-slide-group__wrapper{
    width:180px;
}
.tab-config >>>.v-window__container {
    height: 100%;
}
.tab-column {
    height: 100%;
}
.tab-config >>>.v-tab
{
    height: 35px;
    justify-content: left;
    text-transform: unset;
}
.s-tab{
    font-size: 13px;
}
.s-tab i{
    font-size: 16px;
}
.s-item{
    padding-left: 10px;
}
.select-document{
    border: 1px solid #aaa;
}
.select-document >>> .v-input__control {
    min-height: 30px!important;
}
</style>