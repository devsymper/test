<template>
    <v-card class="card-time-picker"
    
    :style="position"
    v-show="isShow" ref="symperDateTimePicker">
        <h4 class="heading">{{title}}</h4>
        <v-divider></v-divider>
        <sym-time-picker v-if="isTime" ref="timePicker"></sym-time-picker>
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
            if($(e.target).closest('.handsontable').length > 0){
                let autoEL = $(this.$el).detach();
                $(e.target).closest('.wrap-table').append(autoEL);
                let edtos = $(e.target).offset();
                let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + $(e.target).height() + 'px', 'left':edtos.left - tbcos.left + 'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.position = {'top':'20px', 'left':'0px'};
            }
            
        },
       
        applyTime(){
            this.$emit('apply-time-picker', this.$refs.timePicker.getTime(false));
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
        max-width: unset !important;
        min-width: 230px;
    }
    .heading{
        padding: 6px 12px;
    }
    .card-time-picker >>> .text-start {
        display: flex !important;
    }
</style>
