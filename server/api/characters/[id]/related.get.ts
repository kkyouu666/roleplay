import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 6

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Character ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100))

  const currentCharacter = charactersData.find(char => char.id === id)

  if (!currentCharacter) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Character not found'
    })
  }

  // 过滤掉当前角色
  const otherCharacters = charactersData.filter(char => char.id !== id)

  // 计算相关性分数
  const relatedCharacters = otherCharacters.map(char => {
    let score = 0

    // 相同分类 +3分
    if (char.category === currentCharacter.category) {
      score += 3
    }

    // 相同标签，每个 +2分
    const commonTags = char.tags.filter(tag => currentCharacter.tags.includes(tag))
    score += commonTags.length * 2

    // 相似评分 +1分
    const ratingDiff = Math.abs(char.stats.rating - currentCharacter.stats.rating)
    if (ratingDiff <= 0.5) {
      score += 1
    }

    return {
      ...char,
      relevanceScore: score
    }
  })

  // 按相关性分数排序，然后按评分排序
  relatedCharacters.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore
    }
    return b.stats.rating - a.stats.rating
  })

  // 返回前limit个相关角色
  const result = relatedCharacters.slice(0, limit).map(char => {
    const { relevanceScore, ...character } = char
    return character
  })

  return {
    characters: result
  }
}) 