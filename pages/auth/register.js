
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useState } from "react";
import { useRouter } from "next/router";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import dynamic from "next/dynamic";
import { AuthLayout } from "@/components/AuthLayout";

export default function RegisterPage(){
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');
    const { asPath, push } = useRouter();
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false);
    async function registerUser(){
        try {
            const { data } = await axios.post('/api/user/register', { name, email, password });
            return true;
            // Procesar la respuesta si es necesario
        } catch (error) {
            // Manejar el error aquí
            setOpen(true);
            return false;
            
            
            // O puedes mostrar un mensaje específico al usuario en lugar de loguearlo en la consola
            // Ejemplo:
            // setErrorMessage('Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.');
        }
       
    }
    async function registrar(ev){
        ev.preventDefault();
        if(name.length<2 || name===''){
            setError('El nombre debe tener por lo menos 2 caracteres');
            
           
        }else if(email=== '' || !isValidEmail(email) ){
            setError('El correo que se ingreso no es valido')
            
           
        }else if(password=== '' || password.length<6){
            setError('La contraseña debe tener por lo menos 6 caracteres')

           
        }else{
            
                const valido=await registerUser(name, email, password);
                
                if(valido){
                    push(`/auth/login`);
                    
                }else{
                    setError('Este correo ya existe, intente logeandose')
                    
                }
               
           
        }

       
        
        
        
    }

    const isValidEmail = (email) => {
  
        const match = String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
      
          return !!match;
      };

     const handleClose = () => {
      setOpen(false);
    }; 
    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={registrar}  noValidate>
                <Box sx={{ width: 450, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4' component="h4">Crear cuenta</Typography>
                            {error && !open && (
                                <Chip 
                                label={error}
                                color="error"
                                icon={ <ErrorOutline /> }
                                className="fadeIn"
                                
                                />
                            )}
                           
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth 
                                value={name}
                                onChange={ev => {setName(ev.target.value)}}
                                onKeyDown={ (e) => setError('') }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth 
                                value={email}
                                onChange={ev => {setEmail(ev.target.value);}}
                                onKeyDown={ (e) => setError('') }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth 
                                value={password}
                                onChange={ev => {setPassword(ev.target.value); }}
                                onKeyDown={ (e) => setError('') }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Registrar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link 
                                href={ '/auth/login' } 
                                passHref legacyBehavior
                            >
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
                    <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                      {error}
                    </Alert>
            </Snackbar>
        </AuthLayout>
        
    )
}


