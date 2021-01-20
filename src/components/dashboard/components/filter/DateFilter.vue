<template>
    <div class="fs-13 pt-1">
		<DateTimePicker 
		
		/>
    </div>
</template>
<script>
import DateTimePicker from '@/components/common/DateTimePicker'
export default {
	components:{
		DateTimePicker
	},
    computed:{
        dataValue(){
            if(this.data.value){
                return this.data;
            }else{
                let today = new Date().toISOString().slice(0, 10);
                return {
                    value : [today,today],
                    max : today,
                    min : today
                };
            }
        }
    },
    methods:{
        handleChangeValue(){
            this.$emit('change-filter-value',this.cellId);
        }
    },
    props:['data','selectionType','selectedCol','cellId','cellView'],
    data(){
        return {
            selectAll : false,
            selectingRadioBox : -1,
            pickerOptions: {
            shortcuts: [
                {
                text: 'Today',
                onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        picker.$emit('pick', [start, end]);
                    }
                },{
                text: 'Yesterday',
                onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                text: 'Last 7 days',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                text: 'Last 14 days',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 28 days',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 28);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 30 days',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    }
}
</script>
<style >
.symper-date-filter{
    width: 100%!important;
}
.symper-date-filter .el-range-separator{
    margin-right: 7px;
    position: relative;
    left: 7px;
}

.symper-date-filter .el-range-input:nth-child(4){
    position: relative;
    left: 20px;
}
</style>