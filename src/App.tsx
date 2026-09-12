import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { MemberPortal } from './components/MemberPortal';
import { RegistrationFormData } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'portal' | 'register'>('login');
  const [activeMemberIdentifier, setActiveMemberIdentifier] = useState<string>('1MS22CS042');
  const [registeredUser, setRegisteredUser] = useState<RegistrationFormData | null>(null);
  const [loginSessionCount, setLoginSessionCount] = useState<number>(0);

  const handleLogin = (identifier: string) => {
    try {
      sessionStorage.removeItem('ascent_portal_nav');
    } catch {}
    setActiveMemberIdentifier(identifier || '1MS22CS042');
    setLoginSessionCount((c) => c + 1);
    setCurrentView('portal');
  };

  const handleRegistrationSuccess = (data: RegistrationFormData) => {
    try {
      sessionStorage.removeItem('ascent_portal_nav');
    } catch {}
    setRegisteredUser(data);
    setActiveMemberIdentifier(data.usn);
    setLoginSessionCount((c) => c + 1);
    setCurrentView('portal');
  };

  return (
    <div className="min-h-screen bg-ambient-glow text-[#F3F4F6] selection:bg-[#D4A373] selection:text-[#000000]">
      {/* Main Content Area with Page Transitions */}
      <main
        className={
          currentView === 'portal'
            ? 'w-full min-h-screen'
            : currentView === 'login'
            ? 'w-full min-h-screen flex items-center justify-center p-3 sm:p-6'
            : 'w-full min-h-screen flex items-center justify-center p-4 sm:p-8'
        }
      >
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <LoginPage
                onLoginClick={handleLogin}
                onNavigateToRegistration={() => setCurrentView('register')}
              />
            </motion.div>
          )}

          {currentView === 'portal' && (
            <motion.div
              key={`portal-view-${loginSessionCount}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full"
            >
              <MemberPortal
                memberIdentifier={activeMemberIdentifier}
                registeredUser={registeredUser}
                initialNav="home"
                onLogout={() => setCurrentView('login')}
                onNavigateToRegistration={() => setCurrentView('register')}
              />
            </motion.div>
          )}

          {currentView === 'register' && (
            <motion.div
              key="registration-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full"
            >
              <RegistrationPage
                onBackToLogin={() => setCurrentView('login')}
                onGoToPortal={handleRegistrationSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
