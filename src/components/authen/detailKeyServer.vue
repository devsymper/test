<template>
    <div>
        <div class="fs-16 fw-430 pb-1">
            {{$t('authen.view.view_title')}}
        </div>
        <v-divider class="mb-3">
        </v-divider>
        <v-row v-for="(key,idx) in detailKey" :key="idx" >
            <v-col class="col-md-5 fs-13">
                 {{$t("authen.table."+idx)}}: 
            </v-col>
            <v-col class="col-md-7 fs-13">
                {{key}}
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
  created () {
        debugger
      let arr = Object.keys(this.detailKey);
      arr.pop();
      let detailKey = [];
      arr.map(a=>{
          detailKey.push({
              name:a,
              value:this.detailKey[a]
          })
      })
      debugger
      this.detailKey = detailKey
  },
  props: {
      detailKey:{
          type:Object,
          default:{}
      }
  },
    
}
</script>