from youtube_transcript_api import YouTubeTranscriptApi


def get_transcription(*videos: str) -> str :
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


# Example usage
if __name__ == '__main__' :
    text = get_transcription("1aA1WGON49E", "fLeJJPxua3E")
    print(text)
