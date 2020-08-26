<template>
    <v-card :style="positionBox" v-show="isShowPopup" class="card-time-input">
        <div v-for="time in times" :key="time.time" class="time-item" @click="handleClickRow(time)" :class="{'active-item':time.active}">
            {{time.time}}
        </div>
    </v-card>
</template>

<script>
export default {
    data(){
        return {
            positionBox:{'top':0,'left':0},
            indexActive:-1,
            curInput:null,
            isShowPopup:false,
            times:null
        }
    },
    methods:{
        show(e){
            this.isShowPopup = true;
            this.curInput = $(e.target);
            this.calculatorPositionBox(e);
            this.setEventInput(e);
        },
        hide(){
            this.isShowPopup = false;
        },
        setEventInput(e){
            let thisCpn = this;
            this.curInput = $(e.target);
            this.curInput.off('keyup');
            this.curInput.on('keyup',function(event){
                event.controlName = e.controlName;
                thisCpn.handlerKeyDown(event);
            })
        },
        calculatorPositionBox(e){
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
                this.positionBox = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.positionBox = {'top':$(e.target).height()+2+'px','left':'0px'};
            }
        },
        handlerKeyDown(e){
            if(e.keyCode == 38){    //len
                if(this.indexActive == 0){
                    return false;
                }
                Vue.set(this.times[this.indexActive], 'active', false);
                this.indexActive--;
                Vue.set(this.times[this.indexActive], 'active', true);
                
            }   
            else if(e.keyCode == 40){
                if(this.indexActive == this.times.length - 1){
                    return false;
                }
                if(this.indexActive != -1){
                    Vue.set(this.times[this.indexActive], 'active', false);
                }
                this.indexActive++;
                Vue.set(this.times[this.indexActive], 'active', true);
            }
            else if(e.keyCode == 13){
                let rowActive = this.times[this.indexActive];
                this.handleClickRow(rowActive);
            }
            else{
                this.checkValidTime(e)
            }
            
        },
    
        handleClickRow(item){
            this.curInput.off('keyup');
            this.$emit('apply-time-selected',{input:this.curInput,value:item.time});
            if(this.indexActive != -1)
            this.times[this.indexActive].active = false;
            this.indexActive = this.times.indexOf(item);
            item.active = true;
            this.hide();
        },
        checkValidTime(e){
            let regex = /(1[012]|[1-9]):[0-5][0-9](\\s)?( |)(AM|PM)$/;
            let isValid = false;
            if(regex.test(this.curInput.val())){
                isValid = true;
            }
            this.$emit('after-check-input-time-valid',{input:this.curInput,controlName: e.controlName,isValid:isValid});      
        }
    },
    beforeMount(){
        this.times = [
            {"time":"12:00 AM","active":false},{"time":"12:30 AM","active":false},{"time":"1:00 AM","active":false},
            {"time":"1:30 AM","active":false},{"time":"2:00 AM","active":false},{"time":"2:30 AM","active":false},
            {"time":"3:00 AM","active":false},{"time":"3:30 AM","active":false},{"time":"4:00 AM","active":false},
            {"time":"4:30 AM","active":false},{"time":"5:00 AM","active":false},{"time":"5:30 AM","active":false},
            {"time":"6:00 AM","active":false},{"time":"6:30 AM","active":false},{"time":"7:00 AM","active":false},
            {"time":"7:30 AM","active":false},{"time":"8:00 AM","active":false},{"time":"8:30 AM","active":false},
            {"time":"9:00 AM","active":false},{"time":"9:30 AM","active":false},{"time":"10:00 AM","active":false},
            {"time":"10:30 AM","active":false},{"time":"11:00 AM","active":false},{"time":"11:30 AM","active":false},
            {"time":"12:00 PM","active":false},{"time":"12:30 PM","active":false},{"time":"1:00 PM","active":false},
            {"time":"1:30 PM","active":false},{"time":"2:00 PM","active":false},{"time":"2:30 PM","active":false},
            {"time":"3:00 PM","active":false},{"time":"3:30 PM","active":false},{"time":"4:00 PM","active":false},
            {"time":"4:30 PM","active":false},{"time":"5:00 PM","active":false},{"time":"5:30 PM","active":false},
            {"time":"6:00 PM","active":false},{"time":"6:30 PM","active":false},{"time":"7:00 PM","active":false},
            {"time":"7:30 PM","active":false},{"time":"8:00 PM","active":false},{"time":"8:30 PM","active":false},
            {"time":"9:00 PM","active":false},{"time":"9:30 PM","active":false},{"time":"10:00 PM","active":false},
            {"time":"10:30 PM","active":false},{"time":"11:00 PM","active":false},{"time":"11:30 PM","active":false}]
    },
}
</script>
<style scoped>
    .time-item{
        font-size: 13px;
        font-weight: 500;
        height: 25px;
        line-height: 25px;
        text-align: center;
        cursor: pointer;
        transition: background ease-in-out 150ms;
    }
    .time-item:hover{
        background: #f2f2f2;
    }
    .card-time-input{
        height: auto;
        max-height: 300px;
        overflow: auto;
        position: absolute;
        width: 120px;
        background: white;
        z-index: 99999;
    }
    .active-item{
        background: #dadada !important;
    }
</style>