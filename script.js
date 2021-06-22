let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
let editMode = false;
let valueNewInput = '';
window.onload = async function init() {
    input = document.querySelector('.add-task')
    input.addEventListener('change', updateValue)
    const response = await fetch('http://localhost:8000/allTasks', {method: 'GET'})
    let result = await response.json()
    allTasks = result.data;
    render()
}


onClickButton = async () => {
    allTasks.push({
        text: valueInput,
        isCheck: false,
    })
    const response = await fetch('http://localhost:8000/createTask',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: valueInput,
                isCheck: false
            })
        },
    )
    let result = await response.json()
    allTasks = result.data;
    console.log(allTasks)
    localStorage.setItem('tasks', JSON.stringify(allTasks))
    valueInput = '';
    input.value = '';
    render()
}


updateValue = (e) => {
    valueInput = e.target.value;

}
console.log(allTasks)
render = () => {
    const content = document.querySelector('#content-page');
    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }

    allTasks.map((task, index) => {
        const container = document.createElement('div')
        const checkbox = document.createElement('input')
        container.id = `task - ${index}`;
        checkbox.type = 'checkbox';
        checkbox.onchange = function () {
            onChangeCheckbox(index)
        };
        checkbox.checked = task.isCheck;
        container.appendChild(checkbox);
        container.className = 'task-container'

        const text = document.createElement('p')
        text.innerText = task.text;
        text.className = task.isCheck ? 'new-task done' : 'new-task';
        container.appendChild(text);

        let newInput = document.createElement('input')  // input of pencil
        const closeEdit = document.createElement('img')
        newInput.addEventListener('change', changeNewInput)
        closeEdit.src = 'imageTodo/done.png'
        closeEdit.className = 'closeEdit'

        container.appendChild(closeEdit)
        closeEdit.classList.add('hide')
        let imgEdit = document.createElement('img')
        imgEdit.src = 'imageTodo/pencil.png';
        imgEdit.className = 'imgEdit';
        imgEdit.onclick = function (e) {
            newInput.type = 'text'
            newInput.value = text.innerText
            imgEdit.classList.add('hide')
            closeEdit.classList.remove('hide')
            text.replaceWith(newInput)
            // changeTask(task.id, task.isCheck, index, task.text)

        }
        newInput.addEventListener('blur', () => {
            imgEdit.classList.remove('hide')
            closeEdit.classList.add('hide')
            repeatRender(index, valueNewInput, task.id, task.isCheck)
        })
        container.appendChild(imgEdit)

        closeEdit.onclick = function () {
            imgEdit.classList.remove('hide')
            closeEdit.classList.add('hide')
            repeatRender(index, valueNewInput, task.id, task.isCheck)
        }

        const imgDelete = document.createElement('img')
        imgDelete.src = 'imageTodo/cross.png'
        imgDelete.className = 'imgDelete'
        imgDelete.onclick = function () {
            deleteTask(task.id)
        }
        container.appendChild(imgDelete)
        content.appendChild(container);
    })
}
onChangeCheckbox = (index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;

    localStorage.setItem('tasks', JSON.stringify(allTasks))
    render()
}

deleteTask = async (id) => {
    // allTasks.splice(index, 1)
    console.log(id)

    const response = await fetch(`http://localhost:8000/deleteTask?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
        },
    )
    let result = await response.json()
    allTasks = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTasks))
    render()
}

changeNewInput = (e) => {
    valueNewInput = e.target.value

}

hideElement = (element) => {
    element.classList.remove('hide')
    localStorage.setItem('tasks', JSON.stringify(allTasks))
    render()
}

repeatRender = async (index, value, id, isCheck) => {
    allTasks[index].text = value;
    const response = await fetch('http://localhost:8000/updateTask',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                id: id,
                text: value,
                isCheck: isCheck
            })
        },
    )
    let result = await response.json()
    allTasks = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTasks))
    render()
}