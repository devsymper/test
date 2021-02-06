<template>
    <div class="select-button" style="text-align:center;border:none!important">
        <div class="sub-select-button">
            <v-icon @click="applyChangeValue(item.value)" :class="{'active':item.value == myValue}" class="fs-15 mx-2 my-1" v-for="(item,index) in items" :key="index">
                {{item.icon}}
            </v-icon>
        </div>
    </div>
</template>

<script>
import { util } from "@/plugins/util";
export default {
    props:{
        value: {
            default: ""
        },
        items: {
            type: Array,
            default(){
                return []
            }
        },
    },
    watch: {
        items: {
            deep: true,
            immediate: true,
            handler: function(after, before){
                this.myItems = util.cloneDeep(after);
            }
        },
        value: {
            deep: true,
            immediate: true,
            handler: function(after, before){
                this.myValue = after;
            }
        }
    },
    data(){
        return{
            myItems: [],
            myValue: '',
        }
    },
    methods: {
        applyChangeValue(vl){
            this.myValue = vl;
            this.$emit('input', vl);
            this.$emit('change', { // có thêm items là để set lại danh sách các option trong trường hợp load data từ server
                value: vl,
                items: this.myItems
            });
        },
        reAssignItems(){
            let self = this
            setTimeout((self) => {
                if(self.myItems.length == 0){
                    self.myItems = self.items;
                }
            }, 600, this);
        }
    },
}
</script>

<style scoped>
.sub-select-button{
    margin: auto;
    width:75%; 
    border:var(--symper-border);
    border-radius:3px
}
.active{
    color:#f58634;
}
</style>