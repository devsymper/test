<template>
<div style="width:100%; height:100%">
    <v-card class="d-flex justify-start" height="100%">
        <MenuTab/>
        <DetailView/>
    </v-card>
</div>
</template>

<script>
import MenuTab from "../../../src/components/search/Menu"
import DetailView from "../../../src/components/search/Detail"

export default {
     components: {
         MenuTab,
        DetailView
       
     }
 
}
</script>


