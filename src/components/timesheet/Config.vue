<template>
<v-card>
    <v-tabs v-model="tab" color="orange" grow style="flex-grow: 0">
        <v-tab href="#tab-2" class="tab">
            {{$t('timesheet.period')}}
        </v-tab>
        <v-tab href="#tab-3" class="tab">
            {{$t('timesheet.remind')}}
        </v-tab>
        <v-tab href="#tab-4" class="tab">
           Loại việc
        </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="flex-grow: 1">
        <!-- start of tab 1 -->

        <!-- start of tab 2 -->
        <v-tab-item :key="2" :value="'tab-' + 2" class="tab-item" style="flex-grow: 1">
            <v-divider></v-divider>
            <div class="d-flex flex-column flex-grow-1" style="padding-bottom: 4rem">
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <span class="font">{{$t('timesheet.fre_submit')}}:</span>
                    </div>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <v-select 
                        :items="frequency_submissions" v-model="periodConfig.freqSubmission" :menu-props="{'nudge-top':-40}" class="groupBy" style="width: 140px" item-color="white" label="Select" background-color="#F7F7F7">
                        </v-select>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <span class="font">
                            {{$t('timesheet.fow')}}:
                        </span>
                    </div>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <v-select class="groupBy" 
                        :items="first_day_of_months" v-model="periodConfig.firstDoM" :menu-props="{'nudge-top':-40}" style="width: 140px" item-color="white" label="Select" background-color="#F7F7F7">
                        </v-select>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <span class="font">
                              {{$t('timesheet.fom')}}:
                        </span>
                    </div>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <v-select :items="first_day_of_weeks" v-model="periodConfig.firstDoW" :menu-props="{'nudge-top':-40}" class="groupBy" style="width: 140px" item-color="white" label="Select" background-color="#F7F7F7">
                        </v-select>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <span class="font">
                               {{$t('timesheet.hour_required')}}:
                        </span>
                    </div>
                    <div class="d-flex flex-column justify-center align-start" style="flex-basis: 40%">
                        <input type="text" v-model="periodConfig.hoursRequired" class="input-logtime font">
                        <span class="red--text" v-show="hoursRequiredError">{{hoursRequiredError}}</span>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-8'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%">
                        <span class="font">   {{$t('timesheet.working_day')}}:</span>
                    </div>
                    <div class="d-flex justify-start align-center" style="flex-basis: 40%"></div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-space-between align-center" style="flex-basis: 80%">
                        <div class="d-flex flex-column">
                            <v-checkbox label="Mon" v-model="periodConfig.workingDays['Mon']" color="success" class="check-box"></v-checkbox>
                            <v-checkbox label="Fri" v-model="periodConfig.workingDays['Fri']" color="success" class="check-box"></v-checkbox>
                        </div>
                        <div class="d-flex flex-column">
                            <v-checkbox class="check-box" label="Tue" v-model="periodConfig.workingDays['Tue']" color="success"></v-checkbox>
                            <v-checkbox class="check-box" label="Sat" v-model="periodConfig.workingDays['Sat']" color="success"></v-checkbox>
                        </div>
                        <div class="d-flex flex-column">
                            <v-checkbox class="check-box" label="Wed" v-model="periodConfig.workingDays['Wed']" color="success"></v-checkbox>
                            <v-checkbox class="check-box" label="Sun" v-model="periodConfig.workingDays['Sun']" color="success"></v-checkbox>
                        </div>
                        <div class="d-flex flex-column align-self-start">
                            <v-checkbox class="check-box" label="Thu" v-model="periodConfig.workingDays['Thu']" color="success"></v-checkbox>
                        </div>
                    </div>
                </v-row>
                <v-row class="flex-grow-1">
                    <button @click="onSavePeriod" 
                    type="button"
                     class="font v-btn v-btn--depressed theme--light v-size--small primary" 
                    style="margin-left: 350px; align-self: flex-end">
                        <span>
                            <i class="v-icon  mr-2 mdi mdi-content-save"></i>
                            {{$t('timesheet.save')}}
                        </span>
                    </button>
                </v-row>
            </div>
        </v-tab-item>
        <!-- end of tab 2 -->

        <!-- start of tab 3 -->
        <v-tab-item :key="3" :value="'tab-' + 3" class="tab-item">
            <v-divider></v-divider>
            <div class="d-flex flex-column flex-grow-1" style="padding-bottom: 4rem">
                <v-row class='justify-center align-center flex-grow-0 '>
                    <div class="d-flex justify-start align-center" style="flex-basis: 80%">
                        <span style="margin-right: 6rem; width: 100px;" class="font">{{$t('timesheet.daily_log')}}:</span>
                        <v-checkbox v-model='check_daily' color="success" class="check-box">
                        </v-checkbox>
                        <template v-if="check_daily">
                            <span class="font ml-8 mr-8">{{$t('timesheet.time')}}:</span>
                            <v-menu ref="menu" nudge-top="-10" nudge-left="100" 
                            :close-on-content-click="false" 
                            :return-value.sync="time_remind_daily_log"
                             transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <input type="text" v-on="on" v-model="time_remind_daily_log" class="input-logtime font">
                                </template>
                                <v-time-picker width="200px" height="240px" 
                                header-color="green lighten-1" v-if="time_remind_daily_log" 
                                scrollable v-model="time_remind_daily_log"
                                 @click:minute="$refs.menu.save(time_remind_daily_log)">
                                </v-time-picker>
                            </v-menu>
                        </template>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 80%">
                        <span style="margin-right: 3rem; width:150px" class="font">{{$t('timesheet.submit_remind')}}:</span>
                        <v-select :items="submit_timesheet" :menu-props="{'nudge-top':-40}" v-model="submit_timesheet_selected" class="select" placeholder="Select" item-color="white" background-color="#F7F7F7">
                        </v-select>
                    </div>
                </v-row>
                <v-row class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 80%">

                        <template v-if="submit_timesheet_selected!='monthly'">
                            <span class="font" style="width: 120px">{{$t('timesheet.date_submit')}}:</span>
                            <v-select style="margin-left:5rem" v-model="date_submited"
                            :items="date_submit.week" :menu-props="{'nudge-top':-40}" class="select" placeholder="Select" 
                            item-color="white" background-color="#F7F7F7">
                            </v-select>
                        </template>
                        <template v-if="submit_timesheet_selected==='monthly'">
                            <span class="font" style="width: 120px">{{$t('timesheet.date_submit')}}:</span>
                            <v-select style="margin-left:5rem" :menu-props="{'nudge-top':-40}" :items="date_submit.month" 
                            :value="date_submited" class="select" placeholder="Select" item-color="white" background-color="#F7F7F7">
                            </v-select>
                        </template>

                    </div>
                </v-row>
                <v-row v-if="submit_timesheet_selected==='biweekly'" class='justify-center align-center flex-grow-0 mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 80%">
                        <span class="font mr-4" style="width:80px">{{$t('timesheet.week_remind')}}:</span>
                        <v-select style="margin-left:6.4rem" :menu-props="{'nudge-top':-40}" 
                        :items="date_submit.week_time" v-model="week_remind" class="select" placeholder="" 
                        item-color="white" background-color="#F7F7F7">
                        </v-select>
                        <v-spacer></v-spacer>
                    </div>
                </v-row>
                <v-row v-if="submit_timesheet_selected" class='justify-center align-center flex-grow-0  mt-4'>
                    <div class="d-flex justify-start align-center" style="flex-basis: 80%">
                        <span style="margin-right: 7.6rem; width: 78px" class="font">{{$t('timesheet.time')}}:</span>
                        <v-menu ref="menu2" nudge-top="-10" nudge-left="100" :close-on-content-click="false" :return-value.sync="time_submit_timesheet" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <input type="text" v-on="on" v-model="time_submit_timesheet" class="input-logtime font">
                            </template>
                            <v-time-picker width="200px" height="240px" 
                            header-color="green lighten-1" v-if="time_submit_timesheet" 
                            scrollable v-model="time_submit_timesheet" @click:minute="$refs.menu2.save(time_submit_timesheet)">
                            </v-time-picker>
                        </v-menu>
                    </div>
                </v-row>

                <v-row class="flex-grow-1">
                    <button type="button" class="font v-btn v-btn--depressed theme--light v-size--small primary" 
                    @click="saveRemind()" style=" margin-left: 350px; align-self: flex-end">
                        <span>
                            <i class="v-icon  mr-2 mdi mdi-content-save" ></i>
                              {{$t('timesheet.save')}}
                        </span>
                    </button>
                </v-row>
            </div>
        </v-tab-item>
        <!-- end of tab 2 -->
        <!-- tab4 -->
          <v-tab-item :key="4" :value="'tab-' + 4" class="tab-item">
            <v-divider></v-divider>
           <div class="d-flex flex-column flex-grow-1" style="padding-bottom: 4rem">
                <v-row class='d-flex justify-start mr-7 align-center flex-grow-0 mt-4 ml-4'>
                    <div class="d-flex align-center ml-3 mr-4">
                        <span class="font">
                            Thêm mới </span>
                    </div>
                    <div class="d-flex justify-start">
                        <v-dialog v-model="dialog" width="357">
                            <template v-slot:activator="{on}">
                                <v-btn style="font-weight: normal" depressed small class="mr-2 fs-13" color="success" v-on="on">
                                    Loại công việc  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <CategoryForm :update="updateCategory" @updateList="getListCategory()" @cancel="cancel()"/>
                       </v-dialog>
                    </div>
                </v-row>
                 <v-row class='d-flex justify-start align-center flex-grow-0 mt-4 ml-4'>
                    <div class="d-flex align-center ml-3 mr-4">
                        <span class="font">
                            Danh sách loại công việc</span>
                    </div>
                </v-row>
                 <v-row class='d-flex justify-start align-center flex-grow-0 mt-4 ml-8 mr-5'>
                    <v-row>
                         <v-data-table dense :headers="headers" :items="categoryTask" item-key="name" class="elevation-1">
                             <template v-slot:item.actions="{ item }">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                        >
                        mdi-pencil
                        </v-icon>
                        <v-icon
                        small
                        @click="deleteItem(item)"
                        >
                        mdi-delete
                        </v-icon>
                     </template>
                         </v-data-table>
                    </v-row>
                </v-row>
                <v-row class="flex-grow-1">
                </v-row>
            </div>
        </v-tab-item>
        <!-- tab4 -->
    </v-tabs-items>
