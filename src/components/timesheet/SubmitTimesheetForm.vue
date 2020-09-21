<template>
<v-card>
    <v-card-title class="headline lighten-2" 
    primary-title style="padding-bottom: 22px">
        <div 
        style="border-bottom: 1px solid lightgrey!important; width: 370px; padding-bottom: 10px;font-size: 18px!important">
        {{$t('timesheet.submit_timesheet_form')}}</div>
    </v-card-title>
    <v-card-text style="color: black;font-size: 13px">
        {{$t('timesheet.period')}}: <span style="font-weight:430">{{startEndDate.slice(0,8)}}</span> đến <span style="font-weight:430">{{startEndDate.slice(11,19)}}</span>
    </v-card-text>
    <v-card-text style="color: black;font-size: 13px">
        {{$t('timesheet.hours_logged')}}: {{hours}}
    </v-card-text>
    <v-card-text style="color: black;font-size: 13px">
        {{$t('timesheet.hours_required')}}: {{hoursRequired}}
    </v-card-text>
    <v-card-text style="color: black;font-size: 13px">
        {{$t('timesheet.reviewer')}}
        <v-select class="select-reviewer" 
        v-model = 'reviewerSubmit'
        :items="reviewer.name" item-color="white" 
        background-color="#F7F7F7" :menu-props="{'nudge-top':-40}">
        </v-select>
    </v-card-text>
    <v-card-text>
    </v-card-text>
    <v-card-actions style="padding-bottom:20px">
        <div style="width:100%; float:right">
            <v-btn 
                style="float:right; margin-right:15px" 
                @click="cancel()">
                {{$t('timesheet.cancel')}}
            </v-btn>
            <v-btn 
            @click="submit()"
            color="primary" 
            style="float:right; margin-right:15px;">{{$t('timesheet.submit')}}</v-btn>
        </div>
    </v-card-actions>
</v-card>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            view: ['task', 'label', 'category task'],
            reviewerSubmit:'',
            reviewer: {
                name: ["Thắng Nguyễn", "Dinh Nguyễn"],
                icon: ['1', '2'],
            },
        }
    },
    props:['hours'],
    methods: {
        submit(){
            if(this.reviewerSubmit==""){ alert("Vui lòng chọn người duyệt")}else{
                 alert("submit thành công");
            }
        },
        cancel() {
            this.$emit('cancel');
        }
    },
    computed: {
        startEndDate() {
            return this.$store.getters['timesheet/submitStartEndDate'];
        },
        startDate() {
            let start= this.$store.getters['timesheet/submitStartEndDate'];
            return start.slice(0,8);
        },
        hoursRequired() {
            return this.$store.getters['timesheet/getTotalHoursBy']('submit');
        }
    }
}
</script>
<style lang="scss" scoped>

.select-reviewer::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.select-reviewer::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.select-reviewer ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.v-select__selection {
    padding-left: 3px !important;
    font-size: 14px !important
}

.v-card__text {
    color: black;
}

button {
    font-weight: normal;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}
</style>