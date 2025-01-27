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

// Запускаем обновление каждые 100мс
setInterval(updateAllSums, 100);

// Запускаем при загрузке страницы
window.addEventListener('load', updateAllSums);

// Наблюдаем за изменениями в DOM
const observer = new MutationObserver(updateAllSums);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
}); 