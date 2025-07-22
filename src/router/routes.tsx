import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';

// Lazy load pages for better performance
const JsonFormatterPage = lazy(() => import('@/pages/JsonFormatterPage'));
const Base64Page = lazy(() => import('@/pages/Base64Page'));
const JwtDecoderPage = lazy(() => import('@/pages/JwtDecoderPage'));
const UrlToolsPage = lazy(() => import('@/pages/UrlToolsPage'));
const HashGeneratorPage = lazy(() => import('@/pages/HashGeneratorPage'));
const TimestampPage = lazy(() => import('@/pages/TimestampPage'));
const RegexTesterPage = lazy(() => import('@/pages/RegexTesterPage'));
const DiffViewerPage = lazy(() => import('@/pages/DiffViewerPage'));
const ColorToolsPage = lazy(() => import('@/pages/ColorToolsPage'));
const GeneratorsPage = lazy(() => import('@/pages/GeneratorsPage'));
const OfflinePage = lazy(() => import('@/pages/OfflinePage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/json-formatter" replace />,
      },
      {
        path: 'json-formatter',
        element: <JsonFormatterPage />,
      },
      {
        path: 'base64',
        element: <Base64Page />,
      },
      {
        path: 'jwt-decoder',
        element: <JwtDecoderPage />,
      },
      {
        path: 'url-tools',
        element: <UrlToolsPage />,
      },
      {
        path: 'hash-generator',
        element: <HashGeneratorPage />,
      },
      {
        path: 'timestamp',
        element: <TimestampPage />,
      },
      {
        path: 'regex-tester',
        element: <RegexTesterPage />,
      },
      {
        path: 'diff-viewer',
        element: <DiffViewerPage />,
      },
      {
        path: 'color-tools',
        element: <ColorToolsPage />,
      },
      {
        path: 'generators',
        element: <GeneratorsPage />,
      },
      {
        path: 'offline',
        element: <OfflinePage />,
      },
    ],
  },
];