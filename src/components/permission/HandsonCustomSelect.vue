<template>
    <span>
        <span
            v-if="isEditor && isVisible"
            :style="style"
            @mousedown="stopMousedownPropagation">
            <v-autocomplete
                v-model="value"
                :items="mapAllResource[objectType]"
                hide-details
                return-object
                flat
                style="position: relative; top: -14px"
                height="18"
                class="symper-cell-table-cell-editor"
                dense
                ref="autocompleteComponent"
                background-color="white"
                @change="setValue"
                :filter="filterItems"
                solo>

                
                <template v-slot:selection="{ item }">
                    <div class="d-inline-block text-ellipsis" style="width: 100%">
                        <span v-text="item.id " class="mr-2 font-weight-medium fs-12"></span>
                        <span v-text="item.title ? item.title : item.name" class="fs-12"></span>
                    </div>
                </template>

                <template v-slot:item="{ item }">
                    <div class="pa-2 ">
                        <div class="d-flex fs-13">
                            <span v-text="item.id" class="mr-2"></span>
                            <span v-text="item.name"></span>
                        </div>
                        <div class="w-100 fs-12 text--grey">
                            <span v-text="item.title"></span>
                        </div>
                    </div>
                </template>
            </v-autocomplete>
        </span>
        <span v-if="isRenderer">
            <div class="d-inline-block text-ellipsis" style="width: 100%">
                <span v-text="value.id " class="mr-2 font-weight-medium fs-12"></span>
                <span v-text="value.title ? value.title : value.name" class="fs-12"></span>
            </div>
        </span>
    </span>
</template>
<script lang="ts">
import { BaseEditorComponent } from "@handsontable/vue";

export default {
    props: {
        objectType: {
            type: String,
            default: 'document'
        }
    },
    computed: {
        mapAllResource(){
            return this.$store.state.actionPack.allResource;
        }
    },
    created(){
        this.$store.dispatch('document/setListDocuments');
    },
    extends: BaseEditorComponent,
    data(){
        return {
            hotInstance : null ,
            TD : null ,
            row : null ,
            col : null ,
            prop : null ,
            value : {
                id: '',
                name: '',
                title: ''
            } ,
            cellProperties : null ,
            isEditor : null ,
            isRenderer : null ,
            editorElement : null ,
            isVisible : false ,
            style : {
                position: "absolute",
                padding: "15px",
                background: "#fff",
                zIndex: 999,
                left: "0px",
                top: "0px",
                border: "solid 1px black",
                width: null,
                height: null
            }
        }
    },

    methods: {
        filterItems(item, queryText, itemText){
            queryText = queryText.toLowerCase();
            if(item.title.toLowerCase().includes(queryText) 
                || item.name.toLowerCase().includes(queryText)
                || item.id.toLowerCase().includes(queryText)){
                    return true;
            }else{
                return false;
            }
        },
        applyChangeValue(value){

        },
        stopMousedownPropagation(e) {
            e.stopPropagation();
        },

        prepare(row, col, prop, td, originalValue, cellProperties) {
            BaseEditorComponent.options.methods.prepare.call(
            this,
            row,
            col,
            prop,
            td,
            originalValue,
            cellProperties
            );

            const tdPosition = td.getBoundingClientRect();

            this.style.left = (tdPosition.left + window.pageXOffset + 3) + "px";
            this.style.top = (tdPosition.top + window.pageYOffset + 3) + "px";
            this.style.width = (tdPosition.width - 6)+'px';
            this.style.height = (tdPosition.height - 6)+'px';
            console.log(
            this,
            row,
            col,
            prop,
            td,
            originalValue,
            this.style,'xxxxxxxx');
            
        },

        applyValue() {
            
            this.finishEditing();
        },

        open() {
            this.isVisible = true;
            setTimeout((self) => {
                self.$refs.autocompleteComponent.focus();
            }, 50, this);
            this.$emit('open-editor', true);
        },

        close() {
            this.applyValue();
            this.isVisible = false;
            this.$emit('open-editor', false);
        },

        setValue(value) {
            if(!value){
                value = {
                    id: '',
                    name: '',
                    title: ''
                };
                this.value = null;
                this.value = value;
            }
        },

        getValue() {
            return this.value;
        }
    }
}
</script>
<style >
.symper-cell-table-cell-editor .v-text-field.v-text-field--solo.v-input--dense > .v-input__control{
    min-height: 18px!important;
}

.symper-cell-table-cell-editor .v-input__slot{
    min-height: 18px!important;
}
</style>