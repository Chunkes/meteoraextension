// Функция для поиска элементов по XPath
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Функция для отображения суммы
function displaySum(sum, container) {
  let sumSpan = container.querySelector('.calculated-sum');
  if (!sumSpan) {
    sumSpan = document.createElement('span');
    sumSpan.className = 'calculated-sum';
    sumSpan.style.cssText = `
      color: #ffffff;
      font-size: 17px;
      font-weight: 600;
      margin-left: 10px;
    `;
    container.appendChild(sumSpan);
  }
  
  if (sum < 0) {
    sumSpan.textContent = `TOTAL: ($${Math.abs(sum).toFixed(2)})`;
  } else {
    sumSpan.textContent = `TOTAL: $${Math.abs(sum).toFixed(2)}`;
  }
}

// Функция для подсчета суммы
function calculateSum(element1, element2) {
  if (!element1 || !element2) return 0;
  
  const getValue = (el) => {
    const text = el.textContent.trim();
    const number = parseFloat(text.replace('$', '').replace('(', '').replace(')', ''));
    return text.includes('(') ? -number : number;
  };

  return getValue(element1) + getValue(element2);
}

// Функция обновления первой суммы
function updateSum1() {
  const xpath1 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/span';
  const xpath2 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[2]/div/div/div[2]/span';
  const containerXPath = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]';
  // Дополнительный контейнер для отображения суммы
  const additionalContainerXPath = '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div[2]';

  const el1 = getElementByXPath(xpath1);
  const el2 = getElementByXPath(xpath2);
  const container = getElementByXPath(containerXPath);
  const additionalContainer = getElementByXPath(additionalContainerXPath);

  if (el1 && el2) {
    const sum = calculateSum(el1, el2);
    if (container) {
      displaySum(sum, container);
    }
    if (additionalContainer) {
      displaySum(sum, additionalContainer);
    }
  }
}

// Функция обновления второй суммы
function updateSum2() {
  const xpath1 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/span';
  const xpath2 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[2]/div/div/div[2]/span';
  const containerXPath = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]';
  // Дополнительный контейнер для отображения суммы
  const additionalContainerXPath = '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[1]/div[2]/div[2]/div[2]';

  const el1 = getElementByXPath(xpath1);
  const el2 = getElementByXPath(xpath2);
  const container = getElementByXPath(containerXPath);
  const additionalContainer = getElementByXPath(additionalContainerXPath);

  if (el1 && el2) {
    const sum = calculateSum(el1, el2);
    if (container) {
      displaySum(sum, container);
    }
    if (additionalContainer) {
      displaySum(sum, additionalContainer);
    }
  }
}

// Функция обновления всех сумм
function updateAllSums() {
  updateSum1();
  updateSum2();
}

// Запускаем обновление сумм каждые 100мс
setInterval(updateAllSums, 100);

// Запускаем обновление сумм при загрузке страницы
window.addEventListener('load', updateAllSums);

// Наблюдаем за изменениями в DOM для сумм
const sumObserver = new MutationObserver(updateAllSums);
sumObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

// КНОПКИ: Функция для проверки нужной страницы
function isTargetPage() {
  // Проверяем URL или наличие определенных элементов на странице
  return window.location.href.includes('/transfer') || 
         document.querySelector('form') !== null;
}

// КНОПКИ: Функция для ожидания появления элементов
function waitForElements(maxAttempts = 50) {
  let attempts = 0;
  
  function checkElements() {
    if (!isTargetPage()) return;
    
    const input = document.evaluate(
      '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[2]/div[2]/div[1]/input',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    const targetContainer = document.evaluate(
      '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[2]/div[2]/div[2]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (input && targetContainer) {
      createButtons(input, targetContainer);
      return;
    }

    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(checkElements, 100); // Проверяем каждые 100мс
    }
  }
  
  checkElements();
}

// ПРЕСЕТЫ: Функции для работы с пресетами
function loadPresets() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('valuePresets', (data) => {
      resolve(data.valuePresets || [
        [0.5, 1, 1.5],
        [1, 2, 3],
        [2, 4, 6]
      ]);
    });
  });
}

