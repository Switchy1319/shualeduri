let entryForm = document.getElementById('add-list');
let todoListContainer = document.getElementById('list');
let errorIcon = document.querySelector('.error-img');
let entryFieldCheckbox = document.querySelector('.entry-field .checkbox');
let todoSection = document.querySelector('.todo-section')
let numberOfListCreated = [];

let body = document.querySelector('body');
let toggleButton = document.querySelector('.toggle-appearance-btn');

toggleButton.addEventListener('click', function() {
    body.classList.toggle('dark');
    saveDarkModeToLocalStorage();
});

document.addEventListener('DOMContentLoaded', () => {
    displaySavedTasks();
    displayCheckedTasks();
    displayInDarkMode();
})

function showError() {
    entryForm.parentElement.parentElement.classList.add('error');
    
    entryFieldCheckbox.classList.add('hide');

    entryForm.querySelector('input[type="text"]').classList.add('error');
    entryForm.querySelector('input[type="text"]').placeholder = 'Dawere rame';    

}

function showErrorInCompletedTasks() {
    entryForm.parentElement.parentElement.classList.add('error');

    errorIcon.classList.add('show-error');
    entryFieldCheckbox.classList.add('hide');

    entryForm.querySelector('input[type="text"]').classList.add('error');
    entryForm.querySelector('input[type="text"]').value === " ";
    entryForm.querySelector('input[type="text"]').placeholder = 'Cannot create a completed task';

    setTimeout(removeError, 1500)
}

function removeError() {
    entryForm.parentElement.parentElement.classList.remove('error');
    errorIcon.classList.remove('show-error');
    entryFieldCheckbox.classList.remove('hide');
    entryForm.querySelector('input[type="text"]').classList.remove('error')
    entryForm.querySelector('input[type="text"]').placeholder = 'Create a new task...';
}

function displayTodoList() {
    let entryFormValue = entryForm.querySelector('input[type="text"]').value;

    if(entryFormValue == '') {
        showError();
    } else if (allTasksFilter === false && activeTasksFilter === false && completedTasksFilter === true){
        showErrorInCompletedTasks();
    } else {
        removeError();

        let listFieldContainer = document.createElement('div'); 
        let listField = document.createElement('div');         
        let checkBox = document.createElement('div');          
        let checkmark = document.createElement('img');         
        let inputField = document.createElement('div');         
        let listInput = document.createElement('input');        
        let deleteBtn = document.createElement('button');       
        let deleteIcon = document.createElement('img');         


        listFieldContainer.setAttribute('class', 'todo-section__list-field-container')

        listField.setAttribute('class', 'list-field');
        checkBox.setAttribute('class', 'checkbox');
        checkBox.setAttribute('onclick', 'isChecked(event); isnNotChecked(event)');

        checkmark.setAttribute('src', 'images/icon-check.svg');
        checkmark.setAttribute('class', 'check-mark');

        inputField.setAttribute('class', 'input-field');
        listInput.setAttribute('id', 'list-text');
        listInput.setAttribute('type', 'text');
        listInput.setAttribute('value', entryFormValue);

        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.setAttribute('onclick', 'deleteList(event, numberOfListCreated)');
        deleteIcon.setAttribute('src', 'images/icon-cross.svg');

        checkBox.appendChild(checkmark);
        listField.appendChild(checkBox);

        inputField.appendChild(listInput);
        listField.appendChild(inputField);

        deleteBtn.appendChild(deleteIcon);
        listField.appendChild(deleteBtn);

        listFieldContainer.appendChild(listField)
        todoListContainer.appendChild(listFieldContainer);

        document.getElementById('entry-text').value = '';

        numberOfListCreated.push(listFieldContainer);
        console.log(numberOfListCreated);

        saveTasks(entryFormValue);
      

        itemsLeftCount(unCompletedTodoLists.length + 1);

        filterActiveLists();

        if(allTasksFilter === false && activeTasksFilter === true && completedTasksFilter === false) {
            for(let i = 0; i < unCompletedTodoLists.length; i++) {
                unCompletedTodoLists[i].firstChild.firstChild.setAttribute('onclick', unCompletedTodoLists[i].firstChild.firstChild.getAttribute('onclick') + '; removeCheckedLists(event)')
            }
        } 

    }; 

    return false;
}



