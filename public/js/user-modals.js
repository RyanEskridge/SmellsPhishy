document.addEventListener('DOMContentLoaded', function() {
  // Edit modal
  const editForm = document.getElementById('editUserForm');

  document.querySelectorAll('button[data-bs-target="#editUserModal"]').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.closest('tr').getAttribute('data-user-id');

      fetch(`/users/${userId}`)
        .then(response => response.json())
        .then(user => {
          document.getElementById('editUserId').value = user.id;
          document.getElementById('editFirstName').value = user.firstName;
          document.getElementById('editLastName').value = user.lastName;
          document.getElementById('editEmail').value = user.email;
          document.getElementById('editJobTitle').value = user.jobTitle;
          document.getElementById('editSupervisor').value = user.supervisor;
          document.getElementById('editDepartment').value = user.department;
        })
        .catch(error => console.error('Error fetching user data:', error));
    });
  });

  editForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const formData = new FormData(editForm);
    const userData = Object.fromEntries(formData.entries());

    fetch(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.ok) {
        location.reload(); 
      } else {
        alert('Failed to update the user.');
      }
    })
    .catch(error => console.error('Error updating user:', error));
  });

  // Delete modal
  let userIdToDelete = null;

  document.querySelectorAll('button[data-bs-target="#deleteUserModal"]').forEach(button => {
    button.addEventListener('click', function() {
      userIdToDelete = this.closest('tr').getAttribute('data-user-id');
      console.log(`Preparing to delete user: ${userIdToDelete}`);
    });
  });

  document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (userIdToDelete) {
      fetch(`/users/delete/${userIdToDelete}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
		  location.reload();
        } else {
          alert('Failed to delete the user.');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      });
    }
  });
});