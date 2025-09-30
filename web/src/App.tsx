import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ContextMap } from './pages/ContextMap';
import { ContextLayout } from './pages/ContextLayout';
import { ContextOverview } from './pages/context/ContextOverview';
import { EventStormingView } from './pages/context/EventStormingView';
import { AggregatesView } from './pages/context/AggregatesView';
import { AggregateDetail } from './pages/context/AggregateDetail';
import { CommandsEventsView } from './pages/context/CommandsEventsView';
import { BusinessRulesView } from './pages/context/BusinessRulesView';
import { IntegrationsView } from './pages/context/IntegrationsView';
import { WorkflowsView } from './pages/context/WorkflowsView';
import { NewRequirement } from './pages/requirement/NewRequirement';

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          {/* Global routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/context-map" element={<ContextMap />} />
          <Route path="/requirement/new" element={<NewRequirement />} />

          {/* Context-scoped routes */}
          <Route path="/context/:contextId" element={<ContextLayout />}>
            <Route index element={<ContextOverview />} />
            <Route path="event-storming" element={<EventStormingView />} />
            <Route path="aggregates" element={<AggregatesView />} />
            <Route path="aggregates/:aggregateId" element={<AggregateDetail />} />
            <Route path="commands-events" element={<CommandsEventsView />} />
            <Route path="business-rules" element={<BusinessRulesView />} />
            <Route path="integrations" element={<IntegrationsView />} />
            <Route path="workflows" element={<WorkflowsView />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;