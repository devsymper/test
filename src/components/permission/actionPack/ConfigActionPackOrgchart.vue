<template>
  <div>
      <h3>Thao tác với đối tượng </h3>
       <p>{{ selectedPermission }}</p>
      <div class="fs-13">
          <v-list v-for="(permission,i) in permissions" :key="i">
            <v-list-item>
                <v-checkbox :value="permission.value" 
                            :key="permission.title"
                            @change="handleChange"
                            :label="permission.title"
                            v-model="selectedPermission">
                </v-checkbox>
            </v-list-item>
        </v-list>
      </div>
         <OrgchartElementSelector 
          v-if="showTreeOrgchart"
          :checkboxMode="checkboxMode"
          @change-node-selected="handleChangeNodeSelected"
        />
  </div>
</template>

<script>
import OrgchartElementSelector from "@/components/common/OrgchartElementSelector.vue"
export default {
    components:{
        OrgchartElementSelector
    },
    data(){
        return{
            selectedPermission: [],
            checkboxMode:['department', 'position'],
            showTreeOrgchart: false,
            permissions: [
                {
                    title: this.$t('permissions.actionPack.orgchart.viewAll'),
                    value:'viewAll'
                },
                {
                    title: this.$t('permissions.actionPack.orgchart.viewItself'),
                    value:'viewItself'
                },
                {
                    title: this.$t('permissions.actionPack.orgchart.viewItselfAndChild'),
                    value:'viewItselfAndChild'
                },
                {
                    title: this.$t('permissions.actionPack.orgchart.viewOther'),
                    value:'viewOther'
                },
                
            ]
        }
    },
    props:{
        checkboxes:{
            type: Array,
            default(){
                return [
                    'viewOther'
                ]
            }
        }
    },
    methods:{
        handleChangeNodeSelected(data){
            debugger
        },
        handleChange(){
            this.$emit('permission-selected', this.selectedPermission)
        }
    },
    watch:{
        checkboxes:{
            deep:true,
            immediate:true,
            handler(arr){
                this.selectedPermission = arr
                if(arr.includes('viewOther')){
                    this.showTreeOrgchart = true
                }else{
                    this.showTreeOrgchart = false
                }
            }

        }
    }
}
</script>

<style scoped>
.v-list{
    padding: unset;
}
.v-list-item{
    min-height: unset;
    height:40px;
}
.v-input__slot label{
    font:13px roboto !important;
}
</style>