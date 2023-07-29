import { Alert, Avatar, Box, Button, Card, CardContent, Rating, Snackbar, TextField, Typography } from "@mui/material";
import Center from "./Center";
import { useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/router";
const h4={
    'marginBottom' : '12px'
}
const carta={
    'marginBottom' : '12px'
}
const persona={
    'display' : 'flex'
}
const nombre={
    'marginTop': '10px',
    'marginLeft': '10px'
}
const comentarioText={
    'width': '100vh'
}
const StyledDiv = styled.div`
  max-width: 1050px;
  min-height: 550px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BotonAgregar={
    'marginTop': '16px'
}
const divNoComentarios={
    'marginTop': '16px'
}
export default function Comentarios({product, usuarios}) {
    const [isAgregar, setIsAgregar]= useState(false);
    const [value, setValue] = useState(0);
    const [userFirst, setUserFirst] = useState(null)
    const [comentario, setComentario] = useState('')
    const [openNuevoComentario, setOpenNuevoComentario] = useState(false)
    const {user, isLoggedIn} = useContext(AuthContext)
    const [comentarios, setComentarios] = useState([]);
    const [openComentarios, setOpenComentarios]= useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        
    
        fetchComentarios();
      }, [product._id]);

      const handleClose = () => {
        setOpen(false);
      };
  
      async function fetchComentarios() {
        try {
          const response = await axios.get(`/api/product?id=${product._id}`);
          const comentariosData = response.data.comments || [];
          
          setComentarios(comentariosData);
        } catch (error) {
        }
      }

    async function abrirNuevoComentario(){
        if(isLoggedIn){
            if(openNuevoComentario){
                setOpenNuevoComentario(false)
                setOpenComentarios(true)
            }else{
                if(comentarios.length>0){
                    comentarios.map(comentario=>{
                        if(comentario.user === user.user._id){
                            setOpen(true);
                            
                            setError('El usuario ya ingreso un comentario')
                            return;
                        }else{
                            setOpenNuevoComentario(true);
                            setOpenComentarios(false)
                        }
                    })
                }else{
                    setOpenNuevoComentario(true);
                    setOpenComentarios(false)
                }
               
                
            }
            
        }
        else{
            router.push('/auth/login')
        }
    }

    async function agregarComentario(){
        const data={...product, comments:[{user:user.user._id, rating:value, comment:comentario}]}
        setOpenNuevoComentario(false)
        setOpenComentarios(true)
        await axios.put('/api/product', data)
        fetchComentarios();
    }

    function buscarUsuario(usuarioId) {
        if (usuarioId !== undefined) {
          for (const usuario of usuarios) {
            if (usuario._id === usuarioId) {
              return usuario.name ;
            }
          }
        }
        return "Anónimo";
      }
      
    
    return (
      <StyledDiv>
        <h4 style={h4}>Seccion de comentarios</h4>
        <Button variant="contained" onClick={abrirNuevoComentario} style={carta}>Agregar comentario</Button>
        {openNuevoComentario && (
            <Card sx={{ minWidth: 275 }} style={carta} >
                <CardContent >
                    <div style={persona}>
                        
                        <Avatar alt="Imagen de usuario" src="https://cdn.icon-icons.com/icons2/1508/PNG/512/systemusers_104569.png" />
                        <h4 style={nombre}>{user?.user.name}</h4>
                    </div>
                    
                    <Box component="fieldset" mb={3} mt={3} borderColor="transparent">
                        <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        />
                    </Box>
                    <TextField
                    id="outlined-multiline-static"
                    label="Comentario"
                    multiline
                    rows={4}
                    mb={3}
                    value={comentario}
                    onChange={ev=>setComentario(ev.target.value)}
                    style={comentarioText}
                    />
                     <Button variant="contained" onClick={agregarComentario} style={BotonAgregar}>Agregar</Button>
                </CardContent>
            </Card>
       
        )}
        {comentarios.length>0 && openComentarios && comentarios.map(comentario=>(
                <Card sx={{ minWidth: 275 }} style={carta} readOnly key={comentario.user}> 
                <CardContent >
                    <div style={persona}>
                        
                        <Avatar alt="Imagen de usuario" src="https://cdn.icon-icons.com/icons2/1508/PNG/512/systemusers_104569.png" />
                        <h4 style={nombre}>{buscarUsuario(comentario.user)}</h4>
                    </div>
                    
                    <Box component="fieldset" mb={3} mt={3} borderColor="transparent">
                        <Rating
                        name="simple-controlled"
                        value={comentario.rating}
                        readOnly
                        />
                    </Box>
                    <h5>{comentario.comment}</h5>
                    
                   
                </CardContent>
            </Card>
            ))
        }
        {openComentarios && comentarios.length===0 && (
            <div style={divNoComentarios}>
                <h4>Aun no hay comentarios sobre este producto</h4>
            </div>
            
        )

        }
        <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
                        <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                          {error}
                        </Alert>
        </Snackbar>
      </StyledDiv>
      
    );
  }