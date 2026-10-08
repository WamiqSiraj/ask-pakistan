// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Menu, X, Globe, Search, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
            {/* Top Notification / Emergency Bar */}
            {/* <div className="bg-blue-700 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
                <ShieldAlert size={14} className="text-yellow-300" />
                <span>Official Citizen Portal — Access Government Services Online</span>
            </div> */}

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl tracking-wider">
                            CIVIC
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none tracking-tight">Citizen Services</h1>
                            {/* <p className="text-xs text-slate-400 mt-0.5">Citizen Services</p> */}
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
                            <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Services</Link>
                            <Link to="/news" className="text-slate-300 hover:text-white transition-colors">News & Alerts</Link>
                        </div>
                        {/* <a href="#" className="text-slate-300 hover:text-white transition-colors">Departments</a>
                        <a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Us</a> */}
                    </div>

                    {/* Right Action Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-slate-300 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Globe size={14} />
                            <span>English</span>
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-300 hover:text-white p-2 rounded-md focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
                        <a href="#" className="block px-3 py-2 text-base font-medium text-blue-400 bg-slate-800/50 rounded-md">Home</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-md">Services</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-md">News & Alerts</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-md">Departments</a>
                        <a href="#" className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-md">Contact Us</a>
                        <div className="pt-2 flex items-center gap-3">
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded-lg font-medium">
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}