'use client'

import { motion } from 'framer-motion'
import { FiServer, FiPlay } from 'react-icons/fi'
import { projects } from '@/components/Projects'
import ProjectPageTemplate from '@/components/projects/ProjectPageTemplate'

export default function SmartLearningTablePage() {
  const project = projects.find((p) => p.slug === 'smart-learning-table')!

  return (
    <ProjectPageTemplate project={project}>
      {/* Demo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 p-6 md:p-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FiPlay className="text-primary-500" size={24} />
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            Interactive Demo
          </h2>
        </div>
        <p className="text-light-text2 dark:text-dark-text2 mb-6">
          Experience the Smart Learning Table in action. Control the desk and see posture tracking in real-time.
        </p>
        <div className="bg-light-surface2 dark:bg-dark-surface2 rounded-2xl p-8 border border-light-border/30 dark:border-white/5">
          <div className="text-center text-light-text2 dark:text-dark-text2">
            <p className="mb-4">Demo coming soon...</p>
            <p className="text-sm">
              This section will contain an interactive demo of the Smart Learning Table system
            </p>
          </div>
        </div>
      </motion.div>

      {/* Backend Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 p-6 md:p-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FiServer className="text-primary-500" size={24} />
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            Backend & API
          </h2>
        </div>
        <p className="text-light-text2 dark:text-dark-text2 mb-6">
          Explore the IoT backend, MQTT communication, and web dashboard APIs for the Smart Learning Table.
        </p>
        <div className="bg-light-surface2 dark:bg-dark-surface2 rounded-2xl p-8 border border-light-border/30 dark:border-white/5">
          <div className="text-center text-light-text2 dark:text-dark-text2">
            <p className="mb-4">Backend features coming soon...</p>
            <p className="text-sm">
              This section will showcase MQTT endpoints, ESP32 firmware, and web dashboard APIs
            </p>
          </div>
        </div>
      </motion.div>
    </ProjectPageTemplate>
  )
}

