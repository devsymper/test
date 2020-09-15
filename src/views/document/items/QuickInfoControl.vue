<template>
    <v-card 
    
    class="card-quick-info-control"
    v-show="isShow"
    :style="positionBox">
        <p class="headline">{{$t('document.editor.dialog.quickInfoControl.heading')}}</p>
        <v-divider></v-divider>
        <v-card-text style="height: calc(100% - 84px);    overflow: auto;">
            <div class="form-add-control-info">
                <FormTpl 
                    :singleLine="true" 
                    :labelWidth="`80px`" 
                    @input-value-keyup="handleKeyupInput"
                        :allInputs="allInputs"/>
            </div>
        </v-card-text>
            <v-divider></v-divider>

        <v-card-actions class="action">
        <v-spacer></v-spacer>
        
        <v-btn
            color="green darken-1"
            text
            right
            @click="isShow = !isShow"
        >
            {{$t('common.close')}}
        </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue";
import {checkInTable} from "./../common/common";
import { util } from '../../../plugins/util';

export default {
    props:{
        keyInstance:{
            type:Number,
            default:0
        },
    },
    components:{
        FormTpl
    },
    data(){
        return {
            isShow:false,
            positionBox:null,
            listNameValueControl:{},
            delayTimer:null,
            allInputs:{name : {
                    title: "Tên ",
                    type: "text",
                    value: "",
                },
                title : {
                    title: "Tiêu đề",
                    type: "text",
                    value: "",
                },}
        }
    },
    computed: {
        sCurrentDocument(){
            return this.$store.state.document.editor[this.keyInstance].currentSelectedControl;
        }
    },
 
    created(){
        
        
    },
    beforeMount(){
        this.positionBox = {'top':0,'left':0};
    },
    methods:{
        
        show(e){
            this.isShow = true;
            this.calculatorPositionBox(e);
        },
        hide(){
            this.isShow = false;
        },

        calculatorPositionBox(e){
            this.positionBox.top = e.clientY + 'px';
            this.positionBox.left = e.clientX + 'px';
        },
         handleKeyupInput(name, input, data){
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(function(self) {
                self.handleValidateControl(name, input, data)
            }, 100,this);
            if(data.key == 'Tab'){
                this.handleValidateControl(name, input, data)
            }
        },
        handleValidateControl(name, input, data){
            let value = input.value
            let elements = $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            let tableId = checkInTable(elements);
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:value,tableId:tableId,type:"value",instance:this.keyInstance}
            );   
            if(name == 'name' || name == 'title'){
                let currentInput = this.sCurrentDocument.properties.name;
                this.checkNameControl('name', currentInput.name);
                this.checkTitleControl('title', currentInput.title);
            }
        },
        /**
         * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
         */
        checkTitleControl(name, input){
            let elements = $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            elements.removeClass('s-control-error');
            if(elements.is('.page-item')){
                elements.find('.page-item__name').text(input.value);
            }
            if(elements.is('[s-control-type="tab"]')){
                elements.text(input.value);
            }
            let tableId = checkInTable(elements)
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            let errValue = ""
            if(input.value == "" && input.value.length == 0){
                errValue = "Không được bỏ trống tiêu đề control"
                elements.addClass('s-control-error');
            }
            this.$store.commit(
                    "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:errValue,tableId:tableId,type:"errorMessage",instance:this.keyInstance}
                );
            this.$store.commit(
                "document/updateCurrentControlProps",{instance:this.keyInstance,group:'name',prop:'title',typeProp:'errorMessage',value:errValue}
            );   
        },

        /**
         * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
         */
        checkNameControl(name, input){
            let elements = $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            let tableId = checkInTable(elements)
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            let errValue = ''
            let listValue = Object.values(this.listNameValueControl);
            let dataControl = {value: input.value, match:false,id:this.sCurrentDocument.id};
            if(input.value == "" && input.value.length == 0){
                errValue = "Không được bỏ trống tên control"
                elements.addClass('s-control-error');
            }
            else{
                 if(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(input.value) == false){
                        errValue = "Tên không hợp lệ";
                        elements.addClass('s-control-error');
                    }
                    else{
                        elements.removeClass('s-control-error');
                        let controlConflic = listValue.filter(c=>{
                            return c.value == input.value
                        });
                        if(controlConflic.length > 0){
                            let listContrlIdConflic = controlConflic.reduce((arr,obj)=>[
                                ...arr,obj.id
                            ],[]);
                            dataControl.match = listContrlIdConflic;
                            elements.addClass('s-control-error');
                            for (let index = 0; index < controlConflic.length; index++) {
                                let control = controlConflic[index];
                                // console.log('sa',this.listNameValueControl[control.id]);
                                let newList = util.cloneDeep(listContrlIdConflic);
                                newList.splice(newList.indexOf(control.id),1);
                                newList.push(this.sCurrentDocument.id);
                                this.listNameValueControl[control.id].match = newList;
                                $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+control.id).addClass('s-control-error');
                            }
                            if(this.listNameValueControl.hasOwnProperty(this.sCurrentDocument.id)){
                                for (let index = 0; index < this.listNameValueControl[this.sCurrentDocument.id].length; index++) {
                                    const element = this.listNameValueControl[this.sCurrentDocument.id][index];
                                    $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+element.id).removeClass('s-control-error')
                                }
                            }
                        }
                        else{
                            if(this.listNameValueControl.hasOwnProperty(this.sCurrentDocument.id)){
                                let controlOldConflic = this.listNameValueControl[this.sCurrentDocument.id].match;
                                for (let index = 0; index < controlOldConflic.length; index++) {
                                    let control = controlOldConflic[index];
                                    this.listNameValueControl[control].match.splice(this.listNameValueControl[control].match.indexOf(this.sCurrentDocument.id),1);
                                    if(this.listNameValueControl[control].match.length == 0)
                                    $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+control).removeClass('s-control-error')
                                }
                            }
                            $('#document-editor-'+this.keyInstance+'_ifr').contents().find('#'+this.sCurrentDocument.id).removeClass('s-control-error')
                        }
                    }
                
            }
            this.listNameValueControl[this.sCurrentDocument.id] = dataControl;
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:errValue,tableId:tableId,type:"errorMessage",instance:this.keyInstance}
            );  
            this.$store.commit(
                "document/updateCurrentControlProps",{instance:this.keyInstance,group:'name',prop:'name',typeProp:'errorMessage',value:errValue}
            );   
        },
    }
}
</script>

<style scoped> 
    .card-quick-info-control{
        position: absolute;
        z-index: 99999;
        max-width: unset !important;
        max-height: 500px;
        overflow: hidden;
    }
    .action{
        height: 35px !important;
    }
    .action >>> button{
        font-size: 13px;
        height: 25px !important;
    }
    .headline{
        font-size: 14px !important;
        margin: 0;
        font-weight: 500;
        padding: 0 8px;
    }
</style>