import {ComponentsHelper} from './components/utils/components-helper.service';

export * from './components/modal';
export * from './components/dropdown';
export * from './components/typeahead';

export * from './components/position';
export * from './components/ng2-bootstrap-config';
export * from './components/utils/components-helper.service';

export const BS_VIEW_PROVIDERS: any[] = [{provide: ComponentsHelper, useClass:ComponentsHelper}];

