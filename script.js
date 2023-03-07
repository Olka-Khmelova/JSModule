function padTo2Digits(num){
    return String(num).padStart(2, "0");
  }

class TimeGrid {
    constructor() {
        this.container = document.querySelector(".task-container");
        this.renderHours();
        this.getTodayDate();
    }

    renderHour(time) {
        const hourBlock = document.createElement("div");
        hourBlock.className = "time-block";
        hourBlock.innerHTML = time === 17 ? 
        `
            <h2 class="time-block-hour title="Add tast">${time}:00</h2>     
        `
        :
        `
            <h2 class="time-block-hour" title="Add tast">${time}:00</h2>
            <h3 class="time-block-hour  accent" title="add tast">${time}:30</h3>        
        `;
        return this.container.append(hourBlock);
    }
    renderHours() {
        for (let i = 8; i <= 17; i++) {
            this.renderHour(i);
        }
    }
    getTodayDate() {
        let now = new Date();
        function formatDay() {
        const months = [
            'Jan', 
            'Feb', 
            'Mar', 
            'Apr', 
            'May', 
            'Jun', 
            'Jul', 
            'Aug', 
            'Sep', 
            'Oct',  
            'Nov',  
            'Dec'
        ];
        let days = [ 
            'Sunday',
            'Monday',
            'Tuesday',
            'Wensday',
            'Thursday',
            'Friday',
            'Saturday'
          ];

          let hour = padTo2Digits(now.getHours());
          let minutes = padTo2Digits(now.getMinutes());
          let day = days[now.getDay()];
          let month = months[now.getMonth()];
          let date = now.getDate();
          let year = now.getFullYear();

          return `${day} ${date}th of ${month}, ${year} <br/> ${hour}:${minutes}`;
        }

        let currentDay = document.querySelector(".current-day");
        currentDay.innerHTML = formatDay();
    }
}

class ToDoTask {
    constructor(element){
        Object.assign(this, element);
        this.width = 200;
        this.end = element.start + element.duration;
        this.leftX = 50;
        this.id = ToDoTask.id++;
        this.done = false;

        this.startHours = (element.start - (element.start % 60)) / 60 + 8;
        this.startMinutes = element.start % 60;
        this.endHours = (this.end - (this.end % 60)) / 60 + 8;
        this.endMinutes = this.end % 60;
    }

    static id = 0;
    toggleDone(){
        return this.done = !this.done;
    }
}

class ToDosList {
    constructor(array) {
        this.toDosArr = array
        .sort(function (a, b) { return a.start - b.start })
        .map(item => new ToDoTask(item)); 

        this.calculateStyleParametrs();
    }
   
    calculateStyleParametrs() {
        // width    
        this.toDosArr.forEach(item => {
            for (let i = 0; i < this.toDosArr.length; i++) {

                if (item.end > this.toDosArr[i].start && item.start < this.toDosArr[i].start ||
                    item.end > this.toDosArr[i].start && item.end < this.toDosArr[i].end) {

                    item.width = 100;
                    this.toDosArr[i].width = 100;

                    // left coordinate
    
                    if (item.leftX === this.toDosArr[i].leftX) {
                        this.toDosArr[i].leftX += 100;
                    }
                    if (item.leftX === 150 && this.toDosArr[i].leftX == 50) {
                        this.toDosArr[i].leftX += 200;
                    }
                }
            }
        })
    }
}
class RenderToDos {

    constructor(toDos, renderHours) {

        this.container = document.querySelector(".task-container");

        this.toDoList = toDos.toDosArr;

        this.renderHours = renderHours;

        this.renderToDoList(this.toDoList);

    }
    renderToDoTask(task) {
        const actContainer = document.createElement("div");
        actContainer.className = "event-block";
        actContainer.innerHTML = `
            <p title="${task.title}">${task.title}</p>
            <div class='buttons'>
                <button class="task-btn edit-btn" title="Edit"><i class="fa-solid fa-pen icons"></i></button>
                <button class="task-btn done-btn" title="Done"><i class="fa-solid fa-check icons"></i></button>
            </div>
        `
        actContainer.setAttribute(
            "style", 
            `
            height: ${task.duration * 2}px; 
            width: ${task.width}px; 
            top: ${task.start * 2}px; 
            left: ${task.leftX}px; 
            background: #E2ECF580; 
            border-left: 3px solid #6e9fcf80;
            `
            );
        
        const doneBtn = actContainer.querySelector(".done-btn");
        const text = actContainer.querySelector("p");

        if(task.done) {
            doneBtn.classList.add("active")
            text.style.textDecoration = "line-through";

        }

        function changeDone() {
            task.toggleDone();
            doneBtn.classList.toggle("active");
            if(task.done) {
                text.style.textDecoration = "line-through";
        
            }else {
                text.style.textDecoration = "none";
            }
        }
        doneBtn.onclick = (e) => {
            changeDone();
            e.stopPropagation();
        }
        
        return actContainer;
        }

