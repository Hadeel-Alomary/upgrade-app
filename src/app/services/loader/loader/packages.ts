import {PackageType} from './loader.service';

export class Packages {

    static packages: Packages[] = [];

    constructor(public type: PackageType, public arabic: string, public english: string) {

    }

    public static getPackage(type: string): Packages {
        return Packages.getPackages().find(packageType => packageType.type == type)
    }

    public static getPackages(): Packages[]{
        if(!Packages.packages.length) {
            Packages.packages.push(new Packages(PackageType.Professional, 'احترافي', 'Professional'));
            Packages.packages.push(new Packages(PackageType.Advanced, 'متقدم', 'Advanced'));
            Packages.packages.push(new Packages(PackageType.Basic, 'أساسي', 'Basic'));
            Packages.packages.push(new Packages(PackageType.DerayahBasic, 'دراية أساسي', 'Derayah Basic'));
            Packages.packages.push(new Packages(PackageType.Plus, 'بلس', 'Plus'));
            Packages.packages.push(new Packages(PackageType.Free, 'مجاني', 'Free'));
            Packages.packages.push(new Packages(PackageType.Lite, 'لايت', 'Lite'));
        }

        return Packages.packages
    }

}
