<template>

    <div class="symper-join-builder">
        <div class="select-column-join  p-3">
            <div class="pb-3 mt-2">
                <span class="ml-2" style="font-size:14px;font-weight:600">Joined Columns</span>
                <v-select
                    style="width:120px"
                    class="sym-small-size float-right border-white"
                    v-model="nodeData.configs.joinType"
                    :items="joinTypes"
                    :item-text="'label'"
                    :item-value="'value'"
                    outlined
                    dense
                ></v-select>
            </div>

            <div class="select-joined-colunns ma-2 fs-13">
                <v-expansion-panels
                    v-for="(columns, groupidx) in nodeData.configs.joinedColumns" :key="groupidx" :name="groupidx"
                    multiple
                    flat
                    class="fs-13"
                >
                    <v-expansion-panel class="sym-expand-panel ">
                        <v-expansion-panel-header class="v-expand-header pa-0" style="height: 35px!important;min-height: 35px!important">
                            <div class="w-100">
                                <span class="float-left">{{'Join condition ' + (groupidx+1)}}</span>
                                <v-btn class="float-right" x-small icon @click="removeJoinCondition(groupidx)"><i class="mdi mdi-close fs-16"></i></v-btn>
                            </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="sym-v-expand-content ">
                            <div v-for="(column,columnIdx) in columns" :key="columnIdx" class="my-1 fs-13">
                                <div class="d-inline-block mr-2" style="width:60px">
                                    Input #{{columnIdx+1}}
                                </div>
                                <SelectColumn
                                    class="pl-1 d-inline-block"
                                    :allColumns="nodeData.configs.allColumns[columnIdx]"
                                    :model="column.uid"
                                    @change-value="setJoinedColumnInfo(columnIdx,groupidx)"
                                />
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                
                <v-btn
                    @click="addJoinCondition()" 
                    class="mt-2 w-100"
                    outlined
                    small>
                    <i class="mdi mdi-plus mr-2"></i> Add join Condition
                </v-btn>
            </div>
        </div>
        <DatasetColumnSelector
            :rowData="allColumns"
        />
    </div>
</template>

<script>
import SelectColumn from '@/components/common/bi/SelectColumn.vue'
import DatasetColumnSelector from "@/components/dataset/DatasetColumnSelector.vue";

export default {
    components: {
        SelectColumn,
        DatasetColumnSelector
    },
    props: {
        nodeData: {
            type: Object,
            default(){
                return {

                }
            }
        }
    },
    data(){
        return {
            joinTypes: [
                {
                    label: 'Left Join',
                    value: 'LEFT JOIN'
                },
                {
                    label: 'Inner Join',
                    value: 'INNER JOIN'
                },
                {
                    label: 'Full Join',
                    value: 'FULL JOIN'
                },
                {
                    label: 'Right Join',
                    value: 'RIGHT JOIN'
                },
            ]
        }
    },
    computed:{
        allColumns(){
            let rsl = [];
            this.nodeData.configs.allColumns.forEach(element => {
                rsl = rsl.concat(element);
            });
            return rsl;
        }
    },
    beforeMount() {
        
    },
    mounted() {
        
    },
    methods:{
        setJoinedColumnInfo(columnIdx,groupidx){
            let colInfo = {};
            let configs = this.nodeData.configs;

            let colUid = configs.joinedColumns[groupidx][columnIdx].uid;
            for(let groupColumn of configs.allColumns){
                for(let col of groupColumn){
                    if(col['uid'] == colUid){
                        configs.joinedColumns[groupidx][columnIdx]['title'] = col['title'];
                        configs.joinedColumns[groupidx][columnIdx]['columnName'] = col['columnName'];
                        break;
                    }
                }
            }
            
        },
        checkSelectedRows(){
            this.$refs.selectBuilder.checkSelectedRows();
        },
        handleChangeConfig(data){
            if(this.timeOutEvtExe){
                clearTimeout(this.timeOutEvtExe);
            }
            this.timeOutEvtExe = setTimeout((thisCpn,data) => {
                console.log(data,'handleChangeConfig - join');
                thisCpn.$emit('change-configs',data);            
            }, 100,this,data);
        },
        addJoinCondition(){
            let configs = this.nodeData.configs;
            configs.joinedColumns.push(this.getDefaultJoinCondition());
        },
        removeJoinCondition(idx){
            this.nodeData.configs.joinedColumns.splice(idx,1);
        },
        getDefaultJoinCondition(inputNum = 0){
            let rsl = [];
            if(inputNum == 0){
                inputNum = this.nodeData.configs.allColumns.length;
            }
            for(let i =0;i<inputNum;i++){
                rsl.push({
                    uid:'',
                    columnName:'',
                    title:''
                });
            }
            return rsl;
        }
    }
}
</script>

<style>
.symper-join-builder .v-expansion-panel-content__wrap{
    padding-left: 8px;
}
</style>