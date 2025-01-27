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

  const el1 = getElementByXPath(xpath1);
  const el2 = getElementByXPath(xpath2);
  const container = getElementByXPath(containerXPath);

  if (el1 && el2 && container) {
    const sum = calculateSum(el1, el2);
    displaySum(sum, container);
  }
}

// Функция обновления второй суммы
function updateSum2() {
  const xpath1 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/span';
  const xpath2 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[2]/div/div/div[2]/span';
  const containerXPath = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[2]/div[2]';

  const el1 = getElementByXPath(xpath1);
  const el2 = getElementByXPath(xpath2);
  const container = getElementByXPath(containerXPath);

  if (el1 && el2 && container) {
    const sum = calculateSum(el1, el2);
    displaySum(sum, container);
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

// КНОПКИ: Функция для создания кнопок
function createButtons(input, targetContainer) {
  if (!input || !targetContainer) return;
  
  // Проверяем, не созданы ли уже кнопки
  if (document.querySelector('.value-buttons')) return;
  
  console.log('Создаем кнопки');
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'value-buttons';
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 4px;
    position: absolute;
    z-index: 1000;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 8px;
    pointer-events: none;
  `;

  [0.5, 1, 1.5].forEach(value => {
    const button = document.createElement('button');
    button.className = 'value-button';
    button.textContent = value;
    button.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      background: #1a1a1a;
      color: white;
      min-width: 40px;
      text-align: center;
      font-size: 14px;
      transition: background 0.2s;
      pointer-events: auto;
    `;
    
    button.onmouseover = () => {
      button.style.background = '#2a2a2a';
    };
    
    button.onmouseout = () => {
      button.style.background = '#1a1a1a';
    };
    
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      
      return false;
    };
    
    buttonsContainer.appendChild(button);
  });

  // Находим целевой элемент для позиционирования кнопок
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
  
  console.log('Кнопки добавлены');
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