const getFormattedDateTime = () => {
    const date = new Date();
  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  };

  const handleError = (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
      return res.status(500).json({ error: 'Failed to write log' });
    }
    console.log('Log written successfully');
  };
  
  module.exports = {
    getFormattedDateTime,
    handleError,
  };
  