function deleteList(event) {

    event.target.parentElement.parentElement.parentElement.remove();

    let countValue = unCompletedTodoLists.length - 1
    for(let i = 0; i < numberOfListCreated.length; i++) {
        if(!event.target.parentElement.parentElement.firstChild.classList.contains('checked')){
            if(countValue == 1) {
                listCount.textContent = `${countValue} item left`;
            } else {
                listCount.textContent = `${countValue} items left`;
            }
        }


        if(event.target.parentElement.parentElement.parentElement == numberOfListCreated[i]) {
            numberOfListCreated.splice(numberOfListCreated.indexOf(event.target.parentElement.parentElement.parentElement), 1)
        }
    }

    for(let j = 0; j < completedTodoLists.length; j++) {
        if(event.target.parentElement.parentElement.parentElement == completedTodoLists[j]) {
            completedTodoLists.splice(completedTodoLists.indexOf(event.target.parentElement.parentElement.parentElement), 1)
        }
    }

    for(let k = 0; k < unCompletedTodoLists.length; k++) {
        if(event.target.parentElement.parentElement.parentElement == unCompletedTodoLists[k]) {
            unCompletedTodoLists.splice(unCompletedTodoLists.indexOf(event.target.parentElement.parentElement.parentElement), 1)
        }
    }

    removeSavedTasks(event);

    removeCheckedAndDeletedTasks(event);
}

let completedTodoLists = [];

function isChecked(event) {
    if(!event.target.classList.contains('checked')) {

        event.target.classList.add('checked');

        event.target.firstChild.classList.add('checked');

        event.target.nextElementSibling.firstChild.classList.add('strike-through');

        completedTodoLists.push(event.target.parentElement.parentElement);

        saveCheckedTasks(event);

        let decrementCount = numberOfListCreated.length - completedTodoLists.length;

        if(decrementCount == 1) {
            listCount.textContent = `${decrementCount} item left`;
        } else {
            listCount.textContent = `${decrementCount} items left`;
        }
        
    } else {

        event.target.parentElement.classList.remove('checked');

        event.target.classList.remove('checked');

        event.target.parentElement.nextElementSibling.firstChild.classList.remove('strike-through');
        

        for(let i = 0; i < completedTodoLists.length; i++) {
            if(event.target.parentElement.parentElement.parentElement == completedTodoLists[i]) {
                completedTodoLists.splice(completedTodoLists.indexOf(event.target.parentElement.parentElement.parentElement), 1);
            }
        }

        removeCheckedTasksOnly(event);

        let incrementCount = numberOfListCreated.length - completedTodoLists.length;

        if(incrementCount == 1) {
            listCount.textContent = `${incrementCount} item left`;
        } else {
            listCount.textContent = `${incrementCount} items left`;
        }
    }
}

let unCompletedTodoLists = [];

function isnNotChecked(event) {
    for(let i = 0; i < numberOfListCreated.length; i++) {
        if(!unCompletedTodoLists.includes(numberOfListCreated[i]) && !numberOfListCreated[i].firstChild.firstChild.classList.contains('checked')) {
            unCompletedTodoLists.push(numberOfListCreated[i]);
        }
    }

    for(let j = 0; j < unCompletedTodoLists.length; j++) {
        if(event.target.parentElement.parentElement == unCompletedTodoLists[j]) {
            unCompletedTodoLists.splice(unCompletedTodoLists.indexOf(event.target.parentElement.parentElement), 1)
        } 
    }
}

function filterActiveLists() {
    for(let i = 0; i < numberOfListCreated.length; i++) {
        if(!unCompletedTodoLists.includes(numberOfListCreated[i]) && !numberOfListCreated[i].firstChild.firstChild.classList.contains('checked')) {
            unCompletedTodoLists.push(numberOfListCreated[i]);
        }
    }
}

let clearCompletedButton = document.querySelector('.clear-completed-btn p');
clearCompletedButton.addEventListener('click', clearCompletedLists);

function clearCompletedLists() {
    for(let i = numberOfListCreated.length - 1; i >= 0; i--) {
        if(numberOfListCreated[i].firstChild.firstChild.classList.contains('checked')) {
            numberOfListCreated[i].remove();

            numberOfListCreated.splice(numberOfListCreated.indexOf(numberOfListCreated[i]), 1)
        }
    }

    if(unCompletedTodoLists.length == 1) {
        listCount.textContent = `${unCompletedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${unCompletedTodoLists.length} items left`;
    }

    for(let j = 0; j < completedTodoLists.length; j++) {
        completedTodoLists.splice(completedTodoLists[j].firstChild.firstChild);
    }

    
    removeAllCompletedTasks();
}

