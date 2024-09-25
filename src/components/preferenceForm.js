import {React, useState} from 'react';
import styled from 'styled-components';
import SeedSearch from './seedSearch.js';
import SeedList from './seedList.js';
import {createPlaylist} from '../utils/spotifyUtils.js';

const ContentWindow = styled.div`
    position: relative;
    box-sizing: border-box;
    display: flex;
    direction: row;
    justify-content: space-around;
    margin: 20px;
    height: calc(100vh - min(100px, 10vw) - 42px);
    width: 90vw;

    @media (max-width: 1000px){
        width: 100vw;
    }

`;

const TabContainer = styled.div`
	position: relative;
	height: 100%;
    box-sizing: border-box;
    color: white;
	display: flex;
	align-items: center;  
    flex-direction: column;
    justify-content: start;
    padding: 20px;
    gap: 20px;
    border: white solid 2px;
    border-radius: 10px;
    container-type: inline-size;
    min-width: 300px;

    width: ${(props) => {
        switch(props.tabs){
            case(1):
                return(`100%`);
            case(2):
                return(`45%`);
            case(3):
                return(`30%`);
        }
    }};
`;

const FormHeaderText = styled.div`
	position: relative;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
`;

const HeaderText = styled.div`
	position: relative;
    text-align: flex-start;
    font-size: 25px;
    font-weight: bold;
`;

const SeedListContainer = styled.div`
	position: relative;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
	display: flex;
    flex: 1 1 auto;
	align-items: flex-start;  
    flex-direction: column;
    justify-content: start;
    gap: 10px;
    overflow-y: auto;
`;

const TempoRangeContainer = styled.div`
	position: relative;
	display: flex;
    width: 100%;
	align-items: flex-start;  
    flex-direction: column;
    justify-content: start;
    gap: 10px;
`;

const SliderContainer = styled.div`
	position: relative;
    width: 100%;
`;

const FormContainer = styled.div`
	position: relative;
    width: 100%;
    display: flex;
	align-items: center;  
    flex-direction: row;
    justify-content: space-between;
`;

const Slider = styled.input`
    -webkit-appearance: none; 
    appearance: none;
    height: 10px;
    width: 100%;
    position: absolute;
    background: ${(props) => `linear-gradient(
        to right, 
        #C6C6C6 0%,
        #C6C6C6 ${props.minPercent}%,
        #4169E1 ${props.minPercent}%,
        #4169E1 ${props.maxPercent}%, 
        #C6C6C6 ${props.maxPercent}%, 
        #C6C6C6 100%)`};
    pointer-events: none;
    z-index: ${(props) => props.below ? '0' : '2'};

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        width: 24px;
        height: 24px;
        background-color: #4169E1;
        border: white solid 3px;
        border-radius: 50%;
        cursor: pointer;
    }

    &::-moz-range-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        width: 24px;
        height: 24px;
        background-color: #4169E1;
        border: white solid 3px;
        border-radius: 50%;
        cursor: pointer;
    }
`;

const MaxSlider = styled(Slider)`
    height: 0;
    top: 5px;
    z-index: 1;
`;

const NumberForm = styled.input`
    color: #8a8383;
    width: 50px;
    height: 30px;
    font-size: 20px;
    padding-left: 5px;
    padding-right: 5px;
    border: none;
    border-radius: 10px;
`;

const NumberInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => props.alignStart ? 'flex-start' : 'flex-end'};
    padding: 5px;
`

const SubmitButton = styled.button`
    width: 50%;
    font-size: 20px;
    border: white solid 1px;
    border-radius: 10px;
    background-color: #0077b6;
    color: white;
    padding: 10px;

    &:hover:enabled {
        background-color: white;
        color: #0077b6;
        cursor: pointer;
    }

    &:disabled {
        background-color: silver;
        color: dimgray;
        cursor: not-allowed;
    }
`;

const testSeeds = [
    {
        spotify_id: 'rock',
        name: 'Rock',
        type: 'genre',
        image_source: 'https://st.depositphotos.com/2167093/3949/v/450/depositphotos_39499013-stock-illustration-music-note-icon-flat-design.jpg',
    },
    {
        spotify_id: '1dfeR4HaWDbWqFHLkxsg1d',
        name: 'Queen',
        type: 'artist',
        image_source: 'https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982',
    },
    {
        spotify_id: '003vvx7Niy0yvhvHt4a68B',
        name: 'Mr. Brightside',
        type: 'The Killers',
        image_source: 'https://i.scdn.co/image/ab67616d0000b273ccdddd46119a4ff53eaf1f5d',
    },
  ];

