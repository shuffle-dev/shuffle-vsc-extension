import StateService from "../StateService";
import VscApi from "../utils/VscApi";
import { Messages, SourceReqMessage } from "../../../shared/Messages";

export default class ComponentsManager {
    private readonly _selectContainer: HTMLDivElement | null;
    private readonly _componentsContainer: HTMLDivElement | null;

    private _stateService: StateService;

    constructor(configService: StateService) {
        this._stateService = configService;
        this._selectContainer = document.querySelector<HTMLDivElement>('#selectContainer');
        this._componentsContainer = document.querySelector<HTMLDivElement>('#componentsContainer');
    };

    public bindEvents = () => {
        this._componentsContainer?.addEventListener('click', this._handleComponentClick);
    };

    public createStructure = () => {
        this._createSelect();
        this._createComponents();
    };

    private _createSelect = () => {
        this._clearSelect();
        const select = document.createElement('select');
        select.addEventListener('change', this._handleSelectChange);
        this._createSelectOptions(select);
        this._selectContainer?.appendChild(select);
    };

    private _createSelectOptions = (select: HTMLSelectElement) => {
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
    };

    private _handleSelectChange = (e: Event) => {
        const category = (e.target as HTMLInputElement).value;
        this._stateService.changeCategory(category);
        this._createComponents();
    };

    private _createComponents = () => {
        this._clearComponents();

        const components = this._stateService.getComponents();
        components.map((component) => {
            const elem = document.createElement('img');
            elem.setAttribute('src', `https://tailwind.build/${component.preview}`);
            elem.setAttribute('data-id', component.id);

            this._componentsContainer?.appendChild(elem);
        });
    };

    private _clearSelect = () => {
        if(this._selectContainer !== null) {
            this._selectContainer.innerHTML = '';
        }
    };

    private _clearComponents = () => {
        if(this._componentsContainer !== null) {
            this._componentsContainer.innerHTML = '';
        }
    };

    private _handleComponentClick = (e: MouseEvent) => {
        const target = e.target as HTMLImageElement;
        if(target.tagName.toUpperCase() !== 'IMG') {
            return;
        }

        const id = target.getAttribute('data-id');
        if(id === null) {
            return;
        }
        const component = this._stateService.getComponent(id);
        if (component === null) {
            return;
        }

        VscApi.postMessage({
            type: Messages.SOURCE_REQ,
            data: component.html
        } as SourceReqMessage);
    };
}
