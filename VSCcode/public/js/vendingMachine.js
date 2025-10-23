function loadVendingMachineData() {
    vendingMachineArray = [];

    fetch("/vending_machine", {
        method: "GET"
    }).then(response =>{
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineArray = data;
        // console.log(vendingMachineArray);
        insertDynamicVendingMachines(vendingMachineArray);
    }).catch(error => {console.error("Error:", error);});
}



function loadVendingMachineFilterData(school) {
    if(school == "All") {
        loadVendingMachineData();
        return;
    }

    var vendingMachineArray = [];

    var api_url = "/vending_machine/filter_school/" + school;

    fetch(api_url, {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineArray = data;
        // console.log(vendingMachineArray);
        insertDynamicVendingMachines(vendingMachineArray);
    }).catch(error => {console.error("Error:", error);});
}

function insertDynamicVendingMachines(arrayOfVendingMachine) {
    var dynamicVendingMachineList = document.getElementById("dynamicVendingMachineDataList");
    var newContent = "";

    var prevId = 0;

    var i = 0;
    for(; i < arrayOfVendingMachine.length; i++) {
        // console.log(arrayOfVendingMachine[i]);

        if(arrayOfVendingMachine[i].id == prevId) {
            newContent += ", " + arrayOfVendingMachine[i].payment_name;
            continue;
        }

        if(i > 0) {
            newContent += "</h3><div class='flex'><button><a href='vending_machine_item.html?id=" + arrayOfVendingMachine[i - 1].id + "'>Items</a></button></div></div>";
        }

        newContent +=
            "<div><h3>id " + arrayOfVendingMachine[i].id +
            "</h3><h3>" + arrayOfVendingMachine[i].school +
            "</h3><div class='imageDiv'><img src='images/vendingmachine.jpg'></div><h3>Block " + arrayOfVendingMachine[i].block +
            "</h3><h3>Floor " + arrayOfVendingMachine[i].floor +
            "</h3><h3 class='lighter'>Payment Methods:</h3><h3 class='standardheight lighter'>" + arrayOfVendingMachine[i].payment_name;
        
        prevId = arrayOfVendingMachine[i].id;
    }

    if(i != 0){
        newContent += "</h3><div class='flex'><button><a href='vending_machine_item.html?id=" + arrayOfVendingMachine[i - 1].id + "'>Items</a></button></div></div>";
    }else{
        newContent = "<h1>No vending machines</h1>"
    }

    dynamicVendingMachineList.innerHTML = newContent;
}



function loadVendingMachineItemData() {
    var vendingMachineItemArray = [];
    
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var api_url = "/vending_machine_item/" + id;
    
    fetch(api_url, {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineItemArray = data;
        // console.log(vendingMachineItemArray);
        insertDynamicVendingMachineItems(id, vendingMachineItemArray);
    }).catch(error => {console.error("Error:", error);});
}

function loadVendingMachineSearchItemData() {
    var vendingMachineItemArray = [];

    var params = new URLSearchParams(location.search);
    var id = params.get("id");

    var formElement = document.getElementById("filterForm");
    var formData = new FormData(formElement);
    
    var name = formData.get("searchbar");
    // console.log(name);
    
    var order = document.getElementById("order").getAttribute("value");
    // console.log(order);
    
    var api_url = "/vending_machine_item/" + id;
    if((name != "" && name != "_") && (order == "ASC" || order == "DESC")) api_url += "/filter_nameorder/" + name + "/" + order;
    else if(name != "" && name != "_") api_url += "/filter_name/" + name;
    else if(order == "ASC" || order == "DESC") api_url += "/filter_order/" + order;
    // console.log(api_url);

    fetch(api_url, {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineItemArray = data;
        // console.log(vendingMachineItemArray);
        insertDynamicVendingMachineItems(id, vendingMachineItemArray);
    }).catch(error => {console.error("Error:", error);});
}

