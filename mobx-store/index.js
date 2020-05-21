import { action, computed, observable } from "mobx";


class initStore {
    @observable deneme = "asd";
    
    
    @action change(dat){
        this.deneme = dat
    }
    
}

const store = new initStore()

if(process.client){
    store.change(localStorage.getItem("asd"))
}

export default store;