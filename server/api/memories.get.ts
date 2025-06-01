import memoriesData from '~/server/mock/memories.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 6
  const ranking = query.ranking as string || 'default'
  const gender = query.gender as string || 'all'

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

  let filteredMemories = [...memoriesData]

  // 性别过滤暂时跳过，因为memories数据中的character对象结构简化了
  // 如果需要性别过滤，需要扩展memories数据结构或与characters数据关联

  // 排序
  switch (ranking) {
    case 'rating':
      // 根据点赞数排序
      filteredMemories.sort((a, b) => b.stats.likes - a.stats.likes)
      break
    case 'newest':
      filteredMemories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      break
    case 'comments':
      filteredMemories.sort((a, b) => b.stats.comments - a.stats.comments)
      break
    default:
      // 默认按时间倒序
      filteredMemories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      break
  }

  // 分页
  const total = filteredMemories.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const memories = filteredMemories.slice(start, end)
  const hasMore = end < total

  return {
    memories,
    pagination: {
      page,
      pageSize,
      total,
      hasMore
    }
  }
}) 