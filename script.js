let nbTask = 0;
let taskList = [];
class task {
    constructor(id, description, status) {
        this.id = id;
        this.description = description;
        this.status = status;
    }
}


function getTaskForm(){
    const taskForm  = document.querySelector("#taskForm")
    window["task" + nbTask+1] = new task(nbTask+1, taskForm[0].value, true);
    console.log(window["task" + nbTask+1].description);
    console.log(nbTask)
    taskList.push(window["task" + nbTask+1]);
    taskForm.reset();
    nbTask++;
}

function displayTask(){
    const tableBody = document.getElementById("taskTableBody");
    tableBody.innerHTML = "";
    const taskListBody = taskList.map(function(argTask){
        let toDo = ""
        let toDoClass = ""
        if(argTask.status==true){
            toDo = "A faire"
            toDoClass = "toDo"
        } else {
            toDo = "Fait"
            toDoClass = "Done"
        }
        return `<tr><td class=${toDoClass}>${toDo}</td><td>${argTask.description}</td></tr>`;
    }).join("\r\n");
    tableBody.innerHTML = taskListBody;
}


const taskSubmit = document.querySelector("#submitButton");
taskSubmit.addEventListener("click", function(){
    getTaskForm();
    displayTask(taskList);
})

const taskSubmitKey  = document.querySelector("#taskDescription");
taskSubmitKey.addEventListener("keypress", function(e){
    if(e.keyCode == 13){
        getTaskForm();
        displayTask(taskList);
        e.preventDefault()
    }

})