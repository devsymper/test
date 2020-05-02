<template>
    <div class="home">
        <orgchart-selector>

        </orgchart-selector>
    </div>
</template>

<script>
import FormTpl from "./../components/common/FormTpl.vue";
import OrgchartSelector from "./../components/user/OrgchartSelector.vue";
export default {
    name: "Home",
    methods: {
        addNum() {
            this.num += 1;
        }
    },
    data() {
        return {
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
        'orgchart-selector': OrgchartSelector
    }
};
</script>
