document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar el envío del formulario por defecto

    const email = document.getElementById('code').value;
    const password = document.getElementById('password').value;

    window.location.href = '../app';
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      window.location.href = '/app';

      if (response.ok) {
        window.location.href = '/todos';
      } else {
        console.error('Error en login:', data.message);
        alert('Error en el login: ' + data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });