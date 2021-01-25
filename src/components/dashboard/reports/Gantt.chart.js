import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'
export default class Gantt extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group4.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group4.styleKeys
        super('gantt', symperId, columnSettingKeys, styleKeys);
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        debugger
        console.log("raw",rawConfig,"dâta",data,"extra",extraData);
        // data.data = [{"Task id":"p1","Task name":"Parent 1","Parent":"","Milestone":null,"Dependency":"","Progress":null,"Duration":null,"End date":null,"Start date":null,"Assignee":""},{"Task id":"1","Task name":"Scope","Parent":"p1","Milestone":"1","Dependency":"","Progress":"0.85","Duration":"4","End date":null,"Start date":"2017-11-28","Assignee":"AnhNT"},{"Task id":"2","Task name":"Analysis","Parent":"p1","Milestone":null,"Dependency":"1","Progress":"1","Duration":"5","End date":null,"Start date":"2017-12-03","Assignee":"AnhNT"},{"Task id":"3","Task name":"Software Requirements","Parent":"p1","Milestone":"1","Dependency":"2","Progress":"0.48188689346735","Duration":"10","End date":null,"Start date":"2017-12-08","Assignee":"AnhNT"},{"Task id":"4","Task name":"Design","Parent":"p1","Milestone":"1","Dependency":"2","Progress":"1","Duration":"5","End date":null,"Start date":"2017-12-21","Assignee":"Dungna"},{"Task id":"5","Task name":"Development","Parent":"p1","Milestone":"0","Dependency":"3","Progress":"0.89696686048316","Duration":"21","End date":null,"Start date":"2018-01-09","Assignee":"Dungna"},{"Task id":"p2","Task name":"Parent 2","Parent":"","Milestone":null,"Dependency":"","Progress":null,"Duration":null,"End date":null,"Start date":null,"Assignee":""},{"Task id":"6","Task name":"Functional testing","Parent":"p2","Milestone":"0","Dependency":"4","Progress":"1","Duration":"15","End date":null,"Start date":"2018-01-09","Assignee":"Dungna"},{"Task id":"7","Task name":"E2E Testing","Parent":"p2","Milestone":"0","Dependency":"5","Progress":"0.68858380310662","Duration":"10","End date":null,"Start date":"2018-01-21","Assignee":"Dungna"},{"Task id":"8","Task name":"Stablization","Parent":"p2","Milestone":"0","Dependency":"6","Progress":"0.41639462287634","Duration":"7","End date":null,"Start date":"2018-01-26","Assignee":"aKha"},{"Task id":"9","Task name":"Training","Parent":"p2","Milestone":null,"Dependency":"6","Progress":"0","Duration":"10","End date":null,"Start date":"2018-02-09","Assignee":"aKha"},{"Task id":"10","Task name":"Documentation","Parent":"p2","Milestone":null,"Dependency":"8","Progress":"0","Duration":"10","End date":null,"Start date":"2018-01-27","Assignee":"aKha"},{"Task id":"11","Task name":"Pilot","Parent":"p2","Milestone":null,"Dependency":"9","Progress":"0","Duration":"15","End date":null,"Start date":"2018-02-19","Assignee":"aKha"},{"Task id":"12","Task name":"Deployment","Parent":"p2","Milestone":null,"Dependency":"9","Progress":"0","Duration":"5","End date":null,"Start date":"2018-02-25","Assignee":"aKha"},{"Task id":"13","Task name":"Post Implementation Review","Parent":"p2","Milestone":null,"Dependency":"9","Progress":"0","Duration":"3","End date":null,"Start date":"2018-03-06","Assignee":"aKha"}];
        displayOptions = TranslatorHelper.Charts.ganttChart(rawConfig,data,displayOptions,extraData,"ganttChart",undefined,1);
        console.log("ganttOption",displayOptions);
        return displayOptions;

    }
}