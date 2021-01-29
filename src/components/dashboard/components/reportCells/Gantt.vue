<template>
    <ganttchart-base 
        :cellConfigs="cellConfigs"
        :isView="isView"
        @dragDrop-gantt="dragDrop"
        @save-update-gantt="saveUpdate"
    />
</template>

<script>
import { util } from '../../../../plugins/util';
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
    },
    data(){
        return{
            ganttchartWorker:null,
            listItemChange:[],
            fomular:"ref(update doc_test_data_gantt_chart set  start_date = '{start}', end_date = '{end}' where task_id = '{id}')",
        }
    },
    methods:{
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
            }
            
        },
        saveUpdateGanttAfter(){
            console.log("update successsss");
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
        // getRawConfigSelected(){
        //     let columns = this.cellConfigs.rawConfigs.setting;
        //     for (let key in columns) {
        //        if (columns[key].selectedColums.length > 0) {
        //            this.columnSelected[key] = columns[key];
        //        }
        //     }
        // },

    },
    created(){
        this.ganttchartWorker = new GanttchartWorker();
        this.listenFromWorker();
    }
}
</script>

<style>

</style>