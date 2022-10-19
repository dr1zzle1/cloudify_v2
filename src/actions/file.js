import axios from 'axios'

import { addFile, deleteFileAction, setFiles, setRootDirs } from '../reducers/fileReducer'
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer'
import { setUser } from '../reducers/userReducer'

export function getFiles(dirId) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://serene-brushlands-28260.herokuapp.com/api/files${dirId ? '?parent=' + dirId : ''}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      )
      dispatch(setFiles(response.data))
    } catch (e) {
      alert(e.response.data.message)
    }
  }
}

export function getRootDirs() {
  return async (dispatch) => {
    try {
      const response = await axios.get(`https://serene-brushlands-28260.herokuapp.com/api/files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const dirs = response.data.filter((el) => el.type === 'dir')
      dispatch(setRootDirs(dirs))
    } catch (e) {
      alert(e.response.data.message)
    }
  }
}

export function createDir(dirId, name) {
  return async (dispatch, state) => {
    if (!dirId && state().files.rootDirs.length > 4) {
      alert('Вы не можете создать больше 5 коренных папок')
      return
    }
    try {
      const response = await axios.post(
        `https://serene-brushlands-28260.herokuapp.com/api/files`,
        {
          name,
          parent: dirId,
          type: 'dir',
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      )
      dispatch(addFile(response.data))
    } catch (e) {
      alert(e.response.data.message)
    }
  }
}

export function uploadFile(file, dirId, currentUser) {
  return async (dispatch) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (dirId) {
        formData.append('parent', dirId)
      }
      const uploadFile = { name: file.name, progress: 0, id: Date.now() }
      dispatch(showUploader())
      dispatch(addUploadFile(uploadFile))
      const response = await axios.post(`https://serene-brushlands-28260.herokuapp.com/api/files/upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        onUploadProgress: (progressEvent) => {
          const totalLength = progressEvent.lengthComputable
            ? progressEvent.total
            : progressEvent.target.getResponseHeader('content-length') ||
              progressEvent.target.getResponseHeader('x-decompressed-content-length')
          if (totalLength) {
            uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
            dispatch(changeUploadFile(uploadFile))
          }
        },
      })
      dispatch(addFile(response.data))
      dispatch(
        setUser({
          ...currentUser,
          usedSpace: currentUser.usedSpace + file.size,
        }),
      )
    } catch (e) {
      alert(e.response.data.message)
    }
  }
}

export async function downloadFile(file) {
  const response = await fetch(`https://serene-brushlands-28260.herokuapp.com/api/files/download?id=${file._id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  if (response.status === 200) {
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

export function deleteFile(file, currentUser) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`https://serene-brushlands-28260.herokuapp.com/api/files?id=${file._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      dispatch(deleteFileAction(file._id))
      dispatch(
        setUser({
          ...currentUser,
          usedSpace: currentUser.usedSpace - file.size,
        }),
      )
      alert(response.data.message)
    } catch (e) {
      alert(e.response.data.message)
    }
  }
}
