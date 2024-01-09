// Use the ready() function to ensure the document is fully loaded
let tasks = loadTasksFromStorage()
$(document).ready(function () {
    // Your jQuery code goes here
    putListContainer()

    // Add click event handler to the .add-list element
    $(".add-list").click(function () {
        // Toggle the display of the .add-list-window
        $(".add-list-window").css({display: "flex"});
        $(".add-list-input").focus();
    });

    // Add click event handler to the cancel button inside .add-list-window
    $(".cancel").click(function () {
        // Clear the input text
        $(".add-list-input").val('');

        // Hide the .add-list-window
        $(".add-list-window").css({display: "none"});
    });

    // Add click event handler to the create button inside .add-list-window
    $(".create").click(function () {
        if(checkTitleExists($(".add-list-input").val())) {
            console.log("exists!");
            $(".error").fadeIn(2000).delay(500).fadeOut(1000);
            $(".add-list-input").val('');
            return;
        }

        createNewItem();
    });

    // Add keypress event listener to the input field for 'Enter' key
    $(".add-list-input").keypress(function (event) {
        // Check if the pressed key is 'Enter' (key code 13)
        if (event.which === 13) {
            if(checkTitleExists($(".add-list-input").val())) {
                console.log("exists!");
                $(".error").fadeIn(2000).delay(500).fadeOut(1000);
                $(".add-list-input").val('');
                return;
            }

            createNewItem();
        }
    });

    // Function to create a new item
    function createNewItem() {
        // Get the value of the input text
        var title = $(".add-list-input").val();

        // Check if the input text is empty
        if (title.trim() === '') {
            // Show an error message (you can customize this part)
            alert("Please enter a valid task name.");
        } else {
            let todos = [];
            let newTask = {title,todos};

            tasks.push(newTask);
            saveAllTasks(newTask);
            
            // Create a new list-container-item
            var newDiv = '<div class="list-container-item">' +
                '<div class="list-container-item-border selected"></div>' +
                '<i style="color: #8888FF; font-size: 22px;" class="fa-solid fa-bars"></i>' +
                '<p class="list-container-item-name">' + newTask.title + '</p>' +
                '<i style="position: absolute; left: 280px; font-size: 18px;" class="fa-solid fa-trash" id="trash"></i>';
            

                // Here we need to change the structure and istead of newTask.todos.length we need to show the number of true ones
            if(newTask.todos.length>0){
                newDiv+= '<p class="list-container-item-count">' + calculateUndoneTasks(newTask.todos) + '</p>' + 
                '</div>';
            }
            
            newDiv+='</div>';
            
            
            

            // Remove the selected status from the current tab
            $(".selected").removeClass("selected");

            // Append the new item to the list-container
            $(".list-container").append(newDiv);
            // $(".content-list-page").append(newItemContent); faşlksjdfşlasdjşfkljasdşfjkl

            // Show the newly created content page
            $(".content-list-page").css({display: "flex"});
            $(".content-list-page-add-task-input").focus();
            
            // Clear the input text
            $(".add-list-input").val('');

            // Hide the .add-list-window
            $(".add-list-window").css({display: "none"});

            // Hide the project members and display the newly added content
            $(".project-members-content").css({display: "none"});
            
            // Set Event To New List Element
            listContainerEvent();
            refreshContentPanel(newTask);
            
            $(".content-list-page-add-task-input").focus();
        }
    }

    // Contente yeni item ekleme

    // Handle checkbox change event
    $(document).on("change", ".content-list-page-task-checkbox", function (event) {
        // Check if the checkbox is checked
        event.stopPropagation();
        if ($(this).prop("checked")) {
            // Apply the line-through text decoration
            $(this).siblings(".content-list-page-task-name").css("text-decoration", "line-through");

            let deleteTodo = $(this).next().text();
            let title = $(this).parent().parent().parent().find(".content-list-page-heading").text().trim();

            deleteTodoFromTask(title, deleteTodo);
            putListContainer();
        } else {
            // Remove the line-through text decoration
            $(this).siblings(".content-list-page-task-name").css("text-decoration", "none");

            
            
            let addTodo = $(this).next().text();
            let deleteTodo = $(this).next().text();

            let title = $(this).parent().parent().parent().find(".content-list-page-heading").text().trim();

            deleteTodoFromTask(title, deleteTodo);


            console.log(addTodo);
            console.log(title);
            //addTodoToTask(title, addTodo);
            putListContainer();
        }
    });

    // Switching between different tabs
    $(".project-members-control").click(function () {
        // Remove selected class from all tabs
        $(".selected").removeClass("selected");
    
        // Add selected class to the clicked tab
        $(this).addClass("selected");
    
        // Show Project Members content and hide Lists content
        $(".content-list-page").css({display: "none"});
        $(".project-members-content").css({display: "flex"});
    });

    $('.list-container').on('click', '#trash', function(e) {
        e.stopPropagation();
        let previousDiv = $(this).parent().prev();
        let previousTitle = previousDiv.find(".list-container-item-name").text();
        let deleteTitle = $(this).parent().find(".list-container-item-name").text();
        let nextDiv = $(this).parent().next();
        let nextTitle = nextDiv.find(".list-container-item-name").text();
        

        if(nextDiv.length != 0) {
            nextDiv.addClass("selected");
            refreshContentPanel(getObjectByTitle(nextTitle))
            deleteTaskByTitle(deleteTitle);
            $(".content-list-page-add-task-input").focus();
            $(this).parent().remove();
            return;
        } else if(previousDiv.length == 0) {
            $(".project-members-content").css({display: "flex"})
            $(".content-list-page").css({display: "none"})
            deleteTaskByTitle(deleteTitle);
            $(".content-list-page-add-task-input").focus();
            $(this).parent().remove();
            return;
        }

        previousDiv.addClass("selected");
        refreshContentPanel(getObjectByTitle(previousTitle));
        
        deleteTaskByTitle(deleteTitle);
        $(".content-list-page-add-task-input").focus();
        $(this).parent().remove();
    });

    $('.list-container').on('click', '.list-container-item', function(e) {
        let title = $(this).find(".list-container-item-name").text();

        refreshContentPanel(getObjectByTitle(title))
        $(".content-list-page-add-task-input").focus();
    });

   function listContainerEvent() {
    $(".list-container").on("click", ".list-container-item", function () {
        // Remove selected class from all tabs
        $(".selected").removeClass("selected");
    
        // Add selected class to the clicked tab
        $(this).addClass("selected");
    
        // Show Project Members content and hide Lists content
        $(this).css({display: "flex"});
        $(".project-members-content").css({display: "none"});

        $(".content-list-page").css({display: "flex"});
    });
   }

   listContainerEvent();

    function saveAllTasks(task) {
        var tasksArray  = loadTasksFromStorage();
        tasksArray.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasksArray))
    }

    function refreshContentPanel(task) {
        $(".content-list-page").remove();

        let newDiv = `<div class="content-list-page">
            <div class="content-list-page-heading">
                ${task.title}
            </div>
            <div class="content-list-page-task-list">`;

        $.each(task.todos, function(index, value) {
            console.log(value[Object.keys(value)]);
            newDiv += `<label class="content-list-page-task">
            <input class="content-list-page-task-checkbox" type="checkbox" ${ !value[Object.keys(value)] && "checked"}>
            <p style="text-decoration: ${ value[Object.keys(value)] ? "none" : "line-through"}" class="content-list-page-task-name">${Object.keys(value)}</p>
            </label>`;
        });
                
        newDiv += `</div>
            <div class="content-list-page-add-task">
                <i style="position: absolute; padding-left: 18px; font-size: 24px;" class="fa-solid fa-plus"></i>
                <input class="content-list-page-add-task-input" type="text" placeholder="Add a Task">
            </div>
        </div>`;

        $(".content-panel").append(newDiv);

        $(".content-list-page").on("keypress", ".content-list-page-add-task-input", function (event) {
            // Check if the pressed key is 'Enter' (key code 13)
            if (event.which === 13) {
                // Prevent the default behavior of the 'Enter' key
                event.preventDefault();
    
                // Get the value of the input text
                var inputValue = $(this).val();
    
                // Check if the input text is not empty
                if (inputValue.trim() !== '') {
                    // Create a new <p> element with the entered value
                    var newTask = '<label class="content-list-page-task"><input class="content-list-page-task-checkbox" type="checkbox">' +
                        '<p class="content-list-page-task-name">' + inputValue + '</p></label>';
    
                    // Append the new <p> element to the content-list-page-task
                    $(".content-list-page-task-list").append(newTask);
                    console.log($(this).parent().parent().find(".content-list-page-heading").text().trim());

                    addTodoToTask($(this).parent().parent().find(".content-list-page-heading").text().trim(), inputValue);
                    putListContainer();
    
                    // Clear the input text
                    $(this).val('');
                }
            }
        });
    }
});

