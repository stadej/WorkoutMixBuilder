import {React, useState} from 'react';
import styled from 'styled-components';
import SeedList from './seedList.js';
import {searchGenre, searchArtist, searchTrack} from '../utils/spotifyUtils.js';

const SeedSearchContainer = styled.div`
	position: relative;
    color: white;
	display: flex;
    height: 100%;
    width: 100%;
	align-items: center;  
    flex-direction: column;
    justify-content: start;
    gap: 20px;
`;

const CloseWindowContainer = styled.div`
	position: relative;
    height: 30px;
    width: 100%;
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const CloseWindowButton = styled.button`
    width: 30px;
    height: 30px;
    font-size: 20px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
`;

const SearchBarContainer = styled.div`
    position: relative;
    width: 100%;
	display: flex;
	align-items: center;  
    flex-direction: row;
    justify-content: flex-start;
`;

const SearchBar = styled.input`
    position: relative;
    width: 80%;
    height: 30px;
    font-size: 15px;
    white-space: nowrap;
    padding-block: 0px;
    padding-inline: 10px;
    border: none;
    border-radius: 10px 0 0 10px;
`;

const SearchBarButton = styled.button`
    position: relative;
    width: 30%;
    height: 30px;
    background-color: #0077b6;
    color: white;
    border: white solid 1px;
    border-radius: 0 10px 10px 0;

    &:hover {
        background-color: white;
        color: #0077b6;
        border: #0077b6 solid 1px;
        cursor: pointer;
    }
`;

const TypeButtonContainer = styled.div`
	position: relative;
    width: 100%;
	display: flex;
	align-items: center;  
    flex-direction: row;
    justify-content: space-around;
`;

const TypeButton = styled.button`
    position: relative;
    width: 30%;
    height: 30px;
    background-color: dimgray;
    color: white;
    border: white solid 1px;
    border-radius: 10px;

    &:hover:enabled {
        background-color: white;
        color: dimgray;
        cursor: pointer;
    }

    &:disabled {
        background-color: #0077b6;
        cursor: default;
    }
`;

export default function SeedSearch({handleAdd, handleClose}) {
    const [type, setType] = useState('genre');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [offset, setOffset] = useState(0);
    const [canAdd, setCanAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const addSeed = (index) => {
        handleAdd(results[index]);
    }

    const getPlaceholderText = () => {
        switch (type){
            case('genre'):
                return('search for a genre');

            case('artist'):
                return('search for an artist');

            case('track'):
                return('search for a song');
        }
    }

    const fetchResults = async () => {
        let newResults = [];
        let transformedResults = [];

        switch (type){
            case('genre'):
                newResults = await searchGenre(query);
                transformedResults = newResults.map((r) => {
                return{
                    spotify_id: r,
                    name: r,
                    type: type,
                    image_source: 'https://st.depositphotos.com/2167093/3949/v/450/depositphotos_39499013-stock-illustration-music-note-icon-flat-design.jpg'
            }});
                break;

            case('artist'):
                newResults = await searchArtist(query, offset);
                transformedResults = newResults.map((r) => {
                    return{
                        spotify_id: r.id,
                        name: r.name,
                        type: type,
                        image_source: r.images.at(0) ? r.images.at(0).url :
                            'https://st.depositphotos.com/2167093/3949/v/450/depositphotos_39499013-stock-illustration-music-note-icon-flat-design.jpg'
                }});
                break;

            case('track'):
                newResults = await searchTrack(query, offset);
                transformedResults = newResults.map((r) => {
                    return{
                        spotify_id: r.id,
                        name: r.name,
                        type: r.artists.map((a) => a.name).join(', '),
                        image_source: r.album.images.at(0) ? r.album.images.at(0).url :
                            'https://st.depositphotos.com/2167093/3949/v/450/depositphotos_39499013-stock-illustration-music-note-icon-flat-design.jpg'
                }}); 
                break;   
        }

        if (transformedResults.length === 5){
            setCanAdd(true);
        }

        return (transformedResults);
    };

    const clearResults = () => {
        setResults([]);
        setOffset(0);
        setCanAdd(false);
    };

    const handleSearch = async () => {
        setLoading(true);

        let searchResults = await fetchResults(query, type);

        setResults(searchResults);

        let newOffset = 5;
        setOffset(newOffset);

        setLoading(false);
    };

    const handleMoreResults = async () => {
        setLoading(true);

        let searchResults = await fetchResults(query, type);

        setResults([...results, ...searchResults]);

        let newOffset = offset + 5;
        setOffset(newOffset);

        setLoading(false);
    };

    return(
        <SeedSearchContainer>
            <CloseWindowContainer>
                <CloseWindowButton
                    onClick={handleClose}
                >X</CloseWindowButton>
            </CloseWindowContainer>
            <SearchBarContainer>
                <SearchBar
                    type='text'
                    onChange={(e) => {
                        clearResults();
                        setQuery(e.target.value);
                    }}
                    placeholder={getPlaceholderText()}
                />
                <SearchBarButton
                    onClick={handleSearch}
                >search</SearchBarButton>
            </SearchBarContainer>
            <TypeButtonContainer>
                <TypeButton
                    onClick={() => {
                        clearResults();
                        setType('genre');
                    }}
                    disabled={type === 'genre'}
                >
                    genres
                </TypeButton>
                <TypeButton
                    onClick={() => {
                        clearResults();
                        setType('artist');
                    }}
                    disabled={type === 'artist'}
                >
                    artists
                </TypeButton>
                <TypeButton
                    onClick={() => {
                        clearResults();
                        setType('track');
                    }}
                    disabled={type === 'track'}
                >
                    songs
                </TypeButton>
            </TypeButtonContainer>
            <SeedList
                seeds={results}
                loading={loading}
                onClick={addSeed}
                buttonStyle='green'
                emptyMessage='No seeds matching this search were found.'
                canAdd={canAdd}
                addMessage='More Results'
                onAdd={handleMoreResults}
            />
        </SeedSearchContainer>
    )
}