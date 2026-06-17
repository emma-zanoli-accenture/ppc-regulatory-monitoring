import { Navigate, Route, Routes } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import { DemoStoreProvider } from './store/DemoStore';
import { AppLayout } from './layout/AppLayout';
import NotFound from './pages/NotFound';
import StyleGuide from './pages/StyleGuide';
// Legal / Compliance pages
import LegalDashboard from './pages/legal/LegalDashboard';
import ImpactOverview from './pages/legal/ImpactOverview';
import LegalRegChangeDetail from './pages/legal/LegalRegChangeDetail';
import CommunicationFlow from './pages/legal/CommunicationFlow';
import Monitoring from './pages/legal/Monitoring';
import SupportRequests from './pages/legal/SupportRequests';
import Audit from './pages/legal/Audit';
import AiTools from './pages/legal/AiTools';
// Business Unit pages
import BuDashboard from './pages/bu/BuDashboard';
import BuRegChangeDetail from './pages/bu/BuRegChangeDetail';
import BuTicket from './pages/bu/BuTicket';

export default function App() {
  return (
    <RoleProvider>
      <DemoStoreProvider>
        <ToastProvider>
          <Routes>
        {/* Default to the Legal/Compliance dashboard. */}
        <Route path="/" element={<Navigate to="/legal/dashboard" replace />} />

        {/* App shell (top bar + role-aware sidebar). */}
        <Route element={<AppLayout />}>
          {/* Legal / Compliance */}
          <Route path="/legal/dashboard" element={<LegalDashboard />} />
          <Route path="/legal/impact-overview" element={<ImpactOverview />} />
          <Route path="/legal/regulatory-change/:id" element={<LegalRegChangeDetail />} />
          <Route
            path="/legal/regulatory-change/:id/communicate"
            element={<CommunicationFlow />}
          />
          <Route path="/legal/monitoring" element={<Monitoring />} />
          <Route path="/legal/support-requests" element={<SupportRequests />} />
          <Route path="/legal/audit" element={<Audit />} />
          <Route path="/legal/ai-tools" element={<AiTools />} />

          {/* Business Unit */}
          <Route path="/bu/dashboard" element={<BuDashboard />} />
          <Route path="/bu/regulatory-change/:id" element={<BuRegChangeDetail />} />
          <Route path="/bu/tickets/:id" element={<BuTicket />} />
        </Route>

        {/* Temporary, unlinked component review page. */}
        <Route path="/styleguide" element={<StyleGuide />} />

        <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </DemoStoreProvider>
    </RoleProvider>
  );
}
