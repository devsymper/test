<template>
<v-col class="float-lg-right action-buttons">
    <div v-if="type!='month'" class="sub-action-buttons">
        <!-- <v-hover v-slot:default>
            <v-btn depressed small class="mr-1" color="#162D89" dark @click="$router.push('/timesheet/submit')">
                <span style='color:white'>
                    {{$t('timesheet.timesheet_button')}}
                </span>
            </v-btn>
        </v-hover> -->
        <v-dialog v-model="dialog" width="357">
            <template v-slot:activator="{on}">
                <v-btn style="font-weight: normal;margin-left:-23px!important" depressed small class=" fs-13" v-on="on">
                   <v-icon>mdi-plus</v-icon> <span class="fw-430"> Tạo task</span>
                </v-btn>
                <!-- <button  type="button" class="ml-1 v-btn theme--light v-size--small" 
                style="margin-left:-40px!important"><span><i aria-hidden="true" class=" mr-4 v-icon notranslate mdi mdi-plus theme--light" 
                style="font-size: 18px;"></i><span  class="ml-2">
                    Tạo task</span></span></button> -->
            </template>
            <TaskForm @cancel="cancel()"/>
        </v-dialog>
    </div>
    <div v-if="type=='month'" style='width: 420px; float: right; font-size: 11px; margin-right: -110px; margin-top: 3px;'>
        <div style="font-size:13px; float:left; margin-top: 7px; margin-left:85px; margin-right:5px">
            <v-tooltip top>
                <template v-slot:activator="{ on}">
                    <span v-on="on">Rej: 20h</span>
                </template>
                <span>Rejected</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span v-on="on">/ Sub: 20h</span>
                </template>
                <span>Submitted </span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span v-on="on">/ App: 20h</span>
                </template>
                <span>Approved</span>
            </v-tooltip>
           
        </div>
        <v-hover v-slot:default>
            <v-btn style="padding-left:10px" depressed small class="mr-2" color="success">Task
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-hover>
    </div>
</v-col>
</template>

<script>
import TaskForm from "./../../components/timesheet/TaskForm";

export default {
    data: () => ({
        dialog: false,
    }),
    methods: {
        cancel() {
            this.dialog = false;
        }
    },
    components:{
        TaskForm

    },
    watch:{

    },

    props: ['type'],
}
</script>

<style lang="scss" scoped>
.action-buttons {
    margin-right: 10px;
    padding-left: 0px;
    width: 60px;

}

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

span {
    font-size: 13px !important;
    font-family: Roboto !important;
    font-weight: normal !important;

}
</style>
