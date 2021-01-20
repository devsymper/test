<template>
    <div class="fs-13" >
        <div v-if="selectionType == 'single'">
            <div v-for="(item,idx) in data" 
                    :key="idx"  role="radio" >
                <label
                        role="radio"
                        aria-checked="true" tabindex="0" 
                        :class="'el-radio mb-2' + (item.symper__selected ? ' is-checked':'')">
                    <span  :class="'el-radio__input' + (item.symper__selected ? ' is-checked':'')">
                        <span class="el-radio__inner"  @click="changeSelectRadio(item,idx)"></span>
                    </span>
                    <span @click="changeSelectRadio(item,idx)" :style="cellView.displayOptions.itemStyle"  class="el-radio__label pl-2">{{item[selectedCol.as]}}</span>
                </label>
            </div>
    
        </div>
        <div v-else-if="selectionType == 'multiple'">
            <label :class="'mb-2 el-checkbox' + (selectAll ? ' is-checked':'')">
                <span :class="'el-checkbox__input' + (selectAll ? ' is-checked':'')">
                    <span @click="changeSelectItem()" class="el-checkbox__inner"></span>
                </span>
                <span @click="changeSelectItem()" class="el-checkbox__label">Select All
                </span>
            </label>
            <div v-for="(item,idx) in data" :key="idx">
                <label 
                    :class="'el-checkbox' + (item.symper__selected ? ' is-checked':'')">
                    <span   :class="'el-checkbox__input' + (item.symper__selected ? ' is-checked':'')">
                        <span @click="changeSelectItem(item)" class="el-checkbox__inner"></span>
                    </span>
                    <span @click="changeSelectItem(item)"  :style="cellView.displayOptions.itemStyle" class="el-checkbox__label pl-2">{{item[selectedCol.as]}}
                    </span>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    created(){
        console.log(this.data,this.selectionType,this.selectedCol,'xxxxxxxxxxx');  
    },
    methods:{
        
        setSelectConfigOnClick(isSelect,value,type){
            let cellView = this.cellView;
            if(type == 'all'){
                cellView.clickedAll = isSelect;
                cellView.selectedAll = isSelect;

                this.selectAll = isSelect;
            }else{
                if(isSelect){
                    cellView.selectedValues[value] = true;
                    delete cellView.disSelectedValues[value];
                }else{
                    cellView.disSelectedValues[value] = true;
                    delete cellView.selectedValues[value];
                }

                if(Object.keys(cellView.selectedValues).length == this.data.length){
                    cellView.selectedAll = true;
                }else{
                    cellView.selectedAll = false;
                }
                this.selectAll = cellView.selectedAll;
            }
        },
        changeSelectRadio(item,idx){
            if(this.selectingRadioBox >= 0){
                this.data[this.selectingRadioBox].symper__selected = false;
            }
            item.symper__selected = !item.symper__selected ;

            this.cellView.clickedAll = false;
            this.cellView.selectedAll = false;
            this.cellView.disSelectedValues = {};
            this.cellView.selectedValues = {};

            if(item.symper__selected){
                this.cellView.selectedValues[item[this.selectedCol.as]] = true;
            }

            this.selectingRadioBox = idx;
            this.$emit('change-filter-value',this.cellId);
        },
        changeSelectItem(item = false){
            let cellView = this.cellView;
            if(item){
                item.symper__selected = !item.symper__selected;
                this.setSelectConfigOnClick(item.symper__selected,item[this.selectedCol.as],'item');
            }else{
                this.selectAll = !this.selectAll;
                if(this.selectAll){
                    for(let item of this.data){
                        item.symper__selected = true;
                        cellView.selectedValues[item[this.selectedCol.as]] = true;
                    }
                    cellView.disSelectedValues = {};
                }else{
                    for(let item of this.data){
                        item.symper__selected = false;
                        cellView.disSelectedValues[item[this.selectedCol.as]] = true;
                    }
                    cellView.selectedValues = {};
                }
                this.setSelectConfigOnClick(this.selectAll,'','all');
            }
            this.$emit('change-filter-value',this.cellId);
        }
    },
    props:['data','selectionType','selectedCol','cellId','cellView'],
    data(){
        return {
            selectAll : false,
            selectingRadioBox : -1,
        }
    }
}
</script>