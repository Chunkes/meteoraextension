document.addEventListener('DOMContentLoaded', function() {
  const feeButtonsToggle = document.getElementById('feeButtonsToggle');
  const sumCalculatorToggle = document.getElementById('sumCalculatorToggle');
  const valueButtonsToggle = document.getElementById('valueButtonsToggle');
  
  // Загружаем сохраненные состояния
  chrome.storage.local.get(
    ['feeButtonsEnabled', 'sumCalculatorEnabled', 'valueButtonsEnabled'], 
    function(result) {
      // Устанавливаем состояния переключателей
      feeButtonsToggle.checked = result.feeButtonsEnabled === true;
      sumCalculatorToggle.checked = result.sumCalculatorEnabled === true;
      valueButtonsToggle.checked = result.valueButtonsEnabled === true;
      
      // Отправляем сообщения для активации функций, если они были включены
      if (result.feeButtonsEnabled === true) {
        updateFeatureState('feeButtons', true);
      }
      if (result.sumCalculatorEnabled === true) {
        updateFeatureState('sumCalculator', true);
      }
      if (result.valueButtonsEnabled === true) {
        updateFeatureState('valueButtons', true);
      }
    }
  );
  
  // Обработчики изменения состояния
  feeButtonsToggle.addEventListener('change', function() {
    chrome.storage.local.set({ feeButtonsEnabled: this.checked });
    updateFeatureState('feeButtons', this.checked);
  });
  
  sumCalculatorToggle.addEventListener('change', function() {
    chrome.storage.local.set({ sumCalculatorEnabled: this.checked });
    updateFeatureState('sumCalculator', this.checked);
  });
  
  valueButtonsToggle.addEventListener('change', function() {
    chrome.storage.local.set({ valueButtonsEnabled: this.checked });
    updateFeatureState('valueButtons', this.checked);
  });
  
  // Функция обновления состояния функционала
  function updateFeatureState(feature, enabled) {
    chrome.tabs.query({url: "https://edge.meteora.ag/*"}, function(tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: "updateFeatureState",
          feature: feature,
          enabled: enabled
        });
      });
    });
  }
}); 