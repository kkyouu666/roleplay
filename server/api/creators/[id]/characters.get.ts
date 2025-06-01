import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const creatorId = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!creatorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Creator ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))

  // 筛选属于该创建者的角色
  let creatorCharacters = charactersData.filter(char => char.creator.id === creatorId)

  // 排除当前角色（如果指定了）
  const excludeId = query.exclude as string
  if (excludeId) {
    creatorCharacters = creatorCharacters.filter(char => char.id !== excludeId)
  }

  // 限制返回数量
  const limit = parseInt(query.limit as string) || 10
  if (limit > 0) {
    creatorCharacters = creatorCharacters.slice(0, limit)
  }

  // 按评分排序
  creatorCharacters.sort((a, b) => b.stats.rating - a.stats.rating)

  return {
    characters: creatorCharacters,
    total: creatorCharacters.length
  }
}) 