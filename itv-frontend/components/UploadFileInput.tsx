import { ReactElement, useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import * as _ from "lodash";
import * as utils from "../utilities/utilities";

import {
  IWizardScreenProps,
  IWizardInputProps,
  IFetchResult,
} from "../model/model.typing";

import cloudUpload from "../assets/img/icon-wizard-cloud-upload.svg";
import removeFile from "../assets/img/icon-wizard-remove-file.svg";

export const UploadFileInput = (props: any) => {
  const [files, setFiles] = useState([])
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [fileData, setFileData] = useState(null)
  const fieldDescription = _.get(props, "description", "Перетащите файл в выделенную область или кликните на кнопку")
  const acceptFileFormat = _.get(props, "acceptFileFormat", "")  

  useEffect(() => {
    if(props.fileData) {
      setFileData(props.fileData);
    }
  }, [])

  useEffect(() => {
    if(fileData && typeof fileData != 'object') {
      return;
    }

    setFiles(fileData && fileData.mediaItemUrl ? [{
      fileName: fileData.mediaItemUrl ? fileData.mediaItemUrl.replace(/^.*[\\\/]/, ''),
      value: fileData.databaseId,
    }] : []);
  }, [fileData])

  function handleFileChange(e) {
    let fullPath = e.target.value
    let fileName = fullPath.replace(/^.*[\\\/]/, '')

    setIsFileUploading(true);

    const form = new FormData(); 
    for(let fi = 0; fi < e.target.files.length; fi++) {
      form.append( 
        "file_" + fi, 
        e.target.files[fi], 
        e.target.files[fi].name
      )
    }

    let action = "upload-file";
    fetch(utils.getAjaxUrl(action), {
        method: 'post',
        body: form,
    })
      .then((res) => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if(result.status == 'error') {
            setIsFileUploading(false)
            return utils.showAjaxError({message: "Ошибка!"})
          }

          for(let fi in result.files) {
            setFileData({
              databaseId: String(result.files[fi].file_id),
              mediaItemUrl: result.files[fi].file_url,
            });
            break;
          }

          setIsFileUploading(false);
        },
        (error) => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleRemoveFileClick(e) {
    e.stopPropagation()
    setFileData(null)
  }

  return (
    <div className="wizard-upload">
      <input type="hidden" name={props.name} defaultValue={fileData ? fileData["databaseId"] : ""} />
      <input type="file" onChange={handleFileChange} title="" multiple={!!props.isMultiple} accept={acceptFileFormat} />
      <div className="wizard-upload__inner">
        <div className="wizard-upload__box">
          {!isFileUploading && !files.length &&
          <img src={cloudUpload} />
          }

          {isFileUploading &&
          <div className="wizard-upload__spinner">
            <div className="spinner-border" role="status"></div>
          </div>          
          }

          {!isFileUploading && !!files.length &&
          <div className="wizard-upload__files">
            {files.map(({fileName, value}, key) => {
              return (
                <div className="wizard-upload__file" key={key}>
                  <span>{fileName}</span>
                  <img src={removeFile} className="wizard-upload__remove-file" onClick={handleRemoveFileClick} data-value={value} />
                </div>
              )
            })}
          </div>
          }

          {!isFileUploading && !files.length &&
          <div className="wizard-upload__title">{fieldDescription}</div>
          }

          {!isFileUploading &&
          <a href="#" className="wizard-upload__btn">Загрузить</a>
          }
        </div>
      </div>
    </div>
  );
};

export default UploadFileInput;
