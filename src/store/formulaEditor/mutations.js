import { param } from "jquery";
import vueHtml2canvas from "vue-html2canvas";
import {
    SYMPER_HOME_ORGCHART
} from "../../components/orgchart/editor/nodeAttrFactory";


const changeViewOnlySub = (state, data) => {
    Vue.set(state, 'viewOnlySub', data)
}


export {
    
};