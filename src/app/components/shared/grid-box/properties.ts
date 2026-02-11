export abstract class Properties<T extends BoxProperties> {
    
     properties:BoxProperties = null;
    
    setProperties(properties:BoxProperties):void {
        this.properties = properties;
    }
    
    getProperties():BoxProperties {
        return this.properties;        
    }

    // MA beforeSaveProperties is needed to ensure that all properties are updated
    // chart properties, for example, can't be updated while user is working on chart
    // and we need to ensure that it is up-to-date before saving
    beforeSaveProperties() {}
    
    protected get p():BoxProperties {
        if(!this.properties){
            this.properties = <BoxProperties>{};
        }
        return this.properties;        
    }
        
}

export interface BoxProperties {
}

