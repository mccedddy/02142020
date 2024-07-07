import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const addNoteForm = document.getElementById("addNoteForm");
  const notesList = document.getElementById("notesList");

  // Function to display notes
  const displayNotes = async () => {
    notesList.innerHTML = ""; // Clear the list

    // Query to get notes ordered by timestamp in descending order
    const notesQuery = query(
      collection(db, "notes"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(notesQuery);

    querySnapshot.forEach((doc) => {
      const noteData = doc.data();
      const noteDiv = document.createElement("div");
      noteDiv.classList.add(
        "mb-4",
        "p-4",
        "bg-white",
        "shadow-md",
        "rounded-md",
        "border",
        "border-gray-300"
      );
      noteDiv.setAttribute("data-aos", "fade-up");

      noteDiv.innerHTML = `
        <p class="text-xl font-bold">${noteData.name}</p>
        <p>${noteData.message}</p>
        <p class="text-gray-500 text-sm">${new Date(
          noteData.timestamp.seconds * 1000
        ).toLocaleString()}</p>
      `;
      notesList.appendChild(noteDiv);
    });
    AOS.refresh(); // Refresh AOS animations
  };

  // Function to add a note
  addNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    try {
      await addDoc(collection(db, "notes"), {
        name: name,
        message: message,
        timestamp: new Date(),
      });
      addNoteForm.reset(); // Clear the form
      displayNotes(); // Refresh the notes list
    } catch (err) {
      console.error("Error adding note: ", err);
    }
  });

  // Initial call to display notes
  displayNotes().catch((err) => console.error("Error getting notes: ", err));
});
