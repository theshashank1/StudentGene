import re
from youtube_transcript_api import YouTubeTranscriptApi


def load_video(*videos: str) -> str :
    """
    Fetches transcripts from YouTube videos using youtube_transcript_api library.

    Args:
        *videos (str): A variable number of YouTube video IDs as strings.

    Returns:
        str: The combined transcript text for all videos, separated by video and formatted.
             If an error occurs, returns the error message as a string.

    Raises:
        Exception: Any exceptions raised by the youtube_transcript_api library.
    """

    doc = ""
    try :
        if len(videos) == 1 :
            transcription = YouTubeTranscriptApi.get_transcript(videos[0])
            for segment in transcription :
                doc += segment['text'] + " "
            return doc.strip()
        else :
            transcriptions, _ = YouTubeTranscriptApi.get_transcripts(list(videos))
            for video_id, transcription in transcriptions.items() :
                doc += "\n\n\n\n"  # Separate transcripts with four newlines
                for segment in transcription :
                    doc += segment['text'] + " "
            return doc.strip()
    except Exception as e :
        return str(e)


def get_video_id(url) :
    """
    Extracts the video ID from a YouTube URL.

    This function uses a regular expression to extract the video ID from a YouTube URL. 
    It supports various YouTube URL formats, including:
       - Standard watch URLs (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
       - Shortened URLs (e.g., youtu.be/dQw4w9WgXcQ)
       - Embedded URLs (e.g., youtube.com/embed/dQw4w9WgXcQ)
       - Channel URLs with playlist or videos (e.g., youtube.com/user/RickAstleyVEVO/videos/)

    Args:
      url: The YouTube URL from which to extract the video ID.

    Returns:
      The extracted video ID as a string, or None if the URL is invalid.
    """
    # Regular expression for extracting YouTube video ID
    youtube_regex = (
        r'(?:https?:\/\/)?(?:www\.)?'
        '(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|'
        'youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?v=|'
        'youtube\.com\/shorts\/|youtube\.com\/playlist\?list=|'
        'youtube\.com\/user\/\S+\/(?:playlist|videos)\/?|\S+\/)'
        '([a-zA-Z0-9_-]{11})'
    )

    match = re.search(youtube_regex, url)
    if match :
        return match.group(1)
    else :
        return None


# Example usage
if __name__ == "__main__" :
    youtube_url = input("Enter YouTube URL: ")
    video_id = get_video_id(youtube_url)
    if video_id :
        print(f"Video ID: {video_id}")
        print(load_video(video_id))
    else :
        print("Invalid YouTube URL")