export type BuilderType = {
    id: string,
    name: string,
    url: string,
};

export class Builders {
    static readonly TAILWIND: BuilderType = {
        id: 'tailwind',
        name: 'Tailwind Builder',
        url: 'https://tailwind.build/components/js/1453_components.js?v=mn20'
    };

    static readonly BOOTSTRAP: BuilderType = {
        id: 'bootstrap',
        name: 'Bootstrap Shuffle',
        url: 'https://bootstrapshuffle.com/components/js/ba7b_components.js?v=mn20'
    };

    static readonly BULMA: BuilderType = {
        id: 'bulma',
        name: 'Bulma Builder',
        url: 'https://tailwind.build/components/js/27db_components.js?v=bulma-mn20'
    };

    static readonly MATERIAL: BuilderType = {
        id: 'material-ui',
        name: 'Material-UI Builder',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mui-n20'
    };

    static getBuilders = (): BuilderType[] => {
        return [Builders.TAILWIND, Builders.BOOTSTRAP, Builders.BULMA, Builders.MATERIAL];
    };

    static getBuilder = (id: string): BuilderType | undefined => {
        return Builders.getBuilders().find(item => id === item.id);
    };

    static getDefault = (): BuilderType => Builders.TAILWIND;
}