function loadTasksFromStorage() {
    let data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
}

function getObjectByTitle(titleToFind) {
    // Get the JSON string from localStorage
    var tasksArray  = loadTasksFromStorage();

    // Find the object with the matching title
    var foundObject = tasksArray.find(function(task) {
        return task.title === titleToFind;
    });

    return foundObject;
}

function deleteTaskByTitle(titleToDelete) {
    console.log("task deleted" + titleToDelete);
    // Get the JSON string from localStorage
    var tasksArray  = loadTasksFromStorage();

    // Find the index of the object with the matching title
    var indexToDelete = tasksArray.findIndex(function(task) {
        return task.title === titleToDelete;
    });

    

    if (indexToDelete !== -1) {
        // Remove the object from the array
        tasksArray.splice(indexToDelete, 1);

        // Update the modified array back in localStorage
        localStorage.setItem("tasks", JSON.stringify(tasksArray));

        console.log('Object with title ' + titleToDelete + ' deleted successfully.');
    } else {
        console.log('Object with title ' + titleToDelete + ' not found.');
    }
}

function calculateUndoneTasks(data) {
    let trueCount = 0;

    data.forEach(item => {
        // Her nesnenin içinde dön
        for (const key in item) {
            if (item[key] === true) {
                trueCount++;
            }
        }
    });

    return trueCount;
}

