// async function to get the videoId from the URL
// async function getVideoIdFromUrl() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const videoId = urlParams.get('id');
//   return videoId;
// }
// let videoId;
// (async function() {
//   try {
//     videoId = await getVideoIdFromUrl(); // Use the videoId value here or perform other operations with it

//     // Rest of your code...
//   } catch (error) {
//     console.error('Error while getting the videoId:', error);
//   }
// })();




let videoId = sessionStorage.getItem('videoId');

  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: `${videoId}`,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }
  function stopVideo() {
    player.stopVideo();
  }

async function getVideoDetails(videoId) {
  try {
    const baseUrl = 'https://www.googleapis.com/youtube/v3';
    const apiKey = 'AIzaSyAtq8C8WaRAboxSLrxmCk3qbfuvkLDUMXk'; // Replace with your API key
    let url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`;
    let response = await fetch(url);
    let videoDetails = await response.json();
    console.log(videoDetails);
    
    // Adding single video details dianamically

    let title = document.querySelector(".title");
    title.innerHTML = `${videoDetails.items[0].snippet.title}` 
   
    const viewCount = formatViewCount(videoDetails.items[0]?.statistics.viewCount);
    const views = document.querySelector(".views")
    views.innerHTML = `${viewCount}` 


    let upLoadDate = convertYouTubeAPIDate(videoDetails.items[0].snippet.publishedAt);
    let uploadDateElement = document.querySelector(".upload-date");
    uploadDateElement.innerHTML = `${upLoadDate}`;

  } catch (error) {
    console.log(error);
    return null;
  }
}

 
function formatViewCount(viewCount) {
  if (viewCount >= 1000000) {
    return `${Math.floor(viewCount / 1000000)}M •`;
  } else if (viewCount >= 1000) {
    return `${Math.floor(viewCount / 1000)}k •`;
  } else {
    return viewCount.toString();
  }
}


function convertYouTubeAPIDate(apiDate) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const dateObj = new Date(apiDate);
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}

getVideoDetails(videoId);

// function displayVideoDetails(videoDetails) {
//   let videoDetails =  getChannelDetails(videoId);
//   console.log(videoDetails);
// }
