export class ArrayUtils {

    static values<T>(obj:{[key:string]: T} ):T[] {
        return Object.keys(obj).map(function(v) { return obj[v];})
    }
    
}
