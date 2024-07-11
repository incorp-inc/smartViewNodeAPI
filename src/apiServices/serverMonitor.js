
const axios = require('axios');

const triggerChatNotification = async (message) => {
    const config = {
      method: 'post',
      url: 'https://chat.googleapis.com/v1/spaces/AAAA_46H6cA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=UgTBhuEzeCgRxhYL19ic0DY8njOxz5I4gpgyx0xu1Sc',
      data: { text: message }
    };
  
    try {
      const response = await axios(config);
      console.log("Chat Message sent successfully - ", message);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      // Send the error message to Google Chat
      const errorConfig = {
        method: 'post',
        url: 'https://chat.googleapis.com/v1/spaces/AAAA_46H6cA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=UgTBhuEzeCgRxhYL19ic0DY8njOxz5I4gpgyx0xu1Sc',
        data: { text: `Error sending message: ${error.message}` }
      };
      try {
        await axios(errorConfig);
        console.log("Error message sent successfully");
      } catch (error) {
        console.error("Error sending error message:", error);
      }
      throw error;
    }
  };

  const checkServerStatusAndNotify = async (url) => {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        await triggerChatNotification(`${url}- Server is up and running`);
      } else {
        await triggerChatNotification(`${url} - Server Error with response code: ${response.status}`);
      }
    } catch (error) {
      await triggerChatNotification(`${url} - Server Error with response code: ${error.response ? error.response.status : 'unknown'}`);
    }
  };
  
  // Usage example
  const serverUrl = 'http://10.0.0.151:5001'; // Replace with your server URL
  checkServerStatusAndNotify(serverUrl);
  