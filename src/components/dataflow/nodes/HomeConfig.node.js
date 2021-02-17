export default class HomeConfig  {
    name = "";
    description = "";
    variables = [];
    type = 'home';
    constructor(){}

    getVariables(){
        return this.variables.reduce((arr, el) => {
            if(el.name.trim()){
                el.name = el.name.trim();
                arr.push(el);
            }
            return arr;
        }, []);
    }
}