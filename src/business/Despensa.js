import { onConected, stringDate, stringDateDMA, stringDiffDate } from '../component/bibliotecas_functions'
import { onCreateDespensa, onGetDespensa, onAddUserShare, onUpdateItem, onDeleteDespensa} from '../Controller/controller-despensa'
export default class Despensa {

    constructor(_id, name, user, items, user_shareds, userUpdate, updatedAt) {
        this._id = _id;
        this.name = name;
        this.user = user
        this.items = items;
        this.user_shareds = user_shareds
        this.userUpdate = userUpdate
        this.updatedAt = updatedAt
    }

    get produtosOpen() {
        const t = this.items.filter(element => {
            if (element.status) {
                return element;
            }
        })
        return t
    }
    get onItemsValid (){
        let list = this.items.filter(element=>{
            if(element.quantidade > 0){
                return element
            }
        })
        return list
    }
    zerados() {
        var list = this.items.filter(element => {
            if (element.quantidade == 0) {
                return element;
            }
        })
        return list;
    }
    open() {
        var list = this.items.filter(element => {
            if (element.status && element.quantidade > 0) {
                return element;
            }
        })
        return list;
    }
    closed() {
        var list = this.items.filter(element => {
            if (!element.status && element.quantidade > 0) {
                return element;
            }
        })
        return list;
    }
    validade(){
        var list = this.items.filter(element => {
            const  diff = stringDiffDate(new Date(), element.validade)
            const vencido = new Date() > new Date(element.validade)
            if (diff.days <= 7 || vencido) {
                return element;
            }
        })
        return list;
    }
    async deleteDespensa(userId){
    return await onDeleteDespensa(this._id, userId)
    }
    deleteItem(id){
       this.items = this.items.filter(element => {
            if (element._id != id) {
                return element;
            }
        })
    }
    deleteUserShared(id) {
        let list = this.user_shareds.filter(element=>{
            console.log(element)
            if(element.user != id){
                return element;
            }
        })
        this.user_shareds = list;
    }
    async addShareUser(data) {
         this.user_shareds.push(data)
    }
    async onItemUpdate(data) {
        this.items = this.items.map(element=>element._id === data._id ? data : element)
    }

    filterCategoria(string){
        if(string == 'Geral'){
            return this.items
        }else{
            const list = this.items.filter(element=>{
                if(element.categoria == string){
                    return element
                }
            })
            return list;
        }
    }
}