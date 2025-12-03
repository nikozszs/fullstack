import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Register.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';
import axios from '../../axios';
import { Alert, CircularProgress, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()

  const [ avatarUrl, setAvatarUrl ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ uploadError, setUploadError ] = useState('')
  const [ selectedFile, setSelectedFile ] = useState(null)

  const { register, handleSubmit, formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    },
    mode: 'onChange'
  })

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0]

      if (!file) return

      if (!file.type.match('image.*')) {
        setUploadError('Пожалуйста, выберите аватарку')
        return
      }

      if (file.size > 3 * 1024 * 1024) {
        setUploadError('Размер файла не должен превышать 3МВ')
        return
      }

      setIsLoading(true)
      setUploadError('')

      const formData = new FormData()
      formData.append('image', file)

      const { data } = await axios.post('/upload', formData)
      setAvatarUrl(data.url)
      setSelectedFile(file)

    } catch (err) {
      console.log(err)
      setUploadError(err.response?.data?.message || 'Ошибка при загрузке изображения')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]

    if (!file) return

    if (!file.type.match('image.*')) {
      setUploadError('Пожалуйста, выберите изображение (jpeg, png, gif)')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Размер файла не должен превышать 3МВ')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setAvatarUrl(imageUrl)
    setSelectedFile(file)
    setUploadError('')
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('fullName', values.fullName)

      if (selectedFile) {
        formData.append('avatar', selectedFile)
      }

      const {data} = await axios(fetchRegister(values))
  
      if (!data.payload) {
        return alert('Не удалось зарегистрироваться')
      }
  
      if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token)
      }
    } catch (err) {
      console.log('Ошибка регистрации:', err)
    }
  }
  
  if (isAuth === true) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>

      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          <Avatar sx={{ width: 100, height: 100 }}
            src={avatarUrl} 
            alt='Avatar Preview'
            >
              {!avatarUrl && '?'}
          </Avatar>

          <input
            accept='image/*'
            style={{display: 'none'}}
            id='avatar-upload'
            type='file'
            onChange={handleFileSelect} 
            />

            <label htmlFor='avatar-upload'>
              <IconButton color='primary' component='span' className={styles.uploadButton} 
                >
                  <PhotoCamera />
              </IconButton>
            </label>
        </div>

        <Typography
          variant='caption'
          color='textSecondary'
          className={styles.uploadHint}
          >Нажмите на иконку, чтобы загрузить аватар
          <br />
          (до 3MB, JPG, PNG, GIF)
        </Typography>

        {isLoading && (
          <CircularProgress size={20} className={styles.loader} />
        )}

        {uploadError && (
          <Alert severity='error' className={styles.errorAlert} >
            {uploadError}
          </Alert>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          error = {Boolean(errors.fullName?.message)}
          fullWidth 
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите полное имя'})} 
          className={styles.field} 
          label="Полное имя"
          />
        <TextField 
          error = {Boolean(errors.password?.message)}
          fullWidth 
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль'})} 
          className={styles.field} 
          label="Пароль"
          />
        <TextField 
          error = {Boolean(errors.email?.message)}
          fullWidth 
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту'})} 
          className={styles.field} 
          label="E-Mail"
          />
        <Button disabled={!isValid} 
          type='submit' 
          size="large" 
          variant="contained" 
          fullWidth
        >
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Paper>
  );
};
