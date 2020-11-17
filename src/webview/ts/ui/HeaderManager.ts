import StateService from '../state/StateService';
import VscApi from '../utils/VscApi';
import { Messages, ShuffleStateFetchMessage, ShowErrorMessage } from '../../../shared/Messages';

export default class HeaderManager {
    private readonly _editorsContainer: HTMLDivElement | null;
    private readonly _apiEmailInput: HTMLInputElement | null;
    private readonly _apiKeyInput: HTMLInputElement | null;
    private readonly _apiSaveButton: HTMLButtonElement | null;
    private readonly _toggleSettings: HTMLButtonElement | null;

    private _stateService: StateService;

    constructor(stateService: StateService) {
        this._stateService = stateService;
        this._editorsContainer = document.querySelector<HTMLDivElement>('#editorsContainer');
        this._apiEmailInput = document.querySelector<HTMLInputElement>('#apiEmailInput');
        this._apiKeyInput = document.querySelector<HTMLInputElement>('#apiKeyInput');
        this._apiSaveButton = document.querySelector<HTMLButtonElement>('#apiSaveButton');
        this._toggleSettings = document.querySelector<HTMLButtonElement>('#toggleSettings');
        this.updateInterface();
    };

    public bindEvents = () => {
        this._editorsContainer?.addEventListener('click', this._handleEditorChange);
        this._apiSaveButton?.addEventListener('click', this._handleFetchButtonClick);
        this._toggleSettings?.addEventListener('click', this._handleToggleSettings);
    };

    public updateInterface = () => {
        this._setActiveEditor();
        this._setApiSettings();
    };

    private _handleEditorChange = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button[data-id]');

        if (button === null) {
            return;
        }

        const editorId = button.getAttribute('data-id');
        if (editorId === null) {
            return;
        }

        this._stateService.changeEditor(editorId);
        this._stateService.fetchComponents();
        this._setActiveEditor();
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

        const message : ShuffleStateFetchMessage = {
            type: Messages.SHUFFLE_STATE_FETCH,
            apiKey,
            apiEmail
        };

        VscApi.postMessage(message);
    };

    private _handleToggleSettings = () => {
        const el = document.querySelector<HTMLDivElement>('#settings');
        if (!el) {
            return;
        }

        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    };

    /**
     * Update interface
     */
    private _setActiveEditor = () => {
        const editors = this._editorsContainer?.querySelectorAll('button[data-id]');
  
        if (!editors) {
            return;
        }
  
        editors.forEach(item => item.classList.remove('active'));
  
        const editor = this._stateService.getActiveEditor();
  
        if (editor) {
            Array.from(editors)
                .find(item => item.getAttribute('data-id') === editor.id)
                ?.classList.add('active');
        }
      };
  
      private _setApiSettings = () => {
          let apiKey : string;
          let apiEmail : string;

          if (this._apiKeyInput) {
              apiKey = this._stateService.getApiKey();
              this._apiKeyInput.value = apiKey;
          }
  
          if (this._apiEmailInput) {
              apiEmail = this._stateService.getApiEmail();
              this._apiEmailInput.value = apiEmail;
          }
 
          const mode = this._stateService.getMode();
          if (mode === 'demo') {
              document.querySelector<HTMLDivElement>('.demo').classList.remove('hidden');
              document.querySelector<HTMLDivElement>('.full').classList.add('hidden');
          } else {
              document.querySelector<HTMLDivElement>('.demo').classList.add('hidden');
              document.querySelector<HTMLDivElement>('.full').classList.remove('hidden');
          }

          if (mode === 'full' && apiEmail && apiKey) {
              document.querySelector<HTMLDivElement>('#settings').classList.add('hidden');
          }
      };
}
