class CustomSelect {
    constructor(selectors) {
        this._selectors = document.querySelectorAll(selectors);

        if (!selectors[0]) return;

        this._selectors.forEach(select => {
            const defaultSelect = select.querySelector('select');

            this._setBaseStyle(select, defaultSelect);
            this._createList(select, defaultSelect);
        });
    }

    _setBaseStyle(select, defaultSelect) {
        select.style.cssText = `
            position: relative;
        `;

        defaultSelect.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            pointer-events: none;
        `;
    }

    _setDefaultStyleUl(ul) {
        ul.style.cssText = `
            list-style: none;
            margin: 0;
            padding: 0;
            left: 0;
            top: calc(100% + 1px);
            width: 100%;
            overflow-y: auto;
            position: absolute;
            z-index: 2;
            background-color: #ffffff;
        `;
    }

    _setDefaultStyleLi(li) {
        li.style.cssText = `
            cursor: pointer;
        `;
    }
    
    _setDefaultStyleDiv(div) {
        div.style.cssText = `
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            cursor: pointer;
            user-select: none;
        `;
    }

    _setTextOnItem(li, option, select) {
        const isHaveMerge = select.dataset.selectMerge ? select.dataset.selectMerge : false;
        let mergeIndex = isHaveMerge !== undefined ? isHaveMerge : false;

        if (mergeIndex) {
            let contentText = option.textContent.split(' ');
            let currentText = contentText[mergeIndex];

            let span = document.createElement('span');
            let span2 = document.createElement('span');

            span.textContent = currentText;
            span2.textContent = contentText.splice(1).join(' ');

            li.append(span);
            li.append(span2);
        } else {
            li.textContent = option.textContent;
        }
    }

    _setSelectValue(evt, defaultSelect, customSelect, currentItem) {
        const target = evt.currentTarget;
        const value = target.tagName === 'LI' ? target.dataset.value : target.value;

        defaultSelect.value = value;
        customSelect.dataset.baseValue = value;
        
        currentItem.textContent = value;
        customSelect.classList.toggle('show');
    }

    _createList(customSelect, defaultSelect) {
        const options = defaultSelect.querySelectorAll('option');
        const list = document.createElement('ul');
        const tempFragment = document.createDocumentFragment();
        const currentItem = document.createElement('div');

        list.classList.add('custom-select__list');
        currentItem.classList.add('custom-select__current');
        this._setDefaultStyleUl(list);
        this._setDefaultStyleDiv(currentItem);

        options.forEach((option) => {
            const attr = option.attributes;
            const li = document.createElement('li');
            li.setAttribute('data-value', attr.value.value);

            for (let attribute of attr) {
                if (attribute.name === 'value') continue;

                li.setAttribute(attribute.name, attribute.value);
            }

            li.classList.add('custom-select__item');
            this._setTextOnItem(li, option, customSelect);
            this._setDefaultStyleLi(li);
            tempFragment.append(li);

            li.addEventListener('click', (evt) => this._setSelectValue(evt, defaultSelect, customSelect, currentItem));
        });
        
        currentItem.textContent = options[0].value;
        customSelect.append(currentItem);
        list.append(tempFragment)
        customSelect.append(list);


        defaultSelect.addEventListener('change', (evt) => this._setSelectValue(evt, defaultSelect, customSelect, currentItem));
        document.addEventListener('click', (evt) => {
            const item = evt.target;

            if (item === currentItem) {
                customSelect.classList.toggle('show');
            } else {
                customSelect.classList.remove('show');
            }
        });
    }
}

new CustomSelect('.custom-select');