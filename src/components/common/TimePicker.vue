<template>
    <v-row class="row-time-select">
            <v-col cols="5">
                <h5 class="select-time-title">Chọn giờ</h5>
            </v-col>
            <v-col cols="6">
            <v-combobox
            v-model="time"
            :items="times"
            :rules="[rules.match]"
            ></v-combobox>
            </v-col>

        </v-row>
</template>
<script>
export default {
    data(){
        return {
            times:null,
            time:null,
            rules: {
                match: v =>{
                    const pattern = /(1[012]|[1-9]):[0-5][0-9](\\s)?( |)(am|pm)/
                    return pattern.test(v) || "Sai định dạng thời gian"} ,
            },
        }
    },
    beforeMount(){
        this.time = this.formatAMPM(new Date());
        this.date = new Date().toISOString().substr(0, 10),
        this.times = [
            "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
            "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", 
            "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", 
            "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
            "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
            "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", 
            "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", 
            "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]
    },
    methods:{
        
        formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        },
        getTime(){
            return this.time;
        }
    }
}
</script>
<style scoped>
    .select-time-title{
        padding: 10px 0px 10px 20px;
        font-size: 13px !important;
    }
    .row-time-select .col{
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
</style>