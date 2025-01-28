// Обработчик установки расширения
chrome.runtime.onInstalled.addListener(() => {
  // Устанавливаем начальное состояние как выключенное
  chrome.storage.local.set({ enabled: false }, () => {
    // После установки состояния перезагружаем все вкладки meteora
    chrome.tabs.query({url: "https://edge.meteora.ag/*"}, function(tabs) {
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id, { bypassCache: true });
      });
    });
  });

  // Инициализируем состояния, если они еще не установлены
  chrome.storage.local.get(
    ['feeButtonsEnabled', 'sumCalculatorEnabled', 'valueButtonsEnabled'],
    function(result) {
      if (result.feeButtonsEnabled === undefined) {
        chrome.storage.local.set({ feeButtonsEnabled: false });
      }
      if (result.sumCalculatorEnabled === undefined) {
        chrome.storage.local.set({ sumCalculatorEnabled: false });
      }
      if (result.valueButtonsEnabled === undefined) {
        chrome.storage.local.set({ valueButtonsEnabled: false });
      }
    }
  );
});

// Обработчик сообщений
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateExtensionState") {
    // Получаем все вкладки с meteora.ag
    chrome.tabs.query({url: "https://edge.meteora.ag/*"}, function(tabs) {
      tabs.forEach(tab => {
        // Перезагружаем вкладку с очисткой кэша
        chrome.tabs.reload(tab.id, { bypassCache: true });
      });
    });
  }
});

// Обработчик создания новой вкладки
chrome.tabs.onCreated.addListener((tab) => {
  // Проверяем состояние расширения для новых вкладок
  chrome.storage.local.get(['enabled'], function(result) {
    if (tab.url?.includes('edge.meteora.ag')) {
      chrome.tabs.sendMessage(tab.id, { 
        action: "extensionState", 
        enabled: result.enabled === true 
      });
    }
  });
});

// Обработчик обновления вкладок
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('edge.meteora.ag')) {
    // Получаем состояния и отправляем их в content script
    chrome.storage.local.get(
      ['feeButtonsEnabled', 'sumCalculatorEnabled', 'valueButtonsEnabled'],
      function(result) {
        Object.entries(result).forEach(([feature, enabled]) => {
          if (enabled) {
            chrome.tabs.sendMessage(tabId, {
              action: "updateFeatureState",
              feature: feature.replace('Enabled', ''),
              enabled: true
            });
          }
        });
      }
    );
  }
}); 