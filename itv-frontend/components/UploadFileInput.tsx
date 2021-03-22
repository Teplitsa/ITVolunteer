import { useState, useEffect, SyntheticEvent } from "react";
import * as utils from "../utilities/utilities";

import { IFetchResult } from "../model/model.typing";

import cloudUpload from "../assets/img/icon-wizard-cloud-upload.svg";
import removeFile from "../assets/img/icon-wizard-remove-file.svg";

export type FileDataItem = {
  databaseId: string | number;
  mediaItemUrl: string;
};

export type FileData<T = FileDataItem> = T | Array<T>;

export const UploadFileInput = props => {
  const [files, setFiles] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const fieldDescription =
    props.description ?? "Перетащите файл в выделенную область или кликните Загрузить";
  const acceptFileFormat = props.acceptFileFormat ?? "";

  useEffect(() => {
    if (props.fileData) {
      setFileData(props.fileData);
    }
  }, [props.fileData]);

  useEffect(() => {
    if (typeof fileData !== "object") return;

    let initFiles: Array<{
      value: string;
      fileName: string;
    }> = null;

    switch (props.isMultiple ? 0 : 1) {
      case 0:
        if (fileData instanceof Array) {
          initFiles = fileData.map(file => ({
            fileName: file.mediaItemUrl.replace(/^.*\//, ""),
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
          initFiles = [
            {
              fileName: fileData.mediaItemUrl.replace(/^.*\//, ""),
              value: fileData.databaseId,
            },
          ];
        }
        break;
    }

    if (Object.is(initFiles, null)) return;

    if (props.isMultiple) {
      setFiles(
        [...(files ?? []), ...initFiles].reduce((uniqueFiles, file) => {
          if (!uniqueFiles.some(({ value }) => value === file.value)) {
            uniqueFiles.push(file);
          }
          return uniqueFiles;
        }, [])
      );
    } else {
      setFiles(initFiles);
    }
  }, [fileData]);

  useEffect(() => {
    if (Object.is(files, null)) return;

    props.onChange && props.onChange({ inputProps: props, files });
  }, [files]);

  function handleFileChange(e) {
    let newFileData: FileData;

    setIsFileUploading(true);

    const form = new FormData();
    for (let fi = 0; fi < e.target.files.length; fi++) {
      form.append("file_" + fi, e.target.files[fi], e.target.files[fi].name);
    }

    const action = "upload-file";
    fetch(utils.getAjaxUrl(action), {
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

          if (props.isMultiple) {
            newFileData = result.files.map(file => ({
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
  }

  function handleRemoveFileClick(event: SyntheticEvent<HTMLImageElement>) {
    event.stopPropagation();

    setFiles(
      files.filter(
        (file: { value: number; fileName: string }) =>
          Number(file.value) !== Number(event.currentTarget.dataset.value)
      )
    );
  }

  return (
    <div className="wizard-upload">
      <input
        type="hidden"
        name={props.name}
        defaultValue={fileData ? fileData["databaseId"] : ""}
      />
      <input
        type="file"
        onChange={handleFileChange}
        title=""
        multiple={!!props.isMultiple}
        accept={acceptFileFormat}
      />
      <div className="wizard-upload__inner">
        <div className="wizard-upload__box">
          {!isFileUploading && (!(files instanceof Array) || files.length === 0) && (
            <img src={cloudUpload} />
          )}

          {isFileUploading && (
            <div className="wizard-upload__spinner">
              <div className="spinner-border" role="status"></div>
            </div>
          )}

          {!isFileUploading && files instanceof Array && files.length > 0 && (
            <div className="wizard-upload__files">
              {files.map(({ fileName, value }, key) => {
                return (
                  <div className="wizard-upload__file" key={key}>
                    <span>{fileName}</span>
                    <img
                      src={removeFile}
                      className="wizard-upload__remove-file"
                      onClick={handleRemoveFileClick}
                      data-value={value}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {!isFileUploading && (!(files instanceof Array) || files.length === 0) && (
            <div className="wizard-upload__title">{fieldDescription}</div>
          )}

          {!isFileUploading && (
            <a href="#" className="wizard-upload__btn">
              Загрузить
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFileInput;
