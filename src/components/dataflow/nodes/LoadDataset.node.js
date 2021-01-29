import NodeBase from './NodeBase'

export default class LoadDataset extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            
        };
        super(symperId, 'Load', defaultConfig);
    }
}