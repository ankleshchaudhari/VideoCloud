"use client";

import { ArrowLeft, CheckCircle2, MonitorPlay, Settings, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

export default function HighQualityPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Link
                        href="/"
                        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>

                <motion.div
                    className="glass p-8 md:p-12 rounded-3xl border !border-gray-300 dark:!border-gray-700/50 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <motion.div
                            className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <MonitorPlay className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold">Why High Quality?</h1>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        We believe that every pixel counts. Our platform is engineered to preserve the integrity of your visual content, ensuring that what you upload is exactly what your audience sees.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            className="space-y-6"
                            variants={itemVariants}
                        >
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-indigo-500" />
                                Advanced Compression
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our smart compression algorithms reduce file size without compromising visual fidelity, ensuring fast load times and crisp details.
                            </p>
                        </motion.div>

                        <motion.div
                            className="space-y-6"
                            variants={itemVariants}
                        >
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-indigo-500" />
                                Adaptive Streaming
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Content automatically adjusts to the viewer's device and connection speed, delivering the best possible experience from 4K desktops to mobile phones.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700"
                        variants={itemVariants}
                    >
                        <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['4K Ultra HD', '1080p Full HD', 'HDR10+', '60 FPS'].map((item, index) => (
                                <motion.li
                                    key={item}
                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
