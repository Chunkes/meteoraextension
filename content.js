// Функция для поиска элементов по XPath
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Функция для эмуляции ввода с клавиатуры
function simulateKeyboardInput(input, value) {
  // Фокусируемся на поле
  input.focus();
  
  // Эмулируем нажатия клавиш для каждого символа
  for (let char of value.toString()) {
    // Событие keydown
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: 'Key' + char.toUpperCase(),
      bubbles: true
    }));
    
    // Добавляем символ в значение
    input.value = input.value + char;
    
    // Событие input
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Событие keyup
    input.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      code: 'Key' + char.toUpperCase(),
      bubbles: true
    }));
  }
}

// Функция создания кнопок
function createButtons() {
  // Проверяем, не созданы ли уже кнопки
  if (document.querySelector('.value-buttons')) return;
  
  const container = document.createElement('div');
  container.className = 'value-buttons';

  const values = [0.5, 1, 1.5];
  
  values.forEach(value => {
    const button = document.createElement('button');
    button.className = 'value-button';
    button.textContent = value;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const input = getElementByXPath('//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[2]/div[2]/div[1]/input');
      if (input) {
        input.value = ''; // Очищаем поле перед вводом
        simulateKeyboardInput(input, value);
      }
      
      return false;
    });
    
    container.appendChild(button);
  });

  const targetContainer = getElementByXPath('//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[2]/div[2]/form/div[1]/div[2]/div[2]/div[2]/div[2]');
  if (targetContainer) {
    targetContainer.style.position = 'relative';
    targetContainer.appendChild(container);
  }
}

// Проверяем состояние и создаем кнопки
chrome.storage.local.get(['enabled'], function(result) {
  if (result.enabled !== false) {
    // Пробуем создать кнопки несколько раз
    for (let i = 1; i <= 10; i++) {
      setTimeout(createButtons, i * 1000);
    }
    
    // И сразу пробуем
    createButtons();
  }
});

// Добавляем обработчик сообщений
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleButtons') {
    const buttons = document.querySelector('.value-buttons');
    if (buttons) {
      buttons.style.display = request.enabled ? 'flex' : 'none';
    }
  }
});

// Функция для получения числа из элемента
function getNumberFromElement(xpath) {
  const element = getElementByXPath(xpath);
  if (element) {
    const span = element.querySelector('span');
    if (span) {
      // Получаем текст и убираем пробелы
      const text = span.textContent.trim();
      // Убираем знак доллара и скобки, преобразуем в число
      const number = parseFloat(text.replace('$', '').replace('(', '').replace(')', ''));
      // Если число было в скобках, делаем его отрицательным
      return text.includes('(') ? -number : number;
    }
  }
  return 0;
}

// Функция для обновления первой суммы
function updateSum() {
  const xpath1 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]/span';
  const xpath2 = '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[2]/div/div/div[2]/span';
  
  const element1 = getElementByXPath(xpath1);
  const element2 = getElementByXPath(xpath2);
  
  const num1 = element1 ? parseFloat(element1.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element1.textContent.includes('(') ? -1 : 1) : 0;
  const num2 = element2 ? parseFloat(element2.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element2.textContent.includes('(') ? -1 : 1) : 0;
  
  console.log('Значение 1:', element1?.textContent, '=', num1);
  console.log('Значение 2:', element2?.textContent, '=', num2);
  
  const sum = num1 + num2;
  console.log('TOTAL 1:', sum);

  displaySum(sum, '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]');
}

// Функция для обновления второй суммы
function updateSum2() {
  const xpath1 = '//*[@id="radix-:r0:"]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div[2]/span';
  const xpath2 = '//*[@id="radix-:r0:"]/div[1]/div[2]/div[1]/div[2]/div[2]/div/div[2]/span';
  
  const element1 = getElementByXPath(xpath1);
  const element2 = getElementByXPath(xpath2);
  
  const num1 = element1 ? parseFloat(element1.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element1.textContent.includes('(') ? -1 : 1) : 0;
  const num2 = element2 ? parseFloat(element2.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element2.textContent.includes('(') ? -1 : 1) : 0;
  
  console.log('Значение 3:', element1?.textContent, '=', num1);
  console.log('Значение 4:', element2?.textContent, '=', num2);
  
  const sum = num1 + num2;
  console.log('TOTAL 2:', sum);

  displaySum(sum, '//*[@id="radix-:r0:"]/div[1]/div[2]/div[1]/div[2]');
}

// Функция для обновления третьей суммы
function updateSum3() {
  const xpath1 = '//*[@id="radix-:r0:"]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[2]/span';
  const xpath2 = '//*[@id="radix-:r0:"]/div[1]/div[2]/div[2]/div[2]/div[2]/div/div[2]/span';
  
  const element1 = getElementByXPath(xpath1);
  const element2 = getElementByXPath(xpath2);
  
  const num1 = element1 ? parseFloat(element1.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element1.textContent.includes('(') ? -1 : 1) : 0;
  const num2 = element2 ? parseFloat(element2.textContent.replace('$', '').replace('(', '').replace(')', '')) * (element2.textContent.includes('(') ? -1 : 1) : 0;
  
  console.log('Значение 5:', element1?.textContent, '=', num1);
  console.log('Значение 6:', element2?.textContent, '=', num2);
  
  const sum = num1 + num2;
  console.log('TOTAL 3:', sum);

  displaySum(sum, '//*[@id="radix-:r0:"]/div[1]/div[2]/div[2]/div[2]');
}

// Общая функция для отображения суммы
function displaySum(sum, containerXPath) {
  const sumContainer = getElementByXPath(containerXPath);
  if (sumContainer) {
    let sumSpan = sumContainer.querySelector('.calculated-sum');
    if (!sumSpan) {
      sumSpan = document.createElement('span');
      sumSpan.className = 'calculated-sum';
      sumSpan.style.cssText = `
        color: #ffffff;
        font-size: 17px;
        font-weight: 600;
        margin-left: 10px;
      `;
      sumContainer.appendChild(sumSpan);
    }
    
    if (sum < 0) {
      sumSpan.textContent = `TOTAL: ($${Math.abs(sum).toFixed(2)})`;
    } else {
      sumSpan.textContent = `TOTAL: $${Math.abs(sum).toFixed(2)}`;
    }
  }
}

// Обновленная функция наблюдения
function observeChanges() {
  const observer = new MutationObserver(() => {
    updateSum();
    updateSum2();
    updateSum3();
  });

  const config = { 
    subtree: true, 
    characterData: true, 
    childList: true 
  };

  // Наблюдаем за всеми элементами
  const xpaths = [
    '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div/div/div[2]',
    '//*[@id="__next"]/div[1]/div[3]/div/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[2]/div/div/div[2]',
    '//*[@id="radix-:r1:"]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div[2]',
    '//*[@id="radix-:r1:"]/div[1]/div[2]/div[1]/div[2]/div[2]/div/div[2]',
    '//*[@id="radix-:r0:"]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[2]',
    '//*[@id="radix-:r0:"]/div[1]/div[2]/div[2]/div[2]/div[2]/div/div[2]'
  ];
  
  xpaths.forEach(xpath => {
    const element = getElementByXPath(xpath);
    if (element) observer.observe(element, config);
  });
}

// Запускаем наблюдение при загрузке страницы
window.addEventListener('load', () => {
  updateSum();
  updateSum2();
  updateSum3();
  observeChanges();
});

// Периодически проверяем наличие элементов и обновляем суммы
setInterval(() => {
  updateSum();
  updateSum2();
  updateSum3();
}, 1000); 