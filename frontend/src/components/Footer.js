import {
    FaGithub,
    FaLinkedin,
    FaEnvelope,
    FaHtml5,
    FaCss3Alt,
    FaYoutube,
    FaJs,
    FaBootstrap,
} from 'react-icons/fa';
import { DiJqueryLogo } from "react-icons/di";

const Footer = () => {
    return (
        <footer className="w-full bg-white/90 dark:bg-gray-950/80 backdrop-blur border-t border-gray-200 dark:border-gray-800 py-8 px-6 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Brand */}
                <div className="text-center md:text-left space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">DevSandbox</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Live HTML, CSS & JS playground.
                    </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-base font-medium">Built For Developers</span>
                    <div className="flex flex-wrap justify-center gap-4 text-2xl">
                        <FaHtml5 className="text-orange-500 hover:scale-110 transition-transform" title="HTML5" />
                        <FaCss3Alt className="text-blue-500 hover:scale-110 transition-transform" title="CSS3" />
                        <FaJs className="text-yellow-400 hover:scale-110 transition-transform" title="JavaScript" />
                        <FaBootstrap className="text-indigo-500 hover:scale-110 transition-transform" title="Bootstrap" />
                        <DiJqueryLogo className="text-blue-500 hover:scale-110 transition-transform" title="jQuery" />
                    </div>
                </div>

                {/* Socials */}
                <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                    <div className="flex gap-5 text-xl">
                        {[
                            {
                                href: "https://github.com/parivaibhav",
                                icon: <FaGithub />,
                                hover: "hover:text-black dark:hover:text-white",
                            },
                            {
                                href: "https://linkedin.com/in/vaibhav-pari-399a88230",
                                icon: <FaLinkedin />,
                                hover: "hover:text-blue-600 dark:hover:text-blue-400",
                            },
                            {
                                href: "mailto:parivaibhav055@gmail.com",
                                icon: <FaEnvelope />,
                                hover: "hover:text-lime-500 dark:hover:text-lime-400",
                            },
                            {
                                href: "https://youtube.com/@parivaibhav055",
                                icon: <FaYoutube />,
                                hover: "hover:text-red-600 dark:hover:text-red-400",
                            },
                        ].map(({ href, icon, hover }, index) => (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:rotate-2 hover:scale-110 ${hover}`}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Made by <span className="font-semibold text-blue-500">Vaibhav Pari</span>
                    </p>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                &copy; {new Date().getFullYear()} DevSandbox. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
    