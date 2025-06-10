// Utility functions for color group display names
export const getGroupDisplayName = (groupName) => {
  const names = {
    winter_deep: "Winter Deep",
    autumn_deep: "Autumn Deep", 
    winter_cool: "Winter Cool",
    spring_light: "Spring Light",
    summer_light: "Summer Light",
    spring_warm: "Spring Warm",
    summer_cool: "Summer Cool",
    autumn_warm: "Autumn Warm",
    winter_bright: "Winter Bright",
  };
  return names[groupName] || groupName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Utility functions for YouTube video handling
export const getYouTubeVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
};

export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "https://via.placeholder.com/320x180";
};
