<template>
    <div class="w-100 h-100">
        <div class="action-gantt py-2">
            <v-icon v-if="taskSeleted.id" @click="handleDelete" style="font-size:20px;margin-right:4px">mdi-delete-forever-outline</v-icon>
            <v-text-field
                v-on:input="onSearch($event)"
                class="d-inline-block sym-small-size mr-2"
                single-line
                append-icon="mdi-magnify"
                outlined
                hide-details
                dense
                flat
                label="Search"
                :placeholder="$t('common.search')"
                style="width: inherit"
            ></v-text-field>
            <v-menu
                content-class="action-create"
                :close-on-content-click="false"
                :close-on-click="closeOnClick"
                offset-y
            >
                <template v-slot:activator="{ on: on }">
                    <v-btn v-on="on"  depressed  small class="mr-2">
                        <span>Tạo task</span>
                    </v-btn>
                </template>
                <v-list class="fs-13">
                    <v-list-item
                        v-for="(item, i) in listDocumentSubmitTask"
                        :key="i"
                        class="single-row"
                    >
                        <div @click.prevent.stop="handleSubmitTask(item)" class="my-1">
                            <span>{{item.id +' '+ item.title}}</span>
                        </div>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn class="mr-1" @click="changeStatusEdit" v-if="!isEdit" small depressed >
                {{$t("common.edit")}}
            </v-btn>
            <v-btn
                class="mr-2"
                v-else 
                small
                @click="saveUpdate" 
                :loading="loading"
                color="blue darken-1"
            >
                {{$t("common.save")}}
            </v-btn>
            
            <v-btn class="mx-1" tile icon @click="showPopupConfig" small depressed>
                <i class=" mdi fs-18 mdi-cog-outline"></i>
            </v-btn>
            
        </div>

        <Highcharts
            ref="chartGantt"
            :style="{
                height: cellConfigs.viewConfigs.displayOptions.chart.height + 'px'
            }"
            class="w-100 py-1 gantt-chart mt-5" 
            :constructorType="'ganttChart'"
            :options="options">
        </Highcharts>
        
        <div class="symper-table-pagination pl-1" style="height: 25px; margin-top: 5px" >
            <Pagination
                :contentSize="'mini'"
                :totalVisible="5"
                :pageSizeOptions="[50, 100, 200, 400]"
                @on-change-page-size="handleSizeChange"
                @on-change-page="handleCurrentPageChange"
                :total="cellConfigs.viewConfigs.displayOptions.totalRowCount"
                :shortMode="true">
            </Pagination>
        </div>
        <popup-config-ganttchart 
            ref="configGantt"
            :cellConfigs="cellConfigs"
            :listDocumentSubmitTask="listDocumentSubmitTask"
        />
        <popup-submit-task 
            ref="popupSubmitTask"
            @gantt-submit-task-done="submitTaskDone"
        />
         <!-- Dialog remove task -->
        <v-dialog v-model="dialogRemove" max-width="350">
            <v-card>
            <v-card-title class="headline">Xóa công việc</v-card-title>
            <v-card-text>Bạn sẽ xóa một tác vụ?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeTask">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>

import Highcharts from 'highcharts';
import Gantt from "highcharts/modules/gantt";
import {Chart} from 'highcharts-vue';
import DragDrop from "highcharts/modules/draggable-points"
import { util } from '@/plugins/util';
import PopupConfigGanttchart from '../PopupConfigGanttchart.vue';
import PopupSubmitTask from '../PopupSubmitTask.vue';
import Pagination from '@/components/common/Pagination.vue';

Gantt(Highcharts);
DragDrop(Highcharts);
var day = 1000 * 60 * 60 * 24;

export default {
    components: {
        Highcharts: Chart,
        PopupConfigGanttchart,
        PopupSubmitTask,
        Pagination
    },
    computed:{
    },
    watch: {
        'cellConfigs.viewConfigs.displayOptions': {
            deep: true,
            immediate: true,
            handler(){
                let self = this;
                let optionData = {};
                if (this.isEdit) {
                    optionData = util.cloneDeep(this.cellConfigs.viewConfigs.displayOptions);
                    optionData.plotOptions = {
                        series: {
                            animation: false, // Do not animate dependency connectors
                            dragDrop: {
                                draggableX: true,
                                draggableY: true,
                                dragMinY: 0,
                                dragMaxY: 2,
                                dragPrecisionX: day / 48 // Snap to eight hours
                            },
                            allowPointSelect: true,
                            point: {
                                events: {
                                    select: self.selected,
                                    unselect: self.unselected,
                                    // remove: self.removedObject,
                                    drop: self.drop
                                    // click: self.change,
                                }
                            }
                        }
                    };
                }else{
                    optionData = util.cloneDeep(this.cellConfigs.viewConfigs.displayOptions);
                }
                setTimeout(() => {
                    self.options = optionData;                
                }, 0);
            }
        }
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
        isView: {
            default: true
        },
        listDocumentSubmitTask:{
            type: Array,
            default(){
                return []
            }
        },
        taskSeleted:{
            type: Object,
            default(){
                return {};
            }
        },
        instanceKey: {
            defaul: ''
        },
    },
    data(){
        return {
            isEdit:false,
            loading:false,
            closeOnClick:true,
            dialogRemove: false,
            options: {}
        }
    },
    methods:{
        handleCurrentPageChange(data){
            this.cellConfigs.sharedConfigs.currentPage = data.page; 
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        handleSizeChange(data){
            this.cellConfigs.sharedConfigs.pageSize = data.pageSize;
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        onSearch(vl){
            if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                self.cellConfigs.viewConfigs.displayOptions.symperSearchKey = vl;
                self.$evtBus.$emit('bi-report-change-display', {
                    type: 'data',
                    id: self.cellConfigs.sharedConfigs.cellId,
                    instanceKey: this.instanceKey
                });
            }, 300,this);
        },
        handleDelete(){
            this.checkTaskRemove();
        },
        checkTaskRemove(){
            if (this.taskSeleted.id) {
                this.dialogRemove = true;
            }
        },
        /**
         * function emit sự kiện xác nhận xóa, thực hiện xóa trong csdl
         */
        removeTask(){
            // xoas trong csdl
            this.$emit('remove-task',this.taskSeleted);
            this.dialogRemove = false;
        },
        submitTaskDone(data){
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        selected(e){
            this.$emit("selected-gantt",e)
        },
        unselected(e){
            this.$emit("unselected-gantt",e)
        },
        drop(e){
            this.$emit("dragDrop-gantt",e)
        },
        showPopupConfig(){
            this.$refs.configGantt.show();
        },
        saveUpdate(){
            this.loading = true;
            this.$emit("save-update-gantt");
        },
        changeStatusEdit(){
            this.isEdit = true;
        },
        hideLoading(){
            this.loading = false;
            this.isEdit = false;
        },
        handleSubmitTask(item){
            this.$refs.popupSubmitTask.show(item.id);
        }
    },
    mounted(){
        let self = this;
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 8 || event.keyCode === 46) {
                self.checkTaskRemove();
            }
        });
    }
}
</script>
<style scoped>
.action-gantt{
    position: absolute;
    top: 1px;
    right: 30px;
}
.single-row:hover {
  background: #f5f5f5;
  cursor: pointer;
}
.gantt-chart {
    overflow: scroll!important;
}
</style>