        renderToDoList(list) {
            console.log(list)
            this.container.innerHTML = '';
            this.renderHours.renderHours();

            // list of actions
            let tasksCollection = list.map(item => this.renderToDoTask(item));
            this.container.append(...tasksCollection);
            this.modalWindowOptions();
        }

        modalWindowOptions() {
            let listOfBlocks = this.container.querySelectorAll(".event-block");
    
            let arrFromNode = Array.from(listOfBlocks);
            listOfBlocks.forEach(el => {

                let titleText = el.querySelector('p');
    
                // calculating time from pixels
                let startInPixels = el.style.top.replace('px', '');
                let startHours = (+startInPixels / 2 - ((+startInPixels / 2) % 60)) / 60 + 8 + "";
                let startMinutes = (+startInPixels / 2) % 60 + "";
                let duration = +el.style.height.replace('px', '') / 2;
    
                // event for event block
                el.addEventListener("click", () => {
                    const modalElement = document.querySelector(".modal-back");
                    const mainContainer = document.createElement("div");
                    const inputContainer = document.createElement("form")
                    let titleInput = document.createElement("input");
                    let startInput = document.createElement("input");
                    let durationInput = document.createElement("input");
                    // let endInput = document.createElement("input");
                    let colorInput = document.createElement("input");
                    let formBtn = document.createElement("button");
                    let closeBtn = document.createElement("button");
                    let deleteBtn = document.createElement("button");
                    const formInput = document.createElement("div");
                    let formTitle = document.createElement("h1");
                    let labelTitle = document.createElement("form-label");
                    let labelStart = document.createElement("form-label");
                    let labelDuration = document.createElement("form-label");
                    let labelColor = document.createElement("form-label");
                        
                    labelTitle.classList.add("form-label");
                    labelStart.classList.add("form-label");
                    labelDuration.classList.add("form-label");
                    labelColor.classList.add("form-label");
                     mainContainer.classList.add("change-task-form");
                    inputContainer.classList.add("form", "change-form")
                    titleInput.classList.add("title-input");
                    startInput.classList.add("start-input");
                    durationInput.classList.add("duration-input");
                    // endInput.classList.add("end-input");
                    colorInput.classList.add("color-input");
                    formBtn.classList.add("form-button");
                    closeBtn.classList.add("close-add-form");
                    formInput.classList.add("form-input");
                    formTitle.classList.add("form-title");
                    deleteBtn.classList.add("delete-btn");
        
                    labelTitle.innerText = "Title";
                    labelStart.innerText = "Start";
                    labelDuration.innerText = "Duration";
                    labelColor.innerText = "Color";
        
                    formTitle.innerText = "Make your changes";
                    deleteBtn.innerText = "Delete";
                    closeBtn.innerText = "x";
                    formBtn.innerText = "Submit"
                    titleInput.type = "text";
                    startInput.type = "time";
                    durationInput.type = "number";
                    // endInput;
                    colorInput.type = "color";
                    formBtn.type = "submit";
                    closeBtn.type = "button";
                    titleInput.value = titleText.innerText;
                    durationInput.value = duration;
                    colorInput.value = "#E2ECF5";
                    startInput.value = `${padTo2Digits(startHours)}:${padTo2Digits(startMinutes)}`;
                    colorInput.addEventListener("change", () => {
                        el.style.background = `${colorInput.value}50`;
                        el.style.borderLeft = `3px solid ${colorInput.value}`
                    })
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation;
                        events = events.filter(i => events.indexOf(i) !== arrFromNode.indexOf(el))
                        .sort(function (a, b) { return a.start - b.start });
                
                        this.toDoList = new ToDosList(events);
                    
                        this.renderToDoList(this.toDoList.toDosArr);
                        toDos = new ToDosList(events);
                        modalElement.classList.remove("modal-active");
                        mainContainer.innerHTML = " ";
                    }
                        
                    formBtn.onclick = (e) => {
        
                        let hours = startInput.value.slice(0, 2);
                        let minutes = startInput.value.slice(3);
                        minutes = +minutes;
                        
                        let startTime = (+hours - 8) * 60 + minutes;
                        events.forEach((item) => {
                            if(events.indexOf(item) === arrFromNode.indexOf(el)) {
                                item.title = titleInput.value;
                                item.start = startTime;
                                item.duration = +durationInput.value;
                            }
                        })
                        const newList = new ToDosList(events);

                        // this.renderToDos = new RenderToDos(this.toDoList, this.renderHours);
                        this.renderToDoList(newList.toDosArr); 
                 
                        modalElement.classList.remove("modal-active");
                        mainContainer.innerHTML = " ";
                        e.preventDefault();
                    }
                     // inputs logic
                    closeBtn.onclick = (e) => {
                        e.preventDefault();
                        // mainContainer.classList.remove('change-task-form-active');
                        modalElement.classList.remove("modal-active");
                        inputContainer.style.display = "none";
                    }
        
                inputContainer.style.display = "block";
                labelTitle.append(titleInput);
                labelStart.append(startInput);
                labelDuration.append(durationInput);
                labelColor.append(colorInput);
                formInput.append(labelTitle, labelStart, labelDuration, labelColor, formBtn,  deleteBtn);
                inputContainer.append(formTitle, formInput, closeBtn);
                mainContainer.append(inputContainer)
                modalElement.append(mainContainer);
                modalElement.classList.add("modal-active");      
            })
        })
    }
}
class Actions {
    constructor(toDos, renderToDos, renderTimeGrid) {
        this.inputContainer = document.querySelector(".form");
        this.renderToDos = renderToDos;
        this.toDoListArr = toDos;
        this.renderTimeGrid = renderTimeGrid;

        this.addEvent(this.toDoListArr);
    }
//add new task
    addEvent() {
        const mainContainer = document.querySelector(".add-task-form");

        const addNewTaskBTN = document.querySelector(".new-task-btn");
        addNewTaskBTN.onclick = () => {
            let titleInput = document.querySelector(".title-input");
            let startInput = document.querySelector(".start-input");
            let durationInput = document.querySelector(".duration-input");
            let endInput = document.querySelector(".end-input");
            let colorInput = document.querySelector(".color-input");
            let formBtn = document.querySelector(".form-button");
            let closeBtn = document.querySelector(".close-add-form");

            startInput.value = "08:00";

            // inputs logic
            closeBtn.onclick = (e) => {
                e.preventDefault();
                mainContainer.classList.remove('add-task-form-active');
                this.inputContainer.style.display = "none";
            }
            formBtn.addEventListener("click", (e) => {
                e.preventDefault();
                // calculating start for event from time
                let hours = startInput.value.slice(0, 2);
                let minutes = startInput.value.slice(3);
                minutes = +minutes;
            
                let startTime = (+hours - 8) * 60 + minutes;
            
                // create new Act
            
                let newAct = {
                    start: startTime,
                    duration: +durationInput.value,
                    title: titleInput.value,
                }
            
                        // control time for the new event            
                if (durationInput.value > 0 && startTime < 540) {
                    mainContainer.classList.remove("add-task-form-active");
                    this.inputContainer.style.display = "none";
                    events.push(newAct);
                    this.toDoListArr = new ToDosList(events);
                    this.renderToDos = new RenderToDos(this.toDoListArr, this.renderTimeGrid);
                    toDos = new ToDosList(events);

                    durationInput.value = null;
                    titleInput.value = "";
                    colorInput.value = '#6e9ecf';
                }
            })
        mainContainer.classList.add("add-task-form-active");
        this.inputContainer.style.display = "block";
    
        }
    }
}
///banner
class ActiveNotifications {
    
    constructor() {
        this.activeBannerWindow = document.querySelector('.banner-container');
        this.timerForBanner();
    }

    timerForBanner() {
        this.activeBannerWindow.innerHTML = '';
        let time = 1000;
        setInterval(() => {
            let currentDate = new Date();  
            console.log(currentDate.getMinutes())           
            toDos.toDosArr.forEach(item => {
                if (currentDate.getHours() === item.startHours && currentDate.getMinutes() === item.startMinutes) {
                    this.activeBannerWindow.classList.add('active');
                    this.activeBannerWindow.innerHTML = `
                       <h1>Event "${item.title}" started</h1>
                    `;
                console.log("bingo");
                } 
                })
        }, time);
        setInterval(() => {
            this.activeBannerWindow.classList.remove('active');
            console.log("bye")
        }, 80000);

    }
}

const renderTimeGrid = new TimeGrid;
let toDos = new ToDosList(events);
let renderToDos = new RenderToDos(toDos, renderTimeGrid);
const actions = new Actions(toDos, renderToDos, renderTimeGrid);
const notifications = new ActiveNotifications(toDos);
