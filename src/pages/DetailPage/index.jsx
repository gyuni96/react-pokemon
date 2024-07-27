import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading'
import { LessThan } from '../../assets/LessThan'
import { GreaterThan } from '../../assets/GreaterThan'
import { ArrowLeft } from '../../assets/ArrowLeft'
import { Balance } from '../../assets/Balance'
import { Vector } from '../../assets/Vector'
import Type from '../../components/Type'
import BaseStat from '../../components/BaseStat'
import DamageModal from '../../components/DamageModal'

const DetailPage = () => {
  const [pokemon, setPokemon] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { id: pokemonId } = useParams()
  const pokemonBaseUrl = 'https://pokeapi.co/api/v2/pokemon/'

  // 페이지 진입시
  useEffect(() => {
    fetchPokemonData()
  }, [])

  // 포켓몬 정보 가져오기
  const fetchPokemonData = async () => {
    const url = `${pokemonBaseUrl}${pokemonId}`

    try {
      const { data: pokemonData } = await axios.get(url)
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData
        const nextAndPrevPokemon = await getNextAndPrevPokemon(id)

        const DamageRelations = await Promise.all(
          types.map(async (item) => {
            const { data } = await axios.get(item.type.url)
            return data.damage_relations
          })
        )

        const formattedPokemonData = {
          id: id,
          name: name,
          weight: weight / 10,
          height: height / 10,
          types: types.map((item) => item.type.name),
          previous: nextAndPrevPokemon.prev,
          next: nextAndPrevPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
        }

        setPokemon(formattedPokemonData)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  // 다음&이전 포켓몬 정보 가져오기
  const getNextAndPrevPokemon = async (id) => {
    const urlPokemon = `${pokemonBaseUrl}?limit=1&offset=${id - 1}`
    const { data: pokemonData } = await axios.get(urlPokemon)

    const nextPokemon = pokemonData.next && (await axios.get(pokemonData.next))
    const prevPokemon =
      pokemonData.previous && (await axios.get(pokemonData.previous))

    return {
      next: nextPokemon?.data?.results?.[0]?.name,
      prev: prevPokemon?.data?.results?.[0]?.name,
    }
  }

  // 포켓몬 속성 포멧팅
  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((item) => item.ability.name.replaceAll('-', ' '))
  }

  // 포켓몬 스텟 포멧팅
  const formatPokemonStats = ([
    statHp,
    statATK,
    statDEF,
    statSpATK,
    statSpDEF,
    statSPD,
  ]) => [
    { name: 'Hit Point', baseStat: statHp.base_stat },
    { name: 'Attack', baseStat: statATK.base_stat },
    { name: 'Defense', baseStat: statDEF.base_stat },
    { name: 'Special Attack', baseStat: statSpATK.base_stat },
    { name: 'Special Defense', baseStat: statSpDEF.base_stat },
    { name: 'Speed', baseStat: statSPD.base_stat },
  ]

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
  const bg = `bg-${pokemon?.types?.[0]}`
  const text = `text-${pokemon?.types?.[0]}`

  if (isLoading) {
    return (
      <div
        className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}
      >
        <Loading className={`w-12 h-12 x-50 animate-spin text-slate-900`} />
      </div>
    )
  }

  if (!isLoading && !pokemon) return <div>존재하지 않은 포켓몬입니다...</div>

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}

        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}

        <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1 ">
              <Link to="/">
                <ArrowLeft className="w-6 h-8 text-white" />
              </Link>
              <h1 className="text-zinc-200 font-bold text-lg capitalize ">
                {pokemon.name}
              </h1>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>
          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width={'100%'}
              height={'auto'}
              loading="lazy"
              alt={pokemon.name}
              className="object-contain h-full cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
        <section className="w-full min-h-[65%] bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>
          <h2 className={`text-base font-semibold ${text}`}>정보</h2>
          <div className="flex justify-between w-full items-center max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Height</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Abilities</h4>
              {pokemon.abilities.map((ability) => {
                return (
                  <div
                    key={ability}
                    className={`text-zinc-200 text-[0.5rem] capitalize`}
                  >
                    {ability}
                  </div>
                )
              })}
            </div>
          </div>
          <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
          <div className="w-full">
            <table>
              <tbody>
                {pokemon.stats.map((stat) => {
                  return (
                    <BaseStat
                      key={stat.name}
                      statName={stat.name}
                      statValue={stat.baseStat}
                      type={pokemon.types[0]}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
          <h2 className={`text-base font-semibold ${text}`}>설명</h2>
        </section>
      </div>
      {isModalOpen && (
        <DamageModal
          setIsModalOpen={setIsModalOpen}
          damages={pokemon.DamageRelations}
        />
      )}
    </article>
  )
}

export default DetailPage
