import {
  useState,
  useEffect,
  useRef,
  SyntheticEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";
import * as utils from "../utilities/utilities";
import { getMediaData } from "../utilities/media";
import { IFetchResult } from "../model/model.typing";

import cloudUpload from "../assets/img/icon-wizard-cloud-upload.svg";

type FileMedia = {
  fileId: number;
  preview?: string;
};

export type FileItem = {
  value: string | number;
  fileName: string;
};

export type FileDataItem = {
  databaseId: string | number;
  mediaItemUrl: string;
};

export type FileData<T = FileDataItem> = T | Array<T>;

export interface IUploadFileInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  description?: string;
  acceptFileFormat?: string;
  isMultiple?: boolean;
  initFileData?: FileData;
  // eslint-disable-next-line no-unused-vars
  onUpload?: (event: CustomEvent<{ files: Array<FileItem> }>) => void;
  // eslint-disable-next-line no-unused-vars
  onRemove?: (event: CustomEvent<{ files: Array<FileItem> }>) => void;
}

export const UploadFileInput: React.FunctionComponent<IUploadFileInputProps> = ({
  description,
  acceptFileFormat,
  isMultiple,
  initFileData,
  onUpload,
  onRemove,
  ...nativeProps
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Array<FileItem>>(null);
  const [media, setMedia] = useState<Array<FileMedia>>(null);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [fileData, setFileData] = useState<FileData>(null);
  description = description ?? "Перетащите файл в выделенную область или кликните Загрузить";
  nativeProps.accept = acceptFileFormat ?? nativeProps.accept ?? "";
  nativeProps.multiple = isMultiple ?? nativeProps.multiple ?? null;
  useEffect(() => {
    inputFileRef.current?.addEventListener("change", handleFileChange);
    onUpload && inputFileRef.current?.addEventListener("upload", onUpload);
    onRemove && inputFileRef.current?.addEventListener("remove", onRemove);

    return () => {
      inputFileRef.current?.removeEventListener("change", handleFileChange);
      onUpload && inputFileRef.current?.removeEventListener("upload", onUpload);
      onRemove && inputFileRef.current?.removeEventListener("remove", onRemove);
    };
  }, [inputFileRef.current]);

  useEffect(() => {
    if (initFileData) {
      setFileData(initFileData);
    }
  }, [initFileData]);

  useEffect(() => {
    if (typeof fileData !== "object") return;

    let newFiles: Array<FileItem> = null;

    switch (nativeProps.multiple ? 0 : 1) {
      case 0:
        if (fileData instanceof Array) {
          newFiles = fileData.map(file => ({
            fileName: file.mediaItemUrl ? file.mediaItemUrl.replace(/^.*\//, "") : "",
            value: file.databaseId,
          }));
        }
      // eslint-disable-next-line no-fallthrough
      case 1:
        if (
          Object.prototype.toString.call(fileData) === "[object Object]" &&
          Object.keys(fileData).every((fileField: string) =>
            ["databaseId", "mediaItemUrl"].includes(fileField)
          )
        ) {
          newFiles = [
            {
              fileName: (fileData as FileDataItem).mediaItemUrl ? (fileData as FileDataItem).mediaItemUrl.replace(/^.*\//, "") : "",
              value: (fileData as FileDataItem).databaseId,
            },
          ];
        }
        break;
    }

    if (Object.is(newFiles, null)) return;

    if (nativeProps.multiple) {
      newFiles = [...(files ?? []), ...newFiles].reduce((uniqueFiles, file) => {
        if (!uniqueFiles.some(({ value }) => value === file.value)) {
          uniqueFiles.push(file);
        }
        return uniqueFiles;
      }, []);
    }

    setFiles(newFiles);

    (files ?? []).length < newFiles.length &&
      inputFileRef.current?.dispatchEvent(
        new CustomEvent("upload", { detail: { files: newFiles } })
      );
  }, [fileData]);

  useEffect(() => {
    if (Object.is(files, null)) return;

    const abortControllers: Array<AbortController> = [];

    const abortController = new AbortController();

    (async () => {
      const newMedia: Array<FileMedia> = [];

      for (const { value } of files) {
        if ((media ?? []).every(({ fileId }) => Number(value) !== Number(fileId))) {
          const { databaseId: fileId, mediaItemSizes } = await getMediaData(value, abortController);

          abortControllers.push(abortController);

          newMedia.push({
            fileId,
            preview: mediaItemSizes?.thumbnail?.source_url,
          });
        }
      }

      newMedia.length > 0 && setMedia([...(media ?? []), ...newMedia]);

      return () => abortControllers.forEach(abortController => abortController.abort());
    })();
  }, [files]);

  const handleFileChange = (event: Event): void => {
    let newFileData: FileData;

    setIsFileUploading(true);

    const form = new FormData();

    Array.from((event.target as HTMLInputElement).files).forEach((file, i) =>
      form.append(`file_${i}`, file, file.name)
    );

    const action = "upload-file";
    utils.tokenFetch(utils.getAjaxUrl(action), {
      method: "post",
      body: form,
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "error") {
            setIsFileUploading(false);
            return utils.showAjaxError({ message: "Ошибка!" });
          }

          if (nativeProps.multiple) {
            newFileData = result.files?.map(file => ({
              databaseId: String(file.file_id),
              mediaItemUrl: file.file_url,
            }));
          } else {
            newFileData = {
              databaseId: String(result.files[0].file_id),
              mediaItemUrl: result.files[0].file_url,
            };
          }

          setIsFileUploading(false);

          newFileData && setFileData(newFileData);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  };

  const handleRemoveFileClick = (event: SyntheticEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    const newFiles = (files ?? []).filter(
      (file: { value: number; fileName: string }) =>
        Number(file.value) !== Number(event.currentTarget.dataset.value)
    );

    setFiles(newFiles);

    (files ?? []).length > newFiles.length &&
      inputFileRef.current?.dispatchEvent(
        new CustomEvent("remove", { detail: { files: newFiles } })
      );
  };

  return (
    <div className="form-upload">
      <input
        type="hidden"
        name={nativeProps.name}
        defaultValue={files?.map(file => file.value).join(",") ?? ""}
      />
      <input
        {...nativeProps}
        type="file"
        name={`${nativeProps.name}_native`}
        title={nativeProps.title ?? ""}
        ref={inputFileRef}
      />
      <div className="form-upload__inner">
        <div
          className={`form-upload__box ${
            files instanceof Array && files.length ? "form-upload__box_has-files" : ""
          }`.trim()}
        >
          {!isFileUploading && (!(files instanceof Array) || files.length === 0) && (
            <img className="form-upload__icon" src={cloudUpload} />
          )}

          {isFileUploading && (
            <div className="form-upload__spinner">
              <div className="spinner-border" />
            </div>
          )}

          {!isFileUploading && (
            <>
              {files instanceof Array && files.length > 0 && (
                <div className="form-upload__files">
                  {files.map(({ fileName, value }, key) => {
                    const backgroundImageUrl = media
                      ?.filter(({ fileId }) => {
                        return Number(fileId) === Number(value);
                      })
                      .shift()?.preview;

                    return (
                      <div className="form-upload__file" key={key}>
                        <div
                          style={
                            backgroundImageUrl && {
                              backgroundImage: `none, url(${backgroundImageUrl})`,
                              backgroundSize: "0 0, 34px 34px",
                            }}
                          className="form-upload__file-preview"
                        />
                        <div className="form-upload__file-name">{fileName}</div>
                        <button
                          className="form-upload__file-remove"
                          type="button"
                          onClick={handleRemoveFileClick}
                          data-value={value}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {(!(files instanceof Array) || files.length === 0) && (
                <div className="form-upload__title">{description}</div>
              )}
              <a href="#" className="form-upload__btn">
                Загрузить
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFileInput;
