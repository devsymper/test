<template>
    <div class="position-relative">
        <v-text-field
        solo
        flat
        hide-details
        label="yyyy/MM/dd"
        append-icon="mdi-format-color-highlight"
        v-model="dataPattern"
        @click:append="showFormatDateForm"
        @change="handleChangeInput"
        >
        </v-text-field>
        <div class="form-format-date" style="display:none;">
            <div class="form-header">
                <h4>Định dạng hiển thị</h4>
                <button v-on:click="hideForm"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="form-body">
                <v-text-field
                solo
                flat
                v-model="customFormat"
                hide-details
                clearable
                >
                </v-text-field>
                <button v-on:click="setFormat" class="apply-format">Apply</button>
            </div>
            <div>
                <span class="example">Ví dụ: {{new Date() | moment(customFormat)}}</span>
            </div>
            <div class="form-suggest">
                <div class="suggest-item" v-on:click="selectItem($event,pattern.type)" v-for="pattern in listFormatPattern" :key="pattern.type">
                    <span>{{pattern.title}}</span>
                    <span>{{ new Date() | moment(pattern.type) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
Vue.use(require('vue-moment'));
export default {
    props:{
        value:{
            type:String,
            default:''
        }
    },
    computed:{
        sCurrentControl(){
            return this.$store.state.document.editor.currentSelectedControl;
        },
    },
    methods:{
       
        showFormatDateForm(){
            $('.form-format-date').show()
        },
        hideForm(){
            $('.form-format-date').hide()
        },
        getDate(type){
            var today = new Date();
            today.toLocaleFormat(type); // 30-Dec-2011
        },
        setFormat(){
            this.hideForm();
            this.dataPattern = this.customFormat;
            this.$evtBus.$emit('blur-input',{name:'formatDate',value:this.customFormat});
        },
        selectItem(event,type){
            this.customFormat = type
            $('.suggest-item').removeClass('active');
            if($(event.target).is('.suggest-item')){
                $(event.target).addClass('active');
            }
            else{
                $(event.target).closest('.suggest-item').addClass('active');
            }
        },
        handleChangeInput(){
            this.$evtBus.$emit('blur-input',{name:'formatNumber',value:this.dataPattern});
        }
        
    },

    data(){
        return{
            listFormatPattern:[
                {title:"mm/dd/YYYY",type:"mm/dd/YYYY"},
                {title:"YYYY/mm/dd",type:"YYYY/mm/dd"},
                {title:"YYYY-mm-dd",type:"YYYY-mm-dd"},
                {title:"mm-dd-YYYY",type:"mm-dd-YYYY"},
                {title:"dd/mm/YYYY",type:"dd/mm/YYYY"},
                {title:"DD/MM/YYYY",type:"DD/MM/YYYY"},
            ],
            customFormat:'MM/DD/YYYY',
            dataPattern:this.value
        }
    },
    mounted(){
        
    }
    

}
</script>
<style scoped>
    .active{
        background: #c3c3c3;
    }
    .example{
        padding: 8px;
        font-size: 11px;
    }
    .form-format-date{
        position: absolute;
        right: 0px;
        height: auto;
        width: 215px;
        background: white;
        z-index: 9999999;
        box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
    }
    .position-relative{
        position: relative;
    }
    .form-header{
        height: 25px;
        display: flex;
        border-bottom: 1px solid #cdcdcd;
    }
    .form-header h4{
        padding: 2px 6px;
    }
    .form-header button{
        margin-left: auto;
        margin-right: 6px;
        font-size: 16px;
    }
    .form-body{
        display: flex;
        padding: 4px 8px;
    }
    .apply-format{
        margin-left: 8px;
        background: green;
        color: white;
        font-size: 12px;
        font-weight: 500;
        border-radius: 3px;
        padding: 2px 6px;
    }
    .suggest-item{
        height: 25px;
        display: flex;
        font-size: 11px;
        padding: 6px 8px;
        cursor: pointer;
    }
    .suggest-item:hover{
        background: #f2f2f2;
    }
    
    .suggest-item span:last-child{
        margin-left: auto;
    }
</style>