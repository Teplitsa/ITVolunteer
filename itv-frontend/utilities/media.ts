import { getRestApiUrl } from "./utilities";

export interface IMediaData {
  databaseId: number;
  mediaItemUrl: string;
  mediaItemRelativePath: string;
}

export const getMediaData = async (
  mediaId: number,
  abortController?: AbortController
): Promise<IMediaData> => {
  try {
    const result =
      typeof abortController === "undefined"
        ? await fetch(getRestApiUrl(`/wp/v2/media/${mediaId}`))
        : await fetch(getRestApiUrl(`/wp/v2/media/${mediaId}`), {
          signal: abortController.signal,
        });

    const {
      id: databaseId,
      media_details: { file: mediaItemRelativePath },
      source_url: mediaItemUrl,
      data,
    } = (await result.json()) as {
      id: number;
      media_details: {
        file: string;
      };
      source_url: string;
      data?: { status: number };
    };
    if (data?.status && data.status !== 200) {
      console.error("При получении медиа-объекта произошла ошибка.");
    } else {
      return { databaseId, mediaItemUrl, mediaItemRelativePath };
    }
  } catch (error) {
    console.error(error);
  }
};
