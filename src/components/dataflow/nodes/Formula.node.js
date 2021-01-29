import NodeBase from './NodeBase'

export default class Formula extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            
        };
        super(symperId, 'Formula', defaultConfig);
    }
}