export default function PreferenceForm() {
    const [seedSearch, setseedSearch] = useState(1);
    const [preferenceForm, setPreferenceForm] = useState(1);
    const [playlistFlag, setPlaylistFlag] = useState(0);

    const [playlist, setPlaylist] = useState([]);

    const [seeds, setSeeds] = useState(testSeeds);    
    const [minBpm, setMinBpm] = useState(120);
    const [maxBpm, setMaxBpm] = useState(160);
    const [numSongs, setNumSongs] = useState(10);

    const addSeed = (seed) => {
        if(seeds.length < 5){
            setSeeds([...seeds, seed]);
        }
    };

    const removeSeed = (index) => {
        const newSeeds = [...seeds];
        newSeeds.splice(index, 1);
        setSeeds(newSeeds);
    };

    const controlMinInput = (e) => {
        let newMin = Number(e.target.value);

        if (newMin >= maxBpm) {
            setMinBpm(maxBpm);
        }
        else {
            setMinBpm(newMin);
        }
    };

    const controlMaxInput = (e) => {
        let newMax = Number(e.target.value);
        
        if (newMax <= minBpm) {
            setMaxBpm(minBpm);
        } 
        else {
            setMaxBpm(newMax);
        }
    };

    const handleSubmit = async () => {
        let playlistResult = await createPlaylist(seeds, minBpm, maxBpm, numSongs);
        let transformedResults = playlistResult.map((r) => {
            return{
                spotify_id: r.id,
                name: r.name,
                type: r.artists.map((a) => a.name).join(', '),
                image_source: r.album ? r.album.images.at(0).url :
                    'https://st.depositphotos.com/2167093/3949/v/450/depositphotos_39499013-stock-illustration-music-note-icon-flat-design.jpg'
        }}); 
        setPlaylistFlag(1);
        setPlaylist(transformedResults);
    };

    return(
        <ContentWindow>
            {seedSearch === 1 &&
                <TabContainer
                    tabs={seedSearch + preferenceForm + playlistFlag}
                >
                    <SeedSearch
                        handleAdd={addSeed}
                        handleClose={() => setseedSearch(0)}
                    />
                </TabContainer>
            }
            <TabContainer
                tabs={seedSearch + preferenceForm + playlistFlag}
            >
                <FormHeaderText>Playlist Preferences</FormHeaderText>
                <SeedListContainer>
                    <HeaderText>Seeds</HeaderText>
                    <SeedList
                        seeds={seeds}
                        onClick={removeSeed}
                        buttonStyle='red'
                        emptyMessage='You have not added any seeds'
                        canAdd={seeds.length < 5}
                        addMessage='Add a Seed +'
                        onAdd={() => setseedSearch(1)}
                    />
                </SeedListContainer>
                <TempoRangeContainer>
                    <HeaderText>Tempo Range</HeaderText>
                    <SliderContainer>
                        <Slider 
                            type="range" 
                            value={minBpm} 
                            onChange={controlMinInput}
                            min="60" 
                            max="240"
                            below={minBpm < 240}
                            minPercent={Math.ceil(((minBpm-60)/180)*100)}
                            maxPercent={Math.floor(((maxBpm-60)/180)*100)}
                        />
                        <MaxSlider 
                            type="range" 
                            value={maxBpm}
                            onChange={controlMaxInput} 
                            min="60" 
                            max="240"
                        />
                    </SliderContainer>
                    <FormContainer>
                        <NumberInputContainer alignStart>
                            <label for="minInput">Min bpm</label>
                            <NumberForm
                                id="minInput"
                                type="number" 
                                value={minBpm}
                                onInput={controlMinInput}
                                min="60" 
                                max={maxBpm}
                            />
                        </NumberInputContainer>
                        <NumberInputContainer>
                            <label for="maxInput">Max bpm</label>
                            <NumberForm 
                                id="maxInput"
                                type="number"
                                value={maxBpm} 
                                onInput={controlMaxInput} 
                                min={minBpm} 
                                max="240"
                            />
                        </NumberInputContainer>
                    </FormContainer>
                </TempoRangeContainer>
                <FormContainer>
                    <HeaderText>Number of Songs</HeaderText>
                    <NumberForm 
                        id="maxInput"
                        type="number"
                        value={numSongs} 
                        onInput={(e) => setNumSongs(Number(e.target.value))} 
                        min="1"
                        max="100"
                    />
                </FormContainer>
                <SubmitButton
                    disabled={seeds.length < 1}
                    onClick={handleSubmit}
                >
                    Generate Playlist
                </SubmitButton>
            </TabContainer>
            {playlist.length > 0 &&
                (<TabContainer
                    tabs={seedSearch + preferenceForm + playlistFlag}
                >
                    <h2>here's your playlist lmao</h2>
                    <SeedList
                        seeds={playlist}
                        buttonStyle={false}
                        canAdd={false}
                    />
                </TabContainer>)
            }
        </ContentWindow>
    );
}