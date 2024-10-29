document.addEventListener('DOMContentLoaded', function() {
  // Edit modal
  const editForm = document.getElementById('editTargetForm');

  document.querySelectorAll('button[data-bs-target="#editTargetModal"]').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.closest('tr').getAttribute('data-target-id');
      fetch(`/targets/${targetId}`)
        .then(response => response.json())
        .then(target => {
          document.getElementById('editTargetId').value = target.id;
          document.getElementById('editFirstName').value = target.FirstName;
          document.getElementById('editLastName').value = target.LastName;
          document.getElementById('editEmail').value = target.EmailAddress;
          document.getElementById('editJobTitle').value = target.JobTitle;
          document.getElementById('editSupervisor').value = target.Supervisor;
          document.getElementById('editDepartment').value = target.Department;
        })
        .catch(error => console.error('Error fetching target data:', error));
    });
  });

  editForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const targetId = document.getElementById('editTargetId').value;
    const formData = new FormData(editForm);
    const targetData = Object.fromEntries(formData.entries());

    fetch(`/targets/${targetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(targetData)
    })
    .then(response => {
      if (response.ok) {
        location.reload(); 
      } else {
        alert('Failed to update the target.');
      }
    })
    .catch(error => console.error('Error updating target:', error));
  });

  // Delete modal
  let targetIdToDelete = null;

  document.querySelectorAll('button[data-bs-target="#deleteTargetModal"]').forEach(button => {
    button.addEventListener('click', function() {
      targetIdToDelete = this.closest('tr').getAttribute('data-target-id');
      console.log(`Preparing to delete target: ${targetIdToDelete}`);
    });
  });

  document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (targetIdToDelete) {
      fetch(`/targets/${targetIdToDelete}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
		  location.reload();
        } else {
          alert('Failed to delete the target.');
        }
      })
      .catch(error => {
        console.error('Error deleting target:', error);
        alert('An error occurred while deleting the target.');
      });
    }
  });
});