export type BuilderType = {
    name: string,
    key: string,
    url: string,
};

export class Builders {
    static readonly TAILWIND: BuilderType = {
        name: 'Tailwind Builder',
        key: 'tailwind',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mn20'
    };
    static readonly BOOTSTRAP: BuilderType = {
        name: 'Bootstrap Shuffle',
        key: 'bootstrap',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mn20'
    };
    static readonly BULMA: BuilderType = {
        name: 'Bulma Builder',
        key: 'bulma',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mn20'
    };
    static readonly MATERIAL: BuilderType = {
        name: 'Material-UI Builder',
        key: 'material',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mn20'
    };

    static getBuilders = (): BuilderType[] => {
        return [Builders.TAILWIND, Builders.BOOTSTRAP, Builders.BULMA, Builders.MATERIAL];
    };

    static getBuilder = (key: string): BuilderType | undefined => {
        return Builders.getBuilders().find(item => key === item.key);
    };

    static getDefault = (): BuilderType => Builders.TAILWIND;
}
