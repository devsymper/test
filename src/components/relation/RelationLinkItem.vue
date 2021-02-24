<template>
    <div class="d-flex relation-link-item">
        <div style="width: 100px">
            <v-autocomplete
                v-model="item.dataset"
                :items="listDatasetSelected"
                dense
                item-text="name"
                item-value="id"
                solo
            ></v-autocomplete>
        </div>
       <div class="flex-grow-1 mx-1">
            <SelectColumn 
                :allColumns="allColumns"
                :model="item.column"
            />
       </div>
        <v-btn icon tile x-small class="mt-1"  @click="removeColumn">
            <v-icon small>
                mdi-close
            </v-icon>
        </v-btn>

    </div>
</template>

<script>
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';
import SelectColumn from "@/components/common/bi/SelectColumn"
export default {
    data(){
        return{
             dashboardDatasetWorker: null,
             allColumns: []
        }
    },
    created(){
		this.dashboardDatasetWorker = new DashboardDatasetWorker()
		this.listenFromWorker()
	},
    methods:{
        removeColumn(){
            this.$emit('remove-column')
        },
        getDatasetColumns(){
            this.dashboardDatasetWorker.postMessage({
                action: 'getDatasetColumns',
                data:{
                    id: this.item.dataset
                }
            })
        },
        handleGetDatasetColumns(data){
			if(data.status == 200){
                this.$set(this, "allColumns", data.data.columns[this.item.dataset])
			}else{
				this.$snotifyError("Không thể lấy danh sách column")
			}
        },
        listenFromWorker(){
			let self = this;
            this.dashboardDatasetWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
		}
    },
    props:{
        listDatasetSelected:{
            type: Array,
            default(){
                return []
            }
        },
        item:{
            type: Object
        }
    },
    components:{
        SelectColumn
    },
    watch:{
        'item.dataset'(val){
            this.getDatasetColumns()
            this.item.column = ""
        }
    }
    
}
</script>

<style scoped>
.relation-link-item >>> .v-input__control{
    min-height: unset !important;
    width: 71px !important;
}

.relation-link-item >>> .v-input__slot{
    box-shadow: unset !important;
    border: 1px solid lightgray;
    height: 28px !important;
}
.relation-link-item >>> .v-input__slot input{
    font-size: 13px !important;
}
.relation-link-item >>> .v-text-field__details{
    display: none !important;
}
</style>