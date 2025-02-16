'use client'; // This marks it as a Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface SessionWrapperProps {
  children: React.ReactNode;
  session?: any; // Add the session prop
}

export default function SessionWrapper({ children, session }: SessionWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}