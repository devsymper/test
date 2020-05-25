<template>
    <v-card class="card-datetime-picker"
    
    :style="position"
    v-show="isShow" ref="symperDateTimePicker">
        <h4 class="heading">Chọn ngày giờ</h4>
        <v-divider></v-divider>
        <v-date-picker class="date-picker" v-model="date" no-title></v-date-picker>
       
        <sym-time-picker></sym-time-picker>
        <button v-on:click="applyDateTime" class="apply-time">
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
        position:{
            type:Object,
            default(){
                return {
                    top:0,
                    left:'35px'
                }
            }
        }
        
    },
    created() {
        let thisCpn = this;
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (!$(evt.target).hasClass("input-item-func") && 

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
        }
    },
  
    methods:{
        closePicker() {
            this.isShow = false;
        },
        openPicker(){
            this.isShow = true;
        },
       
        applyDateTime(){
            let dateTime = this.date + " " + this.time;
            this.$emit('apply-datetime',dateTime)
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
