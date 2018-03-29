const StorageCtrl = null;

const ItemCtrl = (function () {

    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const state = {
        items: [
            // { id: 0, name: "Salad (a lot)", calories: 1600 },
            // { id: 1, name: "Paczki", calories: 500 },
            // { id: 2, name: "Spinach", calories: 450 }
        ],
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function () {
            return state.items;
        },
        addItem: function (name, calories) {
            let ID;
            if (state.items.length > 0) {
                ID = state.items[state.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            const newItem = new Item(ID, name, calories);

            state.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            return state.items.find(item => item.id === id)
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories);

            let found = null;

            for (item of state.items) {
                if (item.id === state.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                    break;
                }
            };

            return found;
        },
        deleteItem: function (id) {
            state.items = state.items.filter(item => item.id !== id)
        },
        setCurrentItem: function (item) {
            state.currentItem = item;
        },
        getCurrentItem: function () {
            return state.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            state.items.forEach(item => total += item.calories);

            state.totalCalories = total;

            return state.totalCalories;
        },
        clearAllItems: function () {
            state.items = [];
        },
        logState: function () {
            return state;
        }
    };
})();

const UICtrl = (function () {

    const UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    };

    return {
        populateItemList: function (items) {
            let html = "";

            items.forEach(item => {
                html += `
                    <li id="item-${item.id}" class="collection-item">
                        <strong>${item.name}: </strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="fa fa-pencil edit-item"></i>
                        </a>
                    </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem: function (item) {

            document.querySelector(UISelectors.itemList).style.display = "block";

            const li = document.createElement("li");

            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="fa fa-pencil edit-item"></i>
                </a>
            `;

            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            for (let listItem of listItems) {
                const itemId = listItem.getAttribute("id");

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `
                        <strong>${item.name}: </strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="fa fa-pencil edit-item"></i>
                        </a>
                    `;

                    break;
                }
            }
        },
        deleteListItem: function (id) {
            document.querySelector(`#item-${id}`).remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },
        hidelist: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = "inline";
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
        },
        showEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = "none";
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
        },
        removeItems: function () {
            const list = document.querySelector(UISelectors.itemList);

            list.innerHTML = "";
        },
        getSelectors: function () {
            return UISelectors;
        }
    };
})();

const App = (function (ItemCtrl, UICtrl) {

    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    };

    const itemAddSubmit = function (e) {

        const input = UICtrl.getItemInput();

        if (input.name !== "" && input.calories !== "") {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearInput();
        }

        e.preventDefault();
    };

    const itemEditClick = function (e) {

        if (e.target.classList.contains("edit-item")) {

            const listId = e.target.parentNode.parentNode.id;

            const listIdArr = listId.split("-");

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    const itemUpdateSubmit = function (e) {

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    const itemDeleteSubmit = function (e) {
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    const clearAllItemsClick = function () {
        ItemCtrl.clearAllItems();

        UICtrl.removeItems();
        UICtrl.hidelist();
        UICtrl.showTotalCalories(0);
    };

    return {
        init: function () {
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            if (items.length === 0) {
                UICtrl.hidelist();
            } else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    };

})(ItemCtrl, UICtrl);

App.init();