import charactersData from '~/server/mock/characters.json'
import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  const user = usersData.find(u => u.id === id)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // 检查隐私设置
  if (!user.settings.isPublicLikes) {
    return {
      characters: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        hasMore: false
      },
      isPrivate: true
    }
  }

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10

  // 获取用户喜欢的角色
  const likedCharacterIds = user.likedCharacters || []
  const likedCharacters = charactersData.filter(char =>
    likedCharacterIds.includes(char.id)
  )

  // 分页
  const total = likedCharacters.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const characters = likedCharacters.slice(start, end)

  // 转换为CharacterCard格式
  const characterCards = characters.map(char => ({
    id: char.id,
    name: char.name,
    avatar: char.avatar,
    description: char.description,
    category: char.category,
    tags: char.tags,
    creator: char.creator,
    stats: char.stats,
    createdAt: char.createdAt,
    updatedAt: char.updatedAt,
    nsfw: char.nsfw
  }))

  return {
    characters: characterCards,
    pagination: {
      page,
      pageSize,
      total,
      hasMore: end < total
    },
    isPrivate: false
  }
}) 