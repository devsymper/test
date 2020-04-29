<template>
  <v-treeview
    v-model="tree"
    :items="allControl"
    dense
    hoverable
    open-all
    class="sym-small-size mt-2"
  >
    <template v-slot:prepend="{ item }">
        <img :src="`https://hoangnd.dev.symper.vn/`+item.icon" height="14" width="14" style="margin-top:3px;">

    </template>
    <template v-slot:label="{ item }">
        <label :title="item.name">{{item.name}}</label>
    </template>
  </v-treeview>
</template>
<script>
  export default {
    computed: {
        allControl(){
          return this.$store.state.document.editor.listControlTreeData;
        }
    },
 
    data: () => ({
        tree: [],
    })
  }
</script>