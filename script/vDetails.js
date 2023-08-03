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
    executeOtherCode(videoId);
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

  function executeOtherCode(videoId) {
  async function getVideoDetails(videoId) {
  try {
    const baseUrl = 'https://www.googleapis.com/youtube/v3';
    // const apiKey = 'AIzaSyAtq8C8WaRAboxSLrxmCk3qbfuvkLDUMXk'; // Replace with your API key
    const apiKey = "AIzaSyBXbSuqXJn-rjb-F-4X4lswQ85VMQVE4Ok";
    let url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`;
    let response = await fetch(url);
    let videoDetails = await response.json();
    console.log(videoDetails);

    // Getting channel info

    
    const channelId = `${videoDetails.items[0].snippet.channelId}`;
    let channelInformation;
    getChannelInfo(channelId, apiKey)
      .then(channelData => {
        channelInformation = channelData;
        // Now you can work with the channelData object here
     
    // console.log(channelInformation);
    
    // Adding single video details d  ianamically

    let title = document.querySelector(".title");
    title.innerHTML = `${videoDetails.items[0].snippet.title}` 
   
    let upLoadDate = convertYouTubeAPIDate(videoDetails.items[0].snippet.publishedAt);
    let uploadDateElement = document.querySelector(".upload-date");
    uploadDateElement.innerHTML = `${upLoadDate}`;


    const viewCount = formatCount(videoDetails.items[0].statistics.viewCount);
    const views = document.querySelector(".views")
    views.innerHTML = `${viewCount}` 

    const channelLogo = document.querySelector(".channel-logo img")
    const commentChannelLogo = document.querySelector(".comment-channel-logo img")
    channelLogo.src = `${channelInformation.items[0].snippet.thumbnails.default.url}`
    commentChannelLogo.src = `${channelInformation.items[0].snippet.thumbnails.default.url}`
    

    const channelName = document.querySelector(".channel-name")
    channelName.innerHTML = `${videoDetails.items[0].snippet.channelTitle}`

    const channelSubs = document.querySelector(".channel-subs-count")
    let subsCount = formatCount(channelInformation.items[0].statistics.subscriberCount)
    channelSubs.innerHTML = `${subsCount} SUBSCRIBERS`
    
    const channelComments = document.querySelector(".comments-count")
    let commentCount = formatCount(videoDetails.items[0].statistics.commentCount)
    channelComments.innerHTML = `${commentCount} Comments`

    const LikeCount = formatCount(videoDetails.items[0].statistics.likeCount);
    const likes = document.querySelector(".row-right-item p")
    likes.innerHTML = `${LikeCount}` 
    

    const Desciption = document.querySelector(".description")
    Desciption.innerHTML = `${videoDetails.items[0].snippet.description}`

  })
  .catch(error => {
    console.error('Error:', error);
  });

  } catch (error) {
    console.log(error);
    return null;
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



async function getChannelInfo(channelId, apiKey) {
  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${apiKey}&part=snippet,statistics`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (channelData.items.length === 0) {
      throw new Error('Channel not found or API quota exceeded.');
    }
    return channelData;
  } catch (error) {
    throw new Error('Error fetching channel details: ' + error.message);
  }
}


function formatCount(numStr) {
  if (typeof numStr !== 'string') {
    throw new Error('Input must be a string.');
  }

  const num = parseFloat(numStr);

  if (isNaN(num)) {
    throw new Error('Invalid number string.');
  }

  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return numStr;
  }
}


let showMoreBtn = document.querySelector(".show-more-btn");
let descriptionContainer = document.querySelector(".description-content");
isDesopen = false;
showMoreBtn.addEventListener("click", () => {
  if (isDesopen == false) {
    descriptionContainer.style.height = "fit-content"
    descriptionContainer.style.height = "fit-content"
    showMoreBtn.textContent = "SHOW LESS"
    isDesopen = true;
  } else{
    descriptionContainer.style.height = "80px"
    showMoreBtn.textContent = "SHOW MORE"
    isDesopen = true;
  }

})}

