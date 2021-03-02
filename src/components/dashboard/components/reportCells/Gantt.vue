<template>
    <ganttchart-base 
        ref="ganttchartBase"
        :cellConfigs="cellConfigs"
        :isView="isView"
        :instanceKey="instanceKey"
        :taskSeleted="taskSeleted"
        :listDocumentSubmitTask="listDocumentSubmitTask"
        @dragDrop-gantt="dragDrop"
        @remove-task="removeTask"
        @selected-gantt="selectedGantt"
        @unselected-gantt="unselectedGantt"
        @save-update-gantt="saveUpdate"
    />
</template>

<script>
import { util } from '@/plugins/util';
import GanttchartBase from './GanttchartBase.vue';
import GanttchartWorker from 'worker-loader!@/worker/dashboard/ganttchart/Ganttchart.Worker.js';

export default {
    components: {
        GanttchartBase
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
        instanceKey: {
            default: ''
        },
    },
    data(){
        return{
            ganttchartWorker:null,
            listItemChange:[],
            taskSeleted:{},
            listDocumentSubmitTask:[],
            filter:{
                filter:[
                    {
                        column : "id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [],
                            }
                        ],
                    },
                ],
                page: 1,
                pageSize: 30,
                distinct: true
            },
            fomular:"ref(update doc_test_data_gantt_chart set  start_date = '{start}', end_date = '{end}' where task_id = '{id}')",
        }
    },
    methods:{
        printInnerHTML(headerHTML){
            this.$snotifySuccess("Không hỗ trợ print gantt")
        },
        removeTask(task){
            this.ganttchartWorker.postMessage({
                action: 'ganttChartRemoveTask',
                data:{
                    task: task
                }
            });
        },
        ganttChartRemoveTaskAfter(){
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        dragDrop(e){
            let task = e.target.options;
            if (this.listItemChange.length == 0) {
                this.listItemChange.push(task);
            }else{
                let item = this.listItemChange.find(ele => ele.id == task.id);
                if (item) { // check nếu có thì xóa đi và push lại
                    var index = this.listItemChange.indexOf(item);
                    if (index > -1) {
                        this.listItemChange.splice(index, 1);
                    }                    
                }
                this.listItemChange.push(task);
            }
        },
        selectedGantt(e){
            this.taskSeleted = e.target.options;
        },
        unselectedGantt(e){
            if (this.taskSeleted && this.taskSeleted.id == e.target.options.id) {
                this.taskSeleted = {};
            }
        },
        saveUpdate(){
            if (this.listItemChange.length > 0) {
                let str = [];
                for (let i = 0; i < this.listItemChange.length; i++) {
                    let task = this.listItemChange[i];
                    let substr = util.cloneDeep(this.fomular);
                    for (let key in task) {
                        let data = task[key];
                        if (key == 'start' || key == 'end') {
                            data = this.$moment(task[key]).format('YYYY-MM-DD hh:mm:ss');
                        }
                        const regex = new RegExp('{'+key+'}','g'); 
                        substr = substr.replace(regex, data);
                    }
                    str.push(substr);
                }
                
                console.log("str",str);
                this.ganttchartWorker.postMessage({
                    action: 'saveUpdateGanttBefor',
                    data:{
                        data:str
                    }
                });
            }else{
                this.$refs.ganttchartBase.hideLoading();
            }
            
        },
        saveUpdateGanttAfter(){
            this.$refs.ganttchartBase.hideLoading();
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
            
            this.$snotifySuccess('Update task complete!');
        },
        haveErrorUpdateGantt(data){
            this.$snotifyError('Error', 'Have error! Error showed in console');
            console.log('Info update:',data.dataError);
            this.$refs.ganttchartBase.hideLoading();

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
        getListDocumentSubmitTask(){
            if (this.cellConfigs.rawConfigs.extra && this.cellConfigs.rawConfigs.extra.ganttDocIdSelected && this.cellConfigs.rawConfigs.extra.ganttDocIdSelected.length > 0) {
                this.filter.filter[0].conditions[0].value = this.cellConfigs.rawConfigs.extra.ganttDocIdSelected;
                this.ganttchartWorker.postMessage({
                    action: 'getListDocumentSubmitTaskBefor',
                    data:{
                        filter: this.filter
                    }
                });
            }
        },
        getListDocumentSubmitTaskAfter(data){
            this.listDocumentSubmitTask = data.listDocument;
        }
 

    },
    created(){
        this.ganttchartWorker = new GanttchartWorker();
        this.listenFromWorker();
        this.getListDocumentSubmitTask();
    }
}
</script>

<style>

</style>