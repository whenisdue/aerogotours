import React from 'react';
import { createRoot } from 'react-dom/client';
import { TripPlanner } from './TripPlanner.tsx';
import './planner.css';

const el = document.getElementById('root');
if (!el) throw new Error('Missing application root');
createRoot(el).render(
  <React.StrictMode>
    <TripPlanner />
  </React.StrictMode>
);
