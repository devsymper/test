<template>
    <div>
        <v-card-title class="pt-0 pb-2 subtitle-1 font-weight-bold">
            <v-icon class="pr-4">mdi-contain</v-icon> {{!!!isEdit ? "Thêm mới virtualdoc" : "Cập nhật virtualdoc"}}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row>
                <v-col cols="2" class="subtitle-2">
                    {{$t("virtualdoc.header.name")}}
                </v-col>
                <v-col cols="10">
                    <v-text-field
                        v-model="currentVirtualdoc.name"
                        class="sym-small-size bg-grey"
                        dense
                        solo
                        flat
                    ></v-text-field>
                </v-col>
                <v-col cols="2" class="subtitle-2">
                    {{$t("virtualdoc.header.description")}}
                </v-col>
                <v-col cols="10">
                    <v-text-field
                        v-model.lazy="currentVirtualdoc.description"
                        class="sym-small-size bg-grey"
                        dense
                        solo
                        flat
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="subtitle-2 pb-0">
                    {{$t("virtualdoc.header.columnsorder")}}
                </v-col>
                <v-col cols="12">
                    <v-text-field
                        v-model.lazy="currentVirtualdoc.columnsOrder"
                        class="sym-small-size bg-grey"
                        dense
                        solo
                        flat
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <div class="subtitle-2">{{$t("virtualdoc.header.formula")}}</div>
                    <FormulaEditor 
                        ref="formulaEditor"
                        v-model="currentVirtualdoc.formula"
                        :formulaValue="currentVirtualdoc.formula"
                        :height="'150px'"
                        :simpleMode="true"
                        @change="setValue"
                        @input="setValue"
                    ></FormulaEditor>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn
                small
                color="primary"
                class="float-right btn-fixed-bottom"
                @click="addvirtualdoc"
                :disabled="!/^[a-zA-Z\d_]{3,}$/.test(this.currentVirtualdoc.name)"
            >
                <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                {{ isEdit ? "Cập nhật" : "Thêm" }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import FormulaEditor from "../../components/common/FormulaEditor";
import Api from "./../../api/api.js";
export default {
    name: 'updateVirtualdoc',
    components: {
        FormulaEditor: FormulaEditor,
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        baseUrl: function(){
            return this.apiUrl + this.virtualdocUrl;
        }
    },
    data: function() {
        return {
            currentVirtualdoc: {
                name        : "",
                description : "",
                formula     : "",
                columnsOrder: "",
            },
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            virtualdocUrl: "virtualdocs",
        }
    },
    methods: {
        setVirtualdocObject(obj) {
            this.currentVirtualdoc = JSON.parse(JSON.stringify(obj));
            if (obj.id !== undefined && !!obj.id) {
                this.getDetailVirtualdoc(obj.id);
            }
        },
        setValue(data) {
            this.currentVirtualdoc.formula = data;
        },
        getDetailVirtualdoc(id) {
            let req = new Api(this.apiUrl);
            req.get(this.virtualdocUrl + "/" + id)
            .then(res => {
                if (res.status == 200) {
                    this.currentVirtualdoc = res.data;
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        },
        addvirtualdoc() {
            if (this.isEdit) {
                this.updatevirtualdoc();
            } else {
                this.createvirtualdoc();
            }
        },
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        createvirtualdoc() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.virtualdocUrl, this.currentVirtualdoc);
            res.then((result) => {
                // callback come here
                this.$emit("add-virtualdoc", res)
            }).catch((err) => {
                console.log(err);
                this.showError();
            });
        },
        updatevirtualdoc() {
            let req = new Api(this.apiUrl);
            let res = req.put(this.virtualdocUrl, this.currentVirtualdoc);
            res.then((result) => {
                this.$emit("update-virtualdoc", res)
            }).catch((err) => {
                console.log(err);
                this.showError()
            });
        },
    }
}
</script>
<style scoped>
    .col {
        padding-top: 0;
    }
</style>