<template>
	<div class="d-flex flex-column summalize-config  fs-13">
		<v-text-field solo v-model="searchColumns">
			>
		</v-text-field>
		<div class="list-all-columns">
			<div class="title fs-15 d-flex align-center ">
				<span>
					Columns
				</span>
			</div>
			<div class="drag-columns" style="height:150px;overflow:auto">
				<draggable :clone="cloneColumn" :list="allColumns" :group="{ name: 'drop-column', pull: 'clone', put: false }" class="drag-columns-area">
					<div
						v-for="column in allColumns"
						:key="column.columnName"
						:style="{
							display: checkMatch(column) ? 'flex' : 'none',
						}"
					>
						<i :class="getColumnIcon(column.type) + ' mt-2'"></i>
						<span class="column-title text-ellipsis mr-2">{{ column.title }}</span> ( <span class="colmn-name text-ellipsis">{{ column.columnName }}</span
						>)
					</div>
				</draggable>
			</div>
		</div>
		<div class="list-groupby-column" style="height:30%">
			<div class="title fs-15 d-flex align-center ">
				<span>
					Aggreate
				</span>
			</div>

			<div class="drag-columns">
				<draggable @change="handleChangeColumn" :list="aggColumns" :group="{ name: 'drop-column' }" class="drag-columns-area">
					<div
						:ref="'left_comp'"
						v-for="(column, idx) in aggColumns"
						:key="idx"
						:style="{
							display: checkMatch(column) ? 'flex' : 'none',
						}"
					>	
						
						<v-menu
							open-on-hover
							top
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								
								<span 
									:style="{ width: column.inputWidth }" v-bind="attrs"
									v-on="on" class="column-as text-ellipsis" 
									@dblclick="editColumnAs(idx)" 
									v-show="!column.edit"
								>
									{{ column.as }}
								</span>
							</template>
							<v-list 
							>
								<v-list-item
									v-for="(agg,name) in aggTpl[column.type]" 
									:key="name"
									class="list-item-on-menu"
									@click="changeAggFunc({column:column,aggName:name,idx:idx})"
								>	
									<v-list-item-title>
										{{agg.name}}
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
						<input
							@change="changeConfig('rename')"
							@blur="finishEditColumnAs"
							v-show="column.edit"
							:style="{ width: column.inputWidth }"
							size="nano"
							v-model="column.as"
							class="d-inline-block input-edit-as"
						/>
						<v-icon small @click="removeColumn(idx, 'aggColumns')" style="position: absolute; right: 3px"> mdi-close</v-icon>
					</div>
					<div class="placeholder-div-condition mt-1 mb-2 d-flex justify-content-center  ">
						<span class="add-field-here-title">
							Add field here
						</span>
					</div>
				</draggable>
			</div>
		</div>
		<div class="list-agg-column" style="height:20%">
			<div class="title fs-15 d-flex align-center ">
				<span>
					Group by
				</span>
			</div>
			<draggable @change="handleChangeColumn" :list="groupBy" :group="{ name: 'drop-column' }" class="drag-columns-area">
				<div
					v-for="(column, idx) in groupBy"
					:key="idx"
					:style="{
						display: checkMatch(column) ? 'block' : 'none',
					}"
				>
					<i :class="getColumnIcon(column.type)"></i>
					<span class="column-title">{{ column.title }}</span> ( <span class="colmn-name">{{ column.columnName }}</span
					>)
					<i class="el-icon-close p-2 remove-column" @click="removeColumn(idx, 'groupBy')"></i>
				</div>
				<div class="placeholder-div-condition mt- 1 mb-2 d-flex justify-content-center ">
					<span class="add-field-here-title">
						Add field here
					</span>
				</div>
			</draggable>
		</div>
	</div>
</template>

