function showFormData() {
  // Obtener el formulario por su ID
  const form = document.getElementById("myForm");

  // Crear un objeto FormData con el contenido del formulario
  const formData = new FormData(form);

  // Crear un objeto vacío para almacenar la información del formulario
  const data = {};

  // Recorrer los campos del formulario y agregar su información al objeto data
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Mostrar la información del formulario en un alert
$("#showFormData").click(function() { 
 alert("Esto es un ejercicio de clase, no se va a enviar.");
});