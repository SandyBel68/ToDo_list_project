import './style.css';

function createNewTaskElement(taskString, isCompleted) {
  let listItem = document.createElement('li');
  let checkBox = document.createElement('input');
  let label = document.createElement('label');
  let editInput = document.createElement('input');
  let editButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  checkBox.type = 'checkbox';
  if (isCompleted) checkBox.checked = true;
  editInput.type = 'text';
  editButton.innerText = 'Edit';
  editButton.className = 'edit';
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete';
  label.innerText = taskString;
  listItem.className = 'list-item-incomplete';

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

function addTask(text, isCompleted) {
  let listItemName = document.getElementById('new-task').value || text;
  let listItem = createNewTaskElement(listItemName, isCompleted);
  if (isCompleted) {
    document.getElementById('completed-tasks').appendChild(listItem);
  } else {
    document.getElementById('incomplete-tasks').appendChild(listItem);
  }
  addEventsToTask(listItem, taskCompleted);
  document.getElementById('new-task').value = '';
}

function editTask() {
  let listItem = this.parentNode;
  let editInput = listItem.querySelector('input[type=text');
  let label = listItem.querySelector('label');
  let button = listItem.getElementsByTagName('button')[0];

  let containsClass = listItem.classList.contains('editMode');
  if (containsClass) {
    label.innerText = editInput.value;
    button.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    button.innerText = 'Save';
  }
  listItem.classList.toggle('editMode');
}

function deleteTask() {
  let listItem = this.parentNode;
  let ul = listItem.parentNode;
  ul.removeChild(listItem);
}

function taskCompleted() {
  let listItem = this.parentNode;
  listItem.className = 'list-item-complete';
  document.getElementById('completed-tasks').appendChild(listItem);
  addEventsToTask(listItem, taskIncomplete);
}

function taskIncomplete() {
  let listItem = this.parentNode;
  listItem.className = 'list-item-incomplete';
  document.getElementById('incomplete-tasks').appendChild(listItem);
  addEventsToTask(listItem, taskCompleted);
}

function addEventsToTask(taskListItem, checkBoxEventHandler) {
  let checkBox = taskListItem.querySelector('input[type=checkbox]');
  let editButton = taskListItem.querySelector('button.edit');
  let deleteButton = taskListItem.querySelector('button.delete');
  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);
  checkBox.addEventListener('change', checkBoxEventHandler);
}

let addButton = document.getElementsByTagName('button')[0];
addButton.addEventListener('click', addTask, false);

let incompleteTasksHolder = document.getElementById('incomplete-tasks');
for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
  addEventsToTask(incompleteTasksHolder.children[i], taskCompleted);
}

let completedTasksHolder = document.getElementById('completed-tasks');
for (let i = 0; i < completedTasksHolder.children.length; i++) {
  addEventsToTask(completedTasksHolder.children[i], taskIncomplete);
}

function search() {
  let input = document.getElementById('search');
  let filter = input.value.toUpperCase();

  let incompleteTasksHolder = document.getElementById('incomplete-tasks');
  let completedTasksHolder = document.getElementById('completed-tasks');
  const todos = incompleteTasksHolder.getElementsByTagName('li');
  const completed = completedTasksHolder.getElementsByTagName('li');
  const all = [...todos, ...completed];

  for (let i = 0; i < all.length; i++) {
    let li = all[i];
    let label = li.getElementsByTagName('label')[0];
    if (label.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  }
}

let searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', search);

function clearIncomplete() {
  let incompleteTasksHolder = document.getElementById('incomplete-tasks');
  while (incompleteTasksHolder.firstChild) {
    incompleteTasksHolder.removeChild(incompleteTasksHolder.firstChild);
  }
}

let clearOpen = document.getElementById('clearOpen');
clearOpen.addEventListener('click', clearIncomplete);

function clearComplete() {
  let completedTasksHolder = document.getElementById('completed-tasks');
  while (completedTasksHolder.firstChild) {
    completedTasksHolder.removeChild(completedTasksHolder.firstChild);
  }
}

let clearDone = document.getElementById('clearDone');
clearDone.addEventListener('click', clearComplete);

function sortIncompleteFunction() {
  let choice = document.getElementById('Sort-incomplete').value;
  sortIncompleteTasks(choice);
}

let sortIncomplete = document.getElementById('Sort-incomplete');
sortIncomplete.addEventListener('change', sortIncompleteFunction);

function sortIncompleteTasks(order) {
  let stores_li = document.querySelectorAll('.list-item-incomplete');
  [].slice
    .call(stores_li)
    .sort(function(a, b) {
      let textA = a.getElementsByTagName('label')[0].textContent.toLowerCase();
      let textB = b.getElementsByTagName('label')[0].textContent.toLowerCase();
      if (order === 'SortAsc')
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      if (order === 'SortDesc')
        return textA < textB ? 1 : textA > textB ? -1 : 0;
    })
    .forEach(function(el) {
      el.parentNode.appendChild(el);
    });
}

function sortCompleteFunction() {
  let choice = document.getElementById('Sort-complete').value;
  sortCompleteTasks(choice);
}

let sortComplete = document.getElementById('Sort-complete');
sortComplete.addEventListener('change', sortCompleteFunction);

function sortCompleteTasks(order) {
  let stores_li = document.querySelectorAll('.list-item-complete');
  [].slice
    .call(stores_li)
    .sort(function(a, b) {
      let textA = a.getElementsByTagName('label')[0].textContent.toLowerCase();
      let textB = b.getElementsByTagName('label')[0].textContent.toLowerCase();
      if (order === 'SortAsc')
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      if (order === 'SortDesc')
        return textA < textB ? 1 : textA > textB ? -1 : 0;
    })
    .forEach(function(el) {
      el.parentNode.appendChild(el);
    });
}

window.onbeforeunload = function() {
  let incompleteTasks = document.getElementById('incomplete-tasks');
  let lisArrIncomplete = incompleteTasks.getElementsByTagName('li');
  let completedTasks = document.getElementById('completed-tasks');
  let lisArrComplete = completedTasks.getElementsByTagName('li');
  fillInLocalStorage(lisArrIncomplete, false);
  fillInLocalStorage(lisArrComplete, true);

  function fillInLocalStorage(array, isCompleted) {
    for (let i = 0; i < array.length; i++) {
      let labelText = array[i].getElementsByTagName('label')[0].textContent;
      if (isCompleted) localStorage.setItem('complete' + i, labelText);
      else localStorage.setItem('incomplete' + i, labelText);
    }
  }
  return 'Are you sure you want to leave?';
};

function getReload() {
  let labelArrIncomplete = [];
  let labelArrComplete = [];
  for (let localStorageKey in localStorage) {
    if (localStorageKey.startsWith('incomplete'))
      labelArrIncomplete.push(localStorage.getItem(localStorageKey));
    else if (localStorageKey.startsWith('complete'))
      labelArrComplete.push(localStorage.getItem(localStorageKey));
  }

  getElemsFromLocalStorage(labelArrIncomplete, false);
  getElemsFromLocalStorage(labelArrComplete, true);

  function getElemsFromLocalStorage(array, isComplete) {
    for (let i = 0; i < array.length; i++) {
      addTask(array[i], isComplete);
    }
  }

  localStorage.clear();
}

document.addEventListener('DOMContentLoaded', getReload);
