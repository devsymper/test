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
                    mdi-account
                    </v-icon>
                    Task submit
                </v-tab>
                <v-tab class="s-tab">
                    <v-icon left>
                    mdi-lock
                    </v-icon>
                    Create item action
                </v-tab>
                <v-tab class="s-tab">
                    <v-icon left>
                    mdi-access-point
                    </v-icon>
                    Update item action
                </v-tab>
                <v-tab class="s-tab">
                    <v-icon left>
                    mdi-access-point
                    </v-icon>
                    Delete item action
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
                                v-for="item in listDocumentSelected"
                                :key="item.id"
                            >
                                <div class="w-100">
                                    <span>{{item.title}}</span>
                                    <v-icon class="fs-14" style="float: right;padding-top: 4px;">mdi-close</v-icon>
                                </div>
                            </v-list-item>
                        </v-list>
                    </VuePerfectScrollbar>
                </v-tab-item>
                <v-tab-item class="s-item fs-13">
                        <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                        </p>
                </v-tab-item>
                <v-tab-item class="s-item fs-13">
                        <p>
                        Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
                        </p>
                </v-tab-item>
                <v-tab-item class="s-item fs-13">
                        <p>
                        Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
                        </p>
                </v-tab-item>
            </v-tabs>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="isLoading"
            >
                {{$t("common.save")}}
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

export default {
    components: { 
        SymperListAutocomplete,
        VuePerfectScrollbar
    },
    data(){
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
            listDocumentSelected:[],
        }
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
    },
    computed:{
        allDoc(){
            return this.$store.state.document.listAllDocument;
        }
    },
    methods:{
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
            this.listDocumentSelected.push(data.items.find(ele => ele.id == docId));
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