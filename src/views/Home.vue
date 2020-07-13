<template>
    <div class="home">
        <h1>
            Home page
        </h1>
        <PermissionSelector
        v-model="selectedPermission">

        </PermissionSelector>
        <!-- <TimelineTreeview>
            <template slot="tree-item-content" slot-scope="{itemData}">
                <i :class="'mdi mr-2 ' +itemData.icon"></i>
                <span>{{itemData.name}}</span>
            </template>
        </TimelineTreeview> -->
        <!-- <FormulaEditor v-model="formula">
        </FormulaEditor> -->
    </div>
</template>

<script>
import FormTpl from "./../components/common/FormTpl.vue";
import OrgchartSelector from "./../components/user/OrgchartSelector.vue";
import TimelineTreeview from "./../components/common/TimelineTreeview";
import Handsontable from 'handsontable';
import FormulaEditor from "./../components/formula/editor/FormulaEditor";
import SymperColorPicker from "@/components/common/symperInputs/SymperColorPicker.vue";
import PermissionSelector from "@/components/permission/PermissionSelector.vue";

export default {
    name: "Home",
    methods: {
        addNum() {
            this.num += 1;
        }
    },
    data() {
        return {
            selectedPermission: [
                
                    {
                        id: 'xxx',
                        name: 'Permission 1',
                        description: 'Permission 1 description',
                    },
                    {
                        id: 'yyy',
                        name: 'Permission 1',
                        description: 'Permission 1 description',
                    },
            ],
            color: '#000000',
            formula: 'SELECT * FROM abc',
            testModel: [{"idNode":"14bcc081-771e-490a-8254-bced2d7acab2","idOrgchart":"689"},{"idNode":"919ba806-73e5-4cb6-bbd8-6c7e3c44455a","idOrgchart":"689"}],
            num: 0,
            allInputs: {
                numeric: {
                    title: "Numeric",
                    type: "numeric",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                text: {
                    title: "Text",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                sex: {
                    title: "Giới tính",
                    type: "select",
                    value: "male",
                    validate: [],
                    options: [
                        {
                            text: "Nam",
                            value: "male",
                            icon: "mdi-human-male"
                        },
                        {
                            text: "Nữ",
                            value: "female",
                            icon: "mdi-human-female"
                        }
                    ]
                }
            }
        };
    },
    components: {
        "form-tpl": FormTpl,
        'orgchart-selector': OrgchartSelector,
        TimelineTreeview,
        FormulaEditor: FormulaEditor,
        SymperColorPicker: SymperColorPicker,
        PermissionSelector
    }
};
</script>
