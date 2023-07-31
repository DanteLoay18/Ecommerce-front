import styled from "styled-components";
import {useState} from "react";

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
  `;
const BigImage = styled.img`
  max-width: 100% !important;
  max-height: 200px !important; 
`;
const ImageButtons = styled.div`
    display: flex ;
    gap: 10px ;
    flex-grow: 0 ;
    margin-top: 10px ;
  `;
const ImageButton = styled.div`
    border: 2px solid #ccc !important;
    ${props => props.active ? `
      border-color: #ccc !important; 
    ` : `
      border-color: transparent !important;
    `}
    height: 40px !important;
    padding: 2px !important;
    cursor: pointer !important;
    border-radius: 5px !important;
  `;


const BigImageWrapper = styled.div`
  text-align: center !important;
`;

export default function ProductImages({images}) {
  const [activeImage,setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} />
      </BigImageWrapper>
      <ImageButtons >
        {images.map(image => (
          <ImageButton
            key={image}
            active={image===activeImage}
            onClick={() => setActiveImage(image)}>
            <Image src={image} alt=""/>
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}