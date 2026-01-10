import Link from 'next/link'
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FiBookOpen size={64} className="mx-auto text-primary-500/50 mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-light-text dark:text-dark-text">
            Article Not Found
          </h1>
          <p className="text-light-text2 dark:text-dark-text2 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-primary-500/50 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium transition-all duration-300"
        >
          <FiArrowLeft size={20} />
          <span>Back to Blog</span>
        </Link>
      </div>
    </div>
  )
}
