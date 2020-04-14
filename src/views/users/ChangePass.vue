<template>
    <v-flex class="d-flex">
        <div class="side-bar-left">
            <h4 class="m-2">Control</h4>
        </div>
        <div class="side-bar-right">
            <h4 class="m-2">Thuộc tính</h4>
        </div>
    </v-flex>
</template>
<script>
//
export default {
  
}
</script>
<style>
    .d-flex{
        display: flex;
    }
    .side-bar-right,.side-bar-left{
        height: 100%;
        width: 240px;
        background: #f2f2f2;
    }
    .tox-tinymce{
        height: 100%;
        width: calc(100% - 480px);
    }
    .container {
        padding: 0;
    }
</style>