function putListContainer() {
    let tasks = loadTasksFromStorage()


    $(".list-container").html("");

    $.each(tasks, function(index, value) {
        // Create a new list-container-item
        var newDiv = '<div class="list-container-item">' +
        '<div class="list-container-item-border selected"></div>' +
        '<i style="color: #8888FF; font-size: 22px;" class="fa-solid fa-bars"></i>' +
        '<p class="list-container-item-name">' + value.title + '</p>' +
        '<i style="position: absolute; left: 280px; font-size: 18px;" class="fa-solid fa-trash" id="trash"></i>'; 
        if(value.todos.length>0) {
            newDiv+='<p style="display:'+  (!calculateUndoneTasks(value.todos) ? "none" : "block" ) +'" class="list-container-item-count">' + calculateUndoneTasks(value.todos) + '</p>'
        }
        newDiv+='</div>';

        $(".list-container").append(newDiv);
    });
}

function addTodoToTask(titleToAddTo, newTodo) {
    // Get the JSON string from localStorage
    var tasksArray  = loadTasksFromStorage();

    // Find the index of the object with the matching title
    var indexToUpdate = tasksArray.findIndex(function(task) {
        return task.title === titleToAddTo;
    });

    if (indexToUpdate !== -1) {
        // Add the new todo into the todos array of the specific object

        // efe efe efe
        var newTaskObject = new Object();
        newTaskObject[newTodo] = true;
        tasksArray[indexToUpdate].todos.push(newTaskObject);

        // Update the modified task array back in localStorage
        localStorage.setItem("tasks", JSON.stringify(tasksArray));

        console.log('New todo added to the object with title ' + titleToAddTo);
    } else {
        console.log('Object with title ' + titleToAddTo + ' not found.');
    }
}

function deleteTodoFromTask(titleToDeleteFrom, todoToDelete) {
    // Get the JSON string from localStorage
    var tasksArray  = loadTasksFromStorage();

    // Find the index of the object with the matching title
    var indexToUpdate = tasksArray.findIndex(function(task) {
        return task.title === titleToDeleteFrom;
    });

    if (indexToUpdate !== -1) {
        // Find the index of the todo within the todos array
        var todoIndexToDelete = -1;
        
        tasksArray[indexToUpdate].todos.forEach((element, index) => {
            Object.keys(element)[0] === todoToDelete && (todoIndexToDelete = index);
        });


        if (todoIndexToDelete !== -1) {
            // Remove the todo from the todos array of the specific object
            tasksArray[indexToUpdate].todos[todoIndexToDelete][todoToDelete] = !tasksArray[indexToUpdate].todos[todoIndexToDelete][todoToDelete];

            // Update the modified task array back in localStorage
            localStorage.setItem("tasks", JSON.stringify(tasksArray));

            console.log('Todo removed from the object with title ' + titleToDeleteFrom);
        } else {
            console.log('Todo not found in the object with title ' + titleToDeleteFrom);
        }
    } else {
        console.log('Object with title ' + titleToDeleteFrom + ' not found.');
    }
}

function checkTitleExists(titleToCheck) {
    // Get the JSON string from localStorage
    var tasksArray  = loadTasksFromStorage();

    // Check if the title exists in any object within the array
    var titleExists = tasksArray.some(function(task) {
        return task.title === titleToCheck;
    });

    return titleExists;
}