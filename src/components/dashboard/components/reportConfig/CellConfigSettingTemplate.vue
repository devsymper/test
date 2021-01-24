<template>
    <div class="setting-item">
        <span class="title">{{settingItem.name}}</span>
        <div class="setting-sub-items"> 
            <draggable
                group="drop-column"
                :list="settingItem.selectedColums"
                @change="handleChangeColumn"
                class="dragArea list-group">
                <div 
					class="draggable-setting-item d-flex"  
					v-for="(subItem,idx) in settingItem.selectedColums" 
					:key="idx"
				>
                    <div 
						:class="getClassForSelectedColumn(settingItem)" 
						:style="{width: showSelectAxisType(settingItem) ? '85% ': '100%'}"
						:ref="'wrap'+subItem.name"
					>
                        <span class="column d-flex flex-grow-1" style="width: calc(100% - 35px)">
							<v-menu
								open-on-hover
								v-if="checkColumnExist(subItem) && settingItem.hasAgg"  
								top
								offset-y
							>
								<template v-slot:activator="{ on, attrs }">
									 <span 
										:title="settingTplAgg[subItem.type][subItem.agg].name" 
										:ref="'agg'+subItem.name" 
										v-if="settingItem.hasAgg" 
										class="agg-func-name"
										v-bind="attrs"
										v-on="on"
									>
										{{subItem.agg}}
									</span>
								</template>
								<v-list 
								>
									<v-list-item
										v-for="(action,actName) in settingTplAgg[subItem.type]" 
										:key="actName"
										class="list-item-on-menu"
										@click="handleAction({subItem:subItem,agg:actName})"
									>	
										<v-list-item-title>
											{{action.name}}
										</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
                           <v-tooltip 
						   		bottom
							>
								<template v-slot:activator="{ on, attrs }">
									 <span 
										:title="subItem.name + ' - ' + subItem.as" 
										class="column-item-label" 
										:ref="'cln-label'+subItem.name" 
										v-show="!subItem.edit"
										v-bind="attrs"
										@dblclick="handleAction({subItem:subItem,agg:'rename'})"
										v-on="on"
									>
										{{subItem.as}}
									</span>
								</template>
								<span> {{$t('common.dblclick')}}</span>
							</v-tooltip>
                            <input  
                                class="rename-column-editor w-100" 
                                :ref="'edt'+subItem.name" 
                                @keyup.tab="renameColumn(subItem)" 
                                @keyup.enter="renameColumn(subItem)" 
                                @blur="renameColumn(subItem)" 
                                v-model="subItem.as" 
                                type="text" 
                                v-show="subItem.edit"
							>
                        </span>
						<v-icon
							@click="removeColumn(idx)"
							style="margin-right: 4px"
							class="icon-remove"
							small
						>
							mdi-close
						</v-icon>
                    </div>
						<v-menu
							open-on-hover
							v-if="showSelectAxisType(settingItem)"
							bottom
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-icon  
									v-bind="attrs"
									class="icon-show-sery-type ml-2"
									small
									v-on="on"
								>{{getClassForSeryType(subItem)}}</v-icon>
							</template>
							<v-list 
								
							>
								<v-list-item
									v-for="(item, i ) in seryTypes"
									:key="i"
									class="list-item-on-menu"
									@click="handleChangeSeryType({subItem:subItem , type: i})"
								>	
									<v-list-item-title>
										<v-icon small>
											{{item.icon}}
										</v-icon>
										{{item.title}}
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</div>
            </draggable>
			<div style="opacity: 0.5" class="fs-13 ml-2">
				{{$t('common.inputAddPlaceholder')}}
			</div>
        </div>
    </div>
