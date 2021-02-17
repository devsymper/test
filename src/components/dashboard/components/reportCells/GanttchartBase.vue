<template>
    <div class="w-100 h-100">
        <div class="action-gantt">
            <v-icon v-if="taskSeleted.id" @click="handleDelete" style="font-size:20px;margin-right:4px">mdi-delete-forever-outline</v-icon>
            <v-text-field
            v-on:input="onSearch($event)"
            class="d-inline-block sym-small-size"
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
                    <v-btn v-on="on"  depressed  small>
                        <span class="ml-2">Create task</span>
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
            <v-btn class="mx-1" @click="changeStatusEdit" v-if="!isEdit" small depressed >
                Edit
            </v-btn>
            <v-btn
                class="mx-1"
                v-else 
                small
                @click="saveUpdate" 
                :loading="loading"
                color="blue darken-1"
                text
            >
                {{$t("common.save")}}
            </v-btn>
            <v-icon @click.stop.prevent="showPopupConfig" class="fs-16">mdi-cog-outline</v-icon>
        </div>

        <Highcharts
            ref="chartGantt"
            style="height:calc(100% - 30px)"
            class="w-100 py-1 gantt-chart" 
            :constructorType="'ganttChart'"
            :options="options">
        </Highcharts>
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

Gantt(Highcharts);
DragDrop(Highcharts);
export default {
    components: {
        Highcharts: Chart,
        PopupConfigGanttchart,
        PopupSubmitTask,
    },
    computed:{
        options(){
            let self = this;
			var  day = 1000 * 60 * 60 * 24;
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
            return optionData;
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
        }
    },
    methods:{
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
</style>