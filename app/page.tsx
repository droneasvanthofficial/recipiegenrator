"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, Utensils, Leaf, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-200/20 rounded-full blur-3xl dark:bg-green-900/10" />

      <main className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Smart AI Kitchen Assistant</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-tight"
          >
            Cook Smarter, <br />
            <span className="text-gradient">Not Harder.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Turn your leftover ingredients into culinary masterpieces. Our AI understands what's in your fridge and crafts the perfect recipe just for you.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link href="/generate">
              <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group">
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-2">
              How it works
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <CameraIcon className="w-6 h-6" />,
                title: "Visual Recognition",
                description: "Snap a photo of your fridge and let our AI identify everything instantly.",
                color: "bg-blue-500/10 text-blue-600"
              },
              {
                icon: <ChefHat className="w-6 h-6" />,
                title: "Chef-Quality Recipes",
                description: "Get personalized, easy-to-follow instructions tailored to your skill level.",
                color: "bg-primary/10 text-primary"
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Eco-Friendly",
                description: "Reduce food waste and discover sustainable ways to use every ingredient.",
                color: "bg-green-500/10 text-green-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl text-left hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center text-muted-foreground border-t border-border/50">
        <p>© {new Date().getFullYear()} Culinara AI. Freshly made for your kitchen.</p>
      </footer>
    </div>
  )
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
