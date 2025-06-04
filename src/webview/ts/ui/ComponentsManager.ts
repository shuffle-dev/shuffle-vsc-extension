import StateService from '../state/StateService';
import VscApi from '../utils/VscApi';
import { Messages, ComponentCodeRequestMessage, ComponentsRequestMessage } from '../../../shared/Messages';

export default class ComponentsManager {
    private readonly _libraryContainer: HTMLDivElement | null;
    private readonly _categoryContainer: HTMLDivElement | null;
    private readonly _componentsContainer: HTMLDivElement | null;

    private _stateService: StateService;

    constructor(stateService: StateService) {
        this._stateService = stateService;
        this._libraryContainer = document.querySelector<HTMLDivElement>('#libraryContainer');
        this._categoryContainer = document.querySelector<HTMLDivElement>('#categoryContainer');
        this._componentsContainer = document.querySelector<HTMLDivElement>('#componentsContainer');
    };

    public bindEvents = () => {
        this._componentsContainer?.addEventListener('click', this._handleComponentClick);
    };

    public createStructure = () => {
        this._createLibrarySelect();
        this._createCategorySelect();
        this._createComponents();
    };

    private _createLibrarySelect = () => {
        this._clearLibrarySelect();

        const select = document.createElement('select');

        const activeEditor = this._stateService.getActiveEditor();
        const currentLibrary = this._stateService.getLibrary();

        if (activeEditor) {
            activeEditor.libraries.forEach((library, index) => {
                const option = document.createElement('option');
                option.setAttribute('value', library.name);
                option.innerText = library.name;
                option.selected = index === currentLibrary;
    
                select.appendChild(option);
            });
        }

        select.addEventListener('change', this._handleLibraryChange);
        this._libraryContainer?.appendChild(select);
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
            let wrapper; 

            if (component.code) {
                wrapper = document.createElement('div');
                wrapper.classList.add('component-wrapper');
            } else {
                wrapper = document.createElement('a');
                wrapper.classList.add('component-wrapper');
                wrapper.href = 'https://shuffle.dev/pricing?utm_source=vsc&utm_medium=extension';
                wrapper.target = '_blank';
            }

            const preview = document.createElement('img');
            preview.setAttribute('src', `${component.preview}`);
            preview.classList.add('component-img');

            if (component.code) {
                preview.setAttribute('data-id', component.id);
            }
 
            wrapper.appendChild(preview);

            if (!component.code) {
                const needsPro = document.createElement('div');
                needsPro.classList.add('needs-pro');
                wrapper.appendChild(needsPro);

                const message = document.createElement('div');
                message.classList.add('buy-license');
                message.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <span>Go to <b>https://shuffle.dev</b> and buy a&nbsp;license&nbsp;→</span>`;
                needsPro.appendChild(message);
            }


            this._componentsContainer?.appendChild(wrapper);
        });

        if (components.length > 0) {
            document.getElementById('howto-message')?.classList.remove('hidden');
        }
    };

    private _clearLibrarySelect = () => {
        if(this._libraryContainer !== null) {
            this._libraryContainer.innerHTML = '';
        }
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
    private _handleLibraryChange = (e: Event) => {
        const libraries = e.target as HTMLSelectElement;
        let selectedIndex = 0;
        for (let index = 0; index < libraries.options.length; index++) {
            if (libraries.options[index].innerText === libraries.value) {
                selectedIndex = index;
            }
        }
        
        this._stateService.changeLibrary(selectedIndex);
        this._stateService.fetchComponents();
    };

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

        const message : ComponentCodeRequestMessage = {
            type: Messages.COMPONENT_CODE_REQUEST,
            data: component.code
        };
 
        VscApi.postMessage(message);
    };
}
