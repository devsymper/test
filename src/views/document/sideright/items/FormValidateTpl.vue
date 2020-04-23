<template>
    <v-treeview
    dense
    hoverable
    open-all
    :items="items"
    style="overflow-x: scroll;
    overflow-y: hidden;"
  >
        <template v-slot:append="{ item }">
            <input class="input-validate" v-if="!item.condition" type="text">
            <div v-else type="text">
               
                  <v-btn
                      light
                      icon
                      style="height: 28px;width: 28px;"
                      v-if="!item.root"
                      @click="deleteCondition(item)"
                    >
                      <v-icon style="font-size:16px;">mdi mdi-close</v-icon>
                    </v-btn>
                <v-btn
                      light
                      icon
                      style="height: 28px;width: 28px;"
                      @click="swapCondition(item)"
                    >
                      <v-icon style="font-size:16px;">mdi mdi-swap-vertical-bold</v-icon>
                    </v-btn>
                    
                <v-menu 
                  bottom 
                  left
                  open-on-hover
                  offset-y
                  transition="slide-y-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      light
                      icon
                      v-on="on"
                      style="height: 28px;width: 28px;"
                    >
                      <v-icon style="font-size:16px;">mdi mdi-plus</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, i) in dropAddNode"
                      :key="i"
                      style="cursor:pointer; min-height:25px;"
                      @click="addNode(item,i)"
                    >
                      <v-list-item-title style="font-size:13px;">{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </div>
        </template>
  </v-treeview>
</template>
<script>

export default {
    data: () => ({
      items: [
        {
            id:1,
          name: 'AND',
          root: true,
          condition:true,
          children: [
            {id:2,name: '',condition:false},
            {id:3,name:'OR',condition:true,
                children: [
                    {id:4,name: '',condition:false},
                    {id:5,name:'OR',condition:true,children: [
                    {id:6,name: '',condition:false},
                    {id:7,name:'OR',condition:true,children: [
                    {id:8,name: '',condition:false},
                    {id:9,name:'OR',condition:true}
                ],}
                ],}
                ],
            }
          ],
          
        }
      ],
      dropAddNode:[{title:'item',type:'item'},{title:'group',type:'group'}]
    }),
    methods:{
        addNode(item,i){
            if(item.type == 'item'){

            }
            else{

            }
        },
        swapCondition(item){
            item.name = (item.name == 'OR') ? 'AND' : 'OR'
        },
        deleteCondition(item){
            // this.items = $.grep(this.items,
            //        function(o,i) { return o.id !== item.id; },
            //        true);
        }
    }
};
</script>

<style scoped>
    .input-validate{
        height: 24px;
        background: #f2f2f2;
        border-radius: 4px;
    }
    
</style>
