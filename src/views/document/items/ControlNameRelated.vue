<template>
    <v-dialog
        v-model="isShow"
        width="800"
        >
        <v-card
        height="550"
        style="overflow: hidden;"
        >
            <v-card-title class="headline">Kiểm tra control</v-card-title>
            <v-card-subtitle  class="s-subtitle-control">
                Các control có công thức liên quan đến control <span class="control-name">{{controlName}}</span>
            </v-card-subtitle>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
                <!-- <v-list-item dense v-for="(formulas, index) in listFormulas" :key="index+formulas">
                    <v-list-item-content>
                        <v-list-item-title>{{formulas}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> -->
                <v-data-table
                    :headers="headers"
                    :items="dataTable"
                    disable-pagination
                    fixed-header
                    hide-default-footer
                    dense
                    calculate-widths
                    no-data-text="Không tìm thấy dữ liệu"
                    >
                    <template v-slot:item.icon="{ item }">
                       <v-icon>
                           {{item.icon}}
                       </v-icon>
                    </template>
                    <template v-slot:item.source="{ item }">
                       <div>
                           <a style="text-decoration: none;" target="_blank" :href="item.source.link">{{ item.source.documentTitle }}</a>
                       </div>
                    </template>
                    <template v-slot:item.position="{ item }">
                       <div>
                           
                           <div>{{ item.position.fieldTitle }}</div>
                           <div style="    opacity: 0.5;">{{ item.position.fieldName }}</div>
                       </div>
                    </template>
                    
                    </v-data-table>
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            

            <v-btn
                color="green darken-1"
                text
                right
                @click="checkUpdateFormulas"
            >
                Cập nhật
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                right
                @click="hideDialog"
            >
                Đóng
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
    
</template>
<script>
import {formulasApi} from './../../../api/Formulas'
import {documentApi} from './../../../api/Document'
export default {
    computed:{
        sDocumentStore(){
            return this.$store.state.document.documentProps
        }
    },
    data(){
        return {
            isShow:false,
            listFormulas:[],
            controlName:"",
            newControlName:"",
            headers:  [
            { text: '', value: 'icon' , width:50},
            { text: 'Vị trí', value: 'position' },
            { text: 'Nguồn', value: 'source' },
            { text: 'Công thức', value: 'formulas' },
            ],
            dataTable: [],
            mapIcon:{field:'mdi-file-document-outline'},
            listFormulas:[]
        }
    },
   
    methods:{
        
        showDialog(){
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },
        getDataRelated(fieldName,newFieldName){
            let thisCpn = this;
            this.controlName = fieldName;
            this.newControlName = newFieldName;
            let dataPost = {fieldName:this.controlName,documentName:this.sDocumentStore.name.value};
            formulasApi.getRelated(dataPost).then(res=>{
                if(res.status == 200){
                    thisCpn.dataTable = []
                    let data = res.data;
                    if(data != false){
                        thisCpn.handleData(data)
                    }
                }
            }).always(() => {}).catch({});
        },
        handleData(data){
            let thisCpn = this;
            let listDocName = data.reduce((newArr,obj)=>{
                if(obj.context != null && obj.object_type == 'field'){
                    let o = {docName : obj.context,fieldName: obj.object_identifier}
                    newArr.push(o);
                }   
                return newArr;
                
            },[]);
            documentApi.getBatchFieldInfoInDoc({listObject:JSON.stringify(listDocName)}).then(res=>{
                if(res.status == 200){
                    let dataRes = res.data;
                    thisCpn.setDataTable(data,dataRes);
                    
                }
                else{
                    thisCpn.setDataTable(data);
                }
                
            }).always({}).catch({});
            
        },
        setDataTable(data,dataRes=[]){
             for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let curObj = dataRes.filter(c=>{
                    return c.documentname == element.context && c.fieldname == element.object_identifier;
                })
            
                if(curObj.length> 0){
                    Object.assign(data[index],curObj[0])
                }
                let icon = (this.mapIcon[data[index].object_type] != undefined) ? this.mapIcon[data[index].object_type] : "mdi-cog-outline"
                let item = {icon:icon,position:{fieldName:data[index].fieldname,fieldTitle:data[index].fieldtitle},
                    source:{documentTitle:data[index].documenttitle,documentName:data[index].documentname, link: window.location.origin+"#/document/editor/"+ data[index].id},
                    formulas:data[index].last_content
                }
                let itemFormulas = {}
                let id = data[index].id;
                itemFormulas[id] = data[index].last_content
                this.listFormulas.push(itemFormulas);
                this.dataTable.push(item);
            }
            console.log(this.dataTable);
        },
        checkUpdateFormulas(){
            console.log(this.listFormulas);
            let dataUpdate = {};
            for (let index = 0; index < this.listFormulas.length; index++) {
                const element = this.listFormulas[index];
                let id = Object.keys(element)[0];
                let f = Object.values(element)[0];
                let newFormulas = this.detectControlChangeInFormulas(f);
                console.log(newFormulas);
                dataUpdate['s-'+index] = [{"data":{syql:newFormulas,id:id}}]
                
                
            }
            console.log(dataUpdate);
            formulasApi.updateMultiFormulas(JSON.stringify(dataUpdate)).then(res=>{

            }).always({}).catch({})
            
        },
        detectControlChangeInFormulas(formulas){
            let regex = new RegExp("\\b(?:"+this.controlName+")\\b","gm");
            let newFormulas = formulas.replace(regex,this.newControlName);
            return newFormulas;
        }
        
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    .s-subtitle-control .control-name{
        font-weight: 600;
        
    }
    .s-subtitle-control{
        font-size: 13px;
        padding: 14px 0px 0px 24px !important;
    }
    .headline{
        padding: 8px 0px 0px 24px !important;
    }
</style>