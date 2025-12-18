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
  const [ registerError, setRegisterError ] = useState('')

  const { register, handleSubmit, formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    },
    mode: 'onChange'
  })

  const handleFileSelect = async (event) => {
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
      setIsLoading(true)
      setRegisterError('')
      setUploadError('')

      let avatarUrlToSend = '/noavatar.png';

      if (selectedFile) {
        console.log('🔄 Начинаем загрузку аватара...', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        const formData = new FormData()
        formData.append('image', selectedFile)

        try {
          const response = await axios.post('/upload/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('✅ Ответ от /upload/avatar:', response.data);

          if (response.data && response.data.url) {
            avatarUrlToSend = response.data.url;
            console.log('Файл загружен, URL:', avatarUrlToSend);
          } else {
            console.log('Файл не загружен, используем дефолтный');
          }
        } catch (uploadErr) {
          console.error('❌ Ошибка загрузки аватара:', uploadErr)
        }
      }

      const registerData = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        avatarUrl: avatarUrlToSend
      }

      console.log('📤 Регистрируем пользователя с аватаром:', avatarUrlToSend);

      const data = await dispatch(fetchRegister(registerData))

      if (data.error) {
        const errorMessage = data.payload || data.error.message || 'Ошибка регистрации'
        setRegisterError(errorMessage)
        return
      }
  
      if (data.payload && data.payload.token) {
        window.localStorage.setItem('token', data.payload.token);
      } else {
        setRegisterError('Не удалось зарегистрироваться');
      }
    } catch (err) {
      console.log(err)
      setRegisterError(err.message || 'Не удалось зарегистрироваться')
    } finally {
      setIsLoading(false)
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
            src={avatarUrl || '/noavatar.png'} 
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

          {registerError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {registerError}
            </Alert>
          )}

        <Button disabled={!isValid || isLoading} 
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
