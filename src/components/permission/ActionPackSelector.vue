<template>
    <div>
        <div  class="d-flex">
            <v-text-field
                style="width: calc(100% - 80px)!important"
                v-if="actionOnSearchItem == 'search'"
                class="d-inline-block mr-2 sym-small-size w-100 "
                outlined
                single-line
                append-icon="mdi-magnify"
                v-model="searchKey"
                dense
                label="Search"
                placeholder="Search selected action packs"
            ></v-text-field>

                
            <v-autocomplete
                style="width: calc(100% - 80px)!important"
                v-if="actionOnSearchItem == 'add'"
                v-model="selectedActionPack"
                :items="allActionPack"
                filled
                dense
                solo
                flat
                outlined
                return-object
                item-text="name"
                item-value="id"
                placeholder="Find action pack to add"
                class="sym-small-size sym-pad-0 mr-2 "
                :multiple="false"
                @change="addPermission">

            </v-autocomplete>

            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn
                        depressed
                        icon
                        small
                        v-on="on"
                        @click="changeSearchAction">
                        <v-icon size="18" dark>{{ actionOnSearchItem == 'add' ? 'mdi-magnify' : 'mdi-plus'}}</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ actionOnSearchItem == 'add' ? 'Search selected permission packs' : 'Add permission to role' }}
                </span>
            </v-tooltip>
        </div>
			<VuePerfectScrollbar style="height:calc(100vh - 320px);margin-top:10px">
				<v-list dense  >
					<v-list-item-group class="mt-1 mr-4">
							<v-list-item
								v-for="(item, i) in filterLazyValue"
								:key="i"
								class="w-100 selected-permission-pack ">

								<span class="fs-13">
									{{item.name}}
								</span>

								<v-btn
									depressed
									icon
									small
									class="delete-selected-permission">

									<v-icon size="18" color="red" @click="deleteSelectedActionPack(item, i)"   >
										mdi-close
									</v-icon>

								</v-btn>
							</v-list-item>
					</v-list-item-group>
				</v-list>
			</VuePerfectScrollbar>
    </div>
</template>

<script>
import { TouchListener } from 'ag-grid-community';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	components:{
		VuePerfectScrollbar
	},
    created(){
        this.$store.dispatch('permission/getAllActionPack');
    },
    methods: {
        deleteSelectedActionPack(item, i){
            this.lazyValue.splice(i, 1);
            this.$emit('input', this.lazyValue);
        },
        changeSearchAction(){
            this.searchKey = '';
            if(this.actionOnSearchItem == 'add'){
                this.actionOnSearchItem = 'search';
            }else{
                this.actionOnSearchItem = 'add';
            }
        },
        filterSelectedPack(search){

        },
        addPermission(pk){
            if(!pk){
                return;
            }
            let selectedPK = false;
            for(let pack of this.lazyValue){
                if(pack.id == pk.id){
                    selectedPK = true;
                    break;
                }
            }

            if(!selectedPK){
                this.lazyValue.unshift(pk);
            }
            this.$emit('input', this.lazyValue);
        }
    },
    computed: {
        allActionPack(){
            return Object.values(this.$store.state.permission.allActionPack);
        },
        filterLazyValue(){
            let searchKey = this.searchKey;
            if(!searchKey){
                return this.lazyValue;
            }else{
                return this.lazyValue.filter((el) => {
                    if(el.name.toLowerCase().includes(searchKey.toLowerCase())){
                        return true;
                    }else {
                        return false;
                    }
                });
            }
        }
    },
    props: {
        /**
         * Dạng: [
         *      {
         *          id: '',
         *          name: '',
         *          description: ''
         *      }
         * ]
         */
        value: {
            type: Array,
            default(){
                return []
            }
        },
    },
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler: function(after){
				this.lazyValue = after
				this.selectedActionPack = {}
            }
        }
    },
    data(){
        return {
            searchKey: '',
            selectedActionPack: null,
            lazyValue: [],
            actionOnSearchItem: 'add', // hành động của thanh tìm kiếm: add hoặc search
        }
    }
}
</script>

<style>

.delete-selected-permission{
    position: absolute!important;
    right: 5px;
}

.selected-permission-pack .delete-selected-permission{
    display: none;
}

.selected-permission-pack:hover .delete-selected-permission{
    display: block;
}
</style>