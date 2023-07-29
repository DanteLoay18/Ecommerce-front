import { AuthLayout } from "@/components/AuthLayout";
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, getSession, getProviders } from 'next-auth/react';
import emailjs from '@emailjs/browser';
import { useRouter } from "next/router";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');
    const [user, setUser]= useState(null);
    const { asPath, push } = useRouter();
    const [verificado, setVerificado] = useState(true)
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false);

    async function validar(ev){
        ev.preventDefault();
        if(user.codigo === codigo){
            await axios.put('/api/user/login', {...user, verificado:true});
            await signIn('credentials',{ email, password });
        }else{
            //Validar cuando es incorrecto 
            setOpen(true);
            setError("Codigo de verificacion no es correcto")
        }
    }

    async function logearse(e){
        e.preventDefault();
        try{
            const { data } = await axios.post('/api/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token );
            return user;
        }
        catch(err){
            setError(err.response.data.message)
            //setError(error.message)
            return null;
        }
        
    }
    async function login(ev){
        ev.preventDefault();
        if(email=== '' || !isValidEmail(email) ){
            setError('El correo que se ingreso no es valido')
            
           
        }else if(password=== '' || password.length<6){
            setError('La contraseña debe tener por lo menos 6 caracteres')

           
        }else {
            const user= await logearse(ev);
            const cod=generarNumerosAleatorios()
            if(user){
                
                if(!user.verificado){
                    const email = {name: user.name, message:cod , from:user.email}
                    
                        emailjs.send("service_gqirp4f", "template_lgpbn7t", email, "nEQuq5QUJ8p7uvjng")
                               .then(async (result) => {
                                const usuarioNuevo=await axios.put('/api/user/login', {...user, codigo:cod});
                                setUser(usuarioNuevo.data);
                                setVerificado(false)
                        }, (error) => {
                        });
    
                        
                    
                    
                    
                }else{
                    await signIn('credentials',{ email, password });
                }
             }else{
                //setError('Este correo ya existe, intente logeandose')
                setOpen(true);
             }
        
        }

        if(error){
            setTimeout(() => {
                setError('')
            }, 3000);
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

    function generarNumerosAleatorios(){
        let numeroAleatorio = Math.floor(Math.random() * 100000);

        // Asegurarse de que el número tenga 5 dígitos agregando ceros a la izquierda si es necesario
        let numeroFormateado = String(numeroAleatorio).padStart(5, '0');

        return numeroFormateado.toString();
    }
   
    if(!verificado){
        return (
            <AuthLayout title={'Ingresar'}>
            <form onSubmit={validar} noValidate>
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Codigo de verificacion"
                                variant="filled"
                                fullWidth 
                                value={codigo}
                                onChange={ev => setCodigo(ev.target.value)}
                                onKeyDown={ (e) => setError('') }
                            />

                        </Grid>
                       

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth>
                                Enviar
                            </Button>
                        </Grid>


                    </Grid>
                </Box>
            </form>
            <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={3000} onClose={handleClose} key={'top' + 'center'}>
                    <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                      {error}
                    </Alert>
            </Snackbar>
        </AuthLayout>
        )
    }
    return (
        
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={login} noValidate>
                <Box sx={{ width: 450, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4' component="h4">Login</Typography>
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
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth 
                                value={email}
                                onChange={ev => setEmail(ev.target.value)}
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
                                onChange={ev => setPassword(ev.target.value)}
                                onKeyDown={ (e) => setError('') }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>


                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link 
                                href={ '/auth/register' } 
                                legacyBehavior
                                passHref
                            >
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </Link>
                        </Grid>

                            
                        {/* <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                Object.values( providers ).map(( provider: any ) => {
                                    
                                    if ( provider.id === 'credentials' ) return (<div key="credentials"></div>);

                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant="outlined"
                                            fullWidth
                                            color="primary"
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn( provider.id ) }
                                        >
                                            { provider.name }
                                        </Button>
                                    )

                                })
                            }

                        </Grid> */}

                    </Grid>
                </Box>
            </form>
             <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={3000} onClose={handleClose} key={'top' + 'center'}>
                    <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                      {error}
                    </Alert>
            </Snackbar>
        
        </AuthLayout>
  )
}



export const getServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });

    const { p = '/' } = query;

    if ( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: { }
    }
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time