let desktopListPreference = document.querySelectorAll('.list-preference p');
let allList = document.querySelector('.list-preference .all');
let activeList = document.querySelector('.list-preference .active');
let completedList = document.querySelector('.list-preference .completed');

let mobileListPreference = document.querySelectorAll('.mobile-list-preference p');
let allMobileList = document.querySelector('.mobile-list-preference .all');
let activeMobileList = document.querySelector('.mobile-list-preference .active');
let completedMobileList = document.querySelector('.mobile-list-preference .completed');


desktopListPreference.forEach(listPreference => {
    listPreference.addEventListener('click', function() {
        if(listPreference.classList.contains('all')) {
            invokeAllList();
            selectAllList();
        } else if (listPreference.classList.contains('active')) {
            invokeActiveList();
        } else if (listPreference.classList.contains('completed')) {
            invokeCompletedList();
        } else {
            return;
        }
    })
});

let allTasksFilter = false;
let activeTasksFilter = false;
let completedTasksFilter = false;

function invokeAllList() {
    allList.classList.add('active-state');
    activeList.classList.remove('active-state');
    completedList.classList.remove('active-state');

    allTasksFilter = true;
    activeTasksFilter = false;
    completedTasksFilter = false;
    
    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');
    
    if(allTasksFilter == true && activeTasksFilter == false && completedTasksFilter == false) {
        clearCompletedBtn.addEventListener('click', function() {
            if(unCompletedTodoLists.length == 1) {
                listCount.textContent = `${unCompletedTodoLists.length} item left`;
            } else {
                listCount.textContent = `${unCompletedTodoLists.length} items left`;
            }
        })

        let deletButtons = document.querySelectorAll('.delete-btn img')
        deletButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', function() {
                if(unCompletedTodoLists.length == 1) {
                    listCount.textContent = `${unCompletedTodoLists.length} item left`
                } else {
                    listCount.textContent = `${unCompletedTodoLists.length} items left`
                }
            })
        })
    }
}

invokeAllList();

function invokeActiveList() {
    allList.classList.remove('active-state');
    activeList.classList.add('active-state');
    completedList.classList.remove('active-state');

    while(todoListContainer.hasChildNodes()) {
        todoListContainer.removeChild(todoListContainer.firstChild);
    }

    for(let i = 0; i < unCompletedTodoLists.length; i++) {
        todoListContainer.appendChild(unCompletedTodoLists[i]);

        unCompletedTodoLists[i].firstChild.firstChild.setAttribute('onclick', unCompletedTodoLists[i].firstChild.firstChild.getAttribute('onclick') + '; removeCheckedLists(event)')
    }

    if(unCompletedTodoLists.length == 1) {
        listCount.textContent = `${unCompletedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${unCompletedTodoLists.length} items left`;
    }

    allTasksFilter = false;
    activeTasksFilter = true;
    completedTasksFilter = false;

    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');

    if(allTasksFilter == false && activeTasksFilter == true && completedTasksFilter == false) {
        clearCompletedBtn.addEventListener('click', function() {
            if(unCompletedTodoLists.length == 1) {
                listCount.textContent = `${unCompletedTodoLists.length} item left`;
            } else {
                listCount.textContent = `${unCompletedTodoLists.length} items left`;
            }
        })
    }
}

function invokeCompletedList() {
    allList.classList.remove('active-state');
    activeList.classList.remove('active-state');
    completedList.classList.add('active-state');

    while(todoListContainer.hasChildNodes()) {
        todoListContainer.removeChild(todoListContainer.firstChild)
    }

    for(let i = 0; i < completedTodoLists.length; i++) {
        todoListContainer.appendChild(completedTodoLists[i]);

        completedTodoLists[i].firstChild.firstChild.setAttribute('onclick', completedTodoLists[i].firstChild.firstChild.getAttribute('onclick') + '; removeUncheckedLists(event)');
    }

    if(completedTodoLists.length == 1) {
        listCount.textContent = `${completedTodoLists.length} item left`;
    } else { 
        listCount.textContent = `${completedTodoLists.length} items left`;
    }

    allTasksFilter = false;
    activeTasksFilter = false;
    completedTasksFilter = true;

    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');

    if(allTasksFilter == false && activeTasksFilter == false && completedTasksFilter == true) {
        clearCompletedBtn.addEventListener('click', function() {
            listCount.textContent = `0 items left`;
        })
        
        let deletButtons = document.querySelectorAll('.delete-btn img')
        let newCount;
        deletButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', function() {
                newCount = completedTodoLists.length - 1
                if(newCount == 1) {
                    listCount.textContent = `${newCount} item left`
                } else {
                    listCount.textContent = `${newCount} items left`
                }
            })
        })
    } 
} 

