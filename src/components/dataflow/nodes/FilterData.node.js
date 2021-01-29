import NodeBase from './NodeBase'

export default class FilterData extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            
        };
        super(symperId, 'Filter', defaultConfig);
    }
}