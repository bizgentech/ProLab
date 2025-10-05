import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import WorkOrders from "./WorkOrders";

import FieldTechnicians from "./FieldTechnicians";

import HRManagement from "./HRManagement";

import Inspectors from "./Inspectors";

import Samples from "./Samples";

import SampleCollection from "./SampleCollection";

import ChainOfCustody from "./ChainOfCustody";

import LabQueue from "./LabQueue";

import Testing from "./Testing";

import QCReview from "./QCReview";

import EngineeringReview from "./EngineeringReview";

import Projects from "./Projects";

import Clients from "./Clients";

import Reports from "./Reports";

import Invoicing from "./Invoicing";

import Settings from "./Settings";

import TechnicianDashboard from "./TechnicianDashboard";

import FieldTechApp from "./FieldTechApp";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    WorkOrders: WorkOrders,
    
    FieldTechnicians: FieldTechnicians,
    
    HRManagement: HRManagement,
    
    Inspectors: Inspectors,
    
    Samples: Samples,
    
    SampleCollection: SampleCollection,
    
    ChainOfCustody: ChainOfCustody,
    
    LabQueue: LabQueue,
    
    Testing: Testing,
    
    QCReview: QCReview,
    
    EngineeringReview: EngineeringReview,
    
    Projects: Projects,
    
    Clients: Clients,
    
    Reports: Reports,
    
    Invoicing: Invoicing,
    
    Settings: Settings,
    
    TechnicianDashboard: TechnicianDashboard,
    
    FieldTechApp: FieldTechApp,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/WorkOrders" element={<WorkOrders />} />
                
                <Route path="/FieldTechnicians" element={<FieldTechnicians />} />
                
                <Route path="/HRManagement" element={<HRManagement />} />
                
                <Route path="/Inspectors" element={<Inspectors />} />
                
                <Route path="/Samples" element={<Samples />} />
                
                <Route path="/SampleCollection" element={<SampleCollection />} />
                
                <Route path="/ChainOfCustody" element={<ChainOfCustody />} />
                
                <Route path="/LabQueue" element={<LabQueue />} />
                
                <Route path="/Testing" element={<Testing />} />
                
                <Route path="/QCReview" element={<QCReview />} />
                
                <Route path="/EngineeringReview" element={<EngineeringReview />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Invoicing" element={<Invoicing />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/TechnicianDashboard" element={<TechnicianDashboard />} />
                
                <Route path="/FieldTechApp" element={<FieldTechApp />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}