mobileListPreference.forEach(listPreference => {
    listPreference.addEventListener('click', function(event) {
        if(listPreference.classList.contains('all')) {
            invokeAllMobileList();
            selectAllList();
        } else if (listPreference.classList.contains('active')) {
            invokeActiveMobileList();
        } else if (listPreference.classList.contains('completed')) {
            invokeCompletedMobileList(event);
        } else {
            return;
        }
    })
});

function invokeAllMobileList() {
    allMobileList.classList.add('active-state');
    activeMobileList.classList.remove('active-state');
    completedMobileList.classList.remove('active-state');

    allTasksFilter = true;
    activeTasksFilter = false;
    completedTasksFilter = false;

    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');
    
    if(allTasksFilter == true && activeTasksFilter == false && completedTasksFilter == false) {
        clearCompletedBtn.addEventListener('click', function() {
            if(unCompletedTodoLists.length == 1) {
                listCount.textContent = `${unCompletedTodoLists.length} item left`;
            } else {
                listCount.textContent = `${unCompletedTodoLists.length} items left`;
            }
        })

        let deletButtons = document.querySelectorAll('.delete-btn img')
        deletButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', function() {
                if(unCompletedTodoLists.length == 1) {
                    listCount.textContent = `${unCompletedTodoLists.length} item left`
                } else {
                    listCount.textContent = `${unCompletedTodoLists.length} items left`
                }
            })
        })
    }
}

invokeAllMobileList();

function selectAllList() {
    for(let i = 0; i < numberOfListCreated.length; i++) {
        numberOfListCreated[i].firstChild.firstChild.setAttribute('onclick', 'isChecked(event); isnNotChecked(event)');
    }
    todoListContainer.replaceChildren(...numberOfListCreated);


    if(unCompletedTodoLists.length == 1) {
        listCount.textContent = `${unCompletedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${unCompletedTodoLists.length} items left`;
    }
}

function invokeActiveMobileList() {
    allMobileList.classList.remove('active-state');
    activeMobileList.classList.add('active-state');
    completedMobileList.classList.remove('active-state');

    while(todoListContainer.hasChildNodes()) {
        todoListContainer.removeChild(todoListContainer.firstChild);
    }

    for(let i = 0; i < unCompletedTodoLists.length; i++) {
        todoListContainer.appendChild(unCompletedTodoLists[i]);

        unCompletedTodoLists[i].firstChild.firstChild.setAttribute('onclick', unCompletedTodoLists[i].firstChild.firstChild.getAttribute('onclick') + '; removeCheckedLists(event)')
    }


    if(unCompletedTodoLists.length == 1) {
        listCount.textContent = `${unCompletedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${unCompletedTodoLists.length} items left`;
    }

    allTasksFilter = false;
    activeTasksFilter = true;
    completedTasksFilter = false;

    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');

    if(allTasksFilter == false && activeTasksFilter == true && completedTasksFilter == false) {
        clearCompletedBtn.addEventListener('click', function() {
            if(unCompletedTodoLists.length == 1) {
                listCount.textContent = `${unCompletedTodoLists.length} item left`;
            } else {
                listCount.textContent = `${unCompletedTodoLists.length} items left`;
            }
        })
    }
}

