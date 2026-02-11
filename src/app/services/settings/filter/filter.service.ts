import{Injectable} from '@angular/core';
import {WorkspaceStateService, StateKey} from '../../state/index';
import {Filter} from './filter';
import {FilterSerializer} from './filter-serializer';
import {BuiltinFilterFactory} from './builtin-filter-factory';
import {StringUtils, AppTcTracker} from "../../../utils/index";
import {Loader} from '../../loader/loader';

const remove = require("lodash/remove");

@Injectable()
export class FilterService{

    private userDefinedFilters:Filter[] = [];
    private builtinFilters:Filter[] = [];

    constructor(private stateService:WorkspaceStateService, private loader: Loader){
        this.builtinFilters = BuiltinFilterFactory.create();
        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if (loadingDone) {
                if (this.stateService.has(StateKey.Filter)) {
                    this.userDefinedFilters = (this.stateService.get(StateKey.Filter) as string[]).map(
                        (jsonFilter: string) => FilterSerializer.fromJson(jsonFilter));
                }
            }
        })
    }

    /* check filter */
    isDeleted(id:string):boolean {
        return this.get(id) == null;
    }

    /* get filter */

    get(id:string):Filter {
        let filter:Filter = this.getUserDefined(id);
        if(filter == null) {
            filter = this.getBuiltin(id);
        }
        return filter;
    }

    getUserDefined(id:string):Filter {
        return this.userDefinedFilters.find(filter => filter.id == id);
    }

    getBuiltin(id:string):Filter {
        return this.builtinFilters.find(filter => filter.id == id);
    }

    getUserDefinedFilters(){
        return this.userDefinedFilters;
    }

    getBuiltinFilters(){
        return this.builtinFilters;
    }

    getDefaultFilter():Filter {
        return this.builtinFilters[0];
    }

    /* save */

    save(){
        let jsonFilters:string[] = this.userDefinedFilters.map(filter => FilterSerializer.toJson(filter));
        this.stateService.set(StateKey.Filter, jsonFilters);
    }


    /* create */

    createEmptyFilter(name:string) {
        AppTcTracker.trackCreateFilter();
        let filter:Filter = new Filter(name, StringUtils.guid(), false, null);
        this.userDefinedFilters.push(filter);
        this.save();
        return filter;
    }

    /* remove */

    remove(filter:Filter) {
        AppTcTracker.trackDeleteFilter();
        remove(this.userDefinedFilters, (w: Filter) => w === filter);
    }

}
