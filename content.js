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