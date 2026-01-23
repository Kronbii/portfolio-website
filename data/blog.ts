import blogData from './blog.json'
import { BlogArticle } from './types'

export const blogArticles: BlogArticle[] = blogData as BlogArticle[]
export type { BlogArticle }

// Get latest articles sorted by published date
export const getLatestArticles = (count: number = 3): BlogArticle[] => {
  return [...blogArticles]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count)
}
