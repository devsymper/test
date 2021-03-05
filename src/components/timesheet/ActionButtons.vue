<template>
    <div v-if="type!='month'" class="sub-action-buttons d-flex justify-end mr-2">
        <v-combobox v-if="showSearch"
            :search-input.sync="searchLogTime"
            :items="list"
            class="d-inline-block mx-2 sym-small-size"
            item-text="task_name"    
            item-value="id"
            style="margin-top:2px"
            outlined
            dense
            label="Search"
            :placeholder="$t('common.search')">
            <template  v-slot:item="{ item, attrs }">
            <v-list-item @click="findStartEnd(item.start_time_at)">
                <v-list-item-content>
                <v-list-item-title>
                    {{item.task_name}}
                </v-list-item-title>
                <v-list-item-subtitle class="fs-11 color-grey" >
                        <span class="color-grey">
                        Từ: {{$moment(item.start_time_at).format("HH:mm")}}- {{$moment(item.end_time_at).format("HH:mm")}}- Ngày:{{$moment(item.end_time_at).format("DD/MM/YY")}} </span>
                        </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </template>
        </v-combobox >
        <v-dialog  v-model="dialog" width="357">
            <template v-slot:activator="{on}">
                <v-btn style="height:32px; margin-top:1px" v-show="!showSearch" depressed small class="fs-13" v-on="on">
                    <v-icon>mdi-plus</v-icon> <span class="fw-400"> Tạo task</span>
                </v-btn>
            </template>
            <TaskForm  @cancel="cancel()"/>
        </v-dialog>
          <v-btn style="margin-right:-5px" class="ml-1" icon @click="showSearch=!showSearch">
            <i style="font-size:22px" class=" mdi mdi-magnify"></i>
        </v-btn>
    </div>
</template>

<script>
import TaskForm from "./../../components/timesheet/TaskForm";
import timesheetApi from "./../../api/timesheet";

export default {
    data: () => ({
        dialog: false,
        searchLogTime:'',
        showSearch:false,
        list:[]
    }),
    methods: {
        cancel() {
            this.dialog = false;
        },
        searchLogTimeList(data){
            let list = [];
            let userId = this.$store.state.app.endUserInfo.id;
               timesheetApi.getFilterLog(data,2263).then(res=>{
                if(res.status==200){
                    res.data.listObject.map(data=>{
                        if(data.account_id==userId){
                            this.list.push(data)
                        }
                    })
                }
            })
            this.list = list;
            
        },
          findStartEnd(time){
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment(time).format('YYYY-MM-DD'));
            // this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment + 1);
        },
    },
    components:{
        TaskForm

    },
    watch:{
         searchLogTime(){
           this.searchLogTimeList(this.searchLogTime)
       }

    },

    props: ['type'],
}
</script>

<style lang="scss" scoped>
.sub-action-buttons {
    width: 230px;
    margin-left: -5px;
    margin-top: 2px;
}

.month-sub-action-buttons {
    width: 530px;
    margin-right: 30px;
    margin-top: 2px;
}

.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
    font-size: 13px;
}


</style>
