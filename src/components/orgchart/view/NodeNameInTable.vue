<template>
    <span style="width:500px">
        <i :class="'mdi mr-2 fs-16 '+icon"></i>
        <span style="padding-right:8px;margin-top:-2px">{{text}}</span>
    </span>
</template>
<script>
let mapNodeTypeIcon = {
    position: 'mdi-briefcase-outline',
    department: 'mdi-office-building',
    none: 'mdi-book-multiple-outline'
};
export default {
    data(){
        return {
            icon: null,
            text:''
        };
    },
    beforeMount() {},
    mounted() {
        let type = this.params.data ? this.params.data.nodeType : 'none';
        this.icon = mapNodeTypeIcon[type] ;
        this.text = this.getValue();
    },
    methods: {
        getIcon() {
            return this.params.data.icon;
        },
        getValue() {
            let vls = this.params.value;
            if(typeof vls == 'string'){
                return vls;
            }else{
                return vls[vls.length - 1];
            }
        },
    },
   
}
</script>
<style scoped>

</style>