//全局注册自定义组件

import primaryTableComponents from './table/primaryTable.vue'
import editTableComponents from './table/editTable.vue'
import treeGrid from './table/treeGrid.vue'
import urlTable from './table/urlTable.vue'
import InputTree from './InputTree.vue'
import treeSelect from './treeSelect/treeSelect'
const myComponent={
    install:function(Vue){
        Vue.component('primaryTable',primaryTableComponents);
        Vue.component('editTable',editTableComponents);
        Vue.component('treeGrid',treeGrid);
        Vue.component('urlTable',urlTable);
        Vue.component('InputTree',InputTree);
        Vue.component('treeSelect',treeSelect);
        
    }
}
export default myComponent
    
