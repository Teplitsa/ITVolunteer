import { IRestApiResponse } from "../model/model.typing";
import { getRestApiUrl } from "./utilities";

export type MediaSize = "avatar" | "full" | "logo" | "long" | "post-thumbnail" | "thumbnail";

export interface IMediaData {
  databaseId: number;
  mediaItemUrl: string;
  mediaItemWidth: string;
  mediaItemHeight: string;
  mediaItemSizes: {
    [size: string]: {
      width: string;
      height: string;
      source_url: string;
    };
  };
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

    const response: IRestApiResponse & {
      id: number;
      media_details: {
        width: string;
        height: string;
        sizes: {
          [sizes: string]: {
            width: string;
            height: string;
            source_url: string;
          };
        };
      };
      source_url: string;
    } = await result.json();

    if (response.data?.status && response.data.status !== 200) {
      console.error(
        `HTTP ${response.data.status} При загрузке данных медиа-объекта произошла ошибка.`
      );
    } else {
      const {
        id: databaseId,
        media_details: { width: mediaItemWidth, height: mediaItemHeight, sizes: mediaItemSizes },
        source_url: mediaItemUrl,
      } = response;

      return { databaseId, mediaItemUrl, mediaItemWidth, mediaItemHeight, mediaItemSizes };
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
