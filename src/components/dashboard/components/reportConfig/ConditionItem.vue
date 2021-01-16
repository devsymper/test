<template>
	<div class="condition-item fs-13">
		<v-expansion-panel>
			<v-expansion-panel-header>
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<div
							class="title-condition fs-13"
							v-bind="attrs"
							v-on="on"
							small 
							>
							<span>
								{{condColumn.as}}
							</span>
						</div>
					</template>
					<span> {{condColumn.as}} </span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<div
							class="value-condition fs-13"
							v-bind="attrs"
							v-on="on"
							small 
							>
							<span style="color:blue" class="fs-13"> {{getSignName(condColumn)}}</span>

						</div>
					</template>
					<span> {{getSignName(condColumn)}}</span>
				</v-tooltip>
				<v-icon
					small
					@click="removeCondition"
					color="red"
					class="icon-remove-condition"
				>mdi-close</v-icon>
				<!-- <i class="el-icon-close remove-cond" @click="removeCondition()"></i> -->
			</v-expansion-panel-header>
			<v-expansion-panel-content class="sym-v-expand-content">
				<div class="conds-column-editor pl-3 pr-3 pt-2">
					<span>
						Value with condition
					</span>
					<v-select 
						@change="handleChangeValue" 
						class="w-100 pt-2" 
						v-model="condColumn.cond.type"
						:items="Object.keys(condTypes[condColumn.type])" 
						solo
						filterable 
					>
					</v-select>
					<v-input 
						@change="handleChangeValue" 
						v-if="condColumn.type == 'number'" 
						class="mt-2"
						small 
						placeholder="text here" 
						v-model="condColumn.cond.val">
					</v-input>
					<v-input 
						@change="handleChangeValue" 
						v-else 
						:class="'mt-2 '+checkValueValidate(condColumn)" 
						placeholder="text here" 
						v-model="condColumn.cond.val">
					</v-input>
					<span 
						v-if="condColumn.validValue === false" 
						class="danger-text">{{condColumn.errMsg}} expected
					</span>
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</div>
</template>

<script>
import conditionType from '@/components/dashboard/configPool/conditionType.js';
let cpnCondType = conditionType;
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

<style scoped>
.condition-item >>> .v-expansion-panel,
.condition-item >>> .v-expansion-panel::before{
	box-shadow: unset !important;
}
.condition-item >>> .v-expansion-panel-header{
	background-color: #EBEEF5 !important;
	min-height: unset !important;
	padding: 8px 12px;
}

.condition-item >>> .title-condition{
	white-space: nowrap; 
	width: 70px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.condition-item >>> .icon-remove-condition{
	opacity: 0;
	margin-left: -16px;
	margin-right: -12px;
}
.condition-item >>> .v-expansion-panel-header:hover .icon-remove-condition{
	opacity: 1;
}
.condition-item >>> .value-condition{
	white-space: nowrap; 
	width: 50px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.condition-item >>> .v-expansion-panel-content__wrap{
	padding: unset;
}
.condition-item >>> .v-text-field__details{
	display: none;
}
.condition-item >>> .v-input__slot{
	box-shadow: unset;
	border: 1px solid lightgray;
	border-radius: 4px;
	min-height: unset;
}
</style>
<style >

</style>