function insertDynamicVendingMachineItems(Id, arrayOfVendingMachineItem) {
    document.getElementById("vendingMachineId").innerText = "Vending Machine Items (id " + Id + ")";
    document.getElementById("addVMIHyperlink").setAttribute("href", "add_vending_machine_item.html?id=" + Id);

    var dynamicVendingMachineItemList = document.getElementById("dynamicVendingMachineItemDataList");
    var newContent = "";
    
    var i = 0;
    for(; i < arrayOfVendingMachineItem.length; i++) {
        // console.log(arrayOfVendingMachineItem[i]);
        
        newContent +=
        "<div><div class='imageDiv'><img src='images/" + arrayOfVendingMachineItem[i].image +
        "'></div><h3>" + arrayOfVendingMachineItem[i].name +
        "</h3><h3>$" + arrayOfVendingMachineItem[i].cost +
        "</h3><h3 class='lighter'>";
        
        if(arrayOfVendingMachineItem[i].availability == 1) newContent += "Available";
        else newContent += "Not Available";
        
        newContent +=
            "</h3><div class='flex'><button><a href='update_item.html?item_id=" + arrayOfVendingMachineItem[i].id +
            "'>Update Item</a></button><button onclick='removeVendingMachineItem(" + Id + ", " + arrayOfVendingMachineItem[i].id +
            ")'>Remove Item</button></div></div>";
    }

    if(i == 0) {
        newContent = "<h1>No items in vending machine</h1>"
    }
    
    dynamicVendingMachineItemList.innerHTML = newContent;
}



function loadVendingMachineAddItemData() {
    var vendingMachineAddItemArray = [];

    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var api_url = "/vending_machine_item/add_item/" + id;

    fetch(api_url, {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineAddItemArray = data;
        // console.log(vendingMachineAddItemArray);
        insertDynamicVendingMachineAddItems(id, vendingMachineAddItemArray);
    }).catch(error => {console.error("Error:", error);});
}

function loadVendingMachineSearchAddItemData() {
    var vendingMachineAddItemArray = [];

    var params = new URLSearchParams(location.search);
    var id = params.get("id");

    var formElement = document.getElementById("filterForm");
    var formData = new FormData(formElement);
    
    var name = formData.get("searchbar");
    // console.log(name);
    
    var order = document.getElementById("order").getAttribute("value");
    // console.log(order);
    
    var api_url = "/vending_machine_item/add_item/" + id;
    if((name != "" && name != "_") && (order == "ASC" || order == "DESC")) api_url += "/filter_nameorder/" + name + "/" + order;
    else if(name != "" && name != "_") api_url += "/filter_name/" + name;
    else if(order == "ASC" || order == "DESC") api_url += "/filter_order/" + order;
    // console.log(api_url);

    fetch(api_url, {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        vendingMachineAddItemArray = data;
        // console.log(vendingMachineAddItemArray);
        insertDynamicVendingMachineAddItems(id, vendingMachineAddItemArray);
    }).catch(error => {console.error("Error:", error);});
}

function insertDynamicVendingMachineAddItems(Id, arrayOfVendingMachineAddItem) {
    document.getElementById("backButton").setAttribute("href", "vending_machine_item.html?id=" + Id);
    document.getElementById("vendingMachineId").innerText = "Add Items to Vending Machine (id " + Id + ")";

    var dynamicVendingMachineAddItemList = document.getElementById("dynamicVendingMachineAddItemDataList");
    var newContent = "";

    var i = 0;
    for(; i < arrayOfVendingMachineAddItem.length; i++) {
        // console.log(arrayOfVendingMachineAddItem[i]);

        newContent +=
        "<div><div class='imageDiv'><img src='images/" + arrayOfVendingMachineAddItem[i].image +
        "'></div><h3>" + arrayOfVendingMachineAddItem[i].name +
        "</h3><h3>$" + arrayOfVendingMachineAddItem[i].cost +
        "</h3><h3 class='lighter'>";
        
        if(arrayOfVendingMachineAddItem[i].availability == 1) newContent += "Available";
        else newContent += "Not Available";

        newContent +=
            "</h3><div class='flex'><button onclick='addVendingMachineItem(" + Id + ", " + arrayOfVendingMachineAddItem[i].id +
            ")'>Add Item</button></div></div>"
    }

    if(i == 0) {
        newContent = "<h1>All items already in vending machine</h1>"
    }

    dynamicVendingMachineAddItemList.innerHTML = newContent;
}

function addVendingMachineItem(Id, itemId) {
    if(confirm("Are you sure you want to add this item?"))

    var api_url = "/vending_machine_item/add_item/" + Id;

    fetch(api_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({item_id: itemId})
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        location.href = "add_vending_machine_item.html?id=" + Id;
    }).catch(error => {console.error("Error:", error);});
}

