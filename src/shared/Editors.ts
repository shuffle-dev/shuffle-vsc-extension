export type EditorType = {
    id: string,
    name: string,
    url: string,
};

export class Editors {
    static readonly TAILWIND: EditorType = {
        id: 'tailwind',
        name: 'Tailwind Builder',
        url: 'https://tailwind.build/components/js/1453_components.js?v=mn20'
    };

    static readonly BOOTSTRAP: EditorType = {
        id: 'bootstrap',
        name: 'Bootstrap Shuffle',
        url: 'https://bootstrapshuffle.com/components/js/ba7b_components.js?v=mn20'
    };

    static readonly BULMA: EditorType = {
        id: 'bulma',
        name: 'Bulma Builder',
        url: 'https://tailwind.build/components/js/27db_components.js?v=bulma-mn20'
    };

    static readonly MATERIAL: EditorType = {
        id: 'material-ui',
        name: 'Material-UI Builder',
        url: 'https://tailwind.build/components/js/27db_components.js?v=mui-n20'
    };

    static getEditors = (): EditorType[] => {
        return [Editors.TAILWIND, Editors.BOOTSTRAP, Editors.BULMA, Editors.MATERIAL];
    };

    static getEditor = (id: string): EditorType | undefined => {
        return Editors.getEditors().find(item => id === item.id);
    };

    static getDefault = (): EditorType => Editors.TAILWIND;
}
