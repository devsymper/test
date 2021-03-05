<template>
    <v-card>
        <v-card-title primary-title class="pt-2">
            <div style="border-bottom: 1px solid lightgrey" class="w-100">
                <span class="fs-16 fw-430" >{{$t('common.delete')}} {{formattedDeleteEvent.name}}</span> 
                </div>
        </v-card-title>
        <v-card-text style="height:55px!important ">
            <span class="label pt-2 ">{{$t('timesheet.category_task')}}</span>
        <br/> {{getCategoryName(formattedDeleteEvent.category)}}
        </v-card-text>
        <v-card-text style="height:55px" >
            <span class="label pt-2">{{$t('timesheet.task')}}</span>
            <br/> {{formattedDeleteEvent.name}}
        </v-card-text>
        <v-card-text>
            <div style="height:32px; margin-top:3px">
                <div class="date ">
                    <span class="label pt-2">{{$t('timesheet.date')}}</span>
                    {{formattedDeleteEvent.date}}
                </div>
                <div class="duration">
                    <span class="label pt-2">{{$t('timesheet.duration')}}</span>
                    {{formattedDeleteEvent.durationFormatted}}
                </div>
                <div class='start-time'>
                    <span class="label pt-2">{{$t('timesheet.start_time')}}</span>
                    {{formattedDeleteEvent.start}}
                </div>
                <div style="width:60px; float: left">
                    <span class="label pt-2">{{$t('timesheet.end_time')}}</span>
                    {{formattedDeleteEvent.end}}
                </div>
            </div>
        </v-card-text>
        <v-card-text v-if="formattedDeleteEvent.desc" class="div-description">
            <span class="label pt-2">{{$t('timesheet.description')}}</span>
            <br/> {{formattedDeleteEvent.desc}}
        </v-card-text>
        <v-card-actions class="d-flex flex-row-reverse mr-3 pb-5 mt-2">
            <v-btn small class="ml-2" color="error" @click="doDelete">{{$t('common.delete')}}</v-btn>
            <v-btn small  @click="$emit('cancel')">{{$t('common.cancel')}}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import timesheetApi from '../../api/timesheet';
export default {
    props: ['deleteEvent', 'onDelete', 'onCancel'],
    data() {
        return {
            formattedDeleteEvent: {},
        }
    },
    computed:{
        listCategory(){
           return this.$store.state.timesheet.listCate;
        }
    },
    methods: {
        getCategoryName(evt){
            let cate = this.listCategory.filter(c=>c.id==evt)[0];
            return cate.key + "-" + cate.name
        },
        doDelete() {
            this.onDelete();
            timesheetApi.deleteLogTime({
                id: this.deleteEvent.id,
                docObjId:this.deleteEvent.docObjId  
            }).then(res => {
                if (res.status === 200) {
                }else{
                    this.$snotify({
                        type: "error",
                        title: "Lỗi",
                    })
                }
                }).catch(console.log)
            this.$emit('cancel');
        }
    },
    watch: {
        deleteEvent() {
            this.formattedDeleteEvent = {
                ...this.deleteEvent,
                date: this.$moment(this.deleteEvent.start).format('DD/MM/YYYY'),
                start: this.$moment(this.deleteEvent.start).format('HH:mm'),
                end: this.$moment(this.deleteEvent.end).format('HH:mm'),
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.div-description {
    clear: left;
    clear: right;
}
.description {
    padding-left: 10px;
    width: 100%;
    height: 80px;
    background-color: #F7F7F7;
}
.v-card ::v-deep .v-card__text {
    padding-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    font-size: 13px;
    font-family: Roboto;
    color: black
}
.date {
    width: 100px;
    float: left;
    margin-right: 17px;
}

.duration {
    width: 60px;
    float: left;
    margin-left: -10px;
    margin-right: 10px;
}

.start-time {
    width: 60px;
    margin-right: 10px;
    float: left;
}
</style>
