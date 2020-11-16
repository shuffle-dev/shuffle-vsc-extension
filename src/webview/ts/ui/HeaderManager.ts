import StateService from '../state/StateService';
import VscApi from '../utils/VscApi';
import { Messages, ShowErrorMessage } from '../../../shared/Messages';

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
        this.updateInterface();
    };

    public bindEvents = () => {
        this._buildersContainer?.addEventListener('click', this._handleBuilderChange);
        this._apiSaveButton?.addEventListener('click', this._handleFetchButtonClick);
    };

    public updateInterface = () => {
        this._setCurrentBuilderActive();
        this._setCurrentApiSettings();
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

    private _handleFetchButtonClick = () => {
        const apiKey = this._apiKeyInput?.value;
        const apiEmail = this._apiEmailInput?.value;

        if (!apiKey || !apiEmail) {
            const message : ShowErrorMessage = {
                type: Messages.SHOW_ERROR,
                message: 'Please provide your e-mail and API key.',
            };

            VscApi.postMessage(message);
            return;
        }

        this._stateService.changeApiDetails(apiKey, apiEmail);
        this._stateService.fetchConfig();
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

    private _setCurrentApiSettings = () => {
        if (this._apiKeyInput) {
            const apiKey = this._stateService.getApiKey();
            this._apiKeyInput.value = apiKey;
        }

        if (this._apiEmailInput) {
            const apiEmail = this._stateService.getApiEmail();
            this._apiEmailInput.value = apiEmail;
        }
    };
}
