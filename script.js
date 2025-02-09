const apiUrl = "http://localhost:3000/students";  // Update the API URL

// Fetch data from API and render students
function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderStudents(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Render list of students in the UI
function renderStudents(students) {
    const nameList = document.getElementById("name-list");
    nameList.innerHTML = ""; // Clear list
    students.forEach(student => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>ID:</strong> ${student.id} <br>
                <strong>Name:</strong> ${student.first_name} ${student.last_name} <br>
                <strong>Email:</strong> ${student.email} <br>
                <strong>Phone:</strong> ${student.phone}
            </div>
            <div>
                <button onclick="deleteStudent('${student._id}')">Delete</button>
                <button onclick="editStudent('${student._id}', '${student.id}', '${student.first_name}', '${student.last_name}', '${student.email}', '${student.phone}')">Edit</button>
            </div>
        `;
        nameList.appendChild(li);
    });
}

// Delete student by ID
function deleteStudent(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchData())
        .catch(error => console.error('Error deleting student:', error));
}

// Edit student details
function editStudent(id, studentId, firstName, lastName, email, phone) {
    const newFirstName = prompt("Enter new First Name", firstName);
    const newLastName = prompt("Enter new Last Name", lastName);
    const newEmail = prompt("Enter new Email", email);
    const newPhone = prompt("Enter new Phone Number", phone);

    if (newFirstName && newLastName && newEmail && newPhone) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: studentId,
                first_name: newFirstName,
                last_name: newLastName,
                email: newEmail,
                phone: newPhone
            })
        }).then(() => fetchData())
            .catch(error => console.error('Error updating student:', error));
    }
}

// Search for student by ID
function searchStudent() {
    const studentId = document.getElementById("search-id").value;
    if (studentId === "") {
        fetchData();  // Show all students if no search input
    } else {
        fetch(`http://localhost:3000/findstudents/${studentId}`)  // Send request to search by studentId
            .then(response => response.json())
            .then(data => renderStudents(data))  // Display results
            .catch(error => console.error('Error searching student:', error));
    }
}

// Add new student on form submit
document.getElementById("add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = document.getElementById("student-id").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (studentId && firstName && lastName && email && phone) {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, first_name: firstName, last_name: lastName, email, phone })
        })
            .then(response => response.json())
            .then(() => {
                // Clear form and reload list after adding new student
                document.getElementById("student-id").value = "";
                document.getElementById("first-name").value = "";
                document.getElementById("last-name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phone").value = "";
                fetchData();  // Reload the list after adding
            })
            .catch(error => console.error('Error adding student:', error));
    } else {
        alert("Please enter all fields.");
    }
});

// Initial fetch to populate the list
fetchData();
