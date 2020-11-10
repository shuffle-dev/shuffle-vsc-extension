import StateService from "../StateService";

export default class HeaderManager {
    private readonly _buildersContainer: HTMLDivElement | null;
    private readonly _keyInput: HTMLInputElement | null;
    private readonly _keyButton: HTMLButtonElement | null;

    private _stateService: StateService;

    constructor(configService: StateService) {
        this._stateService = configService;
        this._buildersContainer = document.querySelector<HTMLDivElement>('#buildersContainer');
        this._keyInput = document.querySelector<HTMLInputElement>('#keyInput');
        this._keyButton = document.querySelector<HTMLButtonElement>('#keyButton');
    };

    public bindEvents = () => {
        this._buildersContainer?.addEventListener('click', this._handleBuilderChange);
        this._keyButton?.addEventListener('click', this._handleFetchButtonClick);
    };

    private _handleBuilderChange = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest("button[data-key]");
        if(button === null) {
            return;
        }

        const key = button.getAttribute('data-key');
        if(key === null) {
            return;
        }
        this._stateService.changeBuilder(key);
        this._stateService.fetchConfig();
    };

    private _handleFetchButtonClick = () => {
        const key = this._keyInput?.value;
        if (key === undefined) {
            return;
        }

        this._stateService.changeKey(key);
        this._stateService.fetchConfig();
    };
}
