//SVI POTREBNI ELEMENTI:
const userInput = document.querySelector(".input-field textarea");

const list = document.querySelector(".todoLists");

const item = document.querySelectorAll(".list");

const pendingNum = document.querySelector(".pending-num");

const clearButton = document.querySelector(".clear-button");

const cb = document.querySelectorAll("input");


deleteAllItems();



//DODAVANJE TEKSTA UPISANOG U "INPUT-FIELD TEXTAREA", U LISTU, PRITISKOM TASTERA ENTER:

function addListItem(){
    userInput.addEventListener("keypress", function(event){
        if(event.keyCode == 13){
            event.preventDefault(); //resava problem sa kursorom nakon enter
            let newListItem = createListItem(userInput.value);
            list.appendChild(newListItem);
           userInput.value = "";
           updatePendingTaskAndSaveToStorage();

        }

    })

    
}

//DINAMICKI KREIRAN LIST ITEM

function createListItem(text){

    const newItem = document.createElement("li"); //PARENT ELEMENT KOJI SADRZI ELEMENTE CHECKBOX I SPAN!!

    const newCb = document.createElement("input");
    newCb.type = "checkbox";
    newCb.addEventListener("change", toggleDone);
    newItem.appendChild(newCb);

    const newSpan = document.createElement("span");
    newSpan.textContent = text;
    newSpan.setAttribute("class","task");
    newItem.appendChild(newSpan);
    
    const trash = document.createElement("i");
    trash.className = "uil uil-trash-alt";
    trash.addEventListener("click", deleteItem);
    newItem.appendChild(trash);

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "editButtonClass";
    edit.addEventListener("click", editItem);
    newItem.appendChild(edit);


    newItem.setAttribute("class","list");
    saveTasksToLocalStorage();
    
    return newItem;

   

}

addListItem();

// TASK IS DONE (ova f-ja ce se implicitno pozivati unutar eventListenera postavljenog prilikom svakog kreiranja novog elemnta u funkciji ADD ITEM)

function toggleDone(event){
    const checkbox = event.target;
    const spanDone = checkbox.nextElementSibling; // Pronalazi sledeći sibling element (span) čekiranog checkbox-a
    spanDone.classList.toggle("done");
    updatePendingTaskAndSaveToStorage();
} 

//DELETE ITEM - TRASH ICON 

function deleteItem(event){
    const trash = event.target; 
    const deletedItem = trash.parentNode; //child element
    list.removeChild(deletedItem); // list je parent element za deletedItem 
    updatePendingTaskAndSaveToStorage();

}

//PENDING TASKS...

function updatePendingTaskAndSaveToStorage(){
    const item = document.querySelectorAll(".list");
    let listLen = 0;
    for(let i = 0; i < item.length; i++){
        if(!item[i].querySelector(".task").classList.contains("done")) {
            listLen++;
        }
    }
    if(listLen === 0){
        pendingNum.textContent = "no";
    }else {
    pendingNum.textContent = listLen;
    }
    saveTasksToLocalStorage();
}

//EDIT ITEMS BUTTON - INPUT FIELD NACIN

//function editItem(event){
   // const editButton = event.target;
    //const listItem = editButton.parentNode;
    //const textSpan = listItem.querySelector(".task"); //referenca na html element - span (sa klasom .task), koji predstavlja tekst itema

   // const inputField = document.createElement("input");
   // inputField.type = "text";
    //inputField.value = textSpan.textContent;

   //if (editButton.textContent === "Edit") {
     //   event.preventDefault();
       // const textSpan = listItem.firstElementChild;
        //const inputField = document.createElement("input");
        //inputField.type = "text";
       // inputField.value = textSpan.textContent;
      //  listItem.insertBefore(inputField, textSpan);
        //listItem.removeChild(textSpan);
      //  editButton.textContent = "Save";
    //} else if (editButton.textContent === "Save") {
  //      event.preventDefault();
//        const inputField = listItem.firstElementChild;
        //const textSpan = document.createElement("span")
        //textSpan.textContent = inputField.value;
        //listItem.insertBefore(textSpan, inputField);
      //  listItem.removeChild(inputField);
    //    editButton.textContent = "Edit";
  //  }
//}

//EDIT ITEMS - CONTENTEDITABLE NACIN - ne radi lepo

function editItem(event){
    event.preventDefault();
    const editButton = event.target;
    const listItem = editButton.parentNode;
    const textSpan = listItem.querySelector(".task");
    if (textSpan.contentEditable === "false" || textSpan.contentEditable === "inherit") {
        textSpan.contentEditable = "true";
        editButton.textContent = "Save";
    } else {
        textSpan.contentEditable = "false";
        editButton.textContent = "Edit";
        saveTasksToLocalStorage();
    }
    textSpan.focus();
    textSpan.classList.toggle("editable");
    
    
}

//DELETE ALL BUTTON
function deleteAllItems() {
    const deleteAllButton = document.querySelector(".clear-button");
    deleteAllButton.addEventListener("click", function () {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        updatePendingTaskAndSaveToStorage();
    });
}


//LOCAL STORAGE
//f-ju za cuvanje pozivamo u funkciji za dodavanje novih itema
function saveTasksToLocalStorage(){
    const tasks =[];
    const allTasks = document.querySelectorAll(".list");
    allTasks.forEach(task => {
        const taskText = task.querySelector(".task").textContent;
        const taskDone = task.querySelector("input[type='checkbox']").checked;
        tasks.push({ text: taskText, status: taskDone });
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

    window.addEventListener("load", function () {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")); // Povlačimo sačuvane zadatke iz lokalnog skladišta

    if (savedTasks) {
        savedTasks.forEach(task => {
            let newListItem = createListItem(task.text);
            list.appendChild(newListItem);
            const checkbox = newListItem.querySelector("input[type='checkbox']");
            checkbox.checked = task.status;
            const textSpan = newListItem.querySelector(".task");
            if (checkbox.checked) {
                textSpan.classList.add("done");
            } else {
                textSpan.classList.remove("done");
            }
        });
    }

    updatePendingTaskAndSaveToStorage();
});