</template>
<script>
    let seryTypeIcons = {
        line:'mdi-chart-line',
        area:'mdi-chart-scatter-plot',
        column:'mdi-chart-box-outline',
        bar:'mdi-chart-timeline',
    };
    export default {
        props: {
            'settingItem': {
                default(){
                    return {}
                }
            },
            'settingTplAgg': {
                default(){
                    return {}
                }
            },
            instanceKey: {
                default: '',
            },
        },
        data(){
            return {
				seryTypes:{
					line:{
						title: "Line",
						icon: 'mdi-chart-line'
					},
					area:{
						title: "Area",
						icon: 'mdi-chart-scatter-plot'
					},
					column:{
						title: "Column",
						icon: 'mdi-chart-box-outline'
					},
					bar:{
						title: "Bar",
						icon: 'mdi-chart-timeline'
					},
				},
                aggForLastLine: [
                    {
                        value: 'sum',
                        label: 'Sum'
                    },
                    {
                        value: 'none',
                        label: 'None'
                    },
                    {
                        value: 'avg',
                        label: 'Average'
                    },
                    {
                        value: 'min',
                        label: 'Min'
                    },
                    {
                        value: 'max',
                        label: 'Max'
                    },
                    {
                        value: 'max',
                        label: 'Max'
                    }
                ],
                columnLabelWidth:{
                }
            }
        },
        watch:{
        },
        computed:{
            selectedCell(){
                return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs;
            }
        },
        methods:{
            changeColumnSetting(type = 'data'){
                this.$evtBus.$emit('bi-report-change-display', {
                    type: type,
                    id: this.selectedCell.sharedConfigs.cellId
                });
            },
            changeLastLineColumnAgg(item){
                let agg = item.agg;
                let column = item.column;
                this.$set(column, 'lastLineAgg', agg.value);
                this.changeColumnSetting('style');
            },
            checkColumnExist(column){
				return true
                // return SDashboardEditor.checkColumnInSelectedDataset(column);
            },
            showAddYAxis(){
                let last = this.settingItem.lastYaxis;
                let rsl = last && (('Y Axis '+last) == this.settingItem.name);
                if(rsl){
                    this.lastYaxisNo = last;
                }
                return rsl;
            },
            getClassForSeryType(column){
                let iconType = seryTypeIcons['line'];
                if(column.seryType){
                    iconType = seryTypeIcons[column.seryType];
                }
                return iconType;
            },
            handleChangeSeryType(command){
                this.$set(command.subItem,'seryType',command.type);
                this.changeColumnSetting('style');
            },
            handleAction(command){
                let name = command.subItem.name;
                let refs = this.$refs;
                if(command.agg == 'rename'){
                    command.subItem.edit = true;
                    this.onEditColumn = command.subItem;                    
                    setTimeout(function(refs,name){
                        refs['edt'+name][0].focus();
                    },100,refs,name);
                }else{
                    command.subItem.agg = command.agg;
                    this.changeColumnSetting('data');
                }
            },
            renameColumn(subItem){
                this.onEditColumn.edit = false;
                subItem.as = subItem.as.trim().replace(/\s+/,' ');
                this.changeColumnSetting('data');
            },
            removeColumn(idx){
                this.settingItem.selectedColums.splice(idx,1);
                this.changeColumnSetting('data');
            }, 
            handleChangeColumn(evt){
                this.changeColumnSetting('data');
            },
            getClassForSelectedColumn(settingItem){
                return 'column-item-setting d-flex align-center';
            },
            showSelectAxisType(settingItem){
                if(this.selectedCell.sharedConfigs.type.includes('lineAnd') && settingItem.name.includes('Y Axis')){
                    return true;
                }
                return false;
            }
        }
    }
</script>
<style scoped>
	.setting-item >>> .v-input__control{
		min-height: unset !important;
    }
    .setting-item >>> .v-input__slot{
		box-shadow: unset !important;
		border: 1px solid lightgray !important;
		font-size: 13px !important;
		min-height: unset !important;
    }
    .setting-item >>> .rename-column-editor .v-input__slot{
		margin-bottom: unset;
    }
    .setting-item >>> .v-text-field__details{
		display: none !important;
    }
    .config-settings  .setting-item .title {
        padding: 0px 8px;
        font-size: 13px !important;
    }
	.icon-show-sery-type{
		/* margin-top: -36px !important; */
	}
    .setting-sub-items {
        margin: -4px 5px 5px 5px;
        padding: 5px 5px;
        border: 1px dashed #eaeaea;
        border-radius: 5px;
    }

    input.el-input__inner.search-item {
        height: 21px;
        line-height: 21px;
        padding: 0px 10px;
    }

    .draggable-setting-item .column-item-setting{
        color: #6d6d6d;
        padding: 5px 2px 5px 7px;
        border-radius: 3px;
        background-color: #efefef;
        font-size: 12px;
        cursor: move;
        margin-bottom: 5px;
    }

    .remove-column{
        padding: 3px;
        position: relative;
        cursor: pointer;
    }
    .remove-column:hover{
        color: red;
        font-weight: 900;
    }
    .agg-func-name{
        color: #369cff;
        padding-right: 5px;
        font-size: 12px;
    }

    .rename-column-editor{
        border: none;
        font-size: inherit;
    }
    .add-more-y-axis:hover{
        color: #409EFF;
        border-color:1px solid #409EFF;
        background-color: #ecf5ff;
    }
    .add-more-y-axis{
        margin: 0px 6px;
        padding: 4px;
        width: calc(100% - 12px);
        color: #c0c4cc;
        background: inherit;
        border: none;   
    }

    .column-item-axis-type .agg-func-name{
        position: relative;
    }
    .column-item-axis-type{
        /* display: inline-block!important; */
        width: calc(100% - 30px)!important;
        padding-bottom: 0px!important;
    }



    .y-axis-type:hover{
        background-color: #eaeaea;
    }

    .y-axis-type{
        border-radius: 4px;
        float: right;
        display: inline-block;
    }

    .y-axis-type-select-icon{
        padding: 3px;
        cursor: pointer;
        border: 1px solid #c2c2c2;
        border-radius: 3px;
    }

    .column-item-label{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        position: relative;
        top: 2px;
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