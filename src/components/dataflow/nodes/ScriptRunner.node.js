import NodeBase from './NodeBase'

export default class ScriptRunner extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            
        };
        super(symperId, 'Script', defaultConfig);
    }
}