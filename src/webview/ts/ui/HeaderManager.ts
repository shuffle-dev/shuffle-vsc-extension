import StateService from '../state/StateService';

export default class HeaderManager {
    private readonly _buildersContainer: HTMLDivElement | null;
    private readonly _apiEmailInput: HTMLInputElement | null;
    private readonly _apiKeyInput: HTMLInputElement | null;
    private readonly _apiSaveButton: HTMLButtonElement | null;

    private _stateService: StateService;

    constructor(configService: StateService) {
        this._stateService = configService;
        this._buildersContainer = document.querySelector<HTMLDivElement>('#buildersContainer');
        this._apiEmailInput = document.querySelector<HTMLInputElement>('#apiEmailInput');
        this._apiKeyInput = document.querySelector<HTMLInputElement>('#apiKeyInput');
        this._apiSaveButton = document.querySelector<HTMLButtonElement>('#apiSaveButton');

        this._setCurrentBuilderActive();
    };

    public bindEvents = () => {
        this._buildersContainer?.addEventListener('click', this._handleBuilderChange);
        this._apiSaveButton?.addEventListener('click', this._handleFetchButtonClick);
    };

    private _handleBuilderChange = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button[data-id]');

        if (button === null) {
            return;
        }

        const builderId = button.getAttribute('data-id');
        if (builderId === null) {
            return;
        }

        this._stateService.changeBuilder(builderId);
        this._stateService.fetchConfig();
        this._setCurrentBuilderActive();
    };

    private _setCurrentBuilderActive = () => {
      const builders = this._buildersContainer?.querySelectorAll('button[data-id]');

      if(!builders) {
          return;
      }

      builders.forEach(item => item.classList.remove('active'));

      const builder = this._stateService.getBuilder();

      Array.from(builders)
          .find(item => item.getAttribute('data-id') === builder.id)
          ?.classList.add('active');
    };

    private _handleFetchButtonClick = () => {
        const apiKey = this._apiKeyInput?.value;

        if (apiKey === undefined) {
            return;
        }

        this._stateService.changeApiKey(apiKey);
        this._stateService.fetchConfig();
    };
}
