import {Injectable} from '@angular/core';
// import {Interval, IntervalType, BaseIntervalType} from 'tc-web-chart-lib';
import {StateKey, WorkspaceStateService} from '../../state';

const remove = require('lodash/remove');

@Injectable()
export class IntervalService {

    constructor(private stateService: WorkspaceStateService) {}

    // public getBuiltInIntervals(): Interval[] {
    //     return Interval.getIntervals();
    // }
    //
    // public getUserDefinedIntervals(): Interval[] {
    //     let customIntervals: Interval[] = [];
    //     if (this.stateService.has(StateKey.CustomIntervals)) {
    //         customIntervals = this.stateService.get(StateKey.CustomIntervals) as Interval[];
    //     }
    //     return customIntervals;
    // }
    //
    // public getIntervalByBaseType(intervalType: IntervalType, baseInterval: BaseIntervalType, repeat: number): Interval {
    //     if(intervalType == IntervalType.Custom) {
    //         return this.getUserDefinedIntervals().find(interval => interval.base == baseInterval && interval.repeat == repeat);
    //     }
    //     return Interval.getIntervalByType(intervalType);
    // }
    //
    // public getAllIntervals(): Interval[] {
    //     return this.getBuiltInIntervals().concat(this.getUserDefinedIntervals());
    // }
    //
    // public getSortedAllIntervalsByBase(baseInterval:BaseIntervalType):Interval[] {
    //     let result:Interval[] =  this.getAllIntervals().filter((interval: Interval) => interval.base == baseInterval);
    //     return result.sort((a, b) => a.repeat <= b.repeat ? -1 : 1);
    // }
    //
    // public addCustomInterval(customInterval: Interval): void {
    //     if(!this.stateService.has(StateKey.CustomIntervals)) {
    //         let intervals :Interval[] = [];
    //         intervals.push(customInterval);
    //         this.stateService.set(StateKey.CustomIntervals, intervals);
    //     } else {
    //         this.getUserDefinedIntervals().push(customInterval);
    //         this.save();
    //     }
    // }
    //
    // public remove(interval: Interval): void {
    //     remove(this.getUserDefinedIntervals(), (i: Interval) => i.base === interval.base && i.repeat === interval.repeat);
    //     this.save();
    // }

    // private save(): void {
    //     this.stateService.set(StateKey.CustomIntervals, this.getUserDefinedIntervals());
    // }
}
