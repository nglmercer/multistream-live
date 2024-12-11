function showAlert(type='info', message, duration = 3000,data) {
    const alert = document.createElement('app-alert');
    alert.setAttribute('type', type);
    alert.setAttribute('message', message);
    if (data) alert.setAttribute('details', JSON.stringify(data));
    alert.setAttribute('dark-mode', ''); // Enables dark mode
    alert.setAttribute('duration', duration); // Enables close button
/*   switch (type) {
      case 'success':
          alert.classList.add('alert-success');
          break;
      case 'info':
          alert.classList.add('alert-info');
          break;
      case 'warning':
          alert.classList.add('alert-warning');
          break;
      case 'error':
          alert.classList.add('alert-error');
          break;
      default:
          alert.classList.add('alert-info');
  } */
  document.body.appendChild(alert);

}
{/* <button onclick="showAlert('success', 'This is a success message!')">Show Success</button>
<button onclick="showAlert('info', 'This is an info message!')">Show Info</button>
<button onclick="showAlert('warning', 'This is a warning message!')">Show Warning</button>
<button onclick="showAlert('error', 'This is an error message!')">Show Error</button> */}
export default showAlert;