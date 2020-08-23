<template>
    <div></div>
</template>

<script>
export default {
    created(){
        let routeObj = this.$route.params.urlInfo;
        this.$router.push({
            name: routeObj.routeName,
            params: routeObj.routeParams
        });
        let self = this;
        setTimeout(() => {
            self.$destroy();
        }, 2000);
    }
}
</script>

<style>

</style>