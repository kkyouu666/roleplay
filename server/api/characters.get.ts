import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 18
  const category = query.category as string || 'all'
  const tags = query.tags ? (query.tags as string).split(',') : []
  const search = query.search as string || ''
  const ranking = query.ranking as string || 'default'
  const gender = query.gender as string || 'all'

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

  let filteredCharacters = [...charactersData]

  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredCharacters = filteredCharacters.filter(char =>
      char.name.toLowerCase().includes(searchLower) ||
      char.description.toLowerCase().includes(searchLower)
    )
  }

  // 分类过滤
  if (category !== 'all') {
    filteredCharacters = filteredCharacters.filter(char => char.category === category)
  }

  // 标签过滤
  if (tags.length > 0) {
    filteredCharacters = filteredCharacters.filter(char =>
      tags.some(tag => char.tags.includes(tag))
    )
  }

  // 性别过滤
  if (gender !== 'all') {
    filteredCharacters = filteredCharacters.filter(char =>
      char.tags.includes(gender)
    )
  }

  // 排序
  switch (ranking) {
    case 'rating':
      filteredCharacters.sort((a, b) => b.stats.rating - a.stats.rating)
      break
    case 'chats':
      filteredCharacters.sort((a, b) => b.stats.chats - a.stats.chats)
      break
    case 'newest':
      filteredCharacters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      break
  }

  // 分页
  const total = filteredCharacters.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const characters = filteredCharacters.slice(start, end)
  const hasMore = end < total

  return {
    characters,
    pagination: {
      page,
      pageSize,
      total,
      hasMore
    }
  }
}) 