
let textAgg = {
    not_agg:{
        name:"Don't Aggreate",
        icon:""
    },
    count_dist:{
        name:'Count (Distinct)',
        icon:'',
    },
    count:{
        name:'Count',
        icon:'',
    },
    last:{
        name:'Last',
        icon:'',
    },
    first:{
        name:'First',
        icon:'',
    }
}

let numberAgg = {
        not_agg:{
            name:"Don't Aggreate",
            icon:""
        },
        count_dist:{
            name:'Count (Distinct)',
            icon:'',
        },
        count:{
            name:'Count',
            icon:'',
        },
        avg:{
            name:'Average',
            icon:'',
        },
        sum:{
            name:'Sum',
            icon:'',
        },
        max:{
            name:'Maximun',
            icon:'',
        },
        min:{
            name:'Minimun',
            icon:'',
        }
    };

let settingTplAgg = {
    text:textAgg,
    date:textAgg,
    datetime:textAgg,
    time:textAgg,
    number:numberAgg
};
export default settingTplAgg;