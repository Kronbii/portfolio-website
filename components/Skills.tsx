'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { getSectionWidthStyle, getSectionHeaderStyle } from '@/lib/utils'

interface SkillCategory {
  category: string
  tagline: string
  skills: string[]
  confidence: number
}

const skillCategories: SkillCategory[] = [
  {
    category: 'Vision & Perception Systems',
    tagline: 'Detection, tracking, calibration, SLAM, synthetic data.',
    skills: ['OpenCV', 'TensorRT', 'YOLO/Detectron', 'Image calibration', 'Stereo depth'],
    confidence: 95,
  },
  {
    category: 'AI & ML Engineering',
    tagline: 'Model design, experimentation, evaluation, ML Ops.',
    skills: ['PyTorch', 'TensorFlow', 'Lightning', 'ONNX', 'MLflow'],
    confidence: 92,
  },
  {
    category: 'Edge & Embedded Intelligence',
    tagline: 'Deploying models on Jetson, ESP32, Arduino, custom mechatronics.',
    skills: ['Jetson Nano/Orin', 'C++', 'Python', 'ROS', 'ESP32/Arduino'],
    confidence: 90,
  },
  {
    category: 'Product Leadership & Collaboration Tools',
    tagline: 'Google PM-certified planning, stakeholder alignment, agile execution.',
    skills: ['Agile & Scrum', 'Roadmapping', 'Git / GitHub', 'Docker', 'Linux'],
    confidence: 91,
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-dark-surface border-l border-r border-b border-[#212121]/30 dark:border-white/20 mx-auto"
      style={getSectionWidthStyle()}
    >
      <div className="w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`${getSectionHeaderStyle().className} mb-8 text-center`}
          style={getSectionHeaderStyle().style}
        >
          Toolset on speed dial
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface2/80 p-5 backdrop-blur shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#252525]">
                  {category.category}
                </h3>
                <span className="text-sm text-[#252525]">{category.confidence}%</span>
              </div>
              <p className="mt-1 text-sm text-[#252525]">{category.tagline}</p>
              <div className="mt-3 h-1.5 rounded-full bg-light-border/50 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${category.confidence}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 * index + skillIndex * 0.04 }}
                    className="px-3 py-1 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 text-xs text-[#252525]"
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
