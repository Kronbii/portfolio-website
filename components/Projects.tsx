'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiExternalLink, FiX, FiImage } from 'react-icons/fi'
import Image from 'next/image'

interface Project {
  title: string
  description: string
  longDescription?: string
  githubUrl: string
  demoUrl?: string
  technologies: string[]
  image?: string
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'Project 1',
    description: '[Placeholder: Brief description of your project]',
    longDescription: '[Placeholder: Detailed description of your project. What problem does it solve? What technologies did you use? What were the key features and challenges?]',
    githubUrl: 'https://github.com/yourusername/project1',
    technologies: ['Python', 'TensorFlow', 'OpenCV'],
    image: '/projects/project1.jpg',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    title: 'Project 2',
    description: '[Placeholder: Brief description of your project]',
    longDescription: '[Placeholder: Detailed description of your project. What problem does it solve? What technologies did you use? What were the key features and challenges?]',
    githubUrl: 'https://github.com/yourusername/project2',
    technologies: ['Python', 'PyTorch', 'Computer Vision'],
    image: '/projects/project2.jpg',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    title: 'Project 3',
    description: '[Placeholder: Brief description of your project]',
    longDescription: '[Placeholder: Detailed description of your project. What problem does it solve? What technologies did you use? What were the key features and challenges?]',
    githubUrl: 'https://github.com/yourusername/project3',
    technologies: ['Python', 'Deep Learning', 'AI'],
    image: '/projects/project3.jpg',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

  const openProject = (index: number) => {
    setSelectedProject(index)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <>
      <section
        id="projects"
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            My <span className="text-primary-500">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-dark-text2 mb-12 text-lg max-w-2xl mx-auto"
          >
            Click on any project to explore it in detail
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-dark-surface2 rounded-lg overflow-hidden hover:bg-dark-surface transition-all duration-300 border border-dark-surface2 hover:border-primary-500/50 group cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => openProject(index)}
              >
                <div className="relative w-full h-48 overflow-hidden bg-dark-surface">
                  {project.image && !imageErrors[index] ? (
                    <>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-surface2 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                      <FiImage size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-primary-500 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-dark-text2 mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="text-primary-500 text-sm font-semibold group-hover:text-primary-400 transition-colors">
                    View Details →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={closeProject}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-dark-surface rounded-lg border border-primary-500/30 shadow-2xl max-w-5xl mx-auto">
                {projects[selectedProject] && (
                  <>
                    {/* Modal Header */}
                    <div className="relative">
                      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-dark-surface2">
                        {projects[selectedProject].image && !imageErrors[selectedProject] ? (
                          <>
                            <Image
                              src={projects[selectedProject].image}
                              alt={projects[selectedProject].title}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(selectedProject)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                            <FiImage size={64} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={closeProject}
                        className="absolute top-4 right-4 bg-dark-surface/90 hover:bg-dark-surface text-dark-text2 hover:text-primary-500 rounded-full p-2 transition-colors z-10"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 md:p-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-500">
                        {projects[selectedProject].title}
                      </h2>
                      
                      <p className="text-lg text-dark-text2 mb-6 leading-relaxed">
                        {projects[selectedProject].longDescription || projects[selectedProject].description}
                      </p>

                      {projects[selectedProject].features && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-3 text-dark-text">Key Features</h3>
                          <ul className="space-y-2">
                            {projects[selectedProject].features!.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-dark-text2">
                                <span className="text-primary-500 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-3 text-dark-text">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {projects[selectedProject].technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <motion.a
                          href={projects[selectedProject].githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiGithub size={20} />
                          <span>View on GitHub</span>
                        </motion.a>
                        {projects[selectedProject].demoUrl && (
                          <motion.a
                            href={projects[selectedProject].demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-dark-surface2 hover:bg-dark-surface text-dark-text border border-primary-500/50 hover:border-primary-500 rounded-lg transition-colors font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiExternalLink size={20} />
                            <span>Live Demo</span>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

