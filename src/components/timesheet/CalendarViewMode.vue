<template>
<div class="calendar-viewmode">
    <v-btn v-if="type === 'week'||type ==='day'||type === 'weekday'" icon @click="timeView()">
            <v-tooltip top>
                        <!-- màn hình month - header ngày, giờ -->
                <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-clock-outline</v-icon>
                </template>
                <span>
                    Time view
                </span>
            </v-tooltip>
    </v-btn>
    <v-btn class="mr-2" v-if="type === 'week'||type ==='day'||type === 'weekday'" icon @click="listView()">
         <v-tooltip top>
          <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-apps</v-icon>
                </template>
                <span>
                    List view
                </span>
            </v-tooltip>
    </v-btn>
    <span style="padding-right: 10px" v-if="type === 'month'"> </span>
    <v-select style="margin-top:0px" 
    @change="changeView" :value="type" class="viewmode" :menu-props="{'nudge-top':-40}" :items="types" 
    item-color="white" label="View" background-color="#F7F7F7">
        <template v-slot:item="data">
            <span class="viewmode-item">{{ format(data.item) }}
                <v-icon v-if="data.item === type" color="success">
                    mdi-check</v-icon>
            </span>
        </template>
        <template v-slot:selection >
          <span style= "color:black!important; padding-left:4px"> {{format(type)}}</span>
        </template>
    </v-select>
</div>
</template>

<script>
export default {
    data: () => ({
        types: ['day', 'weekday', 'week', 'month'],
    }),
    computed: {
        type() {
            return this.$store.state.timesheet.calendarType;
        }
    },
    methods: {
        changeView(_type) {
            this.$store.commit("timesheet/changeCalendarType", _type);
        },
        timeView() {
            this.$emit('time_view');
        },
        listView() {
            this.$emit('list_view');
        },
        format(date) {
            switch (date) {
                case 'week':
                    return this.$t('timesheet.week');
                    break;
                case 'day':
                    return this.$t('timesheet.day');
                    break;
                case 'month':
                    return this.$t('timesheet.month');
                    break;
                case 'weekday':
                    return this.$t('timesheet.weekday');
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}

.calendar-viewmode {
    float: right;
    height: 30px;
    padding-right: 30px;
    margin-top: 11px;
    padding-bottom: 34px;
   // border-left: 1px solid lightgrey
}

span {
    font-size: 13px !important;
    font-family: Roboto !important;
    font-weight: normal !important;
}

button {
    font-weight: normal;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.viewmode {
    margin-top:2px!important;
    width: 125px;
    float: right;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 2px;
    padding-left: 0px;
}

.viewmode ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.viewmode ::v-deep .v-input__control .v-select__selection {
    margin-left: 4px;

}

.viewmode ::v-deep .v-label--active {
    display: none;
}

.viewmode ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.viewmode ::v-deep .v-input__slot:before {
    border-color: transparent !important;
    height:25px!important;margin-top:3px;
}

.viewmode ::v-deep .v-input__slot:after {
    border-color: transparent !important;
    height:25px!important;margin-top:3px;
}

.viewmode-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}
</style>
