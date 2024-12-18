'use client'


import "~/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { useEffect } from 'react';
import { B24Frame } from '@bitrix24/b24jssdk';
import { BX24Provider } from "./_lib/context/bx24";
import { Toaster } from "~/components/ui/sonner";

const queryClient = new QueryClient()

// export const metadata: Metadata = {
//   title: "Create T3 App",
//   description: "Generated by create-t3-app",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  
  return (

    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <BX24Provider>
            {children}

          </BX24Provider>
        </QueryClientProvider>

      </body>

    </html>
  );
}
