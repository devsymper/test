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
            indexActive:0,
            curInput:null,
            isShowPopup:false,
            times:null,
            controlName:""
        }
    },
    methods:{
        show(e){
            this.isShowPopup = true;
            this.curInput = $(e.curTarget);
            this.calculatorPositionBox();
            this.setEventInput(e);
        },
        hide(){
            if(this.isShowPopup){
                this.isShowPopup = false;
                this.curInput.removeAttr('contenteditable');
            }
            
        },
        setEventInput(e){
            let thisCpn = this;
            this.controlName = e.controlName
            this.curInput.off('keydown');
            this.curInput.on('keydown',function(event){
                event.controlName = e.controlName;
                thisCpn.handlerKeyUp(event);
            })
        },
        // tính toán vị trí của box timepicker 
        calculatorPositionBox(){
            if(this.curInput.closest('.ag-cell').length > 0 ){
                let autoEL = $(this.$el).detach();
                this.curInput.closest('.wrap-table').append(autoEL);
                let edtos = this.curInput.closest('.ag-cell').offset();
                let tbcos = this.curInput.closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + this.curInput.height() + 2 +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                this.curInput.parent().append(autoEL);
                this.positionBox = {'top':this.curInput.height()+2+'px','left':'0px'};
            }
        },
        handlerKeyUp(e){
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
        },
    
        handleClickRow(item){
            this.curInput.off('keydown');
            this.$emit('apply-time-selected',{controlName:this.controlName,value:item.time});
            if(this.indexActive != -1)
            this.times[this.indexActive].active = false;
            this.indexActive = this.times.indexOf(item);
            item.active = true;
            this.hide();
        },
        
    },
    beforeMount(){
        this.times = [
            {"time":"0:00 AM","active":true},{"time":"0:30 AM","active":false},{"time":"1:00 AM","active":false},
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