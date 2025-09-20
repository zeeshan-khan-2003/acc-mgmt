if (process.env.NODE_ENV === 'development') {
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`)
    .then(res => {
      if (!res.ok) {
        console.warn('Backend is not running. Please start the backend server.');
      }
    })
    .catch(() => {
      console.warn('Backend is not running. Please start the backend server.');
    });
}
