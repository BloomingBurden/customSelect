const setBaseStyle = (select, defaultSelect) => {
    select.style.cssText = `
        position: relative;
    `;

    defaultSelect.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
    `
};

const setDefaultStyleUl = (ul) => {
    ul.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
        left: 0;
        top: calc(100% + 1px);
        width: 100%;
        max-height: 520px;
        overflow-y: auto;
        position: absolute;
        z-index: 2;
        background-color: #ffffff;
    `;
};

const setDefaultStyleLi = (li) => {
    li.style.cssText = `
        cursor: pointer;
    `;
};

const setDefaultStyleDiv = (div) => {
    div.style.cssText = `
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        cursor: pointer;
        user-select: none;
    `;
};

const setTextOnItem = (li, option, select) => {
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
};

const createList = (customSelect, defaultSelect) => {
    const options = defaultSelect.querySelectorAll('option');
    const list = document.createElement('ul');
    const tempFragment = document.createDocumentFragment();
    const currentItem = document.createElement('div');

    const setSelectValue = (evt) => {
        const target = evt.currentTarget;
        const value = target.tagName === 'LI' ? target.dataset.value : target.value;

        defaultSelect.value = value;
        customSelect.dataset.baseValue = value;
        
        currentItem.textContent = value;
        customSelect.classList.toggle('show');
    };

    list.classList.add('custom-select__list');
    currentItem.classList.add('custom-select__current');
    setDefaultStyleUl(list);
    setDefaultStyleDiv(currentItem);

    options.forEach((option, i) => {
        const attr = option.attributes;
        const li = document.createElement('li');
        li.setAttribute('data-value', attr.value.value);

        for (let attribute of attr) {
            if (attribute.name === 'value') continue;

            li.setAttribute(attribute.name, attribute.value);
        }

        li.classList.add('custom-select__item');
        setTextOnItem(li, option, customSelect);
        setDefaultStyleLi(li);
        tempFragment.append(li);

        li.addEventListener('click', setSelectValue);
    });
    
    currentItem.textContent = options[0].value;
    customSelect.append(currentItem);
    list.append(tempFragment)
    customSelect.append(list);


    defaultSelect.addEventListener('change', setSelectValue);
    document.addEventListener('click', (evt) => {
        const item = evt.target;

        if (item === currentItem) {
            customSelect.classList.toggle('show');
        } else {
            customSelect.classList.remove('show');
        }
    });
};

export const customSelect = () => {
    const selectors = document.querySelectorAll('.custom-select');

    if (!selectors[0]) return;

    selectors.forEach(select => {
        const defaultSelect = select.querySelector('select');

        setBaseStyle(select, defaultSelect);
        createList(select, defaultSelect);
    });
};