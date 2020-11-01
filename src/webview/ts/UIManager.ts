import ConfigService, {Config} from './ConfigService';
import getVscApi from "./utils/getVscApi";

export default class UIManager {
    private readonly _selectContainer: HTMLDivElement | null;
    private _select: HTMLSelectElement | null = null;
    private readonly _componentsContainer: HTMLDivElement | null;
    private _configService: ConfigService;

    constructor(configService: ConfigService) {
        this._configService = configService;
        this._selectContainer = document.querySelector<HTMLDivElement>('.select-container');
        this._componentsContainer = document.querySelector<HTMLDivElement>('.components-container');
        this._componentsContainer?.addEventListener('click', this._handleComponentClick);
    }

    createStructure = (config: Config) => {
        this._createSelect(config);
        this._createComponents(config);
    };

    private _createSelect = (config: Config) => {
        this._clearSelect();
        this._select = document.createElement('select');
        this._select.addEventListener('change', this._handleSelectChange);
        this._createSelectOptions(config);
        this._selectContainer?.appendChild(this._select);
    };

    private _createSelectOptions = (config: Config) => {
        Object.keys(config.data).forEach((category) => {
            const option = document.createElement('option');
            option.setAttribute('value', category);
            option.innerText = category;
            const currentCategory = this._configService.getCurrentCategory();
            if (category === currentCategory) {
                option.selected = true;
            }

            this._select?.appendChild(option);
        });
    };

    private _handleSelectChange = (e: Event) => {
        const category = (e.target as HTMLInputElement).value;
        this._configService.changeCategory(category);
    };

    private _createComponents = (config: Config) => {
        this._clearComponents();

        config.data[config.category].map((component) => {
            const elem = document.createElement('img');
            elem.setAttribute('src', `https://tailwind.build/${component.preview}`);
            elem.setAttribute('data-id', component.id);

            this._componentsContainer?.appendChild(elem);
        });
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
        const component = this._configService.getComponent(id);
        if (component === null) {
            return;
        }

        getVscApi().postMessage({
           type: 'source:req',
           data: component.html
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
}
