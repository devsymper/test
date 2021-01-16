<template>
    <div class="setting-item">
        <span class="title">{{settingItem.name}}</span>
        <div class="setting-sub-items"> 
            <draggable
                group="drop-column"
                :list="settingItem.selectedColums"
                @change="handleChangeColumn"
                class="dragArea list-group">
                <div class="draggable-setting-item"  v-for="(subItem,idx) in settingItem.selectedColums" :key="idx">
                    <div :class="getClassForSelectedColumn(settingItem)" :ref="'wrap'+subItem.name">
                        <span class="column d-flex" style="width: calc(100% - 35px)">
                            <span :title="settingTplAgg[subItem.type][subItem.agg].name" :ref="'agg'+subItem.name" v-if="settingItem.hasAgg" class="agg-func-name">{{subItem.agg}}</span>
                            <span :title="subItem.name + ' - ' + subItem.as" class="column-item-label" :ref="'cln-label'+subItem.name" v-show="!subItem.edit">{{subItem.as}}</span>
                            <input  
                                class="rename-column-editor w-100" 
                                :ref="'edt'+subItem.name" 
                                @keyup.tab="renameColumn(subItem)" 
                                @keyup.enter="renameColumn(subItem)" 
                                @blur="renameColumn(subItem)" 
                                v-model="subItem.as" 
                                type="text" 
                                v-show="subItem.edit">
                        </span>
                        <i :ref="'rm'+subItem.name" @click="removeColumn(idx)" class="el-icon-close float-right remove-column"></i>

                        <el-dropdown v-if="checkColumnExist(subItem)"  size="small" class="float-right" @command="handleAction">
                            <span class="el-dropdown-link">
                                <i :ref="'act'+subItem.name" class="el-icon-setting" style="cursor:pointer"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-if="settingItem.hasAgg">
                                    <el-dropdown-item :command="{subItem:subItem,agg:actName}" v-for="(action,actName) in settingTplAgg[subItem.type]" :key="actName" :icon="action.icon">{{action.name}}</el-dropdown-item>
                                </template>
                                
                                <el-dropdown-item :command="{subItem:subItem,agg:'rename'}" divided icon="el-icon-edit">Rename</el-dropdown-item>
                                
                                <el-dropdown-item v-if="selectedCell.sharedConfigs.type == 'table' ||selectedCell.sharedConfigs.type == 'pivot'"> 
                                    <el-dropdown class="w-100 " @command="changeLastLineColumnAgg" size="mini" placement="bottom-end">
                                        <div class="w-100">
                                            <span class="w-100 fs-13 mr-2">
                                                <i class="ms-Icon ms-Icon--Calculator mr-1"></i> 
                                                Last line agg 
                                            </span>
                                            <span class="float-right agg-func-name">
                                                {{subItem.lastLineAgg ? subItem.lastLineAgg : 'sum'}}
                                            </span>
                                        </div>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item 
                                                v-for="(item, idx) in aggForLastLine" 
                                                :key="idx"
                                                :command="{
                                                    agg: item,
                                                    column: subItem
                                                }">

                                                {{item.label}}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-dropdown-item>
                                
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span v-else >
                            <el-tooltip placement="top">
                                <div slot="content"><span>Column not found in selected datasets<br>
                                Please remove this column</span></div>
                                <i class="el-icon-warning float-right"  style="cursor:pointer; color: red"></i>
                            </el-tooltip>
                        </span>

                    </div>

                    <div class="y-axis-type" v-if="showSelectAxisType(settingItem)">
                        <el-dropdown size="small" @command="handleChangeSeryType">
                            <i  :class="getClassForSeryType(subItem)"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{subItem:subItem,type:'line'}" icon="ms-Icon ms-Icon--LineChart">Line</el-dropdown-item>
                                <el-dropdown-item :command="{subItem:subItem,type:'area'}" icon="ms-Icon ms-Icon--AreaChart">Area</el-dropdown-item>
                                <el-dropdown-item :command="{subItem:subItem,type:'column'}" icon="ms-Icon ms-Icon--StackedColumnChart2Fill">Column</el-dropdown-item>
                                <el-dropdown-item :command="{subItem:subItem,type:'bar'}" icon="ms-Icon ms-Icon--BarChartHorizontal">Bar</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </draggable>
            <input placeholder="Add field here" type="text" class="el-input__inner search-item add-field-config-setting">
        </div>
    </div>
</template>
<script>
    let seryTypeIcons = {
        line:'ms-Icon--LineChart',
        area:'ms-Icon--AreaChart',
        column:'ms-Icon--StackedColumnChart2Fill',
        bar:'ms-Icon--BarChartHorizontal',
    };
    export default {
        props:['settingItem','settingTplAgg','selectedCell'],
        data(){
            return {
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
        },
        methods:{
            changeLastLineColumnAgg(item){
                let agg = item.agg;
                let column = item.column;
                this.$set(column, 'lastLineAgg', agg.value);
                this.$emit('change-column-setting');
            },
            checkColumnExist(column){
                return SDashboardEditor.checkColumnInSelectedDataset(column);
            },
            showAddYAxis(){
                let last = this.settingItem.lastYaxis;
                let rsl = last && (('Y Axis '+last) == this.settingItem.name);
                if(rsl){
                    this.lastYaxisNo = last;
                }
                return rsl;
            },
            addYAxis(){
                window.SDashboardEditor.addYAxis();
            },
            getClassForSeryType(column){
                let iconType = seryTypeIcons['line'];
                if(column.seryType){
                    iconType = seryTypeIcons[column.seryType];
                }
                return 'ms-Icon y-axis-type-select-icon '+iconType;
            },
            handleChangeSeryType(command){
                // command.subItem.seryType = command.type;
                this.$set(command.subItem,'seryType',command.type);
                this.$emit('change-column-setting');
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
                    this.$emit('change-column-setting');
                }
            },
            renameColumn(subItem){
                this.onEditColumn.edit = false;
                subItem.as = subItem.as.trim().replace(/\s+/,' ');
                this.$emit('change-column-setting');
            },
            removeColumn(idx){
                this.settingItem.selectedColums.splice(idx,1);
                this.$emit('change-column-setting');
                SDashboardEditor.recheckSelectedColumn();
            }, 
            handleChangeColumn(evt){
                this.$emit('change-column-setting');
                SDashboardEditor.recheckSelectedColumn();
            },
            getClassForSelectedColumn(settingItem){
                if(this.showSelectAxisType(settingItem)){
                    return 'column-item-setting column-item-axis-type d-flex';
                }
                return 'column-item-setting d-flex';
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
    .setting-item {
        margin-top: 10px;
    }

    .config-settings .setting-item .title {
        padding: 0px 10px;
        font-size: 13px;
    }

    .setting-sub-items {
        margin: 2px 5px 5px 5px;
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
        display: inline-block!important;
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