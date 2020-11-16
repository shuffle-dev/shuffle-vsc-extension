import StateService from '../state/StateService';
import VscApi from '../utils/VscApi';
import { Messages, ComponentCodeRequestMessage } from '../../../shared/Messages';

export default class ComponentsManager {
    private readonly _categoryContainer: HTMLDivElement | null;
    private readonly _componentsContainer: HTMLDivElement | null;

    private _stateService: StateService;

    constructor(stateService: StateService) {
        this._stateService = stateService;
        this._categoryContainer = document.querySelector<HTMLDivElement>('#categoryContainer');
        this._componentsContainer = document.querySelector<HTMLDivElement>('#componentsContainer');
    };

    public bindEvents = () => {
        this._componentsContainer?.addEventListener('click', this._handleComponentClick);
    };

    public createStructure = () => {
        this._createCategorySelect();
        this._createComponents();
    };

    private _createCategorySelect = () => {
        this._clearCategorySelect();

        const select = document.createElement('select');

        const currentCategory = this._stateService.getCategory();
        const categories = this._stateService.getCategories();

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.setAttribute('value', category);
            option.innerText = category;

            if (category === currentCategory) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        select.addEventListener('change', this._handleCategoryChange);
        this._categoryContainer?.appendChild(select);
    };

    private _createComponents = () => {
        this._clearComponents();

        const components = this._stateService.getComponents();

        components.map((component) => {
            const wrapper = document.createElement('a');
            wrapper.classList.add('component-wrapper');

            if (component.code) {
                wrapper.href = '#';
            } else {
                wrapper.href = 'https://tailwind.build';
                wrapper.target = '_blank';

                const needsPro = document.createElement('div');
                needsPro.classList.add('needs-pro');
                wrapper.appendChild(needsPro);
            }

            const preview = document.createElement('img');
            preview.setAttribute('src', `${component.preview}`);
            preview.classList.add('component-img');

            if (component.code) {
                preview.setAttribute('data-id', component.id);
            }

            wrapper.appendChild(preview);
            this._componentsContainer?.appendChild(wrapper);
        });
    };

    private _clearCategorySelect = () => {
        if(this._categoryContainer !== null) {
            this._categoryContainer.innerHTML = '';
        }
    };

    private _clearComponents = () => {
        if(this._componentsContainer !== null) {
            this._componentsContainer.innerHTML = '';
        }
    };

    /**
     * Handle Events
     */
    private _handleCategoryChange = (e: Event) => {
        const category = (e.target as HTMLInputElement).value;
        this._stateService.changeCategory(category);
        this._createComponents();
    };

    private _handleComponentClick = (e: MouseEvent) => {
        const target = e.target as HTMLImageElement;
        const id = target.getAttribute('data-id');

        if (id === null) {
            return;
        }

        const component = this._stateService.getComponent(id);
        if (component === null) {
            return;
        }

        VscApi.postMessage({
            type: Messages.COMPONENT_CODE_REQUEST,
            data: component.code
        } as ComponentCodeRequestMessage);
    };

}
