<template>
    <v-card class="card-time-picker"
    
    :style="position"
    v-show="isShow" ref="symperDateTimePicker">
        <h4 class="heading">{{title}}</h4>
        <v-divider></v-divider>
        <sym-time-picker v-if="isTime"></sym-time-picker>
        <button v-if="isTime" v-on:click="applyTime" class="apply-time">
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
            default:"Chọn giờ"
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
    data(){
        return {
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
        hide() {
            this.isShow = false;
        },
        show(e){
            this.isShow = true;
            this.calPosition(e);
        },
        calPosition(e){
            this.position = {'top':$(e.target).offset().top + 30 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
        },
       
        applyTime(){
            this.$emit('document-submit-apply-time-picker',this.time);
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
    .card-time-picker{
        position: absolute;
        z-index: 9999;
    }
    .heading{
        padding: 6px 12px;
    }
</style>
