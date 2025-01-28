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
  return window.location.href.includes('/transfer') || 
         document.querySelector('form') !== null;
}

// КНОПКИ: Функция для ожидания появления элементов
function waitForElements(maxAttempts = 50) {
  let attempts = 0;
  
  function checkElements() {
    if (!isTargetPage()) return;
    
    // Проверяем элементы для кнопок значений
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

    // Проверяем элемент для кнопок комиссий
    const feeButton = document.evaluate(
      '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[1]/button',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    // Создаем кнопки значений, если их еще нет
    if (input && targetContainer && !document.querySelector('.value-buttons')) {
      createButtons(input, targetContainer);
    }

    // Создаем кнопки комиссий, если их еще нет
    if (feeButton && !document.querySelector('.quick-fee-buttons')) {
      createQuickFeeButtons();
    }

    // Продолжаем проверку, если не все элементы найдены
    if ((!input || !targetContainer || !feeButton) && attempts < maxAttempts) {
      attempts++;
      setTimeout(checkElements, 100);
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

// Добавим глобальную переменную для хранения активного пресета
let activePresetIndex = 0;

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
    cursor: move;
  `;

  // Добавляем обработчики для перетаскивания
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  menu.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === menu) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      menu.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

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
        ">Preset ${i + 1}</div>
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
      ">Preset Settings</h3>
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
      ">Save</button>
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
      ">Close</button>
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
    
    // Обновляем значения кнопок текущего пресета
    updateValueButtons(newPresets[activePresetIndex]);
  };

  menu.querySelector('.close-menu').onclick = () => {
    menu.style.display = 'none';
  };

  return menu;
}

// Функция обновления кнопок значений
function updateValueButtons(preset) {
  const valueButtons = document.querySelectorAll('.value-button');
  valueButtons.forEach((btn, i) => {
    const value = preset[i];
    btn.textContent = value;
    btn.dataset.value = value;
  });
}

// Функция обновления активного пресета
function updateActivePreset(activeButton) {
  const presetButtons = document.querySelectorAll('.preset-button');
  presetButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  activeButton.classList.add('active');
}

// Обновим функцию createPresetSelector
function createPresetSelector(input, targetContainer) {
  if (document.querySelector('.preset-selector')) return;

  const container = document.createElement('div');
  container.className = 'preset-selector';

  [1, 2, 3].forEach((num, index) => {
    const button = document.createElement('button');
    button.className = 'preset-button';
    if (index === activePresetIndex) {
      button.classList.add('active');
    }
    button.textContent = `Preset ${num}`;
    
    button.onclick = async (e) => {
      e.preventDefault();
      const presets = await loadPresets();
      const selectedPreset = presets[num - 1];
      activePresetIndex = num - 1;
      
      // Обновляем значения кнопок
      const valueButtons = document.querySelectorAll('.value-button');
      valueButtons.forEach((btn, i) => {
        btn.textContent = selectedPreset[i];
        btn.dataset.value = selectedPreset[i];
        // Обновляем обработчик клика с новым значением
        btn.onclick = (e) => {
          e.preventDefault();
          input.value = selectedPreset[i];
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        };
      });

      updateActivePreset(button);
    };

    container.appendChild(button);
  });

  // Добавляем кнопку настроек
  const settingsButton = document.createElement('button');
  settingsButton.textContent = '⚙️';
  settingsButton.className = 'preset-button';

  let presetsMenu = document.querySelector('.presets-menu');
  if (!presetsMenu) {
    presetsMenu = createPresetsMenu();
  }

  settingsButton.onclick = (e) => {
    e.preventDefault();
    presetsMenu.style.display = presetsMenu.style.display === 'none' ? 'block' : 'none';
  };

  container.appendChild(settingsButton);

  return container;
}

// Обновляем функцию createButtons
async function createButtons(input, targetContainer) {
  if (!input || !targetContainer || document.querySelector('.value-buttons')) return;
  
  const presets = await loadPresets();
  const currentPreset = presets[activePresetIndex]; // Используем активный пресет вместо первого
  
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
    margin-right: 16px;
  `;

  currentPreset.forEach(value => {
    const button = document.createElement('button');
    button.className = 'value-button';
    button.textContent = value;
    button.dataset.value = value;
    
    button.onclick = (e) => {
      e.preventDefault();
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    };
    
    button.style.cssText = `
      display: flex;
      align-items: center;
      height: 1.5rem;
      width: 2.5rem;
      padding: 0 0.5rem;
      border: none;
      border-radius: 9999px;
      background-color: rgb(39 41 67);
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
      justify-content: center;
    `;

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

// Обновим функцию updateButtons
async function updateButtons() {
  const buttons = document.querySelectorAll('.value-button');
  if (buttons.length === 0) return;
  
  const presets = await loadPresets();
  const currentPreset = presets[activePresetIndex]; // Используем активный пресет
  
  buttons.forEach((button, i) => {
    button.textContent = currentPreset[i];
    button.dataset.value = currentPreset[i];
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
}).observe(document.body, { subtree: true, childList: true });

// Один общий observer для всех изменений
const observer = new MutationObserver(() => {
  if (isTargetPage()) {
    // Проверяем и создаем кнопки значений
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

    if (input && targetContainer && !document.querySelector('.value-buttons')) {
      createButtons(input, targetContainer);
    }

    // Проверяем и создаем кнопки комиссий
    const feeButton = document.evaluate(
      '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[1]/button',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (feeButton && !document.querySelector('.quick-fee-buttons')) {
      createQuickFeeButtons();
    }
  }
});

// Наблюдаем за изменениями в DOM
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Запускаем проверку при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  if (isTargetPage()) {
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
    }

    const feeButton = document.evaluate(
      '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[1]/button',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (feeButton) {
      createQuickFeeButtons();
    }
  }
});

// Периодически проверяем
setInterval(() => {
  if (isTargetPage() && !document.querySelector('.value-buttons')) {
    waitForElements();
  }
}, 1000);

// Функция загрузки значений комиссий
function loadFeePresets() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('feePresets', (data) => {
      resolve(data.feePresets || [0.004, 0.006, 0.008]);
    });
  });
}

// Функция сохранения значений комиссий
function saveFeePresets(presets) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ feePresets: presets }, resolve);
  });
}

