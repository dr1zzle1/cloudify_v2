import { useDispatch } from 'react-redux'

import { removeUploadFile } from '../../reducers/uploadReducer'
import './Uploader.scss'

const UploadFile = ({ file }) => {
  const dispath = useDispatch()
  return (
    <div className={'upload-file'}>
      <div className={'upload-file__header'}>
        <div className={'upload-file__name'}>{file.name}</div>
        <button className={'upload-file__remove'} onClick={() => dispath(removeUploadFile(file.id))}>
          X
        </button>
      </div>
      <div className={'upload-file__progressBar'}>
        <div className={'upload-file__uploadBar'} style={{ width: file.progress + '%' }} />
        <div className={'upload-file__percent'}>{file.progress}%</div>
      </div>
    </div>
  )
}

export default UploadFile
