'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface SkillCategory {
  category: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    category: 'AI & Machine Learning',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Deep Learning'],
  },
  {
    category: 'Computer Vision',
    skills: ['OpenCV', 'Image Processing', 'Object Detection', 'Image Segmentation', 'Feature Extraction'],
  },
  {
    category: 'Programming Languages',
    skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'MATLAB'],
  },
  {
    category: 'Tools & Frameworks',
    skills: ['Git', 'Docker', 'Linux', 'Jupyter', 'VS Code'],
  },
  {
    category: 'Project Management',
    skills: ['Agile', 'Scrum', 'Project Planning', 'Team Coordination'],
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          My <span className="text-primary-500">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-surface2 rounded-lg p-6 border border-dark-surface2 hover:border-primary-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-primary-500">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                    className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

