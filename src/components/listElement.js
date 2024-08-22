import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';

const ElementContainer = styled.div`
	position: relative;
    width: 100%;
    box-sizing: border-box;
	display: flex;
	align-items: center;  
    flex-direction: row;
    justify-content: flex-start;
    border: white solid 1px;
    border-radius: 10px;
    padding: 10px;
    min-width: 350px;
    gap: 10px;
`;

const ThumbnailImage = styled.img`
    width: 70px;
    height: 70px;
    border: black solid 1px;
    border-radius: 5px;
`;

const ElementName = styled.div`
    width: inherit;
    font-size: 25px;
    font-weight: bold;
    overflow-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const OtherText = styled.div`
    width: inherit;
    font-size: 15px;
    white-space: nowrap;
    overflow-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DescriptionContainer = styled.div`
    display: flex;
	align-items: flex-start;  
    flex-direction: column;
    width: 100%;
    gap: 5px;
`;

const ActionButton = styled.button`
    width: 30px;
    height: 30px;
    border: white solid 1px;
    border-radius: 10px;
    background-color: ${(props) => props.buttonStyle};
    color: white;
    cursor: pointer;
`;

export default function ListElement({seed, onClick, buttonStyle}) {

    return(
        <ElementContainer>
           <ThumbnailImage src={seed.image_source}/>
           <DescriptionContainer>
                <ElementName>{seed.name}</ElementName>
                <OtherText>{seed.type}</OtherText>
                <OtherText>id: {seed.spotify_id}</OtherText>
           </DescriptionContainer>
           {buttonStyle &&
            <ActionButton
                onClick={() => onClick()}
                buttonStyle={buttonStyle}
            >
                {buttonStyle === 'green' ? '+' : 'X'}
            </ActionButton>
           }
        </ElementContainer>
    );
};

ListElement.propTypes = {
    seed: propTypes.any,
    onRemove: propTypes.func,
}

