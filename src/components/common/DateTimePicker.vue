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
                        top:'26px',
                        left:'0px'
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
            this.calculatorPositionBox(e)
            // this.position = {'top':$(e.target).offset().top + 30 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
        },
       
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if($(e.target).closest('.handsontable').length > 0 ){
                let autoEL = $(this.$el).detach();
                $(e.target).closest('.wrap-table').append(autoEL);
                let edtos = $(e.target).offset();
                if(!$(e.target).is('.handsontableInput')){
                    edtos = $(e.target).closest('td.htAutocomplete.current.highlight').offset();
                }
                if($(e.target).is('div.htAutocompleteArrow')){
                    edtos = $(e.target).parent().offset();;
                }
                
                let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.position = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.positionBox = {'top':'26px','left':'0px'};
            }
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
        max-width: unset !important;
    }
    .heading{
        padding: 6px 12px;
    }
</style>