function savePresets(presets) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ valuePresets: presets }, resolve);
  });
}

// ПРЕСЕТЫ: Создание меню настроек
function createPresetsMenu() {
  const menu = document.createElement('div');
  menu.className = 'presets-menu';
  menu.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(28, 28, 28, 0.95);
    padding: 16px;
    border-radius: 12px;
    z-index: 10000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
    display: none;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 280px;
  `;

  let presetsHtml = '';
  for (let i = 0; i < 3; i++) {
    presetsHtml += `
      <div class="preset-row" style="margin-bottom: 12px;">
        <div style="
          margin-bottom: 4px; 
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
        ">Пресет ${i + 1}</div>
        <div style="
          display: flex; 
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px;
          border-radius: 6px;
        ">
          <input type="number" step="0.1" class="preset-input" style="
            width: 70px;
            padding: 6px 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
          ">
          <input type="number" step="0.1" class="preset-input" style="
            width: 70px;
            padding: 6px 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
          ">
          <input type="number" step="0.1" class="preset-input" style="
            width: 70px;
            padding: 6px 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
          ">
        </div>
      </div>
    `;
  }

  menu.innerHTML = `
    <div style="
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    ">
      <h3 style="
        margin: 0;
        color: white;
        font-size: 16px;
        font-weight: 600;
      ">Настройка пресетов</h3>
    </div>
    ${presetsHtml}
    <div style="
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    ">
      <button class="save-presets" style="
        padding: 6px 12px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
      ">Сохранить</button>
      <button class="close-menu" style="
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
      ">Закрыть</button>
    </div>
  `;

  document.body.appendChild(menu);

  // Добавляем эффекты наведения для инпутов
  const inputs = menu.querySelectorAll('.preset-input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.border = '1px solid rgba(255, 255, 255, 0.3)';
      input.style.background = 'rgba(0, 0, 0, 0.3)';
    });
    input.addEventListener('blur', () => {
      input.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      input.style.background = 'rgba(0, 0, 0, 0.2)';
    });
  });

  // Добавляем эффекты наведения для кнопок
  const saveButton = menu.querySelector('.save-presets');
  saveButton.addEventListener('mouseover', () => {
    saveButton.style.background = '#45a049';
  });
  saveButton.addEventListener('mouseout', () => {
    saveButton.style.background = '#4CAF50';
  });

  const closeButton = menu.querySelector('.close-menu');
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.background = 'rgba(255, 255, 255, 0.15)';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
  });

  // Загружаем сохраненные пресеты
  loadPresets().then(presets => {
    const inputs = menu.querySelectorAll('.preset-input');
    presets.forEach((preset, i) => {
      preset.forEach((value, j) => {
        inputs[i * 3 + j].value = value;
      });
    });
  });

  // Обработчики кнопок
  menu.querySelector('.save-presets').onclick = async () => {
    const inputs = menu.querySelectorAll('.preset-input');
    const newPresets = [];
    for (let i = 0; i < 3; i++) {
      newPresets.push([
        parseFloat(inputs[i * 3].value) || 0,
        parseFloat(inputs[i * 3 + 1].value) || 0,
        parseFloat(inputs[i * 3 + 2].value) || 0
      ]);
    }
    await savePresets(newPresets);
    menu.style.display = 'none';
    updateButtons();
  };

  menu.querySelector('.close-menu').onclick = () => {
    menu.style.display = 'none';
  };

  return menu;
}

// ПРЕСЕТЫ: Создание селектора пресетов
function createPresetSelector(input, targetContainer) {
  // Проверяем, не создан ли уже селектор пресетов
  if (document.querySelector('.preset-selector')) return;

  const container = document.createElement('div');
  container.className = 'preset-selector';
  container.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;
  `;

  // Добавляем кнопки пресетов
  [1, 2, 3].forEach(num => {
    const button = document.createElement('button');
    button.textContent = `Пресет ${num}`;
    button.style.cssText = `
      display: flex;
      align-items: center;
      height: 1.5rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 9999px;
      background-color: rgb(39 41 67);
      color: hsla(0, 0%, 100%, .4);
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
    `;

    button.onclick = async (e) => {
      e.preventDefault();
      const presets = await loadPresets();
      const selectedPreset = presets[num - 1];
      
      // Обновляем значения кнопок
      const valueButtons = document.querySelectorAll('.value-button');
      valueButtons.forEach((btn, i) => {
        btn.textContent = selectedPreset[i];
        btn.dataset.value = selectedPreset[i];
      });

      // Подсвечиваем активный пресет
      container.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = 'rgb(39 41 67)';
      });
      button.style.backgroundColor = 'rgb(55 57 99)';
    };

    container.appendChild(button);
  });

  // Добавляем кнопку настроек
  const settingsButton = document.createElement('button');
  settingsButton.textContent = '⚙️';
  settingsButton.style.cssText = `
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 9999px;
    background-color: rgb(39 41 67);
    color: hsla(0, 0%, 100%, .4);
    cursor: pointer;
    font-size: 10px;
    font-weight: 600;
  `;

  let presetsMenu = document.querySelector('.presets-menu');
  if (!presetsMenu) {
    presetsMenu = createPresetsMenu();
  }

  settingsButton.onclick = (e) => {
    e.preventDefault();
    presetsMenu.style.display = presetsMenu.style.display === 'none' ? 'block' : 'none';
  };

  container.appendChild(settingsButton);

  // Подсвечиваем первый пресет как активный
  const firstPresetButton = container.querySelector('button');
  if (firstPresetButton) {
    firstPresetButton.style.backgroundColor = 'rgb(55 57 99)';
  }

  return container;
}

