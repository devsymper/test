import {environmentManagementApi} from '@/api/EnvironmentManagement'

const getAllEnvirontment = (context) => {
    if (context.state.allEnvironment.length == 0) {
        try {
			environmentManagementApi.getAllEnvironment().then(res=>{
				if (res.status == 200) {
					context.commit('setAllEnvironment', res.data.listObject);
				} else {
					SYMPER_APP.$snotifyError(error, "Can not get all node style!");
				}
			}).catch(err=>{

			})
           
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all node style !");
        }
    }
}

export { 
	getAllEnvirontment
};