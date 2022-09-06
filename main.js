var configs = [];

function config(){
    this.name = "";
    this.tabs = [];
}

function load(){
    chrome.storage.sync.get(['configs'], function(result) {
        var configElemnt = document.getElementById("configs");
        configElemnt.setAttribute("size", result.configs.length);
        configElemnt.innerHTML = "";
        for(var i=0; i<result.configs.length; i++){
            var option = document.createElement("option");
            option.setAttribute("value", result.configs[i].name);
            option.appendChild(document.createTextNode(result.configs[i].name));
            configElemnt.appendChild(option);
        }
        configs = result.configs;
    });    
}
load();

async function saveAllTabs() {
    try {
        const tabs = await chrome.tabs.query({});
        var newConfig = new config();
        newConfig.name = document.getElementById("savename").value;
        for(let t of tabs){
            newConfig.tabs.push(t.url);
        }
        configs.push(newConfig);
        chrome.storage.sync.set({"configs": configs});
        load();
    }
    catch(err) {
        alert("Error: " + err)
    }
}
  
document.getElementById("save").addEventListener("click", saveAllTabs);
document.getElementById("load").addEventListener("click", () => {
    var configsMenu = document.getElementById("configs");
    for(var i=0; i<configs.length; i++){
        if(configs[i].name == configsMenu.options[configsMenu.selectedIndex].value){
            for(var u=0; u<configs[i].tabs.length; u++){
                chrome.tabs.create({url: configs[i].tabs[u], active: false});
            }
            return;
        }
    }
});
document.getElementById("delete").addEventListener("click", () => {
    var configsMenu = document.getElementById("configs");
    for(var i=0; i<configs.length; i++){
        if(configs[i].name == configsMenu.options[configsMenu.selectedIndex].value){
            configs.splice(i, 1);
            chrome.storage.sync.set({"configs": configs});
            load();
            return;
        }
    }
});
