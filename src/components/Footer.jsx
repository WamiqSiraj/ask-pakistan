// src/components/Footer.jsx
import React from 'react';
import { Shield, PhoneCall, Mail, MapPin, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: About Portal */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-md text-base">
              GOV
            </div>
            <span className="font-bold text-white text-base tracking-wide">National Portal</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            The official digital gateway providing unified citizen access to national public services, identity management, and government announcements.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Shield size={14} />
            <span>Secure 256-Bit SSL Encrypted Portal</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Citizen Services Directory</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Verify Documents & Licenses</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Public Press Releases & News</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Ministry Departments</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Emergency Helplines</a></li>
          </ul>
        </div>

        {/* Col 3: Legal & Accessibility */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-2">
            Policies & Legal
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Cybersecurity Directives</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Digital Governance Framework</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Right to Information (RTI)</a></li>
          </ul>
        </div>

        {/* Col 4: Official Contact */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm mb-4 border-b border-slate-800 pb-2">
            Helpline & Support
          </h4>
          <div className="flex items-center gap-2 text-xs">
            <PhoneCall size={14} className="text-blue-400" />
            <span>Toll-Free: 111-000-GOV (468)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Mail size={14} className="text-blue-400" />
            <span>support@portal.gov.pk</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <MapPin size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <span>National Information Technology Board, Secretariat, Islamabad</span>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
        <p className="text-slate-500 text-center sm:text-left">
          © {new Date().getFullYear()} Government Information Portal. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1"><Globe size={12} /> Official Portal</span>
          <span>•</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}