<template>
    <div class="home">
        <h1>Home</h1>
        <formulaEditor/>
        <br />
        <h2>{{num}}</h2>

        <v-btn icon @click="addNum">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </div>
</template>

<script>
import FormulaEditor from "../components/common/FormulaEditor";
export default {
  name: "Home",
  methods: {
      addNum(){
          this.num += 1;
      }
  },
  data(){
      return {
          num: 0
      }
  },
  components: {
      formulaEditor: FormulaEditor
  }
};
</script>
