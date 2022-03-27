//global variables
const note = document.getElementById("note");
const notesLst = document.getElementById("notesLst");
const sumOfNotes = document.getElementById("sumOfNotes");

//assigned event listeners
window.addEventListener("load", initNotesFromLocalStorage);
note.addEventListener("keypress", onNewNoteAddEvnt);

//event callbacks
function rmvAllNotesEvnt(){
    const confirmRemoveAll = window.confirm("Are you sure you want to remove all of your notes?");
    if(confirmRemoveAll){
        notesLst.innerHTML = "";
        this.parentElement.style.display = "none";
        purgeLocalStorage();
        resetSumOfNotes();
    }    
}

function onNoteClickEvnt(){
    this.classList.toggle("text-strikethrough");
}

function onRmvImgClickEvnt(){
    const noteToBeRemoved = this.parentElement.firstChild.textContent;
    const confirmRemove = window.confirm("Do you really want to remove the note: " + noteToBeRemoved + "?");
    if(confirmRemove){
        this.parentElement.style.display = "none";
        const oldLocalStorageItem = window.localStorage.getItem("savedNotesLst");
        const textToBeRemoved = this.parentElement.firstChild.textContent;
        const newLocalStorageItem = oldLocalStorageItem.replace(textToBeRemoved + "||","");        
        updateLocalStorage("savedNotesLst", newLocalStorageItem); 
        showNotesCount();
    }  
}

function onNewNoteAddEvnt(event){
    if(event.keyCode === 13 && note.value.length > 0)
    {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const em = document.createElement("em");
        span.appendChild(document.createTextNode(note.value));       
        span.addEventListener("click", onNoteClickEvnt);
        const rmvImg = document.createElement("img");
        rmvImg.setAttribute("src", "img/rmv.png");
        rmvImg.addEventListener("click", rmvNoteEvnt);
        em.appendChild(document.createTextNode(getNow()));
        li.appendChild(span);
        li.appendChild(em);
        li.appendChild(rmvImg);
        notesLst.appendChild(li);
        note.value = "";
        if(notesLst.getElementsByTagName("li").length > 1){
            showRmvAllIcon();
        }
 
        const currentNotesNodeLst = notesLst.getElementsByTagName("span");
        const currentNotesTS = notesLst.getElementsByTagName("em");        
        let strObj = createStrObj(currentNotesNodeLst);        
        updateLocalStorage("savedNotesLst", strObj); 
        strObj = createStrObj(currentNotesTS);
        updateLocalStorage("savedTSLst", strObj); 
        showNotesCount(); 
        //debugger;
    }
}

function rmvNoteEvnt(){
    const noteToBeRemoved = this.parentElement.firstChild.textContent;
    const tsToBeRemoved = this.parentElement.querySelector("em").textContent;
    const confirmRemove = window.confirm("Do you really want to remove the note: " + noteToBeRemoved + "?");
    if(confirmRemove){
        this.parentElement.parentElement.removeChild(this.parentElement);
        const oldLocalStorageItem = window.localStorage.getItem("savedNotesLst");
        const newLocalStorageItem = oldLocalStorageItem.replace(noteToBeRemoved + "||","");                
        updateLocalStorage("savedNotesLst", newLocalStorageItem);
        const oldTSLocalStorageItem = window.localStorage.getItem("savedTSLst");
        const newTSLocalStorageItem = oldTSLocalStorageItem.replace(tsToBeRemoved + "||","");                
        updateLocalStorage("savedTSLst", newTSLocalStorageItem);
        showNotesCount();
    }
}

//Local Storage actions
function purgeLocalStorage(){
    window.localStorage.removeItem("savedNotesLst");
    window.localStorage.removeItem("savedTSLst");
}

function initNotesFromLocalStorage(){
    this.document.getElementById("rmvAllPnl").style.display = "none";
    sumOfNotes.style.display = "none";
    const rmvAllImg = document.getElementById("rmvAllImg");
    rmvAllImg.addEventListener("click", rmvAllNotesEvnt);
    const notesLstSaved = window.localStorage.getItem("savedNotesLst");
    const notesLstIsEmpty = typeof notesLstSaved === "undefined" || notesLstSaved === "" || notesLstSaved === null;
    const notesTSLstSaved = window.localStorage.getItem("savedTSLst");
    //debugger;
 
    if(!(notesLstIsEmpty)){
        const savedNotesArray = notesLstSaved.split("||");
        const savedTSArray = notesTSLstSaved.split("||");
        savedNotesArray.forEach(function(noteItem, index){
            const li = document.createElement("li");
            const span = document.createElement("span");
            const em = document.createElement("em");
            span.appendChild(document.createTextNode(noteItem));
            span.addEventListener("click", onNoteClickEvnt);
            const rmvImg = document.createElement("img");
            rmvImg.setAttribute("src", "img/rmv.png");
            rmvImg.addEventListener("click", onRmvImgClickEvnt);
            em.appendChild(document.createTextNode(savedTSArray[index]));
            li.appendChild(span);
            li.appendChild(em);
            li.appendChild(rmvImg);
            notesLst.appendChild(li);      
            note.value = "";
        }); 
        notesLst.removeChild(notesLst.lastChild);
        showNotesCount(); 
    }
}

function updateLocalStorage(itemKey, itemValue){
    window.localStorage.removeItem(itemKey);
    window.localStorage.setItem(itemKey, itemValue);
}

function createStrObj(nodeLst){
    let strObj = "";
    for(const node of nodeLst){
        strObj += node.textContent + "||";    
    } 
    return strObj;   
}

//html controls
function showRmvAllIcon(){
    document.getElementById("rmvAllPnl").style.display = "block";
}

function resetSumOfNotes(){
    sumOfNotes.textContent = "";
    sumOfNotes.style.display = "none";
}

function showNotesCount(){
    const notesCount = notesLst.getElementsByTagName("li").length;

    if(notesCount == 0){
        document.getElementById("rmvAllPnl").style.display = "none";
        sumOfNotes.textContent = "";
        sumOfNotes.style.display = "none";
        purgeLocalStorage();
        return;
    }

    if(notesCount == 1){
        document.getElementById("rmvAllPnl").style.display = "none";
        sumOfNotes.style.display = "inline";
        sumOfNotes.textContent = "(1 saved note)";
        return;
    }

    if(notesCount > 1){
        document.getElementById("rmvAllPnl").style.display = "block";
        sumOfNotes.style.display = "inline";
        sumOfNotes.textContent = "(" + notesCount + " saved notes)";
        return;
    }
}

//datetime helpers
function getNow(){
    const date = new Date();
    const month = make2Digits(date.getMonth()+1);
    const day = make2Digits(date.getDate());
    const year = date.getFullYear();
    const hours = make2Digits(date.getHours());
    const mins = make2Digits(date.getMinutes());
    const secs = make2Digits(date.getSeconds());
    return day + "/" + month + "/" + year + "(" + hours + ":" + mins + ":" + secs + ")";
}

function make2Digits(t){
    return (t < 10 ? "0" : "") + t;
}