<script>
import aggTpl from '@/components/dashboard/configPool/aggTpl';
export default {
	data() {
		let newAggTpl = _.cloneDeep(aggTpl);
        for(let key in newAggTpl){
            delete newAggTpl[key].not_agg ;
        }
        return {
            searchColumns:'',
            aggTpl:newAggTpl
        }
	},
	props: {
		allColumns: {
			default() {
				return [
					{
						uid: 'stmp_1607880685991_day_chuyen__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'day_chuyen__1',
						type: 'text',
						symperDocId: 'stmp_1607880685991',
						title: 'Dây chuyền (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_ngay_chung_tu__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'ngay_chung_tu__1',
						type: 'date',
						symperDocId: 'stmp_1607880685991',
						title: 'Ngày chứng từ (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_ca_lam__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'ca_lam__1',
						type: 'text',
						symperDocId: 'stmp_1607880685991',
						title: 'Ca làm (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_pp_moc__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'pp_moc__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'PP mộc (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_so_luong_ep__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'so_luong_ep__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Số lượng ép (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_bot_su_dung__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'bot_su_dung__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Bột sử dụng (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_pp_bot__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'pp_bot__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'PP bột (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_ma_san_pham__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'ma_san_pham__1',
						type: 'text',
						symperDocId: 'stmp_1607880685991',
						title: 'Mã sản phẩm (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_so_luong_giao__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'so_luong_giao__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Số lượng giao (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_bot_su_dung__1__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'bot_su_dung__1__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Bột sử dụng (# 1)  (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_chi_so_gas_tao_hinh__1__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'chi_so_gas_tao_hinh__1__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Chỉ số gas tạo hình (# 1)  (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_gas_th__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'gas_th__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'GAS TH (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
					{
						uid: 'stmp_1607880685991_gas_th_kg__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'gas_th_kg__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'GAS TH KG (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
					},
				];
			},
		},
		groupBy: {
			default() {
				return [
					{
						uid: 'stmp_1607880685991_day_chuyen__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'day_chuyen__1',
						type: 'text',
						symperDocId: 'stmp_1607880685991',
						title: 'Dây chuyền (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' first Dây chuyền (# 1) ',
					},
					{
						uid: 'stmp_1607880685991_ngay_chung_tu__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'ngay_chung_tu__1',
						type: 'date',
						symperDocId: 'stmp_1607880685991',
						title: 'Ngày chứng từ (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' first Ngày chứng từ (# 1) ',
					},
					{
						uid: 'stmp_1607880685991_ma_san_pham__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'ma_san_pham__1',
						type: 'text',
						symperDocId: 'stmp_1607880685991',
						title: 'Mã sản phẩm (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' first Mã sản phẩm (# 1) ',
					},
				];
			},
		},
		aggColumns: {
			default() {
				return [
					{
						uid: 'stmp_1607880685991_so_luong_giao__1',
						idDataset: 'stmp_1607880685991',
						columnName: 'so_luong_giao__1',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'Số lượng giao (# 1) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' sum Số lượng giao (# 1) ',
						agg: 'sum',
					},
					{
						uid: 'stmp_1607880685991_gas_th__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'gas_th__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'GAS TH (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' sum GAS TH (# 2) ',
						agg: 'sum',
					},
					{
						uid: 'stmp_1607880685991_gas_th_kg__2',
						idDataset: 'stmp_1607880685991',
						columnName: 'gas_th_kg__2',
						type: 'number',
						symperDocId: 'stmp_1607880685991',
						title: 'GAS TH KG (# 2) ',
						from: '2681c71e-4d36-4989-88c5-d9e74678d47d',
						as: ' sum GAS TH KG (# 2) ',
						agg: 'sum',
					},
				];
			},
		},
	},
	methods:{
		handleChangeColumn(){
            this.changeConfig('update-column');
		},
		removeColumn(idx,type){
            this[type].splice(idx,1);
            this.changeConfig('update-column');
		},
		finishEditColumnAs(vl,event){
            for(let cl of this.aggColumns){
                cl.edit = false;
            }
        },
		changeAggFunc(command){
            let column = command.column;
            column.agg = command.aggName;
            column.as = ' '+command.aggName+' '+(column.title?column.title:column.columnName);
            column.newDataType = this.getDatatype(column);
            this.changeConfig('agg-func');
		},
		changeConfig(source){
            if(this.debounceEmitChangeConfig){
                clearTimeout(this.debounceEmitChangeConfig);
            }
            this.debounceEmitChangeConfig = setTimeout((thisObj) => {
                thisObj.$emit('change-configs',{source:source});
            }, 100,this);
        },
		editColumnAs(idx){
            let column = this.aggColumns[idx];
            let pr = $(this.$refs.left_comp[idx]);
            let w = pr.width() - pr.find('.left-items-in-agg').width() - pr.find('.remove-column').width() - 15;
            
            this.$set(column, 'inputWidth', w+'px');
            this.$set(column, 'edit', true);
            // column.inputWidth = w+'px';
            // column.edit = true;
            pr.find('.input-edit-as input').focus().select();
            setTimeout((pr) => {
                console.log(pr.find('.input-edit-as input'));
                pr.find('.input-edit-as input').focus();
            }, 100,pr);            
        },
		checkMatch(column){
            let searchKey = this.searchColumns.trim().toLowerCase();
            if(!searchKey){
                return true;
            }else {
                return column.columnName.toLowerCase().includes(searchKey) || column.title.toLowerCase().includes(searchKey)
            }
		},
		getColumnIcon(type){
			return ""
		},
		cloneColumn(item){
            let agg = item.type == 'number'?'sum':'first';
            let newItem = _.cloneDeep(item);
            newItem.as = ' '+agg+' '+(item.title?item.title:item.columnName);
            newItem.agg = agg;
            newItem.inputWidth = '80px';
            newItem.edit = false;
            newItem.newDataType = this.getDatatype(newItem);

            return newItem;
		},
		getDatatype(col){
            let uid = col.uid;
            let mapType = {
                count:'number',
                count_dist:'number',
            };


            let type = col.type;
            if(mapType[col.agg]){
                return mapType[col.agg];
            }else{
                return type;
            }
        },
	}
};
</script>

<style scoped>
.summalize-config >>> .v-text-field__details{
	display: none !important;
}
.summalize-config >>> .v-input__control{
	min-height: unset !important;
}
.summalize-config >>> .v-input__slot{
	box-shadow: unset !important;
	background-color: #FBFBFB !important;
	border: 1px solid lightgray;
}
.title {
    font-size: 13px !important;
    padding: 6px;
    background-color: #EBEEF5!important;
    margin: 8px 0px;
    width: 100% !important;
	height: 30px !important;
}
.placeholder-div-condition{
	background-color: #f7f7f7;
	border: 1px solid lightgray;
}
.add-field-here-title{
	margin-left: auto;
	margin-right: auto;
	opacity: 0.6;
}
.column-as{
    color: rgb(66, 66, 255); 
    padding: 0px 3px;
}
</style>
<style>
.list-item-on-menu{
	min-height: unset !important;
	padding: 8px 12px !important;
	margin: -6px 2px;
}
.list-item-on-menu .v-list-item__title{
	font-size: 13px !important;
}
</style>