import {React, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import ListElement from './listElement.js';

const SeedListContainer = styled.div`
	position: relative;
    box-sizing: border-box;
    width: 100%;
	display: flex;
    flex: 1 1 auto;
	align-items: flex-start;  
    flex-direction: column;
    justify-content: start;
    border: white solid 1px;
    border-radius: 10px;
    overflow: hidden;
`;

const SeedListContent = styled.div`
    position: relative;
    box-sizing: border-box;
    width: 100%;
	display: flex;
    flex: 1 1 auto;
	align-items: flex-start;  
    flex-direction: column;
    justify-content: start;
    gap: 10px;
    padding: 10px;
    scrollbar-gutter: stable;
    overflow-y: auto;
    overflow-x: hidden;
`;

export default function SeedList({seeds, loading, onClick, buttonStyle, emptyMessage}){
    return(
        <SeedListContainer>
            <SeedListContent>
                {seeds.length > 0 && 
                    (seeds.map((seed, index) => 
                        (<ListElement 
                            key={index} 
                            seed={seed}
                            onClick={() => onClick(index)}
                            buttonStyle={buttonStyle}
                        />)
                    ))
                }
                {seeds.length === 0 && 
                !loading &&
                    (<h3>{emptyMessage}</h3>)
                }
                {loading &&
                    (<Spinner animation="border" variant="light" />)
                }
            </SeedListContent>
        </SeedListContainer>
    );
}