function invokeCompletedMobileList() {
    allMobileList.classList.remove('active-state');
    activeMobileList.classList.remove('active-state');
    completedMobileList.classList.add('active-state');

    while(todoListContainer.hasChildNodes()) {
        todoListContainer.removeChild(todoListContainer.firstChild)
    }

    for(let i = 0; i < completedTodoLists.length; i++) {
        todoListContainer.appendChild(completedTodoLists[i]);

        completedTodoLists[i].firstChild.firstChild.setAttribute('onclick', completedTodoLists[i].firstChild.firstChild.getAttribute('onclick') + '; removeUncheckedLists(event)');
    }

    if(completedTodoLists.length == 1) {
        listCount.textContent = `${completedTodoLists.length} item left`;
    } else { 
        listCount.textContent = `${completedTodoLists.length} items left`;
    }

    allTasksFilter = false;
    activeTasksFilter = false;
    completedTasksFilter = true;

    let clearCompletedBtn = document.querySelector('.clear-completed-btn p');

    if(allTasksFilter == false && activeTasksFilter == false && completedTasksFilter == true) {
        clearCompletedBtn.addEventListener('click', function() {
            listCount.textContent = `0 items left`;
        })

        let deletButtons = document.querySelectorAll('.delete-btn img')
        let newCount;
        deletButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', function() {
                newCount = completedTodoLists.length - 1
                if(newCount == 1) {
                    listCount.textContent = `${newCount} item left`
                } else {
                    listCount.textContent = `${newCount} items left`
                }
            })
        })
    } 
}

function removeCheckedLists(event) {
    if(event.target.classList.contains('checked')) {
        event.target.removeAttribute('onclick');

        event.target.parentElement.parentElement.remove();

        event.target.setAttribute('onclick', 'isChecked(event); isnNotChecked(event)');
    }

    if(unCompletedTodoLists.length == 1) {
        listCount.textContent = `${unCompletedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${unCompletedTodoLists.length} items left`;
    }
}

function removeUncheckedLists(event) {
    if(!event.target.parentElement.classList.contains('checked')) {
        event.target.parentElement.removeAttribute('onclick');

        event.target.parentElement.parentElement.parentElement.remove();

        event.target.parentElement.setAttribute('onclick', 'isChecked(event); isnNotChecked(event)');
    }
    
    if(completedTodoLists.length == 1) {
        listCount.textContent = `${completedTodoLists.length} item left`;
    } else {
        listCount.textContent = `${completedTodoLists.length} items left`;
    }
}

let listCount = document.querySelector('.todo-count');

function itemsLeftCount(count) {
    if(count === 1) {
        listCount.textContent = `${count} item left`;
    } else {
        listCount.textContent = `${count} items left`;
    }
}









function saveTasks(formValue) {
    let values;
    if(localStorage.getItem('myTasks') == null) {
        values = [];
    } else {
        values = JSON.parse(localStorage.getItem('myTasks'))
    }

    values.push(formValue)
    
    localStorage.setItem('myTasks', JSON.stringify(values))
}


function saveDarkModeToLocalStorage() {
    let theme = localStorage.getItem('pageTheme')
    if(theme == null) {
        localStorage.setItem('pageTheme', 'dark')
    } else {
        localStorage.removeItem('pageTheme')
    }
}

function displayInDarkMode() {
    let theme = localStorage.getItem('pageTheme')
    if(theme == 'dark') {
        body.classList.add('dark')
    } else {
        body.classList.remove('dark');
    }
}

function displaySavedTasks() {
    let values;
    if(localStorage.getItem('myTasks') == null) {
        values = [];
    } else {
        values = JSON.parse(localStorage.getItem('myTasks'))
    }

    values.forEach(listValue => {
        let listFieldContainer = document.createElement('div'); r
        let listField = document.createElement('div');         
        let checkBox = document.createElement('div');         
        let checkmark = document.createElement('img');        
        let inputField = document.createElement('div');         
        let listInput = document.createElement('input');           
        let deleteBtn = document.createElement('button');       
        let deleteIcon = document.createElement('img');         

        listFieldContainer.setAttribute('class', 'todo-section__list-field-container')

        listField.setAttribute('class', 'list-field');
        checkBox.setAttribute('class', 'checkbox');
        checkBox.setAttribute('onclick', 'isChecked(event); isnNotChecked(event)');

        checkmark.setAttribute('src', 'images/icon-check.svg');
        checkmark.setAttribute('class', 'check-mark');

        inputField.setAttribute('class', 'input-field');
        listInput.setAttribute('id', 'list-text');
        listInput.setAttribute('type', 'text');
        listInput.setAttribute('value', listValue);

        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.setAttribute('onclick', 'deleteList(event, numberOfListCreated)');
        deleteIcon.setAttribute('src', 'images/icon-cross.svg');

        checkBox.appendChild(checkmark);
        listField.appendChild(checkBox);

        inputField.appendChild(listInput);
        listField.appendChild(inputField);

        deleteBtn.appendChild(deleteIcon);
        listField.appendChild(deleteBtn);

        listFieldContainer.appendChild(listField)
        todoListContainer.appendChild(listFieldContainer);

        numberOfListCreated.push(listFieldContainer)
    })
}
function removeSavedTasks(event) {
    let values;
    if(localStorage.getItem('myTasks') == null) {
        values = [];
    } else {
        values = JSON.parse(localStorage.getItem('myTasks'))
    }

    if(values.includes(event.target.parentElement.previousElementSibling.firstChild.value)) {
        values.splice(values.indexOf(event.target.parentElement.previousElementSibling.firstChild.value), 1)
    }

    localStorage.setItem('myTasks', JSON.stringify(values))
}

