import axios from 'axios'
import { useEffect, useState } from 'react'
import PokeCard from '../../components/PokeCard'
import AutoComplete from '../../components/AutoComplete'

const MainPage = () => {
  //모든 포켓몬데이터
  const [allPokemons, setAllPokemons] = useState([])
  //보여줄 포켓몬데이터
  const [displayedPokemons, setDisplayedPokemons] = useState([])
  // 한번에 보여줄 포켓몬 수
  const limitNum = 20
  // 포켓몬 데이터를 가져올 url
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`

  useEffect(() => {
    fetchPokemon()
  }, [])

  const fetchPokemon = async () => {
    try {
      const res = await axios.get(url)
      setAllPokemons(res.data.results)
      setDisplayedPokemons(filterDisplayedPokemonData(res.data.results))
    } catch (error) {
      console.log(error)
    }
  }

  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayPokemons = []
  ) => {
    const limit = displayPokemons.length + limitNum
    const pokemonArray = allPokemonsData.filter(
      (_, index) => index + 1 <= limit
    )

    return pokemonArray
  }

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <AutoComplete
          allPokemons={allPokemons}
          setDisplayedPokemons={setDisplayedPokemons}
        />
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }, index) => (
              <PokeCard url={url} name={name} key={url} />
            ))
          ) : (
            <div className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </div>
          )}
        </div>
      </section>
      <div className="text-center">
        {allPokemons.length > displayedPokemons.length &&
          displayedPokemons.length !== 1 && (
            <button
              onClick={() =>
                setDisplayedPokemons(
                  filterDisplayedPokemonData(allPokemons, displayedPokemons)
                )
              }
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
            >
              더 보기
            </button>
          )}
      </div>
    </article>
  )
}

export default MainPage
