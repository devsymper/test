<template>
    <div >
        <input v-model="content" type="text">
        <v-btn @click="postMessage">SendMessage</v-btn>
    </div>
</template>

<script>

import {sendMessage} from './worker-api'

export default {
    data() {
        return { 
            content: "aa" ,
            myWorker: null,
            myWorker1: null,
        };
    },
    methods:{
        postMessage(){
            sendMessage(this.content);
            // this.myWorker.postMessage('message1', [this.content,"Hello"])
            // .then(result => {
            //     console.log(result)
            // });

            // this.myWorker1.postMessage('message2')
            // .then(result => {
            // console.log(result)
            // })
        }
    },
    mounted() {
        let self = this;
        this.myWorker = this.$worker.create([
            {message: 'message1', func: (arg,xxx) =>{
                   for (let i = 1; i < 100; i++) {
                   console.log("worker1 ",i);
                } 
                return "success worker1"
            }},
        ])

        this.myWorker1 = this.$worker.create([
            {message: 'message2', func: () =>{
                for (let i = 0; i < 100; i++) {
                   console.log("worker2 ",i);
                }
                return "success worker2"
            }}
        ])
    }
};
</script>