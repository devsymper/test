<template>
    <div :title="item.aliasName" style="position:relative">
		<v-icon small class="ml-1">
			{{item.type == 'doc' ? 'mdi-folder' : 'mdi-file'}}
		</v-icon>
        <span class="fs-13">{{item.symperId +' - '+ item.name}}</span>
        <div class="pl-2 pb-2 pt-1 secondary-text fs-13">{{item.aliasName}}</div> 
        <v-icon @click="handleRemoveItem" class="icon-remove-dataset-item" v-if="showRemove" small >mdi-close</v-icon>
    </div>
</template>
<script>
export default {
    props : {
        item : {
            default(){
                return {}
            }
        },
        showRemove : {
            default : false
        }
    },
    components : {
    },
    methods : {
        handleRemoveItem(){
            this.$emit('remove-item',this.item);
        }
    }
}
</script>
<style>
.icon-remove-dataset-item{
	position: absolute !important;
	right: 0px;
	top: 4px;
}
</style>