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
import Login from "./Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

export default function Pages() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Dashboard" element={
          <ProtectedRoute>
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/WorkOrders" element={
          <ProtectedRoute>
            <Layout currentPageName="WorkOrders">
              <WorkOrders />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/FieldTechnicians" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout currentPageName="FieldTechnicians">
              <FieldTechnicians />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/HRManagement" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout currentPageName="HRManagement">
              <HRManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Inspectors" element={
          <ProtectedRoute>
            <Layout currentPageName="Inspectors">
              <Inspectors />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Samples" element={
          <ProtectedRoute>
            <Layout currentPageName="Samples">
              <Samples />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/SampleCollection" element={
          <ProtectedRoute>
            <Layout currentPageName="SampleCollection">
              <SampleCollection />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ChainOfCustody" element={
          <ProtectedRoute>
            <Layout currentPageName="ChainOfCustody">
              <ChainOfCustody />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/LabQueue" element={
          <ProtectedRoute>
            <Layout currentPageName="LabQueue">
              <LabQueue />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Testing" element={
          <ProtectedRoute>
            <Layout currentPageName="Testing">
              <Testing />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/QCReview" element={
          <ProtectedRoute>
            <Layout currentPageName="QCReview">
              <QCReview />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/EngineeringReview" element={
          <ProtectedRoute allowedRoles={['admin', 'engineer']}>
            <Layout currentPageName="EngineeringReview">
              <EngineeringReview />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Projects" element={
          <ProtectedRoute>
            <Layout currentPageName="Projects">
              <Projects />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Clients" element={
          <ProtectedRoute>
            <Layout currentPageName="Clients">
              <Clients />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Reports" element={
          <ProtectedRoute>
            <Layout currentPageName="Reports">
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Invoicing" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout currentPageName="Invoicing">
              <Invoicing />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/Settings" element={
          <ProtectedRoute>
            <Layout currentPageName="Settings">
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/TechnicianDashboard" element={
          <ProtectedRoute allowedRoles={['field_technician']}>
            <Layout currentPageName="TechnicianDashboard">
              <TechnicianDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/FieldTechApp" element={
          <ProtectedRoute allowedRoles={['field_technician']}>
            <FieldTechApp />
          </ProtectedRoute>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}