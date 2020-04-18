<template>
    <div class="home">
        <h1>Home</h1>
        <formulaEditor/>
    </div>
</template>

<script>
import FormulaEditor from "../components/common/FormulaEditor";
export default {
    name: "Home",
    components: {
        formulaEditor: FormulaEditor
    }
};
</script>
