<template>
    <div class="symper-task-list-filter bg-white py-3">
        <div v-for="(item, key) in listFilter" :key="key" class="pt-2">
            <div class="fs-14 pl-3 font-weight-medium">
                {{item.label}}
            </div>
            <v-combobox
                v-model="item.value"
                :items="item.items"
                :filter="filterItems"
                :hide-no-data="!item.searchKey"
                :search-input.sync="item.searchKey"
                :item-value="'id'"
                @change="handleFilterChange"
                chips
                dense
                flat
                class="select-orgchart border-all mx-4 my-2" 
                style="background-color: "
                multiple
                solo>
                <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip color="blue-grey lighten-5 mt-1" close-icon="mdi-close" v-bind="attrs" :input-value="selected" close x-small @click="select" @click:close="removeItem(item)">
                        {{item.displayName}}
                    </v-chip>
                </template>

                <template v-slot:item="{ index, item }">
                    <span class="fs-13 py-1 ">{{item.displayName}}</span>
                </template>
            </v-combobox>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        handleFilterChange(){
            let filterData = {};
            for(let key in this.listFilter){
                if(this.listFilter[key].value){
                    filterData[key] = [];
                    filterData[key] = this.listFilter[key].value.reduce((arr, ele) => {
                        arr.push(ele.id);
                    }, []);
                    filterData[key] = filterData[key].join(',');
                }
            }
            this.$emit('filter-change-value', filterData);
        },
        filterItems(item, queryText, itemText) {
            const hasValue = val => (val != null ? val : "");
            const text = item.displayName;
            const query = hasValue(queryText);
            return text
                .toString()
                .toLowerCase()
                .indexOf(query.toString().toLowerCase()) > -1;
        }
    },  
    computed: {
        allProcessDefinition(){
            return this.$store.state.process.allDefinitions;
        }
    },
    watch:{
        allProcessDefinition : {
            deep: true,
            immediate: true,
            handler(afterValue){
                let arr = [];
                for(let definitionId in afterValue){
                    let def = afterValue[definitionId];
                    def.displayName = def.name;
                    arr.push(def);
                }
                this.$set(this.listFilter.processDefinitionId, 'items', arr);
            }
        }
    },
    data(){
        return {
            searchCombo: null,
            listFilter: {
                assginee: {
                    label: this.$t('tasks.header.assignee'),
                    items: this.$store.state.app.allUsers,
                    value: null,
                    searchKey: ''
                },
                owner: {
                    label: this.$t('tasks.header.owner'),
                    items: this.$store.state.app.allUsers,
                    value: null,
                    searchKey: ''
                },
                processDefinitionId: {
                    label: this.$t('process.instance.process_definition_name'),
                    items: [],
                    value: null,
                    searchKey: ''
                },
            }
        }
    }
}
</script>

<style>

</style>