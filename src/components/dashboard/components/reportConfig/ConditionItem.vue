<template>
    <el-collapse class="columns-condition">
        <el-collapse-item name="1">
            <template slot="title">
                <div class="cond-column w-100 pl-3">
                    <span class="cond-column-name" > {{condColumn.as}} </span>
                    <span class="cond-column-where"> {{getSignName(condColumn)}}</span>
                    <i class="el-icon-close remove-cond" @click="removeCondition()"></i>
                </div>
            </template>
            <div class="conds-column-editor pl-3 pr-3 pt-2">
                <span>
                    Value with condition
                </span>
                <el-select @change="handleChangeValue" class="w-100 pt-2" v-model="condColumn.cond.type" filterable placeholder="Select Type" size="mini">
                    <el-option v-for="(type,name) in condTypes[condColumn.type]" :key="name" :label="type.label" :value="type.value"></el-option>
                </el-select>

                <el-input @change="handleChangeValue" v-if="condColumn.type == 'number'" type="number" class="mt-2" size="mini" placeholder="text here" v-model="condColumn.cond.val"></el-input>
                <el-input @change="handleChangeValue" v-else type="text" :class="'mt-2 '+checkValueValidate(condColumn)" size="mini" placeholder="text here" v-model="condColumn.cond.val"></el-input>
                <span v-if="condColumn.validValue === false" class="danger-text">{{condColumn.errMsg}} expected</span>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
// import conditionType from './../configPool/conditionType.js';
// let cpnCondType = conditionType;
let checkPattern = {
				date:{
					regex:/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
					requirePatt:'YYYY-MM-DD'
				},
				datetime:{
					regex:/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])(:([0-9]|[0-5][0-9]))?$/,
					requirePatt:'YYYY-MM-DD HH-MM-ss'
				},
				time:{
					regex:/(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])(:([0-9]|[0-5][0-9]))?$/,
					requirePatt:'HH-MM-ss'
				},
				
			};
export default {
    data(){
        return {
			condTypes:cpnCondType,
        }
    },
    props: {
        condColumn: {
            default(){
                return {

                }
            }
        },
        idx: {
            default: 0
        }
    },
    methods: {
        handleChangeValue(){
            this.$emit('change-value', this.condColumn);
        },
		getSignName(condColumn){
			let condType = this.condTypes[condColumn.type][condColumn.cond.type];
			if(condColumn.cond.type.includes('blank')){
				return condType.label;
			}else if(condColumn.cond.val == ''){
				return 'Is All';
			}
			return (condType.sign?condType.sign:condType.label)+' '+condColumn.cond.val;
        },
        removeCondition(){
            this.$emit('remove', this.idx);
        },
        
		checkValueValidate(condColumn){
			if(condColumn.type == 'text' || condColumn.cond.type == 'isall' || condColumn.cond.type == 'isblank'|| condColumn.cond.type == "notblank"){
				this.$set(condColumn,'validValue',true);
				return '';
			}
			let patt = checkPattern[condColumn.type].regex;
			let val = condColumn.cond.val.trim().split(',');
			for(let v of val){
				if(!patt.test(v)){
					this.$set(condColumn,'validValue',false);
					this.$set(condColumn,'errMsg',checkPattern[condColumn.type].requirePatt);
					return 'type-validate-err';
				}
			}
			this.$set(condColumn,'validValue',true);
			return '';
		},
    }
}
</script>

<style>
	.columns-condition .el-collapse-item__header {
    	height: unset;
		line-height: unset;
		min-height: 35px;
		background-color: #EBEEF5!important;
		padding: 8px 0px;
	}
	.cond-column-where{
		color: #369cff;
	}
	.columns-condition>.el-collapse{
		border: none;
	}

	.columns-condition .el-collapse-item__content{
		padding-bottom: 15px
	}

	.type-validate-err .el-input__inner{
		border: 1px #f64d38 solid;
    	background-color: #ff674c26;
	}

	span.danger-text {
		color: #f64d38;
		font-size: 0.9rem;
		display: inherit;
		line-height: normal;
		margin-top: 5px;
	}

	.cond-column .remove-cond{
		font-size: 14px;
		right: 25px;
		position: absolute;
		visibility: hidden;
	}
	.cond-column:hover .remove-cond{
		visibility: visible;
		color: #f64d38;
	}
</style>