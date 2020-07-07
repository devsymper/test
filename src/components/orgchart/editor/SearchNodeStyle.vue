<template>
    <div>
        <v-combobox
            v-model="selectedNodeStyle"
            :filter="filter"
            :hide-no-data="!search"
            :items="allNodeStyles"
            :search-input.sync="search"
            item-text="name"
            return-object
            dense
            flat
            hide-selected
            label="Search node style to apply"
            solo>

            <template v-slot:item="{ index, item }">
                {{ item.name }}
                <v-spacer></v-spacer>
                <v-list-item-action @click.stop>
                    <v-btn
                        icon
                        @click.stop.prevent="deleteNodeStyle(index, item)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-list-item-action>
            </template>
        </v-combobox>
    </div>
</template>

<script>
import { SYMPER_APP } from '../../../main'
export default {
    // data(){
    //     return {
    //         
    //     }
    // },

    data: () => ({
        selectedNodeStyle: null,
        activator: null,
        attach: null,
        colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
        index: -1,
        nonce: 1,
        menu: false,
        model: [
            {
            text: 'Foo',
            color: 'blue',
            },
        ],
        x: 0,
        search: null,
        y: 0,
    }),

    watch: {
      model (val, prev) {
        if (val.length === prev.length) return

        this.model = val.map(v => {
          if (typeof v === 'string') {
            v = {
              text: v,
              color: this.colors[this.nonce - 1],
            }

            this.items.push(v)

            this.nonce++
          }

          return v
        })
      },
    },

    methods: {
      filter (item, queryText, itemText) {
        if (item.header) return false

        const hasValue = val => val != null ? val : ''

        const text = hasValue(itemText)
        const query = hasValue(queryText)

        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      },
      async deleteNodeStyle(index, item){
          try {
            //   let res = await orgchartAp
            //   this.$store.commit('orgchart/deleteNodeStyle');          
          } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not delete selected item");
          }
      }
    },

    computed: {
        allNodeStyles(){
            return this.$store.state.orgchart.allNodeStyle;
        }
    }
}
</script>

<style>

</style>