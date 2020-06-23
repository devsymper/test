<template>
    <v-card class="card-datetime-picker"
    
    :style="position"
    v-show="isShow" ref="symperDateTimePicker">
        <h4 class="heading">{{title}}</h4>
        <v-divider></v-divider>
        <v-date-picker class="date-picker" @click:date="dateSelected" v-model="date" no-title></v-date-picker>
       
        <sym-time-picker v-if="isTime"></sym-time-picker>
        <button v-if="isTime" v-on:click="applyDateTime" class="apply-time">
            Áp dụng
        </button>
    </v-card>
</template>
<script>
import TimePicker from './TimePicker.vue'
export default {
    components:{
        'sym-time-picker':TimePicker
    },
    props:{
        title:{
            type:String,
            default:"Chọn ngày giờ"
        },
        isTime:{
            type:Boolean,
            default:true
        },
        keyInstance:{
            type:Number,
            default:0
        }
        
    },
    created() {
        let thisCpn = this;
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (this.keyInstance == 0 && !$(evt.target).hasClass("input-item-func") && 

                (!$(evt.target).hasClass("card-datetime-picker") &&
                $(evt.target).closest(".card-datetime-picker").length == 0) &&
                (!$(evt.target).hasClass("v-list-item") &&
                $(evt.target).closest(".v-list-item").length == 0)
            ) {
                thisCpn.closePicker();
            }
        });
    },
    data(){
        return {
            date:null,
            isShow:false,
             position:null,
        }
    },
    beforeMount(){
        this.position = {
                        top:0,
                        left:'35px'
                    }
    },
  
    methods:{
        closePicker() {
            this.isShow = false;
        },
        openPicker(e){
            this.isShow = true;
            this.calPosition(e);
        },
        calPosition(e){
            this.position = {'top':$(e.target).offset().top + 30 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
        },
       
        applyDateTime(){
            let dateTime = this.date + " " + this.time;
            this.$emit('apply-datetime',dateTime)
        },
        dateSelected(e){
            this.$emit('clickDateCell',e);
            
        }
    }
}

</script>
<style scoped>
    .date-picker{
        box-shadow: none;

    }
    .apply-time{
        float: right;
        margin: 0 16px 8px 0;
        border: none;
        padding: 4px 8px;
        background: white;
        font-size: 13px;
        font-weight: 500;
        border-radius: 3px;
        transition: 300ms ease-in-out;
    }
    .apply-time:hover{
        background: #fafafa;
    }
    .card-datetime-picker{
        position: absolute;
        z-index: 9999;
    }
    .heading{
        padding: 6px 12px;
    }
</style>
