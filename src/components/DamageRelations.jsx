import React, { useEffect, useState } from 'react'
import Type from './Type'

const DamageRelations = ({ damages }) => {
  const [damagePokemonForm, setDamagePokemonForm] = useState([])
  useEffect(() => {
    const damageArray = damages.map((damage) =>
      separateObjectBetweenDamage(damage)
    )

    if (damageArray.length === 2) {
      // 포켓몬은 최대 두가지 속성을 갖는다.
      const joinObj = joinDamageRelations(damageArray)
      setDamagePokemonForm(reduceDuplicateValue(postDamageValue(joinObj.from)))
    } else {
      // 한가지 속성을 갖고 있는 로켓몬 데미지 관계
      setDamagePokemonForm(postDamageValue(damageArray[0].from))
    }
  }, [damages])

  // 데미지 받는 속성 주는 속성 나누는 함수
  const separateObjectBetweenDamage = (damage) => {
    const from = filterDamageRelation('_from', damage)
    const to = filterDamageRelation('_to', damage)

    return { from, to }
  }

  // 데미지 관계 필터링 함수
  const filterDamageRelation = (key, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(key)
      })
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(key, '')
        return (acc = { [keyWithValueFilterRemove]: value, ...acc })
      }, {})

    return result
  }

  const postDamageValue = (damage) => {
    const result = Object.entries(damage).reduce((acc, [keyName, value]) => {
      const key = keyName
      const keyValue = {
        double_damage: '2x',
        half_damage: '1/2x',
        no_damage: '0x',
      }

      return (acc = {
        [key]: value.map((i) => {
          return { damageValue: keyValue[key], ...i }
        }),
        ...acc,
      })
    }, {})

    return result
  }

  // 데미지 관계 합치기
  const joinDamageRelations = (props) => {
    return {
      from: joinObjects(props, 'from'),
      to: joinObjects(props, 'to'),
    }
  }

  // 데이터 합치기
  const joinObjects = (props, key) => {
    const firstValue = props[0][key]
    const secondValue = props[1][key]

    const result = Object.entries(firstValue).reduce(
      (acc, [keyName, value]) => {
        return (acc = {
          [keyName]: value.concat(secondValue[keyName]),
          ...acc,
        })
      },
      {}
    )
    return result
  }

  const reduceDuplicateValue = (props) => {
    const duplicatedValue = {
      double_damage: '4x',
      half_damage: '1/4x',
      no_damage: '0x',
    }

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName

      const verifiedValue = filterForUniqueValue(value, duplicatedValue[key])

      return (acc = { [keyName]: verifiedValue, ...acc })
    }, {})
  }

  const filterForUniqueValue = (valueForFilter, damageValue) => {
    return valueForFilter.reduce((acc, cur) => {
      const { url, name } = cur

      const accFilter = acc.filter((i) => i.name !== name)

      return accFilter.length === acc.length
        ? (acc = [cur, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...accFilter])
    }, [])
  }

  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName
            const damageOfKeyName = {
              double_damage: '약점',
              half_damage: '저항',
              no_damage: '무효',
            }

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm sm:text-base text-slate-500 text-center">
                  {damageOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap justify-center gap-1">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type key={url} type={name} damageValue={damageValue} />
                      )
                    })
                  ) : (
                    <Type type={'none'} key={'none'} />
                  )}
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default DamageRelations
