<template>
    <div class="px-1">
        <div class="d-flex">
            <div class="item-color"
                :style="{
                    'background-color': myValue ? myValue : ''
                }" 
                @click="showPickColor(myValue)"
            >
            </div>
            <div>
                <input style="margin-top:3px"  v-on:input="changeValueInput"  :value="myValue" type="text">
            </div>
        </div>
     
        <v-menu
            v-model="isShow"
            scrollable
            content-class="dialog-pick-color"
        >   
            <div>
                <pick-color 
                :value="myValue"
                @input="handleSelected"
                />
            </div>
         
        </v-menu>
    </div>
</template>

<script>
import PickColor from '@/components/common/listItemComponents/PickColor.vue';
import { util } from "@/plugins/util";

export default {
    components:{
		PickColor
    },  
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler: function(after, before){
                this.myValue =  util.cloneDeep(after);
            }
        }
    },
    props:{
        value: {
            type: String,
            default: "#CD4C46"
        },
    },
    data(){
        return{
            isShow:false,
            myValue: "",
            colorSelected:'',
            indexSelect:-1,
        }
    },
    methods:{
        addColor(){
            this.myValue.push("#000");
            this.$emit('input',this.myValue);
            this.$emit('change', { 
                value: this.myValue,
            });
        },
        handleSelected(color){
            this.myValue = color;
            this.$emit('input',this.myValue);
            this.$emit('change', { 
                value: this.myValue,
            });
        },
        changeValueInput(e){
            if(this.debounce){
                clearTimeout(this.debounce);
            }
            this.debounce = setTimeout((self) => {
                let vl = e.target.value;
                self.myValue = vl;
                self.$emit('input',self.myValue);
                self.$emit('change', { 
                    value: self.myValue,
                });
            }, 300, this);
        },
        showPickColor(){
            this.isShow = true;
        },
    }
}
</script>

<style scoped>
.item-color {
    /* height: 18px;
    width: 18px; */
    padding: 8px!important;
    display: inline-block;
    border-radius: 4px;
    margin: 4px;
    border: var(--symper-border);
}
::v-deep .dialog-pick-color{
    width: auto!important;
}
.focus-visible{
    border: 1px solid #acacac;
    outline: none;
    padding-left: 2px;
    border-radius: 3px;
}
</style>