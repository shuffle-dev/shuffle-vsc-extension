(function() {
    const MessageManager = {
        _listeners: [],

        init: () => {
            window.addEventListener('message', (event) => {
                const message = event.data;
                MessageManager._listeners.forEach((listener) => {
                    if (listener.type === message.type) {
                        listener.fun(message);
                    }
                });
            });
        },

        addListener: (type, fun) => {
            MessageManager._listeners.push({
                type,
                fun
            });
        }
    };

    const Config = {
        _config: null,
        _listeners: [],

        setConfig: () => {
            if (!Config._isAlreadyFetched()) {
                Config._reqForConfig();
                return;
            }

            const config = vscApi.getState();
            Config._setConfig(config);
        },

        addListener: (fun) => {
            Config._listeners.push(fun);
        },

        receiveConfig: (message) => {
            const data = message.data;
            const category = Object.keys(data)[0];
            const configObj = {
                category: category,
                data: data
            };
            vscApi.setState(configObj);
            Config._setConfig(configObj);
        },

        changeCategory: (category) => {
            const data = Config._config.data;
            const configObj = {
                category,
                data
            };
            vscApi.setState(configObj);
            Config._setConfig(configObj);
        },

        getSourceCode: (id, category) => {
            const findingCategory = category == null ? Config.getCurrentCategory() : category;
            return Config._config.data[findingCategory].find((elem) => elem.id === id).html;
        },

        getCurrentCategory: () => {
            return Config._config.category;
        },

        _isAlreadyFetched: () => {
            return vscApi.getState() != null;
        },

        _triggerListeners: () => {
            Config._listeners.map(fun => fun(Config._config));
        },

        _setConfig(jsonConfig) {
            Config._config = jsonConfig;
            Config._triggerListeners();
        },

        _reqForConfig: () => {
            vscApi.postMessage({
                type: 'config:req'
            });
        }
    };

    const UIManager = {
        _selectContainer: null,
        _select: null,
        _componentsContainer: null,
        _components: null,

        init: () => {
            UIManager._selectContainer = document.querySelector('.select-container');
            UIManager._componentsContainer = document.querySelector('.components-container');
            UIManager._componentsContainer.addEventListener('click', UIManager._handleComponentClick);
        },

        createStructure: (config) => {
            UIManager._createSelect(config);
            UIManager._createComponents(config);
        },

        _createSelect: (config) => {
            UIManager._clearSelect();
            UIManager._select = document.createElement('select');
            UIManager._select.addEventListener('change', UIManager._handleSelectChange);
            UIManager._createSelectOptions(config);
            UIManager._selectContainer.appendChild(UIManager._select);
        },

        _createSelectOptions: (config) => {
            Object.keys(config.data).forEach((category) => {
                const option = document.createElement('option');
                option.setAttribute('value', category);
                option.innerText = category;
                const currentCategory = Config.getCurrentCategory();
                if (category === currentCategory) {
                    option.selected = true;
                }

                UIManager._select.appendChild(option);
            });
        },

        _handleSelectChange: (e) => {
            const category = e.target.value;
            Config.changeCategory(category);
        },

        _createComponents: (config) => {
            UIManager._clearComponents();

            config.data[config.category].map((component) => {
                const elem = document.createElement('img');
                elem.setAttribute('src', `https://tailwind.build/${component.preview}`);
                elem.setAttribute('data-id', component.id);

                UIManager._componentsContainer.appendChild(elem);
            });
        },

        _handleComponentClick: (e) => {
            if(e.target.tagName.toUpperCase() !== 'IMG') {
                return;
            }

            const id = e.target.getAttribute('data-id');
            const sourceCode = Config.getSourceCode(id);

            vscApi.postMessage({
                type: 'source:req',
                data: sourceCode
            });
        },

        _clearSelect: () => {
            UIManager._selectContainer.innerHTML = '';
        },

        _clearComponents: () => {
            UIManager._componentsContainer.innerHTML = '';
        },

    };

    MessageManager.init();
    UIManager.init();

    Config.addListener(UIManager.createStructure);
    Config.setConfig();

    MessageManager.addListener('config:res', Config.receiveConfig);
}());