// Обновляем функцию createButtons
async function createButtons(input, targetContainer) {
  if (!input || !targetContainer) return;
  
  // Проверяем, не созданы ли уже кнопки
  if (document.querySelector('.value-buttons')) return;
  
  const presets = await loadPresets();
  const currentPreset = presets[0];
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'value-buttons';
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 10px;
    position: absolute;
    z-index: 1000;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 8px;
    pointer-events: none;
  `;

  currentPreset.forEach(value => {
    const button = document.createElement('button');
    button.className = 'value-button';
    button.textContent = value;
    button.dataset.value = value;
    button.style.cssText = `
      display: flex;
      align-items: center;
      height: 1.5rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 9999px;
      background-color: rgb(39 41 67);
      color: hsla(0, 0%, 100%, .4);
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
      pointer-events: auto;
    `;
    
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.value = button.dataset.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      return false;
    };
    
    buttonsContainer.appendChild(button);
  });

  // Добавляем кнопки в целевой элемент
  const targetElement = document.evaluate(
    '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[2]/div[2]/div[2]/div[2]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (targetElement) {
    targetElement.style.position = 'relative';
    targetElement.appendChild(buttonsContainer);
  }

  // Добавляем селектор пресетов только если его еще нет
  const presetSelectorContainer = document.evaluate(
    '/html/body/div[1]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[1]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (presetSelectorContainer && !document.querySelector('.preset-selector')) {
    presetSelectorContainer.appendChild(createPresetSelector(input, targetContainer));
  }
}

// Функция обновления кнопок
async function updateButtons() {
  const buttons = document.querySelectorAll('.value-button');
  if (buttons.length === 0) return;
  
  const presets = await loadPresets();
  const currentPreset = presets[0];
  
  buttons.forEach((button, i) => {
    button.textContent = currentPreset[i];
  });
}

// Отслеживаем изменения URL
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL изменился, проверяем элементы');
    waitForElements();
  }
}).observe(document, { subtree: true, childList: true });

// Отслеживаем изменения в DOM
const buttonObserver = new MutationObserver((mutations) => {
  if (!document.querySelector('.value-buttons') && isTargetPage()) {
    waitForElements();
  }
});

buttonObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Запускаем проверку при загрузке страницы
document.addEventListener('DOMContentLoaded', () => waitForElements());
window.addEventListener('load', () => waitForElements());

// Периодически проверяем
setInterval(() => {
  if (isTargetPage() && !document.querySelector('.value-buttons')) {
    waitForElements();
  }
}, 1000); 