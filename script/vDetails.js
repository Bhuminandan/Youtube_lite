function getVideoIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    return videoId;
  }

  let videoId = getVideoIdFromUrl();

  if (videoId) {
    async function getVideoDetails (videoId) 
    {
        let response = await fetchVideoDetails(videoId);
        // let videoDetails = await response.json();
        displayVdeoDetails(response);
    }
    getVideoDetails(videoId)
    //   .then((videoDetails) => {
    //     displayVideoDetails(videoDetails);
    //   });
  } else {
    // Handle no video ID in the URL
    const videoDetailsContainer = document.getElementById('video-details');
    videoDetailsContainer.innerHTML = '<p>Error: Video ID not found in the URL!</p>';
  }

  async function fetchVideoDetails(videoId) {
    try {
      const baseUrl = 'https://www.googleapis.com/youtube/v3';
      // const apiKey = 'AIzaSyBXbSuqXJn-rjb-F-4X4lswQ85VMQVE4Ok';
      let url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`
      let response = await fetch(url);
      let videoDetails = await response.json();
      return videoDetails;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  function displayVdeoDetails(videoDetails){
    console.log(videoDetails);
  }