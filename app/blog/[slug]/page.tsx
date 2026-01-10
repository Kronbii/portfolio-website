import { FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { getArticleBySlug, blogArticles } from '@/data/blog'
import { notFound } from 'next/navigation'
import BlogArticleContent from '@/components/blog/BlogArticleContent'

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Back Button */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border/50 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#blog"
            className="inline-flex items-center space-x-2 text-light-text2 dark:text-dark-text2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      <BlogArticleContent article={article} />
    </div>
  )
}

// Generate static params for all blog articles
export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }))
}
