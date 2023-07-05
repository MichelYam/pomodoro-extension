// Lorsque l'extension est installée ou mise à jour
chrome.runtime.onInstalled.addListener(function () {
    // Enregistrer le temps actuel
    chrome.storage.local.set({ "temps": Date.now() });
});

// Lorsque l'extension est ouverte
chrome.runtime.onStartup.addListener(function () {
    // Récupérer le temps enregistré
    chrome.storage.local.get("temps", function (data) {
        if (data.temps) {
            // Utiliser le temps enregistré pour effectuer des actions nécessaires
            console.log("Temps enregistré: " + data.temps);
        }
    });
});

export { }