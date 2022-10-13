import React from 'react';
import { useDispatch } from 'react-redux';
import { removeUploadFile } from '../../reducers/uploadReducer';
import './Uploader.scss';

const UploadFile = ({ file }) => {
  const dispath = useDispatch();
  return (
    <div className={'uploadFile'}>
      <div className={'uploadFile__header'}>
        <div className={'uploadFile__name'}>{file.name}</div>
        <button className={'uploadFile__remove'} onClick={() => dispath(removeUploadFile(file.id))}>
          X
        </button>
      </div>
      <div className={'uploadFile__progressBar'}>
        <div className={'uploadFile__uploadBar'} style={{ width: file.progress + '%' }} />
        <div className={'uploadFile__percent'}>{file.progress}%</div>
      </div>
    </div>
  );
};

export default UploadFile;
