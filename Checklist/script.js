document.addEventListener("DOMContentLoaded", function() {
    loadNotes();
});

function addNote() {
    const noteContent = document.getElementById("noteContent").value;
    const important = document.getElementById("importantCheckbox").checked;
    const quick = document.getElementById("quickCheckbox").checked;
    const dueDate = document.getElementById("dueDate").value;

    const note = { content: noteContent, important: important, quick: quick, dueDate: dueDate };
    saveNoteToLocalStorage(note);

    // Clear input fields
    document.getElementById("noteContent").value = "";
    document.getElementById("importantCheckbox").checked = false;
    document.getElementById("quickCheckbox").checked = false;
    document.getElementById("dueDate").value = "";

    loadNotes(); // Reload notes
}

function saveNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = ""; // Clear previous content

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
        notesContainer.innerHTML = "No notes found.";
        return;
    }

    // Sort notes by due date (if available), then by importance and quickness
    notes.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.dueDate) {
            return -1;
        } else if (b.dueDate) {
            return 1;
        } else {
            return 0;
        }
    });

    notes.forEach(function(note, index) {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");

        if (note.important) {
            noteDiv.classList.add("important");
        }

        if (note.quick) {
            noteDiv.classList.add("quick");
        }

        if (note.dueDate) {
            noteDiv.innerHTML = `${index + 1}. ${note.content} - Due Date: ${note.dueDate}`;
        } else {
            noteDiv.innerHTML = `${index + 1}. ${note.content}`;
        }

        // Add remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function() {
            removeNoteAtIndex(index);
        };
        noteDiv.appendChild(removeButton);

        notesContainer.appendChild(noteDiv);
    });
}

function removeNoteAtIndex(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes(); // Reload notes
}