// Добавим функцию для сохранения активной комиссии
function saveActiveFee(fee) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ activeFee: fee }, resolve);
  });
}

// Добавим функцию для загрузки активной комиссии
function loadActiveFee() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('activeFee', (data) => {
      resolve(data.activeFee || null);
    });
  });
}

// Обновим функцию createQuickFeeButtons
async function createQuickFeeButtons() {
  const containerElement = document.evaluate(
    '/html/body/div[1]/div[1]/div[2]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (!containerElement || document.querySelector('.quick-fee-buttons')) return;

  const feePresets = await loadFeePresets();
  const activeFee = await loadActiveFee();

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'quick-fee-buttons';
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
  `;

  // Создаем кнопки
  feePresets.forEach(fee => {
    const button = document.createElement('button');
    button.className = 'quick-fee-button';
    button.textContent = fee;
    button.style.cssText = `
      display: flex;
      align-items: center;
      height: 2.25rem;
      padding: 0 0.75rem;
      border: none;
      border-radius: 9999px;
      background-color: ${fee === activeFee ? 'rgb(65 67 119)' : 'rgb(39 41 67)'};
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: background-color 0.2s;
    `;

    button.onclick = async () => {
      const feeButton = document.evaluate(
        '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[1]/button',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (feeButton) {
        // Обновляем подсветку кнопок
        document.querySelectorAll('.quick-fee-button').forEach(btn => {
          btn.style.backgroundColor = 'rgb(39 41 67)';
        });
        button.style.backgroundColor = 'rgb(65 67 119)';
        
        // Сохраняем активную комиссию
        await saveActiveFee(fee);

        // Устанавливаем значение
        feeButton.click();
        setTimeout(() => {
          const input = document.evaluate(
            '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[2]/div/div[3]/div[3]/div/div/input',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (input) {
            input.value = fee;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
              const saveButton = document.evaluate(
                '/html/body/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[1]/div/div[2]/div/button',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (saveButton) saveButton.click();
            }, 100);
          }
        }, 100);
      }
    };

    buttonsContainer.appendChild(button);
  });

  // Добавляем кнопку настроек
  const settingsButton = document.createElement('button');
  settingsButton.textContent = '⚙️';
  settingsButton.style.cssText = `
    display: flex;
    align-items: center;
    height: 2.25rem;
    padding: 0 0.75rem;
    border: none;
    border-radius: 9999px;
    background-color: rgb(39 41 67);
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
  `;

  settingsButton.onclick = () => {
    const menu = createFeeSettingsMenu();
    menu.style.display = 'block';
  };

  buttonsContainer.appendChild(settingsButton);
  containerElement.style.position = 'relative';
  containerElement.appendChild(buttonsContainer);
}

// Функция создания меню настроек комиссий
function createFeeSettingsMenu() {
  let menu = document.querySelector('.fee-settings-menu');
  if (menu) return menu;

  menu = document.createElement('div');
  menu.className = 'fee-settings-menu';
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

  menu.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: white; font-size: 16px;">Fee Settings</h3>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; gap: 8px;">
        <input type="number" step="0.001" class="fee-input" style="
          width: 80px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 13px;
        ">
        <input type="number" step="0.001" class="fee-input" style="
          width: 80px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 13px;
        ">
        <input type="number" step="0.001" class="fee-input" style="
          width: 80px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 13px;
        ">
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button class="save-fees" style="
          padding: 6px 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        ">Save</button>
        <button class="close-menu" style="
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        ">Close</button>
      </div>
    </div>
  `;

  // Загружаем текущие значения
  loadFeePresets().then(presets => {
    const inputs = menu.querySelectorAll('.fee-input');
    presets.forEach((fee, i) => {
      inputs[i].value = fee;
    });
  });

  // Обработчики кнопок
  menu.querySelector('.save-fees').onclick = async () => {
    const inputs = menu.querySelectorAll('.fee-input');
    const newPresets = Array.from(inputs).map(input => parseFloat(input.value) || 0);
    await saveFeePresets(newPresets);
    menu.style.display = 'none';
    
    // Обновляем кнопки
    const buttons = document.querySelectorAll('.quick-fee-button');
    buttons.forEach((btn, i) => {
      if (i < newPresets.length) btn.textContent = newPresets[i];
    });
  };

  menu.querySelector('.close-menu').onclick = () => {
    menu.style.display = 'none';
  };

  document.body.appendChild(menu);
  return menu;
} 