</v-card>
</template>

<script>
import timesheetApi from '../../api/timesheet';
import CategoryForm from "../../components/timesheet/CategoryForm";
export default {
    components:{
        CategoryForm,
    },
    data() {
        return {
               dialog: false,
            // permission
            hr_roles: [{
                    name: "Nguyễn Quốc Tân",
                    image: ''
                },
                {
                    name: "Nguyễn Việt Dinh",
                    image: ''
                },
            ],
            hrConfig:"Nguyễn Quốc Tân",
            // period
            week_remind:'2',
            frequency_submissions: ['weekly', 'biweekly', 'monthly'],
            first_day_of_months: Array.from(Array(28), (_, i) => i + 1 + ""),
            first_day_of_weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            periodConfig: {
                freqSubmission: '',
                firstDoM: '',
                firstDoW: '',
                hoursRequired: '',
                workingDays: {
                    'Mon': false,
                    'Tue': false,
                    'Wed': false,
                    'Thu': false,
                    'Fri': false,
                    'Sat': false,
                    'Sun': false
                }
            },
            hoursRequiredError: '',
            //table
            updateCategory:{},
            categoryTask: [
            ],
            headers: [
            {
                text: 'ID',
                value: 'id',
            },
            {
                text: 'Tên loại việc',
                value: 'name',
            },
             {
                text: 'Key',
                value: 'key',
            },
              { text: 'Chức năng', value: 'actions', sortable: false },
            ],
            
            // remind
            date_submited: "",
            time_remind_daily_log: '10:00',
            check_daily: '',
            time_date_submit: '10:00',
            time_submit_timesheet: '08:00',
            week_time: '',
            items: [],
            view: ['day', 'week', 'month'],
            submit_timesheet: ['weekly', 'biweekly', 'monthly'],
            submit_timesheet_selected: '',
            date_submit: {
                week: [
                    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
                ],
                month: Array.from(Array(12), (_, i) => i + 1 + ""),
                week_time: ['1', '2'],
            },

            tab: null,

            //category
            listCategory:[]
        }
    },
    methods: {
        deleteItem(item){
            let self = this;
            timesheetApi.deleteCategory({id:item.id}).
             then(res => {
                 if (res.status === 200) {
                     console.log('Thành công');
                     self.getListCategory();
                 }
                }).catch(console.log);
        },
        editItem(item){
            this.updateCategory = item;
            this.dialog = true;
        },
        cancel(){
            this.dialog = false
        },
        getListCategory(){
            let self= this;
             timesheetApi.getAllCategory({}).then(res => {
                if (res.status === 200) {
                    self.categoryTask=[];
                    self.listCategory = res.data.category;
                     console.log(self.listCategory); 
                     for(let i=0; i<self.listCategory.length; i++){
                         self.categoryTask.push({
                            name: self.listCategory[i].name,
                            key: self.listCategory[i].key,
                            id:self.listCategory[i].id,

                         })
                     }
                    }
                }).catch(console.log);
        },
          saveHr(){
             alert('Lưu thành công')
        },
        saveRemind(){
            console.log(this.date_submited);
            timesheetApi.updateRemindInfo({
            submitTimesheet:this.submit_timesheet_selected,
            isDailyLog: this.check_daily==true?1:0,            
            timeDailyLog: this.time_remind_daily_log ,
            dateSubmit: this.date_submited,
            timeSubmit: this.time_submit_timesheet ,
               weekRemind: this.week_remind,
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res);
                        alert('Lưu thành công')
                        
                    }
                })
                .catch(console.log);

        },
        onSavePeriod() {
            const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
            let hourFormat = this.hoursRequiredError;
            const self= this;
            if (timeRegex.test(this.periodConfig.hoursRequired)) {
                
                let requiredHours= self.periodConfig.hoursRequired.split(":");
                let totalMinutes = Number(requiredHours[0])+(Math.round(Number(requiredHours[1])/60*100)/100)
                console.log(totalMinutes);
                timesheetApi.updateConfigInfo({
                        // HrRoles: this.firstDoM,
                        freSubmit: self.periodConfig.freqSubmission ,
                        firstDOM: self.periodConfig.firstDoM,
                        firstDOW: self.periodConfig.firstDoW,
                        hoursRequired: totalMinutes,
                        isWorkingMonday: self.periodConfig.workingDays.Mon==true?1:0,
                        isWorkingTuesday: self.periodConfig.workingDays.Tue==true?1:0,
                        isWorkingWednesday:self.periodConfig.workingDays.Wed==true?1:0,
                        isWorkingThursday:self.periodConfig.workingDays.Thu==true?1:0,
                        isWorkingFriday: self.periodConfig.workingDays.Fri==true?1:0,
                        isWorkingSaturday:self.periodConfig.workingDays.Sat==true?1:0,
                        isWorkingSunday: self.periodConfig.workingDays.Sun==true?1:0,
                    })
                    .then(res => {
                        if (res.status === 200) {
                            console.log(res);
                            self.hoursRequiredError="";
                            self.$emit('cancel');
                            alert('Lưu thành công');
                        }
                    })
                    .catch(console.log);
                this.$store.commit('timesheet/updatePeriod', this.periodConfig);
                hourFormat= '';

            } else {
                this.hoursRequiredError = 'Invalid format';
            }
            hourFormat= '';
        }
    },
    created() {
        this.getListCategory();
        this.periodConfig = this.$store.state.timesheet.period;
        // console.log(this.periodConfig.firstDoM);
        const self = this;
        timesheetApi.getConfigInfo()
            .then(res => {
                if (res.status === 200) {
                    //tab 2
                    let hourRequired= res.data.listConfig[0].hoursRequired.split(".");
                    let minutes = hourRequired[1]?(hourRequired[1]*6).toString().slice(0, 2).padStart(2, '0'):'00';
                    
                    let hour = hourRequired[0].slice(0,1).padStart(2,'0');
                    let time= hour+':'+minutes;
                    self.periodConfig.firstDoM = res.data.listConfig[0].firstDOM;
                    self.periodConfig.firstDoW = res.data.listConfig[0].firstDOW;
        
                    self.periodConfig.freqSubmission = res.data.listConfig[0].freSubmit;
                    self.periodConfig.hoursRequired = time;
                    self.periodConfig.check_daily = res.data.listConfig[0].isDailyLog;
                    self.periodConfig.workingDays['Mon'] = res.data.listConfig[0].isWorkingMonday=="1"?true:false;
                    self.periodConfig.workingDays['Tue'] = res.data.listConfig[0].isWorkingTuesday =="1"?true:false;
                    self.periodConfig.workingDays['Wed'] = res.data.listConfig[0].isWorkingWednesday=="1"?true:false;
                    self.periodConfig.workingDays['Thu'] = res.data.listConfig[0].isWorkingThursday=="1"?true:false;
                    self.periodConfig.workingDays['Fri'] = res.data.listConfig[0].isWorkingFriday=="1"?true:false;
                    self.periodConfig.workingDays['Sat'] = res.data.listConfig[0].isWorkingSaturday=="1"?true:false;
                    self.periodConfig.workingDays['Sun'] = res.data.listConfig[0].isWorkingSunday=="1"?true:false;
                    //tab 3
                    self.submit_timesheet_selected = res.data.listConfig[0].submitTimesheet;
                    self.check_daily = res.data.listConfig[0].isDailyLog=="1"?true:false;
                    self.time_remind_daily_log = res.data.listConfig[0].timeDailyLog;
                    self.date_submited = res.data.listConfig[0].dateSubmit;
                    self.time_submit_timesheet = res.data.listConfig[0].timeSubmit;
                    self.week_remind = res.data.listConfig[0].weekRemind;

                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}

.input-logtime {
    background-color: #F7F7F7;
    width: 60px;
    height: 32px !important;
    border-radius: 2px;
    padding-left: 12px;
}

.font {
    font-size: 13px;
    font-family: Roboto;
    font-weight: normal;
}

.check-box ::v-deep .v-label {
    color: black !important;
    font-size: 13px !important;
    font-family: Roboto !important;

}

.groupBy {
    width: 91px;
    float: right;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}

.groupBy ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.groupBy ::v-deep .v-label {
    left: 0px;
    right: auto;
    position: absolute;
    font-size: 13px;
    padding-left: 10px
}

.groupBy ::v-deep .v-label--active {
    display: none;
}

.groupBy ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.groupBy ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.groupBy ::v-deep .v-input__control {
    margin-right: 4px !important
}

.groupBy-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}

.tab {
    font-size: 13px !important;
    text-transform: capitalize;
    font-weight: normal;

}

.select ::v-deep .v-label--active {
    display: none;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}

.select {
    margin-top: 2px !important;
    width: 60px !important;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
}

.select ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.select ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.tab-item {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.v-list-item {
    height: 25px;
}
</style>
