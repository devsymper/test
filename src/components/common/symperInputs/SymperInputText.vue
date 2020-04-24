<template>
    <div class="symper-input" :style="{
        width: width
    }">
        <div class="symper-input-label" :style="{'min-width': labelMinWidth, }">
            {{label}}
        </div>
        <div class="symper-input-field" :style="{'min-width': fieldMinWidth, }">
            <input type="text" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: ""
        },
        width:{
            type: String,
            default: "100%"
        },
        labelMinWidth:{
            type: String,
            default: "50px"
        },
        fieldMinWidth:{
            type: String,
            default: "calc(100% - 50px)"
        },
    }
};
</script>

<style>
.symper-input {
    display: inline-block;
}

.symper-input .symper-input-label {
    display: inline-block;
}

.symper-input .symper-input-field {
    display: inline-block;
}

.symper-input .symper-input-field input {
    padding: 4px;
    border: none;
}
</style>