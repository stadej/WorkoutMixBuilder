import React from 'react';
import styled from 'styled-components';
import runner from '../images/runner.svg';

const Body = styled.div`
    background-color: #282c34;
	position: sticky;
	box-sizing: border-box;
	top: 0;
  	left: 0;
	width: 100%;
	display: flex;
	gap: 20px;
	align-items: center;  
    flex-direction: row;
    align-items: center;
    justify-content: center;
	border-bottom: white solid 2px;
	z-index: 3;
`;

const Title = styled.div`
	position: relative;
    text-align: center;
    font-size: 60px;
    color: white;

	@media (max-width: 1000px) {
    	font-size: 6vw;
    }
`;

const LeftImage = styled.img`
	position: relative;
	color: white;
	object-fit: contain;
	width: 100px;
	height: 100px;
	transform: scaleX(1);
		@media (max-width: 1000px) {
    	font-size: 6vw;
    }

	@media (max-width: 1000px) {
		width: 10vw;
		height: 10vw;
    }
`;

const RightImage = styled.img`
	position: relative;
	color: white;
	object-fit: contain;
	width: 100px;
	height: 100px;
	transform: scaleX(-1);

	@media (max-width: 1000px) {
		width: 10vw;
		height: 10vw;
    }
`;

export default function Banner() {
	return (
		<Body>
			<LeftImage src={runner}/>
			<Title>Workout Mix Builder</Title>
			<RightImage src={runner}/>
		</Body>
	);
}