function removeVendingMachineItem(Id, itemId) {
    if(confirm("Are you sure you want to remove this item?")) {

    } else return;

    var api_url = "/vending_machine_item/" + Id;

    fetch(api_url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({item_id: itemId})
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        location.href = "vending_machine_item.html?id=" + Id;
    }).catch(error => {console.error("Error:", error);});
}



function loadItemData() {
    itemArray = [];

    fetch("/item", {
        method: "GET"
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        itemArray = data;
        // console.log(itemArray);
        insertDynamicItems(itemArray);
    }).catch(error => {console.error("Error:", error);});
}

function loadSearchItemData() {
    var itemArray = [];

    var formElement = document.getElementById("filterForm");
    var formData = new FormData(formElement);
    
    var name = formData.get("searchbar");
    // console.log(name);
    
    var order = document.getElementById("order").getAttribute("value");
    // console.log(order);
    
    var api_url = "/item/" 
    if(name != "") api_url += name + "/";
    else api_url += "_/";

    if(order == "ASC" || order == "DESC") api_url += order;
    else api_url += "_";
    // console.log(api_url);

    var api_url = "/item";
    if((name != "" && name != "_") && (order == "ASC" || order == "DESC")) api_url += "/filter_nameorder/" + name + "/" + order;
    else if(name != "" && name != "_") api_url += "/filter_name/" + name;
    else if(order == "ASC" || order == "DESC") api_url += "/filter_order/" + order;
    // console.log(api_url);

    fetch(api_url, {
        method: "GET",
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check logs for error message.");
        return response.json();
    }).then(data => {
        itemArray = data;
        // console.log(itemArray);
        insertDynamicItems(itemArray);
    }).catch(error => {console.error("Error:", error);});
}

function insertDynamicItems(arrayOfItem) {
    var dynamicItemList = document.getElementById("dynamicItemDataList");
    var newContent = "";

    var i = 0;
    for(; i < arrayOfItem.length; i++) {
        // console.log(arrayOfItem[i]);

        newContent +=
            "<div><div class='imageDiv'><img src='images/" + arrayOfItem[i].image +
            "'></div><h3>" + arrayOfItem[i].name +
            "</h3><h3>$" + arrayOfItem[i].cost +
            "</h3><h3 class='lighter'>";
        
        if(arrayOfItem[i].availability == 1) newContent += "Available";
        else newContent += "Not Available";
        
        newContent +=
            "</h3><div class='flex'><button><a href='update_item.html?item_id=" + arrayOfItem[i].id +
            "'>Update Item</a></button><button onclick='deleteItemData(" + arrayOfItem[i].id +
            ")'>Delete Item</button></div></div>";
    }

    if(i == 0) newContent = "<h1>No items</h1>";

    dynamicItemList.innerHTML = newContent;
}

function changeOrderButton() {
    var button = document.getElementById("order");

    var order = button.getAttribute("value");

    if(order == "ASC") {
        button.setAttribute("value", "DESC");
        button.innerHTML = "Descending cost";
    }else if(order == "DESC") {
        button.setAttribute("value", "unordered");
        button.innerHTML = "Order cost";
    }else{
        button.setAttribute("value", "ASC");
        button.innerHTML = "Ascending cost";
    }
}



function addItemData() {
    var formElement = document.getElementById("insertForm");
    var formData = new FormData(formElement);
    var itemData = Object.fromEntries(formData.entries());
    var jsonString = JSON.stringify(itemData);

    fetch("/item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonString
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check error message.");
        return response.json();
    }).then(data => {
        location.href = "item_list.html";
    }).catch(error => {console.error("Error:", error);});
}



function getIdParam() {
    var params = new URLSearchParams(location.search);
    var id = params.get("item_id");
    
    document.getElementById("id_tb").setAttribute("value", id);
}



function updateItemData() {
    var formElement = document.getElementById("updateForm");
    var formData = new FormData(formElement);
    var itemData = Object.fromEntries(formData.entries());
    var jsonString = JSON.stringify(itemData);

    fetch("/item", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonString
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check error message.");
        return response.json();
    }).then(data => {
        location.href = "item_list.html";
    }).catch(error => {console.error("Error:", error);});
}



function deleteItemData(Id) {
    if(confirm("Are you sure you want to delete this item?")){

    }else return;

    fetch("/item", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: Id})
    }).then(response => {
        if(!response.ok) throw new Error("Error: The response was not ok, please check error message.");
        return response.json();
    }).then(data => {
        location.href = "item_list.html";
    }).catch(error => {console.error("Error:", error);});
}