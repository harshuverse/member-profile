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

  const handleLogin = (identifier: string) => {
    setActiveMemberIdentifier(identifier || '1MS22CS042');
    setCurrentView('portal');
  };

  const handleRegistrationSuccess = (data: RegistrationFormData) => {
    setRegisteredUser(data);
    setActiveMemberIdentifier(data.usn);
    setCurrentView('portal');
  };

  return (
    <div className="min-h-screen bg-ambient-glow text-[#F3F4F6] flex flex-col justify-between selection:bg-[#D4A373] selection:text-[#000000]">
      {/* Main Content Area with Page Transitions */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full"
            >
              <LoginPage
                onLoginClick={handleLogin}
                onNavigateToRegistration={() => setCurrentView('register')}
              />
            </motion.div>
          )}

          {currentView === 'portal' && (
            <motion.div
              key="portal-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full"
            >
              <MemberPortal
                memberIdentifier={activeMemberIdentifier}
                registeredUser={registeredUser}
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
