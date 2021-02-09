<template>
<div>
    <div @dblclick="openLogTimeDialog(event, true)"  class="d-flex flex-column h-100">
        <div v-if="event.type==null" class="v-event-draggable" v-html="eventSummary">Task</div>
        <div class="d-flex flex-row fs-14 pl-2" style="padding-top:2px">
            <div class="fs-13 fm text-ellipsis" :style="{'width':(findDuration(event.start, event.end)>62)?'70%':'75%'}">
                <span v-if="findDuration(event.start, event.end)<62">
                    <v-icon v-if="event.type==0" class="fs-15" color='primary'>
                        mdi-calendar</v-icon>
                    <v-icon v-else class="fs-15" color='success'>mdi-check-all</v-icon>
                </span>
                <b style="color:#303030" class="fs-12 fw-430">{{event.name}}</b>
            </div>
            <div style="margin-top:-8px">
                <v-menu open-on-focus transition="scale-transition" open-on-hover bottom left nudge-left='5' nudge-top='-10'>
                    <template v-slot:activator="{ on: actionEvents, attrs: actionAttrs }">
                        <span class="fs-12 ml-1 fw-430" v-if="findDuration(event.start, event.end)<62" v-on="actionEvents" style="margin-right:-20px">
                            {{getDuration(eventParsed.input.start,eventParsed.input.end)}}
                        </span>
                        <v-btn class="ml-1" dense dark icon="actionAttrs" v-on="actionEvents">
                            <v-icon v-if="event.type" small class=" fs-13 ml-4" :style="{'margin-right':(findDuration(event.start, event.end)>62)?'':':25px'}" style="color:black">
                                mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <div class="d-flex flex-column">
                        <v-btn class="font-normal fs-13" depressed @click="openLogTimeDialog(event, true)">{{$t('common.update')}}</v-btn>
                        <v-btn class="font-normal fs-13" depressed @click="openDeleteDialog(event)">{{$t('common.delete')}}</v-btn>
                        <v-btn class="font-normal fs-13" depressed @click="copyLogTime(event)">Sao chép</v-btn>
                    </div>
                </v-menu>
            </div>
        </div>
        <div v-if="findDuration(event.start, event.end)>105" 
            style="color:grey; 
            height: 30px" class="fs-12 text-ellipsis pl-2">
            {{event.desc ? event.desc: "" }}
        </div>
        <v-spacer />
        <div class="pa-2 w-100 d-flex flex-row justify-space-between align-center">
            <div>
                <span v-if="findDuration(event.start, event.end)>70">
                    <v-icon v-if="event.type==0" class="fs-15" color='primary'>
                        mdi-calendar</v-icon>
                    <v-icon v-if="event.type==1" class="fs-15" color='success'>mdi-check-all</v-icon>
                </span>
                <span style="color:grey" class="fs-12 text-ellipsis" v-if="findDuration(event.start, event.end)>70">
                    {{event.category_key}}
                </span>
            </div>
            <div>
                <div v-if="findDuration(event.start, event.end)>61" class="fs-11 font-normal" style="float: right;font-weight:410;margin-top: -5px">
                    {{getDuration(eventParsed.input.start,eventParsed.input.end )}}
                </div>
            </div>
        </div>
    </div>
    <div v-if="timed" class="v-event-drag-bottom" style="height:10px" @mousedown.stop="extendBottom(event)">
    </div>
</div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    openLogTimeDialog(event, update = false) {
        this.$emit('create-time', {
            update: update,
            logtimeEvent: event,
            onSave: () => this.load(),
            onCancel: update ? () => null : () => this.events.splice(this.events.indexOf(event), 1)
        });
    },
  },

}
</script>
