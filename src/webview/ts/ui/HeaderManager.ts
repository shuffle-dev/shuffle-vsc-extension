import StateService from '../state/StateService';

export default class HeaderManager {
    private readonly _buildersContainer: HTMLDivElement | null;
    private readonly _apiKeyInput: HTMLInputElement | null;
    private readonly _apiKeyButton: HTMLButtonElement | null;

    private _stateService: StateService;

    constructor(configService: StateService) {
        this._stateService = configService;
        this._buildersContainer = document.querySelector<HTMLDivElement>('#buildersContainer');
        this._apiKeyInput = document.querySelector<HTMLInputElement>('#apiKeyInput');
        this._apiKeyButton = document.querySelector<HTMLButtonElement>('#apiKeyButton');

        this._setCurrentBuilderActive();
    };

    public bindEvents = () => {
        this._buildersContainer?.addEventListener('click', this._handleBuilderChange);
        this._apiKeyButton?.addEventListener('click', this._handleFetchButtonClick);
    };

    private _handleBuilderChange = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button[data-key]');

        if (button === null) {
            return;
        }

        const key = button.getAttribute('data-key');
        if (key === null) {
            return;
        }

        this._stateService.changeBuilder(key);
        this._stateService.fetchConfig();
        this._setCurrentBuilderActive();
    };

    private _setCurrentBuilderActive = () => {
      const builders = this._buildersContainer?.querySelectorAll('button[data-key]');

      if(!builders) {
          return;
      }

      builders.forEach(item => item.classList.remove('active'));
      const builder = this._stateService.getBuilder();
      Array.from(builders)
          .find(item => item.getAttribute('data-key') === builder.key)
          ?.classList.add('active');
    };

    private _handleFetchButtonClick = () => {
        const key = this._apiKeyInput?.value;

        if (key === undefined) {
            return;
        }

        this._stateService.changeKey(key);
        this._stateService.fetchConfig();
    };
}
