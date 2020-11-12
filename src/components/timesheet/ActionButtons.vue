<template>
<v-col class="float-lg-right action-buttons">
    <div v-if="type!='month'" class="sub-action-buttons">
        <v-dialog v-model="dialog" width="357">
            <template v-slot:activator="{on}">
                <v-btn style="font-weight: normal;margin-left:-23px!important" depressed small class=" fs-13" v-on="on">
                   <v-icon>mdi-plus</v-icon> <span class="fw-430"> Tạo task</span>
                </v-btn>
            </template>
            <TaskForm @cancel="cancel()"/>
        </v-dialog>
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