function saveCheckedTasks(event) {
    let checkedValues;
    if(localStorage.getItem('completedTasks') == null) {
        checkedValues = [];
    } else {
        checkedValues = JSON.parse(localStorage.getItem('completedTasks'))
    }

    if(event.target.classList.contains('checked') && !checkedValues.includes(event.target.nextElementSibling.firstChild.value)) {
        checkedValues.push(event.target.nextElementSibling.firstChild.value)
    }

    localStorage.setItem('completedTasks', JSON.stringify(checkedValues))
}

function displayCheckedTasks() {
    let checkedValues;
    if(localStorage.getItem('completedTasks') == null) {
        checkedValues = [];
    } else {
        checkedValues = JSON.parse(localStorage.getItem('completedTasks'))
    }

    let newCount = [];

    numberOfListCreated.some(todoListWrapper => {
        if(checkedValues.includes(todoListWrapper.firstChild.firstChild.nextElementSibling.firstChild.value)) {
            todoListWrapper.firstChild.firstChild.classList.add('checked');
            todoListWrapper.firstChild.firstChild.firstChild.classList.add('checked');
            todoListWrapper.firstChild.firstChild.nextElementSibling.firstChild.classList.add('strike-through')

            completedTodoLists.push(todoListWrapper)
        } else {
            newCount.push(todoListWrapper.firstChild.firstChild.nextElementSibling.firstChild.value)

            unCompletedTodoLists.push(todoListWrapper)
        }
    })

    if(newCount.length == 1) {
        listCount.textContent = `${newCount.length} item left` 
    } else {
        listCount.textContent = `${newCount.length} items left` 
    }
}

function removeCheckedTasksOnly(event) {
    let checkedValues;
    if(localStorage.getItem('completedTasks') == null) {
        checkedValues = [];
    } else {
        checkedValues = JSON.parse(localStorage.getItem('completedTasks'))
    }

    if(checkedValues.includes(event.target.parentElement.nextElementSibling.firstChild.value)) {
        checkedValues.splice(checkedValues.indexOf(event.target.parentElement.nextElementSibling.firstChild.value), 1)
    }

    localStorage.setItem('completedTasks', JSON.stringify(checkedValues))
}

function removeCheckedAndDeletedTasks(event) {
    let checkedValues;
    if(localStorage.getItem('completedTasks') == null) {
        checkedValues = [];
    } else {
        checkedValues = JSON.parse(localStorage.getItem('completedTasks'))
    }

    if(checkedValues.includes(event.target.parentElement.previousElementSibling.firstChild.value)) {
        checkedValues.splice(checkedValues.indexOf(event.target.parentElement.previousElementSibling.firstChild.value), 1)
    }

    localStorage.setItem('completedTasks', JSON.stringify(checkedValues))
}

function removeAllCompletedTasks() {
    let checkedValues;
    if(localStorage.getItem('completedTasks') == null) {
        checkedValues = [];
    } else {
        checkedValues = JSON.parse(localStorage.getItem('completedTasks'))
    }

    let values = JSON.parse(localStorage.getItem('myTasks'))

    for(let i = values.length - 1; i >= 0; i-- ) {
        if(checkedValues.includes(values[i])) {
            values.splice(values.indexOf(values[i]), 1)
        }
    }

    checkedValues = [];

    localStorage.setItem('myTasks', JSON.stringify(values))
    localStorage.setItem('completedTasks', JSON.stringify(checkedValues))
}

